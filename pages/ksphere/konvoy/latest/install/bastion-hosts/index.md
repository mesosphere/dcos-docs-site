---
layout: layout.pug
navigationTitle: Bastion Host
title: Bastion Host
menuWeight: 60
excerpt: Configure bastion host for the Konvoy cluster
enterprise: false
---

It is fairly common that cluster administrators want all nodes in a Konvoy cluster to be placed in a private network, and do not want those nodes to be directly reachable from an external network.
In such scenarios, to access nodes from an external network, the users will have to use a [bastion host][bastion_host].

A bastion host is a server whose purpose is to provide access to a private network from an external network, such as the Internet.

Konvoy supports bastion hosts.
Given that Konvoy install only requires SSH access to the nodes, the bastion host will serve as an SSH jump host.

# Configure bastion host for an on-premise cluster

## Configure SSH agent forwarding

To use a bastion host for an on-premise deployment, you *must* use [SSH agent forwarding][ssh_agent] so that the bastion host can authenticate with the cluster nodes using keys on the deploy machine without copying to the bastion host.

For example, assume you have a key pair `${HOME}/.ssh/id_rsa` (private key) and `${HOME}/.ssh/id_rsa.pub` (public key).

First, you need to add the private key into the SSH agent.
Please first make sure your SSH agent is running.
On macOS, it is running by default.
On Linux, please run `ssh-agent` command and follow the instruction printed by the command.
Then, add your private key to the SSH agent.

On macOS:

```bash
ssh-add -k ${HOME}/.ssh/id_rsa
```

On Linux:

```bash
ssh-add ${HOME}/.ssh/id_rsa
```

You can verify if SSH agent is configured properly by manually `ssh` to one of the cluster node.
You should be able to log in without typing password.

```bash
ssh -A <host>
```

## Configure inventory file

Once SSH agent forwarding is configured properly, configure bastion host related variables in Ansible inventory file (i.e., `inventory.yaml`):

```yaml
control-plane:
  hosts:
    10.0.194.142:
      ansible_host: 10.0.194.142
    10.0.198.130:
      ansible_host: 10.0.198.130
    10.0.200.148:
      ansible_host: 10.0.200.148

node:
  hosts:
    10.0.130.168:
      ansible_host: 10.0.130.168
      node_pool: worker
    10.0.133.221:
      ansible_host: 10.0.133.221
      node_pool: worker
    10.0.139.120:
      ansible_host: 10.0.139.120
      node_pool: worker

all:
  vars:
    order: sorted
    ansible_user: "centos"
    ansible_port: 22
    bastion_hosts: [10.0.131.50]
    bastion_user: "centos"
    bastion_port: 22
```

The bastion host specific variables are listed below:

* `bastion_hosts`: lists the hosts through which a proxy SSH connection can be made.
   A host from this list is selected randomly for each SSH connection.
* `bastion_user`: specifies the user account used to open the SSH connection into the hosts listed as `bastion_hosts`.
* `bastion_port`: specifies the port used to open the SSH connection into the hosts listed as `bastion_hosts`.

Note that you still need to specify `ansible_user` and `ansible_port`, which are the user and port that the bastion host will use to establish an SSH connection between the bastion host and the cluster host.

If you are using bastion nodes, keep in mind that SSH agent forwarding is required and you MUST NOT specify `ansible_ssh_private_key_file` in `inventory.yaml`.
When you run `konvoy up`, Konvoy validates that a valid private key has been loaded in the SSH agent for the provided public key.

# Configure bastion host for an AWS cluster

For an AWS deployment, you do not need to manually modify Ansible inventory file (i.e., `inventory.yaml`) as it will be automatically generated.

Instead, you can specify bastion hosts in `ClusterProvisioner` in `cluster.yaml` file using a special [node pool][node_pool] like the following:

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1alpha1
spec:
  nodePools:
  - name: bastion
    bastion: true
    count: 2
    machine:
      rootVolumeSize: 10
      rootVolumeType: gp2
      type: t3.small
  sshCredentials:
    user: centos
    publicKeyFile: konvoy-ssh.pub
```

Using this setting, the AWS provisioner will automatically creates two new EC2 instances with security groups configured to:

* Allow proxy SSH connections to the rest of the nodes.
* Block remote SSH access to the cluster EC2 instances.

Notice that `spec.sshCredentials.privateKeyFile` MUST NOT be specified.
This would inform Konvoy to look for private keys in the SSH agent, instead of generating a new key pair.
Remember that SSH agent forwarding is *required* for using bastion hosts.

The generated `inventory.yaml` file will be similar to the following:

```yaml
all:
  vars:
    bastion_hosts: [ec2-18-237-7-198.us-west-2.compute.amazonaws.com, ec2-34-221-251-83.us-west-2.compute.amazonaws.com]
    bastion_user: "centos"
    bastion_port: 22
```

[bastion_host]: https://en.wikipedia.org/wiki/Bastion_host
[ssh_agent]: https://en.wikipedia.org/wiki/Ssh-agent
[node_pool]: ../node-pools/
