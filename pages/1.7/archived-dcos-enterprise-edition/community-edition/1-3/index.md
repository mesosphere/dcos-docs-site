---
layout: layout.pug
title: DC/OS 1.3
menuWeight: 0
excerpt:
enterprise: true
featureMaturity:
---






The release notes provide a list of useful topics and links for Mesosphere DC/OS.

# <a name="dcos-ui"></a>DC/OS Web Interface and DC/OS Services

*   New node and service panels in the DC/OS web interface allow you to: 
    *   Search for individual tasks.
    *   Sort tasks by timestamp, state, CPU usage, or memory usage.
    *   See the health status of all tasks and detailed health information for individual tasks.
*   Integrated [Mesos-DNS 0.4.0][1].
*   Significant updates to DC/OS Services: Kubernetes (1.0.3), Marathon (0.11.1), Chronos (2.4.0), HDFS (0.1.4), Spark (1.5.0).

# <a name="marathon-chronos"></a>Marathon and Chronos

**Marathon 0.11.1**

*   Web interface enhancements 
    *   New Docker settings section allows you to create new apps with Docker images.
    *   Debug failing tasks.
    *   Direct link to Mesos sandbox.
    *   See health checks on the configuration tab.
    *   Overview section allows you to search for apps, sort by resource usage or health status, and get detailed health info.
*   Java 8 or higher is now required to run Marathon. 
*   See the complete list of Marathon changes: [0.11.1][2], [0.11.0][3].

**Chronos 2.4.0**

*   Added a new LIKE constraint.
*   Added support for Docker forcePullImage.
*   Added support for job failure notification through an HTTP callback.
*   Improvements in the way in which unused offers are declined.
*   Updates to the Dockerfile.
*   See the complete list of Chronos changes: [2.4.0][4].

# <a name="mesos"></a>Mesos

*   The Mesos kernel is now 0.24.1.
*   See the [Mesos 0.24.0 release notes][5] and [Mesos 0.24.1 release notes][6].

<!-- ## System Requirements

The system requirements are documented [here](/1.7/administration/installing/cloud/system-requirements/). -->

# <a name="known-issues"></a>Known Issues and Limitations

*   The Service and Agent panels of the DC/OS web interface won’t render over 5,000 tasks. If you have a service or agent with over 5,000 tasks, your browser may run slowly. If this happens, close the browser tab and reopen the DC/OS web interface.
*   IPv6 must be disabled for all nodes. For more information, see <a href="https://wiki.centos.org/FAQ/CentOS7#head-8984faf811faccca74c7bcdd74de7467f2fcd8ee" target="_blank">How Do I Disable IPv6</a>.
*   All DC/OS Master nodes must have resolvable hostnames, and the system resolver library must not do AAAA record lookups.
*   See additional known issues at <a href="https://support.mesosphere.com" target="_blank">support.mesosphere.com</a>.

 [1]: https://github.com/mesosphere/mesos-dns/releases/tag/v0.4.0
 [2]: https://github.com/mesosphere/marathon/releases/tag/v0.11.1
 [3]: https://github.com/mesosphere/marathon/releases/tag/v0.11.0
 [4]: https://github.com/mesos/chronos/releases/tag/2.4.0
 [5]: http://mesos.apache.org/blog/mesos-0-24-0-released/
 [6]: http://mesos.apache.org/blog/mesos-0-24-1-and-more-released/