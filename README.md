# D2iQ Documentation

# Setting up a dev/preview environment

You can "live edit" the docs: updated content is automatically re-rendered and refreshed in the browser.

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

We assume that you already know how to use markdown. You may want to reach out in #documentation and ask for some up to date resources in case you want to learn (more) about it.

Our markdown comes along with metadata - also called "frontmatter". Here are all the special variables that you might want to set in a pages' frontmatter:

- **excerpt**: presented below the title at the top of the content page, sometimes used in topic cards
- **layout**: this determines the template you need, defaults to `layout.pug` (the standard content-page-layout).
- **menuWeight**: determines ordering in the navigation structure, all numerical values except -1 accepted and sorted.
- **navigationTitle**: short title that shows up in navigation bar on the left.
- **title**: shows up at top of the page

----------

* **beta: true** - adds an beta label to a page's titel
* **experimental: true** - adds an experimental label to a page's titel

## URL-structure

The directory-tree withing `/pages` resembles the URL-structure of the final build. A pages' content **MUST** be in an `index.md`-file within the according directory.

In short: `/pages/some/directory/index.md` will be available at `docs.d2iq.com/some/directory`.

## Templating and Variables

We use `handlebars.js` for templating. 

```markdown
---
title: A page about handlebars

# declare your variable right here, right now:
someVariable: <b>awesome</b>

# you can use arbitrary yaml:
nested:
  prop: "voodoo!"

# or even share your data with other files:
model: /dkp/konvoy/data.yml
# here's the content of data.yml:
# some:
#   prop: "This was loaded from a yaml-file."
--- 

# {{{ }}} - raw interpolation. Use this (unless you know better)!

DKP is {{{ someVariable }}}!         => DKP is awesome!
Templating is {{{ nested.prop }}}    => Templating is voodoo!
Shared: {{{ model.some.prop }}}      => This was loaded from a yaml-file.

# Our custom helpers:

{{{ include "/dkp/someTemplate.tmpl" }}}    => Hi from someTemplate.tmpl! I can contain template-expressions as well!

# Comments
{{! This comment will not show up in the output}}
```

This enabled some powerful patterns - that we have not agreed on yet. So if you find a nice way/architecture to prevent e.g. excessive backporting, please share and discuss in `#documentation`.

# Content Editing Workflow

## Ensure jira ticket
New content should never be created without a ticket that ties back to a feature or fix.
This jira ticket will be used to tie the PR to the work tracking. Stay tuned for process updates on how Jira tickets will run in parallel with feature development.

## Ensure the latest updates of the content
### Checkout staging branch
`git checkout staging` - puts you on our default base branch, this could also be **any** collaborative branch
### Fetch the updates first (optional, but recommended)
`git fetch` - queries a list of all changes since last query.
This is useful to keep an eye on what branches are being worked on.

### Merge the updates
`git pull origin <branch-name>` - queries the changes and automatically merges the staging branch in to update it

NB: Shortcut is `git pull` when you are on the `staging` branch


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

To get a great comprehensive overview of markdown syntax, please visit [this cheat sheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)

### Adding Links
- Use relative links if possible. Begin all links at the root level (pages) and include the sphere and product before version number subdirectory. (example:  `/mesosphere/dcos/1.13/administration/sshcluster/`).
- Do not include file extensions in your link paths. For example, to link to the page `/mesosphere/dcos/1.13/administration/user-management/index.md` use the following path: `/mesosphere/dcos/1.13/administration/user-management/`.

### Adding code blocks
Code blocks are formatted and presented to the user on the docs site with a copy icon in the upper right corner. Users can click on this icon and copy the entire code to their clipboard, rather than have to type all the code in.
Code block formatting is 3 backtics (followed by an optional syntax-highlighting identifier) on separate lines at start and end.

~~~
```shell-session
cd /var/lib/dcos/pki/tls/certs/
```
~~~


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


### Adding images
Images are currently stored in an `img` folder at the version level. Running a preview build to ensure all image paths are correct is important. Please make sure to add alternate text within the brackets

`![example note](/mesosphere/dcos/2.0/img/)`

### Adding a table of contents
- The in-page table of contents is automatically generated based on the `h1` and `h2` headers within the document.
- Directory tables of contents are automatically generated based on `title` (or `navigationTitle`) and `excerpt` headers.

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
Shortcut: If all the files are already in existence and you are only modifying them, you can double up the commands with: `git commit -a -m "<message"` and it will automatically add all known files to staging before committing.

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
Staging builds go live as needed and sometimes multiple times in a day. For hotfixes, please make sure to communicate the reason for escalation to immediate promotion.

# Docs Admin Workflows

## When things go well
### Standard Rebase and Merge
Once you have a PR created and there are no conflicts listed on the auto-merge page, simply click the Green `Rebase and Merge` button available to you.

### QA staging build
Staging is literally that, a last place to accumulate changes before they go live. This should be considered live once anything reaches staging, as reverting things takes extra time.
Best practice is to do a quick visual scan of the pages changed once built to staging, but is often skipped unless a spot check is needed. It is assumed PRs are run and checked before requesting a merge.

### Promote to Master
The script `./scripts/promote-staging-to-master.sh` will checkout staging, update itself, checkout master, update and merge in, and then push master up to trigger a webhook for the production build.

## Rebase your work

### Understanding Rebase
Rebasing is the preferred strategy for applying PRs. Rather than merging different people's work together, it takes the latest available commit on the base branch and then tries to replay all of the work done on top of that. This stacks all the commits together neatly for tracking changes.

The most common use case is when a PR has become out of date and a conflict has occured because a page has diverging edits from someone else on a different task. Rebasing allows an interactive session in which merge conflicts are presented so that those conflicts can be handled one by one.

Within the docs, typically, you will only ever rebase your own work to update it with the latest staging.
Docs Admins will often rebase a PR before merging it to staging if there are outstanding conflicts.
Start from **YOUR** working branch, for example ck/DCOS-2

`git rebase staging` This will try to do everything automatically, and put your work on top of the last know commit on staging.

`git rebase -i <commit/branch>` This starts an interactive rebase should you want to pick and choose which work from the other branch should be applied to yours. (Advanced)

If you encounter merge conflicts, the order of operations is slightly different when in rebase mode. Resolve any merge conflicts, but following the instructions provided in the terminal. Generally:

1. Find the file(s) that have conflicts
1. Resolve any conflicts and save the files
1. Add file to git staging area
    - Click the `+` sign in the GUI next to the file name
    - OR `git add .`
1. Continue the rebase `git rebase --continue`
1. This will continue working through all the commits until complete.

NB: Often you need to make choices and something might go wrong. `git rebase --abort` any time before it finishes will cancel and reset you to where you were.

