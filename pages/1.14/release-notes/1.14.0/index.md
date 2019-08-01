---
layout: layout.pug
navigationTitle: Release notes for 1.14.0
title: Release notes for 1.14.0
menuWeight: 5
render: mustache
model: /1.14/data.yml
excerpt: Release notes for DC/OS 1.14.0, including Open Source attribution, and version policy.
---
DC/OS 1.14.0 was released on //.

[button color="light" href="https://downloads.dcos.io/dcos/stable/1.14.0/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="http://downloads.mesosphere.com/dcos-enterprise/stable/1.14.0/dcos_generate_config.ee.sh"]Download DC/OS Enterprise* [/button]

Registered DC/OS Enterprise customers can access the DC/OS Enterprise configuration file from the <a href="https://support.mesosphere.com/s/downloads">support website</a>. For new customers, contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and install DC/OS Enterprise.

# Release summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages–such as Marathon and Metronome–used in DC/OS.

If you have DC/OS deployed in a production environment, see [Known issues and limitations](#known-issues) to see if any potential operational changes for specific scenarios apply to your environment.

# New features and capabilities

## Highlights of what's new

# Issues fixed in this release


### Third-party updates and compatibility
- Update support for REX-Ray to the most recent stable version (DCOS_OSS-4316,COPS-3961).

- Upgrade the version of the Telegraf metrics plugin supported to leverage recent bug fixes and feature improvements (DCOS_OSS-4675).

- Update the supported version of Java to 8u192 to address known critical and high security vulnerabilities (DCOS-43938, DCOS_OSS-4380).

- Upgrade the support for the Erlang/OTP framework to Erlang/OTP version 21.3 (DCOS_OSS-4902).

# Known issues and limitations
This section covers any known issues or limitations that don’t necessarily affect all customers, but might require changes to your environment to address specific scenarios. The issues are grouped by feature, functional area, or component. Where applicable, issue descriptions include one or more tracking identifiers enclosed in parenthesis for reference.

### Deprecated or decommissioned features


# Updated components change lists


# Previous releases
To review changes from a recent previous release, see the following links:
- [Release version 1.10.11](/mesosphere/dcos/1.10/release-notes/1.10.11/) - 12 February 2019.
- [Release version 1.11.10](/mesosphere/dcos/1.11/release-notes/1.11.10/) - 12 February 2019.
- [Release version 1.12.3](/mesosphere/dcos/1.12/release-notes/1.12.3/) - 14 March 2019.
