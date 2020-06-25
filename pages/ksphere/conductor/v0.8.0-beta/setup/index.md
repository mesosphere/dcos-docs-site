---
layout: layout.pug
navigationTitle: Setup
title: Setup
menuWeight: 20
beta: true
excerpt: From getting Conductor installed on the cluster to getting users signed up.
---

# Install on a Cluster

Conductor is installed across a Kubernetes cluster via Helm chart and can be accessed at that cluster's public load balancer using `/conductor`.

## Prerequisites

To install Conductor, you must at least have:

1. a Kubernetes cluster (min version?) running Helm 2.x with y cluster perms,
1. available infra resources: 20 cores, Y GB mem, Z GB storage.

## Procedure

1. From a CLI with <sufficient cluster access>, run `helm <command>` to begin installing Conductor.

1. After installation is complete, your Conductor instance will be accessible at:

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

1. Login as `bootstrapuser@example.com` using password `deleteme`.

1. In the Navbar, select **bootstrapuser@example.com** to trigger the drop-down.

1. Select **Admin Portal** from the drop-down, which will take you to the *Admin Portal* page.

## Create your Account

1. Create a sign up link by selecting  *Create Signup Link** on the *Admin Portal* page.

1. Navigate to the sign up link provided.

    **DO NOT SHARE THE SIGN UP LINK WITH ANYONE**

1. Sign up with the email address you want associated with this new account.

## Become the First Official Admin

1. If you are not still logged in as `bootstrapuser@example.com`, do so again.

1. Return to *Admin Portal* page.

1. Destroy the temp sign up link you used to create your new account, so that it is no longer active.

1. Assign the Admin role to your new account.

## Become the Only Admin

1. Logout from `bootstrapuser@example.com`.

1. Log back in to your new account to which you just assigned the Admin role.

1. Go back to the *Admin Portal* page.

1. **Delete `bootstrapuser@example.com` from your roster to prevent anyone unassigned from gaining access to the *Admin Portal* page.**

# Inviting your First Learners

To invite learners to join your organization's Conductor instance, create another sign up link using **Create Signup Link** and share this link with those you want to sign up.

**NOTE**:
- Any sign up link will be usable until it is destroyed using  **Delete Signup Link**.
- Anyone with access to this link and a unique email address can sign up to your organization's instance of Conductor.
- After being destroyed, a link is unrecoverable.
- It is suggested to be very careful when sharing sign up links and only distribute to those who are trusted and understand  the implications of having access to the link.
- It is also a best practice to not let links stay active too long.

For more information on Sign up Links, see the [Admin Guide](). 