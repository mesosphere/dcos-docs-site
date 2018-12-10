---
layout: layout.pug
navigationTitle: Creating Clusters
title: Creating Kubernetes clusters on DC/OS using MKE
menuWeight: 10
excerpt: Learn to create Kubernetes clusters on DC/OS using MKE and the DC/OS Kubernetes CLI
---

# Create a Kubernetes Cluster on DC/OS

Now that you have [installed MKE](/services/kubernetes/LATEST) (the `kubernetes`package) on your DC/OS Enterprise cluster, you are now in a position to create multiple Kubernetes clusters on top of DC/OS.

## Provision a Service Account for DC/OS Kubernetes

As with MKE on DC/OS Enterprise, when installing DC/OS Kubernetes on a DC/OS Enterprise cluster, configuring a service account for DC/OS Kubernetes on Enterprise is mandatory.

1. Start by creating a unique keypair to use for the service account, here we use 'kube-cluster-priv' and 'kube-cluster-pub':

    ```bash
    dcos security org service-accounts keypair kube1-cluster-priv.pem kube1-cluster-pub.pem
    ```

You will find the resulting keypair in your working directory. As before, no other output is produced when the command is run successfully.

1. Now, create a service account for the new cluster, `kubernetes-cluster1`, associated with the genereated public key, in this case:

    ```bash
    dcos security org service-accounts create -p kube-cluster-pub.pem -d 'Kubernetes service account' kubernetes-cluster1
    ```

    Again, successfully creating the service account will not create any CLI output.

1. Then, associate a secret with the service account using the private key.

    ```bash
    dcos security secrets create-sa-secret kuyb.pem <service-name> <service-name>/sa
    ```

    Using the `mke` keypair example:

```bash
dcos security secrets create-sa-secret mke-priv.pem kubernetes-cluster kubernetes-cluster/sa
```

Again, it is expected behavior in these steps for no output from the CLI to happen unless an error has occurred.

## Grant Permisions

This is the list of permissions that needs to be granted, where each instance of `<service-name>` is replaced by the name of your planned kubernetes cluster, which will install to a default of `kubernetes-cluster` if not otherwise named.

The basic pattern is listed here:

### Mesos Master Permissions

```bash
dcos security org users grant kubernetes dcos:mesos:master:framework:role:<service name>-role create
dcos security org users grant kubernetes dcos:mesos:master:task:user:root create
dcos security org users grant kubernetes dcos:mesos:agent:task:user:root create
dcos security org users grant kubernetes dcos:mesos:master:reservation:role:<service name>-role create
dcos security org users grant kubernetes dcos:mesos:master:reservation:principal:<service name> delete
dcos security org users grant kubernetes dcos:mesos:master:volume:role:<service name>-role create
dcos security org users grant kubernetes dcos:mesos:master:volume:principal:<service name> delete
```

### Secrets Permissions

```bash
dcos security org users grant kubernetes dcos:secrets:default:/<service name>/* full
dcos security org users grant kubernetes dcos:secrets:list:default:/<service name> read
dcos security org users grant kubernetes dcos:adminrouter:ops:ca:rw full
dcos security org users grant kubernetes dcos:adminrouter:ops:ca:ro full
```

### Mesos Agent Permissions

```bash
dcos security org users grant kubernetes dcos:mesos:master:framework:role:slave_public/<service name>-role create
dcos security org users grant kubernetes dcos:mesos:master:framework:role:slave_public/<service name>-role read
dcos security org users grant kubernetes dcos:mesos:master:reservation:role:slave_public/<service name>-role create
dcos security org users grant kubernetes dcos:mesos:master:volume:role:slave_public/<service name>-role create
dcos security org users grant kubernetes dcos:mesos:master:framework:role:slave_public read
dcos security org users grant kubernetes dcos:mesos:agent:framework:role:slave_public read
```
### One-click code snippet

For your convenience in following along with this tutorial, we have provided filled in all of the instances of `<service-name>` with the default `kubernetes-cluster1` here, and depending on your particular [shell environment](), you should be able to paste them in a block at a time:

```bash
dcos security org users grant kubernetes dcos:mesos:master:framework:role:kubernetes-cluster-role create
dcos security org users grant kubernetes dcos:mesos:master:task:user:root create
dcos security org users grant kubernetes dcos:mesos:agent:task:user:root create
dcos security org users grant kubernetes dcos:mesos:master:reservation:role:kubernetes-cluster-role create
dcos security org users grant kubernetes dcos:mesos:master:reservation:principal:kubernetes-cluster delete
dcos security org users grant kubernetes dcos:mesos:master:volume:role:kubernetes-cluster-role create
dcos security org users grant kubernetes dcos:mesos:master:volume:principal:kubernetes-cluster delete

dcos security org users grant kubernetes dcos:secrets:default:/kubernetes-cluster/* full
dcos security org users grant kubernetes dcos:secrets:list:default:/kubernetes-cluster read
dcos security org users grant kubernetes dcos:adminrouter:ops:ca:rw full
dcos security org users grant kubernetes dcos:adminrouter:ops:ca:ro full

dcos security org users grant kubernetes dcos:mesos:master:framework:role:slave_public/kubernetes-cluster-role create
dcos security org users grant kubernetes dcos:mesos:master:framework:role:slave_public/kubernetes-cluster-role read
dcos security org users grant kubernetes dcos:mesos:master:reservation:role:slave_public/kubernetes-cluster-role create
dcos security org users grant kubernetes dcos:mesos:master:volume:role:slave_public/kubernetes-cluster-role create
dcos security org users grant kubernetes dcos:mesos:master:framework:role:slave_public read
dcos security org users grant kubernetes dcos:mesos:agent:framework:role:slave_public read
```

