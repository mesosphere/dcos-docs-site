---
layout: layout.pug
navigationTitle: Multiple AWS Accounts
title: Multiple AWS Accounts
menuWeight: 10
excerpt: Leverage Multiple AWS Accounts for Kubernetes Cluster Deployments
beta: false
enterprise: false
---

# Leverage Multiple AWS Accounts for Kubernetes Cluster Deployments


---

## Objective

You can leverage multiple AWS accounts in your organization to meet specific business purposes, reflect your organizational structure, or implement a multi-tenancy strategy. Specific scenarios include:

* Implementing isolation between environment tiers such as development, testing, acceptance, and production.
* Implementing separation of concerns between management clusters, and workload clusters.
* Reducing the impact of security events and incidents.

You can see the additional benefits of using multiple AWS accounts in the following [white paper](https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/benefits-of-using-multiple-aws-accounts.html)

This document describes how to leverage the D2iQ Kubernetes Platform (DKP) to deploy a management cluster, and multiple workload clusters, leveraging multiple AWS accounts.

## Assumptions

This guide assumes you have some understanding of Cluster API concepts and basic DKP provisioning workflows on AWS.

Cluster API Concepts - [cluster API concepts](https://cluster-api.sigs.k8s.io/user/concepts.html)

Getting Started with DKP on AWS - [getting started on AWS](https://docs.d2iq.com/dkp/konvoy/2.1/choose-infrastructure/aws/)

## Glossary

* **Management cluster** - The cluster that runs in AWS and is used to create target clusters in different AWS accounts.
* **Target account** - The account where the target cluster is created.
* **Source account** - The AWS account where the CAPA controllers for the management cluster runs.

## Prerequisites

Before you begin deploying DKP on AWS, you must:

Configure the [prerequisites](https://docs.d2iq.com/dkp/konvoy/2.1/choose-infrastructure/aws/quick-start-aws/#configure-aws-prerequisites)

## Deploy DKP on AWS

1. Deploy a management cluster in your AWS source account.

* **AWS:** [create Kubernetes AWS cluster](https://docs.d2iq.com/dkp/konvoy/2.1/choose-infrastructure/aws/quick-start-aws/#create-a-new-aws-kubernetes-cluster)

2. Configure a trusted relationship between source and target accounts and create a management cluster:

### Step 1:

DKP leverages the Cluster API provider for AWS (CAPA) to provision Kubernetes clusters in a declarative way. Customers declare the desired state of the cluster through a cluster configuration YAML file which is generated using:

(AWS)
```bash
dkp create cluster aws --cluster-name=${CLUSTER_NAME} \
--dry-run \
--output=yaml \
> ${CLUSTER_NAME}.yaml
```

### Step 2:
Configure a trust relationship between the source and target accounts.


***Follow all the prerequisite steps in both the source and target accounts***

1. Create all policies and roles in management and workload accounts
   a. The prerequisite IAM policies for DKP are documented here: [white paper](https://docs.d2iq.com/dkp/konvoy/2.1/choose-infrastructure/aws/iam-policies/)

2. Establish a trust relationship in workload account for the management account

    a. Go to your target (workload) account
    b. Search for the role control-plane.cluster-api-provider-aws.sigs.k8s.io
    c. Navigate to the Trust Relationship tab and select Edit Trust Relationship
    d. Add the following relationship

```bash
{
  "Effect": "Allow",
  "Principal": {
     "AWS": "arn:aws:iam::${mgmt-aws-account}:role/control-plane.cluster-api-provider-aws.sigs.k8s.io"
  },
  "Action": "sts:AssumeRole"
}
```

3. Give permission to role in the source (management cluster) account to call the `sts:AssumeRole API`
    a. Log in to the source AWS account and attach the following inline policy to control-plane.cluster-api-provider-aws.sigs.k8s.io role

```bash
{
  "Version": "2012-10-17",
  "Statement": [
     {
       "Effect": "Allow",
       "Action": "sts:AssumeRole",
       "Resource": [
"arn:aws:iam::${workload-aws-account}:role/control-plane.cluster-api-provider-aws.sigs.k8s.io"
       ]
     }
  ]
}
```


4. Modify the management cluster configuration file and update the AWSCluster object with following details

```bash
apiVersion: infrastructure.cluster.x-k8s.io/v1alpha3
kind: AWSCluster
metadata:
spec:
  identityRef:
     kind: AWSClusterRoleIdentity
     name: cross-account-role
…
…
---
apiVersion: infrastructure.cluster.x-k8s.io/v1alpha3
kind: AWSClusterRoleIdentity
metadata:
  name: cross-account-role
spec:
  allowedNamespaces: {}
  roleARN: "arn:aws:iam::${workload-aws-account}:role/control-plane.cluster-api-provider-aws.sigs.k8s.io"
  sourceIdentityRef:
    kind: AWSClusterControllerIdentity
    name: default
```
After performing the above steps, your Management cluster will be configured to create new managed clusters in the target AWS workload account.
