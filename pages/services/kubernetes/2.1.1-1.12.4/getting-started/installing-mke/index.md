---
layout: layout.pug
navigationTitle: Installing MKE
title: Installing the Mesosphere Kubernetes Engine
menuWeight: 3
excerpt: Install the Mesosphere Kubernetes Engine on your DC/OS Cluster
enterprise: true
---

Now that your DC/OS Enterprise cluster is [ready to install Kubernetes on DC/OS](/services/kubernetes/2.1.1-1.12.4/getting-started/setting-up/), you will install the Mesosphere Kubernetes Engine (MKE) on top of DC/OS.

MKE is the engine DC/OS uses to generate DC/OS Kubernetes clusters. Accordingly, it is necessary to install the Mesosphere Kubernetes Engine (MKE) - installed via the `kubernetes` package - before attempting to install DC/OS Kubernetes clusters on DC/OS.

To install MKE on an DC/OS Enterprise cluster, we must first provision a service account for MKE, grant the appropriate permissions to that MKE service account, and then finally install the MKE package - `kubernetes`.

## Provision a Service Account for MKE

In order to run Mesosphere Kubernetes Engine - the `kubernetes` package - on DC/OS Enterprise, a service account with permissions to run tasks under the `kubernetes-role` is required. However, to provision such a service account, we will need to carry out a few security steps:

1. <strong>Start by creating a unique keypair to use for the service account.</strong>

    The basic format looks like this:

    ```bash
    dcos security org service-accounts keypair <private-key>.pem <public-key>.pem
    ```

    where you replace `<private-key>` with the name of the private key to associate with the service account, and, of course, likewise for `<public-key>`. For example, if you wanted to use a naming convention of `mke-priv` and `mke-pub`, enter this on the command line:

    ```bash
    dcos security org service-accounts keypair mke-priv.pem mke-pub.pem
    ```

    This will create a keypair in the working directory as `mke-priv.pem` and `mke-pub.pem`.

1. <strong>Next, create the service account using the public key you just generated.</strong>

    ```bash
    dcos security org service-accounts create -p <public-key>.pem -d '<Description>' kubernetes
    ```

    Which will look like this if using the `mke-pub.pem` from above:

    ```bash
    dcos security org service-accounts create -p mke-pub.pem -d 'Kubernetes service account' kubernetes
    ```

    You should see no output from CLI in response. This is the expected behavior.

1. <strong>Last, associate a secret with the service account using the private key</strong>.

    ```bash
    dcos security secrets create-sa-secret <private-key>.pem kubernetes kubernetes/sa
    ```

    Using the `mke-*` keypair example here:

    ```bash
    dcos security secrets create-sa-secret mke-priv.pem kubernetes kubernetes/sa
    ```

    Again, it is expected behavior for no output from the CLI unless an error has occurred.

## Grant Permissions to the MKE service account

Now that a service account is provisioned for MKE, we need to grant certain permissions to the service account under a Mesos role, in this case `kubernetes-role`. To grant the permissions to MKE:

1. <strong>First, grant</strong> `mesos master reservation role` <strong> permissions to the kubernetes service account under</strong>`kubernetes-role`</strong>:

    In the CLI, enter:

    ```bash
    dcos security org users grant kubernetes dcos:mesos:master:reservation:role:kubernetes-role create
    ```

    Again, like in the procedure above, these `dcos-security` commands will not respond with output in the CLI. However, some conditions will cause corresponding errors to register, such as already having granted the permissions trying to be granted.

1. <strong>Next, grant </strong> `mesos master framework` <strong> permission under the same role. </strong>

    ```bash
    dcos security org users grant kubernetes dcos:mesos:master:framework:role:kubernetes-role create
    ```

1. <strong> Finally, grant</strong> `mesos master task` <strong>permission: </strong>

    ```bash
    dcos security org users grant kubernetes dcos:mesos:master:task:user:nobody create
    ```

    As long as all the permissions have been granted successfully, you are ready to move on.

## Install the MKE Package

Now that permissions have been granted to the service account, we need to make sure that the package installer is aware of the account.

1. <strong>First, open the options JSON file associated with the account</strong>.

    If you do not already have an options JSON file, you can easily create one. In your CLI, enter:

    ```bash
    touch mke-options.json
    ```

    This will create the file in your current working directory, in this example we name the file `mke-options.json`.

1. <strong>Open the file in a text editor and add the service account information</strong>.

    Place the following snippet in the newly configured `mke-options.json` file:

    ```json
    {
        "service": {
            "service_account": "kubernetes",
            "service_account_secret": "kubernetes/sa"
        }
    }
    ```

    Save and close the file to be used to install the package.

1. <strong>Install the package using the associated</strong> `mke-options.json`<strong> configured for the package in the last step.</strong>

    In the CLI, enter:

    ```bash
    dcos package install --yes kubernetes --options=mke-options.json
    ```

    Which should result in the following output when things work as expected:

    ```bash
    $ dcos package install --yes kubernetes --options=mke-options.json
    Installing Marathon app for package [kubernetes] version [2.1.1-1.12.4]
    Installing CLI subcommand for package [kubernetes] version [2.1.1-1.12.4]
    New command available: dcos kubernetes
    The Mesosphere Kubernetes Engine service is being installed.
    ```

For more information on the CLI management commands for DC/OS Kubernetes see [the CLI reference section of this documentation](/services/kubernetes/2.1.1-1.12.4/cli/).

## Next Step: Creating Kubernetes Clusters on DC/OS Enterprise

Now that MKE is installed on your DC/OS cluster, you can move on to [creating Kubernetes clusters on top of DC/OS Enterprise](/services/kubernetes/2.1.1-1.12.4/getting-started/creating-clusters/).
