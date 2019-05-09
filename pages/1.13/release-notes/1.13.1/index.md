---
layout: layout.pug
navigationTitle: Release notes for 1.13.1
title: Release notes for 1.13.1
menuWeight: 1
excerpt: Release notes for DC/OS 1.13.1, including Open Source attribution, and version policy.
---
DC/OS 1.13.1 was released on July 19, 2019.

[button color="light" href="https://downloads.dcos.io/dcos/stable/1.13.1/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="http://downloads.mesosphere.com/dcos-enterprise/stable/1.13.1/dcos_generate_config.ee.sh"]Download DC/OS Enterprise* [/button]

Registered DC/OS Enterprise customers can access the DC/OS Enterprise configuration file from the <a href="https://support.mesosphere.com/s/downloads">support website</a>. For new customers, contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and install DC/OS Enterprise.

# Release summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages–-such as Marathon and Metronome–-that are used in DC/OS.

If you have DC/OS deployed in a production environment, see [Known issues and limitations](#known-issues) to see if any potential operational changes for specific scenarios apply to your environment.
<!--
# New features and capabilities
DC/OS 1.13 includes new features and capabilities to enhance the installation and deployment experience, simplify cluster administration, increase operational productivity and efficiency, and provide additional monitoring, alerting, logging, and reporting for better visibility into cluster activity.

## Highlights of what's new
Some highlights for this release include:
- Unified service accounts and authentication architecture
- Monitoring and metrics for cluster operations
- Extended support for workloads that take advantage of accelerated processing provided by graphic processing units (GPU)
- Improvements to the Universal installer and the upgrade process
- New features and options for command-line programs
- New dashboard options for monitoring cluster performance
- Tighter integration between the Mesosphere Kubernetes Engine (MKE) and Edge-LB load balancing

Features and capabilities that are introduced in DC/OS 1.13 are grouped by functional area or component and include links to view additional documentation, if applicable.

## Unified service accounts and authentication architecture
The core of the DC/OS Enterprise identity and access management service (IAM) has been open-sourced and added to DC/OS, replacing DC/OS OpenAuth (`dcos-oauth`). This architectural change includes adding CockroachDB as the cluster high-availability database for identity and access management.

With this change, DC/OS also now supports unified service accounts. Service accounts allow individual programs and applications to interact with a DC/OS cluster using their own identity. A successful service account login results in authentication proof -- the DC/OS authentication token. A valid DC/OS authentication token is required to access DC/OS services and components through the master node Admin Router.

This change also aligns the authentication architectures between DC/OS Enterprise and DC/OS Open Source. The HTTP API for service account management ans service authentication is now the same for both DC/OS Enterprise and DC/OS Open Source. For both DC/OS Enterprise and DC/OS Open Source clusters, the DC/OS authentication token is a JSON Web Token (JWT) of type RS256. This JWT authentication token can be validated by any component in the system after consulting the IAM services JSON Web Key Set (JWKS) endpoint.

## Monitoring and metrics for cluster operations
This release extends DC/OS cluster monitoring capabilities and the metrics you can collect and report for DC/OS components. The enhancements to monitoring and metrics provide you with better visibility into cluster operations, activity, and performance through DC/OS itself and as input to Prometheus, Grafana, and other services.

### Monitoring service


## Command-line interface
- 

## Data services
- 

<!-- not in the 1.13 Docs in RN filter
- [Kubernetes] Edge-LB TLS/SNI Integration. <!-- (DCOS-47322)
<no content>
- Kubernetes Edge=LB Integration: TCP/HTTP <!--(DCOS-28246)
<no content>
- [Kubernetes] Multi-Kubernetes Regional Placement (DCOS-40924)
<already in release notes>
- [Kubernetes] MKE Documentation Improvements (DCOS-43921)
<already in release notes>
- [Kubernetes] Support Kubernetes 1.13 (DCOS-44175)
<already in release notes>
- [Kubernetes] DC/OS StorageClass for Kubernetes (DCOS-43801)
<already in release notes>
-->

<!-- not in the 1.13 Docs in RN filter
- Build an Ingress controller to provision Amazon ELBs for L4 traffic into Edge-LB (DCOS-46302)

    You can automatically provision Amazon ELB (NLB) using Edge-LB pool instances on your public and private agents. You can automatically provision the Network Load Balancer from a Kubernetes cluster as well. After you provision the Amazon Network Load Balancer, you can fetch the DNS metadata endpoint to access the service that is exposed through the Network Load Balancer.
-->

## GUI
- 

## Installation
- 

<!-- not in 1.13 Docs with RN filter
- Universal Installer to provision Elastic Block Store (EBS) volumes. (DCOS-47221)
    The Universal Installer provides the ability to provision Amazon Elastic Block Store (Amazon EBS) volumes and attach them to the private agents within a DC/OS cluster. For more information about deploying extra storage volumes, see [Provision Extra Agent Volumes](https://docs.mesosphere.com/services/beta-storage/0.5.3-beta/install/provision-extra-volumes/).
-->

## Job management and scheduling
- 

## Marathon
- 

## Mesos platform and containerization
- 

## Networking
- 
<!-- not in 1.13 Docs in RN filter
- Retention policies for dcos-monitoring data (DCOS-46818)
    The dcos-monitoring service in versions 0.4.3 and later provides the ability to adjust the retention period of the Prometheus time series database. For more information see: https://docs.mesosphere.com/services/beta-dcos-monitoring/0.4.3-beta/operations/prometheus/storage/
-->
<!-- not in 1.13 Docs in RN filter
- Display Grafana dashboards on unsupervised displays (DCOS-51133)
    The DC/OS monitoring service `dcos-monitoring` now enables Grafana dashboards to be displayed on read-only devices such as SmartTVs, kiosks or public panels.
-->

## Security
- 

## Storage
- 

# Issues fixed in this release
The issues that have been fixed in DC/OS 1.13.1 are grouped by feature, functional area, or component. Most change descriptions include one or more issue tracking identifiers enclosed in parenthesis for reference.

### Admin Router
- 

### Command-line interface (CLI)
- 

### Diagnostics and logging
- 

### GUI
- 

### Installation
- 

### Job management and scheduling
- 

### Metrics
-

### Networking
-

### Third-party updates and compatibility
- 

# Known issues and limitations
This section covers any known issues or limitations that don’t necessarily affect all customers, but might require changes to your environment to address specific scenarios. The issues are grouped by feature, functional area, or component. Where applicable, issue descriptions include one or more tracking identifiers enclosed in parenthesis for reference.

### 


# Updated components change lists
For access to the logs that track specific changes to components that are included in the DC/OS distribution, see the following links:
- Apache Mesos 1.8.0 [change log](https://github.com/apache/mesos/blob/d2a368363c6738d83c721e5c7eb5e1f2ebc9cb07/CHANGELOG).
- Marathon 1.8.x [change log](https://github.com/mesosphere/marathon/blob/b00f71136a7e35cb76c7df136d49b16b9ead2689/changelog.md).
- Metronome 0.6.18 [change log](https://github.com/dcos/metronome/blob/b4016b01a349b15df25970877bd62521a49d0cc9/changelog.md).
- DC/OS 1.13 [change log](https://github.com/dcos/dcos/blob/1.13/CHANGES.md).
<!--
- REX-Ray 0.11.4 [release information](https://github.com/rexray/rexray/releases/tag/v0.11.4).
- Telegraf 1.9.x [change log](https://github.com/influxdata/telegraf/blob/release-1.9/CHANGELOG.md).
- Erlang/OTP 21.3 [release information](http://erlang.org/download/otp_src_21.3.readme).
- Java 8 [release information](https://java.com/en/download/faq/release_changes.xml). -->

# Previous releases
To review changes from a recent previous release, see the following links:
- [Release version 1.10.11](/1.10/release-notes/1.10.11/) - 12 February 2019.
- [Release version 1.11.10](/1.11/release-notes/1.11.10/) - 12 February 2019.
- [Release version 1.12.3](/1.12/release-notes/1.12.3/) - 14 March 2019.
- [Release version 1.13.0](/1.13/release-notes/1.13.0/) - 8 May 2019.
