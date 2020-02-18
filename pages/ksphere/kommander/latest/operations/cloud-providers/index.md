---
layout: layout.pug
navigationTitle: Cloud Providers
title: Cloud Providers
excerpt: Managing cloud providers used by Kommander
menuWeight: 9
---

Cloud providers like AWS, Azure and Google provide the infrastructure for your Konvoy clusters. To automate their provisioning, Kommander needs authentication keys to your preferred cloud provider. You may have many accounts for a single cloud provider.

In order to provision new clusters and manage them, Kommander needs your cloud provider credentials. Currently AWS, Azure, and On Premise are supported. GKE is coming soon.

![Cloud Provider Form](/ksphere/kommander/img/Cloud-provider-unselected.png)

Cloud Provider Form

## Configuring an AWS cloud provider

When creating an AWS cloud provider, you can choose between the `Static` authentication method and the [Role-based authentication method][iam_roles].

<p class="message--important"><strong>IMPORTANT: </strong>We highly recommend using the Role-based method as this is more secure.</p>

In both cases you need a role with a minimum set of capabilities.

The role should grant permissions to create the following resources in the AWS account:

- EC2 Instances
- VPC
- Subnets
- Elastic Load Balancer (ELB)
- Internet Gateway
- NAT Gateway
- Elastic Block Storage (EBS) Volumes
- Security Groups
- Route Tables
- IAM Roles

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

### Role-based Authentication Method

<p class="message--note"><strong>NOTE: </strong>The Role authentication method can only be used if your management cluster is running in AWS.</p>

To use this option attach the following policy to the role attached to your Kommander cluster.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AssumeRoleKommander",
      "Effect": "Allow",
      "Action": "sts:AssumeRole",
      "Resource": "arn:aws:iam::YOURACCOUNTRESTRICTION:role/THEROLEYOUCREATED"
    }
  ]
}
```

Instead of doing this manually you can add this file, `iam-stsAssumeKommander.tf`, into the `extras/provisioner/` directory next to your `cluster.yaml` file.

```terraform
# Attaching sts:AssumeRole to the default node role from konvoy
resource "aws_iam_role_policy" "agent_policy_assumerole_kommander" {
  count = "${var.create_iam_instance_profile ? 1 : 0}"
  name  = "AssumeRoleKommander"
  role  = "${aws_iam_role.node_role.id}"
  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AssumeRoleKommander",
            "Effect": "Allow",
            "Action": "sts:AssumeRole",
            "Resource": "arn:aws:iam::YOURACCOUNTRESTRICTION:role/THEROLEYOUCREATED"
        }
    ]
}
EOF
}
```

#### External ID

You can add an External ID if you share the Role with a 3rd party. External IDs secure your environment from accidentally used roles. [Here you can read more about External IDs][external_id].

#### Fill out the form

1. Enter a display name for your cloud provider for later reference.
2. Enter the Role ARN.
3. Optionally, enter the External ID.
4. Select **Verify and Save** to validate your credentials and save your provider.

### Static Authentication method

When creating an AWS cloud provider, you need an access id and secret key for a user with a set of minimum capabilities.

#### Create a New User with CLI commands

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

You can use an existing AWS user with [configured credentials][aws_credentials]. This user should be authorized to create the resources listed above in the AWS account.

#### Fill out the form

1. Enter the access and secret keys using the keys generated above.
2. Enter a display name for your cloud provider for later reference.
3. Select **Verify and Save** to validate your credentials and save your provider.

![Cloud Provider Form with values](/ksphere/kommander/img/Cloud-provider-with-values.png)

Cloud Provider Form with values

Once created, a Cloud Provider’s display name or credentials can be updated.

## Configuring an Azure cloud provider

When creating an Azure cloud provider, you need an [Ansible inventory file][inventory_file] and ssh keys.

### Create a new set of credentials with CLI commands

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

### Fill out the rest of the form

1. Enter a display name for your cloud provider for later reference.
2. Enter the Client ID using `APP_ID`.
3. Enter a Client Secret using `PASSWORD`.
4. Enter Tenant ID using `TENANT`.
5. Enter Subscription ID usng `SUBSCRIPTION_ID`.
6. Select **Verify and Save** to validate the credentials and save your provider.

![Azure Cloud Provider Form with values](/ksphere/kommander/img/Azure-Cloud-provider-with-values.png)

Azure Cloud Provider Form with values

Once created, a Cloud Provider’s display name or credentials can be updated.

## Configuring an On Premise provider (Alpha)

<p class="message--important"><strong>IMPORTANT: </strong>On premise provider is currently Alpha. The only way to launch a cluster on premise, currently, is to submit the cluster yaml.
</p>

When creating an On Premise provider, you need a private SSH key.

1. Enter a display name for your cloud provider for later reference.
2. Enter your Private SSH Key to access your infrastructure.
3. Select **Verify and Save** to validate your credentials and save your provider.

![On Premise Provider Form with values](/ksphere/kommander/img/On-prem-provider-with-values.png)

On Premise Provider Form with values

Once created, a Provider’s display name or credentials can be updated.

## Deleting a cloud provider

Before attempting to delete a cloud provider, Kommander first verifies if any existing managed clusters were created using this provider. The cloud provider cannot be deleted until all clusters, created with the cloud provider, have been deleted. This ensures Kommander has access to your cloud provider to remove all resources created for a managed cluster.

[inventory_file]: https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html
[iam_roles]: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html
[external_id]: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user_externalid.html
[aws_credentials]: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html

