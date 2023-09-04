---
layout: layout.pug
navigationTitle: Release notes for 1.13.6
title: Release notes for 1.13.6
menuWeight: 5
excerpt: Release notes for DC/OS 1.13.6, including Open Source attribution, and version policy.
---
DC/OS 1.13.6 was released on 7 November 2019.

[button color="light" href="https://downloads.dcos.io/dcos/stable/1.13.6/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="https://downloads.mesosphere.com/dcos-enterprise/stable/1.13.6/dcos_generate_config.ee.sh"]Download DC/OS Enterprise* [/button]

Registered DC/OS Enterprise customers can access the DC/OS Enterprise configuration file from the [support website](https://support.mesosphere.com/s/downloads). For new customers, contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and install DC/OS Enterprise.


# Release summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

# Fixed and Improved Issues in DC/OS 1.13.6
<!-- The issues that have been fixed and improved in DC/OS 1.13.6 are grouped by feature, functional area, or component.  -->
- Fixed an issue where after upgrading to the latest version of MacOS Catalina, DC/OS certificates were identified as invalid. (DCOS-60264, DCOS-60205, COPS-5417)
- Fixed an issue where if a UCR container is being destroyed and the container is in provisioning state, we will wait for the provisioner to finish before we start destroying the container. This may cause the container to get stuck at destroying, and more seriously may cause the subsequent containers created from the same image to get stuck at provisioning state. Fixed by adding support for destroying the container in provisioning state so that the subsequent containers created from the same image will not be affected. (COPS-5285, MESOS-9964)
- Fixed an issue where Marathon begins crash-looping after receiving a very long error message from a task's fetcher. (COPS-5365)
- Improved diagnosing problems with pods. (DCOS_OSS-5616)
- Fixed an issue occuring if a new secret was added and a secret with the combination of "secret" and the new index as a key was already existing. (COPS-4928)
