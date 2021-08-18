---
layout: layout.pug
navigationTitle: Pre-provisioned
title: Pre-provisioned
menuWeight: 0
excerpt: Konvoy pre-provisioned infrastructure
enterprise: false
---

<!-- markdownlint-disable MD034 -->

The following procedure describes installing Konvoy on a pre-provisioned  infrastructure.

## Prerequisites

Before you begin using Konvoy, you must have:

- A Konvoy bootstrap cluster available running the latest version of Konvoy bootstrap.
- An unencrypted SSH Private key.
- The correct image for your target infrastructure Operating system. If your infrastructure is heterogeneous, you must create a separate inventory per Operating System target.

## Prepare Hosts

Before Konvoy will run on your infrastructure, your cluster nodes must have the correct version of kubeadm, kubelet, containerd installed with all necessary configurations in place. The easiest way to prepare your nodes is by using
`provision` feature of Konvoy image builder.

### Install Konvoy Image Builder

In order to run the Konvoy-image-builder, you will need a working installation of Docker available on your target system.

<p class="message--note"><strong>NOTE: </strong>For an air gap installation, these files must be accessible locally.</p>

Once Docker is installed download and extract the bundle for your host operating system

| OS        |   URL        |
------------|--------------|
| Linux     |  https://github.com/mesosphere/konvoy-image-builder/releases/download/v1.0.0-rc.1/konvoy-image-bundle-v1.0.0-rc.2_linux.tar.gz             |
| OSX       | https://github.com/mesosphere/konvoy-image-builder/releases/download/v1.0.0-rc.1/konvoy-image-bundle-v1.0.0-rc.2_darwin.tar.gz             |
| Windows   |    https://github.com/mesosphere/konvoy-image-builder/releases/download/v1.0.0-rc.1/konvoy-image-bundle-v1.0.0-rc.2_windows.tar.gz         |
|

### Create an Ansible inventory and run provision

konvoy-image-builder can be used to install components required to run Konvoy. konvoy-image-builder uses ansible to connect to and provision machines and needs an ansible inventory file to do so.

An ansible inventory describes the hosts in your environment and details for connecting those hosts, such as ssh usernames and key file locations.

Basic example inventory file:

```yaml
all:
  vars:
    ansible_user: <username>
    ansible_ssh_key_name: <path-to-ssh-private-key>
  hosts:
    node-host-address-1:
    node-host-address-2:
    node-host-address-3:
    node-host-address-x:
```

For more complete information on creating ansible inventories, the [ansible documentation](https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html) may be helpful.

Now use the konvoy-image-builder `provision` command to install the pre-requisites needed to run Konvoy.

<p class="message--note"><strong>NOTE: </strong>Use the correct image for your target infrastructure Operating system. If your infrastructure is heterogeneous, you must create a separate inventory per Operating System target.</p>

```shell
cd <konvoy-image-bundle-dir>
./konvoy-image provision --inventory-file preprovisioned-inventory.yaml images/generic/<flatcar|centos-7|centos-8>.yaml
```

#### Configure an HTTP Proxy

It is possible to use an HTTP proxy during node base provisioning. To do so, create a yaml file named `http-proxy-override.yaml` specifying your desired proxy environment:

```yaml
proxy_env:
  HTTPS_PROXY: "http://proxy.com"
  https_proxy: "http://proxy.com"
  HTTP_PROXY: "http://proxy.com"
  http_proxy: "http://proxy.com"
  NO_PROXY: "proxy.com,example.com"
  no_proxy: "proxy.com,example.com"
```

## Install Konvoy

Ensure your Konvoy bootstrap cluster is available and running the latest version of Konvoy bootstrap.

### Install an SSH Key

Konvoy needs SSH access to your infrastructure with super user privileges. You must provide an unencrypted SSH private key to Konvoy. Populate the key on your bootstrap cluster using the following command:

```shell
kubectl create secret generic <ssh-private-key-secret-name> --from-file=ssh-privatekey=</path/to/private-key>
```

### Define your infrastructure

Konvoy needs to know how to access the nodes of your cluster and how to partition them. This is done using inventory resources. For initial cluster bootstrapping, you must define a control-plane and at least one worker pool. Use the following template to define your infrastructure:

