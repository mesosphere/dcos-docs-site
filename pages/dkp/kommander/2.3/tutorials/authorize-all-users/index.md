---
layout: layout.pug
beta: false
navigationTitle: Authorize a group across clusters
title: Authorize a group across clusters
menuWeight: 1
excerpt: Install GitHub as an identity provider and grant access to all developers
---

## Authorize all developers to have read access to your clusters

You want to ensure every developer in your GitHub organization has access to your Kubernetes clusters.

1.  Set up GitHub as an identity provider. Start by creating a new OAuth Application in our GitHub Organization by filling out [this form](https://github.com/settings/applications/new).

    <p class="message--important"><strong>Important: </strong>
    Use your cluster URL followed by <code>/dex/callback</code> as the Authorization callback URL.
    </p>

    ![Setting up the GitHub OAuth App](/dkp/kommander/2.2/img/tutorial-idp-github-oauth-app.png)

1.  After you create the application, you will be taken to a settings page. You will need the **Client ID** and **Client Secret** from this page for the DKP UI. Select the **Generate a new client secret** button if you do not already have a Client Secret for the application.

1.  From the top menu bar in the DKP UI, select the **Global** workspace.

1.  Select **Identity Providers** in the **Administration** section of the sidebar menu.

1.  Select the **Identity Providers** tab, and then select the **+ Add Identity Provider** button.

1.  Ensure GitHub is selected as the identity provider type, and copy the **Client ID** and **Client Secret** values into the form.

1.  Select **Save** to create your Identity Provider.

D2iQ configured the identity provider to load all groups, so you need to map these groups to the Kubernetes groups.

### Map the identity provider groups to the Kubernetes groups

1.  Select the **Groups** tab, and then select the **Create Group** button.

1.  Give your group a descriptive name and add the groups from your GitHub provider under **Identity Provider Groups**.

1.  Click **Save** to create the group, which creates it on the management cluster and federated to all target clusters, and also describes the developers for your organization.

To enable this group, you need to first create a role which allows you to view every resource.

### Create a "Read Everything" role

1.  Select **Access Control** in the **Administration** section of the sidebar menu.

1.  Select the **Cluster Roles** tab, and then select the **+ Create Role** button.

1.  Give the role a descriptive name, and ensure that **Cluster Role** is selected as the type.

1.  For a read-only role, select **+ Add Rule**, then select **All Resource Types** in the **Resources** input, and select the **get**, **list**, and **watch** verbs.

Now you can assign the "Read Everything" role to the developers group.

### Assign the role to the developers group

1.  Select the **Cluster Role Bindings** tab, and then select the **Add roles** button for your group.

1.  Select "Read Everything" role from the **Roles** drop-down.

Lastly, follow the example in the [Access Control documentation](/dkp/kommander/2.1/operations/access-control#special-limitation-for-kommander-roles) to grant users access to Kommander routes on your cluster.

When you check your attached clusters and login as a user from your matched groups, you can see every resource, but neither delete or edit them, as intended.
