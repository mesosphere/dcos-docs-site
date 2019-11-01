## D2iQ Documentation and Website Repo

## Build Statuses

| Branch | Site Build  | URL |
| ------ | ----------  | --- |
| review | [![Build Status](https://jenkins-docs.mesosphere.com/service/jenkins-docs/buildStatus/icon?job=dcos-docs-site-review)](https://jenkins-docs.mesosphere.com/service/jenkins-docs/job/dcos-docs-site-review/) | <http://docs-review.mesosphere.com/> |
| dcos-docs-site-alpha | [![Build Status](https://jenkins-docs.mesosphere.com/service/jenkins-docs/buildStatus/icon?job=dcos-docs-site-alpha)](https://jenkins-docs.mesosphere.com/service/jenkins-docs/job/dcos-docs-site-alpha/) | <http://docs-alpha.d2iq.com/> |
| beta-dispatch | [![Build Status](https://jenkins-docs.mesosphere.com/service/jenkins-docs/buildStatus/icon?job=beta-dispatch)](https://jenkins-docs.mesosphere.com/service/jenkins-docs/job/beta-dispatch/) | <http://beta-dispatch.d2iq.com/> |
| beta-kommander | [![Build Status](https://jenkins-docs.mesosphere.com/service/jenkins-docs/buildStatus/icon?job=beta-kommander)](https://jenkins-docs.mesosphere.com/service/jenkins-docs/job/beta-kommander/) | <http://beta-kommander.d2iq.com/> |
| staging | [![Build Status](https://jenkins-docs.mesosphere.com/service/jenkins-docs/buildStatus/icon?job=dcos-docs-site-staging)](https://jenkins-docs.mesosphere.com/service/jenkins-docs/job/dcos-docs-site-staging/) | <https://docs-staging.mesosphere.com> |
| master | [![Build Status](https://jenkins-docs.mesosphere.com/service/jenkins-docs/buildStatus/icon?job=dcos-docs-site-master)](https://jenkins-docs.mesosphere.com/service/jenkins-docs/job/dcos-docs-site-master/) | <https://docs.d2iq.com> |



To get started with the docs, please see [this temporary guide](https://hackmd.io/@ck4adventure/BJgrt4L5B/%2FxJo7K0hyR-GpmQNz7jU0Fw) while we re-write the wiki.

# Setting up the docs dev environment
## Ensure Github Access

### Ensure personal account access

### Ensure SSH keypair on file
1. First check to see if there are [existing SSH keys](https://help.github.com/en/enterprise/2.15/user/articles/checking-for-existing-ssh-keys). (the link will take you to GitHub's tutorial)
1. If you do not have an SSH key, follow these instructions to [generate a new one](https://help.github.com/en/enterprise/2.15/user/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent).
1. If you do have a public and private pair, follow these instructions to [add your key to the ssh-agent](https://help.github.com/en/enterprise/2.15/user/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#adding-your-ssh-key-to-the-ssh-agent)
1. Then you will [add your SSH key](https://help.github.com/en/enterprise/2.15/user/articles/adding-a-new-ssh-key-to-your-github-account) to your GitHub account

## Setup Mac Dev Environment
### Ensure Node is installed

Install node/js 8.1.2

`brew install node@8.1.2`

NB: for devs, make sure you can switch down to an older node via `nvm` or other manager `nvm use 8.1.2`

### Ensure a code editor is installed
we recommend [downloading VSCode](https://code.visualstudio.com/) 

### Install colored git branches
Add this snippet to your .bash_profile
```bash
parse_git_branch() {
  git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/ (\1)/'
}

export PS1="\u@\h \W\[\033[32m\]\$(parse_git_branch)\[\033[00m\] $ "
```

Run `source ~/.bash_profile` to reload the changes into any open terminals. It will automatically load itself into new windows after that.


### (Optional) Install bash autocompletion
Link to [Git Tips and Tricks](https://git-scm.com/book/en/v1/Git-Basics-Tips-and-Tricks) to understand using Autocomplete

1. Download this file [git-completion.bash](https://github.com/git/git/blob/master/contrib/completion/git-completion.bash)
2. Move or copy it to your home directory
3. Add this line to your .bashrc file `source ~/git-completion.bash`, it will now read in every time you open your terminal

### (Optional) Export shell path for code
This allows you to open code directly from the command line

From within VSCode editor, open to any file or none
`cmd + t` to open the command shortcut bar
type in `> shell ` to pull up the quick command to add the code command to the path

![vscode shell command](https://i.imgur.com/WQFB4tk.png)

### (Optional) Install VSCode extensions
Extensions can make it easier to work within the editor. Open the extensions browser by clicking the Settings Icon in the very lower left of VSCode and choosing `Extensions`, or, as you can see, it has a shortcut.

 ![Settings, Extensions](https://i.imgur.com/0XkNShr.png)

One extension that is often useful is `Gitlens`.


## Clone the Repo You Need
### Ensure working directory
As the products grow, so do the places where documentation lives. Tech writers will end up with more than a few repos that you will work in and contribute to as part of your work. 
1. From home level in the terminal, type `mkdir d2iq`


### CD into your working directory
1. Change directory into the new one you just made, or the one you already had
`cd d2iq`

### Clone the repo you need
We will be using the docs site repo for all examples, but this might also be another product repo within D2iQ.
`git clone dcos-docs-site`

NB: On first time setup, you may need to follow the instructions to install xcode tools to get git functionality

### `cd` into the Repo you just cloned
`cd dcos-docs-site`

### Open the repo in your code editor
If you installed the shell extension, you can now open the folder your terminal is in with the command:
`code .`

## Initialize the Repo (Docs Repo Only)
Content that is kept on other team repos would follow their init, if applicable.
### Install node modules
This must be only done on first time or if a rare site tooling change occurs. Other repos may have other needs, see their Contributing Guide or similar resource for assistance if you will need to build their code.
`npm install`

### Build the API page sets
This is necessary anytime a set is changed, or when a new DC/OS version (and there for a new set) is created
`make build-api`

This takes about 8 mins. It builds the folders `build-ngindox` and `biuld-swagger`.

### Build a local preview
This is to ensure setup was successful
`npm run dev`

Open a browser and navigate to `localhost:3000` to view the documentation site on your local system

#### Problems?
Running a build on first install is to ensure that all tools have been installed and are reading the code correctly. Please make sure to debug any errors at this point until you can get a full preview of the docs site at localhost:3000 in your browser. 

:TODO: image localhost docs landing page

### Stop the local preview server
This necessary once you are done previewing, not great to leave it running.
`ctrl-c`

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
\```
cd /var/lib/dcos/pki/tls/certs/
\```

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

### Adding tables
Best practices for tables are to run a webpack just on that page so you can get automatic rebuilds, and then just refresh the web browser to see the changes.
Please note the double asterisk needed to grab all files below that folder level.

`RPP=path/to/subfolder/** npm run dev`

Example building the upgrades file:
`RPP=mesosphere/dcos/2.0/installing/production/upgrading/** npm run dev`

Note, when using RPP, only pages at that level and below will be built, so be sure to visit:
`localhost:3000/mesosphere/dcos/2.0/installing/production/upgrading/`

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

### Special - Adding API tables
:TODO: add info on the API tables and the script to run

### Save your edited files!

## Previewing your work and formatting
Because metalsmith markdown is occasionally finicky, it is a good idea to preview your changes, especially if you have edited code blocks, lists or tables.

`npm run dev`

:exclamation: Render Path Pattern for faster builds
You can choose to build only a subset of the content and check it on localhost.

`RPP=path/to/subfolder/** npm run dev`

This will build only that subdirectory. Please note, due to the large number of files, it is best to set RPP down at the version level of any product, such as 

`RPP=mesosphere/dcos/2.0/**`

To view, navigate to that subdirectory on the local host. Pages above that directory will exist but not with CSS compiled.

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

## Troubleshooting PRs
TODO: Fill out this section more

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

## Pushing a rebased branch to staging
Whenever a rebase occurs, or a few other operations that change the order of commits as they are saved to the branch, git will raise an error if you try to push those changes up to the remote repository (usually called origin by default). This is because the histories are incompatible and this is a protective measure against major changes.

Override the history protection with the `--force` flag

`git push --force origin <branchname>`

### Manually merging in work to Staging (Advanced)
TODO: fill in this section

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

### Add Optional metadata:
#### Product Labels

* **enterprise: true** - use this to add an enterprise label to a page
* **community: true** - use this to add an enterprise label to a page
* **beta: true** - use this to add an enterprise label to a page

NB: Labels are only added directly to the particular page and not to any subpages

### Add Content
See [Add/Edit Content](#AddEdit-content-to-existing-pages)