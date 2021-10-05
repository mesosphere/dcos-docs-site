# D2iQ Documentation

# Detailed Environment Setup Guide

## Ensure Github Access
## Ensure personal account access
## Ensure IT has added you to the docs team

## Ensure SSH keypair on file
First,check to see if there are [existing SSH keys](https://docs.github.com/en/enterprise-server@3.1/github/authenticating-to-github/checking-for-existing-ssh-keys). 
If you do not have an SSH key, [generate a new one](https://docs.github.com/en/enterprise-server@3.1/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#generating-a-new-ssh-key).
If you do have a public and private pair, [add your key to the ssh-agent](https://docs.github.com/en/enterprise-server@3.1/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#adding-your-ssh-key-to-the-ssh-agent) 
Then [add your SSH key to your GitHub account](https://docs.github.com/en/enterprise-server@3.1/github/authenticating-to-github/adding-a-new-ssh-key-to-your-github-account)

# Setup MacOS Dev Environment

1. [Install node.js >=8.x](https://nodejs.org/en/download/package-manager/#macos)

1. [Download and Install VSCode](https://code.visualstudio.com/) 

## (Optional) Install VSCode extensions
Extensions can make it easier to work within the editor. Open the extensions browser by clicking the Settings Icon in the very lower left of VSCode and choosing `Extensions`, or, as you can see, it has a shortcut.

 ![Settings, Extensions](https://i.imgur.com/0XkNShr.png)

One extension that is often useful is `Gitlens`

# Clone the Repo You Need
## Ensure working directory
As the products grow, so do the places where documentation lives. Tech writers will end up with more than a few repos that you will work in and contribute to as part of your work. 
1. From home level in the terminal, type `mkdir d2iq`

## CD into your working directory
1. Change directory into the new one you just made, or the one you already had:
`cd d2iq`

## Clone the repo you need
We will be using the docs site repo for all examples, but this might also be another product repo within D2iQ.
`git clone dcos-docs-site`

Note: On first time setup, you may need to follow the instructions to install xcode tools to get git functionality

## `cd` into the Repo you just cloned
`cd dcos-docs-site`

## Open the repo in your code editor
If you installed the shell extension, you can now open the folder your terminal is in with the command:
`code .`

# Initialize the Repo (Docs Repo Only)
Content that is kept on other team repos would follow their init, if applicable.

## Install node modules
This must be only done on first time or if a rare site tooling change occurs. Other repos may have other needs, see their Contributing Guide or similar resource for assistance if you will need to build their code.
`npm install`

## Build the API page sets
This is necessary anytime a set is changed, or when a new DC/OS version (and there for a new set) is created
`make build-api`

This takes about 8 mins. It builds the folders `build-ngindox` and `biuld-swagger`.

# Setting up a dev/preview environment

You can "live edit" the docs: updated content is automatically re-rendered and refreshed in the browser. Additionally, you can view a live preview of any PR you create by going the preview site as described [on the wiki](https://wiki.d2iq.com/display/ENG/Automatic+Docs+Preview+Builds). 

## Via Docker

If you don't want to setup `node.js` your machine and have docker installed, you can start the site in a container.

```
# absolute path to the docs you want to edit. e.g. if you're in the konvoy repo, this would be "$PWD/docs/site/".
MOUNT_SRC=$PWD/docs/site/

# where in the url-structure to attach the folder you just selected. without the leading slash.
# e.g. for konvoy this might be "dkp/konvoy/1.7".
MOUNT_DST=dkp/konvoy/1.7

# start preview server
docker run -it --rm -v $MOUNT_SRC:/dcos-docs-site/pages/$MOUNT_DST -p3000:3000 -p35729:35729 mesosphere/docs-dev
```

If you need more control, have a look at the Makefile and the targets `docker-liveedit-image` and `docker-liveedit`.

## Without Docker

Ensure `node.js >=8.x` is installed: https://nodejs.org/en/download/package-manager/

```
# install dependencies
npm i

# start preview server
npm run dev
```

You'll now be able to browse the docs at [http://localhost:3000/](http://localhost:3000/). Your browser will reflect any changes to pages in dkp almost immediately.


# A short intro:

## Markdown with frontmatter

We assume that you already know how to use markdown. If you want more up to date information, refer to the #documentation Slack channel.

Our markdown comes with metadata - also called "frontmatter". Here are the special variables that you might want to set in a pages' frontmatter:

- **draft**: If set to `true`, this file won't show up on production. See `subtree` on how to hide whole page trees.
- **excerpt**: This text is presented below the title at the top of the content page, sometimes used in topic cards. This could be a sub-title.
- **layout**: This specifies the layout template to use. The default is `layout.pug` (the standard content-page-layout).
- **menuWeight**: This value determines the location in the navigation bar. All numerical values except -1 accepted and sorted.
- **navigationTitle**: This is the short title that shows up in navigation bar on the left.
- **subtree**: This propagates its values down to all ancestor-pages. E.g. to hide a page tree, you set this on the topmost page you want to hide:
  ```
  ------------------
  title: Konvoy 42.0 beta
  subtree:
    draft: true
  ------------------
  ```
- **title**: This is the title that shows up at top of the page

----------

* **beta: true** - When this value is **true** a beta label is added to the page title.
* **experimental: true** - When this value is **true** an experimental label is added to the page title.

## DO NOT BUILD sections

If you want to commit work, but
- you do not want that work to be live on the public documentation site,
- and also do not want to have it be in a **draft** status:

You can set that section to not be built.

Modify this repo's `config.json` file to add whatever page or section to not be built when your PR merges.

You need to include the branch that it's being built from (`main` in our case here), and the URL.

For example, if you wanted to add Konvoy 42.0 to the Do Not Build section, you would need to modify the `config.json` to look like this:

```json
{
  "main": {
    "DO_NOT_BUILD": [
      "dkp/konvoy/42.0/**"
    ]
  }
}
```

This tells Metalsmith to not build the Konvoy 42.0 section and it's child pages.

## URL-structure

The directory-tree in `/pages` resembles the URL-structure of the final build. A pages' content **MUST** be in an `index.md`file in the respective directory.

For example, `/pages/some/directory/index.md` is located at `docs.d2iq.com/some/directory`.

# CVEs

We're publishing CVEs here: https://docs.d2iq.com/dkp/security-updates/. In case you want to update them, run `make update-cves` and commit the now changed file in `assets/cves.json`.

# Content Editing Workflow
## Ensure jira ticket
New content should never be created without a ticket that ties back to a feature or fix.
This jira ticket will be used to tie the PR to the work tracking. Stay tuned for process updates on how Jira tickets will run in parallel with feature development.

## Ensure the latest updates of the content
### Checkout main branch
`git checkout main` - puts you on our default base branch, this could also be **any** collaborative branch
### Fetch the updates first (optional, but recommended)
`git fetch` - queries a list of all changes since last query.
This is useful to keep an eye on what branches are being worked on.

### Merge the updates
`git pull origin <branch-name>` - queries the changes and automatically merges the main branch in to update it

NB: Shortcut is `git pull` when you are on the `main` branch


## Start work on a specific ticket
### Create a new branch if none exists
- For small fixes, please use your initial/jira-ticket ie ck/DCOS-55529
- For larger items, it is acceptable to use a human readable name such as konvoy-1.0
-b flag specifies create new branch with the following name and then check it out to start working on it

`git checkout -b ck/DCOS-55529`


### Checkout the branch to work on
`git checkout <branchname>`

Or, copy/paste the branch name from the PR if there is one open already. Git will track from the remote and set up a new branch locally for you to work on.
There are often times when you will need to pull and work on someone else's branch even when it isn't a PR yet, you may need to specify `git checkout origin/<branchname>`

## Add/Edit content to existing pages
### TL;DR Common Gotchas
1. The docs site uses metalsmith markdown rendering, which is similar to but not exactly github flavored markdown (gfm).
1. Every folder must have one and only one corresponding index.md file, naming is limited as the folder name becomes part of the link structure, choose wisely.
2. Every index.md file must have the minimum front matter metadata of:
 layout, title, navigationTitle, menuWeight and excerpt.

     ![docs metadata](https://i.imgur.com/8KPsvEY.png)

4. Code blocks within numbered lists need to be indented by 4 spaces
5. Relative links after a lot of edits or restructuring need to be checked that they are catching the right folder structure, please be careful.
6. Make sure to switch to all html tags within html code blocks for notes and warnings.



To get a great comprehensive overview of markdown syntax, please visit [this cheat sheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)

### Adding regular text
Please give the full [Docs Style Guide](https://wiki.mesosphere.com/display/DOCS/Documentation+Style+Guide) a read every so often as a refresher.


### Adding Links
- Use relative links. Begin all links at the root level (pages)and include the sphere and product before version number subdirectory. (example:  `/mesosphere/dcos/1.13/administration/sshcluster/`).
- Do not include file extensions in your link paths. For example, to link to the page `/mesosphere/dcos/1.13/administration/user-management/index.md` use the following path: `/mesosphere/dcos/1.13/administration/user-management/`.

### Adding code blocks
Code blocks are formatted and presented to the user on the docs site with a copy icon in the upper right corner. Users can click on this icon and copy the entire code to their clipboard, rather than have to type all the code in.
Code block formatting is 3 backtics on separate lines at start and end. Do not put in the leading shell prompt `$` for any commands to be run, as this will block the user from copy-pasting.

Code ex.:
~~~
```
cd /var/lib/dcos/pki/tls/certs/
```
~~~

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

* `1` - highlight line 1.
* `2-5` - highlight the range 2 to 5.
* `1,3` - highlight the lines 1 and 3.
* `1-3,42` - highlight lines 1 to 3 and 42.

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
"Include" files are content partials stored in a folder called "include", which can be at any level of the content.  are inserted on build time. Especially when created with mustache variable rendering, can be incredibly useful when re-using content across products or versions.

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


#### Adding an Important	Message

A serious issue that the user must pay attention to. May or may not threaten system failure. Text is black on a pale yellow background, with a gold bar on the left.

`<p class="message--important"><strong>IMPORTANT: </strong>your important text</p>`

![example important](https://i.imgur.com/Fq2cSCu.png)


#### Adding a Note

Extra information that the user may wish to know, but not necessary to the basic completion of a task. There is no risk of system failure. Users may disregard if desired. Text is black on a light purple background, with a dark purple bar on the left.

`<p class="message--note"><strong>NOTE: </strong>text</p>`

![example note](https://i.imgur.com/s1RvDlT.png)

### Removing a border from an image

    ![Architectural overview](../img/Konvoy-arch-diagram.png){ data-no-border }
 
### Save your edited files!

## Committing your set of saved changes

### Add the files you want to be included in the commit
`git add .` this adds any new or untracked files into the system
OR
Use the GUI interface and click the plus sign `+` to add files in. There are times you may want to exclude a change if you are following git best practices.

### Commit the files
`git commit -m "<your message here>"` this commits with a custom message describing the commit. This should follow your team's best practices.
Shortcut: If all the files are already in existence and you are only modifying them, you can double up the commands with: `git commit -a -m "<message"` and it will automatically add all known files to main before committing.

### Rinse and repeat
Continue this process of edits, saving your work, previewing, and committing until necessary edits are complete.

### Done working on it for now? Push your changeset up
Now that you have accumulated changes that need to be shared back.

`git push origin <branchname>`

This saves your work for you should anything happen to your laptop. This also makes your changes available to the team and is necessary for the collaboration process.

### Create a PR
Docs PRs need a link to the eng side ticket to know what feature or fix this is documenting, as well as tickets to track our editing work. If it is a docs edit only, then we still need a ticket to track an editing pass and merging it in. Also helpful is a small summary of changes, and what versions of the product it affects. Make sure that you hook in with our team. PRs just dropped off will be not be given any priority. Assigning someone for Review does not count as fulfilling your handoff duties!

## When a PR is ready for publishing

### Give final approvals and merge
By this time, you should have a tech writer assigned to the PR and they will have given feedback. Once both sides have signed off, it is ready for a `ready-to-merge` label.

### Docs Team will merge your PR
docs builds go live as needed and sometimes multiple times in a day. For hotfixes, please make sure to communicate the reason for escalation to immediate promotion.

# Docs Admin Workflows

## When things go well
### Standard Rebase and Merge
Once you have a PR created and there are no conflicts listed on the auto-merge page, simply click the Green `Rebase and Merge` button available to you.


### Automatic preview builds 
Every docs PR is generated as a preview at the following URL:

http://docs-d2iq-com-pr-<add_pr_##_here>.s3-website-us-west-2.amazonaws.com/

## Rebase your work

### Understanding Rebase
Rebasing is the preferred strategy for applying PRs. Rather than merging different people's work together, it takes the latest available commit on the base branch and then tries to replay all of the work done on top of that. This stacks all the commits together neatly for tracking changes.

The most common use case is when a PR has become out of date and a conflict has occured because a page has diverging edits from someone else on a different task. Rebasing allows an interactive session in which merge conflicts are presented so that those conflicts can be handled one by one.

Within the docs, typically, you will only ever rebase your own work to update it with the latest main.
Docs Admins will often rebase a PR before merging it to main if there are outstanding conflicts.
Start from **YOUR** working branch, for example ck/DCOS-2

`git rebase main` This will try to do everything automatically, and put your work on top of the last know commit on main.

`git rebase -i <commit/branch>` This starts an interactive rebase should you want to pick and choose which work from the other branch should be applied to yours. (Advanced)

If you encounter merge conflicts, the order of operations is slightly different when in rebase mode. Resolve any merge conflicts, but following the instructions provided in the terminal. Generally:

1. Find the file(s) that have conflicts
1. Resolve any conflicts and save the files
1. Add file to git main area
    - Click the `+` sign in the GUI next to the file name
    - OR `git add .`
1. Continue the rebase `git rebase --continue`
1. This will continue working through all the commits until complete.

NB: Often you need to make choices and something might go wrong. `git rebase --abort` any time before it finishes will cancel and reset you to where you were.

## Pushing a rebased branch to main
Whenever a rebase occurs, or a few other operations that change the order of commits as they are saved to the branch, git will raise an error if you try to push those changes up to the remote repository (usually called origin by default). This is because the histories are incompatible and this is a protective measure against major changes.

Override the history protection with the `--force` flag

`git push --force origin <branchname>`

# Guide: Creating new folder(s) and index file(s) when needed
### Create the folder
within the existing structure, give it a title that is meaningful and will show up within the links structure of the published website
`https://docs.d2iq.com/mesosphere/dcos/2.0/administering-clusters/backup-and-restore/backup-restore-cli/`

### Create a single index file for each folder
Each and every folder at every level may have one and only one corresponding index.md. This is necessary for the website generation scripts.

![folder structure example](https://i.imgur.com/YMKjEfw.png)

Figure 1 - Folder Structure Example

### Add required Metadata
#### Required Parameters

- **layout**: this determines the template you need, content pages always use `layout.pug`
- **navigationTitle**: short title that shows up in 300px wide left hand nav
- **title**: longer title that shows up at top of content page
- **excerpt**: presented below the title at the top of the content page, sometimes used in topic cards
- **menuWeight**: this determines ordering within the nav structure, all numerical values except -1 accepted and sorted
- **beta: true** - use this to add a beta label to a page

# Guide: Archive old documentation

We have a branch called [`archive`](https://github.com/mesosphere/dcos-docs-site/tree/archive). That is the place where the archived documentation lives.
Whenever we push something there, a jenkins job will run that builds a docker image and pushes it
with the tag `:latest` to [docker hub](https://hub.docker.com/r/mesosphere/archived_docs/tags?page=1&ordering=last_updated).

In case you want to archive existing documentation move the folder that contains the target documentation from the `main`-branch to the same path on the `archive`-branch.
For example, if you want to archive the documentation for kommander 1.2 move the folder `pages/dkp/kommander/1.2.` from the main branch to the same
location into the `archive`-branch.

Be careful, as the `main`-branch can constantly change and is probably, by all means, more up to date than the archive branch, it may be needed to adjust some
navigation items or something else.

You may want to build and push that docker image for your changes manually and let someone else look over it. You could use the `:next`-tag for it.

In the branch you are working on (hopefully not directly on the `archive`-branch ;)):

```sh
$ docker build -t mesosphere/archived_docs:next .
$ docker push mesosphere/archived_docs:next
```

Then anyone could run that pushed image and have a look if everything is alright:

```sh
docker run -p 5000:5000 -it mesosphere/archived_docs:next
```

If you merge your branch to the `archive`-branch, jenkins will take care of building and pushing the image.

## Branching Workflow

We use a branching workflow to decide what should be shown on which environment.
That means we have specific branches that contains different content and are deployed to different environments.

We have three branches which are deployed:

- `main` is our preview environment and our main development branch, it will be deployed to dev-docs.d2iq.com.
- `beta` is our beta branch and will be deployed to `beta-docs.d2iq.com`.
- `production` is our production branch and will get deployed to the production environment available at docs.d2iq.com.

Every change should be made to the `main` branch and from there be merged into the respective branches which should reflect that content.

```
o = commit

main        ----o----o---o---------
                 \        \
                  \        \
beta        -------o--------\------
                             \
production  ------------------o----
```
