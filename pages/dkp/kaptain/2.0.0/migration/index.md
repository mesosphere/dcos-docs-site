---
layout: layout.pug
navigationTitle: Migration
title: Migrate Kaptain
menuWeight: 7
excerpt: Migrate to Kaptain 2.0.0 on your cluster
beta: false
enterprise: false
---

Migrate from Kaptain 1.x installation to 2.0.0 on DKP 2.x.

## Background

Kaptain 2.0.0 is installed with Helm, rather than KUDO. As a result, migrating currently requires that you fully remove your prior Kaptain 1.x installation (including deployed models, profiles, notebooks, pipelines, etc.), and install Kaptain 2.0.0. Model artifacts are stored in your object store, therefore, you will not lose these as long as your model store is not deployed to the Kaptain namespace (that is you are not using the MinIO server).

<!-- TODO: Links to 1.3.0/uninstall and 2.0.0/install docs. -->
