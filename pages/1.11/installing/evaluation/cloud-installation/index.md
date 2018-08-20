---
layout: layout.pug
excerpt: Cloud installation for demos and proofs of concepts
title: Cloud Installation Options
navigationTitle: Cloud Installation
menuWeight: 5
---

The cloud installation method is used to test or demo DC/OS on Azure, AWS, GCE, Digital Ocean, or Packet. These clusters cannot be upgraded.
DC/OS CloudFormation templates are intended for reference only and are not recommended for production use due to the following limitations:
- CloudFormation does not allow for coordinated zero-downtime in-place updates within Auto Scaling groups.
- CloudFormation does not allow for automated zero-downtime replacement of Auto Scaling groups.
- Replacing DC/OS agent nodes requires manual data migration of local storage volumes for stateful services.
- Updates of DC/OS on AWS CloudFormation have not been automated, validated, or documented.
- Modified CloudFormation templates are not supported by Mesosphere, Inc.

You can use the [Production Installation](/1.11/installing/production/) methods to install a fully functional cluster.

**Note:** The cloud installation methods are not officially supported by Mesosphere, but are supported by the DC/OS community. Contact the [mailing list](https://groups.google.com/a/dcos.io/forum/#!forum/users) or [Slack channel](http://chat.dcos.io/?_ga=2.226911897.58407594.1533244861-1110201164.1520633201) for community support.
