---
layout: layout.pug
navigationTitle: Creating Kubernetes clusters with MKE
title: Creating Kubernetes clusters on DC/OS with MKE
menuWeight: 10
excerpt: Learn to create Kubernetes clusters on DC/OS using MKE and the DC/OS Kubernetes CLI
---

# Creating Kubernetes clusters on DC/OS using the DC/OS Kubernetes CLI

At this point in this [**Getting Started with Kubernetes on DC/OS Enterprise**](/services/kubernetes/new/getting-started/) tutorial, you have [installed MKE](/services/kubernetes/new/getting-started/provision-install/installing-mke/) - using the DC/OS `kubernetes`package - on your DC/OS Enterprise cluster and installed the [latest DC/OS Kubernetes CLI](/services/kubernetes/new/getting-started/cli).

Now in a position to create multiple Kubernetes clusters on top of DC/OS. Let's make a pair one at a time.

## Create a Kubernetes cluster on DC/OS

As when installing the MKE, to run this Kubernetes cluster as a service on our DC/OS Enterprise cluster, we need a service account for it. Like before, to do so we need to first provision a service account for this Kubernetes cluster, then grant it [the necessary permissions](NEED REF LINK) for operating on DC/OS Enterprise.

### Provision a Service Account for DC/OS Kubernetes

As with MKE on DC/OS Enterprise, when installing DC/OS Kubernetes on a DC/OS Enterprise cluster, configuring a service account for DC/OS Kubernetes on Enterprise is necessary. Since the pattern is similar here, we will move through it just a little faster than when [provisioning the service account for MKE]() earlier.

1. Start by creating a unique keypair to use for the service account, here we specify `kube1-priv.pem` and `kube1-pub.pem`:

    ```bash
    dcos security org service-accounts keypair kube1-priv.pem kube1-pub.pem
    ```

    You will find the resulting keypair in your working directory. As before, no other output is produced when the command is run successfully.

1. Now, create a service account this first Kuberneters cluster, `kubernetes-cluster1`, associated with the  public key, in this case:

    ```bash
    dcos security org service-accounts create -p kube1-pub.pem -d 'Service account for kubernetes-cluster1.'
    ```

    Again, successfully creating the service account will not create any CLI output.

1. Then, associate a secret with the cluster's service account using the newly generated private key. The service name will be ...

    ```bash
    dcos security secrets create-sa-secret kube1-pub.pem <service-name> <service-name>/sa
    ```

    Again, it is expected behavior in these steps for no output from the CLI to happen unless an error has occurred.

### Grant Permisions

We provide code snippets here for ease of granting [the necessary permissions](). After all, you have already learned some of this pattern when [setting up the service account for MKE]() previously. The list of is certainly a fair bit more extensive here but the pattern is similar.

#### Copy and Paste in Groups

If everything has gone right up until here, you should be able to paste these permissions in the following grouping of `dcos security` commands at a time without any errors. Here we have the Mesos master node permissions for creating and deleting tasks and reservations, followed by the secret permissions for the cluster, admin router permissions, and public agent node permissions.

1. Master node permissions:

    ```bash
    dcos security org users grant kubernetes-cluster1 dcos:mesos:master:framework:role:kubernetes-cluster1-role create
    dcos security org users grant kubernetes-cluster1 dcos:mesos:master:task:user:root create
    dcos security org users grant kubernetes-cluster1 dcos:mesos:agent:task:user:root create
    dcos security org users grant kubernetes-cluster1 dcos:mesos:master:reservation:role:kubernetes-cluster1-role create
    dcos security org users grant kubernetes-cluster1 dcos:mesos:master:reservation:principal:kubernetes-cluster1 delete
    dcos security org users grant kubernetes-cluster1 dcos:mesos:master:volume:role:kubernetes-cluster1-role create
    dcos security org users grant kubernetes-cluster1 dcos:mesos:master:volume:principal:kubernetes-cluster1 delete
    ```

1. Secret permissions:

    ```bash
    dcos security org users grant kubernetes-cluster1 dcos:secrets:default:/kubernetes-cluster1/* full
    dcos security org users grant kubernetes-cluster1 dcos:secrets:list:default:/kubernetes-cluster1 read
    ```

1. Admin Router permissions:

    ```bash
    dcos security org users grant kubernetes-cluster1 dcos:adminrouter:ops:ca:rw full
    dcos security org users grant kubernetes-cluster1 dcos:adminrouter:ops:ca:ro full
    ```

1. Public Agent permissions:

    ```bash
    dcos security org users grant kubernetes-cluster1 dcos:mesos:master:framework:role:slave_public/kubernetes-cluster1-role create
    dcos security org users grant kubernetes-cluster1 dcos:mesos:master:framework:role:slave_public/kubernetes-cluster1-role read
    dcos security org users grant kubernetes-cluster1 dcos:mesos:master:reservation:role:slave_public/kubernetes-cluster1-role create
    dcos security org users grant kubernetes-cluster1 dcos:mesos:master:volume:role:slave_public/kubernetes-cluster1-role create
    dcos security org users grant kubernetes-cluster1 dcos:mesos:master:framework:role:slave_public read
    dcos security org users grant kubernetes-cluster1 dcos:mesos:agent:framework:role:slave_public read
    ```

Again, as when [previously granting permissions](), you should not receive any feedback in your shell when these commands run successful.

### Create your first Kubernetes cluster

Now that permissions have been granted to the service account, we need to make sure that the package installer is aware of the account.

