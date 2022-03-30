---
layout: layout.pug
navigationTitle: Generate a Support Bundle
title: Generate a Support Bundle
excerpt: Generate a Support Bundle
beta: false
enterprise: false
render: mustache
menuWeight: 10
---

Follow these instructions to generate a support bundle with data collected for the last 48 hours of the life of the cluster.

## Prerequisites

Before generating a support bundle, verify that you have:

- An AMD64-based Linux or macOS machine with a supported version of the operating system.
- A running Kubernetes cluster.
- `dkp-diagnose` command for [macOS][dkp-diagnostics-darwin] or [Linux][dkp-diagnostics-linux] for collecting the support bundle.

## Download dkp-diagnose

1.  To download and extract the `dkp-diagnose` binary for [macOS][dkp-diagnostics-darwin] or [Linux][dkp-diagnostics-linux]

    For Linux:

    ```bash
    mkdir dkp-diagnose && curl -sL https://downloads.mesosphere.io/dkp/dkp-diagnose_v0.4.1_linux_amd64.tar.gz | tar -xz -C ./dkp-diagnose/
    ```

    For macOS:

    ```bash
    mkdir dkp-diagnose && curl -sL https://downloads.mesosphere.io/dkp/dkp-diagnose_v0.4.1_darwin_amd64.tar.gz | tar -xz -C ./dkp-diagnose/
    ```

1.  Add the binary to your PATH:

    ```bash
    export PATH=./dkp-diagnose/:$PATH
    ```

1.  Verify the binary works:

    ```bash
    dkp-diagnose version
    ```

## Create a diagnostic bundle

`dkp-diagnose` was developed by D2iQ and builds on the open source `troubleshoot.sh` project.

<p class="message--note"><strong>NOTE:</strong> <code>dkp-diagnose</code> is based on version <code>0.13.16</code> of <code>troubleshoot.sh</code> with custom modifications. The D2iQ fork is open source and available from <a href="https://github.com/mesosphere/troubleshoot">on this public GitHub repository</a>.</p>

`dkp-diagnose` supports [multiple support bundle collectors][troubleshoot-collectors] and
can be configured as a `SupportBundle` Kubernetes resource in a yaml file.

The following list is the minimum set of resources that is required to debug a cluster, but can be further customized.

The bundle uses the following collectors:

