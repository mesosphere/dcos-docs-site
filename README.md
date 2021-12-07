# D2iQ Documentation

D2iQ's documentation site is built using a JavaScript static site generator called Metalsmith. Here is how you can get started running the repo. Please also read our [contributing guidelines](./CONTRIBUTING.md) for instructions on how to make edits to docs.

## Prerequisites

1. Install node.js version ^12.0.0 (consider using a version manager such as [ASDF](https://github.com/asdf-vm/asdf))
1. Clone the repo
1. Install dependencies via command `npm i`

## Development / Writing

Run `npm run dev` or `make build-development` from the root directory to spin up a live preview of the docs site based on your local changes. After about a minute the compilation will complete.

You'll now be able to browse the docs at [http://localhost:3000/](http://localhost:3000/). Your browser will reflect any changes to pages in dkp almost immediately.

`npm i` may need to be run from time to time if dependencies have changed, but this is rare.

### Via Docker

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

If you need more control, have a look at the Makefile and the target `docker-liveedit`.

## Deciding which branch to use as a source

We have multiple environments for our documentation to support multiple use cases: production, beta, and development.

We use a branching workflow to decide what should be shown on which environment. Specific branches contain different content and deploy to different environments.

- `main` is our primary source of truth and will get deployed to the production environment available at https://docs.d2iq.com/. Use this branch only in the case that you need to make a change to the production version of site (hotfix). Hotfixes will need to be cherry-picked back to our develop branch, so please coordinate with a docs admin.
- `develop` is our preview environment and the development branch for upstream doc changes not ready for production. Thus, this is our default branch as most work will be in preparation for a forthcoming release. It will be deployed to https://dev-docs.d2iq.com/
- `beta` is our beta branch and will be deployed to https://beta-docs.d2iq.com/. `develop` will be merged into `beta` when it is time to update this branch.

```
o = commit

develop     ----o----o---o---------
                 \        \
                  \        \
beta        -------o--------\------
                             \
main        ------------------o----
```

## Useful VSCode extensions

Extensions can make it easier to work within the editor. Open the extensions browser by clicking the Settings Icon in the very lower left of VSCode and choosing `Extensions`, or, as you can see, it has a shortcut.

![Settings, Extensions](https://i.imgur.com/0XkNShr.png)

One extension that is often useful is `Gitlens`

## CVEs

We're publishing CVEs here: https://docs.d2iq.com/dkp/security-updates/. In case you want to update them, run `make update-cves` and commit the now changed file in `assets/cves.json`.

## Archive old documentation

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
