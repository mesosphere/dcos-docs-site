---
layout: layout.pug
title: DC/OS 1.1
menuWeight: 0
excerpt:
enterprise: true
featureMaturity:
---





The release notes provide a list of useful topics and links for Mesosphere DC/OS.

# What's New

DC/OS 1.1 contains the following components:

*   CoreOS [717.3.0][1] 
*   Mesos [0.22.1][2] 
*   Marathon [0.9.1][3]
*   Mesos-DNS [0.1.2][4]

# DC/OS Services

*   New node and service side panels allow you to troubleshoot individual tasks from within the DC/OS UI.
*   Significant updates to DC/OS Services: Kubernetes (1.0.3), Marathon (0.11.1), Chronos (2.4.0), HDFS (0.1.4), Spark (1.5.0). 

# Known Issues and Limitations

*   There are sporadic failures in deploying some DC/OS services (the fetcher seems to be killed partway through downloading resources). The exact cause is being investigated. Retrying a couple of times resolves the problem.
*   `MESOS_NATIVE_JAVA_LIBRARY` is not currently set on tasks launched with the Mesos Containerizer, but it should be. This generally doesn't affect tasks because the older, deprecated form, `MESOS_NATIVE_LIBRARY` is still set, and programs using libmesos will find that. See [MESOS-3751][5] for tracking.
*   See additional known issues at <a href="https://support.mesosphere.com" target="_blank">support.mesosphere.com</a>.

 [1]: https://coreos.com/releases/#717.3.0
 [2]: http://mesos.apache.org/blog/mesos-0-22-0-released
 [3]: https://github.com/mesosphere/marathon/releases/tag/v0.9.1
 [4]: https://github.com/mesosphere/mesos-dns/releases/tag/v0.1.2
 [5]: https://issues.apache.org/jira/browse/MESOS-3751