---
layout: layout.pug
title: DC/OS 1.4
menuWeight: 1
excerpt:
enterprise: true
featureMaturity:
---




The release notes provide a list of useful topics and links for Mesosphere DC/OS.

# <a name="dcos-ui"></a>DC/OS Web Interface and DC/OS Services

*   Navigate a Tasks directory on an Agent.
*   Graphs now give an indication of network interruption/hanging requests.
*   Design improvements to all side panels (Nodes, Service, Task).
*   Task failure rate is shown correctly now.
*   CLI install modal no longer hides contents.
*   Significant updates to DC/OS Services: Kafka (0.9.2), HDFS (0.1.5)
*   Cassandra CLI has been added

# <a name="marathon-chronos"></a>Marathon and Chronos

*   Marathon 0.13.0 
    *   Breaking Changes 
        *   Tasks keys and storage format in ZooKeeper
        *   Zookeeper Compression
        *   Use logback as logging backend
    *   Major changes to the UI layout
    *   Enable extensions to Marathon via Plugins
    *   Pluggable Authentication and Authorization hooks
    *   See the [Marathon 0.13.0 release notes][1]

# <a name="mesos"></a>Mesos

*   The Mesos kernel is now 0.25.0.
*   Highlights 
    *   Experimental support for maintenance primitives.
    *   Added master endpoints /reserve and /unreserve for dynamic reservations.
    *   Extended Module APIs to enable IP per container assignment, isolation and resolution.
*   See the [Mesos 0.25.0 release notes][2]

<!-- ## System Requirements

The system requirements are documented [here](/1.7/administration/installing/cloud/system-requirements/). -->

# <a name="known-issues"></a>Known Issues and Limitations

*   See additional known issues at <a href="https://support.mesosphere.com" target="_blank">support.mesosphere.com</a>.

*   `DC/OS UI` The Service and Agent panels won't render over 5,000 tasks. If you have a service or agent that has over 5,000 your browser may experience slowness. In this case you can close said browser tab and reopen DC/OS UI.

 [1]: https://github.com/mesosphere/marathon/blob/v0.13.0-RC1/changelog.md
 [2]: https://git-wip-us.apache.org/repos/asf?p=mesos.git;a=blob_plain;f=CHANGELOG;hb=0.25.0