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
Prerequisites for Kommander are the same as those for Konvoy. See the [Konvoy Prerequisites][konvoy-prereq] for information.

# Download and Install
By default, Konvoy provides Kommander as part of [Kubernetes Base Addons][konvoy-base-addons]. See the [Download Konvoy][konvoy-download] topic for more information on how to download Konvoy. Once Konvoy is downloaded, see [Installing Konvoy][konvoy-install] for installation instructions. After Konvoy is installed with the default settings, Kommander is automatically provided on the cluster.

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
This Docker image includes code from the MinIO Project (“MinIO”), which is © 2015-2021 MinIO, Inc. MinIO is made available subject to the terms and conditions of the [GNU Affero General Public License 3.0][https://www.gnu.org/licenses/agpl-3.0.en.html]. The complete source code for the versions of MinIO packaged with Kommander 1.4.0 are available at these URLs:

* https://github.com/minio/minio/tree/RELEASE.2021-07-30T00-02-00Z
* https://github.com/minio/minio/tree/RELEASE.2020-12-03T05-49-24Z

[konvoy-base-addons]: /dkp/konvoy/1.8/addons/
[konvoy-download]: /dkp/konvoy/1.8/download/
[konvoy-install]: /dkp/konvoy/1.8/quick-start/#installing-konvoy
[konvoy-prereq]: /dkp/konvoy/1.8/quick-start/#prerequisites
