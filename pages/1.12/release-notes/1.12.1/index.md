---
layout: layout.pug
navigationTitle: Release notes for 1.12.1
title: Release notes for 1.12.1 
menuWeight: 15
excerpt: Release notes for DC/OS 1.12.1
---

# Mesosphere DC/OS Release Notes (sample 2)

Version 1.12.1 - Released 3 January 2019

| <a href="https://support.mesosphere.com/hc/en-us/articles/213198586">Download</a> | Share | Print | Contribute | Discuss | <a href="https://support.mesosphere.com">Feedback</a> |
|---|---|---|---|---|---|---|

## Release summary

DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment. 

This component-level release includes changes to improve the user experience, fix reported issues, integrate enhancements from previous releases, and maintain compatibility and support for other packages--such as Marathon and Metronome--used in DC/OS.

If you have DC/OS deployed in a production environment, see Known issues and limitation to see if any potential operational changes for specific scenarios apply to your environment.

## New features and capabilities
This release includes changes for features in DC/OS Enterprise and DC/OS Open Source. If a change only applies to DC/OS Enterprise, it is labeled Enterprise. If a change only applies to DC/OS Open Source, it is labeled OSS.
- Managing clusters across multiple regions. Enterprise
- Enhancing security options. Enterprise
- Providing production-ready Kubernetes-as-a-service.
- Updating data services.

The new features and capabilities that have been introduced in DC/OS 1.12.1 are grouped by functional area or component and include links to view additional documentation. 

### Multi-region management [enterprise type="inline" size="small" /]
Enables a DC/OS cluster to span multiple datacenters, clouds, and remote branches while providing unified management to control cluster operations and resources. 

### Security management [enterprise type="inline" size="small" /]
Enables DC/OS to store binary file as secrets in addition to environment variables and apply hierarchical access control for users, groups, and objects.

### Networking and load balancing
Enables DC/OS support for  Edge load balancing (Edge-LB 1.0). In addition, DC/OS Enterprise and DC/OS OSS support  IPv6or Docker containers.

### Data services updates 
You can configure fault domain awareness to make DC/OS Kafka, DC/OS Cassandra, DC/OS Elastic and DC/OS HDFS services highly available and to allow for increased capacity when needed.

## Issues fixed this release
The issues that have been fixed in DC/OS 1.11.8 are grouped by feature, functional area, or component. Most change descriptions include one or more issue tracking identifiers enclosed in parenthesis for reference.

### Dashboard 
For improved scalability, the DC/OS UI starts loading state information immediately after users log on (DCOS-37791, DCOS-42504).

### Networking
- Service endpoints for layer-4 load balancing (`l4lb`) addresses with UCR and CNI can be configured and deployed by using the DC/OS UI or through the DC/OS CLI. A fix ensures that the configuration done through the DC/OS UI is not overwritten by using the DC/OS CLI (COPS-3573).

- The Mesos fetcher process automatically retries downloading files using their associated URI if the previously-downloaded and cached versions of the files are not found (COPS-3953).

## Known issues and limitations
This section covers any known issues or limitations that don’t necessarily affect all customers, but might require changes to your environment to address specific scenarios. The issues are grouped by feature, functional area, or component. Where applicable, issue descriptions include one or more issue tracking identifiers enclosed in parenthesis for reference.

### Marathon plugin dependency
If you have custom Marathon plugins or have added any Marathon-dependent customization to your cluster, you might need to update the plugins or customized components after you upgrade to this release. For example, if you have a plugin with a dependency on Scala Logging version 3.1.0, which was compiled with Scala 2.11, you need to upgrade the Scala Logging package to version 3.7.2 compiled with Scala 2.12 to maintain compatibility with the logging library used in the Marathon package included in this release of DC/OS.

### Service account permissions for metics collection
Metrics in DC/OS, version 1.12 and newer, are based on Telegraf. Telegraf provides an agent-based service that runs on each master and agent node in a DC/OS cluster. By default, Telegraf gathers metrics from all of the processes running on the same node, processes them, then sends the collected information to a central metrics database. The  Telegraf. Program runs under the service accounts dcos_telegraf_master and dcos_telegraf_agent. These two service account must be granted dcos::superuser permissions.

## Updated components change lists
For access to the logs that track specific changes to components that are included in the DC/OS distribution, see the following links:
- Apache Mesos 1.5.x change log.
- Marathon 1.6.564 change log.
- Metronome 0.4.4 change log.
- DC/OS 1.12.1 summary log.

## Previous releases
To review changes from a previous release, see the following links:
Release version 1.10.9 - 16 November 2018..
Release version 1.11.8 - 6 December 2018..
Release version 1.12.0  24 October 2018..


# Mesosphere DC/OS Release Notes (sample 2)
Version 1.12.1 - Released 3 January 2019
| <a href="https://support.mesosphere.com/hc/en-us/articles/213198586">Download</a> | Share | Print | Contribute | Discuss | Feedback|
|---|---|---|---|---|---|---|

DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment. 
This release provides enhancements to existing features, fixes to address specific issues, updates for ongoing improvements to logging, diagnostics, and documentation, and additional changes or testing to ensure and verify DC/OS compatibility and integration with other packages and platforms.

# What’s new in this release
This release includes changes for features in DC/OS Enterprise and DC/OS Open Source. If a change only applies to DC/OS Enterprise, it is labeled Enterprise. If a change only applies to DC/OS Open Source, it is labeled OSS.

Highlights include features or fixes:
- Managing clusters across multiple regions
- Enhanced security options

# Updated components change lists
For access to the logs that track specific changes to components that are included in the DC/OS distribution, see the following links:
- Apache Mesos 1.5.x change log.
- Marathon 1.6.564 change log.
- Metronome 0.4.4 change log.
- DC/OS 1.12.1 summary log.

# Issues fixed this release

# Known issues and limitations
This section covers any known issues or limitations that don’t necessarily affect all customers, but might require changes to your environment to address specific scenarios. The issues are grouped by feature, functional area, or component. Where applicable, issue descriptions include one or more issue tracking identifiers enclosed in parenthesis for reference.

# Previous releases
To review changes from a previous release, see the following links:
- Release version 1.10.9 - 16 November 2018.
- Release version 1.11.8 - 6 December 2018.