---
layout: layout.pug
navigationTitle: Release notes for 1.13.0 (Beta)
title: Release notes for 1.13.0 (Beta)
menuWeight: 1
beta: true
excerpt: Release notes for DC/OS 1.13 (Beta), including Open Source attribution and version policy.
---
DC/OS 1.13.0 (Beta) was released on April 15, 2019.

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
- The DC/OS monitoring service (`dcos-monitoring`) can be configured to use DC/OS storage service (DSS) volumes to store time-series data. <!--(DCOS-47725)-->

    With this release, you can store the information collected by the DC/OS monitoring service (`dcos-monitoring`) in the profile-based storage provided by the DC/OS Storage Service. By using the DC/OS Storage Service to store the monitoring data used in Prometheus queries and Grafana dashboards, you can improve the performance and reliability of the Prometheus and Grafana monitoring components.

    When you install the DC/OS monitoring service, you can select the volume size and a volume profile for the file system where you want to storing the Prometheus time-series database (`tsdb`). By specifying a volume managed by the DC/OS Storage Service, you can take advantage of the durability, performance, and flexibility DSS provides for your collected data. 
    
    For more information about working with the DC/OS monitoring service, see [DC/OS Monitoring Service](/services/beta-dcos-monitoring/). For more information about using the DC/OS storage service, see [DC/OS Storage Service](/services/beta-storage/0.5.3-beta/).

- New volume and network metrics are available. <!--(DCOS-47722)-->

    The metrics collection service, dcos-telegraf can now collect additional metrics for Mesos volumes and network information. For a complete list of the Mesos metrics you can collect and report, see the latest list of metrics provided here: http://mesos.apache.org/documentation/latest/monitoring/.

        For more information about collecting metrics and configuring metrics plugins, see the following topics:
    - [Metrics Plugin Architecture](/1.13/metrics/architecture/)
    - [Mesos Metrics](/1.13/metrics/mesos/)
    - [Configuration Reference](/1.13/installing/production/advanced-configuration/configuration-reference/)

- Key metrics are collected by default. <!--(DCOS-47719)-->

    In DC/OS 1.13, dcos-telegraf automatically collects Mesos metrics by default. Previously, you were required to manually enable the metrics plug-in by updating the agent configuration or by setting the `enable_mesos_input_plugin` parameter in the `config.yaml` file to `true`.  With this release, manually enabling this feature is no longer required. Instead, the default value for the parameter is now set to true. You can set the `enable_mesos_input_plugin` parameter in the `config.yaml` file to false if you want to disable the automatic collection of Mesos metrics.

    For more information about collecting metrics and configuring metrics plugins, see the following topics:
    - [Metrics Plugin Architecture](/1.13/metrics/architecture/)
    - [Mesos Metrics](/1.13/metrics/mesos/)
    - [Configuration Reference](/1.13/installing/production/advanced-configuration/configuration-reference/)

