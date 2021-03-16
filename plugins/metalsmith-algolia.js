const algoliasearch = require("algoliasearch");
const sanitizeHtml = require("sanitize-html");
const { getPathInfo } = require("../core/utils");

// based on their api repsonses it looks like they use 2bytes for char, our plan allows for 10kb, so roughly 50k characters
const MAX_CONTENT_LENGTH = 49000;
const INDEX_SETTINGS = {
  attributeForDistinct: "path",
  attributesForFaceting: ["scope"],
  attributesToSnippet: ["excerpt:40", "content:40"],
  customRanking: ["desc(scope)"],
  distinct: true,
  searchableAttributes: ["scope", "title", "content", "unordered(path)"],
};

module.exports = (files, _metalsmith, done) => {
  const { ALGOLIA_PRIVATE_KEY } = process.env;
  if (!ALGOLIA_PRIVATE_KEY) throw new Error("ALGOLIA_PRIVATE_KEY not set");
  const algoliaProjectId = "Z0ZSQ5T6T2";
  const client = algoliasearch(algoliaProjectId, ALGOLIA_PRIVATE_KEY);
  const index = client.initIndex("production");

  const objectsToIndex = Object.keys(files)
    .filter(indexable)
    .map((k) => toIndexEntry(files[k]));

  console.log(`indexing ${objectsToIndex.length} entries.`);
  index
    .setSettings(INDEX_SETTINGS)
    .wait()
    .then(() => index.replaceAllObjects(objectsToIndex, { batchSize: 20 }))
    .catch((e) => console.log(e, JSON.stringify(e)))
    .then(() => done());
};

// we index all html-files that are not landing pages.
const indexable = (path) =>
  path.endsWith(".html") && (path.match(/\//g) || []).length >= 2;

const transform = (content) =>
  Object.entries({
    "&nbsp;": " ",
    "&lt;": "<",
    "&gt;": ">",
    "&amp;": "&",
    "&quot;": '"',
    "&apos;": "'",
    "&cent;": "¢",
    "&pound;": "£",
    "&yen;": "¥",
    "&euro;": "€",
    "&copy;": "©",
    "&reg;": "®",
    "\\n": " ",
  })
    .reduce((s, [key, sub]) => s.replace(new RegExp(key, "g"), sub), content)
    .slice(0, MAX_CONTENT_LENGTH);

/**
 * Parses buffer to string and sanitizes html.
 * Removes all tags and replaces with whitespace.
 * @param {Buffer} buffer
 */
const sanitize = (string) => {
  let parsedString = sanitizeHtml(string, {
    allowedTags: [],
    allowedAttributes: [],
    selfClosing: [],
    // prettier-ignore
    nonTextTags: ["head", "style", "script", "textarea", "noscript", "header", "footer", "nav", "aside", "section"],
  });
  parsedString = parsedString.replace(/^\s+|\s+$/g, "");
  // Remove extraneous information from content.
  // Remove all content up to and including the action buttons. Some pages don't have action buttons.
  // For those pages, have the first capture group take nothing.
  const headerRegex = /^(.*SharePrintContributeDiscussFeedback|)((\n|.)*)?/;
  const capturedContent = headerRegex.exec(parsedString);
  return capturedContent[2] || "";
};

const toIndexEntry = (file) => {
  const { productName, searchFacet, version } = getPathInfo(file.path);
  const content = transform(sanitize(file.contents.toString()));

  return {
    content,
    excerpt: content.slice(0, 200),
    objectID: file.path,
    path: file.path,
    product: productName,
    scope: searchFacet,
    title: file.title,
    version,
  };
};
