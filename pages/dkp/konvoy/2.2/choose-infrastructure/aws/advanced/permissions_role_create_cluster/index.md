---
layout: layout.pug
navigationTitle: Minimal Permissions and Role to Create Clusters
title: Minimal Permissions and Role to Create Clusters
excerpt: Minimal Permissions and Role to Create Clusters
beta: false
enterprise: false
menuWeight: 35
---

Configure IAM Prerequisites before starting a cluster

This section guides you in creating and using the minimally-scoped policy in order to create DKP clusters on an AWS account. 

## Prerequisites
Before applying the IAM Policies, verify the following:

-  You have a valid AWS account with [credentials configured](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html) that can manage CloudFormation Stacks, IAM Policies, IAM Roles, and IAM Instance Profiles.

-  The [AWS CLI utility](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) is installed.

### Minimal Permissions
The following is an AWSCloudformation stack that creates: 

-  A policy named `dkp-bootstrapper-policy` that enumerates the minimal permissions for a user that can create dkp aws clusters.

-  A role named `dkp-bootstrapper-role` that uses the `dkp-bootstrapper-policy` with a trust policy to allow IAM users and ec2 instances from `MYAWSACCOUNTID` to use the role via STS.

-  An instance profile `DKPBootstrapInstanceProfile` that wraps the `dkp-bootstrapper-role` to be used by ec2 instances.

```yaml
AWSTemplateFormatVersion: 2010-09-09
Resources:
  AWSIAMInstanceProfileDKPBootstrapper:
    Properties:
      InstanceProfileName: DKPBootstrapInstanceProfile
      Roles:
      - Ref: DKPBootstrapRole
    Type: AWS::IAM::InstanceProfile
  AWSIAMManagedPolicyDKPBootstrapper:
    Properties:
      Description: Minimal policy to create dkp clusters in AWS
      ManagedPolicyName: dkp-bootstrapper-policy
      PolicyDocument:
        Statement:
        - Action:
          - ec2:AllocateAddress
          - ec2:AssociateRouteTable
          - ec2:AttachInternetGateway
          - ec2:AuthorizeSecurityGroupIngress
          - ec2:CreateInternetGateway
          - ec2:CreateNatGateway
          - ec2:CreateRoute
          - ec2:CreateRouteTable
          - ec2:CreateSecurityGroup
          - ec2:CreateSubnet
          - ec2:CreateTags
          - ec2:CreateVpc
          - ec2:ModifyVpcAttribute
          - ec2:DeleteInternetGateway
          - ec2:DeleteNatGateway
          - ec2:DeleteRouteTable
          - ec2:DeleteSecurityGroup
          - ec2:DeleteSubnet
          - ec2:DeleteTags
          - ec2:DeleteVpc
          - ec2:DescribeAccountAttributes
          - ec2:DescribeAddresses
          - ec2:DescribeAvailabilityZones
          - ec2:DescribeInstances
          - ec2:DescribeInternetGateways
          - ec2:DescribeImages
          - ec2:DescribeNatGateways
          - ec2:DescribeNetworkInterfaces
          - ec2:DescribeNetworkInterfaceAttribute
          - ec2:DescribeRouteTables
          - ec2:DescribeSecurityGroups
          - ec2:DescribeSubnets
          - ec2:DescribeVpcs
          - ec2:DescribeVpcAttribute
          - ec2:DescribeVolumes
          - ec2:DetachInternetGateway
          - ec2:DisassociateRouteTable
          - ec2:DisassociateAddress
          - ec2:ModifyInstanceAttribute
          - ec2:ModifyNetworkInterfaceAttribute
          - ec2:ModifySubnetAttribute
          - ec2:ReleaseAddress
          - ec2:RevokeSecurityGroupIngress
          - ec2:RunInstances
          - ec2:TerminateInstances
          - tag:GetResources
          - elasticloadbalancing:AddTags
          - elasticloadbalancing:CreateLoadBalancer
          - elasticloadbalancing:ConfigureHealthCheck
          - elasticloadbalancing:DeleteLoadBalancer
          - elasticloadbalancing:DescribeLoadBalancers
          - elasticloadbalancing:DescribeLoadBalancerAttributes
          - elasticloadbalancing:ApplySecurityGroupsToLoadBalancer
          - elasticloadbalancing:DescribeTags
          - elasticloadbalancing:ModifyLoadBalancerAttributes
          - elasticloadbalancing:RegisterInstancesWithLoadBalancer
          - elasticloadbalancing:DeregisterInstancesFromLoadBalancer
          - elasticloadbalancing:RemoveTags
          - autoscaling:DescribeAutoScalingGroups
          - autoscaling:DescribeInstanceRefreshes
          - ec2:CreateLaunchTemplate
          - ec2:CreateLaunchTemplateVersion
          - ec2:DescribeLaunchTemplates
          - ec2:DescribeLaunchTemplateVersions
          - ec2:DeleteLaunchTemplate
          - ec2:DeleteLaunchTemplateVersions
          - ec2:DescribeKeyPairs
          Effect: Allow
          Resource:
          - '*'
        - Action:
          - autoscaling:CreateAutoScalingGroup
          - autoscaling:UpdateAutoScalingGroup
          - autoscaling:CreateOrUpdateTags
          - autoscaling:StartInstanceRefresh
          - autoscaling:DeleteAutoScalingGroup
          - autoscaling:DeleteTags
          Effect: Allow
          Resource:
          - arn:*:autoscaling:*:*:autoScalingGroup:*:autoScalingGroupName/*
        - Action:
          - iam:CreateServiceLinkedRole
          Condition:
            StringLike:
              iam:AWSServiceName: autoscaling.amazonaws.com
          Effect: Allow
          Resource:
          - arn:*:iam::*:role/aws-service-role/autoscaling.amazonaws.com/AWSServiceRoleForAutoScaling
        - Action:
          - iam:CreateServiceLinkedRole
          Condition:
            StringLike:
              iam:AWSServiceName: elasticloadbalancing.amazonaws.com
          Effect: Allow
          Resource:
          - arn:*:iam::*:role/aws-service-role/elasticloadbalancing.amazonaws.com/AWSServiceRoleForElasticLoadBalancing
        - Action:
          - iam:CreateServiceLinkedRole
          Condition:
            StringLike:
              iam:AWSServiceName: spot.amazonaws.com
          Effect: Allow
          Resource:
          - arn:*:iam::*:role/aws-service-role/spot.amazonaws.com/AWSServiceRoleForEC2Spot
        - Action:
          - iam:PassRole
          Effect: Allow
          Resource:
          - arn:*:iam::*:role/*.cluster-api-provider-aws.sigs.k8s.io
        - Action:
          - secretsmanager:CreateSecret
          - secretsmanager:DeleteSecret
          - secretsmanager:TagResource
          Effect: Allow
          Resource:
          - arn:*:secretsmanager:*:*:secret:aws.cluster.x-k8s.io/*
        Version: 2012-10-17
      Roles:
      - Ref: DKPBootstrapRole
    Type: AWS::IAM::ManagedPolicy
  DKPBootstrapRole:
    Properties:
      AssumeRolePolicyDocument:
        Statement:
        - Action:
          - sts:AssumeRole
          Effect: Allow
          Principal:
            Service:
            - ec2.amazonaws.com
        - Action:
            - sts:AssumeRole
          Effect: Allow
          Principal:
                AWS: arn:aws:iam::MYAWSACCOUNT:root
        Version: 2012-10-17
      RoleName: dkp-bootstrapper-role
    Type: AWS::IAM::Role
 ```


