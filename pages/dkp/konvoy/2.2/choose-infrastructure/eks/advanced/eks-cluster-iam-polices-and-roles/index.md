---
layout: layout.pug
navigationTitle: EKS Cluster IAM Policies and Roles
title: EKS Cluster IAM Policies and Roles
menuWeight: 25
excerpt: Configure IAM Prerequisites before starting an EKS cluster
enterprise: false
---
This guides a DKP user in creating IAM Policies and Instance Profiles used by the cluster’s control plane and worker nodes using the provided AWS CloudFormation Stack specific to EKS. The [IAM Policy][iampolicies] CloudFormation Stack has code for an additional role for EKS not needed in other AWS environments.

Prerequisites:
--------------

* A valid AWS account with [credentials configured][aws_credentials].
    
* Create the Instance Profiles, Roles, and Polices from the [AWS Prerequisite page][iampolicies] in your AWS account
    
* You will need to have the [AWS CLI utility installed][awscli].
    

EKS IAM Artifacts
-----------------

### Policies

*   `controllers-eks.cluster-api-provider-aws.sigs.k8s.io` - enumerates the Actions required by the workload cluster to create and modify EKS clusters in the user's AWS Account. It is attached to the existing `control-plane.cluster-api-provider-aws.sigs.k8s.io`  role
    
*   `eks-nodes.cluster-api-provider-aws.sigs.k8s.io` - enumerates the Actions required by the EKS workload cluster's worker machines. It is attached to the existing `nodes.cluster-api-provider-aws.sigs.k8s.io`
    

### Roles

*   `eks-controlplane.cluster-api-provider-aws.sigs.k8s.io` - is the Role associated with EKS cluster control planes
    


**NOTE**: `control-plane.cluster-api-provider-aws.sigs.k8s.io` and `nodes.cluster-api-provider-aws.sigs.k8s.io` roles were created by [Instance Profiles, Roles, and Polices from the AWS Prerequisites][iampolicies].

  
Below is a [CloudFormation stack][cloudformation] that includes IAM policies and roles required to setup EKS Clusters:

