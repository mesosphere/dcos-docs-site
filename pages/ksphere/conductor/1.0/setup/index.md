---
layout: layout.pug
navigationTitle: Setup
title: Setup
menuWeight: 20
beta: false
excerpt: Get Conductor installed on the cluster and get users signed up.
---

# Install on a Cluster

Conductor is installed across a Kubernetes cluster via Helm chart and can be accessed at that cluster's public load balancer using `/conductor/`.

## Prerequisites

By default, Konvoy 1.2, 1.3, and 1.5 clusters have all the necessary addons to install Conductor 1.0. However, due to bug in Traefik v1.7.23, which Konvoy 1.4 relies upon for network monitoring, Conductor 1.0 is not compatible with Konvoy 1.4.

If you do not have a [Konvoy Kubernetes cluster](https://d2iq.com/solutions/ksphere/konvoy), to install Conductor, you must have:

1. Kubernetes v1.13-v1.17, with admin access
1. Helm v2 (v3 is not supported)
1. Traefik: V1.7.x, with the exception of V1.7.23.
    - *** NOTE: Traefik V1.7.23 has a serious bug that breaks Conductor ***
    - Traefik V2.x is not supported.
1. cert-manager, v.0.10.0 or earlier.


## Procedure

1. From a CLI with cluster access, run:

```bash
helm repo add learning-hub-server https://mesosphere.github.io/learning-hub-server/charts
helm repo update
```

to add the Helm repo and update it, then:

```bash
helm install learning-hub-server/conductor --name conductor --set subClusters.sshClusters.limit=10
```

to install the service with a resource limit of 10 KIND clusters for the application deployment.

1. After installation is complete, wait a few minutes for the network to fully stand up and your Conductor instance will be accessible at:

```
<your-cluster's-publicloadbalancer>/conductor/
```

# Becoming the First Administrator

Your Conductor database comes seeded with one default user - `bootstrapuser` - so that you can log in to Conductor for the first time and set up your account to be the first administrator (other than the default).

## Navigate to the Admin Portal

1. Navigate to your Conductor url:

```
<your-cluster's-publicloadbalancer>/conductor/
```
NOTE: You will see the load balancer's address toward the end of the install process output.

1. Login as `bootstrapuser` using password `deleteme`.

1. In the Navbar, select **bootstrapuser** next to the user icon 👤, to trigger the drop-down.

1. Select **Admin Portal** from the drop-down, which will take you to the *Admin Portal* page.

## Create your Account

1. Create a sign-up link by selecting **Generate** on the *Admin Portal* page.

1. Use the **Copy** button to copy the link to your clipboard.

1. Logout as `bootstrapuser` using the 👤 dropdown.
    * If you do not logout or use a fresh or incognito'd browser instance, the sign-up link with just bring you back to the Admin Portal page.

1. Navigate to the sign-up link provided.

    **DO NOT SHARE THE SIGN-UP LINK WITH ANYONE**

1. Sign up with the information necessary for your new account.

## Become the First Official Admin

1. If you are not still logged in as `bootstrapuser`, do so again using password `deletme`.

1. Return to *Admin Portal* page.

1. Destroy the temporary sign-up link you used to create your new account, so that it is no longer active.

1. Assign the 'Admin' role to your new account.

## Become the Only Admin

1. Logout from the `bootstrapuser` account.

1. Log back in to your new account to which you just assigned the Admin role.

1. Go back to the *Admin Portal* page.

1. Delete BootstrapUser DeleteMe from your roster to prevent anyone unassigned from gaining access to the *Admin Portal* page.

    **IF YOU DO NOT DELETE THE BootstrapUser DeleteMe ACCOUNT FROM THE ROSTER, REVOKE ITS ADMIN ROLE, OR CHANGE THE PASSWORD TO THAT ACCOUNT, ANYONE WITH ACCESS TO THESE DOCS COULD SIGN IN AS AN ADMINISTRATOR VIA THAT ACCOUNT.**

# Inviting your First Learners

To invite learners to join your organization's Conductor instance, create another sign-up link using **Generate** and share this link with those you want to sign up.

**NOTE**:
- Any sign-up link will be usable until it is destroyed using  **Delete Signup Link**.
- Anyone with access to this link and a unique email address can sign up to your organization's instance of Conductor.
- After being destroyed, a link is unrecoverable.
- It is suggested to be very careful when sharing sign-up links and only distribute to those who are trusted and understand  the implications of having access to the link.
- It is also a best practice to not let links stay active too long, as they are an open door for making accounts to anyone with the link.

For more information on Sign-up Links, see the [Admin Guide](/adminguide/index.md).
