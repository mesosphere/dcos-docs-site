---
layout: layout.pug
navigationTitle: Installing Clusters
title: Installing Kubernetes clusters on DC/OS
menuWeight: 10
excerpt: Learn to create Kubernetes clusters on DC/OS
---

<p class="message--note"><strong>NOTE: </strong>Any attempt to install DC/OS Kubernetes on a cluster will fail without having installed MKE first.</p>

# Install a DC/OS Kubernetes Cluster

Now that you have [installed MKE](/services/kubernetes/LATEST) (the `kubernetes`package) on your DC/OS Enterprise cluster, you are now in a position to provision multiple Kubernetes clusters to work together on top of DC/OS.

# Provision a Service Account for DC/OS Kubernetes

As with MKE on DC/OS Enterprise, when installing DC/OS Kubernetes on a DC/OS Enterprise cluster, configuring a service account for DC/OS Kubernetes on Enterprise is mandatory.

1. Start by creating a unique keypair to use for the service account, here we use 'kube-cluster-priv' and 'kube-cluster-pub':

```bash
dcos security org service-accounts kepair kube-cluster-priv.pem kube-cluster-pub.pem
```

You will find the resulting keypair in your working directory. No other output is produced when the command is run successfully.

1. Now, create a service account for the DC/OS Kubernetes package, `kubernetes-cluster`, associated with the genereated public key:

```bash
dcos security org service-accounts create -p kube-cluster-pub.pem -d 'Kubernetes service account' kubernetes-cluster
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

### Grant Permisions

This is the list of permissions that needs to be granted, where each instance of `<service-name>` is replaced by the name of your planned kubernetes cluster, which will install to a default of `kubernetes-cluster` if not otherwise named (TODO: link to creating second cluster).

The basic pattern is listed here:

Mesos permissions

```bash
dcos security org users grant kubernetes dcos:mesos:master:framework:role:<service name>-role create
dcos security org users grant kubernetes dcos:mesos:master:task:user:root create
dcos security org users grant kubernetes dcos:mesos:agent:task:user:root create
dcos security org users grant kubernetes dcos:mesos:master:reservation:role:<service name>-role create
dcos security org users grant kubernetes dcos:mesos:master:reservation:principal:<service name> delete
dcos security org users grant kubernetes dcos:mesos:master:volume:role:<service name>-role create
dcos security org users grant kubernetes dcos:mesos:master:volume:principal:<service name> delete

Secrets permissions

dcos security org users grant kubernetes dcos:secrets:default:/<service name>/* full
dcos security org users grant kubernetes dcos:secrets:list:default:/<service name> read
dcos security org users grant kubernetes dcos:adminrouter:ops:ca:rw full
dcos security org users grant kubernetes dcos:adminrouter:ops:ca:ro full



dcos security org users grant kubernetes dcos:mesos:master:framework:role:slave_public/<service name>-role create
dcos security org users grant kubernetes dcos:mesos:master:framework:role:slave_public/<service name>-role read
dcos security org users grant kubernetes dcos:mesos:master:reservation:role:slave_public/<service name>-role create
dcos security org users grant kubernetes dcos:mesos:master:volume:role:slave_public/<service name>-role create
dcos security org users grant kubernetes dcos:mesos:master:framework:role:slave_public read
dcos security org users grant kubernetes dcos:mesos:agent:framework:role:slave_public read
```

For your convenience in following along, we have filled in all of the instances of `<service-name>` with the default `kubernetes-cluster` here, and depending on your shell, you may be able to paste them in a few at a time.

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

### Install the `kubernetes-cluster` package and create your first cluster

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
