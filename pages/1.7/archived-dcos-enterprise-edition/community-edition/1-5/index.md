---
layout: layout.pug
title: DC/OS 1.5
menuWeight: 0
excerpt:
enterprise: true
featureMaturity:
---





The release notes provide a list of useful topics and links for Mesosphere DC/OS.

# <a name="mesos"></a>Mesos upgrade

*   The Apache Mesos kernel is now at [version 0.26.0][1]. 
    *   Mesos is now more stable than ever, with more than 80 bug fixes added!

# <a name="known-issues"></a>Known Issues and Limitations

*   See additional known issues at <a href="https://support.mesosphere.com" target="_blank">support.mesosphere.com</a>.

*   The Service and Agent panels of the DC/OS Web Interface won't render over 5,000 tasks. If you have a service or agent that has over 5,000 your browser may experience slowness. In this case you can close said browser tab and reopen the DC/OS web interface.

 [1]: https://git-wip-us.apache.org/repos/asf?p=mesos.git;a=blob_plain;f=CHANGELOG;hb=0.26.0