---
layout: layout.pug
navigationTitle: Fresh install
title: Fresh install of Kaptain
menuWeight: 8
excerpt: Do a fresh install of Kaptain on your DKP cluster
beta: false
enterprise: false
---

Due to a major update in Kaptain's lifecycle management tooling, migrating and upgrading your 1.x installation to 2.x is **not possible**. To ensure that you are up-to-date with the latest features, and can benefit from the most recent performance improvements, we recommend that you uninstall your Kaptain version and do a fresh install of the latest available version.

<p class="message--warning"><strong>WARNING: </strong>For this release, you will have to do a fresh install. By uninstalling Kaptain 1.x, all of your Kaptain-related data such as user profiles, notebooks, pipelines, deployed models, etc. will be lost <strong>permanently</strong>.</p>

## Background

Previous versions of Kaptain were installed with KUDO. From 2.0.0 and later, you can install Kaptain with Helm. As a result, migrating is currently not possible, and moving to 2.x requires that you fully remove your prior Kaptain 1.x installation (including user profiles, notebooks, pipelines, deployed models, etc.), and do a fresh install of Kaptain.

## Uninstall Kaptain

Refer to [Uninstall documentation][uninstall_kap] for instructions on how to uninstall your KUDO-based Kaptain version.

## Fresh install of Kaptain

Refer to [Install Kaptain documentation][install_kap] for instructions on how to install your Helm-based Kaptain version in networked, on-premises and air-gapped environments.

[install_kap]: ../install
[uninstall_kap]: ../../1.3.0/uninstall
