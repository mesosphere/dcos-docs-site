const $ = require("cheerio");
const md = require("markdown-it")({ typographer: true, html: true });

const firstParagraph = (file) => {
  const contents = file.contents.toString("utf-8");
  console.log(contents.split(/\r?\n/g));
  return $("p", md.render(contents)).first();
};

const newFirstParagraph = (file) => {
  const contents = file.contents
    .toString("utf-8")
    .split(/\r?\n/g)
    .filter((n) => n);

  return contents[0] || "";
};

const cases = [
  [
    "Learn about D2iQ products, from installation to operations, and deploying your workloads.",
    {
      layout: "all-products-landing.pug",
      navigationTitle: "D2iQ Documentation",
      title: "D2iQ Documentation",
      enterprise: false,
      menuWeight: 0,
      contents:
        "Learn about D2iQ products, from installation to operations, and deploying your workloads.\n",
      mode: "0644",
      stats: {
        dev: 16777221,
        mode: 33188,
        nlink: 1,
        uid: 501,
        gid: 20,
        rdev: 0,
        blksize: 4096,
        ino: 5572034,
        size: 225,
        blocks: 8,
        atimeMs: 1625854220814.8652,
        mtimeMs: 1625844885892.827,
        ctimeMs: 1625844885892.827,
        birthtimeMs: 1625844885892.7776,
        atime: "2021-07-09T18:10:20.815Z",
        mtime: "2021-07-09T15:34:45.893Z",
        ctime: "2021-07-09T15:34:45.893Z",
        birthtime: "2021-07-09T15:34:45.893Z",
      },
    },
  ],
  [
    "",
    {
      layout: "404.pug",
      title: "Page not found",
      navigationTitle: 404,
      menuWeight: -1,
      contents: "\n",
      mode: "0644",
      stats: {
        dev: 16777221,
        mode: 33188,
        nlink: 1,
        uid: 501,
        gid: 20,
        rdev: 0,
        blksize: 4096,
        ino: 5567604,
        size: 83,
        blocks: 8,
        atimeMs: 1625854220789.7256,
        mtimeMs: 1625844884575.6018,
        ctimeMs: 1625844884575.6018,
        birthtimeMs: 1625844884575.5493,
        atime: "2021-07-09T18:10:20.790Z",
        mtime: "2021-07-09T15:34:44.576Z",
        ctime: "2021-07-09T15:34:44.576Z",
        birthtime: "2021-07-09T15:34:44.576Z",
      },
    },
  ],
  [
    "",
    {
      layout: "search.pug",
      title: "Search",
      navigationTitle: "Search",
      menuWeight: -1,
      contents: "",
      mode: "0644",
      stats: {
        dev: 16777221,
        mode: 33188,
        nlink: 1,
        uid: 501,
        gid: 20,
        rdev: 0,
        blksize: 4096,
        ino: 5588358,
        size: 80,
        blocks: 8,
        atimeMs: 1625844954693.5637,
        mtimeMs: 1625844889836.079,
        ctimeMs: 1625844889836.079,
        birthtimeMs: 1625844889836.0042,
        atime: "2021-07-09T15:35:54.694Z",
        mtime: "2021-07-09T15:34:49.836Z",
        ctime: "2021-07-09T15:34:49.836Z",
        birthtime: "2021-07-09T15:34:49.836Z",
      },
    },
  ],
  [
    "Welcome to DKP",
    {
      layout: "konvoy-docs-landing.pug",
      navigationTitle: "D2iQ Kubernetes Platform",
      title: "D2iQ Kubernetes Platform",
      menus: ["landing-header"],
      menuWeight: 5,
      contents: "\nWelcome to DKP\n",
      mode: "0644",
      stats: {
        dev: 16777221,
        mode: 33188,
        nlink: 1,
        uid: 501,
        gid: 20,
        rdev: 0,
        blksize: 4096,
        ino: 5568156,
        size: 170,
        blocks: 8,
        atimeMs: 1625854220806.4666,
        mtimeMs: 1625844884628.3464,
        ctimeMs: 1625844884628.3464,
        birthtimeMs: 1625844884628.2947,
        atime: "2021-07-09T18:10:20.806Z",
        mtime: "2021-07-09T15:34:44.628Z",
        ctime: "2021-07-09T15:34:44.628Z",
        birthtime: "2021-07-09T15:34:44.628Z",
      },
    },
  ],
  [
    "The following information describes mitigated or fixed CVEs found in Konvoy.",
    {
      layout: "layout.pug",
      navigationTitle: "Security Updates",
      title: "Security Updates",
      excerpt: "View CVE security scans and update information for Konvoy",
      menuWeight: 1000,
      beta: false,
      contents:
        '\nThe following information describes mitigated or fixed CVEs found in Konvoy.\n\n<div class="cve-table-container">Loading...</div>\n<script src="/js/cve.js"></script>\n\n',
      mode: "0644",
      stats: {
        dev: 16777221,
        mode: 33188,
        nlink: 1,
        uid: 501,
        gid: 20,
        rdev: 0,
        blksize: 4096,
        ino: 5572033,
        size: 346,
        blocks: 8,
        atimeMs: 1625854220814.8523,
        mtimeMs: 1625844885892.725,
        ctimeMs: 1625844885892.725,
        birthtimeMs: 1625844885892.6711,
        atime: "2021-07-09T18:10:20.815Z",
        mtime: "2021-07-09T15:34:45.893Z",
        ctime: "2021-07-09T15:34:45.893Z",
        birthtime: "2021-07-09T15:34:45.893Z",
      },
    },
  ],
  [
    "",
    {
      layout: "conductor-docs-landing.pug",
      navigationTitle: "Conductor",
      title: "Conductor",
      menuWeight: 1,
      beta: false,
      menus: ["conductor-header"],
      contents: "",
      mode: "0644",
      stats: {
        dev: 16777221,
        mode: 33188,
        nlink: 1,
        uid: 501,
        gid: 20,
        rdev: 0,
        blksize: 4096,
        ino: 5567647,
        size: 141,
        blocks: 8,
        atimeMs: 1625854220791.1025,
        mtimeMs: 1625844884578.9888,
        ctimeMs: 1625844884578.9888,
        birthtimeMs: 1625844884578.9385,
        atime: "2021-07-09T18:10:20.791Z",
        mtime: "2021-07-09T15:34:44.579Z",
        ctime: "2021-07-09T15:34:44.579Z",
        birthtime: "2021-07-09T15:34:44.579Z",
      },
    },
  ],
  [
    "Conductor is a an interactive learning platform designed to accelerate onboarding to cloud-native technologies through focusing on hands-on-experience that enhances acquiring  learning objectives.",
    {
      layout: "layout.pug",
      navigationTitle: "Welcome to Conductor 1.0",
      title: "Welcome to Conductor 1.0",
      beta: false,
      menuWeight: 15,
      contents:
        "\nConductor is a an interactive learning platform designed to accelerate onboarding to cloud-native technologies through focusing on hands-on-experience that enhances acquiring  learning objectives.",
      mode: "0644",
      stats: {
        dev: 16777221,
        mode: 33188,
        nlink: 1,
        uid: 501,
        gid: 20,
        rdev: 0,
        blksize: 4096,
        ino: 5567610,
        size: 325,
        blocks: 8,
        atimeMs: 1625854220790.1133,
        mtimeMs: 1625844884576.042,
        ctimeMs: 1625844884576.042,
        birthtimeMs: 1625844884575.9734,
        atime: "2021-07-09T18:10:20.790Z",
        mtime: "2021-07-09T15:34:44.576Z",
        ctime: "2021-07-09T15:34:44.576Z",
        birthtime: "2021-07-09T15:34:44.576Z",
      },
    },
  ],
];

describe("firstParagraph func", () => {
  test.each(cases)("should return the expected value", (expected, file) => {
    const actual = newFirstParagraph(file);
    expect(actual).toEqual(expected);
  });
});
