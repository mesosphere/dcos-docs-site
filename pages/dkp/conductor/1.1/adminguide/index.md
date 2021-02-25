---
layout: layout.pug
navigationTitle: Admin Guide
title: Administrator's Guide
menuWeight: 40
excerpt: A short guide for Conductor Admin Portal
---

# Overview

Users with the role `Admin` have access to the Admin Portal in their navbar from anywhere outside the Integrated Learning Environment (ILE). The Admin Portal enables admins to do a number of tasks essential to the administration of Conductor users:

- **Users** stat - displays the total users tracked in the Roster.

- **Roster** - view admin-relevant user information through the table of user entries:

  1. *First Name* - displays the first name associated with the user account.
  1. *Last Name* - displays the last name associated with the user account.
  1. *Email* - displays the email associated with the user account.
  1. *Role* - displays the role - `Admin` or `Member`, whereby admins all have access to the functionality being described herein and enabled members have access only to the courses.
  1. *Status* - displays whether the user has been disabled or not.
  1. *Group* - displays the group to which the user belongs, displays *Unassigned* if not.
  1. *Courses* - displays the *total courses completed/total available courses*.
      - on hover: a modal displays each available course for the user associated with the entry, including unit progress and relevant cluster status.
  1. *Last Login* - displays the last date and time (UTC) that a user logged into this instance of Conductor.

- **Link** form and **Generate** button - generate (same form to destroy) sharable sign-up links for simple, securable sign up scenarios.
- **Add** button for next to **Cloud Credentials**.
- **Reset User Password** form - get a private link for a user to securely reset their password.
- **Actions** drop-down- upon checking a selection in the Roster:

    1. enable, disable, or delete users.
    1. assign/revoke Admin roles.
    1. assign users to and remove users from Groups.

- **Group** form and **Create Group** button - create/delete Groups.
- **Search Bar** - search through roster for individual users by name/email.
- **Filter** drop-downs - view the roster through various filters: by Role, by Status, or by Group.

# Adding Cloud Credentials for Konvoy-required Units

An administrator for your Conductor instance must input their static AWS cloud credentials via the Admin Portal. Until static AWS cloud credentials are input into the Admin Portal successfully, units that depend on launching clusters with full networking abilities will be unavailable to learners (as opposed to the KIND clusters for units of the Kubernetes 101 course, which work out of the box). They will instead show learners the message "This unit is not yet configured. Please contact your Administrator." until the credentials are successfully input.

To add your static AWS cloud credentials:

1. Select **Add** next to **Cloud Credentials** at the top of the Admin Portal.

1. Enter your AWS credentials:

  * Enter your `aws_access_key_id` in the first form.

  * Enter your `aws_secret_access_key` in second form.

  * Enter your `region` in the third form.

1. Select **Save**.

1. To test, launch one of the Konvoy-dependent units, such as **Grafana Dashboards: Working with Grafana Dashboards**, which typically takes around 15 minutes to complete.

After your credentials are saved:

  -  **Edit** now replaces **Add** on the main Admin Portal dashboard.

  - Select **Edit** to view, edit, or delete your credentials.

After you have successfully input your credentials, your learners can access the Konvoy-dependent units that were unavailable before.

# Managing Sign-up Links

Admins can invite users by generating and then sharing a unique and disposable sign-up link with those they want to be users of their Conductor instance.

After selecting **Generate**, you are provided with a randomly generated link in the **Link** form to the Conductor sign-up page. **While active, anyone with this link can visit and sign up as a learner to your organization's Conductor service. Ensure invitees are trustworthy and sign up with a trackable email address. Do not leave the link active longer than necessary.**

If you want to stop the current active registration, select **Delete** next to the **Generate** and the link will no longer work and the form will clear. At any time after this, if you want to start another active registration, select *Generate* and a new link will be created that you can share with learners for them to sign up.

# Enabling/Disabling/Deleting Users

Learners are activated by default after they use a valid sign-up link to create a Conductor account. Being `Active` under `Status`means they are enabled to use their Conductor account and any of their available courses.

## Disabling Users

Admins can disable users so that they no longer have access to their Conductor accounts. After they're `Disabled` these users can no longer login and must be enabled by an Admin to regain access.

To disable users, select each of the users you want disabled (select the left-most checkboxes on each line in the roster of the target users), and use the *Actions* dropdown on the upper-right-hand side of the portal screen to select the *Disable* action. After you confirm to disable the user, their entry in the roster will be greyed-out and hidden unless the `Show disabled` box is checked.

## Enabling Users

After being set to `Disabled`, an Admin can re-enable a user by:
(1) selecting that user in the roster.
(2) using the **Actions** dropdown in the upper-right-hand of the Admin portal screen to select `Enable`.

 After you affirm the confirmation modal, their entry will no longer be greyed-out, and they will show up by default with the rest of the non-disabled users.

## Deleting Users

When needed, an Admin can delete a user account from the database altogether. After an account is deleted, the data associated with that account cannot be recovered. You can reinvite a user only re-entered. This should only be used when the need for tracking the record is non-existent.

To delete users:

1.  Select each user in the roster you want to delete from the database.
1.  Select `Delete` using the **Actions** dropdown in the upper-right-hand of the Admin portal screen to delete the user(s).

**After you confirm that you want to delete these users permanently, there will be no way to recover them.**

# Assigning/Revoking the Admin role

Any Admin can assign the Admin role to another user in their organization. They can also revoke the Admin role from any Admin. Therefore, it is extremely important to only assign the Admin role to those who can be fully trusted with this scope of responsibility.

To assign/revoke the Admin role:

1. select each user in the roster you want to assign or revoke from the Admin role,
1. using the **Actions** dropdown in the upper-right-hand of the Admin portal screen to select `Assign` or `Revoke` according to your aims.

**After you affirm with the confirmation modal that you want to assign or revoke the Admin role to the selected users, the new status will go into effect immediately.**

# Sending a Reset-password Link to User's

You can generate a link to share with an individual that will direct them to their *Password Reset* page, in case a user needs to change their password.

To send an individual a link so that they can reset their password:

1. Select the **Reset User Password** form, which will cause a searchable dropdown to select the user you want to provide a reset-password link.
1. After you select the user from the dropdown, select **Get Reset Password Link** to generate the link.
1. Select **Copy** to copy the link to your clipboard.
1. Share that link with that user, but ONLY that user, as **anyone with this link will be able to change that user's password**.

# Groups

Groups are a way to sort larger organizations for easier adminstration. For instance, if an admin were to only want to look at one group in the roster, they would simply need to use the **Group** filter above the roster to select the group you want to see.

## Creating/Deleting Groups

Admins can create and delete groups for ongoing organizing and reorganizing.

To create/delete a group:

1. type in the name of the group you want to create or delete in the *Group* form,
1. select either: *Create Group* or *Delete Group*.

**After a group is deleted, it cannot be recovered and you must remake the group, including regathering any users who were members in that group at the time of the deletion.**

## Assigning to/Removing from Groups

Reorganizing users in and out of groups can be done from the *Admin Portal* page. To assign user(s) to a new group or remove them from their current group:

1. Select the users they want to either assign to a group or remove from a group.
1. If you are assigning the users to a group, select the group from the **Group** dropdown in the **Assign to Group** modal.
1. If you are removing the users from a group, affirm with the confirmation modal.
