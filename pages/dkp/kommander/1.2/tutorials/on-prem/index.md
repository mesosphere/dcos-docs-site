---
layout: layout.pug
beta: false
navigationTitle: Launching a cluster On Premise
title: Launching a cluster On Premises
menuWeight: 1
excerpt: Use a previously deployed Konvoy cluster to deploy a new Konvoy cluster with Kommander On Premises Provider.
---

## Prerequisites

You must have a `cluster.yaml` file and an `inventory.yaml` file for the cluster you are going to launch.

<p class="message--note"><strong>NOTE: </strong>If you don't have a `cluster.yaml` you can run `konvoy init` to generate one.
</p>

### Inventory file

Inventory file is an [Ansible inventory file](https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html).

Example:

```
control-plane:
  hosts:
    10.0.0.1:
      ansible_host: 10.0.0.1
      node_pool: control-plane
    10.0.0.2:
      ansible_host: 10.0.0.2
      node_pool: control-plane
    10.0.0.3:
      ansible_host: 10.0.0.3
      node_pool: control-plane

node:
  hosts:
    10.0.0.4:
      ansible_host: 10.0.0.4
      node_pool: worker
    10.0.0.5:
      ansible_host: 10.0.0.5
      node_pool: worker
    10.0.0.6:
      ansible_host: 10.0.0.6
      node_pool: worker
    10.0.0.7:
      ansible_host: 10.0.0.7
      node_pool: worker
bastion: {}
all:
  vars:
    order: sorted
    control_plane_endpoint: ""
    ansible_user: "<username>"
    ansible_port: 22
    version: v1beta1
```

### On Premise Provider

Once you have both `cluster.yaml` file and `inventory.yaml` file, you must add a provisioner for your provider. Follow these steps:

Make sure you have selected a workspace - for example the "Default Workspace".

- Go to **Administration / Infrastructure Providers**.

- Select the **Add Infrastructure Provider** button.

- Select **On Premise**.

- Enter a name for your provider and insert the full contents of your private ssh key, then select **Verify** and **Save**.

![On Premise Provider Form with values](/dkp/kommander/1.2/img/On-prem-provider-with-values.png)

### Launching the cluster

You can now launch your cluster.

Go to the **Clusters** section and select **Add Cluster**.

![Add Cluster](/dkp/kommander/1.2/img/clusters-header.png)

Select **Upload YAML** to create a cluster.

![Upload YAML](/dkp/kommander/1.2/img/add-cluster.png)

#### Fill out the form

- Enter a unique name for your cluster.

- At the top of the `cluster.yaml` text field, enter the following information:

```
kind: ClusterProvisioner
apiVersion: Konvoy.mesosphere.io/v1beta1
metadata:
  name: Konvoy-on-prem
spec:
  sshCredentials:
    user: "<username>"
  provider: none
---
```

<p class="message--important"><strong>IMPORTANT: </strong>You must paste the above <i>ClusterProvisioner</i> into the <i>cluster.yaml</i> field and then add the contents of your <code>cluster.yaml</code> after the three dashes. Replace <i>&lt;username&gt;</i> with the SSH user tied to the keys pushed to your machines. This is the same user tied to the key uploaded in the cloud provider step.</p>

- Ensure the Kommander addon is disabled with `enabled: false`.

```
spec:
  addons:
    addonsList:
    - name: kommander
      enabled: false
```

- Select your **On Premise Provider** created in the previous step.

- Paste the contents of your `inventory.yaml` file into the inventory field.

- Select **Continue**.

At this point Provisioning of your cluster should start. You can track the deployment progress with Kibana or `kubectl`as you normaly would in Kommander.
