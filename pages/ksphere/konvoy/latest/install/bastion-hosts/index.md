---
layout: layout.pug
navigationTitle: Configure bastion hosts
title: Configure bastion hosts
menuWeight: 60
excerpt: Configure bastion hosts for access to the Konvoy cluster
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

A **bastion host** is a server that provides a defensive barrier to protect access to a private network from an external network, such as the internet.

Bastion hosts are important because, as a cluster administrator, you often want to deploy all of the nodes in a cluster on a private network for security reasons.
Deploying the cluster nodes on a private network protects cluster resources from outside access because the nodes cannot be reached directly from any external network.

To enable installation of cluster resources from an external network, you can configure a [bastion host][bastion_host].

With a bastion host, you can use a secure shell (SSH) session to connect to cluster nodes from outside of the private network.

The steps for configuring a bastion host depend on whether your cluster is installed as an on-premise cluster or deployed on AWS.

## Configure a bastion host for an on-premise cluster

To use a bastion host for an on-premise deployment, you **must** use [SSH agent forwarding][ssh_agent].
The requirement to use SSH agent forwarding enables the bastion host to authenticate with the cluster nodes using keys on the deployment machine without copying or storing any keys on the bastion host itself.

If you already have a private and public key pair for connecting to the cluster from the deployment machine, you can configure a bastion host for an on-premise cluster by doing the following:

* [Configure SSH agent forwarding](#configure-ssh-agent-forwarding)
* [Configure the inventory file](#configure-the-inventory-file)

### Configure SSH agent forwarding

The following example illustrates how to configure SSH agent forwarding if you have a private and public key pair for connecting to the cluster from the deployment machine.
For this example, the key pair consists of the private key `${HOME}/.ssh/id_rsa`  and the public key `${HOME}/.ssh/id_rsa.pub`.

1. Verify you have the SSH agent running on the local computer.

    * On macOS, the SSH agent runs by default.
    * On Linux, run the `ssh-agent` command and follow the prompts displayed to start the agent.

1. Add the private key to the SSH agent.

    * On **macOS**, run a command similar to the following:

      ```bash
      ssh-add -k ${HOME}/.ssh/id_rsa
      ```

    * On **Linux**, run a command similar to the following::

      ```bash
      ssh-add ${HOME}/.ssh/id_rsa
      ```

1. Verify that the SSH agent forwarding is configured properly by manually opening a secure shell session connection to one of the cluster nodes.

    For example, log in by running a command similar to the following:

    ```bash
    ssh -A <host>
    ```

If you are able to connect to the remote host without providing a password, you have successfully configured SSH agent forwarding.

### Configure the inventory file

After you have configured and tested SSH agent forwarding, you can configure the appropriate bastion host settings in the Ansible inventory file.

For example, configure the following bastion host settings in the `inventory.yaml` file:

* `bastion.hosts` lists the hosts through which a proxy secure shell connection can be made.
   A host from this list is selected randomly for each SSH connection.
* `ansible_user` specifies the user account used to open the secure shell connection into the hosts listed as `bastion.hosts`.
* `ansible_port` specifies the port used to open the secure shell connection into the hosts listed as `bastion.hosts`.

The following example illustrates how to configure these settings in the `inventory.yaml` file:

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

bastion:
  hosts:
    10.0.131.50:
      ansible_host: 10.0.131.50
  vars:
    ansible_user: "centos"
    ansible_port: 22

all:
  vars:
    version: v1beta1
    order: sorted
    ansible_user: "centos"
    ansible_port: 22
```

Note that you must specify the `ansible_user` and `ansible_port`.
These settings define the user name and port number that the bastion host uses to establish the SSH connection between the bastion host and the cluster host.

In editing the `inventory.yaml` file, you should also keep in mind that SSH agent forwarding is required and, therefore, you **must not** specify any value for the `ansible_ssh_private_key_file` setting.
When you run `konvoy up`, Konvoy validates that a valid private key has been loaded in the SSH agent for the provided public key.

## Configure a bastion host for cluster deployed on AWS

If you want to configure a bastion host for a Konvoy cluster deployed on an Amazon Web Services cloud instance, you can specify the bastion host information using the `ClusterProvisioner` section in the `cluster.yaml` file.

For example, you can configure bastion host settings using a special [node pool][node_pool] section similar to the following:

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta1
spec:
  nodePools:
  - name: bastion
    bastion: true
    count: 2
    machine:
      rootVolumeSize: 10
      rootVolumeType: gp2
      type: m5.large
  sshCredentials:
    user: centos
    publicKeyFile: konvoy-ssh.pub
```

Using the `nodePool` settings, the AWS provisioner automatically creates two new EC2 instances with security groups configured to:

* Allow proxy SSH connections to the rest of the nodes.
* Block remote SSH access to the cluster EC2 instances.

Notice that `spec.sshCredentials.privateKeyFile` **must not** be specified.
This would inform Konvoy to look for private keys in the SSH agent, instead of generating a new key pair.
Remember that SSH agent forwarding is **required** for using bastion hosts.

When a Konvoy cluster is deployed on an Amazon Web Services cloud instance, the Ansible inventory file, `inventory.yaml`, is automatically generated.
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

<p class="message--note"><strong>NOTE: </strong>If you are using the Bastion host feature with an internal facing loadbalancer, for Kubernetes API, <a href="../../reference/cluster-configuration">aws.elb.internal: true</a> in the `ClusterConfiguration` section of `cluster.yaml` and deploying from a machine outside the network of the cluster, there is a known issue. Deployment of the Addons fails to connect to the Kubernetes API with the following example error:</p>

```bash
STAGE [Deploying Enabled Addons]
Get https://internal-konvoy-75d3-lb-control-123456789.us-east-1.elb.amazonaws.com:6443/api?timeout=32s: dial tcp 10.0.67.165:6443: i/o timeout[ERROR]

Error: failed to deploy the cluster: Get https://internal-konvoy-75d3-lb-control-123456789.us-east-1.elb.amazonaws.com:6443/api?timeout=32s: dial tcp 10.0.67.165:6443: i/o timeout
exit status 1
```

Use the following workaround while the issue is being addressed:

Start a tunnel locally on port 1080 to the Bastion Host.

```bash
ssh -N -D 0.0.0.0:1080 centos@bastion-host
```

On the install machine, configure a socks5 proxy on the local port.

```bash
export HTTPS_PROXY=socks5://localhost:1080
```

***If using Mac with Docker Desktop:***

```bash
export HTTPS_PROXY=socks5://host.docker.internal:1080
```

Deploy the addons once again.

```bash
konvoy deploy addons -y
```

[bastion_host]: https://en.wikipedia.org/wiki/Bastion_host
[ssh_agent]: https://en.wikipedia.org/wiki/Ssh-agent
[node_pool]: ../node-pools/
[aws_elb]: ../../reference/cluster-configuration/
