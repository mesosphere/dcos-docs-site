---
layout: layout.pug
navigationTitle: Prepare Hosts
title: Prepare Hosts
menuWeight: 20
excerpt: How to prepare hosts for use with a pre-provisioned provider
enterprise: false
beta: false
---

<!-- markdownlint-disable MD034 -->

Before Konvoy can run on your infrastructure, your cluster nodes must have the correct version of kubeadm, kubelet, and containerd installed with all necessary configurations in place. The easiest way to prepare your nodes is by using the `provision` feature of Konvoy Image Builder.

## Install Konvoy Image Builder

To run the Konvoy-image-builder, you will need a working installation of Docker available on your target system.

<p class="message--note"><strong>NOTE: </strong>For an air-gapped installation, these files must be accessible locally.</p>

After Docker is installed, download and extract the bundle for your host operating system:

| OS        |   URL        |
------------|--------------|
| Linux     | https://github.com/mesosphere/konvoy-image-builder/releases/download/v1.0.0/konvoy-image-bundle-v1.0.0_linux.tar.gz             |
| OSX       | https://github.com/mesosphere/konvoy-image-builder/releases/download/v1.0.0/konvoy-image-bundle-v1.0.0_darwin.tar.gz             |
| Windows   | https://github.com/mesosphere/konvoy-image-builder/releases/download/v1.0.0/konvoy-image-bundle-v1.0.0_windows.tar.gz         |
|

## Create an Ansible inventory and run provision

You can use Konvoy Image Builder's CLI konvoy-image to install components required to run Konvoy. konvoy-image uses Ansible to connect to and provision machines and requires an Ansible inventory file.

An Ansible inventory describes the hosts in your environment and details for connecting those hosts, such as SSH usernames and key file locations.

1.  Create an inventory file, named `inventory.yaml`. The following is an example of a basic inventory file:

    ```yaml
    all:
      vars:
        ansible_user: <ssh-user>
        ansible_ssh_private_key_file: <path-to-ssh-private-key>
      hosts:
        control-plane-address-1:
        control-plane-address-2:
        control-plane-address-3:
        worker-address-1:
        worker-address-2:
        worker-address-3:
        worker-address-4:
        ...
    ```

    For more information on creating Ansible inventories, refer to the [Ansible documentation](https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html).

1.  Use the konvoy-image-builder `provision` command to install the prerequisites needed to run Konvoy.

<p class="message--note"><strong>NOTE: </strong>Use the correct image for your target infrastructure Operating system. If your infrastructure is heterogeneous, you must create a separate inventory per Operating System target.</p>

```shell
cd <konvoy-image-bundle-dir>
./konvoy-image provision --inventory-file inventory.yaml images/generic/<centos-7|centos-8|flatcar|sles-15>.yaml
```

### Configure an HTTP Proxy

If your hosts cannot connect directly to the Internet to install OS packages and pull Docker images, it is possible to use an HTTP proxy during node base provisioning.
To do this, create a YAML file named `http-proxy-override.yaml` specifying your desired proxy environment:

```yaml
proxy_env:
  HTTPS_PROXY: "http://proxy.com"
  https_proxy: "http://proxy.com"
  HTTP_PROXY: "http://proxy.com"
  http_proxy: "http://proxy.com"
  NO_PROXY: "proxy.com,example.com"
  no_proxy: "proxy.com,example.com"
```

Then run the following command passing in `--overrides=http-proxy-override.yaml`:

```shell
cd <konvoy-image-bundle-dir>
./konvoy-image provision --inventory-file inventory.yaml images/generic/<centos-7|centos-8|flatcar|sles-15>.yaml --overrides http-proxy-override.yaml
```

When these procedures are complete, [create the bootstrap cluster](../bootstrap).
