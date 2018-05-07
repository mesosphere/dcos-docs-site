---
layout: layout.pug
navigationTitle:  Installation FAQ
title: Installation FAQ
menuWeight: 30
excerpt:
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


## Q. Can I install DC/OS on an already running Mesos cluster?
We recommend starting with a fresh cluster to ensure all defaults are set to expected values. This prevents unexpected conditions related to mismatched versions and configurations.

## Q. What are the OS requirements of DC/OS?
See the [system requirements](/1.11/installing-upgrading/custom/system-requirements/).

## Q. Does DC/OS install ZooKeeper, or can I use my own ZooKeeper quorum?
DC/OS runs its own ZooKeeper supervised by Exhibitor and systemd, but users are able to create their own ZooKeeper quorums as well. The ZooKeeper quorum installed by default will be available at `master.mesos:[2181|2888|3888]`.

## Q. Is it necessary to maintain a bootstrap node after the cluster is created?
If you specify an Exhibitor storage backend type other than `exhibitor_storage_backend: static` in your cluster configuration [file](/1.11/installing-upgrading/custom/configuration/configuration-parameters/), you must maintain the external storage for the lifetime of your cluster to facilitate leader elections. If your cluster is mission critical, you should harden your external storage by using S3 or running the bootstrap ZooKeeper as a quorum. Interruptions of service from the external storage can be tolerated, but permanent loss of state can lead to unexpected conditions.

## Q. How to add Mesos attributes to nodes to use Marathon constraints?

In DC/OS, add the line `MESOS_ATTRIBUTES=<key>:<value>` to the file `/var/lib/dcos/mesos-slave-common` (it may need to be created) for each attribute you'd like to add. More information can be found [via the Mesos doc](http://mesos.apache.org/documentation/latest/attributes-resources/).

## Q. How do I gracefully shut down an agent?

- _To gracefully kill an agent node's Mesos process and allow systemd to restart it, use the following command. _Note: If Auto Scaling Groups are in use, the node will be replaced automatically_:

    ```bash
    sudo systemctl kill -s SIGUSR1 dcos-mesos-slave
    ```
- _For a public agent:_

    ```bash
    sudo systemctl kill -s SIGUSR1 dcos-mesos-slave-public
    ```

- To gracefully kill the process and prevent systemd from restarting it, add a `stop` command:

    ```bash
    sudo systemctl kill -s SIGUSR1 dcos-mesos-slave && sudo systemctl stop dcos-mesos-slave
    ```

- _For a public agent:_

    ```bash
    sudo systemctl kill -s SIGUSR1 dcos-mesos-slave-public && sudo systemctl stop dcos-mesos-slave-public
    ```

## Q. How do I backup the IAM database?

- _To backup the IAM database to a file run the following command on one of the master nodes_:

    ```bash
    sudo /opt/mesosphere/bin/cockroach dump --certs-dir=/run/dcos/pki/cockroach --host=$(/opt/mesosphere/bin/detect_ip) iam > ~/iam-backup.sql
    ```

## Q. How do I disable authentication and telemetry?

### Disable Authentication

You can opt-out of the provided authentication by disabling it for your cluster. To disable authentication, add this parameter to your [`config.yaml`][4] file during installation (note this requires using the [CLI][1] or [advanced][2] installers):

```yaml
oauth_enabled: 'false'
```

**Note:** If you have already installed your cluster and would like to disable this in-place, you can go through an upgrade with the same parameter set.

### Disable Telemetry

You can opt-out of providing anonymous data by disabling telemetry for your cluster. To disable telemetry, you can either:

- Add this parameter to your [`config.yaml`][3] file during installation (note this requires using the [CLI][1] or [advanced][2] installers):

    ```yaml
    telemetry_enabled: 'false'
    ```
Or

- Add a flag to the custom installer, `dcos_generate_config.sh --cli-telemetry-disabled`, to disable the CLI basic telemetry. For more information, see the [documentation](/1.11/installing-upgrading/custom/cli-installer).


Note that if you’ve already installed your cluster and would like to disable this in-place, you can go through an [upgrade][3] with the same parameter set.

[1]: /1.11/installing-upgrading/custom/cli-installer/
[2]: /1.11/installing-upgrading/custom/advanced-installer/
[3]: /1.11/installing-upgrading/custom/configuration/configuration-parameters/
