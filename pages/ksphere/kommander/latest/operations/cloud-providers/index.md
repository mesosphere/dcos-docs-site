---
layout: layout.pug
navigationTitle: Cloud Providers
title: Cloud Providers
excerpt: Managing cloud providers used by Kommander
---

Cloud providers like AWS, Azure and Google can provide the infrastructure for your Konvoy clusters. To automate their provisioning, Kommander needs authentication keys to your preferred cloud provider. It is possible to have many accounts for a single cloud provider.

In order to provision new clusters and manage them, Kommander needs cloud provider credentials. Currently AWS, Azure, and On Premise are supported. GKE is coming soon.

![Cloud Provider Form](/ksphere/kommander/img/Cloud-provider-unselected.png)

Figure 6 - Cloud Provider Form

### Configuring an AWS cloud provider

When creating an AWS cloud provider, you need an access id and secret key for a user with a set of minimum  capabilities.

#### Create a new User via CLI commands
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

#### Using an existing user

You can use an existing AWS user with [credentials configured][aws_credentials]. The user needs to be authorized to create the following resources in the AWS account:

  * EC2 Instances
  * VPC
  * Subnets
  * Elastic Load Balancer (ELB)
  * Internet Gateway
  * NAT Gateway
  * Elastic Block Storage (EBS) Volumes
  * Security Groups
  * Route Tables
  * IAM Roles

Below is the minimal IAM policy required:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "Kommander",
            "Effect": "Allow",
            "Action": [
                "ec2:AttachInternetGateway",
                "ec2:AttachVolume",
                "ec2:AuthorizeSecurityGroupEgress",
                "ec2:AuthorizeSecurityGroupIngress",
                "ec2:CreateInternetGateway",
                "ec2:CreateRoute",
                "ec2:CreateSecurityGroup",
                "ec2:CreateSubnet",
                "ec2:CreateTags",
                "ec2:CreateVolume",
                "ec2:CreateVpc",
                "ec2:DeleteInternetGateway",
                "ec2:DeleteKeyPair",
                "ec2:DeleteSecurityGroup",
                "ec2:DeleteSubnet",
                "ec2:DeleteVolume",
                "ec2:DeleteVpc",
                "ec2:DescribeAccountAttributes",
                "ec2:DescribeAvailabilityZones",
                "ec2:DescribeImages",
                "ec2:DescribeInstanceAttribute",
                "ec2:DescribeInstanceCreditSpecifications",
                "ec2:DescribeInstances",
                "ec2:DescribeInternetGateways",
                "ec2:DescribeKeyPairs",
                "ec2:DescribeNetworkAcls",
                "ec2:DescribeNetworkInterfaces",
                "ec2:DescribeRegions",
                "ec2:DescribeRouteTables",
                "ec2:DescribeSecurityGroups",
                "ec2:DescribeSubnets",
                "ec2:DescribeTags",
                "ec2:DescribeVolumes",
                "ec2:DescribeVpcAttribute",
                "ec2:DescribeVpcClassicLink",
                "ec2:DescribeVpcClassicLinkDnsSupport",
                "ec2:DescribeVpcs",
                "ec2:DetachInternetGateway",
                "ec2:DetachNetworkInterface",
                "ec2:DetachVolume",
                "ec2:ImportKeyPair",
                "ec2:ModifyInstanceAttribute",
                "ec2:ModifySubnetAttribute",
                "ec2:ModifyVpcAttribute",
                "ec2:RevokeSecurityGroupEgress",
                "ec2:RevokeSecurityGroupIngress",
                "ec2:RunInstances",
                "ec2:TerminateInstances",
                "elasticloadbalancing:AddTags",
                "elasticloadbalancing:ApplySecurityGroupsToLoadBalancer",
                "elasticloadbalancing:AttachLoadBalancerToSubnets",
                "elasticloadbalancing:ConfigureHealthCheck",
                "elasticloadbalancing:CreateLoadBalancer",
                "elasticloadbalancing:CreateLoadBalancerListeners",
                "elasticloadbalancing:DeleteLoadBalancer",
                "elasticloadbalancing:DescribeLoadBalancerAttributes",
                "elasticloadbalancing:DescribeLoadBalancers",
                "elasticloadbalancing:DescribeTags",
                "elasticloadbalancing:ModifyLoadBalancerAttributes",
                "elasticloadbalancing:RegisterInstancesWithLoadBalancer",
                "iam:AddRoleToInstanceProfile",
                "iam:CreateInstanceProfile",
                "iam:CreateRole",
                "iam:DeleteInstanceProfile",
                "iam:DeleteRole",
                "iam:DeleteRolePolicy",
                "iam:GetInstanceProfile",
                "iam:GetRole",
                "iam:GetRolePolicy",
                "iam:ListInstanceProfilesForRole",
                "iam:PassRole",
                "iam:PutRolePolicy",
                "iam:RemoveRoleFromInstanceProfile",
                "sts:GetCallerIdentity"
            ],
            "Resource": "*"
        }
    ]
}
```

#### Fill out the rest of the form

- Fill out the access and secret keys using the keys generated above.
- Fill out a display name for your cloud provider for later reference.
- Click Verify and Save to verify the credentials are valid and to save your provider.

![Cloud Provider Form with values](/ksphere/kommander/img/Cloud-provider-with-values.png)

Figure 7 - Cloud Provider Form with values

Once created, a Cloud Provider’s display name or credentials can be updated.

## Configuring an Azure cloud provider

When creating an Azure cloud provider, you need an [Ansible inventory file](https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html) and ssh keys.

#### Create a new set of credentials via CLI commands

```
az login
```

```
az role assignment cerate --assignee YOUR_USER_LOGIN --role "User Access Administrator"
```

Find the `SUBSCRIPTION_ID` of your account, named `id` in the output of this command:
```
az account show
```

Create the service principal for the provider:
```
az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/SUBSCRIPTION_ID"
```

The command returns data needed to create the secret:
```
{
  "appId": "APP_ID",
  "displayName": "name",
  "name": "http://name",
  "password": "PASSWORD",
  "tenant": "TENANT"
}
```


#### Fill out the rest of the form

- Fill out a display name for your cloud provider that you can reference later.
- Fill out Client ID with the `APP_ID`.
- Fill out Client Secret with the `PASSWORD`.
- Fill out Tenant ID with the `TENANT`.
- Fill out Subscription ID with the `SUBSCRIPTION_ID`.
- Click Verify and Save to verify that the credentials are valid and to save your provider.

![Azure Cloud Provider Form with values](/ksphere/kommander/img/Azure-Cloud-provider-with-values.png)

Figure 8 - Azure Cloud Provider Form with values

Once created, a Cloud Provider’s display name or credentials can be updated.

### Configuring an On Premise provider

When creating an On Premise provider, you need a private SSH key.

- Fill out a display name for your cloud provider for later reference.
- Fill out Private SSH Key with the key used to access your infrastructure.
- Click Verify and Save to verify the credentials are valid and to save your provider.

![On Premise Provider Form with values](/ksphere/kommander/img/On-prem-provider-with-values.png)

Figure 9 - On Premise Provider Form with values

Once created, a Provider’s display name or credentials can be updated.

### Deleting a cloud provider

When attempting to delete a cloud provider Kommander first verifies if any existing managed clusters were created using the provider. The cloud provider cannot be deleted until all clusters created with the cloud provider have been deleted. This is to ensure Kommander has access to your cloud provider to remove all resources created for a managed cluster.

[aws_credentials]: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html
