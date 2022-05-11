---
layout: layout.pug
navigationTitle: Configure bastion hosts
title: Configure bastion hosts
menuWeight: 60
excerpt: Configure bastion hosts for access to the DKP cluster
beta: false
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

A **bastion host** is a server that provides a defensive barrier to protect access to a private network from an external network, such as the internet.

Bastion hosts are important because, as a cluster administrator, you often want to deploy all of the nodes in a cluster on a private network for security reasons.
Deploying the cluster nodes on a private network protects cluster resources from outside access because the nodes cannot be reached directly from any external network.

To enable installation of cluster resources from an external network, you can configure a [bastion host][bastion_host].

With a bastion host, you can use a secure shell (SSH) session to connect to cluster nodes from outside of the private network.

If you want to configure a bastion host for a DKP cluster deployed on a Microsoft Azure cloud instance, you can specify the bastion host information using the `ClusterProvisioner` section in the `cluster.yaml` file.

For example, you can configure bastion host settings using a special [node pool][node_pool] section similar to the following:

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta2
spec:
  nodePools:
  - name: bastion
    bastion: true
    count: 2
    machine:
      imageID: OpenLogic:CentOS:7_9-gen2:7.9.2021020401
      rootVolumeSize: 40
      rootVolumeType: Standard_LRS
      imagefsVolumeEnabled: false
      type: Standard_D2s_v3
  sshCredentials:
    user: centos
    publicKeyFile: konvoy-ssh.pub
```

Using the `nodePool` settings, the Azure provisioner automatically creates two new EC2 instances with security groups configured to:

* Allow proxy SSH connections to the rest of the nodes.
* Block remote SSH access to the cluster EC2 instances.

Notice that `spec.sshCredentials.privateKeyFile` **must not** be specified.
This would inform DKP to look for private keys in the SSH agent, instead of generating a new key pair.
Remember that SSH agent forwarding is **required** for using bastion hosts and that the private key identity paired with the public key used in the `cluster.yaml` has to have been added to the authentication agent.
A limited number of keys is used when authenticating via SSH. If you are unable to connect to an instance due to too many authentication failures, make sure that there are as few identities currently represented by the agent (`ssh-add -L`) as possible and that the private key is in the list.

When a DKP cluster is deployed on an Microsoft Azure cloud instance, the Ansible inventory file, `inventory.yaml`, is automatically generated.

The generated `inventory.yaml` file will be similar to the following:

```yaml
bastion:
  hosts:
    10.0.131.50:
      ansible_host: 10.0.131.50
  vars:
    ansible_user: "centos"
    ansible_port: 22
```

[bastion_host]: https://en.wikipedia.org/wiki/Bastion_host
[node_pool]: /dkp/konvoy/2.2/choose-infrastructure/aws/nodepools/
