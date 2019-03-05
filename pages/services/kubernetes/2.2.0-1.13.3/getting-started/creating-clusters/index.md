---
layout: layout.pug
navigationTitle: Creating Kubernetes clusters using MKE
title: Creating Kubernetes clusters on DC/OS using MKE
menuWeight: 5
excerpt: Learn to create Kubernetes clusters on DC/OS using MKE and the DC/OS Kubernetes CLI.
enterprise: true
---

At this point, you should have 

- [installed MKE](/services/kubernetes/2.2.0-1.13.3/getting-started/installing-mke/) - using the DC/OS `kubernetes` package on your DC/OS Enterprise cluster  
- installed the [latest DC/OS Kubernetes CLI](/services/kubernetes/2.2.0-1.13.3/cli/). 

As when installing the MKE, to run this Kubernetes cluster as a service on our DC/OS Enterprise cluster, we need a service account for it. As before, we need to first provision a service account for this Kubernetes cluster, then grant it the necessary permissions for operating on DC/OS Enterprise.

## Provision a Service Account for DC/OS Kubernetes

As with MKE on DC/OS Enterprise, when installing DC/OS Kubernetes on a DC/OS Enterprise cluster, we must configure a service account for DC/OS Kubernetes on Enterprise. Since the pattern is similar, we will move through it just a little faster than when [provisioning the service account for MKE](/services/kubernetes/2.2.0-1.13.3/getting-started/installing-mke/) earlier.

1. Start by creating a unique keypair to use for the service account, here we specify `kube1-priv.pem` and `kube1-pub.pem`:

    ```bash
    dcos security org service-accounts keypair kube1-priv.pem kube1-pub.pem
    ```

    You will find the resulting keypair in your working directory. As before, no other output is produced when the command is run successfully.

1. Create a service account this first Kuberneters cluster, `kubernetes-cluster1`, associated with the public key.

    ```bash
    dcos security org service-accounts create -p kube1-pub.pem -d 'Service account for kubernetes-cluster1' kubernetes-cluster1
    ```

1. Associate a secret with the cluster's service account using the newly generated private key.

    ```bash
    dcos security secrets create-sa-secret kube1-priv.pem kubernetes-cluster1 kubernetes-cluster1/sa
    ```

    Again, it is expected behavior in these steps for no output from the CLI to appear unless an error has occurred.

## Grant Permisions

We provide code snippets for ease of granting the necessary permissions. After all, you have already learned some of this pattern when [setting up the service account for MKE](/services/kubernetes/2.2.0-1.13.3/getting-started/installing-mke/) previously. The list of commands is a bit more extensive here but the pattern is similar.

#### Copy and Paste in Groups

If everything has gone right up until now, you should be able to paste these permissions in the following grouping of `dcos security` commands at a time without any errors. Here we have the Mesos master node permissions for creating and deleting tasks and reservations, followed by the secret permissions for the cluster, admin router permissions, and public agent node permissions.

1. Enter master node permissions:

    ```bash
    dcos security org users grant kubernetes-cluster1 dcos:mesos:master:framework:role:kubernetes-cluster1-role create
    dcos security org users grant kubernetes-cluster1 dcos:mesos:master:task:user:root create
    dcos security org users grant kubernetes-cluster1 dcos:mesos:agent:task:user:root create
    dcos security org users grant kubernetes-cluster1 dcos:mesos:master:reservation:role:kubernetes-cluster1-role create
    dcos security org users grant kubernetes-cluster1 dcos:mesos:master:reservation:principal:kubernetes-cluster1 delete
    dcos security org users grant kubernetes-cluster1 dcos:mesos:master:volume:role:kubernetes-cluster1-role create
    dcos security org users grant kubernetes-cluster1 dcos:mesos:master:volume:principal:kubernetes-cluster1 delete
    ```

1. Enter secret permissions:

    ```bash
    dcos security org users grant kubernetes-cluster1 dcos:secrets:default:/kubernetes-cluster1/* full
    dcos security org users grant kubernetes-cluster1 dcos:secrets:list:default:/kubernetes-cluster1 read
    ```

1. Enter Admin Router permissions:

    ```bash
    dcos security org users grant kubernetes-cluster1 dcos:adminrouter:ops:ca:rw full
    dcos security org users grant kubernetes-cluster1 dcos:adminrouter:ops:ca:ro full
    ```

