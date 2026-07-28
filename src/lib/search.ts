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

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function relevance(item: GlobalSearchItem, normalizedQuery: string) {
  const title = normalize(item.title);
  const compactTitle = title.replace(/\s+/g, "");
  const compactQuery = normalizedQuery.replace(/\s+/g, "");
  const description = normalize(item.description);
  const keywordEntries = item.keywords.map(normalize);
  const keywords = keywordEntries.join(" ");
  const searchableText = `${title} ${description} ${keywords}`;
  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);

  if (!tokens.every((token) => searchableText.includes(token))) return null;
  if (title === normalizedQuery || compactTitle === compactQuery) return 0;
  if (title.startsWith(normalizedQuery) || compactTitle.startsWith(compactQuery)) return 1;
  if (title.includes(normalizedQuery)) return 2;
  if (keywordEntries.some((keyword) => keyword === normalizedQuery)) return 3;
  if (keywordEntries.some((keyword) => keyword.startsWith(normalizedQuery))) return 4;
  if (keywordEntries.some((keyword) => keyword.includes(normalizedQuery))) return 5;
  if (description.includes(normalizedQuery)) return 6;
  return 7;
}

export function rankSearchItems(items: readonly GlobalSearchItem[], query: string) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [];

  return items
    .map((item) => ({ item, score: relevance(item, normalizedQuery) }))
    .filter((result): result is { item: GlobalSearchItem; score: number } => result.score !== null)
    .sort((left, right) => left.score - right.score || left.item.title.localeCompare(right.item.title))
    .map((result) => result.item);
}