## Create the `kubernetes-cluster` package and create your first cluster

Now that permissions have been granted to the service account, we need to make sure that the package installer is aware of the account.

1. First, open the `options.json` file associated with the account. If you do not already have an `options.json` file, create a new one. In the CLI, enter:

    ```bash
    touch kcluster-options.json
    ```

    This will create the file in your current working directory, in this example we name the file `kcluster-options.json`.

1. Open the file in a text editor and add the service account information.

    Place the following snippet in the newly configured `kcluster-options.json` file:

    ```json
    {
        "service": {
            "service_account": "kubernetes-cluster",
            "service_account_secret": "kubernetes-cluster/sa"
        }
    }
    ```
    Save and close the file.

1. Install the package using the associated `kc-options.json` configured for the package in step (2).

    In the CLI, enter:

    ```bash
    dcos package install --yes kubernetes --options=mke-options.json
    ```











Install the latest DC/OS Kubernetes CLI:
dcos package install kubernetes --cli --yes
The DC/OS Kubernetes CLI is provided as a way to interact with the cluster manager and allow complete control over the life-cycle of Kubernetes clusters running on DC/OS.

For more information on the CLI management commands for DC/OS Kubernetes see here

Creating Kubernetes Cluster #1
Create the kubernetes-cluster Service Account:

dcos security org service-accounts keypair private-key.pem public-key.pem
dcos security org service-accounts create -p public-key.pem -d 'Kubernetes service account' kubernetes-cluster1
dcos security secrets create-sa-secret private-key.pem kubernetes-cluster1 kubernetes-cluster1/sa
Grant the kubernetes-cluster Service Account permissions:

dcos security org users grant kubernetes-cluster1 dcos:mesos:master:framework:role:kubernetes-cluster1-role create
dcos security org users grant kubernetes-cluster1 dcos:mesos:master:task:user:root create
dcos security org users grant kubernetes-cluster1 dcos:mesos:agent:task:user:root create
dcos security org users grant kubernetes-cluster1 dcos:mesos:master:reservation:role:kubernetes-cluster1-role create
dcos security org users grant kubernetes-cluster1 dcos:mesos:master:reservation:principal:kubernetes-cluster1 delete
dcos security org users grant kubernetes-cluster1 dcos:mesos:master:volume:role:kubernetes-cluster1-role create
dcos security org users grant kubernetes-cluster1 dcos:mesos:master:volume:principal:kubernetes-cluster1 delete

