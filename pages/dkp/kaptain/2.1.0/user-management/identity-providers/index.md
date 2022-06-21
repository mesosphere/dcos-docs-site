---
layout: layout.pug
navigationTitle: Identity providers
title: Authenticate users using an identity provider
menuWeight: 10
excerpt: Authenticate users to access Kaptain with an identity provider
beta: false
enterprise: false
---

## Prerequisites

In Kaptain, authenticating users and user groups is carried out by DKP’s Dex instance. To use an alternative external identity provider as an authenticator, you can set up [DKP’s Dex to use the identity provider of your choice][ident].

## Setup

When you install Kaptain in your **management cluster**, the identity provider of your choice is already integrated with your DKP Dex instance, so **no further steps** are required for you to be able to enable access to your Kaptain instance with the credentials defined with your identity provider.

When Kaptain is installed in a **managed cluster**, ensure the managed cluster can communicate with the Dex instance in the management cluster. For this, configure [Kaptain to authenticate with a DKP management cluster via Dex][dex].

## Access Kaptain with your Identity provider credentials

<p class="message--note"><strong>NOTE: </strong>By default, your identity provider users and user groups have access to the dashboard. To add or remove groups, alter the <b>Allow List</b> via the <b>Configuration service</b>.</p>

1.  Open the [log-in page](../../install/deploy-kaptain#log-in-to-kaptain-using-the-management-clusters-dex-instance) to access Kubeflow’s dashboard of Kaptain.

1.  Select **Log in with *your identity provider***.

1.  Use your credentials to access Kubeflow’s dashboard for Kaptain.

## Limit access to pre-defined groups

1.  Access the DKP UI.

1.  **Enterprise only**: Select your target workspace from the top menu bar.

1.  Select **Applications** from the sidebar menu.

1.  Search the **Kaptain** application card, either by filtering the name or scrolling down to find it.

1.  Select the **three dot menu** > **Edit** in the Kaptain application card.

1.  In the **Configure Service** field, enter the following variables to update the ingress values. Provide or delete the names of the groups you want to add or remove:

    ```bash
    ingress: 
      oidcGroupsAllowList: <group1>,<group2>
    ```

    If you need the Authentication Service to accept `ServiceAccountTokens`, include the `system:serviceaccounts` group.

    ```bash
    ingress: 
      oidcGroupsAllowList: <group1>,<group2>,system:serviceaccounts
    ```

1.  Select **Save**.

<p class="message--important"><strong>IMPORTANT: </strong>Wait a couple of minutes until the variables have been propagated before you attempt to log in again. Please note that after defining the allowed user groups, the default Kommander users will no longer be able to access Kaptain with their previous credentials, since those are not included in any of the identity provider groups by default.</p>

[ident]: ../../../../kommander/2.3/security/oidc/
[dex]: ../../../2.1.0/configuration/external-dex/