To create the resources in the cloudformation stack, copy the contents above into a file and run the following command after replacing `MYFILENAME.yaml` and `MYSTACKNAME` with the intended values:

```bash
aws cloudformation create-stack --template-body=file://MYFILENAME.yaml --stack-name=MYSTACKNAME --capabilities CAPABILITY_NAMED_IAM
```

## Leverage the Role
### Temporary User Access Keys via STS 
The created `dkp-bootstrapper-role` can be assumed by IAM users for temporary credentials via STS by running the command below:

<p class="message--note"><strong>NOTE: </strong>You must replace MYAWSACCOUNT with an AWS Account ID number ie: 111122223333 </p>

aws sts assume-role --role-arn arn:aws:iam::MYAWSACCOUNT:role/dkp-bootstrapper-role --role-session-name EXAMPLE 
Which returns something similar to this:


{
    "Credentials": {
        "AccessKeyId": "ASIA6RTF53ZH5B52EVM5",
        "SecretAccessKey": "BSssyvSsdfJY74jubsadfdsafdsaH7x1L+8Vk/",
        "SessionToken": "IQoJb3JpZ2z5cyChb9PtJvP0S6KAi",
        "Expiration": "2022-07-14T20:19:13+00:00"
    },
    "AssumedRoleUser": {
        "AssumedRoleId": "ASIA6RTF53ZH5B52EVM5:test",
        "Arn": "arn:aws:sts::MYAWSACCOUNTID:assumed-role/dkp-bootstrapper-role/test"
    }
}
And then export the following environment variables with the results:

```bash
export AWS_ACCESS_KEY_ID=(.Credentials.AccessKeyId)

export AWS_SECRET_ACCESS_KEY=(.Credentials.SecretAccessKey)

export AWS_SESSION_TOKEN=(.Credentials.SessionToken)
 ```

These credentials are short lived and would need to be updated in the bootstrap cluster

### Use EC2 Instance Profiles
The created `dkp-bootstrapper-role` can be assumed by an ec2 instance a user would run `dkp create cluster` commands from. To do this, specify the IAM Instance Profile `DKPBootstrapInstanceProfile` on creation. 

### Use Access Keys
AWS administrators can attach the dkp-bootstrapper-policy to an existing IAM user and authenticate with Access Keys on the work station they would run dkp create cluster commands from by exporting the following environment variables with the appropriate values for the IAM user.  


export AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
export AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
export AWS_DEFAULT_REGION=us-west-2

### Best practices 
A system administrator should always consider [best practices](https://docs.aws.amazon.com/general/latest/gr/aws-access-keys-best-practices.html) for Access Keys.
