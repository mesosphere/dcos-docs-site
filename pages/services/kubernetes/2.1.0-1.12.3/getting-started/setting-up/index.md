---
layout: layout.pug
navigationTitle: Setting Up
title: Setting up the DC/OS cluster
menuWeight: 1
excerpt: Learn to setup the DC/OS cluster to demonstrate Kubernetes on DC/OS Enterprise
enterprise: true
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes-cluster -->

## Prerequisite: DC/OS Enterprise cluster [enterprise type="inline" size="small" /]

You will need [superuser access](/1.12/security/ent/users-groups/reset-superuser/) to an unutilized cluster of virtual machines (VMs). While more is usually always better for seeing more of what DC/OS Kubernetes works at scale, the following is the minimal setup for this current tutorial.

  * 1 master node
  * 5 private agent nodes
  * 1 public agent node
  * Each node with resources equivalent or greater to that of an `m4.xlarge` AWS EC2 VM

Once you have your cluster infrastructure up and ready as specified by the above minimum prerequisites, you will next install both DC/OS CLIs:

- the [DC/OS CLI](/1.12/cli/install/)
- the [DC/OS Enterprise CLI](/1.12/cli/enterprise-cli/) [enterprise type="inline" size="small" /]

before continuing on.

## The Kubernetes HTTPS requirement:

The Mesosphere Kubernetes Engine (MKE) requires access over HTTPS in order to connect to the kubernetes-apiserver using `kubectl`. So to finish setting up the cluster and before moving on to installing the MKE, let's go ahead and make sure you are authenticated to the DC/OS CLI using HTTPS:

1. **In your CLI, enter:**

    ```bash
    dcos config show core.dcos_url
    ```

<!-- *** NEED some validation here. -->

2. **If the returned URL does not start with** `https://`**, enter:**

    ```bash
    dcos config set core.dcos_url https://<master_public_IP_address>
    ```

<!-- *** NEED some validation here. -->

3. **Moreover, if the [TLS certificate](/services/kubernetes/2.1.0-1.12.3/operations/connecting-clients/) used by DC/OS is not trusted in your case, you can run the following command to disable TLS verification for the purposes of completing this tutorial:**

    ```bash
    dcos config set core.ssl_verify false
    ```
<!-- *** NEED some validation here. -->

4. **To verify that the cluster is connected, or if there was a change to `https`, setup the cluster again, making sure to insert the actual URL of your cluster**:

    ```bash
    dcos cluster setup <cluster-url>
    ```

    Accept any permissions requests for your certificate.

## Next Step: Installing the Mesosphere Kubernetes Engine

Now that you have your DC/OS cluster all set up, you are ready to [install the Mesosphere Kubernetes Engine](/services/kubernetes/2.1.0-1.12.3/getting-started/installing-mke/).

<!-- *** COULD USE some links to community slack and whatnot here to drive traffic that way for feedback. -->
