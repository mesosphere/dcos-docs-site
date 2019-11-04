---
layout: layout.pug
navigationTitle: Tutorials
title: Tutorials
menuWeight: 9
excerpt: Learn how to put Kommander in action
---

## Authorize all developers to have read access to your clusters

We want to ensure every developer in our GitHub organization has access to our Kubernetes clusters.
The first thing we need to do is to set up an GitHub as an identity provider. For this we need to create a new OAuth Application in our GitHub Organization by filling out [this form](https://github.com/settings/applications/new).

![Setting up the GitHub OAuth App](/ksphere/kommander/img/tutorial-idp-github-oauth-app.png)

Once we create this application we are going to see something like this:

![Created a GitHub OAuth App](/ksphere/kommander/img/tutorial-idp-github-oauth-created.png)

We need to fill those values in when we add an identity provider. You can find this field by accessing Administration > Identity Providers in the sidebar and clicking the Add Identity Provider button.

![Adding the GitHub OAuth App](/ksphere/kommander/img/tutorial-idp-github-added.png)

We configured the identity provider to load all groups, so now we need to map these groups to kubernetes groups. This is done by visiting Administration > Access Control and clicking the Create Group button.
This will create a group that is federated to all connected clusters and it will describe the developers of our organization.

![Adding a developer group](/ksphere/kommander/img/tutorial-auth-developer-group.png)

For this group to have an effect we need to connect it to a role, so let's first create a role that allows us to view every resource.

![Adding a read role](/ksphere/kommander/img/tutorial-auth-developer-role.png)

Now that we have everything we can create our policy.

![Adding a policy](/ksphere/kommander/img/tutorial-auth-developer-policy.png)

When we check our attached clusters and login as a user from our matched groups we can see every resource, but neither delete or edit them, just as we intended it to be.
