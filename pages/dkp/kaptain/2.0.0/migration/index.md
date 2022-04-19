---
layout: layout.pug
navigationTitle: Migration
title: Migrate Kaptain
menuWeight: 7
excerpt: Migrate to Kaptain 2.0.0 on your DKP cluster
beta: false
enterprise: false
---

Due to a major update in Kaptain's lifecycle management tool, migrating your 1.x installation to 2.x is **not possible**. To ensure that you are up-to-date with the latest features, and can benefit from the most recent performance improvements, we recommend that you uninstall your Kaptain version and do a fresh install of the latest available version. 

<p class="message--warning"><strong>WARNING: </strong>For this release, you will have to uninstall and install Kaptain to get to the latest version. Because this is a fresh install, ensure you back up all of your data before proceeding.</p>

## Background

Previous versions of Kaptain were installed with KUDO. From 2.0.0 and later, you can install Kaptain with Helm. As a result, migrating currently requires that you fully remove your prior Kaptain 1.x installation (including deployed models, profiles, notebooks, pipelines, etc.), and install Kaptain 2.0.0. Model artifacts are stored in your object store, therefore, you will not lose these as long as your model store is not deployed to the Kaptain namespace (that is, you are not using the MinIO server). However, **create a backup** of all your required data.

## Uninstall Kaptain

Refer to [Uninstall documentation][uninstall_kap] for instructions on how to uninstall your KUDO-based Kaptain version.

## Fresh install of Kaptain

Refer to [Install Kaptain documentation][install_kap] for instructions on how to install your Helm-based Kaptain version in networked, on-premises and air-gapped environments.

[install_kap]: ../install
[uninstall_kap]: ../../1.3.0/uninstall
