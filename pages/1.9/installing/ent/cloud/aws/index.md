---
layout: layout.pug
title: Running DC/OS on AWS EC2
menuWeight: 100
excerpt:

enterprise: true
---

You can create a DC/OS cluster for Amazon Web Services (AWS) by using the DC/OS templates on AWS CloudFormation.

## [Basic templates](/1.9/installing/ent/cloud/aws/basic/)
The basic templates provide:

* Limited customization options
* Fastest deployment and minimal setup required
* Great for simple production deployments, demos, and testing

## [Advanced templates](/1.9/installing/ent/cloud/aws/advanced/)
Choose the advanced templates if you want to customize the AMI, VPC, or Instance Type. The advanced templates are:

* Highly customizable
* Composable, for example you can deploy multiple agent pools to a single cluster
* More setup work is required

[message type="warning"] DC/OS CloudFormation templates are intended for reference only and are not recommended for production use due to the following limitations:

- CloudFormation does not allow for coordinated zero-downtime in-place updates within Auto Scaling groups.
- CloudFormation does not allow for automated zero-downtime replacement of Auto Scaling groups.
- Replacing DC/OS agent nodes requires manual data migration of local storage volumes for stateful services.
- Updates of DC/OS on AWS CloudFormation have not been automated, validated, or documented.
- Modified CloudFormation templates are not supported by Mesosphere, Inc.

The recommended way to install production ready DC/OS that can be upgraded in-place is to use the [Advanced Installer](/1.9/installing/ent/custom/advanced/).
[/message]

