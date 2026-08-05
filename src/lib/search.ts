export type GlobalSearchItem = {
  id: string;
  kind: "harness" | "gui" | "page";
  title: string;
  description: string;
  href: string;
  keywords: string[];
  imageSrc?: string;
  meta: string;
};

/**
 * Tuple form used only at the Server-to-Client boundary. Repeated object keys
 * add up because the global search payload is present on every static page.
 */
export type SerializedGlobalSearchItem = readonly [
  id: string,
  kind: GlobalSearchItem["kind"],
  title: string,
  description: string,
  href: string,
  keywords: string[],
  imageSrc: string | null,
  meta: string,
];

export function serializeGlobalSearchItem(item: GlobalSearchItem): SerializedGlobalSearchItem {
  return [
    item.id,
    item.kind,
    item.title,
    item.description,
    item.href,
    item.keywords,
    item.imageSrc ?? null,
    item.meta,
  ];
}

export function deserializeGlobalSearchItem([
  id,
  kind,
  title,
  description,
  href,
  keywords,
  imageSrc,
  meta,
]: SerializedGlobalSearchItem): GlobalSearchItem {
  const item = { id, kind, title, description, href, keywords, meta };
  return imageSrc === null ? item : { ...item, imageSrc };
}

/**
 * A query token is scored against one field at a time. Lower is better, and
 * every tier is a documented place the token was found, so the resulting order
 * stays inspectable rather than tuned. Catalog keywords are curated terms, so
 * they outrank prose in `description`; the product name outranks both.
 */
const matchTier = {
  titleWord: 0,
  titleWordPrefix: 1,
  keyword: 2,
  keywordWord: 3,
  keywordWordPrefix: 4,
  descriptionWord: 5,
  descriptionWordPrefix: 6,
} as const;

/**
 * Applied to the query as a whole rather than token by token, so that typing a
 * full product name keeps that product on top no matter how its other fields
 * happen to score.
 */
const phraseTier = {
  exactTitle: 0,
  titlePrefix: 1,
  none: 2,
} as const;

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function compact(value: string) {
  return normalize(value).replace(/[^a-z0-9]+/g, "");
}

/**
 * Splits on separators and on camel-case humps so that product names written as
 * one word stay reachable by their parts: `ForgeCode` and `claude-code` both
 * yield `code`. Matching whole words is what keeps a two-letter query from
 * pulling in every record that merely contains those letters.
 */