1. First, open the `options.json` file associated with the account. If you do not already have an `options.json` file, create a new one. In the CLI, enter:

    ```bash
    touch kubernetes1-options.json
    ```

    This will create the file in your current working directory, in this example we name the file `kubernetes1-options.json`.

1. Open the file in a text editor and add the service account information.

    Place the following snippet in the newly configured `kubernetes1-options.json` file:

    ```json
    {
        "service": {
            "service_account": "kubernetes-cluster1",
            "service_account_secret": "kubernetes-cluster1/sa"
        }
    }
    ```
    Save and close the file.

1. Initiate the Kubernetes cluster creation using the associated `kubernetes1-options.json` configured for the package in step (2).

    In the CLI, enter:

    ```bash
    dcos kubernetes cluster create --options=kubernetes1-options.json --yes
    ```
    You can easily use the DC/OS Kubernetes CLI to monitor your Kubernetes cluster creation. Run the following:

    ```bash
    dcos kubernetes cluster debug plan status deploy --cluster-name=kubernetes-cluster1
    ```

    When successful, you will see the complete cluster plan, as shown below:

    ```bash
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
    ```

<!-- *** maybe some more validation here? via DC/OS CLI or GUI? -->

## Create a second Kubernetes cluster on your DC/OS cluster

We include the use of a different keypair so as to not mix the keypair up with any of the others we are using. As before, using paste in the following snippets to your shell, just as we just did for the first cluster:

1. Create the `kubernetes-cluster2` service account :

    ```bash
    dcos security org service-accounts keypair kube2-priv.pem kube2-pub.pem
    dcos security org service-accounts create -p kube2-pub.pem -d 'Kubernetes service account' kubernetes-cluster2
    dcos security secrets create-sa-secret private-key.pem kubernetes-cluster2 kubernetes-cluster2/sa
    ```

1. Grant the `kubernetes-cluster2` service account [the required permissions for Kubernetes clusters]():

    ```bash
    dcos security org users grant kubernetes-cluster2 dcos:mesos:master:framework:role:kubernetes-cluster2-role create
    dcos security org users grant kubernetes-cluster2 dcos:mesos:master:task:user:root create
    dcos security org users grant kubernetes-cluster2 dcos:mesos:agent:task:user:root create
    dcos security org users grant kubernetes-cluster2 dcos:mesos:master:reservation:role:kubernetes-cluster2-role create
    dcos security org users grant kubernetes-cluster2 dcos:mesos:master:reservation:principal:kubernetes-cluster2 delete
    dcos security org users grant kubernetes-cluster2 dcos:mesos:master:volume:role:kubernetes-cluster2-role create
    dcos security org users grant kubernetes-cluster2 dcos:mesos:master:volume:principal:kubernetes-cluster2 delete
    ```

    ```bash
    dcos security org users grant kubernetes-cluster2 dcos:secrets:default:/kubernetes-cluster2/* full
    dcos security org users grant kubernetes-cluster2 dcos:secrets:list:default:/kubernetes-cluster2 read
    ```

    ```bash
    dcos security org users grant kubernetes-cluster2 dcos:adminrouter:ops:ca:rw full
    dcos security org users grant kubernetes-cluster2 dcos:adminrouter:ops:ca:ro full
    ```

    ```bash
    dcos security org users grant kubernetes-cluster2 dcos:mesos:master:framework:role:slave_public/kubernetes-cluster2-role create
    dcos security org users grant kubernetes-cluster2 dcos:mesos:master:framework:role:slave_public/kubernetes-cluster2-role read
    dcos security org users grant kubernetes-cluster2 dcos:mesos:master:reservation:role:slave_public/kubernetes-cluster2-role create
    dcos security org users grant kubernetes-cluster2 dcos:mesos:master:volume:role:slave_public/kubernetes-cluster2-role create
    dcos security org users grant kubernetes-cluster2 dcos:mesos:master:framework:role:slave_public read
    dcos security org users grant kubernetes-cluster2 dcos:mesos:agent:framework:role:slave_public read
    ```

    As usual, no output is expected upon successfully granting permissions.

1. Next, create an options JSON file for this cluster named `kubernetes2-options.json`:

    This options JSON provides examples of how to set cluster size. In this example, we will be deploying with `"kube_cpus": 1`, instead of the default `"kube_cpus": 2`.

    Use the following to create `kubernetes2-options.json`:

    ```bash
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
    ```

1. Create the `kubernetes-cluster2` cluster with the options JSON file you just created:

    ```bash
    dcos kubernetes cluster create --options=kubernetes2-options2.json --yes
    ```

1. As above, to monitor `kubernetes-cluster2` while being created, use the DC/OS Kubernetes CLI:

    ```bash
    dcos kubernetes cluster debug plan status deploy --cluster-name=kubernetes-cluster2
    ```

    Complete cluster plan shown below:

    ```bash
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
    ```

    If you use your GUI, you should see both clusters and the MKE as services in under **Services**.

    <SCREENSHOT HERE NEEDED>

# [Next: Connecting to Kubernetes on DC/OS Enterprise](/services/kubernetes/new/getting-started/connecting-to-kubernetes/)

Nice work! You now have multiple Kubernetes clusters running throughout your DC/OS Enterprise cluster. With the interal workings of the cluster all set, you can move on to [learning how to connect to your Kubernetes clusters on DC/OS Enterprise](/services/kubernetes/new/getting-started/connecting-to-kubernetes/) and view your Kubernetes dashboard in the next section of [**Getting Started with Kubernetes on DC/OS Enterprise**](/services/kubernetes/new/getting-started/).