- [clusterInfo][clusterInfo-collector] collects basic information about the cluster
- [clusterResources][clusterResources-collector] collects a subset of available resources in the cluster
- [configMap][configMap-collector] collects the values of Kubernetes ConfigMaps
- [secrets][secrets-collector] collects the values of Kubernetes ConfigMaps
- [execCopyFromHost](/custom-collectors#execcopyfromhost_collector) runs a container on each node on the cluster and copies the created data
- [allLogs](/custom-collectors#alllogs_collector) is capable of collecting logs from all containers on the cluster

## Generate a Support Bundle

<p class="message--note"><strong>NOTE: </strong><code>dkp-diagnose</code> uses the same Kubernetes configuration as <code>kubectl</code>. <code>dkp-diagnose</code> can also be pointed at a specific configuration by using the <code>--kubeconfig</code> parameter.</p>

To generate the support bundle, perform the following steps:

1.  Run the `dkp-diagnose` command by running the default collectors configuration.

    ```bash
    dkp-diagnose
    ```

    ```sh
    Collecting support bundle ...

    support-bundle-2021-08-13T14_44_23.tar.gz
    ```

1.  To view the bundle contents, extract the bundle (replacing `support-bundle-2021-08-13T14_44_23.tar.gz` with the location from the previous step):

    ```bash
    tar -xzvf support-bundle-2021-08-13T14_44_23.tar.gz
    ```

1.  A new directory named `support-bundle-<date-created>`is created. This directory contains the files specified:

    ```bash
    ls support-bundle-2021-08-13T14_44_23
    ```

    ```sh
    cluster-info  cluster-resources  configmaps  node-diagnostics  pod-logs  secrets  version.yaml
    ```

### Collect information from a bootstrap cluster

In the case where your bootstrap cluster has not yet pivoted towards your DKP cluster, you can collect log information from that bootstrap cluster as well, and there are a preconfigured set of relevant collectors. Specify an additional bootstrap cluster kubeconfig using the `--bootstrap-kubeconfig` parameter to activate bootstrap cluster diagnostics. You will receive an additional support bundle named `bootstrap-support-bundle-<date created>`.

Note that the bootstrap cluster diagnostics are independent of the configuration of the "main" or DKP cluster diagnostics. We run a static collector set that collects the following bootstrap cluster information:

- ClusterInfo
- ClusterResources
- AllLogs
- ConfigMaps
- Secrets

1. Run the `dkp-diagnose` command with bootstrap bundle configuration.

```bash
    dkp-diagnose bundle.yaml
```

### Customizations

To print the default collectors configuration, run the following command:

```bash
dkp-diagnose default-config > bundle.yaml
```

Edit the file to make appropriate modifications.

<p class="message--note"><strong>NOTE: </strong><code>dkp-diagnose</code> by default does not require that you supply a configuration. The default bundle configuration can be printed by running <code>dkp-diagnose default-config</code>.</p>

## SSH fallback

In some cases the Kubernetes API is not available for the cluster. In those cases you can collect node level information using SSH access to the diagnosed nodes. Be aware that not all clusters have SSH access configured. If they do not then access using SSH fallback is not possible.

To get node level information from your cluster using SSH access, perform the following steps:

1. Enter the following command:

```bash
dkp-diagnose ssh <path/to/ansible-inventory.yaml>
```

The `ansible-inventory.yaml` file specifies the nodes to access for data collection.

<p class="message--note"><strong>NOTE: </strong>This collector does not use the full Ansible <code>inventory.yaml</code> format only a limited subset to describe the infrastructure.</p>

Only the following attributes of the `ansible-inventory.yaml` are supported. All other group definitions are ignored.

-   Support for `all` shared variables.
-   Support for `hosts` key in `all` groups.
-   Supported behavioral inventory is limited to:
    - `ansible_host`
    - `ansible_port`
    - `ansible_user`
    - `ansible_ssh_private_key_file`

    The following is an example `inventory.yaml` file:

```yaml
all:
  vars:
    ansible_user: centos
  hosts:
    host-1:
      ansible_host: 192.168.10.1
    host-2:
      ansible_host: 192.168.10.22
      ansible_port: 2222
```

More information on these Ansible parameters can be found in the [Ansible user guide](https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html#connecting-to-hosts-behavioral-inventory-parameters).

<p class="message--note"><strong>NOTE: </strong>All other group definitions in the <code>inventory.yaml</code> file are ignored.</p>

Refer to the following example file:

```yaml
all:
  vars:
    ansible_user: centos
  hosts:
    host-1:
      ansible_host: 192.168.10.1
    host-2:
      ansible_host: 192.168.10.22
      ansible_port: 2222
```

The fallback collector runs a bash script over SSH and copies the collected data. The format of the created bundle matches that of `dkp-diagnose` collector generated bundles.

```sh
    node-diagnostics/<HOSTNAME_PORT>/data/
        - dmesg
        - ....
```

Redactors are supported and are in the same format as the main `dkp-diagnose` command. Per node collection timeouts are supported using the `--timeout` parameter.

[clusterInfo-collector]: https://troubleshoot.sh/docs/collect/cluster-info/
[clusterResources-collector]: https://troubleshoot.sh/docs/collect/cluster-resources/
[configMap-collector]: https://troubleshoot.sh/docs/collect/configmap/
[copyFromHost-collector]: https://troubleshoot.sh/docs/collect/copy-from-host/
[dkp-diagnostics-darwin]: https://downloads.mesosphere.io/dkp/dkp-diagnose_v0.4.1_darwin_amd64.tar.gz
[dkp-diagnostics-linux]: https://downloads.mesosphere.io/dkp/dkp-diagnose_v0.4.1_linux_amd64.tar.gz
[exec-collector]: https://troubleshoot.sh/docs/collect/exec/
[logs-collector]: https://troubleshoot.sh/docs/collect/logs/
[secrets-collector]: https://troubleshoot.sh/docs/collect/secret/
[troubleshoot-collectors]: https://troubleshoot.sh/docs/collect/all/
