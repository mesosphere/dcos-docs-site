---
layout: layout.pug
navigationTitle:  Version support
title: Version support
menuWeight: 102
excerpt: Summarizes supported versions for Edge-LB
enterprise: true
---

# Edge-LB releases by DC/OS version

Edge-LB is released as an independent package on a regular schedule to provide updates and bug fixes optimized for working with DC/OS&trade; clusters. In general, you should always install the latest version of Edge-LB available that supports the DC/OS release you have deployed.

The following is a simplified version of the Edge-LB support and compatibility matrix for the most recent versions of DC/OS and Edge-LB:

| Edge-LB version | DC/OS Enterprise version |
|------------------|-------------------------|
| Edge-LB 1.5.1    | DC/OS 2.0.1             |
| Edge-LB 1.5.0    | DC/OS 2.0.0             |
| Edge-LB 1.4.0    | DC/OS 1.13.0            |
| Edge-LB 1.3.0    | DC/OS 1.12.2            |
| Edge-LB 1.3.0    | DC/OS 1.11.9            |
| Edge-LB 1.2.3    | DC/OS 1.10.10           |


# Features by version

For more complete and detailed information about DC/OS versions and compatibility requirements, see the DC/OS [version support policy](/mesosphere/dcos/2.0/release-notes/version-policy/) and [Certified packages and DC/OS versions](/mesosphere/dcos/2.0/release-notes/version-policy/#certified-packages-and-dcos-versions).

Edge-LB updates are listed by release date, with the most recent changes listed first. If a feature or enhancement is related to a reported issue or customer request, one or more issue tracking identifiers are included and enclosed in parentheses for reference.

|<b> Edge-LB feature description</b> | <b>Edge-LB version</b> | <b>Date</b> |
|-------------------------------| ----------------- | ----------- |
Expose task without pre-defined Apache&reg; Mesos&reg;-assigned ports | 1.3.0 | February 2019 |
Enable dynamic allocation of the HAProxy&reg; STATS port | 1.3.0 | February 2019 |
Enable dynamic allocation of the HAProxy Frontend port | 1.3.0 | February 2019 |
Scale down Edge-LB pool instances | 1.3.0 | February 2019 |
Edge-LB pool packages can be uniquely identified by a version naumber. | 1.2.0 | September 2018
Logging improvements capture more detailed information about Edge-LB operations and activity. | 1.2.0 | September 2018
