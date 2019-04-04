---
layout: layout.pug
navigationTitle: Release notes for 1.13.0 (Beta)
title: Release notes for 1.13.0 (Beta)
menuWeight: 15
beta: true
excerpt: Release notes for DC/OS 1.13.0 (Beta)
---
DC/OS 1.13.0 (Beta) was released on April 25, 2019.

[button color="purple" href="https://downloads.dcos.io/dcos/testing/1.13.0-beta1/commit/a55cf6cd18bea6961e2cc3c957ac8d0ee47583d5/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="light" href="https://downloads.mesosphere.io/dcos-enterprise/testing/1.13.0-beta1/commit/9d2ee649f1ddb90728757ea24d912189aaef9a52/dcos_generate_config.ee.sh"]Download DC/OS Enterprise[/button]

# Release summary
The DC/OS 1.13.0 (Beta) release is intended for testing and evaluation purposes. You should not deploy this release in a production environment or attempt to upgrade any cluster components using this version of the software. You should only use this Beta release to install new, non-production clusters.

You are encouraged to provide feedback on the new features and services at [support.mesosphere.com](https://support.mesosphere.com).

# New features and capabilities

DC/OS 1.13.0 (Beta) includes new features and capabilities to enhance the installation and deployment experience, simplify cluster administration, increase operational productivity and efficiency, and provide additional monitoring, alerting, logging, and reporting for better visibility into cluster activity.

Some highlights for this release include:
- Monitoring and metrics for cluster operations
- Improvements to the Universal installer and upgrade process
- New features and options for command-programs
- New dashboard options for monitoring cluster performance
- Tighter integration between the Mesosphere Kubernetes Engine (MKE) and Edge-LB load balancing

## Monitoring and metrics for cluster operations
- The DC/OS monitoring service (`dcos-monitoring`) uses DC/OS storage service (DSS) volumes to store time-series data. <!--(DCOS-47725)-->

    With this release, you can store the information collected by the DC/OS monitoring service (`dcos-monitoring`, version 0.4.3) in the profile-based storage provided by the DC/OS Storage Service. By using the DC/OS Storage Service to store the monitoring data used in Prometheus queries and Grafana dashboards, you can improve the performance and reliability of the Prometheus and Grafana monitoring components.

    When you install the DC/OS monitoring service, you can select the volume size and a volume profile for the file system where you want to storing the Prometheus time-series database (`tsdb`). By specifying a volume managed by the DC/OS Storage Service, you can take advantage of the durability, performance, and flexibility DSS provides for your collected data. 
    
    For more information about working with the DC/OS monitoring service, see [DC/OS Monitoring Service](/services/beta-dcos-monitoring/0.4.3-beta/). For more information about using the DC/OS storage service, see [DC/OS Storage Service](/services/beta-storage/0.5.3-beta/).

- New volume and network metrics <!--(DCOS-47722)-->

    The metrics collection service, dcos-telegraf can now collect additional metrics for Mesos volumes and network information. For a complete list of the Mesos metrics you can collect and report, see the latest list of metrics provided here: http://mesos.apache.org/documentation/latest/monitoring/.

- Key metrics are collected by default <!--(DCOS-47719)-->

    In DC/OS 1.13, dcos-telegraf automatically collects Mesos metrics by default. Previously, you were required to manually enable the metrics plug-in by updating the agent configuration or by setting the `enable_mesos_input_plugin` parameter in the `config.yaml` file to `true`.  With this release, manually enabling this feature is no longer required. Instead, the default value for the parameter is now set to true. You can set the `enable_mesos_input_plugin` parameter in the `config.yaml` file to false if you want to disable the automatic collection of Mesos metrics.

- The DC/OS monitoring service enables you to mport curated alerting rules <!--(DCOS-47666)-->

    With this release, deploying the DC/OS monitoring service enables you to import Mesosphere-provided Prometheus Alert Rules from a github repository. These predefined alert rules enable you to create meaningful alerts concerning the condition of the DC/OS cluster, including successful or failed operations and node activity. Repo is located here: https://github.com/dcos/prometheus-alert-rules

    Prometheus alert rules are automatically included as part of the DC/OS monitoring service. Each DC/OS component or framework available for monitoring should have a single rule file that contains all its alert rules. These alert rules are passed to Prometheus using the `rule_files` configuration parameter and are configured to specify one of the following severity levels:
    - **Warning** alerts identify issues that require notification, but do not require immediate action. For example, an alert identified as a warning might send email notification to an administrator but not require an immediate response.
    - **Critical** alerts identify issues that require immediate attention. For example, a critical alert might trigger a pager notification to signal that immediate action is required.

- Create Curated Dashboard Collection for installation by customers in existing Prometheus/Grafana (DCOS-44740)
Operators deploying dcos-monitoring can now leverage Mesosphere provided Grafana dashboards.  These dashboards can be automatically retrieved by the dcos-monitoring service and enable the operator to quickly get up to speed in visualizing the metrics that the dcos-monitoring package is collecting from the cluster and its' hosted applications.  Dashboard repository is located here: https://github.com/dcos/grafana-dashboards

<!-- not in the 1.13 Docs in RN filter
- Standardized log collection and forwarding via fluentbit (DCOS-43412)
Application and DC/OS cluster component logs are now aggregated and Operators can configure forwarding to a third party log storage, search and reporting application. Previously, Operators had to install 3rd party Agents on cluster nodes to perform this task. With the introduction of support for fluent bit, Operators can now leverage easy to configure plugins to perform log filtering and forwarding to a log collection, search and reporting system.
-->

- Deprecate and remove the DC/OS history service <!--(DCOS-50304)-->
In DC/OS 1.13, the  DC/OS history service has transitioned into the **retired** state. The history service is scheduled to be decommissioned in DC/OS 1.14. You can find the definitions for each of the feature maturity states documented in the [Mesosphere DC/OS Feature Maturity Lifecycle](/1.13/overview/feature-maturity/).

## Command-line interface
- Easily obtainable Public-IP of the public agents through DC/OS CLI (DCOS-44697)
Operators can now obtain the public IP address of a public agent by running the command {{dcos node list}}.

- Auto Install Enterprise CLI (DCOS-39775)
For customers running DC/OS Enterprise Edition, the Enterprise CLI is now automatically installed when the non-Enteprise CLI is installed.

- Basic Tab Completion (DCOS-39774)
Operators can now use "tab completion" to assist with quickly executing DC/OS commands.

- Dynamic auto-complete for dcos cluster attach / remove (DCOS-47214)
Operators can now hit "tab" for the commands {{dcos cluster attach}} and {{dcos cluster remove}} to auto-fill in or auto-complete the possible clusters for this command.

- CLI support for macOS using Homebrew <!--(DCOS-47562)-->

    Homebrew is a software package management program you can use to install and configure packages for computers running macOS or Linus operating systems. With this release, you can install the DC/OS command-line interface (CLI) packages using the Mac OSX `homebrew` utility. Previously, you were required to download all DC/OS CLI plug-ins directly from the DC/OS cluster. By adding support for the Homebrew package manager, operators and developers can keep their CLI packages up-to-date using the `brew` command. For example, you can update the core CLI package by running the following command:

    ```bash
    brew install dcos-cli
    ```
    
    For more information about installing and using Homebrew, see https://brew.sh/ or the GitHub repository https://github.com/Homebrew/brew.

## Data services
- [Kubernetes] Edge-LB TLS/SNI Integration (DCOS-47322)
<no content>
- Add Unique version number to Edge-LB Pool package (DCOS-40527)

You can find the version number of the Edge-LB pool packages. Using the version number, you can check to see if the pool version and the Edge-LB API server version matches. The Edge-LB API server and the pool package version should always match. For example, if the pool package is v1.3.0, the API server version should be v1.3.0 as well.

<!-- not in the 1.13 Docs in RN filter
- [Kubernetes] Multi-Kubernetes Regional Placement (DCOS-40924)
<already in release notes>
- [Kubernetes] MKE Documentation Improvements (DCOS-43921)
<already in release notes>
- [Kubernetes] Support Kubernetes 1.13 (DCOS-44175)
<already in release notes>
- [Kubernetes] DC/OS StorageClass for Kubernetes (DCOS-43801)
<already in release notes>
-->

- Edge-LB scale down <!--(DCOS-28440)-->

    You can scale down the Edge-LB pool instances from a higher count to lower if you don't require all pool instances that are configured. To scale down, simply update the `count` variable in the Edge-LB pool configuration file to reflect scaled down Edge-LB pool instances. 

<!-- not in the 1.13 Docs in RN filter 
- Build an Ingress controller to provision Amazon ELBs for L4 traffic into Edge-LB (DCOS-46302)
You can automatically provision Amazon ELB (NLB) using Edge-LB pool instances on your public and private agents. You can automatically provision the NLB from a Kubernetes cluster as well. After the NLB is provisioned, you can fetch the DNS metadata endpoint to access the service that is exposed through the NLB.
-->

- [Kubernetes] Kubernetes EdgeLB Integration: TCP/HTTP (DCOS-28246)
<no content>

- [Kubernetes] Edge-LB TLS/SNI Integration (DCOS-47322)
<no content>

## GUI
- Independent Upgrade of DC/OS UI (DCOS-47632)

    Customers will now be able to get and updated version of the DC/OS GUI without having to upgrade DC/OS.  New Updates in DC/OS will be published to the DC/OS catalog and will also be available as .dcos file for our on-premise customers. This will allow our customers to easily get the latest fixes and capabilities in our GUI. Customers will  also be able to roll back to the original GUI version that was shipped with their version of DC/OS if they need to.

- Accurate Service Status (Part 1: Plan Tab) (DCOS-43460)

    DC/OS 1.13 GUI now includes a new tab in the details section of every SDK based services. With this new tab, Operator will have a clear indication of the status and progress of sdk-services during its lifecycle such as installing, upgrade. Customers can have a details about the specific plans running or just finished up to the execution of each task so that they can easily track the progress among those plans

## Installation
- Multi-Region Support on Universal Installer (DCOS-45727)

    Multi-region deployments enable higher availability for DC/OS clusters and is a crucial item to have for customers that are wanting to achieve uptime without being susceptible for regional outages.

- Dynamic Masters on Universal Installer (DCOS-45725)

    Dynamic masters is the ability to create, destroy and recover master nodes. This enables users on the Universal Installer to be able to downscale or upscale their clusters from not just the agent nodes (which is currently supported), but also from the master nodes as well - if they deem necessary.

- Universal Installer & on-premise DC/OS lifecycle management w/Ansible (DCOS-45724)

    dcos-ansible is a Mesosphere provided and supported ansible roles for installing and upgrading Mesosphere DC/OS and DC/OS Enterprise on any user provided infrastructure.

<!-- not in 1.13 Docs with RN filter 
- Universal Installer to provision EBS volumes (DCOS-47221)
The Universal Installer now provides the ability to provision AWS EBS volumes and attach them to the Private Agents within a cluster.

Documented here: https://docs.mesosphere.com/services/beta-storage/0.5.3-beta/install/provision-extra-volumes/
-->

## Metrics
- [dcos-telegraf] Instrument and Transmit telegraf Metrics to via telegraf (DCOS-39012)

    dcos-telegraf collects and forwards metrics about itself for storage and reporting via dcos-monitoring or third party monitoring services.

## Networking
- Easily obtainable Public-IP of the public agents through DC/OS Net API endpoint (DCOS-28127)

## Platform
- Update Rexray to support NVMe EBS volumes (DCOS-50047)

    In DC/OS 1.13.0, REX-ray support has been updated to include EBS NVMe volumes.

- [UI] Internationalization I18N & L10N (Chinese) (DCOS-39557)

    Mesosphere DC/OS 1.13 GUI has now been translated to Mandarin Chinese. Our Mandarin-speaking customers and users can now easily switch the GUI language in the UI and will be able to interact with DC/OS operations and functions. Our documentation has also been translated to Chinese to support those customers. Support for additional languages can be provided if there's sufficient customer demand.

<!-- not in 1.13 Docs in RN filter 
- Retention policies for dcos-monitoring data (DCOS-46818)
The dcos-monitoring service in versions 0.4.3 and later provides the ability to adjust the retention period of the Prometheus time series database. For more information see: https://docs.mesosphere.com/services/beta-dcos-monitoring/0.4.3-beta/operations/prometheus/storage/
-->
<!-- not in 1.13 Docs in RN filter 
- UCR to support Schema2_v2 formatted docker images (DCOS-43871)
Universal Container Runtime (UCR) now fully supports Docker Image format v2_schema2 in addition to supporting v2_schema1
-->
<!-- not in 1.13 Docs in RN filter 
- Display Grafana dashboards on unsupervised displays (DCOS-51133)
dcos-monitoring now enables Grafana dashboards to be displayed on read-only devices such as SmartTVs, kiosks or public panels.
-->

## Service automation
[Marathon] Support seccomp `unconfined` whitelisting in ContainerInfo.LinuxInfo.SeccompInfo (DCOS-49134)
<no RN content>

## Storage
- AWS EBS CSI Driver for MKE to enable MKE users to deploy stateful applications in AWS (DCOS-44789)
<already in release notes>

[enterprise]
## Security
[/enterprise]
- [Security] Unify AuthN architecture across OSS and Enterprise (OSS Service Accounts) (DCOS-28672)
Unified Service accounts across DC/OS and Enterprise DC/OS enabling broader set of packages to leverage service accounts that are required when running in Enterprise DC/OS 'strict' mode.

[enterprise]
## 
[/enterprise]
- 

# Issues fixed in this release 
- 
- 

# Known issues and limitations
- Mesos endpoints with the <code>.json</code> suffix are deprecated and should not be used in DC/OS 1.13.</p>

- The following `dcos_generate_config.sh` command-line options have been deprecated and decommissioned:
    * `--set-superuser-password`
    * `--offline`
    * `--cli-telemetry-disabled`
    * `--validate`
    * `--preflight`
    * `--install-prereqs`
    * `--deploy`
    * `--post-flight`

    If you have scripts or programs that use any of the deprecated options, you should update them.