function tokenize(value: string) {
  return normalize(value.replace(/([a-z0-9])([A-Z])/g, "$1 $2"))
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

const compactSearchStopWords = new Set([
  "a",
  "an",
  "and",
  "as",
  "at",
  "by",
  "for",
  "from",
  "in",
  "into",
  "of",
  "on",
  "or",
  "the",
  "to",
  "with",
]);

/**
 * Keeps every searchable word while removing repeated prose from payloads sent
 * across a Server-to-Client boundary.
 */
export function compactSearchTerms(values: readonly string[]) {
  const seen = new Set<string>();
  return values
    .flatMap(tokenize)
    .filter((term) => {
      if (compactSearchStopWords.has(term) || seen.has(term)) return false;
      seen.add(term);
      return true;
    })
    .join(" ");
}

type IndexedField = {
  values: readonly string[];
  words: readonly string[];
};

/**
 * Each value contributes its split words plus its separator-free form, so a
 * name typed as one string (`t3code`, `forgecode`) reaches the record the same
 * way its individual words do.
 */
function indexField(values: readonly string[]): IndexedField {
  return {
    values: values.map(normalize),
    words: values.flatMap((value) => {
      const words = tokenize(value);
      const joined = words.join("");
      return words.length > 1 ? [...words, joined] : words;
    }),
  };
}

type IndexedSearchItem = {
  item: GlobalSearchItem;
  title: IndexedField;
  compactTitle: string;
  keywords: IndexedField;
  description: IndexedField;
};

export type GlobalSearchIndex = readonly IndexedSearchItem[];

/**
 * Normalization is done once per catalog rather than once per keystroke, so
 * ranking a query only walks pre-split words.
 */
export function createSearchIndex(items: readonly GlobalSearchItem[]): GlobalSearchIndex {
  return items.map((item) => ({
    item,
    title: indexField([item.title]),
    compactTitle: compact(item.title),
    keywords: indexField(item.keywords),
    description: indexField([item.description]),
  }));
}

function hasWord(field: IndexedField, token: string) {
  return field.words.includes(token);
}

function hasWordPrefix(field: IndexedField, token: string) {
  return field.words.some((word) => word.startsWith(token));
}

/** The best tier the token reaches on this item, or `null` when it is absent. */
function tokenTier(indexed: IndexedSearchItem, token: string) {
  if (hasWord(indexed.title, token)) return matchTier.titleWord;
  if (hasWordPrefix(indexed.title, token)) return matchTier.titleWordPrefix;
  if (indexed.keywords.values.includes(token)) return matchTier.keyword;
  if (hasWord(indexed.keywords, token)) return matchTier.keywordWord;
  if (hasWordPrefix(indexed.keywords, token)) return matchTier.keywordWordPrefix;
  if (hasWord(indexed.description, token)) return matchTier.descriptionWord;
  if (hasWordPrefix(indexed.description, token)) return matchTier.descriptionWordPrefix;
  return null;
}

function phraseRank(indexed: IndexedSearchItem, normalizedQuery: string, compactQuery: string) {
  const title = indexed.title.values[0] ?? "";
  if (title === normalizedQuery || indexed.compactTitle === compactQuery) return phraseTier.exactTitle;
  if (title.startsWith(normalizedQuery) || indexed.compactTitle.startsWith(compactQuery)) {
    return phraseTier.titlePrefix;
  }
  return phraseTier.none;
}

type ScoredSearchItem = {
  item: GlobalSearchItem;
  phrase: number;
  tokens: number;
};

/**
 * Every query token must match somewhere on the record; the record's token
 * score is the sum of the tiers its tokens reached. Comparisons only ever
 * happen between records answering the same query, so a plain sum orders them
 * without needing to be normalized by token count.
 */
function score(indexed: IndexedSearchItem, tokens: readonly string[], normalizedQuery: string, compactQuery: string): ScoredSearchItem | null {
  let total = 0;
  for (const token of tokens) {
    const tier = tokenTier(indexed, token);
    if (tier === null) return null;
    total += tier;
  }
  return {
    item: indexed.item,
    phrase: phraseRank(indexed, normalizedQuery, compactQuery),
    tokens: total,
  };
}

export type SearchHighlightSegment = {
  /** Offset of the segment in the source text; unique, so it keys a render. */
  start: number;
  value: string;
  matched: boolean;
};

function isWordCharacter(character: string) {
  return /[a-z0-9]/i.test(character);
}

/**
 * A highlight may only start where a word starts, mirroring how `tokenize`
 * splits records: either at a separator or at a camel-case hump.
 */
function startsWord(text: string, index: number) {
  if (index === 0) return true;
  const previous = text.charAt(index - 1);
  if (!isWordCharacter(previous)) return true;
  return /[a-z0-9]/.test(previous) && /[A-Z]/.test(text.charAt(index));
}

/**
 * Marks the parts of `text` the query actually reached, for rendering only.
 * Matching is case-insensitive on the raw text rather than on the accent-folded
 * form used for ranking, because folding would shift the offsets this needs; an
 * accented match therefore ranks normally and simply renders unhighlighted.
 */
export function highlightSearchMatch(text: string, query: string): SearchHighlightSegment[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [{ start: 0, value: text, matched: false }];

  const haystack = text.toLowerCase();
  const matched = new Array<boolean>(text.length).fill(false);

  for (let index = 0; index < text.length; index += 1) {
    if (!startsWord(text, index)) continue;
    for (const token of tokens) {
      if (!haystack.startsWith(token, index)) continue;
      for (let offset = 0; offset < token.length; offset += 1) matched[index + offset] = true;
    }
  }

  const segments: SearchHighlightSegment[] = [];
  for (let index = 0; index < text.length; index += 1) {
    const isMatched = matched[index] === true;
    const current = segments.at(-1);
    if (current && current.matched === isMatched) {
      current.value += text.charAt(index);
      continue;
    }
    segments.push({ start: index, value: text.charAt(index), matched: isMatched });
  }

  return segments.length > 0 ? segments : [{ start: 0, value: text, matched: false }];
}

export function rankSearchItems(index: GlobalSearchIndex, query: string) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [];

  const tokens = tokenize(query);
  if (tokens.length === 0) return [];
  const compactQuery = compact(query);

  return index
    .map((indexed) => score(indexed, tokens, normalizedQuery, compactQuery))
    .filter((result): result is ScoredSearchItem => result !== null)
    .sort((left, right) => left.phrase - right.phrase
      || left.tokens - right.tokens
      || left.item.title.localeCompare(right.item.title))
    .map((result) => result.item);
}
