---
layout: layout.pug
navigationTitle: Configure an AWS Cloud Provider with Static Credentials
title: AWS Static Credentials
beta: true
excerpt: Configuring an AWS Cloud Provider with static credentials
---

### Configuring an AWS Cloud Provider with static credentials

When configuring a cloud provider with static credentials, you need an access id and secret key for a user with a set of minimum capabilities.

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

You can use an existing AWS user with [credentials configured][aws_credentials]. The user must be authorized to create the following resources in the AWS account:

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

#### Fill out the Add Cloud Provider form

In Kommander, select the Workspace associated with the credentials you are adding.

Navigate to **Administration > Cloud Providers** and select the **Add Cloud Provider** button.

![Add Cloud Provider](/ksphere/kommander/img/add-cloud-provider.png)

- Select the Amazon Web Services (AWS) option from the Add Cloud Provider form.
- Ensure **Static** is selected as the Authentication Method.
- Select a name for your cloud provider for later reference. Consider choosing a name that matches the AWS user.
- Fill out the access and secret keys using the keys generated above.
- Select **Verify** and **Save** to verify the credentials are valid and to save your provider.

![Cloud Provider Form with values](/ksphere/kommander/img/Cloud-provider-with-values.png)

Cloud Provider Form with values

Once created, a Cloud Provider’s display name or credentials can be updated.

[aws_credentials]: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html

