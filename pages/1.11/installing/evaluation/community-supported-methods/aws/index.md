---
layout: layout.pug
title: AWS
navigationTitle: AWS
menuWeight: 5
excerpt: Install DC/OS cluster for Amazon Web Services using templates on AWS CloudFormation
---

<p class="message--note"><strong>NOTE: </strong>Contact the <a href="https://groups.google.com/a/dcos.io/forum/#!forum/users">mailing list</a> or <a href="http://chat.dcos.io/?_ga=2.226911897.58407594.1533244861-1110201164.1520633201">Slack channel</a> for community support.</p>

You can create a DC/OS cluster for Amazon Web Services (AWS) by using the DC/OS templates on AWS CloudFormation.

<p class="message--important"><strong>IMPORTANT: </strong>DC/OS CloudFormation templates are intended for reference only and are not recommended for production use due to the following limitations:

- CloudFormation does not allow for coordinated zero-downtime in-place updates within Auto Scaling groups.
- CloudFormation does not allow for automated zero-downtime replacement of Auto Scaling groups.
- Replacing DC/OS agent nodes requires manual data migration of local storage volumes for stateful services.
- Updates of DC/OS on AWS CloudFormation have not been automated, validated, or documented.
- Modified CloudFormation templates are not supported by Mesosphere, Inc.

The recommended way to install DC/OS that can be upgraded in-place is by following the [production installation process](/1.11/installing/production/deploying-dcos/installation/).
</p>
