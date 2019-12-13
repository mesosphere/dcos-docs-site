---
layout: layout.pug
navigationTitle:  Adding Users Manually
excerpt:
title: Adding Users Manually
menuWeight: 4
---

You can add users to your DC/OS cluster from a terminal by using the `dcos_add_user.py` script. This script is included by default with your DC/OS installation.

**Prerequisites:**

- DC/OS is [installed](/mesosphere/dcos/1.10/installing/)


1.  [SSH](/mesosphere/dcos/1.10/administering-clusters/sshcluster/) to a master node and run this command, where `<email>` is the user's email:

    ```bash
    sudo -i dcos-shell /opt/mesosphere/bin/dcos_add_user.py <email>
    ```
    
1.  Send the URL of your DC/OS cluster (e.g. `http://<public-master-ip>/`) to the new user. The user specified by `<email>` can now login and access the cluster.





