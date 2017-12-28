---
layout: layout.pug
excerpt:
title: Running DC/OS on AWS EC2
navigationTitle: AWS
menuWeight: 0
---

You can create a DC/OS cluster for Amazon Web Services (AWS) by using the DC/OS templates on AWS CloudFormation.

## [Basic templates](/1.8/administration/installing/oss/cloud/aws/basic/)
The basic templates provide:

* Limited customization options
* Fastest deployment and minimal setup required
* Great for simple production deployments, demos, and testing

## [Advanced templates](/1.8/administration/installing/oss/cloud/aws/advanced/)
Choose the advanced templates if you want to customize the AMI, VPC, or Instance Type. The advanced templates are:

* Highly customizable
* Composable, for example you can deploy multiple agent pools to a single cluster
* More setup work is required

**Note:** Due to the following limitations you must not use these templates in production:

* DC/OS clusters created with the templates cannot be upgraded.
* Modifications to the templates are not supported.

For production clusters, Mesosphere recommends you use the methods described in DC/OS Open Source Advanced Installation Guide or DC/OS Enterprise Advanced Installation Guide.