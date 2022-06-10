---
layout: layout.pug
navigationTitle: Minimum permissions
title: Permissions for minimal role
menuWeight: 10
excerpt: Create minimum required roles for provisioning and installing in vSphere
enterprise: false
---

## Overview of the Process

When a user needs permissions less than Admin, a role must be created. The process for configuring a vSphere role with the least permissions for provisioning nodes and installing includes the following steps:

1.  Open a vSphere Client connection to the vCenter Server, described in the [Prerequisites][prerequisites].

1.  Select Home > Administration > Roles > Add Role.

1.  Give the new role a name, then select these Privileges:

    -   Datastore

        - Allocate space
    -   Network

        - Assign network
    -   Resource

        - Assign virtual machine to resource pool
    -   Virtual machine

        - Change Configuration
        - Add new disk
        - Add or remove device
        - Advanced configuration
        - Change CPU count
        - Change Memory
        - Change Settings
        - Reload from path

    -   Edit inventory

        - Create from existing
        - Remove

    -   Interaction

        - Power off
        - Power on

    -   Provisioning

        - Clone template
        - Deploy template

    -   Session

        - ValidateSession

1.  Add the permission at the highest level and set to propagate the permissions.

[prerequisites]: ../../prerequisites/
