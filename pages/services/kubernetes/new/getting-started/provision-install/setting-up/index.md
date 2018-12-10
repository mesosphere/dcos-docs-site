---
layout: layout.pug
navigationTitle: Setting Up
title: Setting up the DC/OS cluster
menuWeight: 1
excerpt: Learn to setup the DC/OS cluster to demonstrate Kubernetes on DC/OS Enterprise
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes-cluster -->
# Setting up your DC/OS Enterprise cluster

This initial section is to get your DC/OS Enterprise cluster setup to facilitate the [learning objectives]() of this tutorial: [**'Getting Started with Kubernetes on DC/OS Enterprise'**]().

## Prerequisite: DC/OS Enterprise cluster [enterprise type="inline" size="small" /]

You will need superuser access](/1.12/security/ent/users-groups/reset-superuser/) to an unutilized cluster of virtual machines (VMs), minimally:

  * 1 Master node
  * 5 Private agent nodes
  * 1 Public agent node
  * Each node with resources equivalent or greater to that of an [m4.xlarge AWS EC2 VM]()

Once you have your cluster infrastructure up and ready as specified by the above prerequisites, you will want to install both:

- the [DC/OS CLI](/1.12/cli/install/)
- the [DC/OS Enterprise CLI](/1.12/cli/enterprise-cli/) [enterprise type="inline" size="small" /]

before continuing on.

## The Kubernetes HTTPS requirement:

The Mesosphere Kubernetes Engine (MKE) requires access over HTTPS in order to connect to the kubernetes-apiserver using `kubectl`. So to finish setting up the cluster and before moving on to installing the MKE, let's go ahead and make sure you are authenticated to the DC/OS CLI using HTTPS:

1. In your CLI, enter:

    ```bash
    dcos config show core.dcos_url
    ```

<!-- *** NEED some validation here. -->

1. If the returned URL doesn't start with `https://`, :enter:

    ```bash
    dcos config set core.dcos_url https://<master_public_IP_address>
    ```

<!-- *** NEED some validation here. -->

1. Moreover, if the [TLS certificate]() used by DC/OS is not trusted in your case, you can run the following command to disable TLS verification for this tutorial:

    ```bash
    dcos config set core.ssl_verify false
    ```
<!-- *** NEED some validation here. -->

# Next Step: [Installing the Mesosphere Kubernetes Engine](/services/kubernetes/new/getting-started/provision-install/installing-mke/)

Now that you have your DC/OS cluster all setup, you are ready to [install the Mesosphere Kubernetes Engine(MKE)](/services/kubernetes/new/getting-started/provision-install/installing-mke/) on top in the next part of the [**Getting Started with Kubernetes on DC/OS Enterprise**](/services/kubernetes/new/getting-started/).

<!-- *** COULD USE some links to community slack and whatnot here to drive traffic that way for feedback. -->
