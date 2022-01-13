<!-- markdownlint-disable no-bare-urls -->

# D2iQ documentation

D2iQ's documentation site uses a JavaScript static site generator called Metalsmith. Here is how you can get started running the repo. Please also read the [contributing guidelines](./CONTRIBUTING.md) for instructions on how to make edits to docs.

## Prerequisites

1. Clone the repo
1. Install node.js version 12.22.7 (consider using a version manager such as [ASDF](https://github.com/asdf-vm/asdf) or [nvm-windows](https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows))
1. Windows users will need to [install python2](https://github.com/nodejs/node-gyp/tree/v3.8.0#on-windows) globally
1. Install dependencies via command `npm i`
1. Install [vale](https://docs.errata.ai/vale/install) (an [ASDF plugin](https://github.com/osg/asdf-vale) is also available).

## Development

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

## Deciding which branch to use as a source

D2iQ has multiple environments for documentation to support various use cases: production, beta, and development. Specific branches contain different content and deploy to different environments.

- `main` is the primary source of truth and will get deployed to the production environment available at https://docs.d2iq.com/. Use this branch only in the case that you need to make a change to the production version of site. Such commits will need to be cherry-picked back to the develop branch, so please coordinate with a docs admin.
- `develop` is a preview environment and the development branch for upstream doc changes not ready for production. Thus, this is the default branch as most work will be in preparation for a forthcoming release. It deploys to https://dev-docs.d2iq.com/
- `beta` is the beta branch deployed to https://beta-docs.d2iq.com/. The docs team will promote `develop` to `beta` upon beta releases.

**Note:** In most cases, if you are making changes to a yet-to-be-released version of the app and documentation, branch off of `develop`. If you are making changes to an already released version of the app and documentation, branch off of `main`. For example: If Kommander v2.1 is released, and you have a change to a topic in 2.1 - branch off of `main`. If you want to make the same change to the same topic in the upcoming release version Kommander v2.2, only change the files in the `/2.2/` folder in `develop`. The changes in the `/2.1/` version's folder will be added from `main` to `develop` on a regular interval.

<!-- markdownlint-disable fenced-code-language -->

```
o = commit

develop     ----o----o---o---------
                 \        \
                  \        \
beta        -------o--------\------
                             \
main        ------------------o----
```

<!-- markdownlint-enable fenced-code-language -->

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
