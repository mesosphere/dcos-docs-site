---
layout: layout.pug
navigationTitle: Project Details
title: Project Details
excerpt: excerpt goes here
menuWeight: 10
---
Platform services. Install a service from the catalog across the clusters in the project
+ View catalog to browse and install services
Admin can pick which services are going to be available to project users
Catalog may contain services from many repositories (certified, community, partner, etc)
Clicking a service card from the catalog will lead to its detail page, where the user can see the different versions of the service that are available and choose one to deploy
The deploy service page provides an editor to allow the user to edit the default helm chart value overrides
Deploying a service creates a FederatedAddon object
Clusters
List of associated clusters
Name - cluster name
Type - see Cluster types
Provider. See Administration Cloud Providers
Click on the table item leads to the cluster view
Roles - Access roles for the project
These roles are distributed to all clusters selected by the project. 
Changing cluster / project labels which lead to deselection will cause the roles to be removed from the cluster again
Secrets
Secrets table shows all secrets that have been created project-wide (FederatedSecrets)
Clicking on a secret will show its detail page, where values can be selectively shown
Clicking + Add Secret leads to the secret form, where a secret can be created with a display name, description, and key:value data pairs
Clicking the three dot context menu in the far right column of the secret table provides the option to edit a secret.
