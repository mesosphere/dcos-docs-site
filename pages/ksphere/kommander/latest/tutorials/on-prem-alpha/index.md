---
layout: layout.pug
navigationTitle: Launching a cluster On Premise
title: Launching a cluster On Premise (Alpha)
preview: true
excerpt: Use a previously deployed Konvoy cluster to deploy a new Konvoy cluster with Kommander On Premise Provider
---

## Previous Setup

Assuming you have the `cluster.yaml` and `inventory.yaml` for the cluster you are going to launch.

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

Once we've got both `cluster.yaml` and `inventory.yaml` the next step will be to add a provisioner for your provider.

1. Navigate to Administration / Cloud Providers
2. Click Add Provider button
3. Select On Premise
4. Give your provider a name and insert the full contents of your private ssh key, then hit Verify and Save:

![On Premise Provider Form with values](/ksphere/kommander/img/On-prem-provider-with-values.png)

### Launching the cluster

Now we are ready to launch the cluster.

Navigate to the Clusters section and click Add Cluster:

![Upload YAML](/ksphere/kommander/img/clusters-header.png)

Select Upload YAML to Create a Cluster:

![Upload YAML](/ksphere/kommander/img/add-cluster.png)

#### Fill out the form

1. Give your cluster a unique name
2. At the top of the `cluster.yaml` text field, fill the following information:

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

<p class="message--important"><strong>IMPORTANT: </strong>You must paste the above into the cluster.yaml field before you insert your cluster.yaml. For user, it is the ssh user tied to the keys pushed to your vms. This is the same user tied to the key we uploaded in the cloud provider step.
</p>

4. Make sure that Kommander addon is disabled `enabled: false`

```
spec:
  addons:
    addonsList:
    - name: kommander
      enabled: false
```

3. Select your On Premise Provider we have created at the previous step.

4. Paste the contents of your `inventory.yaml` file into the inventory field. Ensure that your inventory.yaml does **not** specify the following line:

```
ansible_ssh_private_key_file: "id_rsa"
```

5. Click Continue

At this point Provisioning of your cluster should start. You can track the deployment progress with Kibana or `kubectl`as you normaly would in Kommander.
