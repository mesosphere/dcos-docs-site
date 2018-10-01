---
layout: layout.pug
navigationTitle:  Managing Package Repositories
title: Managing Package Repositories
menuWeight: 50
excerpt: Using the web interface or CLI to manage your package repositories
enterprise: false
---

<!-- The source repo for this topic is https://github.com/dcos/dcos-docs-site -->

DC/OS comes pre-configured with the [Mesosphere Universe](https://github.com/mesosphere/universe) package repository as the provider of DC/OS packages, but other package repositories can also be added.

You can use the web interface or the CLI to:

* [List repositories](#listing)
* [Search for packages](#finding-packages)
* [Add repositories](#adding)
* [Remove repositories](#removing)

<p class="message--note"><strong>NOTE: </strong>Before you can use the CLI, you need to <a href="/1.12/cli/install">install it</a>.</p>


## <a name="listing"></a>Listing repositories

To see which package repositories are currently installed, enter this CLI command:   

```bash
dcos package repo list
Universe: https://universe.mesosphere.com/repo
```

## <a name="finding-packages"></a>Searching for packages

To search for packages, run this CLI command:

```bash
dcos package search [--json <query>]
```

For example, this command searches for big data packages:

```bash
dcos package search "big data"
NAME   VERSION        SELECTED  FRAMEWORK  DESCRIPTION                                                                       
spark  1.0.9-2.1.0-1  True      False      Spark is a fast and general cluster computing system for Big Data.  Documenta...
```

## <a name="adding"></a>Adding a repository

To add a repo, run this command:

```bash
dcos package repo add <repo-name> <repo-url>
```

For example, this command adds a repo named `your-repo` with the URL `https://universe.yourcompany.com/repo`:

```bash
dcos package repo add your-repo https://universe.yourcompany.com/repo
```

For full instructions on how to build and run your own Universe repo see the [Universe Server Documentation](https://github.com/mesosphere/universe#universe-server)

## <a name="removing"></a>Removing a repository

To remove a repo, run this command:

```bash
dcos package repo remove <repo-name>
```

For example, this command removes a repo named `your-repo`:

```bash
dcos package repo remove your-repo
```
