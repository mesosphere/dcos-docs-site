---
layout: layout.pug
navigationTitle: AWS
title: AWS
menuWeight: 10
excerpt: AWS
beta: false
enterprise: false
---

The following diagrams show the two different ways you can implement Konvoy on AWS, DKP Essential and DKP Enterprise.

This diagram shows the granular detail of a single Kubernetes cluster running in AWS Cloud:

![DKP Essential](/dkp/konvoy/2.3/img/DKP_essential.png)

This diagram shows a higher-level view of DKP Enterprise, and assumes a multi-cluster environment, where each cluster might look like the single cluster example above:

![DKP Enterprise](/dkp/konvoy/2.3/img/DKP_enterprise.png)

## AWS pricing considerations

Deploying AWS services can incur costs to your organization, depending on how and what you deploy. For more information, see the [AWS Pricing Calculator](https://calculator.aws/#/).

## AWS service limits

When using DKP on AWS, you need to be aware of the possibility of errors due to AWS service limits. For more information, see the [AWS Service Limits](https://aws.amazon.com/premiumsupport/knowledge-center/manage-service-limits/).

## Configuration types

When installing Konvoy on AWS, you can choose from multiple configuration types. The different types of AWS configuration types supported in Konvoy are listed below:
