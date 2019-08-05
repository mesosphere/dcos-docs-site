---
layout: layout.pug
navigationTitle: Accessing the cluster
title: Accessing the cluster
menuWeight: 1
excerpt: Access the Konvoy cluster using the operations portal, command-line interface, or kubectl
enterprise: false
---

## Using the operations portal

When Konvoy completes the provisioning of the cluster, it provides the access details of the cluster's operations portal.

```text
Kubernetes cluster and addons deployed successfully!

Run `konvoy apply kubeconfig` to update kubectl credentials.

Navigate to the URL below to access various services running in the cluster.
  https://lb_addr-12345.us-west-2.elb.amazonaws.com/ops/landing
And login using the credentials below.
  Username: AUTO_GENERATED_USERNAME
  Password: SOME_AUTO_GENERATED_PASSWORD_12345

The dashboard and services may take a few minutes to be accessible.
```

This can also be retrieved after the cluster is deployed, with the following command, provided you have an administraive `admin.conf` KUBECONFIG file:

```bash
konvoy get ops-portal
```

The URL provided in these details offers access to the _operations portal_, a web UI which links to various dashboards of the tooling integrated on Konvoy Kubernetes clusters.
This UI is hosted on a web application within the cluster, which runs on the cluster's ingress load balancer.

1. Enter that URL in your browser.
2. Click the "Launch Console" button
3. Enter your username and password as noted above, and click "Login".

You'll then see Konvoy's operations portal, which offers an overview of cluster status, and shortcuts to several dashboards to addon services such as Grafana.

## Using kubectl

One of the most common ways to perform administrative tasks and interact with a Kubernetes cluster is through the `kubectl` command-line interface.
With `kubectl`, you can run commands against native Kubernetes clusters to retrieve information about key cluster activities and to control specific cluster-level components and operations.

For example, you can use `kubectl` to:

- Deploy applications
- Manage cluster resources
- View logs and status messages

For a complete list of `kubectl` operations, see [Overview of kubectl](https://kubernetes.io/docs/reference/kubectl/overview/).

### Install kubectl

The specific steps required in install kubectl depend on your operating system platform.
For platform-specific instructions to help you install kubectl, see the appropriate Kubernetes [installation and setup information][0] for the platform you use.

### Configure kubectl (for cluster administrators)

The `kubectl` program uses information in its configuration file to customize operations for a specific cluster.
By default, the configuration file for `kubectl` is named `config` and is located in the `$HOME/.kube` directory.
You can specify other `kubeconfig` files by setting the `KUBECONFIG` environment variable or by setting the `--kubeconfig` flag.

After you create a cluster with the `konvoy up` command, the simplest way to add that cluster's `kubectl` configuration to either the default  `~/.kube/config` file or to the file you have specified using the `KUBECONFIG` environment variable is to run the following `konvoy` command:

```bash
konvoy apply kubeconfig
```

The `konvoy apply kubeconfig` command applies the contents of the local Konvoy `admin.conf` configuration file to your existing default configuration.

### Configure kubectl (for authorized users)

This section illustrates how non-administrative users could access the cluster's API, using `kubectl` and credentials derived from their third-party single-sign-on environment.

1. Enter the URL of the operations portal in your browser, as noted in [Using the operations portal](#using-the-operations-portal).
2. Click the "Generate kubectl token" button.
3. Select the appropriate Kubernetes cluster authenticator (usually shown as `Kubernetes cluster`).
4. Log in using your username and password, or using a third-party integrated sign-on.
5. Follow instructions and execute commands in your terminal, as directed on the page.

**NOTE** by default, new users who log in this way will *NOT* have permissions on the cluster's API.
Your cluster administrator must grant you permissions on the cluster, through a Kubernetes [role-binding][role_binding].

An unprivileged user will receive errors like the following via `kubectl`:

```text
Error from server (Forbidden): nodes is forbidden: User "${USERNAME}" cannot list resource "nodes" in API group "" at the cluster scope
```

Supposing your user should have administrative permissions, the following command will grant them full cluster administration:

```bash
kubectl create clusterrolebinding rb_admin_${USERNAME} --clusterrole=cluster-admin --user=${USERNAME}
```

### Common kubectl command examples

The following sections highlight several important commands that are particularly relevant for working with **konvoy** clusters.
For information about other commands that are generally useful, see [the kubectl cheatsheet][1].

#### Viewing addons and system pods

Konvoy clusters come with a series of addons deployed.
These addons live in one of three namespaces:

- `kube-system`: Core Kubernetes components, and a limited set of addons that require administrative access to the cluster deploy here
- `velero`: Velero (used for cluster backup and restore) and its components are deployed here
- `kubeaddons`: Most addons will be deployed here unless otherwise specified

For a basic status check of all the addon- and system-related pods, run the following commands:

```bash
kubectl -n kube-system get pods
kubectl -n velero get pods
kubectl -n kubeaddons get pods
```

[0]:https://kubernetes.io/docs/tasks/tools/install-kubectl/
[1]:https://kubernetes.io/docs/reference/kubectl/cheatsheet/
[role_binding]: https://kubernetes.io/docs/reference/access-authn-authz/rbac/#rolebinding-and-clusterrolebinding
