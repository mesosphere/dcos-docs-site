---
layout: layout.pug
navigationTitle: Advanced SSH configurations
title: Advanced SSH configurations
menuWeight: 90
excerpt: Advanced SSH configurations for the Konvoy installer
beta: false
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

For [on-premises install][install_onprem], there are a few SSH related options that users can customize in the [Ansible][ansible] [inventory file][ansible_inventory].

## `ssh_common_args`

If specified, the extra arguments will be appended to all SSH related operations.
This is useful when SSH proxy is used.

```yaml
all:
  vars:
    version: "v1beta1"
    order: sorted
    ssh_common_args: "-o ProxyCommand=\"ssh -p 3023 %r@localhost -s proxy:%h:%p\""
```

## Create a Konvoy cluster with preexisting ssh keys

You can create a Konvoy cluster with preexisting ssh keys using one of the following methods:

- Copy both the private and public key into the working directory and name them `<CLUSTER_NAME>-ssh.pem` and `<CLUSTER_NAME>-ssh.pub`, respectively.

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta2
spec:
  sshCredentials:
    user: centos
    publicKeyFile: <CLUSTER_NAME>-ssh.pub
    privateKeyFile: <CLUSTER_NAME>-ssh.pem
```

**NOTE**: `<CLUSTER_NAME>` represents the cluster name defined in the `cluster.yaml` file, as shown in the following:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta2
metadata:
  name: myClusterName
spec:
```

- If the keys are in your `~/.ssh/` directory, specify the file location. Because Konvoy runs as a container, not all directories are available in the container, but the `$HOME` directory is always mounted.

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta2
spec:
  sshCredentials:
    user: centos
    publicKeyFile: ~/.ssh/<CLUSTER_NAME>-ssh.pub
    privateKeyFile: ~/.ssh/<CLUSTER_NAME>-ssh.pem
```

- If the key is in your `ssh-agent`, specify only the public key. Your public key is copied to the nodes by Terraform, and the `ssh-agent` is used when connecting to those nodes.

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta2
spec:
  sshCredentials:
    user: centos
    publicKeyFile: ~/.ssh/<CLUSTER_NAME>-ssh.pub
```

[install_onprem]: ../install-onprem/
[ansible]: https://www.ansible.com
[ansible_inventory]: https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html
