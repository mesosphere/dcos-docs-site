---
layout: layout.pug
navigationTitle: Installing Kubernetes on DC/OS
title: Provisioning and Installing
menuWeight: 5
excerpt: Learn to run Kubernetes clusters on DC/OS
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes-cluster -->

This section will provide you with a basic installation of DC/OS Kubernetes.  For more advanced installation instructions, or to customize your installation of DC/OS Kubernetes, see the [Customizing](/services/kubernetes/2.0.1-1.12.2/operations/customizing-install/) section.

# Installing Kubernetes on DC/OS (Open Source)

## Prerequisites

- 1.12 DC/OS cluster ([Open Source installation](/1.12/installing/))
    - 1 Master
    - 5 Private Agents

- DC/OS CLI [installed and attached to the DC/OS 1.12 cluster](/1.12/cli/install/)

## Install the Mesosphere Kubernetes Engine (MKE)

<p class="message--warning"><strong>WARNING: </strong>Any attempt to install DC/OS Kubernetes on a cluster will fail without having installed MKE first.</p>

MKE is the engine used to generate DC/OS Kubernetes clusters. Accordingly, it is necessary to install the Mesosphere Kubernetes Engine (MKE) - the `kubernetes` package in the DC/OS CLI - before attempting to install a Kubernetes cluster on DC/OS (using either the `kubernetes-cluster` package or the DC/OS Kubernetes CLI's `dcos kubernetes cluster create` command).

To install MKE on DC/OS Open Source with the default configuration, enter the following command into your CLI terminal:

```bash
dcos package install --yes kubernetes
```

and your Kubernetes cluster should start spinning up. The progress is viewable in the DC/OS GUI under  **Services** in the GUI sidebar.

<!-- A link here above on **Services** would could be nice to our GUI page on **Services**  -->
<!-- Is there a way to get progress feedback from the CLI?? If so, that would be helpful here as well -->


## Install a Kubernetes Cluster

From the CLI, a default Kubernetes cluster can be created by running the following:

```bash
dcos kubernetes cluster create --yes
```

# Installing Kubernetes on DC/OS Enterprise

## Prerequisites

- [Superuser access](/1.12/security/ent/users-groups/reset-superuser/) to DC/OS Enterprise Cluster [enterprise type="inline" size="small" /]
- DC/OS CLI [installed and attached to your cluster](/1.12/cli/install/)
- DC/OS Enterprise CLI [installed](/1.12/cli/enterprise-cli/) [enterprise type="inline" size="small" /]

## Install the Mesosphere Kubernetes Engine (MKE)

MKE is the engine used to generate DC/OS Kubernetes clusters. Accordingly, It is necessary to install the Mesosphere Kubernetes Engine (MKE), aka the `kubernetes` package, before attempting to install DC/OS Kubernetes - the `kubernetes-cluster` package.

<p class="message--warning"><strong>WARNING: </strong>Any attempt to install DC/OS Kubernetes on a cluster will fail without having installed MKE first.</p>

To install MKE on an DC/OS Enterprise cluster, we must first provision a service account for MKE, grant the appropriate permissions to that MKE service account, and then finally install the MKE package - `kubernetes`.

### Provision a Service Account for MKE

In order to run Mesosphere Kubernetes Engine - the `kubernetes` package - on DC/OS Enterprise, a service account with permissions to run tasks under the `kubernetes-role` is required. To provision such a service account, we will need to carry out a few security steps:

1. Start by creating a unique keypair to use for the service account. The basic format looks like this:

    ```bash
    dcos security org service-accounts kepair <private-key>.pem <public-key>.pem
    ```

    where you replace `<private-key>` with the name of the private key to associate with the service account, and, of course, likewise for `<public-key>`. For example, if you wanted to use a naming convention of `mke-priv` and `mke-pub`, enter this on the command line:

    ```bash
    dcos security org service-accounts kepair mke-priv.pem mke-pub.pem
    ```

    This will create a keypair in the working directory as `mke-priv.pem` and `mke-pub.pem`.

2. Next, create the service account using the public key you just generated.

    ```bash
    dcos security org service-accounts create -p <public-key>.pem -d 'Kubernetes service account' kubernetes
    ```

    Which will look like this if using the `mke-pub.pem` from above:

    ```bash
    dcos security org service-accounts create -p mke-pub.pem -d 'Kubernetes service account' kubernetes
    ```

    You should see no output from the CLI in response to these commands. This is expected behavior.

3. Then, associate a secret with the service account using the private key.

    ```bash
    dcos security secrets create-sa-secret <private-key>.pem kubernetes kubernetes/sa
    ```

    Using the `mke` keypair example:

    ```bash
    dcos security secrets create-sa-secret mke-priv.pem kubernetes kubernetes/sa
    ```

    Again, it is expected behavior for no output from the CLI unless an error has occurred.

### Grant Permissions to the newly created service account

Now that a service account is provisioned for MKE, we need to grant certain permissions to the service account under a mesos role, in this case `kubernetes-role`.

1. First, grant `mesos master reservation role` permission to the kubernetes service account under `kubernetes-role`.

    In the CLI, enter:

    ```bash
    dcos security org users grant kubernetes dcos:mesos:master:reservation:role:kubernetes-role create
    ```

    Again, like in the procedure above, these `dcos-security` commands will not respond with output in the CLI. However, some conditions will cause corresponding errors to register, such as already having granted the permissions trying to be granted.

2. Next, grant `mesos master framework` permissions under the same role.

    ```bash
    dcos security org users grant kubernetes dcos:mesos:master:framework:role:kubernetes-role create
    ```

3. Finally, grant `mesos master task permission`.

    ```bash
    dcos security org users grant kubernetes dcos:mesos:master:task:user:nobody create
    ```
    As long as the permissions have been granted  successfully, which in this case means without any response from the CLI, we are ready to move on.

### Install the MKE Package

Now that permissions have been granted to the service account, we need to make sure that the package installer is aware of the account.

1. First, open the `options.json` file associated with the account. If you do not already have an `options.json` file, create a new one. In the CLI, enter:

    ```bash
    touch mke-options.json
    ```

    This will create the file in your current working directory, in this example we name the file `mke-options.json`.

1. Open the file in a text editor and add the service account information.

    Place the following snippet in the newly configured `mke-options.json` file:

    ```json
      {
          "service": {
              "service_account": "kubernetes",
              "service_account_secret": "kubernetes/sa"
          }
      }
    ```

    Save and close the file.

1. Install the package using the associated `mke-options.json` configured for the package in step (2).

    In the CLI, enter:

    ```bash
    dcos package install --yes kubernetes --options=mke-options.json
    ```

## Install a DC/OS Kubernetes Cluster

Now that you have installed MKE - the `kubernetes`package - on your DC/OS Enterprise cluster, you can install DC/OS Kubernetes. As with MKE on DC/OS Enterprise, when installing DC/OS Kubernetes on a DC/OS Enterprise cluster, configuring a service account for DC/OS Kubernetes on Enterprise is mandatory.

### Provision a Service Account
1. Provisioning the `kubernetes-cluster` account follows a similar pattern as before. We start by creating a service account for the kubernetes cluster.

    ```bash
    dcos security org service-accounts create -p <public-key>.pem -d <`Description of service account'> <service-name>
    ```

    Which, with our `mke-pub` key and using the default name looks like this:

    ```bash
    dcos security org service-accounts create -p mke-pub.pem -d 'Kubernetes service account' kubernetes-cluster
    ```

2. Then, associate a secret with the service account using the private key.

    ```bash
    dcos security secrets create-sa-secret <private-key>.pem <service-name> <service-name>/sa
    ```

    Using the `mke` keypair example:

    ```bash
    dcos security secrets create-sa-secret mke-priv.pem kubernetes-cluster kubernetes-cluster/sa
    ```

    Again, it is expected behavior in these steps for no output from the CLI to happen unless an error has occurred.

### Grant Permisions

This is the list of permissions that needs to be granted, where each instance of `<service-name>` is replaced by the name of your planned kubernetes cluster, which will install to a default of `kubernetes-cluster` if not otherwise named (TODO: link to creating second cluster).

The basic pattern is listed here:

```bash
dcos security org users grant kubernetes dcos:mesos:master:framework:role:<service name>-role create
dcos security org users grant kubernetes dcos:mesos:master:task:user:root create
dcos security org users grant kubernetes dcos:mesos:agent:task:user:root create
dcos security org users grant kubernetes dcos:mesos:master:reservation:role:<service name>-role create
dcos security org users grant kubernetes dcos:mesos:master:reservation:principal:<service name> delete
dcos security org users grant kubernetes dcos:mesos:master:volume:role:<service name>-role create
dcos security org users grant kubernetes dcos:mesos:master:volume:principal:<service name> delete

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
