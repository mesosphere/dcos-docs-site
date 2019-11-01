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

![Identity](/ksphere/kommander/img/Identity-providers-table.png)

Figure 1 - Identity Providers

#### Limiting who has access:

- The Github provider allows to specify which orgs and teams are eligible for access.

![Github Form](/ksphere/kommander/img/Identity-provider-Github.png)

Figure 2 - Github Form

- The LDAP provider allows to configure search filters for either users or groups.

![LDAP Form](/ksphere/kommander/img/Identity-provider-LDAP.png)

Figure 3 - LDAP Form

- The OIDC provider cannot limit users based on identity.

![OIDC Form](/ksphere/kommander/img/Identity-provider-OIDC.png)

Figure 4 - OIDC Form

#### Temporarily disabling a provider

Untick the checkbox labelled “enabled” on the Identity Providers table. The provider option will no longer appear on the login screen.

- The OIDC provider cannot limit users based on identity.

![Enabled Checkbox](/ksphere/kommander/img/Identity-provider-enabled-checkbox.png)

Figure 5 - Enabled Checkbox

## Cloud Providers

In order to provision new clusters and subsequently manage them, Kommander needs
cloud provider credentials. Currently only AWS is supported, while Azure and GKE
are coming soon.

- The OIDC provider cannot limit users based on identity.

![Cloud Provider Form](/ksphere/kommander/img/Cloud-provider-unselected.png)

Figure 6 - Cloud Provider Form

#### Configuring an AWS cloud provider:

- Generate AWS access key using the steps outlined in step 1.
- Fill out a display name for your cloud provider that you can reference later.
- Fill out the access and secret keys.
- Click Verify and Save to verify that the credentials are valid and to save your provider.

![Cloud Provider Form with values](/ksphere/kommander/img/Cloud-provider-with-values.png)

Figure 7 - Cloud Provider Form with values

Once created, a Cloud Provider’s display name or credentials can be updated.

## Access Control

Role-based authorization can be defined centrally within Kommander to control access to resources on all clusters. The resources are similar to Kubernetes RBAC but with some crucial differences.

#### Types of Access Control Objects

* **Groups** map to groups and user claims from your identity providers.

![Groups](/ksphere/kommander/img/Access-control-groups-table.png)

Figure 8 - Groups

* **Roles** are named collections of rules defining which verbs can be applied to which resources.

![Roles](/ksphere/kommander/img/Access-control-roles-table.png)

Figure 9 - Roles

* **Policies** bind a group to a role

![Policies](/ksphere/kommander/img/Access-control-policies-table.png)

Figure 10 - Policies

Roles and Policies can be defined in the cluster scope which makes them apply to all Konvoy clusters.

Roles and Policies can be defined within a project.

![Project Roles](/ksphere/kommander/img/Project-roles-table.png)

Figure 11 - Project Roles

![Project Policies](/ksphere/kommander/img/Project-policies-table.png)

Figure 12 - Project Policies

## Licensing

Licenses table shows currently added licenses with name, status, start date, end date, cluster capacity, and secret name.

![Licenses](/ksphere/kommander/img/Licenses-table.png)

Figure 13 - Licenses

Under the hood, a license consists of a License custom resource object that references a secret containing the actual license text.

Clicking + Add License takes you to the license form where a license can be created by adding the license to the textarea.

![Licenses Form](/ksphere/kommander/img/Licenses-form.png)

Figure 14 - Licenses Form

If there is an error submitting the license, the error banner contains directions on how to add the license directly through kubectl.

![Licenses Error](/ksphere/kommander/img/Licenses-error.png)

Figure 15 - Licenses Error