```yaml
AWSTemplateFormatVersion: 2010-09-09
Parameters:
  existingControlPlaneRole:
    Type: CommaDelimitedList
    Description: 'Names of existing Control Plane Role you want to add to the newly created EKS Managed Policy'
    Default: control-plane.cluster-api-provider-aws.sigs.k8s.io
  existingNodeRole:
    Type: CommaDelimitedList
    Description: 'ARN of the Nodes Managed Policy to add to the role'
    Default: nodes.cluster-api-provider-aws.sigs.k8s.io
Resources:
  AWSIAMManagedPolicyControllersEKS:
    Properties:
      Description: For the Kubernetes Cluster API Provider AWS Controllers
      ManagedPolicyName: controllers-eks.cluster-api-provider-aws.sigs.k8s.io
      PolicyDocument:
        Statement:
          - Action:
              - 'ssm:GetParameter'
            Effect: Allow
            Resource:
              - 'arn:*:ssm:*:*:parameter/aws/service/eks/optimized-ami/*'
          - Action:
              - 'iam:CreateServiceLinkedRole'
            Condition:
              StringLike:
                'iam:AWSServiceName': eks.amazonaws.com
            Effect: Allow
            Resource:
              - >-
                arn:*:iam::*:role/aws-service-role/eks.amazonaws.com/AWSServiceRoleForAmazonEKS
          - Action:
              - 'iam:CreateServiceLinkedRole'
            Condition:
              StringLike:
                'iam:AWSServiceName': eks-nodegroup.amazonaws.com
            Effect: Allow
            Resource:
              - >-
                arn:*:iam::*:role/aws-service-role/eks-nodegroup.amazonaws.com/AWSServiceRoleForAmazonEKSNodegroup
          - Action:
              - 'iam:CreateServiceLinkedRole'
            Condition:
              StringLike:
                'iam:AWSServiceName': eks-fargate.amazonaws.com
            Effect: Allow
            Resource:
              - >-
                arn:aws:iam::*:role/aws-service-role/eks-fargate-pods.amazonaws.com/AWSServiceRoleForAmazonEKSForFargate
          - Action:
              - 'iam:GetRole'
              - 'iam:ListAttachedRolePolicies'
            Effect: Allow
            Resource:
              - 'arn:*:iam::*:role/*'
          - Action:
              - 'iam:GetPolicy'
            Effect: Allow
            Resource:
              - 'arn:aws:iam::aws:policy/AmazonEKSClusterPolicy'
          - Action:
              - 'eks:DescribeCluster'
              - 'eks:ListClusters'
              - 'eks:CreateCluster'
              - 'eks:TagResource'
              - 'eks:UpdateClusterVersion'
              - 'eks:DeleteCluster'
              - 'eks:UpdateClusterConfig'
              - 'eks:UntagResource'
              - 'eks:UpdateNodegroupVersion'
              - 'eks:DescribeNodegroup'
              - 'eks:DeleteNodegroup'
              - 'eks:UpdateNodegroupConfig'
              - 'eks:CreateNodegroup'
              - 'eks:AssociateEncryptionConfig'
              - 'eks:ListIdentityProviderConfigs'
              - 'eks:AssociateIdentityProviderConfig'
              - 'eks:DescribeIdentityProviderConfig'
              - 'eks:DisassociateIdentityProviderConfig'
            Effect: Allow
            Resource:
              - 'arn:*:eks:*:*:cluster/*'
              - 'arn:*:eks:*:*:nodegroup/*/*/*'
          - Action:
              - 'ec2:AssociateVpcCidrBlock'
              - 'ec2:DisassociateVpcCidrBlock'
              - 'eks:ListAddons'
              - 'eks:CreateAddon'
              - 'eks:DescribeAddonVersions'
              - 'eks:DescribeAddon'
              - 'eks:DeleteAddon'
              - 'eks:UpdateAddon'
              - 'eks:TagResource'
              - 'eks:DescribeFargateProfile'
              - 'eks:CreateFargateProfile'
              - 'eks:DeleteFargateProfile'
            Effect: Allow
            Resource:
              - '*'
          - Action:
              - 'iam:PassRole'
            Condition:
              StringEquals:
                'iam:PassedToService': eks.amazonaws.com
            Effect: Allow
            Resource:
              - '*'
          - Action:
              - 'kms:CreateGrant'
              - 'kms:DescribeKey'
            Condition:
              'ForAnyValue:StringLike':
                'kms:ResourceAliases': alias/cluster-api-provider-aws-*
            Effect: Allow
            Resource:
              - '*'
        Version: 2012-10-17
      Roles: !Ref existingControlPlaneRole
    Type: 'AWS::IAM::ManagedPolicy'
  AWSIAMManagedEKSNodesPolicy:
    Properties:
      Description: Additional Policies to nodes role to work for EKS
      ManagedPolicyName: eks-nodes.cluster-api-provider-aws.sigs.k8s.io
      PolicyDocument:
        Statement:
          - Action:
              - "ec2:AssignPrivateIpAddresses"
              - "ec2:AttachNetworkInterface"
              - "ec2:CreateNetworkInterface"
              - "ec2:DeleteNetworkInterface"
              - "ec2:DescribeInstances"
              - "ec2:DescribeTags"
              - "ec2:DescribeNetworkInterfaces"
              - "ec2:DescribeInstanceTypes"
              - "ec2:DetachNetworkInterface"
              - "ec2:ModifyNetworkInterfaceAttribute"
              - "ec2:UnassignPrivateIpAddresses"
            Effect: Allow
            Resource:
              - '*'
          - Action:
              - "ec2:DescribeInstances"
              - "ec2:DescribeInstanceTypes"
              - "ec2:DescribeRouteTables"
              - "ec2:DescribeSecurityGroups"
              - "ec2:DescribeSubnets"
              - "ec2:DescribeVolumes"
              - "ec2:DescribeVolumesModifications"
              - "ec2:DescribeVpcs"
              - "eks:DescribeCluster"
            Effect: Allow
            Resource:
              - '*'
        Version: 2012-10-17
      Roles: !Ref existingNodeRole
    Type: 'AWS::IAM::ManagedPolicy'
  AWSIAMRoleEKSControlPlane:
    Properties:
      AssumeRolePolicyDocument:
        Statement:
          - Action:
              - 'sts:AssumeRole'
            Effect: Allow
            Principal:
              Service:
                - eks.amazonaws.com
        Version: 2012-10-17
      ManagedPolicyArns:
        - 'arn:aws:iam::aws:policy/AmazonEKSClusterPolicy'
      RoleName: eks-controlplane.cluster-api-provider-aws.sigs.k8s.io
    Type: 'AWS::IAM::Role'
```

To create the resources in the cloudformation stack copy the contents above into a file and run the following command after replacing  `MYFILENAME.yaml` and `MYSTACKNAME` with the intended values:

```bash
 aws cloudformation create-stack --template-body=file://MYFILENAME.yaml --stack-name=MYSTACKNAME --capabilities  CAPABILITY_NAMED_IAM
```

[iampolicies]: ../../../aws/iam-policies
[awscli]: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html
[aws_credentials]: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html
[cloudformation]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html
