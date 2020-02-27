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

![Setting up the GitHub OAuth App](/ksphere/kommander/img/tutorial-idp-github-oauth-app.png)

Once we create this application we are going to see something like this:

![Created a GitHub OAuth App](/ksphere/kommander/img/tutorial-idp-github-oauth-created.png)

We need to copy the Client ID and Client Secret values into the form when adding an identity provider. You can find this field by accessing Administration > Identity Providers in the sidebar and clicking the Add Identity Provider button.

![Adding the GitHub OAuth App](/ksphere/kommander/img/tutorial-idp-github-added.png)

We configured the identity provider to load all groups, so now we need to map these groups to kubernetes groups. This is done by visiting Administration > Access Control and clicking the Create Group button.
This will create a group that is federated to all connected clusters and it will describe the developers of our organization.

![Adding a developer group](/ksphere/kommander/img/tutorial-auth-developer-group.png)

For this group to have an effect we need to connect it to a role, so let's first create a role that allows us to view every resource.

![Adding a read role](/ksphere/kommander/img/tutorial-auth-developer-role.png)

Now that we have everything we can assign the "Read Everything" role to the developers group.

![Adding a policy](/ksphere/kommander/img/tutorial-auth-developer-policy.png)

When we check our attached clusters and login as a user from our matched groups we can see every resource, but neither delete or edit them, just as we intended it to be.
