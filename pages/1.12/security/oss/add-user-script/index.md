---
layout: layout.pug
navigationTitle:  Adding Users Manually
excerpt: Ading users manually
title: Adding Users Manually
menuWeight: 4
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

You can add users to your DC/OS cluster from a terminal by using the `dcos_add_user.py` script. This script is included by default with your DC/OS installation.

**Prerequisites:**

- DC/OS is [installed](/1.11/installing/oss/)


1.  [SSH](/1.11/administering-clusters/sshcluster/) to a master node and run this command, where `<email>` is the user's email:

    ```bash
    sudo -i dcos-shell /opt/mesosphere/bin/dcos_add_user.py <email>
    ```

1.  Send the URL of your DC/OS cluster (e.g. `http://<public-master-ip>/`) to the new user. The user specified by `<email>` can now login and access the cluster.