```yaml
---
apiVersion: infrastructure.cluster.konvoy.d2iq.io/v1alpha1
kind: PreprovisionedInventory
metadata:
  name: $CLUSTER_NAME-control-plane
spec:
  hosts:
    # Create as many of these as needed to match your infrastructure
    - address: $CONTROL_PLANE_1_ADDRESS
    - address: $CONTROL_PLANE_2_ADDRESS
    - address: $CONTROL_PLANE_3_ADDRESS
  sshConfig:
    port: 22
    # This is the username used to connect to your infrastructure. This user must be root or
    # have the ability to use sudo without a password
    user: core
    privateKeyRef:
      # This is the name of the secret you created in the previous step. It must exist in the same
      # namespace as this inventory object.
      name: ${SSH_PRIVATE_KEY_SECRET_NAME}
      namespace: default
---
apiVersion: infrastructure.cluster.konvoy.d2iq.io/v1alpha1
kind: PreprovisionedInventory
metadata:
  name: $CLUSTER_NAME-md-0
spec:
  hosts:
    - address: $WORKER_1_ADDRESS
    - address: $WORKER_2_ADDRESS
  sshConfig:
    port: 22
    user: core
    privateKeyRef:
      name: ${SSH_PRIVATE_KEY_SECRET_NAME}
      namespace: default
```

Save the template to `preprovisioned_inventory.yaml`

Set the environment variables. Then use the `envsubst` command to populate the template and apply the results to the bootstrap cluster:

```shell
export CLUSTER_NAME="cluster_1"
export CONTROL_PLANE_1_ADDRESS="address_1"
export CONTROL_PLANE_2_ADDRESS="address_2"
export CONTROL_PLANE_3_ADDRESS="address_3"
export WORKER_1_ADDRESS="worker_address_1"
export WORKER_2_ADDRESS="worker_address_2"
export SSH_PRIVATE_KEY_SECRET_NAME="<ssh-private-key-secret-name>"

envsubst < preprovisioned_inventory.yaml | kubectl apply -f -
```

### Build the Cluster

With the inventory defined we can now use Konvoy to build the cluster.

#### Determine the APIServer endpoint

The control plane should consist of at least three nodes. This allows `etcd` to achieve a quorum and ensures availability of the control plane in the event one node goes down. To maintain availability of the control plane, an external load balancer is recommended.

```text
                            -------- cp1.example.com:6443
                            |
      lb.example.com:6443 ---------- cp2.example.com:6443
                            |
                            -------- cp3.example.com:6443
```

In the above example, the APIserver endpoint is `lb.example.com:6443`.

<p class="message--note"><strong>NOTE: </strong>If you do not have a load balancer or plan to configure one after cluster provisioning, use the first control plane node as your APIserver endpoint when creating the cluster.</p>

#### Creating the Cluster

The following command uses the preprovisioned cluster API provider to initialize the Kubernetes control plane and join your inventory to the cluster.

<p class="message--note"><strong>NOTE: </strong>When specifying the `cluster-name` you must use the same `cluster-name` as used when defining your inventory objects.</p>

```shell
konvoy create cluster preprovisioned --cluster-name ${CLUSTER_NAME} --apiserver-host <API server endpoint> --apiserver-port <API server port, if different than 6443>
```

The cluster begins to initialize. After the initialization you can use the `konvoy get kubeconfig -c ${CLUSTER_NAME}` to download the Kubernetes configuration for the new cluster and begin deploying workloads.

#### Provision on Flatcar

When provisioning onto Flatcar, you must instruct the bootstrap cluster to make some changes related to the installation paths. Add the `--os-hint flatcar` flag to the above `create cluster` command.

#### Use an HTTP Proxy

If you require http proxy configurations they can be applied during the create operation. Add appropriate flags to the `create cluster` command:

| Proxy configuration                      | Flag                                 |
| ---------------------------------------- | ------------------------------------ |
| HTTP proxy for control plane machines    | `--control-plane-http-proxy string`  |
| HTTPS proxy for control plane machines   | `--control-plane-https-proxy string` |
| No Proxy list for control plane machines | `--control-plane-no-proxy strings`   |
| HTTP proxy for worker machines           | `--worker-http-proxy string`         |
| HTTPS proxy for worker machines          | `--worker-https-proxy string`        |
| No Proxy list for worker machines        | `--worker-no-proxy strings`          |

#### Use an alternative mirror

Docker registry configurations can also be applied during the create operation. Add appropriate flags to the `create cluster` command:

| Docker registry configuration                                | Flag                            |
| ------------------------------------------------------------ | ------------------------------- |
| CA certificate chain to use while communicating with the registry mirror using TLS | `--registry-mirror-cacert file` |
| URL of a container registry to use as a mirror in the cluster | `--registry-mirror-url string`  |

This is useful when using an internal registry and when internet access is not available (air gapped installations).
