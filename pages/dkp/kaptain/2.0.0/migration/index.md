---
layout: layout.pug
navigationTitle: Migration
title: Migrate Kaptain
menuWeight: 7
excerpt: Migrate to Kaptain 2.0.0 on your DKP cluster
beta: false
enterprise: false
---

Migrate your Kaptain 1.x installation to the latest version on DKP 2.x.

<p class="message--warning"><strong>WARNING: </strong>For this release, you will have to uninstall and install Kaptain to get to 2.0.0. When uninstalling Kaptain, all data, the current state, and configuration of your application will be lost.</p>

## Background

Previous versions of Kaptain were installed with KUDO. From 2.0.0 and later you can install Kaptain with Helm. As a result, migrating currently requires that you fully remove your prior Kaptain 1.x installation (including deployed models, profiles, notebooks, pipelines, etc.), and install Kaptain 2.0.0. Model artifacts are stored in your object store, therefore, you will not lose these as long as your model store is not deployed to the Kaptain namespace (that is, you are not using the MinIO server). However, **create a backup** of anything you want to keep or migrate to your new Kaptain installation.

## Uninstall Kaptain 1.x

Refer to [Uninstall documentation] for instructions on how to uninstall your KUDO-based Kaptain installation.

<!-- TODO: Links to 1.3.0/uninstall. -->

## Install Kaptain 2.x

Refer to [Install Kaptain documentation] for instructions on how to install your Helm-based Kaptain installation.

<!-- TODO: add link to install topic    [kap_install]: ../install/dkp/ -->
