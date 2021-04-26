---
layout: layout.pug
beta: false
navigationTitle: Install
title: Install
menuWeight: 3
excerpt: Getting started with Kommander
---

Kommander is a tool that provides a command console for deploying, monitoring, and managing production-ready Kubernetes clusters on an enterprise scale. Kommander supports both Konvoy and non-Konvoy clusters.

# Before you begin
Prerequisites for Kommander are the same as those for Konvoy. See the [Konvoy Prerequisites](/dkp/konvoy/1.7/quick-start/#prerequisites) for information.

# Download and Install
By default, Konvoy provides Kommander as part of [Kubernetes Base Addons](/dkp/konvoy/1.7/addons/). See the [Download Konvoy](/dkp/konvoy/1.7/download/) topic for more information on how to download Konvoy. Once Konvoy is downloaded, see [Installing Konvoy](/dkp/konvoy/1.7/quick-start/#installing-konvoy) for installation instructions. After Konvoy is installed with the default settings, Kommander is automatically provided on the cluster.

# Log in with Username and Password
After you provision your first Konvoy cluster, your randomly-generated username, password, and a URL to Konvoy are printed to the command-line. Log in to Konvoy, and look for the "Kommander" button in the left sidebar. If it's not there, ensure you've installed the Konvoy release that includes Kommander, and that the Kommander addon is enabled.

To retrieve the login information again, use the following command:

```
konvoy get ops-portal
```

You can also reach the Kommander UI via this url, given that Kommander is deployed on the cluster:

```
https://<CLUSTER_URL>/ops/portal/kommander/ui
```
