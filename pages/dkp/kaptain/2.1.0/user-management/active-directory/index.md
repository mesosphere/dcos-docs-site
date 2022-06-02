---
layout: layout.pug
navigationTitle: Active Directory
title: Authenticate users using Active Directory
menuWeight: 30
excerpt: Authenticate users to access Kaptain with Active Directory (AD) groups.
beta: false
enterprise: false
---

Authenticate users to access Kaptain with Microsoft’s Active Directory (AD) groups.

Kaptain relies on Dex as its identity provider, a service that enables the management of users and user groups. Dex, in turn, delegates to one or more external identity providers like AD.

The Active Directory (AD) feature allows you to manage and control access to your Kaptain instance, by using an existing rule set of permissions established in the AD (via the AD admin interface) to authenticate and grant access to Kaptain users and user groups.

You can activate AD to authenticate users regardless of your environment set up (air-gapped or networked), or infrastructure provider.

If you are already using AD groups to authenticate users in DKP or other platforms, this feature will allow you to have centralized access management and control. It will also allow your users to access Kaptains's Kubeflow dashboard with the same credentials they have been using for other platforms.

When the AD is active, users will be able to log in to Kaptain with their AD credentials. For this, Kaptain’s dex uses LDAP to call up and verify the entered credentials against your existing AD groups.

As with all matters regarding security, we encourage you to thoroughly review permissions set by the AD in conjunction with your security team.

## Prerequisites

- You have configured an AD server.
- The automatic creation of profiles in your Kaptain instance is [enabled][automatic] or disabled. If disabled, you must manually [create the profiles][manual] you wish to authenticate before activating the AD.
- You have administrative access to a configured DKP cluster via `kubectl`.
- You have administrative access to the DKP UI.

## Set up AD in Kaptain

1.  Set up an authentication protocol with Dex for [LDAP][LDAP]. When doing so, adapt the connector fields as necessary.

1.  Open the log-in page to access Kaptain's Kubeflow dashboard.

    <p class="message--note"><strong>NOTE: </strong>By default, all AD groups have been granted access to the dashboard. <a href="#add-or-remove-groups-using-the-ui">To add or remove AD groups</a>, alter the <b>Allow List</b> via the <b>Configuration service</b>.</p>

1.  Click **Log in with LDAP**.

1.  Use your AD credentials to access Kaptain's Kubeflow dashboard.

## Add or remove groups using the UI

1.  Access the DKP UI.

1.  **Enterprise only**: Select your target workspace from the top menu bar.

1.  Select **Applications** from the sidebar menu.

1.  Search the **Kaptain** card, either by filtering the name or scrolling down to find it.

1.  Select the **three dot menu** > **Edit** in the Kaptain card.

1.  In the **Configure Service** field, enter the following variables to update the ingress values. Provide or delete the names of the groups you want to add or remove:

    ```bash
    ingress: 
      oidcGroupsAllowList: "<group1>, <group2>"
    ```

    If you need the Authentication Service to accept `ServiceAccountTokens`, include the `system:serviceaccounts` group.

    ```bash
    ingress: 
      oidcGroupsAllowList: "<group1>, <group2>, system:serviceaccounts"
    ```

1.  Click **Save**.

    <p class="message--important"><strong>IMPORTANT: </strong>Wait a couple of minutes until the variables have been propagated before you attempt to log in again. Please note that after defining the allowed user groups, the default Kommander users will no longer be able to access Kaptain with their previous credentials, since those are not included in any of the AD groups by default.</p>

[automatic]: https://docs.d2iq.com/dkp/kaptain/2.0.0/user-management#automatic-profile-creation
[manual]: https://docs.d2iq.com/dkp/kaptain/2.0.0/user-management#manual-profile-creation
[LDAP]: https://github.com/dexidp/dex/blob/v2.22.0/Documentation/connectors/ldap.md#example-searching-a-active-directory-server-with-groups