- The DC/OS monitoring service enables you to import curated alerting rules. <!--(DCOS-47666)-->

    With this release, deploying the DC/OS monitoring service enables you to import Mesosphere-provided Prometheus Alert Rules from a [github repository](https://github.com/dcos/prometheus-alert-rules). These predefined alert rules enable you to create meaningful alerts concerning the condition of the DC/OS cluster, including successful or failed operations and node activity.

    Prometheus alert rules are automatically included as part of the DC/OS monitoring service. Each DC/OS component or framework available for monitoring should have a single rule file that contains all its alert rules. These alert rules are passed to Prometheus using the `rule_files` configuration parameter and are configured to specify one of the following severity levels:
    - **Warning** alerts identify issues that require notification, but do not require immediate action. For example, an alert identified as a warning might send email notification to an administrator but not require an immediate response.
    - **Critical** alerts identify issues that require immediate attention. For example, a critical alert might trigger a pager notification to signal that immediate action is required.

- Automatically create a curated collection of Prometheus-driven Grafana dashboards for DC/OS. <!--(DCOS-44740)-->

    If you deploy DC/OS monitoring, you can leverage Mesosphere-provided Grafana-based dashboards. By installing and configuring the `dcos-monitoring` service, you can automatically create dashboards that enable you to quickly visualize the metrics that the dcos-monitoring package is collecting from the DC/OS cluster and DC/OS-hosted applications. For more information about using Grafana dashboards, see the [dashboard repository](https://github.com/dcos/grafana-dashboards).

- Instrument and transmit metrics that track the health and performance of the DC/OS Telegraf plugin <!--(DCOS-39012)-->

    DC/OS metrics are collected and managed through the Telegraf service. Telegraf provides an agent-based service that runs on each master and agent node in a DC/OS cluster. By default, Telegraf gathers metrics from all of the processes running on the same node, processes them, then sends the collected information to a central metrics database. With this release, the `dcos-telegraf` program collects and forwards information about the operation and performance of the telegraf process itself. This information is stored along with other metrics and available for reporting using the DC/OS monitoring service or third-party monitoring services. For information about the Telegraf plugin and the metrics that Telegraf collects about its own performance, see the documentation for the [Internal input plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/internal).

<!-- not in the 1.13 Docs in RN filter-->
- Standardized log collection and forwarding through Fluent Bit <!--(DCOS-43412)-->

    Application and DC/OS cluster component logs are now aggregated, enabling you to configure forwarding to a third-party log storage, search, and reporting services. Previously, forwarding logged information required you to install third-party agents or aggregator services on cluster nodes to perform this task. With the introduction of support for Fluent Bit--a cloud-native, multi-platform log processor and forwarder--you can now leverage easy-to-configure plugins to perform log filtering and forwarding to a log collection, search, and reporting services.

    <!--For more information about how to configure logging to integrate with Fluent Bit, see [XX]().-->

## Command-line interface
- Identify the public-facing IP address for public agent nodes through DC/OS CLI. <!--(DCOS-44697)-->

    With this release, you can retrieve the public-facing IP addresses for the nodes in a cluster by running the `dcos node list` command. For more information about using the new command for retrieving public IP addresses, see the [dcos node](/1.13/cli/command-reference/dcos-node/) command reference.

    You can look up the public agent IP address using the DC/OS web-based console, command-line interface, or API calls for DC/OS cluster nodes if DC/OS is deployed on a **public cloud provider** such as AWS, Google Cloud, or Azure. If DC/OS is installed on an internal network (on-premise) or a private cloud, nodes do not typically have separate public and private IP addresses. For nodes on an internal network or private cloud, the public IP address is most often the same as the IP address defined for the server in the DNS namespace.

- Automatically install the DC/OS Enterprise command-line interface (CLI). <!--(DCOS-39775)-->

    If you have deployed a DC/OS Enterprise cluster, you can now automatically install the DC/OS Enterprise CLI when you install the base CLI package. Previously, the DC/OS Enterprise CLI could only be installed manually after the successful installation of the base DC/OS CLI.

    For more information about installing the command-line interface (CLI) and CLI plugins, see [Installing the CLI](/1.13/cli/install) and [Installing the DC/OS Enterprise CLI](/1.13/cli/enterprise-cli/).

- Basic auto-completion using the TAB key. <!--(DCOS-39774)-->

    You can now use the TAB key to provide automatic completion when typing DC/OS commands. Auto-completion enables you to execute commands in a shell terminal more quickly by attempting to predict the rest of a command or subcommand you are typing. If the suggested text matches the command you intended, you can press the TAB key to accept the suggestion and execute the command.

    For more information about using auto-completion when you are working with the command-line interface (CLI) and CLI plugins, see [Enabling autocompletion for the CLI](/1.13/cli/autocompletion/).

- Dynamic auto-completion of cluster names for `dcos cluster attach` and `dcos cluster remove` commands.<!--(DCOS-47214)-->

    You can now use the TAB key to provide automatic completion for potential cluster names when you run the `dcos cluster attach` or `dcos cluster remove` commands.

    For more information about using auto-completion when you are working with the command-line interface (CLI) and CLI plugins, see [Enabling autocompletion for the CLI](/1.13/cli/autocompletion/).

- CLI support for macOS using Homebrew. <!--(DCOS-47562)-->

    Homebrew is a software package management program you can use to install and configure packages for computers running macOS or Linus operating systems. With this release, you can install the DC/OS command-line interface (CLI) packages using the Mac OSX `homebrew` utility. Previously, you were required to download all DC/OS CLI plug-ins directly from the DC/OS cluster. By adding support for the Homebrew package manager, operators and developers can keep their CLI packages up-to-date using the `brew` command. For example, you can install the core CLI package by running the following command:

    ```bash
    brew install dcos-cli
    ```
    
    For more information about installing and using Homebrew, see the [Homebrew website](https://brew.sh/) or the [GitHub repository](https://github.com/Homebrew/brew).

## Data services
- Add a unique version number to Edge-LB pool packages. <!--(DCOS-40527)-->

    You can run a command to return the version number for the Edge-LB pool package you have installed. Using the version number returned by the `edgelb version` command, you can verify whether the Edge-LB pool and the Edge-LB API server versions match. The Edge-LB API server and the Edge-LB pool version numbers should always match. For example, if you have the Edge-LB pool package version v1.3.0 installed, the API server version should be v1.3.0 as well.

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

- Enable Edge-LB pool instances to be scaled up or down. <!--(DCOS-28440)-->

    You can scale down the Edge-LB pool instances from a higher count to lower if you don't require all pool instances that are configured. To scale down, simply update the `count` variable in the Edge-LB pool configuration file to reflect scaled down Edge-LB pool instances. 

<!-- not in the 1.13 Docs in RN filter 
- Build an Ingress controller to provision Amazon ELBs for L4 traffic into Edge-LB (DCOS-46302)
You can automatically provision Amazon ELB (NLB) using Edge-LB pool instances on your public and private agents. You can automatically provision the NLB from a Kubernetes cluster as well. After the NLB is provisioned, you can fetch the DNS metadata endpoint to access the service that is exposed through the NLB.
-->

## GUI
- Support for independent upgrade of the DC/OS GUI. <!--(DCOS-47632)-->

    You can now install and update the DC/OS GUI without having to upgrade the DC/OS cluster. This feature enables new updates for DC/OS to be published to the DC/OS catalog and also be available as `.dcos` files for on-premise customers. The ability to install and update the DC/OS GUI without upgrading the DC/OS cluster enables you to easily get the latest fixes and capabilities available in the DC/OS GUI without affecting cluster operations. You also now have the ability to roll back an update, enabling you to use the DC/OS GUI version that was originally shipped with your version of DC/OS if you need to.
    <!--
    For more information about installing or updating the DC/OS GUI independent of changes to other components of the DC/OS deployment, see [XX](). -->

- Accurate status information for services. <!--(DCOS-43460)-->

    DC/OS 1.13 GUI now includes a new tab in the Details section of every SDK-based data service. This new tab provides a clear indication of the status and progress of SDK-based services during the service life cycle, including installation and upgrade activity. From the Details tab, you can see information about the specific operational plans that are currently running or have just completed. You can also view the execution of each task so that you can easily track the progress of the plans you have deployed.
    <!--
    For more information about viewing up-to-date status information for services and operational plans, see [XX]().-->

- Identify the public-facing IP address for public agent nodes in the DC/OS GUI. <!--(DCOS-49987)-->

    With this release, you can view the public-facing IP addresses for agent nodes in the DC/OS GUI. Previously, retrieving the public IP address for a node required writing a custom query. For more information about viewing public IP addresses in the DC/OS GUI, see the [Finding the public IP address](/1.13/administering-clusters/locate-public-agent/).

    You can look up the public agent IP address using the DC/OS web-based console, command-line interface, or API calls for DC/OS cluster nodes if DC/OS is deployed on a public cloud provider such as AWS, Google Cloud, or Azure. If DC/OS is installed on an internal network (on-premise) or a private cloud, nodes do not typically have separate public and private IP addresses. For nodes on an internal network or private cloud, the public IP address is most often the same as the IP address defined for the server in the DNS namespace.

- Add support for internationalization and localization (I18N and L10N - Chinese). <!--(DCOS-39557)-->

    Mesosphere DC/OS 1.13 GUI has now been translated to Mandarin Chinese. Mandarin-speaking customers and users can now easily switch the GUI language in the UI and will be able to interact with DC/OS operations and functions in English or Chinese. The DC/OS documentation has also been translated to Chinese to support those customers. Support for additional languages can be provided if there's sufficient customer demand.

    <!--For information about changing the language displayed, see [XX]().-->

## Installation
- Multi-region support using the Universal Installer. <!--(DCOS-45727)-->

    Multi-region deployments enable higher availability for DC/OS clusters and is a crucial item to have for customers that want to achieve uptime without being susceptible to regional outages.

- Dynamic masters on the Universal Installer. <!--(DCOS-45725)-->

    Dynamic masters enable you to create, destroy, and recover master nodes. With this feature, you can use the Universal Installer to downscale or upscale your DC/OS clusters from not just the agent nodes (which is currently supported), but also from the master nodes--if you deem it necessary to do so.

- Enable Universal Installer and on-premise DC/OS life cycle management with Ansible. <!--(DCOS-45724)-->

    The DC/OS Ansible (dcos-ansible) component is a Mesosphere-provided version of the Ansible open-source provisioning, configuration management, and deployment tool that enables you to use supported Ansible roles for installing and upgrading DC/OS OSS and DC/OS Enterprise clusters on the infrastructure you choose.

<!-- not in 1.13 Docs with RN filter 
- Universal Installer to provision EBS volumes (DCOS-47221)
The Universal Installer now provides the ability to provision AWS EBS volumes and attach them to the private agents within a cluster.

Documented here: https://docs.mesosphere.com/services/beta-storage/0.5.3-beta/install/provision-extra-volumes/
-->
## Mesos platform and containerization
- UCR to support Schema2_v2 formatted docker images <!--(DCOS-43871)-->

    DC/OS Universal Container Runtime (UCR) now fully supports Docker images that are formatted using the Docker v2_schema2 specification. DC/OS Universal Container Runtime (UCR) also continues to support Docker images that use the v2_schema1 format.

- Add a communication heartbeat to improve resiliency

    DC/OS clusters now include executor and agent communication channel heartbeats to ensure platform resiliency even if `IPFilter` is enabled with `conntrack`, which usually times out a connection every five days.

- DC/OS supports for zero-downtime for tasks through layer-4 load balancing

    DC/OS cluster health checks now provide task-readiness information. This information enables zero-downtime for load balancing when services are scaled out. With this feature, load balanced traffic is not redirected to containers before the container health check returns a 'ready' status.

## Networking
- Add a new networking API endpoint to retrieve the public-facing IP address for public agent nodes. <!--(DCOS-28127)-->

    This release introduces a new API endpoint for accessing public-facing IP addresses for the nodes in a cluster. For more information about retrieving and viewing public IP addresses, see [Finding the public IP address](/1.13/administering-clusters/locate-public-agent/).
    
    You can look up the public agent IP address using the DC/OS web-based console, command-line interface, or API calls for DC/OS cluster nodes if DC/OS is deployed on a public cloud provider such as AWS, Google Cloud, or Azure. If DC/OS is installed on an internal network (on-premise) or a private cloud, nodes do not typically have separate public and private IP addresses. For nodes on an internal network or private cloud, the public IP address is most often the same as the IP address defined for the server in the DNS namespace.

<!-- not in 1.13 Docs in RN filter 
- Retention policies for dcos-monitoring data (DCOS-46818)
The dcos-monitoring service in versions 0.4.3 and later provides the ability to adjust the retention period of the Prometheus time series database. For more information see: https://docs.mesosphere.com/services/beta-dcos-monitoring/0.4.3-beta/operations/prometheus/storage/
-->

<!-- not in 1.13 Docs in RN filter 
- Display Grafana dashboards on unsupervised displays (DCOS-51133)
dcos-monitoring now enables Grafana dashboards to be displayed on read-only devices such as SmartTVs, kiosks or public panels.
-->
[enterprise]
## Security
[/enterprise]
- Extend the DC/OS authentication architecture to apply to both DC/OS Open Source (OSS) and DC/OS Enterprise clusters. <!--(DCOS-28672)-->

    You can now create unified service accounts that can be used across DC/OS OSS and DC/OS Enterprise clusters. By extending support for service accounts that can be used for all DC/OS clusters, you have the option to install, configure, and manage additional packages, including packages that require a service account when you are running DC/OS Enterprise DC/OS in `strict` mode.

    For more information about authentication and managing accounts, see [User account management](/1.13/security/oss/user-account-management/).

- Support secure computing mode (seccomp) profiles. <!--(DCS-28442, DCOS-49134)-->

    Secure computing mode (`seccomp`) is a feature provided by the Linux kernel. You can use secure computing mode to restrict the actions allowed within a container. You can enable secure computing mode for Docker containers and Universal Runtime Containers (URC) if the operating system you are using supports it.

    WIth DC/OS, you can use a `seccomp` profile to deny access to specific system calls by default. The profile defines a default action and the rules for overriding that default action for specific system calls. 

    Using a secure computing mode profile is an important option if you need to secure access to containers and operations using the principle of least privilege. 

## Storage
- Update Beta Rex-Ray to support NVMe EBS volumes. <!--(DCOS-50047)-->

    REX-Ray is a container storage orchestration engine that enables persistence for cloud-native workloads. With Rex-Ray, you can manage native Docker Volume Driver operations through a command-line interface (CLI).

    Amazon Elastic Block Store (Amazon EBS) provides block-level storage volumes for Amazon Elastic Cloud (EC2) instances. Amazon EBS volumes can be attached to any running EC2 instance hosted in the same Amazon availability zone to provide persistent storage that is independent of the deployed instance. EBS storage volumes can be exposed using NVMe (non-volatile memory express) as a host controller interface and storage protocol. NVMe devices enable you to accelerate the transfer of data between nodes and solid-state drives (SSDs) over a computer's connection gateway.

    With this release, DC/OS updates REX-Ray to support NVMe storage when the DC/OS cluster runs on an Amazon instance. To work with NVMe devices, however, you must provide your own `udev` rules and  `nvme-cli` package. For more information about using Rex-Ray, see the [REX-Ray](https://rexray.io/) website and [github repository](https://github.com/rexray).

- Provide a driver that enables AWS Elastic Block Store (EBS) volumes for the Mesosphere Kubernetes Engine (MKE). <!--(DCOS-44789)-->

    You can use the AWS EBS Container Storage Interface (CSI) driver to manage storage volumes for the Mesosphere Kubernetes Engine (MKE). This driver enables MKE users to deploy stateful applications running in a DC/OS cluster on an AWS cloud instance.

# Issues fixed in this release
The issues that have been fixed in DC/OS 1.13 are grouped by feature, functional area, or component. Most change descriptions include one or more issue tracking identifiers enclosed in parenthesis for reference.
<!-- RAW input from https://github.com/dcos/dcos/blob/master/CHANGES.md -->

<!-- RAW input from https://github.com/dcos/dcos/blob/master/CHANGES.md -->

- Job scheduling (Metronome) has been improved to handle the restart policy when a job fails. If a job fails to run, restarting the task should depend on the setting you have defined for the ON_FAILURE result (DCOS_OSS-4636).

- Prefix illegal Prometheus metric names with an underscore (DCOS_OSS-4899).

- Fix an issue that cause `dcos-net-setup.py` to fail when the `systemd` network directory did not exist (DCOS-49711).

- Update support for REX-Ray to the most recent stable version (DCOS_OSS-4316,COPS-3961).

- Upgrade the version of the Telegraf metrics plugin supported to leverage recent bug fixes and feature improvements (DCOS_OSS-4675).

- Add SELinux details to the DC/OS diagnostics bundle to provide additional information for troubleshooting and analysis (DCOS_OSS-4123).

- Add external Mesos master and agent logs in the diagnostic bundle to provide additional information for troubleshooting and analysis (DCOS_OSS-4283).

- Update the supported version of Java to 8u192 to address known critical and high security vulnerabilities (DCOS-43938, DCOS_OSS-4380).

- Add logging for Docker-GC to the `journald` system logging facility (COPS-4044).

- Allow the DC/OS installer to be used when there is a space in its path (DCOS_OSS-4429).

- Enable Admin Router to log information to a non-blocking socket (DCOS-43956).

- Add path-based routing to AR to support routing of requests to the DC/OS networking (`dcos-net`) component (DCOS_OSS-1837).

- Mark the dcos6 overlay network as disabled if the `enable_ipv6` parameter is set to false (DCOS-40539).

- Fix the CLI task metrics summary command which was occasionally failing to find metrics (DCOS_OSS-4679).

- Improve error messages returned if Docker is not running at start of a DC/OS installation (DCOS-15890).

- Stop requiring the `ssh_user` attribute to be set in the `config.yaml` file when using parts of the deprecated CLI installer (DCOS_OSS-4613).

- Add a warning to the installer to let the user know if case kernel modules required by the DC/OS storage service (DSS) are not loaded (DCOS-49088).

- Enable ipv6 support for layer-4 load balancing (l4lb) by default (DCOS_OSS-1993).

- Upgrade the support for the Erlang/OTP framework to Erlang/OTP version 21.3 (DCOS_OSS-4902).

- Fix a race condition in the layer-4 load balancing (l4lb) network component (DCOS_OSS-4939).

- Fix IPv6 VIP support in the layer-4 load balancing (l4lb) network component (DCOS-50427).

- Change the default value for DC/OS UI X-Frame-Options from SAMEORIGIN to DENY. This setting is also now configurable using the `adminrouter_x_frame_options` configuration parameter (DCOS-49594).

# Known issues and limitations
This section covers any known issues or limitations that don’t necessarily affect all customers, but might require changes to your environment to address specific scenarios. The issues are grouped by feature, functional area, or component. Where applicable, issue descriptions include one or more tracking identifiers enclosed in parenthesis for reference.

### Deprecated or decommissioned features
- In DC/OS 1.13, the DC/OS history service has transitioned into the retired state. The history service is scheduled to be decommissioned in DC/OS 1.14. You can find the definitions for each of the feature maturity states documented in the [Mesosphere DC/OS Feature Maturity Lifecycle](/1.13/overview/feature-maturity/).

- Mesos endpoints with the <code>.json</code> suffix are deprecated and should not be used in DC/OS 1.13.

- Some of the configuration parameters previously used to install DC/OS cluster components are no longer vallid. The following `dcos_generate_config.sh` command-line options have been deprecated and decommissioned:
    * `--set-superuser-password`
    * `--offline`
    * `--cli-telemetry-disabled`
    * `--validate`
    * `--preflight`
    * `--install-prereqs`
    * `--deploy`
    * `--post-flight`

    If you have scripts or programs that use any of the deprecated options, you should update them (DCOS-50263).

# Updated components change lists
For access to the logs that track specific changes to components that are included in the DC/OS distribution, see the following links:
- Apache Mesos 1.7.3 [change log](https://github.com/apache/mesos/blob/0c503b01d3a9428ec9db35d09da5e237d737c570/CHANGELOG).
- Marathon 1.7.203 [change log](https://github.com/mesosphere/marathon/blob/b00f71136a7e35cb76c7df136d49b16b9ead2689/changelog.md).
- Metronome 0.5.71 [change log](https://github.com/dcos/metronome/blob/90557686a08d97ef6bb7e55ac9c3a48d72e2a53d/changelog.md).
- DC/OS 1.13 [change log](https://github.com/dcos/dcos/blob/master/CHANGES.md).
- REX-Ray 0.11.4 [release information](https://github.com/rexray/rexray/releases).
- Telegraf 1.9.x [change log](https://github.com/influxdata/telegraf/blob/master/CHANGELOG.md).
- Erlang/OTP 21.3 [release information](http://erlang.org/download/otp_src_21.3.readme).
- Java 8 [release information](https://java.com/en/download/faq/release_changes.xml).

# Previous releases
To review changes from a recent previous release, see the following links:
- [Release version 1.10.11](/1.10/release-notes/1.10.11/) - 12 February 2019.
- [Release version 1.11.10](/1.11/release-notes/1.11.10/) - 12 February 2019.
- [Release version 1.12.3](/1.12/release-notes/1.12.3/) - 14 March 2019.
