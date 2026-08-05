// The mobile header contract only means anything inside the narrow-viewport
// media block. Matching the selectors anywhere in a stylesheet would keep
// passing if the rules escaped the media query and hid desktop navigation at
// every width, so every assertion runs against the extracted block contents.
const mobileHeaderMediaQuery = "@media(max-width:900px){";

/** Balanced contents of every block opened by `query`, with whitespace removed. */
export function mediaBlockContents(css, query = mobileHeaderMediaQuery) {
  const compact = css.replace(/\s+/g, "");
  const blocks = [];
  let start = compact.indexOf(query);

  while (start !== -1) {
    const opening = start + query.length - 1;
    let depth = 0;
    let cursor = opening;

    while (cursor < compact.length) {
      if (compact[cursor] === "{") depth += 1;
      else if (compact[cursor] === "}") {
        depth -= 1;
        if (depth === 0) break;
      }
      cursor += 1;
    }

    if (depth !== 0) throw new Error(`A ${query} block is unbalanced.`);
    blocks.push(compact.slice(opening + 1, cursor));
    start = compact.indexOf(query, cursor);
  }

  return blocks.join("");
}

export function hasMobileHeaderContract(css) {
  const contents = mediaBlockContents(css);
  return /\.desktop-nav\{[^}]*display:none/.test(contents)
    && /\.mobile-menu\{[^}]*display:block/.test(contents);
}
