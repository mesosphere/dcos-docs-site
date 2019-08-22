---
layout: layout.pug
navigationTitle:  Settings
title: Settings
menuWeight: 10
excerpt: Using the Settings menu
enterprise: true
render: mustache
model: /mesosphere/dcos/1.14/data.yml
---

From the Settings tab, you can manage 

- UI Settings
- Package repositories
- Secret Stores
- LDAP directories
- Identity providers


![Package repositories](/mesosphere/dcos/1.14/img/GUI-Settings-EE-Package_Repositories-1_12.png)

Figure 1 - **Settings > Package Repositories** tab

# UI Settings

The UI Settings tab allows you to manage your DC/OS UI version and the language in which the UI is presented.

## DC/OS UI Details

The DC/OS UI Details section shows you which version of the UI is installed; note that this is **not** the version of DC/OS which is currently installed. You have the option to use an earlier version of the UI. Clike on the **Rollback** button to load the earlier version of the UI.

![Rolling back](/mesosphere/dcos/1.14/img/GUI-Settings-Rollback.png)

Figure 2 - Rolling back to an earlier version of the UI

## User Preferences

The User Preferences section shows you which language the UI is displayed in. You can switch to another display language using the Edit button. A **Language Preference** dialogue box will appear. Use the drop-down menu to select your preferred language.

1. Click on **Settings > UI Settings**.

    ![UI settings tab](/mesosphere/dcos/1.14/img/GUI-change-UI-settings-menu-1.png)

    Figure 3 - UI Settings tab

1. Click on the **Edit** button.

1. From the Language Preferences window, select your language.

    ![Language Preferences](/mesosphere/dcos/1.14/img/GUI-change-UI-settings-menu-2.png)

    Figure 4 - Language preferences menu

1. Click **Save**.

# Package Repositories

The Package Repositories tab lists all currently configured package repositories on your DC/OS cluster. For detailed information about your Package Registry options see the [Package Registry documentation](/mesosphere/dcos/1.14/administering-clusters/package-registry/). You may also find the [Deploying a Local Catalog documentation](/mesosphere/dcos/1.14/administering-clusters/deploying-a-local-dcos-universe/) useful.

## Adding a repository

You can add a repository, with its associated services, to your DC/OS Enterprise cluster. 

1. Click on the **+** sign in the upper right corner.

1. The Add Repository dialogue box will appear. Fill in the values required.

    ![Add Repo](/mesosphere/dcos/1.14/img/GUI-Settings-Add-Repository.png)

    Figure 5 - Adding a repository

| Name | Value |
|-----|-----|
| Repository Name |   |
| URL |    |
| Priority | 0, 1, or 2 |

1. Click **Add Repository**.

## Deleting a Repository

<p class="message--warning"><strong>WARNING: </strong>If you delete a repository, you will not be able to install any packages belonging to that repository any more.</p> 

1. Hover your mouse over the right hand side of the listing. 
1. A **Delete** button will appear. Click it to delete your repository. You will be asked to confirm this deletion. 

![Delete repo](/mesosphere/dcos/1.14/img/GUI-Settings-Package-Repositories-Delete.png)

Figure 5 - Deleting a package repository

# Secret Stores

The Secret Stores tab displays a list of all your current Secret Stores, as well as the Type associated with each one. No actions are possible on this page, but you can manage your Secrets from the [Secrets](/mesosphere/dcos/1.14/gui/secrets/) tab. 

![Secret Stores](/mesosphere/dcos/1.14/img/GUI-Settings-Secret-Stores.png)

Figure 5 - Language preferences menu

# LDAP Directory

# Identity Providers