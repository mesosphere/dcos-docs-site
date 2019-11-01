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

### Configuring an AWS cloud provider:

#### Generate AWS access key via CLI commands
```
aws iam create-user --user-name Kommander
```

```
aws iam create-policy --policy-name kommander-policy --policy-document '{"Version":"2012-10-17","Statement":[{"Sid":"KommanderCloudProvider","Action":["ec2:DescribeRegions","ec2:DescribeAvailabilityZones","ec2:AttachInternetGateway","ec2:AttachVolume","ec2:AuthorizeSecurityGroupEgress","ec2:AuthorizeSecurityGroupIngress","ec2:CreateInternetGateway","ec2:CreateRoute","ec2:CreateSecurityGroup","ec2:CreateSubnet","ec2:CreateTags","ec2:CreateVolume","ec2:CreateVpc","ec2:DeleteInternetGateway","ec2:DeleteKeyPair","ec2:DeleteSecurityGroup","ec2:DeleteSubnet","ec2:DeleteVolume","ec2:DeleteVpc","ec2:DescribeAccountAttributes","ec2:DescribeAvailabilityZones","ec2:DescribeImages","ec2:DescribeInstanceAttribute","ec2:DescribeInstanceCreditSpecifications","ec2:DescribeInstances","ec2:DescribeInternetGateways","ec2:DescribeKeyPairs","ec2:DescribeNetworkAcls","ec2:DescribeNetworkInterfaces","ec2:DescribeRouteTables","ec2:DescribeSecurityGroups","ec2:DescribeSubnets","ec2:DescribeTags","ec2:DescribeVolumes","ec2:DescribeVpcAttribute","ec2:DescribeVpcClassicLink","ec2:DescribeVpcClassicLinkDnsSupport","ec2:DescribeVpcs","ec2:DetachInternetGateway","ec2:DetachNetworkInterface","ec2:DetachVolume","ec2:ImportKeyPair","ec2:ModifyInstanceAttribute","ec2:ModifySubnetAttribute","ec2:ModifyVpcAttribute","ec2:RevokeSecurityGroupEgress","ec2:RevokeSecurityGroupIngress","ec2:RunInstances","ec2:TerminateInstances","elasticloadbalancing:AddTags","elasticloadbalancing:ApplySecurityGroupsToLoadBalancer","elasticloadbalancing:AttachLoadBalancerToSubnets","elasticloadbalancing:ConfigureHealthCheck","elasticloadbalancing:CreateLoadBalancer","elasticloadbalancing:CreateLoadBalancerListeners","elasticloadbalancing:DeleteLoadBalancer","elasticloadbalancing:DescribeLoadBalancerAttributes","elasticloadbalancing:DescribeLoadBalancers","elasticloadbalancing:DescribeTags","elasticloadbalancing:ModifyLoadBalancerAttributes","elasticloadbalancing:RegisterInstancesWithLoadBalancer","iam:AddRoleToInstanceProfile","iam:CreateInstanceProfile","iam:CreateRole","iam:DeleteInstanceProfile","iam:DeleteRole","iam:DeleteRolePolicy","iam:GetInstanceProfile","iam:GetRole","iam:GetRolePolicy","iam:ListInstanceProfilesForRole","iam:PassRole","iam:PutRolePolicy","iam:RemoveRoleFromInstanceProfile","sts:GetCallerIdentity"],"Resource":"*","Effect":"Allow"}]}'
```

```
aws iam attach-user-policy --user-name Kommander --policy-arn $(aws iam list-policies --query 'Policies[?PolicyName==`kommander-policy`].Arn' | grep -o '".*"' | tr -d '"')
```

```
aws iam attach-user-policy --user-name Kommander --policy-arn $(aws iam list-policies --query 'Policies[?PolicyName==`kommander-policy`].Arn' | grep -o '".*"' | tr -d '"')
```

```
aws iam create-access-key --user-name Kommander
```

#### Fill out the rest of the form

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