dcos security org users grant kubernetes-cluster1 dcos:secrets:default:/kubernetes-cluster1/* full
dcos security org users grant kubernetes-cluster1 dcos:secrets:list:default:/kubernetes-cluster1 read
dcos security org users grant kubernetes-cluster1 dcos:adminrouter:ops:ca:rw full
dcos security org users grant kubernetes-cluster1 dcos:adminrouter:ops:ca:ro full

dcos security org users grant kubernetes-cluster1 dcos:mesos:master:framework:role:slave_public/kubernetes-cluster1-role create
dcos security org users grant kubernetes-cluster1 dcos:mesos:master:framework:role:slave_public/kubernetes-cluster1-role read
dcos security org users grant kubernetes-cluster1 dcos:mesos:master:reservation:role:slave_public/kubernetes-cluster1-role create
dcos security org users grant kubernetes-cluster1 dcos:mesos:master:volume:role:slave_public/kubernetes-cluster1-role create
dcos security org users grant kubernetes-cluster1 dcos:mesos:master:framework:role:slave_public read
dcos security org users grant kubernetes-cluster1 dcos:mesos:agent:framework:role:slave_public read

Create options.json:

{
  "service": {
    "name": "kubernetes-cluster1",
    "service_account": "kubernetes-cluster1",
    "service_account_secret": "kubernetes-cluster1/sa"
  }
}

Install Kubernetes Cluster #1:

dcos kubernetes cluster create --options=options.json --yes
To monitor your Kubernetes cluster creation, use the DC/OS Kubernetes CLI:

dcos kubernetes cluster debug plan status deploy --cluster-name=kubernetes-cluster1
Complete cluster plan shown below:

$ dcos kubernetes cluster debug plan status deploy --cluster-name=kubernetes-cluster1
Using Kubernetes cluster: kubernetes-cluster1
deploy (serial strategy) (COMPLETE)
├─ etcd (serial strategy) (COMPLETE)
│  └─ etcd-0:[peer] (COMPLETE)
├─ control-plane (dependency strategy) (COMPLETE)
│  └─ kube-control-plane-0:[instance] (COMPLETE)
├─ mandatory-addons (serial strategy) (COMPLETE)
│  └─ mandatory-addons-0:[instance] (COMPLETE)
├─ node (dependency strategy) (COMPLETE)
│  └─ kube-node-0:[kubelet] (COMPLETE)
└─ public-node (dependency strategy) (COMPLETE)
Creating Kubernetes Cluster #2
Create the kubernetes-cluster2 Service Account:

dcos security org service-accounts keypair private-key.pem public-key.pem
dcos security org service-accounts create -p public-key.pem -d 'Kubernetes service account' kubernetes-cluster2
dcos security secrets create-sa-secret private-key.pem kubernetes-cluster2 kubernetes-cluster2/sa
Grant the kubernetes-cluster2 Service Account permissions:

dcos security org users grant kubernetes-cluster2 dcos:mesos:master:framework:role:kubernetes-cluster2-role create
dcos security org users grant kubernetes-cluster2 dcos:mesos:master:task:user:root create
dcos security org users grant kubernetes-cluster2 dcos:mesos:agent:task:user:root create

dcos security org users grant kubernetes-cluster2 dcos:mesos:master:reservation:role:kubernetes-cluster2-role create
dcos security org users grant kubernetes-cluster2 dcos:mesos:master:reservation:principal:kubernetes-cluster2 delete
dcos security org users grant kubernetes-cluster2 dcos:mesos:master:volume:role:kubernetes-cluster2-role create
dcos security org users grant kubernetes-cluster2 dcos:mesos:master:volume:principal:kubernetes-cluster2 delete

dcos security org users grant kubernetes-cluster2 dcos:secrets:default:/kubernetes-cluster2/* full
dcos security org users grant kubernetes-cluster2 dcos:secrets:list:default:/kubernetes-cluster2 read

dcos security org users grant kubernetes-cluster2 dcos:adminrouter:ops:ca:rw full
dcos security org users grant kubernetes-cluster2 dcos:adminrouter:ops:ca:ro full

dcos security org users grant kubernetes-cluster2 dcos:mesos:master:framework:role:slave_public/kubernetes-cluster2-role create
dcos security org users grant kubernetes-cluster2 dcos:mesos:master:framework:role:slave_public/kubernetes-cluster2-role read
dcos security org users grant kubernetes-cluster2 dcos:mesos:master:reservation:role:slave_public/kubernetes-cluster2-role create
dcos security org users grant kubernetes-cluster2 dcos:mesos:master:volume:role:slave_public/kubernetes-cluster2-role create
dcos security org users grant kubernetes-cluster2 dcos:mesos:master:framework:role:slave_public read
dcos security org users grant kubernetes-cluster2 dcos:mesos:agent:framework:role:slave_public read
Create options2.json, note that this options JSON provides examples of how to set cluster size. For our example we will be deploying a "kube_cpus": 1, instead of the default "kube_cpus": 2

{
    "service": {
        "name": "kubernetes-cluster2",
        "service_account": "kubernetes-cluster2",
        "service_account_secret": "kubernetes-cluster2/sa"
    },
    "kubernetes": {
        "authorization_mode": "AlwaysAllow",
        "control_plane_placement": "[[\"hostname\", \"UNIQUE\"]]",
        "control_plane_reserved_resources": {
            "cpus": 1.5,
            "disk": 10240,
            "mem": 4096
        },
        "high_availability": false,
        "private_node_count": 1,
        "private_node_placement": "",
        "private_reserved_resources": {
            "kube_cpus": 1,
            "kube_disk": 10240,
            "kube_mem": 2048,
            "system_cpus": 1,
            "system_mem": 1024
        }
    },
    "etcd": {
        "cpus": 0.5,
        "mem": 1024
    }
}
Install kubernetes-cluster2 Cluster:

dcos kubernetes cluster create --options=options2.json --yes
To monitor your Kubernetes cluster creation, use the DC/OS Kubernetes CLI:

dcos kubernetes cluster debug plan status deploy --cluster-name=kubernetes-cluster2
Complete cluster plan shown below:

$ dcos kubernetes cluster debug plan status deploy --cluster-name=kubernetes-cluster2
Using Kubernetes cluster: kubernetes-cluster2
deploy (serial strategy) (COMPLETE)
├─ etcd (serial strategy) (COMPLETE)
│  └─ etcd-0:[peer] (COMPLETE)
├─ control-plane (dependency strategy) (COMPLETE)
│  └─ kube-control-plane-0:[instance] (COMPLETE)
├─ mandatory-addons (serial strategy) (COMPLETE)
│  └─ mandatory-addons-0:[instance] (COMPLETE)
├─ node (dependency strategy) (COMPLETE)
│  └─ kube-node-0:[kubelet] (COMPLETE)
└─ public-node (dependency strategy) (COMPLETE)
