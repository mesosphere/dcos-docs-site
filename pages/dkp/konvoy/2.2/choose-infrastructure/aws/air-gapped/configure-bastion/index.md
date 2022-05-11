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

Bastion hosts are important because, for security reasons, you often want to deploy all nodes in a cluster on a private network.
Deploying the cluster nodes on a private network protects cluster resources from outside access because the nodes cannot be reached directly from any external network.

To enable installation of cluster resources from an external network, you can configure a [bastion host][bastion_host].

With a bastion host, you can use a secure shell (SSH) session to connect to cluster nodes from outside of the private network.

If you want to configure a bastion host for a DKP cluster deployed on an Amazon Web Services cloud instance, you can specify the bastion host information using the `ClusterProvisioner` section in the `cluster.yaml` file.

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
This would inform DKP to look for private keys in the SSH agent, instead of generating a new key pair.
Remember that SSH agent forwarding is **required** for using bastion hosts and that the private key identity paired with the public key used in the `cluster.yaml` has to have been added to the authentication agent.
A limited number of keys is used when authenticating via SSH. If you are unable to connect to an instance due to too many authentication failures, make sure that there are as few identities currently represented by the agent (`ssh-add -L`) as possible and that the private key is in the list.

When a DKP cluster is deployed on an Amazon Web Services cloud instance, the Ansible inventory file, `inventory.yaml`, is automatically generated.

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

<p class="message--note"><strong>NOTE: </strong>A known issue exists if you are using the Bastion host feature, setting <a href="../../reference/cluster-configuration">aws.elb.internal: true</a> in the <code>ClusterConfiguration</code> section of <code>cluster.yaml</code>, and deploying from a machine outside the network of the cluster. If you face a message similar to the example error below, follow the workaround described in this page.</p>

```bash
STAGE [Deploying Enabled Addons]
Get https://internal-konvoy-75d3-lb-control-123456789.us-east-1.elb.amazonaws.com:6443/api?timeout=32s: dial tcp 10.0.67.165:6443: i/o timeout[ERROR]

Error: failed to deploy the cluster: Get https://internal-konvoy-75d3-lb-control-123456789.us-east-1.elb.amazonaws.com:6443/api?timeout=32s: dial tcp 10.0.67.165:6443: i/o timeout
exit status 1
```

Use the following workaround while the issue is being addressed:

1.  Start a tunnel locally on port 1080 to the Bastion Host.

    ```bash
    ssh -N -D 0.0.0.0:1080 centos@bastion-host
    ```

1.  On the install machine, configure a socks5 proxy on the local port.

    ```bash
    export HTTPS_PROXY=socks5://localhost:1080
    ```

    ***If using Mac with Docker Desktop:***

    ```bash
    export HTTPS_PROXY=socks5://host.docker.internal:1080
    ```

1.  Deploy the addons once again.

    ```bash
    dkp deploy addons -y
    ```

[bastion_host]: https://en.wikipedia.org/wiki/Bastion_host
[node_pool]: https://docs.d2iq.com/dkp/konvoy/1.8/install/node-pools/
