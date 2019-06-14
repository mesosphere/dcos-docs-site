---
layout: layout.pug
navigationTitle:  Replace a master node
title: Replace a master node
menuWeight: 800
excerpt: Replacing a master node in an existing DC/OS cluster
enterprise: true
---
You can replace a master node in an existing DC/OS cluster. You should keep in mind, however, that you should only ever replace one master at a time. The following steps summarize how to replace a master node for a DC/OS cluster.

# To replace a master node
1. Back up ZooKeeper state information using Exhibitor, the Guano utility, or a custom script.

    For example, if you download and extract the Guano utility, you can run a command similar to the following on the master node:

    ```bash
    dcos-shell java -jar guano-0.1a.jar -u super -p secret -d / -o /tmp/mesos-zk-backup -s $ZKHOST:2181 && tar -zcvf zkstate.tar.gz /tmp/mesos-zk-backup/
    ```
    For more information about backing up ZooKeeper using the Guano utility, see [How do I backup ZooKeeper using Guano?](/1.12/installing/installation-faq/#zk-backup)

1. Back up the DC/OS identity and access management CockroachDB database to a file by running a command similar to the following on the master node:

    ```bash
    dcos-shell iam-database-backup > ~/iam-backup.sql
    ```

    For more information about backing up the DC/OS identity and access management CockroachDB database, see [How do I backup the IAM database?](/1.12/installing/installation-faq/#iam-backup)

1. Shut down the master node you want to replace.

1. Add the new master node to replace the one taken offline in the previous step.

    **Static master discovery**

    If you have configured **static master discovery** in your `config.yaml` file (`master_discovery: static`):
    - Verify that the new server has the same internal IP address as the old master node.
    - Verify that the old server is completely unreachable from the cluster.
    - Install the new master as you would normally.
    
    **Dynamic master discovery**

    If you have configured **dynamic master discovery** in your `config.yaml` file ( `master_discovery: master_http_loadbalancer`):
    - Install the new master as you would normally.

1. Check that the new master is healthy.

    <p class="message--important"><strong>IMPORTANT: </strong>This step is required. Be sure to confirm that the new master has joined the cluster successfully before replacing any additional master nodes or performing any additional administrative tasks.</p>
    
    To validate that the master node replacement completed successfully, follow the steps to Validate the upgrade as described in [Upgrading a master](/1.12/installing/production/upgrading/).
