---
layout: layout.pug
navigationTitle: Upgrade
title: Upgrade
menuWeight: 30
excerpt: Upgrade options for DC/OS Kubernetes
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes-cluster -->

# Before you start

Currently, updating the package may trigger an update of a subset or all the components managed by this framework, depending on whether new versions of these components or related ones are part of the new release.

Updating these components means the Kubernetes cluster may experience some downtime or, in the worst-case scenario, cease to function properly.
And while we are committed to make the user experience as robust and smooth as possible, in fact is there is no such thing as fail-proof software.

<p class="message--important"><strong>IMPORTANT: </strong>Before updating the package version, proceed cautiously and always back up your data.</p>

In the future, we will be integrating the disaster-recovery functionality so you can easily revert to the previous functioning state.

## Updating package vs updating package options

When a new package is available, you will have the option to update to the new version.
If you have not updated the package in a while, it may be that an update to the most recent package version is not allowed and you will be informed on how to proceed.
Note that the DC/OS requires some additional [steps](#dcos) to update the package version.

However, you may only want to update package options, for example, in order to change the resources allocated to one type of Kubernetes component.
Keep in mind that package options updates may also mean the Kubernetes cluster may experience some downtime or, in the worst-case scenario, cease to function properly.

<p class="message--important"><strong>IMPORTANT: </strong>Before updating package options, proceed cautiously and always back up your data.</p>

# Updating the package version

Before starting the update process, it is mandatory to update the `kubernetes` CLI to the new version:

```shell
dcos package install kubernetes --cli --package-version=NEW-VERSION
```

To update the package, the `dcos kubernetes cluster update --cluster-name=CLUSTER-NAME` subcommand is available.

```shell
$ dcos kubernetes cluster update --cluster-name=CLUSTER-NAME -h
usage: dcos kubernetes cluster update --cluster-name=CLUSTER-NAME [<flags>]

Flags:
  -h, --help             Show context-sensitive help.
  -v, --verbose          Enable extra logging of requests/responses
      --version          Show application version.
      --cluster-name=CLUSTER-NAME
                         Name of the Kubernetes cluster
      --options=OPTIONS  Path to a JSON file containing the target package options
      --package-version=PACKAGE-VERSION
                         The target package version
      --yes              Do not ask for confirmation before starting the update process
      --timeout=1200s    Maximum time to wait for the update process to complete
```

<p class="message--important"><strong>IMPORTANT: </strong>Due to the number of variables such as the DC/OS cluster resources available, CPU and internet speed, etc., the installer cannot automatically determine a proper <tt>--timeout</tt> value and is recommended to increase it when updating larger clusters.</p>

## DC/OS Enterprise Edition

Starting the package version update:

```shell
$ dcos kubernetes cluster update  --cluster-name=CLUSTER-NAME --package-version=NEW-VERSION
About to start an update from version CURRENT-VERSION to NEW-VERSION

Updating these components means the Kubernetes cluster may experience some downtime or, in the worst-case scenario, cease to function properly. Before updating proceed cautiously and always back up your data.

This operation is long-running and has to run to completion.
Are you sure you want to continue? [yes/no] yes

2018/03/01 15:40:14 starting update process...
2018/03/01 15:40:15 waiting for update to finish...
2018/03/01 15:41:56 update complete!
```

## DC/OS

In contrast to the Enterprise edition, the package upgrade on the open source version of DC/OS requires some additional steps to achieve the same result.

1. First, export the current package configuration into a JSON file called `config.json`:

```shell
dcos kubernetes cluster describe --cluster-name=CLUSTER-NAME > config.json
```

2. Remove the DC/OS Kubernetes scheduler by running:

```shell
dcos marathon app remove /kubernetes-cluster
```

3. And then install the new version of the package:

```shell
dcos kubernetes cluster create --package-version=NEW-VERSION --options=config.json
```

# Updating the package options

This package exposes certain options that advanced users can use to adapt the Kubernetes cluster to their need.
For instance, you may want to increase the `kube-apiserver` count or the resources available to `kube-proxy`.
As an example, we will describe how to achieve the latter.

1. Assuming you have installed the package with its default options, all that is required is creating a `new_options.json` file with the following contents:

```json
{
  "kube_proxy": {
    "cpus": 0.5,
    "mem": 1024
  }
}
```

2. Run:

```shell
dcos kubernetes cluster update --cluster-name=CLUSTER-NAME --options=new_options.json
```

Here is the expected output:

```text
The following differences were detected between service configurations (CHANGED, CURRENT):
 ==  {
 ==  "kube_proxy": {
 -      "cpus": 0.1,
 +      "cpus": 0.5,
 -      "mem": 512,
 +      "mem": 1024,
 ==  }
 == }

The components of the cluster will be updated according to the changes in the options file [new_options.json].

Updating these components means the Kubernetes cluster may experience some downtime or, in the worst-case scenario, cease to function properly.  
Before updating proceed cautiously and always back up your data.

This operation is long-running and has to run to completion.
Are you sure you want to continue? [yes/no] yes

2018/03/01 15:40:14 starting update process...
2018/03/01 15:40:15 waiting for update to finish...
2018/03/01 15:41:56 update complete!
```

Some package options are special in the sense that they **must** only ever be updated **once** after package installation, and only towards a specific target value. Also, some package options **must not** be changed **at all** after the package is installed for the first time.

These package options are:

| Property                                            |         ONCE        | ALWAYS | NEVER |
|-----------------------------------------------------|:-------------------:|:------:|:-----:|
| `service.name`                                      |          --         |   --   |   X   |
| `service.virtual_network_name`                      |          --         |    X   |   --  |
| `service.service_account_secret`                    |          --         |   --   |   X   |
| `service.service_account`                           |          --         |   --   |   X   |
| `service.sleep`                                     |          --         |    X   |   --  |
| `service.log_level`                                 |          --         |    X   |   --  |
| `etcd.disk_type`                                    |          --         |   --   |   X   |
| `etcd.data_disk`                                    |          --         |   --   |   X   |
| `etcd.wal_disk`                                     |          --         |   --   |   X   |
| `etcd.cpus`                                         |          --         |    X   |   --  |
| `etcd.mem`                                          |          --         |    X   |   --  |
| `kubernetes.authorization_mode`                     |          --         |   --   |   X   |
| `kubernetes.high_availability`                      | X (`false`->`true`) |   --   |   --  |
| `kubernetes.service_cidr`                           |          --         |   --   |   X   |
| `kubernetes.use_agent_docker_certs`                 |          --         |    X   |   --  |
| `kubernetes.control_plane_placement`                |          --         |    X   |   --  |
| `kubernetes.control_plane_reserved_resources.cpus`  |          --         |    X   |   --  |
| `kubernetes.control_plane_reserved_resources.mem`   |          --         |    X   |   --  |
| `kubernetes.control_plane_reserved_resources.disk`  |          --         |    X   |   --  |
| `kubernetes.private_node_count`                     |          --         |    X   |   --  |
| `kubernetes.private_node_placement`                 |          --         |    X   |   --  |
| `kubernetes.private_reserved_resources.kube_disk`   |          --         |    X   |   --  |
| `kubernetes.private_reserved_resources.kube_mem`    |          --         |    X   |   --  |
| `kubernetes.private_reserved_resources.kube_cpus`   |          --         |    X   |   --  |
| `kubernetes.private_reserved_resources.system_mem`  |          --         |    X   |   --  |
| `kubernetes.private_reserved_resources.system_cpus` |          --         |    X   |   --  |
| `kubernetes.public_node_count`                      |          --         |    X   |   --  |
| `kubernetes.public_node_placement`                  |          --         |    X   |   --  |
| `kubernetes.public_reserved_resources.kube_mem`     |          --         |    X   |   --  |
| `kubernetes.public_reserved_resources.kube_cpus`    |          --         |    X   |   --  |
| `kubernetes.public_reserved_resources.system_mem`   |          --         |    X   |   --  |
| `kubernetes.public_reserved_resources.system_cpus`  |          --         |    X   |   --  |
| `kubernetes.public_reserved_resources.kube_disk`    |          --         |    X   |   --  |
| `calico.calico_ipv4pool_cidr`                       |          --         |    X   |   --  |
| `calico.cni_mtu`                                    |          --         |    X   |   --  |
| `calico.ip_autodetection_method`                    |          --         |    X   |   --  |
| `calico.ipv4pool_ipip`                              |          --         |    X   |   --  |
| `calico.felix_ipinipmtu`                            |          --         |    X   |   --  |
| `calico.felix_ipinipenabled`                        |          --         |    X   |   --  |
| `calico.typha.enabled`                              |          --         |    X   |   --  |
| `calico.typha.replicas`                             |          --         |    X   |   --  |

Please make sure you understand and respect these rules. Otherwise you may render your cluster unusable and risk losing data.
