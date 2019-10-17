---
layout: layout.pug
navigationTitle:  Settings
title: Settings
menuWeight: 10
excerpt: Using the Settings menu
enterprise: true
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---

From the **Settings** tab, you can manage 

- UI Settings
- Package repositories
- Secret Stores
- LDAP directories
- Identity providers

![Package repositories](/mesosphere/dcos/2.0/img/GUI-Settings-Package-Repositories.png)

Figure 1 - **Settings > Package Repositories** tab

# UI Settings

The **UI Settings** tab allows you to manage your DC/OS UI version and the language in which the UI is presented.

## DC/OS UI Details

The **DC/OS UI Details** section shows you which version of the UI is installed; note that this is **not** the version of DC/OS which is currently installed. 

### Rollback
You can revert your UI version to an earlier one if you need to. DC/OS comes with a pre-bundled UI version. As you update the UI using the **Settings** page, we keep the pre-bundled version in case it becomes necessary to roll back. Therefore if you roll back, you will be getting the pre-bundled version that came with your DC/OS installation. 

Click on the **Rollback** button to load the earlier version of the UI.

![Rolling back](/mesosphere/dcos/2.0/img/GUI-Settings-Rollback.png)

Figure 2 - Rolling back to an earlier version of the UI

## User Preferences

The **User Preferences** section shows you which language the UI is displayed in, and allows you to switch to another display language.  
1. Click on **Settings > UI Settings**.

    ![UI settings tab](/mesosphere/dcos/2.0/img/GUI-Settings-Change-Language.png)

    Figure 3 - UI Settings tab

1. Click on the **Edit** button. A **Language Preference** dialogue box will appear.

1. From the **Language Preferences** dialogue box, select your language.

    ![Language Preferences](/mesosphere/dcos/2.0/img/GUI-change-UI-settings-menu-2.png)

    Figure 4 - Language preferences menu

1. Click **Save**.

# Package Repositories

The **Package Repositories** tab lists all currently configured package repositories on your DC/OS cluster. For detailed information about your Package Registry options see the [Package Registry documentation](/mesosphere/dcos/2.0/administering-clusters/package-registry/). You may also find the [Deploying a Local Catalog documentation](/mesosphere/dcos/2.0/administering-clusters/deploying-a-local-dcos-universe/) useful.

## Adding a repository

You can add a repository, with its associated services, to your DC/OS Enterprise cluster. 

1. Click on the **+** sign in the upper right corner.

1. The **Add Repository** dialogue box will appear. Fill in the values required.

    ![Add Repo](/mesosphere/dcos/2.0/img/GUI-Settings-Add-Repository.png)

    Figure 5 - Adding a repository

   | Name | Description |
   |---------|-------------|
   | Repository Name | Name of the repository you want to add.  |
   | URL |  Path to the repository you want to add.  |
   | Priority | 0, 1, or 2 |

1. Click **Add Repository**.

You can find more information about deploying a catalog in the [Configuring Services](/mesosphere/dcos/2.0/deploying-services/config-universe-service/) documentation. 

You can also deploy a local Catalog containing your own set of packages. See the [Selected Packages](/mesosphere/dcos/2.0/administering-clusters/deploying-a-local-dcos-universe/#selected-packages) documentation.

## Deleting a Repository

<p class="message--warning"><strong>WARNING: </strong>If you delete a repository, you will not be able to install any packages belonging to that repository any more.</p> 

1. Hover your mouse over the right hand side of the listing. 
1. A **Delete** button will appear. Click it to delete your repository. You will be asked to confirm this deletion. 

![Delete repo](/mesosphere/dcos/2.0/img/GUI-Settings-Package-Repositories-Delete.png)

Figure 6 - Deleting a package repository

# Secret Stores 

The Secret Stores tab displays a list of all your current Secret Stores, as well as the Type associated with each one. No actions are possible on this page, but you can manage your Secrets from the [Secrets](/mesosphere/dcos/2.0/gui/secrets/) tab. 

![Secret Stores](/mesosphere/dcos/2.0/img/GUI-Settings-Secret-Stores.png)

Figure 7 - Language preferences menu

# LDAP Directory

You can set up an LDAP connection to avoid having to recreate your user accounts within DC/OS. 

![Add Directory dialog](/mesosphere/dcos/2.0/img/ldap-add-dir-conn.png)

Figure 8 - Adding an LDAP connection

To add a directory, click on the **Add Directory** button. Further details about setting up connections, importing your contacts, and importing a group can be found in the [LDAP Authentication](/mesosphere/dcos/2.0/security/ent/ldap/) documentation.

# Identity Providers

DC/OS supports the use of identity provider-based authentication. Detailed information about how to set up identity provider-based authentication can be found in the [documentation](/mesosphere/dcos/2.0/security/ent/sso/). We provide information for configuring a [SAML identity provider](/mesosphere/dcos/2.0/security/ent/sso/setup-saml/) or an [OpenID Connect IdP](/mesosphere/dcos/2.0/security/ent/sso/setup-openid/).

![Identity providers](/mesosphere/dcos/2.0/img/GUI-Settings-LDAP-Add-Oidc.png)

Figure 9 - Adding an identity provider