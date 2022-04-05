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

First, set up GitHub as an identity provider. Start by creating a new OAuth Application in our GitHub Organization by filling out [this form](https://github.com/settings/applications/new).

<p class="message--important"><strong>Important: </strong>
Use your cluster URL followed by <code>/dex/callback</code> as the Authorization callback URL.
</p>

![Setting up the GitHub OAuth App](/dkp/kommander/2.1/img/tutorial-idp-github-oauth-app.png)

After you create this application, you should something like this:

![Created a GitHub OAuth App](/dkp/kommander/2.1/img/tutorial-idp-github-oauth-created.png)

In the DKP UI, choose **Global** in the header drop-down and then select **Administration** > **Identity Providers** in the sidebar. Select the **Identity Providers** tab and click the **Add Identity Provider** button. Ensure GitHub is selected as the identity provider type, and copy the Client ID and Client Secret values into the form. Press **Save** to create your Identity Provider.

![Adding the GitHub OAuth App](/dkp/kommander/2.1/img/tutorial-idp-github-added.png)

D2iQ configured the identity provider to load all groups, so you need to map these groups to the Kubernetes groups. In DKP UI, choose **Global** in the header drop-down and then select **Administration** > **Identity Providers** in the sidebar. Select the **Groups** tab and click the **Create Group** button. Give your group a descriptive name and add the groups from your GitHub provider under **Identity Provider Groups**.
Click **Save** to create the group, which creates it on the management cluster and federated to all target clusters, and also describes the developers for your organization.

![Adding a developer group](/dkp/kommander/2.1/img/tutorial-auth-developer-group.png)

To enable this group, you need to first connect it to a role which then creates a role and allows you to view every resource. In DKP UI, choose **Global** in the header drop-down and then select **Administration** > **Access Control** in the sidebar. Select the **Cluster Roles** tab and click the **Create Role** button. For a read-only role, click **+ Add Rule**, select the **get**, **list**, and **watch** verbs, and select **All resource types** in the **Resources** input.

![Adding a read role](/dkp/kommander/2.1/img/tutorial-auth-developer-role.png)

Now that you have everything, you can assign the "Read Everything" role to the developers group. In DKP UI, choose **Global** in the header drop-down and then select **Administration** > **Access Control** in the sidebar. Select the **Cluster Policies** tab and click the **Add or remove roles** button for your group.

![Adding a policy](/dkp/kommander/2.1/img/tutorial-auth-developer-policy.png)

Lastly, follow the example in the [Access Control documentation](/dkp/kommander/2.1/operations/access-control#special-limitation-for-kommander-roles) to grant users access to Kommander routes on your cluster.

When you check your attached clusters and login as a user from your matched groups, you can see every resource, but neither delete or edit them, as intended.
