---
layout: layout.pug
navigationTitle:  Frequently Asked Questions
title: Frequently Asked Questions
menuWeight: 20
excerpt: Frequently asked questions about installing DC/OS
---


## Q. Can I install DC/OS on an already running Mesos cluster?
We recommend starting with a fresh cluster to ensure all defaults are set to expected values. This prevents unexpected conditions related to mismatched versions and configurations.

## Q. What are the OS requirements of DC/OS?
See the [system requirements](/1.11/installing/production/system-requirements/) documentation.

## Q. Does DC/OS install ZooKeeper?
DC/OS runs its own ZooKeeper supervised by Exhibitor and `systemd`.

## Q. Is it necessary to maintain a bootstrap node after the cluster is created?
If you specify an Exhibitor storage backend type other than `exhibitor_storage_backend: static` in your cluster configuration [file](/1.11/installing/production/advanced-configuration/configuration-reference/), you must maintain the external storage for the lifetime of your cluster to facilitate leader elections. If your cluster is mission critical, you should harden your external storage by using S3 or running the bootstrap ZooKeeper as a quorum. Interruptions of service from the external storage can be tolerated, but permanent loss of state can lead to unexpected conditions.

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

[enterprise]
## Q. How do I backup the IAM database?
[/enterprise]

To backup the IAM database to a file run the following command on one of the master nodes:

    ```bash
    sudo /opt/mesosphere/bin/cockroach dump --certs-dir=/run/dcos/pki/cockroach --host=$(/opt/mesosphere/bin/detect_ip) iam > ~/iam-backup.sql
    ```

[enterprise]
## Q. How do I restore the IAM database?
[/enterprise]

To restore the IAM database from a file `~/iam-backup.sql` run the following commands on one of the master nodes:

1. First, we create a new database called `iam_new` into which to load the backup.

    ```bash
    sudo /opt/mesosphere/bin/cockroach sql --certs-dir=/run/dcos/pki/cockroach --host=$(/opt/mesosphere/bin/detect_ip) -e "CREATE DATABASE iam_new"
    ```

1. Next, we load the data into the new database.

    ```bash
    sudo /opt/mesosphere/bin/cockroach sql --certs-dir=/run/dcos/pki/cockroach --host=$(/opt/mesosphere/bin/detect_ip) --database=iam_new < ~/iam-backup.sql
    ```

1. With the backup data loaded into the `iam_new` database, we now need to rename the `iam` database to `iam_old`.

    ```bash
    sudo /opt/mesosphere/bin/cockroach sql --certs-dir=/run/dcos/pki/cockroach --host=$(/opt/mesosphere/bin/detect_ip) -e "ALTER DATABASE iam RENAME TO iam_old"
    ```

    <p class="message--note"><strong>NOTE: </strong>After this command is issued, the IAM is completely unavailable. Any requests to the IAM will fail.</p>

1. Finally, we rename the `iam_new` database to `iam`.

    ```bash
    sudo /opt/mesosphere/bin/cockroach sql --certs-dir=/run/dcos/pki/cockroach --host=$(/opt/mesosphere/bin/detect_ip) -e "ALTER DATABASE iam_new RENAME TO iam"
    ```
    <p class="message--note"><strong>NOTE: </strong>After this command is issued, the IAM is available again. Requests to the IAM will once again succeed.</p>

    The IAM database is restored from the backup file and the cluster is operational.

## Q. How do I backup ZooKeeper using Guano?

There may be instances where you need to backup the state of ZooKeeper. Use the following steps to backup ZooKeeper using Guano. 

1. Download the Guano ZooKeeper utility.

```bash
sudo wget https://s3.eu-central-1.amazonaws.com/adyatlov-public/guano-0.1a.jar.zip
```

2. Unzip the utility.

```bash
unzip guano-0.1a.jar.zip
```

3. Run the following command to backup your ZooKeeper state.

```bash
/opt/mesosphere/bin/dcos-shell java -jar guano-0.1a.jar -u super -p secret -d / -o /tmp/mesos-zk-backup -s $ZKHOST:2181 && tar -zcvf zkstate.tar.gz /tmp/mesos-zk-backup/
```

