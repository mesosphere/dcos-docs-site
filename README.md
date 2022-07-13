<!-- markdownlint-disable no-bare-urls -->

# D2iQ documentation

D2iQ's documentation is created based on a _docs as code_ approach or methodology. In other words, content creators use the same processes and tools as developers. Therefore, there are a few steps you need to follow to be able to contribute to documentation.

D2iQ's documentation site uses a JavaScript static site generator called Metalsmith. Here is how you can get started running the repo. Please also read the [contributing guidelines](./CONTRIBUTING.md) for instructions on how to make edits to docs.

## Prerequisites

1. Download and install a source code editor like VSC. Note: use a package manager such as Homebrew to install new software.
1. Create an account on GitHub and activate the 2FA process for added security, or use your personal account and ensure 2FA is active.
1. Add the GitHub extension to your editor (in VSC: https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-pull-request-github)
1. Clone the repo (in VSC: select _Clone repo_, enter _mesosphere/dcos-docs-site_ in the search bar and save a copy of the repo locally).
1. Install node.js version 16.0.0 or higher (consider using a version manager such as [ASDF](https://github.com/asdf-vm/asdf) or [nvm-windows](https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows))
1. Windows users will need to [install python2](https://github.com/nodejs/node-gyp/tree/v3.8.0#on-windows) globally
1. Install dependencies via command `npm i`
1. Install [vale](https://docs.errata.ai/vale/install) (an [ASDF plugin](https://github.com/osg/asdf-vale) is also available).
1. Your GitHub profile needs to be validate with a GPG certificate.

## Development

You can see how documentation will look like in front-end by running a local build of the docs site. Watch [this tutorial](https://drive.google.com/file/d/1eRuFWyx-nE6fRoj-blO8QNUcwKDFwJMS/view?usp=sharing) or proceed with the following steps to set up your local build:

Run `npm run dev` or `make build-development` from the root directory to spin up a live preview of the docs site based on your local changes. After about a minute the compilation will complete.

You'll now be able to browse the docs at [http://localhost:3000/](http://localhost:3000/). Your browser will automatically reflect any changes to pages.

If dependencies have changed, which is rare but happens from time to time, run `npm i` again.

### Via Docker

If you do not want to setup `node.js` on your machine and instead have docker installed, you can start the site in a container.

```sh
# absolute path to the docs you want to edit. e.g. if you're in the konvoy repo, this would be "$PWD/docs/site/".
MOUNT_SRC=$PWD/docs/site/

# where in the url-structure to attach the folder you just selected. without the leading slash.
# e.g. for konvoy this might be "dkp/konvoy/1.7".
MOUNT_DST=dkp/konvoy/1.7

# start preview server
docker run -it --rm -v $MOUNT_SRC:/dcos-docs-site/pages/$MOUNT_DST -p3000:3000 -p35729:35729 mesosphere/docs-dev
```

If you need more control, have a look at the Makefile and the target `docker-liveedit`.

## Production and preview domains, DOCS_ENV variable

`main` is the default branch for this repo.

D2iQ has various domains for documentation to support different use cases: production, beta, and development. You can modify the config.json file to hide certain directories (that are still unfinished) from being visible on each site.

- https://docs.d2iq.com/ is our production URL and deploys when the `main` branch changes. It has the environment variable `DOCS_ENV=production`.
- https://beta-docs.d2iq.com/ is our password protected beta URL and deploys when the `beta` branch changes. It has the environment variable `DOCS_ENV=beta`.
- https://dev-docs.d2iq.com/ is a preview domain and deploys when the `main` branch changes. It receives the environment variable `DOCS_ENV=preview`.
- `"docs-d2iq-com-pr-${env.CHANGE_ID}.s3-website-us-west-2.amazonaws.com"` domains deploy on every other branch. They receive the environment variable `DOCS_ENV=preview`.

### Hiding directories based on DOCS_ENV

To prevent a directory from appearing on the docs site in a specific domain, change the `config.json` as follows:

```json
{
  "main": {
    "DO_NOT_BUILD": [
      "dkp/konvoy/42.0/**"
    ]
  }
}
```

This code instructs Metalsmith not to build the Konvoy 42.0 section and its child pages.

## Husky pre-commit hook

This repo validates code before committing, without the need for additional tooling to run. It will only lint files that have changed.

The Docs team introduced these linters in December 2021 and decided not to retroactively apply them to existing files. Thus, **you will encounter errors on files you have changed that you did not introduce**. Please cheerfully address errors as best you can!

- Grammar lint via [vale](https://docs.errata.ai/)
- Link validation using [remark](https://github.com/remarkjs/remark)
- markdown validation using [markdownlint](https://github.com/DavidAnson/markdownlint)

See the section below on VSCode extensions that will catch these errors before creating a commit.

### Configuring vale vocabulary

You may need to add technical terms to vale's list of accepted vocabulary words. Add a line for each one to the `./.github/styles/Vocab/Docs/accept.txt` file.

### Disabling markdown linter rules

This is not good general practice, but in certain cases you may want to [disable particular markdown lint rules](https://github.com/DavidAnson/markdownlint#configuration).

## Useful VSCode extensions

Extensions can make it easier to work within the editor. Open the extensions browser by clicking the Settings Icon in the lower left of VSCode and choosing `Extensions`, or, as you can see, it has a shortcut.

![Settings, Extensions](https://i.imgur.com/0XkNShr.png)

We highly recommend the following extensions to find linting errors before they block your commit message:

- https://github.com/errata-ai/vale-vscode#using-vale
- https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint

### Configure the Vale VSCode extension

Because the folder structure is so deeply nested, the Vale VSCode extension has a hard time finding the configuration file. Change your VSCode settings to use the Vale CLI and also to point to the `.vale.ini` folder in the root of this repo:

```json
{
  "vale.valeCLI.config": "${workspaceFolder}/.vale.ini",
  "vale.core.useCLI": true
}
```

## CVEs

CVEs are published here: https://docs.d2iq.com/dkp/security-updates/. In case you want to update them, run `make update-cves` and commit the now changed file in `assets/cves.json`.

## Archive old documentation

We have a branch called [`archive`](https://github.com/mesosphere/dcos-docs-site/tree/archive). That is the place where the archived documentation lives.
Whenever we push something there, a job will run that builds a docker image and pushes it
with the tag `:latest` to [docker hub](https://hub.docker.com/r/mesosphere/archived_docs/tags?page=1&ordering=last_updated).

In case you want to archive existing documentation move the folder that contains the target documentation from the `main`-branch to the same path on the `archive`-branch.
For example, if you want to archive the documentation for Kommander 1.2 move the folder `pages/dkp/kommander/1.2.` from the main branch to the same
location into the `archive`-branch.

Be careful, as the `main`-branch can constantly change and is probably, by all means, more up to date than the archive branch, it may be needed to adjust some navigation items or something else.

You may want to build and push that docker image for your changes manually and let someone else look over it. You could use the `:next`-tag for it.

In the branch you are working on (not directly on the `archive`-branch ;)):

```sh
docker build -t mesosphere/archived_docs:next .
docker push mesosphere/archived_docs:next
```

Then anyone could run that pushed image and have a look if everything is alright:

```sh
docker run -p 5000:5000 -it mesosphere/archived_docs:next
```

If you merge your branch to the `archive`-branch, CI will take care of building and pushing the image.

## Listing paths for redirection

Running `npm run build` locally will automatically build a file `redirects.txt` which can be checked into git.
