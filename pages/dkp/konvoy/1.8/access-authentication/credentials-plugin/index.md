---
layout: layout.pug
navigationTitle: Credentials Plugin
title: Install the Credentials Plugin
menuWeight: 10
beta: false
excerpt: Install and configure the Konvoy Credentials Plugin.
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

The Konvoy credentials plugin makes it easy to use external identity providers with `kubectl`. When using the plugin, `kubectl` initiates an authentication session in your browser storing identity tokens locally. When a token expires, the plugin starts a new authentication session and refreshes the token.

## Before you begin

You need certain software configurations and settings before you start this procedure. This procedure requires the following items and configurations:

- A running Konvoy cluster

- The IP address of your running cluster. (This address is represented in this topic as **your-cluster-IP** and is a placeholder for your cluster IP address. Insert your cluster IP address in these locations.)

<p class="message--note"><strong>NOTE: </strong>You can access this plugin, these instructions, and set variables used, at this location: <strong>https://your-cluster-IP/ops/landing</strong>. Select the <strong>Credentials Plugin instructions</strong> button.</p>

## Configure the Konvoy credentials plugin

The following procedures describe how to configure the Konvoy credentials plugin:

- [Download a kubectl configuration file](#download-a-kubectl-configuration-file)

- [Manual configuration](#manual-configuration)

## Download a kubectl configuration file

Download the plugin binary and a cluster generated `kubectl` configuration file. If you are using Kommander and add a new cluster, come back to this page to download an updated kubeconfig.

1. Download a plugin binary and `Kubectl` configuration. Select the correct link for your platform:

   | Operating System  | Plugin Binary and `kubectl` Location                         |
   | ----------------- | ------------------------------------------------------------ |
   | **Mac OS/Darwin** | - `https://your-cluster-IP/token/static/downloads/darwin/konvoy-async-auth_v0.1.3/konvoy-async-plugin`<br />- `https://your-cluster-IP/token//plugin/kubeconfig` |
   | **Linux**         | - `https://your-cluster-IP/token/static/downloads/linux/konvoy-async-auth_v0.1.3/konvoy-async-plugin`<br />- `https://your-cluster-IP/token//plugin/kubeconfig` |
   | **Windows**       | - `https://your-cluster-IP/token/static/downloads/windows/konvoy-async-auth_v0.1.3/konvoy-async-plugin.exe`<br />- `https://your-cluster-IP/token//plugin/kubeconfig_windows` |

1.  Download both files to your computer. On Linux and MacOs, mark the plugin as an executable file. Enter the following command:

    ```bash
    chmod +x konvoy-async-plugin
    ```

1.  Copy the binary file to a location in your PATH environment variable. `/usr/local/bin` is a good location for the Linux and MacOS platforms.

### Running kubectl

1.  Configure `kubectl` to use the plugin. Enter the following command:

    ```bash
    kubectl --kubeconfig </path/to/downloaded/config> get pods -A
    ```

1.  Set the `KUBECONFIG` environment variable to avoid typing `--kubeconfig` each time you run the command. Enter the following command:

    ```bash
    export KUBECONFIG=</path/to/downloaded/config>
    ```

### Using Contexts

If this cluster is managing authentication for external clusters deployed by Kommander, you must set the correct `kubectl` **context**. The generated kubeconfig has contexts for each cluster managed by Kommander.

1.  List each context using the following command:

    ```bash
    kubectl --kubeconfig </path/to/downloaded/kubeconfig> config get-contexts
    ```

1.  To select a different context, use the following command:

    ```bash
    kubectl --kubeconfig </path/to/downloaded/kubeconfig> use-context context-name
    ```

For more information on using and managing kubeconfig files, refer to this documentation:

- [Organizing Cluster Access Using kubeconfig Files](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/)

- [Configure Access to Multiple Clusters](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)

## Manual configuration

These instructions configure your global kubeconfig, located at `${HOME}/.kube/config.`

<p class="message--note"><strong>NOTE: </strong>The following commands can be pasted directly into a terminal.</p>

### Download and Install Konvoy credentials plugin

Use the command for your operating system to download and install the plugin.

#### OSX

```bash
curl --create-dirs https://your-cluster-IP/token/static/downloads/darwin/konvoy-async-auth_v0.1.3/konvoy-async-plugin \
      -o ${HOME}/.kube/konvoy/bin/konvoy-async-plugin && \
      chmod +x ${HOME}/.kube/konvoy/bin/konvoy-async-plugin
```

#### LINUX

```bash
curl --create-dirs https://<your-cluster-IP>/token/static/downloads/linux/konvoy-async-auth_v0.1.3/konvoy-async-plugin \
      -o ${HOME}/.kube/konvoy/bin/konvoy-async-plugin && \
      chmod +x ${HOME}/.kube/konvoy/bin/konvoy-async-plugin
```

#### Windows

Enter this command in your browser:

```bash
https://your-cluster-IP/token/static/downloads/windows/konvoy-async-auth_v0.1.3/konvoy-async-plugin.exe
```

### Select cluster

This cluster handles authentication for multiple clusters using Kommander. Determine the cluster you want to configure. You can use these commands again to configure multiple clusters.

### Create a cluster configuration

```bash
kubectl config set-cluster your-cluster-IP \
    --server=https://your-cluster-IP/konvoy/api-server
```

### Create kubeconfig user profile

The default profile name is fine for most use cases. If you plan to authenticate with the same cluster, using multiple user accounts, you must create a profile for each user. Use your profile name in the following commands:

```bash
kubectl config set-credentials your-profile-name \
  --exec-command=konvoy/bin/konvoy-async-plugin \
  --exec-api-version=client.authentication.k8s.io/v1beta1 \
  --exec-arg="-auth-url=https://your-cluster-IP/token/" \
  --exec-arg="-kubeconfig-user=your-profile-name"
```

### Create the context

```bash
kubectl config set-context default-profile-your-cluster-IP \
      --cluster=your-cluster-IP \
      --user=your-profile-name
```

### Set the active context

```bash
kubectl config use-context your-profile-name.ksphere-platform.d2iq.cloud
```

Enter the following simple `kubectl` command:

```bash
    kubectl get pods -A
```

This opens a browser window and lets you authenticate. If you are using a remote terminal, a link displays. Copy and paste this link into a local browser window.

This Docker image includes code from the MinIO Project (“MinIO”), which is © 2015-2021 MinIO, Inc. MinIO is made available subject to the terms and conditions of the GNU Affero General Public License 3.0. The complete source code for the version of MinIO packaged with DKP/Konvoy 1.8/Kommander 1.4 is available at this URL: https://github.com/minio/minio/tree/RELEASE.2020-12-03T05-49-24Z

For a full list of attributed 3rd party software, see [D2IQ Legal](https://d2iq.com/legal/3rd).
