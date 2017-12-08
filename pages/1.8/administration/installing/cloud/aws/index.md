---
layout: layout.pug
title: Running DC/OS on AWS EC2
menuWeight: 100
excerpt:
featureMaturity:
enterprise: true
---

You can create a DC/OS cluster for Amazon Web Services (AWS) by using the DC/OS templates on AWS CloudFormation.

## [Basic templates](/1.8/administration/installing/cloud/aws/basic/)
The basic templates provide:

* Limited customization options
* Fastest deployment and minimal setup required
* Great for simple production deployments, demos, and testing

## [Advanced templates](/1.8/administration/installing/cloud/aws/advanced/)
Choose the advanced templates if you want to customize the AMI, VPC, or Instance Type. The advanced templates are:

* Highly customizable
* Composable, for example you can deploy multiple agent pools to a single cluster
* More setup work is required