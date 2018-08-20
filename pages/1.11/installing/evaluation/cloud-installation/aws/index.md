---
layout: layout.pug
title: AWS
navigationTitle: AWS
menuWeight: 5
excerpt: Install DC/OS cluster for Amazon Web Services using templates on AWS CloudFormation
---

You can create a DC/OS cluster for Amazon Web Services (AWS) by using the DC/OS templates on AWS CloudFormation.

**Note:** These installation methods are not officially supported by Mesosphere, but are supported by the DC/OS community. Contact the [mailing list](https://groups.google.com/a/dcos.io/forum/#!forum/users) or [Slack channel](http://chat.dcos.io/?_ga=2.226911897.58407594.1533244861-1110201164.1520633201) for community support.

[message type="warning"] DC/OS CloudFormation templates are intended for reference only and are not recommended for production use due to the following limitations:

- CloudFormation does not allow for coordinated zero-downtime in-place updates within Auto Scaling groups.
- CloudFormation does not allow for automated zero-downtime replacement of Auto Scaling groups.
- Replacing DC/OS agent nodes requires manual data migration of local storage volumes for stateful services.
- Updates of DC/OS on AWS CloudFormation have not been automated, validated, or documented.
- Modified CloudFormation templates are not supported by Mesosphere, Inc.

The recommended way to install production-ready DC/OS that can be upgraded in-place is to use the [Installation method](/1.11/installing/ent/custom/advanced/).
[/message]
