---
layout: layout.pug
navigationTitle: Setup
title: Setup
menuWeight: 20
beta: true
excerpt: Get Conductor installed on the cluster and get users signed up.
---

# Install on a Cluster

Conductor is installed across a Kubernetes cluster via Helm chart and can be accessed at that cluster's public load balancer using `/conductor`.

## Prerequisites

To install Conductor, you must have:

1. A Kubernetes cluster with permissions
    - v1.13 through v1.17
1. Traefik for networking
    - less v2.0
    - NOT v1.7.23 - socket bug
1. cert-manager
    - nothing beyond v0.10.0

NOTE: default Konvoy 1.2, 1.3, and 1.5 clusters are compatible with Conductor 1.0. However, due to bug in Traefik v1.7.23, which Konvoy 1.4 relies upon for network monitoring, Conductor 1.0 is not compatible with Konvoy 1.4.

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
<your-cluster's- publicloadbalancer>/conductor
```

# Becoming the First Administrator

Your Conductor database comes with one default user - `bootstrapuser@example.com` - so that you can log in to Conductor for the first time and set up your account to be the first Admin other than the default.

## Navigate to the Admin Portal

1. Navigate to your Conductor url:

```
<your-cluster's-publicloadbalancer>/conductor
```
NOTE: You will see the load balancer's address toward the end of the install process output.

1. Login as `bootstrapuser@example.com` using password `deleteme`.

1. In the Navbar, select **bootstrapuser@example.com** to trigger the drop-down.

1. Select **Admin Portal** from the drop-down, which will take you to the *Admin Portal* page.

## Create your Account

1. Create a sign-up link by selecting  *Create Sign-up Link** on the *Admin Portal* page.

1. Navigate to the sign-up link provided.

    **DO NOT SHARE THE SIGN-UP LINK WITH ANYONE**

1. Sign up with the email address you want associated with this new account.

## Become the First Official Admin

1. If you are not still logged in as `bootstrapuser@example.com`, do so again.

1. Return to *Admin Portal* page.

1. Destroy the temporary sign-up link you used to create your new account, so that it is no longer active.

1. Assign the Admin role to your new account.

## Become the Only Admin

1. Logout from `bootstrapuser@example.com`.

1. Log back in to your new account to which you just assigned the Admin role.

1. Go back to the *Admin Portal* page.

1. **Delete `bootstrapuser@example.com` from your roster to prevent anyone unassigned from gaining access to the *Admin Portal* page.**

# Inviting your First Learners

To invite learners to join your organization's Conductor instance, create another sign-up link using **Create Signup Link** and share this link with those you want to sign up.

**NOTE**:
- Any sign-up link will be usable until it is destroyed using  **Delete Signup Link**.
- Anyone with access to this link and a unique email address can sign up to your organization's instance of Conductor.
- After being destroyed, a link is unrecoverable.
- It is suggested to be very careful when sharing sign-up links and only distribute to those who are trusted and understand  the implications of having access to the link.
- It is also a best practice to not let links stay active too long, as they are an open door for making accounts to anyone with the link.

For more information on Sign-up Links, see the [Admin Guide](/adminguide).
