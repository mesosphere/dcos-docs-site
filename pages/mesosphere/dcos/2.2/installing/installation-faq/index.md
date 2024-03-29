---
layout: layout.pug
navigationTitle:  Frequently Asked Questions
title: Frequently Asked Questions
menuWeight: 20
model: /mesosphere/dcos/2.2/data.yml
render: mustache
excerpt: Frequently asked questions about installing DC/OS
---


## Q. Can I install DC/OS on an already running Mesos cluster?
We recommend starting with a fresh cluster to ensure all defaults are set to expected values. This prevents unexpected conditions related to mismatched versions and configurations.

## Q. What are the OS requirements of DC/OS?
See the [system requirements](/mesosphere/dcos/{{ model.folder_version }}/installing/production/system-requirements/) documentation.

## Q. Does DC/OS install ZooKeeper?
DC/OS runs its own ZooKeeper supervised by Exhibitor and `systemd`.

## Q. Is it necessary to maintain a bootstrap node after the cluster is created?
If you specify an Exhibitor storage backend type other than `exhibitor_storage_backend: static` in your cluster configuration [file](/mesosphere/dcos/{{ model.folder_version }}/installing/production/advanced-configuration/configuration-reference/), you must maintain the external storage for the lifetime of your cluster to facilitate leader elections. If your cluster is mission critical, you should harden your external storage by using S3 or running the bootstrap ZooKeeper as a quorum. Interruptions of service from the external storage can be tolerated, but permanent loss of state can lead to unexpected conditions.

## Q. How can I add Mesos attributes to nodes to use Marathon constraints?

In DC/OS, add the line `MESOS_ATTRIBUTES=<key>:<value>` to the file `/var/lib/dcos/mesos-slave-common` (it may need to be created) for each attribute you want to add. See the [Mesos documentation](http://mesos.apache.org/documentation/latest/attributes-resources/) for more information.

## Q. How do I gracefully shut down an agent?

- To gracefully kill an agent node's Mesos process and allow `systemd` to restart it, run the following command.

    ```bash
    sudo systemctl kill -s SIGUSR1 dcos-mesos-slave
    ```

If Auto Scaling groups are in use, the node will be replaced automatically.

- For a public agent, run the following command:

    ```bash
    sudo systemctl kill -s SIGUSR1 dcos-mesos-slave-public
    ```

- To gracefully kill the process and prevent systemd from restarting it, add a `stop` command:

    ```bash
    sudo systemctl kill -s SIGUSR1 dcos-mesos-slave && sudo systemctl stop dcos-mesos-slave
    ```

- For a public agent, run the following command:

    ```bash
    sudo systemctl kill -s SIGUSR1 dcos-mesos-slave-public && sudo systemctl stop dcos-mesos-slave-public
    ```

<a name="iam-backup"></a>

## Q. How do I back up the IAM database?

- To back up the IAM database to a file run the following command on one of the master nodes:

```bash
dcos-shell iam-database-backup > ~/iam-backup.sql
```

## Q. How do I restore the IAM database?

- To restore the IAM database from a file `~/iam-backup.sql` run the following command on one of the master nodes:

```bash
dcos-shell iam-database-restore ~/iam-backup.sql
```

The IAM database is restored from the backup file and the cluster is operational.

<a name="zk-backup"></a>

## Q. How do I back up ZooKeeper?

To back up ZooKeeper, follow the guide to back up and restore the [DC/OS ZooKeeper State](/mesosphere/dcos/{{ model.folder_version }}/administering-clusters/backup-and-restore/backup-restore-cli/#zookeeper).
