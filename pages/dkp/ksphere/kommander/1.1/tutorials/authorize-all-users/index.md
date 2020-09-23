---
layout: layout.pug
navigationTitle: Authorize a group across clusters
title: Authorize a group across clusters
menuWeight: 1
excerpt: Install Github as an identity provider and grant access to all developers
---

## Authorize all developers to have read access to your clusters

We want to ensure every developer in our GitHub organization has access to our Kubernetes clusters.

The first thing we need to do is to set up an GitHub as an identity provider. For this we need to create a new OAuth Application in our GitHub Organization by filling out [this form](https://github.com/settings/applications/new).

<p class="message--info"><strong>Important: </strong>
Use your Konvoy URL followed by `/dex/callback` as the Authorization callback URL.
</p>

![Setting up the GitHub OAuth App](/ksphere/kommander/1.1/img/tutorial-idp-github-oauth-app.png)

Once we create this application we are going to see something like this:

![Created a GitHub OAuth App](/ksphere/kommander/1.1/img/tutorial-idp-github-oauth-created.png)

In Kommander UI, choose **Global** in the header drop-down and then select **Administration** > **Identity Providers** in the sidebar. Select the **Identity Providers** tab and click the **Add Identity Provider** button. Ensure Github is selected as the identity provider type, and copy the Client ID and Client Secret values into the form. Press **Save** to create your Identity Provider.

![Adding the GitHub OAuth App](/ksphere/kommander/1.1/img/tutorial-idp-github-added.png)

We configured the identity provider to load all groups, so now we need to map these groups to kubernetes groups. In Kommander UI, choose **Global** in the header drop-down and then select **Administration** > **Identity Providers** in the sidebar. Select the **Groups** tab and click the **Create Group** button. Give your group a descriptive name and add the groups from your GitHub provider under **Identity Provider Groups**.
Click **Save** to create the group. It will be created on the management cluster and federated to all target clusters, and describes the developers of our organization.

![Adding a developer group](/ksphere/kommander/1.1/img/tutorial-auth-developer-group.png)

For this group to have an effect we need to connect it to a role, so let's first create a role that allows us to view every resource. In Kommander UI, choose **Global** in the header drop-down and then select **Administration** > **Access Control** in the sidebar. Select the **Cluster Roles** tab and click the **Create Role** button. For a read-only role, click **+ Add Rule**, select the **get**, **list**, and **watch** verbs, and select **All resource types** in the **Resources** input.

![Adding a read role](/ksphere/kommander/1.1/img/tutorial-auth-developer-role.png)

Now that we have everything we can assign the "Read Everything" role to the developers group. In Kommander UI, choose **Global** in the header drop-down and then select **Administration** > **Access Control** in the sidebar. Select the **Cluster Policies** tab and click the **Add or remove roles** button for your group.

![Adding a policy](/ksphere/kommander/1.1/img/tutorial-auth-developer-policy.png)

Lastly, follow the example in the [Access Control documentation](https://docs.d2iq.com/ksphere/kommander/1.1/operations/access-control/#special-limitation-for-opsportal-and-kommander-roles) to grant users access to the Opsportal and Kommander routes on your cluster.

When we check our attached clusters and login as a user from our matched groups we can see every resource, but neither delete or edit them, just as we intended it to be.
