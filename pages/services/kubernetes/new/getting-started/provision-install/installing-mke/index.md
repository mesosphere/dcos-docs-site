---
layout: layout.pug
navigationTitle: Installing MKE
title: Installing MKE
menuWeight: 5
excerpt: Install the Mesosphere Kubernetes Engine
---

# Installing Mesosphere Kubernetes Engine (MKE) on Enterprise DC/OS

MKE is the engine DC/OS uses to generate DC/OS Kubernetes clusters. Accordingly, it is necessary to install the Mesosphere Kubernetes Engine (MKE) - installed via the `kubernetes` package - before attempting to install DC/OS Kubernetes clusters on DC/OS installed by the `kubernetes-cluster` package in the DC/OS CLI.

To install MKE on an DC/OS Enterprise cluster, we must first provision a service account for MKE, grant the appropriate permissions to that MKE service account, and then finally install the MKE package, `kubernetes`.

## Provision a Service Account for MKE

In order to run Mesosphere Kubernetes Engine - the `kubernetes` package - on DC/OS Enterprise, a service account with permissions to run tasks under the `kubernetes-role` is required. However, to provision such a service account, we will need to carry out a few security steps:

1. Start by creating a unique keypair to use for the service account. The basic format looks like this:

```bash
dcos security org service-accounts kepair <private-key>.pem <public-key>.pem
```

where you replace `<private-key>` with the name of the private key to associate with the service account, and, of course, likewise for `<public-key>`. For example, if you wanted to use a naming convention of `mke-priv` and `mke-pub`, enter this on the command line:

```bash
dcos security org service-accounts kepair mke-priv.pem mke-pub.pem
```

This will create a keypair in the working directory as `mke-priv.pem` and `mke-pub.pem`.

1. Next, create the service account using the public key you just generated.

```bash
dcos security org service-accounts create -p <public-key>.pem -d '<Description>' kubernetes
```

Which will look like this if using the `mke-pub.pem` from above:

```bash
dcos security org service-accounts create -p mke-pub.pem -d 'Kubernetes service account' kubernetes
```

You should see no output from the CLI in response to these `dcos security` commands used thus far. This is the expected behavior.

1. Then, associate a secret with the service account using the private key.

```bash
dcos security secrets create-sa-secret <private-key>.pem kubernetes kubernetes/sa
```

 Using the `mke` keypair example:

```bash
dcos security secrets create-sa-secret mke-priv.pem kubernetes kubernetes/sa
```

Again, it is expected behavior for no output from the CLI unless an error has occurred.

## Grant Permissions to the newly created service account

Now that a service account is provisioned for MKE, we need to grant certain permissions to the service account under a mesos role, in this case `kubernetes-role`.

1. First, grant `mesos master reservation role` permission to the kubernetes service account under `kubernetes-role`.

In the CLI, enter:

```bash
dcos security org users grant kubernetes dcos:mesos:master:reservation:role:kubernetes-role create
```

Again, like in the procedure above, these `dcos-security` commands will not respond with output in the CLI. However, some conditions will cause corresponding errors to register, such as already having granted the permissions trying to be granted.

1. Next, grant `mesos master framework` permissions under the same role.

```bash
dcos security org users grant kubernetes dcos:mesos:master:framework:role:kubernetes-role create
```

1. Finally, grant `mesos master task permission`.

```bash
dcos security org users grant kubernetes dcos:mesos:master:task:user:nobody create
```

As long as the permissions have been granted  successfully, which in this case means without any response from the CLI, we are ready to move on.

## Install the MKE Package

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
