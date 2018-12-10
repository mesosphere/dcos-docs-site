---
layout: layout.pug
navigationTitle: Setting Up
title: Setting up the DC/OS cluster for Kubernetes
menuWeight: 1
excerpt: Setting up the DC/OS cluster to work demonstrate Kubernetes on DC/OS Enterprise
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes-cluster -->

This initial section is to get your DC/OS Enterprise cluster setup to facilitate the [learning objectives]() of this tutorial: [**'Getting Started with Kubernetes on DC/OS Enterprise'**]().

# Prerequisite: DC/OS Enterprise [enterprise type="inline" size="small" /]

You will need superuser access](/1.12/security/ent/users-groups/reset-superuser/) to an unutilized cluster of virtual machines (VMs), minimally:

  * 1 Master node
  * 5 Private agent nodes
  * 1 Public agent node
  * Each node with resources equivalent or greater to that of an [m4.xlarge AWS EC2 VM]()

Once you have your cluster up and ready as specified by the above prerequisites, we must:

- DC/OS CLI [installed and attached to your cluster](/1.12/cli/install/)
- DC/OS Enterprise CLI [installed](/1.12/cli/enterprise-cli/) [enterprise type="inline" size="small" /]
- Authenticate to the DC/OS CLI using HTTPS

# Kubernetes HTTPS requirement:

The Mesosphere Kubernetes Engine (MKE) requires access over HTTPS in order to connect to the kubernetes-apiserver using `kubectl`. So to finish setting up the cluster and before moving on to installing the MKE, let's go ahead and make sure you are authenticated to the DC/OS CLI using HTTPS:

1. In your CLI, enter:

    ```bash
    dcos config show core.dcos_url
    ```

<!-- *** NEED some validation here. -->

1. If the returned URL doesn't start with https:// run:

    ```bash
    dcos config set core.dcos_url https://<master_public_IP_or_ELB_address>
    ```

<!-- *** NEED some validation here. -->

1. Moreover, if the TLS certificate used by DC/OS is not trusted in your case, you can run the following command to disable TLS verification:

    ```bash
    dcos config set core.ssl_verify false
    ```
<!-- *** NEED some validation here. -->

Now that you have your DC/OS cluster all setup, you are ready to [install the Mesosphere Kubernetes Engine(MKE)](getting-started/provision-install/installing-mke/) on top in the next part of the [**'Getting Started with Kubernetes on DC/OS Enterprise'**]()

<!-- *** NEED some links to community slack and whatnot here to drive traffic that way for feedback. -->
