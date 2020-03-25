---
layout: layout.pug
navigationTitle: Release notes for 2.0.3
title: Release notes for 2.0.3
menuWeight: 0
excerpt: Release notes for DC/OS 2.0.3, including Open Source attribution, and version policy.
---
DC/OS&trade; 2.0.3 was released on 19 March 2020.

[button color="light" href="https://downloads.dcos.io/dcos/stable/2.0.3/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="https://downloads.mesosphere.com/dcos-enterprise/stable/2.0.3/dcos_generate_config.ee.sh"]Download DC/OS Enterprise* [/button]

Registered DC/OS Enterprise customers can access the DC/OS Enterprise configuration file from the [support website](https://support.mesosphere.com/s/downloads). For new customers, contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and install DC/OS Enterprise.

# Release Summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

Initial list:



# DC/OS 

## Components

DC/OS 2.0.3 includes the following component versions:

- Apache&reg; Mesos&reg; 1.8.2-dev

### DC/OS Fixed and Improved Issues

- D2IQ-65774
D2IQ-65604
COPS-5804
COPS-5725
COPS-5617
COPS-5615
D2IQ-64620
D2IQ-64507, COPS-5868
D2IQ-62537
D2IQ-61233, COPS-5615
D2IQ-65604

# Marathon

## Components

DC/OS 2.0.3 includes the following Marathon&trade; component version:

- Marathon 1.8.239

### Marathon Fixed and Improved Issues

- Removed non-host reachable container endpoints from the output of the plaintext /v2/tasks endpoint. (MARATHON-8721, COPS-5791)

- Improved the expunge logic so that it evaluates in the same timely manner that unreachable inactive evaluates. (MARATHON-8719, COPS-5617)
