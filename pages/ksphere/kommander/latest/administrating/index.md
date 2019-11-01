---
layout: layout.pug
navigationTitle: Administrating
title: Administrating
excerpt:
menuWeight: 10
---

## Identity Providers

By default, you login to konvoy with a credential given by `konvoy up`. You can retrieve it later by using `konvoy get ops-portal`. 

To provide simple access for the users of your organization, Identity Providers can be set up.

Currently, Kommander supports **Github**, **LDAP**, and any standard **OIDC** provider such as **Google**. 

You can configure as many Identity Providers as you like and users will be able to select any of those methods when logging in.

#### Limiting who has access:

- The Github provider allows to specify which orgs and teams are eligible for access.
- The LDAP provider allows to configure search filters for either users or groups.
- The OIDC provider cannot limit users based on identity.

#### Temporarily disabling a provider

Untick the checkbox labelled “enabled” on the Identity Providers table. The provider option will no longer appear on the login screen.

## Cloud Providers

In order to provision new clusters and subsequently manage them, Kommander needs
cloud provider credentials. Currently only AWS is supported, while Azure and GKE
are coming soon.


#### Configuring an AWS cloud provider:

- Generate AWS access key using the steps outlined in step 1.
- Fill out a display name for your cloud provider that you can reference later.
- Fill out the access and secret keys.
- Click Verify and Save to verify that the credentials are valid and to save your provider.

Once created, a Cloud Provider’s display name or credentials can be updated.

## Access Control

Role-based authorization can be defined centrally within Kommander to control access to resources on all clusters. The resources are similar to Kubernetes RBAC but with some crucial differences.

#### Types of Access Control Objects

* **Groups** map to groups and user claims from your identity providers.
* **Roles** are named collections of rules defining which verbs can be applied to which resources.
* **Policies** bind a group to a role

Roles and Policies can be defined in the cluster scope which makes them apply to all Konvoy clusters.

Roles and Policies can be defined within a project.

## Licensing

Licenses table shows currently added licenses with name, status, start date, end date, cluster capacity, and secret name.

Under the hood, a license consists of a License custom resource object that references a secret containing the actual license text.

Clicking + Add License takes you to the license form where a license can be created by adding the license to the textarea.

If there is an error submitting the license, the error banner contains directions on how to add the license directly through kubectl.
