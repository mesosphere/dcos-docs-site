# Contributing to D2iQ docs

## Add/Edit content to existing pages

### TL;DR Common Gotchas

1.  The docs site uses metalsmith markdown rendering, which is similar to but not exactly github flavored markdown (gfm).
1.  Every folder must have one and only one corresponding index.md file, naming is limited as the folder name becomes part of the link structure, choose wisely. Use dashes in folder naming.
1.  Every index.md file must have the minimum front matter metadata of:
    layout, title, navigationTitle, menuWeight and excerpt.

        ![docs metadata](https://i.imgur.com/8KPsvEY.png)

1.  Code blocks within numbered lists need to be indented by 4 spaces
1.  Relative links after a lot of edits or restructuring need to be checked that they are catching the right folder structure, please be careful.
1.  Make sure to switch to all html tags within html code blocks for notes and warnings.

To get a great comprehensive overview of markdown syntax, please visit [this cheat sheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)

### Adding Links

- Use relative links. Begin all links at the root level (pages)and include the sphere and product before version number subdirectory. (example: `/mesosphere/dcos/1.13/administration/sshcluster/`).
- Do not include file extensions in your link paths. For example, to link to the page `/mesosphere/dcos/1.13/administration/user-management/index.md` use the following path: `/mesosphere/dcos/1.13/administration/user-management/`.

### Adding code blocks

Code blocks are formatted and presented to the user on the docs site with a copy icon in the upper right corner. Users can click on this icon and copy the entire code to their clipboard, rather than have to type all the code in.
Code block formatting is 3 backtics on separate lines at start and end. Do not put in the leading shell prompt `$` for any commands to be run, as this will block the user from copy-pasting.

Code ex.:

````
```
cd /var/lib/dcos/pki/tls/certs/
```
````

Correctly formatted:

```bash
cd /var/lib/dcos/pki/tls/certs/
openssl x509 -hash -noout -in ca.crt
```

Incorrect:

```bash
$ cd /var/lib/dcos/pki/tls/certs/
$ openssl x509 -hash -noout -in ca.crt
```

For the same usability as removing the shell prompt, always separate input blocks from output blocks so that users can copy the commands.

### Adding line highlights

You can highlight lines in a code block by adding a `data-line` attribute:

    ```json {data-line=2-5}
    {
      "id": "my-job",
      "description": "A job that sleeps",
      "run": {
        "cmd": "sleep 1000",
        "cpus": 0.01,
        "mem": 32,
        "disk": 0
      }
    }
    ```

You can highlight any combination of single lines and ranges. Some examples:

- `1` - highlight line 1.
- `2-5` - highlight the range 2 to 5.
- `1,3` - highlight the lines 1 and 3.
- `1-3,42` - highlight lines 1 to 3 and 42.

### Adding mustache variables

Version numbers, product names and other commonly used items can be added in as variables to increase text reusability.

If you are using mustache variables on your page, the render and model fields must exist within the front matter of that file and point to the proper location of the yaml file to query.

**Mustache** is the renderer and is always specified as
`render: mustache`

**Model** is the location of the data file such as
`model: /mesosphere/dcos/2.0/data.yml`

Variables are called by using `{{ model.value }}` within the content, and the script will automatically use the file location on the page to query that value and insert it at build time.

### Adding numbered lists

Numbered lists are along standard markdown guidelines. Please be careful of indentations when trying to create complex lists or when adding codeblocks or notes.

### Adding images

Images are currently stored in an `img` folder at the version level. Running a preview build to ensure all image paths are correct is important. Please make sure to add alternate text within the brackets

`![example note](/mesosphere/dcos/2.0/img/)`

### Adding a table of contents

- The in-page table of contents is automatically generated based on the `h1` and `h2` headers within the document.
- Directory tables of contents are automatically generated based on `title` (or `navigationTitle`) and `excerpt` headers.

### Using includes files for reusable content

"Include" files are content partials stored in a folder called "include", which can be at any level of the content. are inserted on build time. Especially when created with mustache variable rendering, can be incredibly useful when re-using content across products or versions.

Using an `include` file
To use an include file in a Markdown document, insert the word "#include" at the beginning of a line, followed by a space, followed by the path name of the file you wish to include:

`#include /mesosphere/dcos/services/include/configuration-options.tmpl`

When the file is processed, the indicated file (for example, configuration-install-with-options) will be written into the page that calls it.

### Adding Notes and Warnings

Notes and warnings can be useful to call out important information that a user needs to see. Remember that once you are in html tags, everything inside must also be formatted with html tags and not markdown.

#### Adding a Warning

Highest alert level. System failure is certain. Also should warn users of potential loss of data. Text is black on light red background, with a red bar on the left.

`<p class="message--warning"><strong>WARNING: </strong>your warning text</p>`

![example warning](https://i.imgur.com/4qQgQMN.png)

#### Adding an Important Message

A serious issue that the user must pay attention to. May or may not threaten system failure. Text is black on a pale yellow background, with a gold bar on the left.

`<p class="message--important"><strong>IMPORTANT: </strong>your important text</p>`

![example important](https://i.imgur.com/Fq2cSCu.png)

#### Adding a Note

Extra information that the user may wish to know, but not necessary to the basic completion of a task. There is no risk of system failure. Users may disregard if desired. Text is black on a light purple background, with a dark purple bar on the left.

`<p class="message--note"><strong>NOTE: </strong>text</p>`

![example note](https://i.imgur.com/s1RvDlT.png)

### Removing a border from an image

    ![Architectural overview](../img/Konvoy-arch-diagram.png){ data-no-border }

## Creating new folder(s) and index file(s) when needed

The directory-tree in `/pages` resembles the URL-structure of the final build. A pages' content **MUST** be in an `index.md` file in the respective directory.

For example, `/pages/some/directory/index.md` is located at `docs.d2iq.com/some/directory`.

### Create the folder

Within the existing structure, give it a title that is meaningful and will show up within the links structure of the published website
`https://docs.d2iq.com/mesosphere/dcos/2.0/administering-clusters/backup-and-restore/backup-restore-cli/`. Use dashes (kebab-case) in folder naming.

### Create a single index file for each folder

Each and every folder at every level may have one and only one corresponding index.md. This is necessary for the website generation scripts.

![folder structure example](https://i.imgur.com/YMKjEfw.png)

Figure 1 - Folder Structure Example

### Add required Metadata

Our markdown comes with metadata - also called "frontmatter". Here are the special variables that you might want to set in a pages' frontmatter:

#### Required Parameters

- **layout**: specifies the layout template to use. The default is `layout.pug` (the standard content-page-layout).
- **navigationTitle**: short title that shows up in 300px wide left hand nav
- **title**: longer title that shows up at top of content page
- **excerpt**: presented below the title at the top of the content page, sometimes used in topic cards. This could be a sub-title.
- **menuWeight**: this determines ordering within the nav structure, all numerical values except -1 accepted and sorted

#### Additional metadata

- **subtree**: This propagates its values down to all ancestor-pages. E.g. to hide a page tree, you set this on the topmost page you want to hide:
  ```
  ------------------
  title: Konvoy 42.0 beta
  subtree:
    draft: true
  ------------------
  ```
- **beta: true** - When this value is **true** a beta label is added to the page title.
- **experimental: true** - When this value is **true** an experimental label is added to the page title.

## When a PR is ready for publishing

### Style guides

In general, the documentation team follows the Microsoft Style Guide. Anything that deviates from that style guide is documented in the internal D2iQ wiki (search for Documentation Style Guide).

Kubernetes also has some terms that are specific to Kubernetes. That [style guide is found on the Kubernetes website](https://kubernetes.io/docs/contribute/style/style-guide/).

### Give final approvals and merge

By this time, you should have a tech writer assigned to the PR and they will have given feedback. Once both sides have signed off, it is ready for a `ready-to-merge` label.

### Docs Team will merge your PR

Docs builds go live as needed and sometimes multiple times in a day. For hotfixes, please make sure to communicate the reason for escalation to immediate promotion.