1. Enter public agent permissions:

    ```bash
    dcos security org users grant kubernetes-cluster1 dcos:mesos:master:framework:role:slave_public/kubernetes-cluster1-role create
    dcos security org users grant kubernetes-cluster1 dcos:mesos:master:framework:role:slave_public/kubernetes-cluster1-role read
    dcos security org users grant kubernetes-cluster1 dcos:mesos:master:reservation:role:slave_public/kubernetes-cluster1-role create
    dcos security org users grant kubernetes-cluster1 dcos:mesos:master:volume:role:slave_public/kubernetes-cluster1-role create
    dcos security org users grant kubernetes-cluster1 dcos:mesos:master:framework:role:slave_public read
    dcos security org users grant kubernetes-cluster1 dcos:mesos:agent:framework:role:slave_public read
    ```

    As before, you should not receive any feedback in your CLI when these commands run successfully.

## Create your first Kubernetes cluster

Now that permissions have been granted to the service account, we need to make sure that the package installer is aware of the account.

1. First, open the options JSON file associated with the account. If you do not already have an options JSON file, create a new one. In the CLI, enter:

    ```bash
    touch kubernetes1-options.json
    ```

    This will create the file in your current working directory: in this example we name the file `kubernetes1-options.json`.

1. Open the file in a text editor and add the service account information. Place the following snippet in the newly configured `kubernetes1-options.json` file:

    ```json
    {
        "service": {
            "name": "kubernetes-cluster1",
            "service_account": "kubernetes-cluster1",
            "service_account_secret": "kubernetes-cluster1/sa"
        }
    }
    ```
    Save and close the file.

1. Initiate the Kubernetes cluster creation using the associated `kubernetes1-options.json` configured for the package in last step.    In the CLI, enter:

    ```bash
    dcos kubernetes cluster create --options=kubernetes1-options.json --yes
    ```
    You can easily use the DC/OS Kubernetes CLI to monitor your Kubernetes cluster creation by running the following:

    ```bash
    dcos kubernetes cluster debug plan status deploy --cluster-name=kubernetes-cluster1
    ```

    When successful, you will see the complete cluster plan, as shown here:

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

You are now going to follow the same pattern to create `kubernetes-cluster2` as used to create the first cluster, `kubernetes-cluster1`.

It is a good practice to use a different keypair with the service account, so as to not mix this keypair up with any of the others we are using. As before, paste in the following snippets to your CLI, just as we just did for the first cluster:

1. Create the `kubernetes-cluster2` service account:

    ```bash
    dcos security org service-accounts keypair kube2-priv.pem kube2-pub.pem
    dcos security org service-accounts create -p kube2-pub.pem -d 'Kubernetes service account' kubernetes-cluster2
    dcos security secrets create-sa-secret kube2-priv.pem kubernetes-cluster2 kubernetes-cluster2/sa
    ```

1. Grant the `kubernetes-cluster2` service account the required permissions for Kubernetes clusters:

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

1. Next, create an `options.JSON` file for this cluster named `kubernetes2-options.json`. This `options.JSON` file provides an example of some of the configuration options available, listing some of the variable names and their default values. In this example, we will be deploying with `"kube_cpus": 1`, instead of the default value of `2`.

    Use the following to create `kubernetes2-options.json`:

    ```json
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

1. Create the `kubernetes-cluster2` cluster with the options JSON file you just created. From the DC/OS Kubernetes CLI, enter the following command:

    ```bash
    dcos kubernetes cluster create --options=kubernetes2-options.json --yes
    ```

    Your Kubernetes cluster service should start spinning up.

1. As above, to monitor `kubernetes-cluster2` while being created, use the DC/OS Kubernetes CLI:

    ```bash
    dcos kubernetes cluster debug plan status deploy --cluster-name=kubernetes-cluster2
    ```

    You should receive output similar to the following:

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

    In your GUI, you should see both clusters and the MKE as services under **Services**.

<!-- *** NEED SCREENSHOT FOR VALIDATION HERE. -->

**Next Step: Connecting to Kubernetes on DC/OS Enterprise**

Nice work! You now have multiple Kubernetes clusters running throughout your DC/OS Enterprise cluster. With the internal workings of the cluster all set, you can move on to [Configuring Edge-LB](/services/kubernetes/2.2.0-1.13.3/getting-started/config-edgelb-for-k8s/) to set up a load balancer for your cluster.
