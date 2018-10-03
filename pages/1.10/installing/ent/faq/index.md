---
layout: layout.pug
navigationTitle:  Frequently Asked Questions
title: Frequently Asked Questions
menuWeight: 203
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


## Q. Can I install DC/OS on an already running Mesos cluster?
We recommend starting with a fresh cluster to ensure all defaults are set to expected values. This prevents unexpected conditions related to mismatched versions and configurations.

## Q. What are the OS requirements of DC/OS?
See the [system requirements](/1.10/installing/ent/custom/system-requirements/).

## Q. Does DC/OS install ZooKeeper, or can I use my own ZooKeeper quorum?
DC/OS runs its own ZooKeeper supervised by Exhibitor and systemd, but users are able to create their own ZooKeeper quorums as well. The ZooKeeper quorum installed by default will be available at `master.mesos:[2181|2888|3888]`.

## Q. Is it necessary to maintain a bootstrap node after the cluster is created?
If you specify an Exhibitor storage backend type other than `exhibitor_storage_backend: static` in your cluster configuration [file](/1.10/installing/ent/custom/configuration/configuration-parameters/), you must maintain the external storage for the lifetime of your cluster to facilitate leader elections. If your cluster is mission critical, you should harden your external storage by using S3 or running the bootstrap ZooKeeper as a quorum. Interruptions of service from the external storage can be tolerated, but permanent loss of state can lead to unexpected conditions.

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

## Q. How do I restore the IAM database?

_To restore the IAM database from a file `~/iam-backup.sql` run the following commands on one of the master nodes_:

First, we create a new database called `iam_new` into which to load the backup.

```bash
sudo /opt/mesosphere/bin/cockroach sql --certs-dir=/run/dcos/pki/cockroach --host=$(/opt/mesosphere/bin/detect_ip) -e "CREATE DATABASE iam_new"
```

Next, we load the data into the new database.

```bash
sudo /opt/mesosphere/bin/cockroach sql --certs-dir=/run/dcos/pki/cockroach --host=$(/opt/mesosphere/bin/detect_ip) --database=iam_new < ~/iam-backup.sql
```

With the backup data loaded into the `iam_new` database, we now need to rename the `iam` database to `iam_old`.

*NOTE:* After this command is issued, the IAM is completely unavailable. Any requests to the IAM will fail.

```bash
sudo /opt/mesosphere/bin/cockroach sql --certs-dir=/run/dcos/pki/cockroach --host=$(/opt/mesosphere/bin/detect_ip) -e "ALTER DATABASE iam RENAME TO iam_old"
```

Finally, we rename the `iam_new` database to `iam`.

*NOTE:* After this command is issued, the IAM is available again. Requests to the IAM will once again succeed.

```bash
sudo /opt/mesosphere/bin/cockroach sql --certs-dir=/run/dcos/pki/cockroach --host=$(/opt/mesosphere/bin/detect_ip) -e "ALTER DATABASE iam_new RENAME TO iam"
```

The IAM database is restored from the backup file and the cluster is operational.
