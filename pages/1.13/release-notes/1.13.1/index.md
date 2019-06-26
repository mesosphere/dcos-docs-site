---
layout: layout.pug
navigationTitle: Release notes for 1.13.1
title: Release notes for 1.13.1
menuWeight: 1
excerpt: Release notes for DC/OS 1.13.1, including Open Source attribution, and version policy.
render: mustache
model: /data.yml
---
DC/OS 1.13.1 was released on May 31, 2019.

[button color="light" href="https://downloads.dcos.io/dcos/stable/1.13.1/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="http://downloads.mesosphere.com/dcos-enterprise/stable/1.13.1/dcos_generate_config.ee.sh"]Download DC/OS Enterprise* [/button]

Registered DC/OS Enterprise customers can access the DC/OS Enterprise configuration file from the <a href="https://support.mesosphere.com/s/downloads">support website</a>. For new customers, contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and install DC/OS Enterprise.

# Release summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

This release provides enhancements and fixes to address reported issues, integrate changes from previous releases, and maintain compatibility and support for the DC/OS ecosystem. 

If you are upgrading from a previous release, Mesosphere strongly recommends that you install **DC/OS 1.13.1** to minimize disruptions to a running cluster. For more information about this upgrade recommendation, see the [Marathon product advisory](https://support.mesosphere.com/s/article/Known-Issue-Marathon-MSPH-2019-0004).

If you have DC/OS deployed in a production environment, you should also review the [Known issues and limitations](#known-issues) to see if any potential operational changes for specific scenarios apply to your environment.

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

This change also aligns the authentication architectures between DC/OS Enterprise and DC/OS Open Source. The HTTP API for service account management and service authentication is now the same for both DC/OS Enterprise and DC/OS Open Source. For both DC/OS Enterprise and DC/OS Open Source clusters, the DC/OS authentication token is a JSON Web Token (JWT) of type RS256. This JWT authentication token can be validated by any component in the system after consulting the IAM services JSON Web Key Set (JWKS) endpoint.

## Monitoring and metrics for cluster operations
This release extends DC/OS cluster monitoring capabilities and the metrics you can collect and report for DC/OS components. The enhancements to monitoring and metrics provide you with better visibility into cluster operations, activity, and performance through DC/OS itself and as input to Prometheus, Grafana, and other services.

### Monitoring service
- The DC/OS monitoring service (`dcos-monitoring`) can be configured to use DC/OS storage service (DSS) volumes to store time-series data. <!--(DCOS-47725)-->

    With this release, you can store the information collected by the DC/OS monitoring service (`dcos-monitoring`) in the profile-based storage provided by the DC/OS Storage Service. By using the DC/OS Storage Service to store the monitoring data used in Prometheus queries and Grafana dashboards, you can improve the performance and reliability of the Prometheus and Grafana monitoring components.

    When you install the DC/OS monitoring service, you can select the volume size and a volume profile for the file system where you want to store the Prometheus time-series database (`tsdb`). By specifying a volume managed by the DC/OS Storage Service, you can take advantage of the durability, performance, and flexibility DSS provides for your collected data.

    For more information about working with the DC/OS monitoring service, see [DC/OS Monitoring Service](/services/beta-dcos-monitoring/). For more information about using the DC/OS storage service, see [DC/OS Storage Service](/services/beta-storage/0.5.3-beta/).

- The DC/OS monitoring service enables you to import curated alerting rules. <!--(DCOS-47666)-->

    With this release, deploying the DC/OS monitoring service enables you to import Mesosphere-provided Prometheus Alert Rules from a [github repository](https://github.com/dcos/prometheus-alert-rules). These predefined alert rules enable you to create meaningful alerts concerning the condition of the DC/OS cluster, including successful or failed operations and node activity.

    Prometheus alert rules are automatically included as part of the DC/OS monitoring service. Each DC/OS component or framework available for monitoring should have a single rule file that contains all its alert rules. These alert rules are passed to Prometheus using the `rule_files` configuration parameter and are configured to specify one of the following severity levels:
    - **Warning** alerts identify issues that require notification, but do not require immediate action. For example, an alert identified as a warning might send email notification to an administrator but not require an immediate response.
    - **Critical** alerts identify issues that require immediate attention. For example, a critical alert might trigger a pager notification to signal that immediate action is required.

- The monitoring service automatically creates a curated collection of Prometheus-driven Grafana dashboards for DC/OS. <!--(DCOS-44740)-->

    If you deploy DC/OS monitoring, you can leverage Mesosphere-provided Grafana-based dashboards. By installing and configuring the `dcos-monitoring` service, you can automatically create dashboards that enable you to quickly visualize the metrics that the `dcos-monitoring` package is collecting from the DC/OS cluster and DC/OS-hosted applications. For more information about using Grafana dashboards, see the [dashboard repository](https://github.com/dcos/grafana-dashboards).

### Metrics
DC/OS metrics are collected and managed through the Telegraf service. Telegraf provides an agent-based service that runs on each master and agent node in a DC/OS cluster. By default, Telegraf gathers metrics from all of the processes running on the same node, processes them, then sends the collected information to a central metrics database.

With this release, you can use Telegraf to collect and forward information for the following additional DC/OS cluster components:
- CockroachDB
- ZooKeeper
- Exhibitor
- Marathon
- Metronome

You can also collect information about the operation and performance of the Telegraf process itself. This information is stored along with other metrics and available for reporting using the DC/OS monitoring service or third-party monitoring services. For information about the Telegraf plugin and the metrics that Telegraf collects about its own performance, see the documentation for the [Internal input plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/internal).

- New volume and network metrics that are collected by the Mesos input plugin are enabled by default. <!--(DCOS-47722, DCOS-47719)-->

    The metrics collection service, `dcos-telegraf` can now collect additional metrics for Mesos volumes and network information. For a complete list of the Mesos metrics you can collect and report, see the latest [list of metrics](http://mesos.apache.org/documentation/latest/monitoring/).

    In DC/OS 1.13, `dcos-telegraf` automatically collects Mesos metrics by default. Previously, you were required to manually enable the metrics plugin by updating the agent configuration or by setting the `enable_mesos_input_plugin` parameter in the `config.yaml` file to `true`.  With this release, manually enabling this feature is no longer required. Instead, the default value for the parameter is now set to true. You can set the `enable_mesos_input_plugin` parameter in the `config.yaml` file to false if you want to disable the automatic collection of Mesos metrics.

- Collect and report metrics that track the health and performance of the DC/OS Telegraf plugin. <!--(DCOS-39012)-->

    DC/OS metrics are collected and managed through the Telegraf service. Telegraf provides an agent-based service that runs on each master and agent node in a DC/OS cluster. By default, Telegraf gathers metrics from all of the processes running on the same node, processes them, then sends the collected information to a central metrics database.

    With this release, the `dcos-telegraf` program collects and forwards information about the operation and performance of the Telegraf process itself. This information is stored along with other metrics and is available for reporting using the DC/OS monitoring service or third-party monitoring services. For information about the Telegraf plugin and the metrics that Telegraf collects about its own performance, see the documentation for the [Internal input plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/internal).

- Expose task-related metrics using the Prometheus format.

    You can expose metrics from tasks that run on Mesos in Prometheus format. When a port configuration belonging to a task is labelled appropriately, the metrics endpoint on that port is polled regularly over the lifetime of the task and metrics collected are added to the Telegraf pipeline.

    For a detailed description of how to configure a task so that its metrics are collected in Prometheus format, see the [Prometheus input plugin](https://github.com/dcos/telegraf/tree/1.9.4-dcos/plugins/inputs/prometheus#mesos-service-discovery).


- Add internal metrics for UDP activity to the Telegraf `statsd` input plugin. <!--DCOS_OSS-4759-->

    You can collect and report metrics for the number of incoming messages that have been dropped because of a full queue. This information is provided by the Telegraf `statsd` input plugin with the `internal_statsd_dropped_messages` metric.

- Add process-level metrics for DC/OS agents and masters. <!--DCOS-50778-->

    You can collect and report process-level metrics for agent and master node processes. This information is provided by the Telegraf `procstat` input plugin. This plugin returns information about CPU and memory usage using the `procstat_cpu_usage` and `procstat_memory_rss` metrics.

- Add metrics for Admin Router instances running on DC/OS master nodes. <!--DCOS_OSS-4562-->

    You can collect and report metrics for DC/OS Admin Router using NGINX Virtual Hosts metrics. This information is provided by Telegraf and NGINX input plugins and is enabled by default. You can view the NGINX instance metrics using the `/nginx/status` endpoint on each DC/OS master node.

- Add the fault domain region and zone information to metrics. <!--DCOS-16570-->

- Enable standardized log collection and forwarding through Fluent Bit. <!--(DCOS-43412)-->

    Application and DC/OS cluster component logs are now aggregated, enabling you to configure forwarding to third-party log storage, search, and reporting services. Previously, forwarding logged information required you to install third-party agents or aggregator services on cluster nodes to perform this task. With the introduction of support for Fluent Bit--a cloud-native, multi-platform log processor and forwarder--you can now leverage easy-to-configure plugins to perform log filtering and forwarding to a log collection, search, and reporting service.

    For more information about how to configure logging to integrate with Fluent Bit, see [Logging](/1.13/monitoring/logging/).

For more information about collecting metrics and configuring metrics plugins, see the following topics:
- [Metrics Plugin Architecture](/1.13/metrics/architecture/)
- [Mesos Metrics](/1.13/metrics/mesos/)
- [Configuration Reference](/1.13/installing/production/advanced-configuration/configuration-reference/)

## Command-line interface
- Identify the public-facing IP address for public agent nodes through the DC/OS CLI. <!--(DCOS-44697)-->

    With this release, you can retrieve the public-facing IP addresses for the nodes in a cluster by running the `dcos node list` command. For more information about using the new command for retrieving public IP addresses, see the [dcos node](/1.13/cli/command-reference/dcos-node/) command reference.

    You can look up the public agent IP address using the DC/OS web-based console, command-line interface, or API calls for DC/OS cluster nodes if DC/OS is deployed on a **public cloud provider** such as AWS, Google Cloud, or Azure. If DC/OS is installed on an internal network (on-premise) or a private cloud, nodes do not typically have separate public and private IP addresses. For nodes on an internal network or private cloud, the public IP address is most often the same as the IP address defined for the server in the DNS namespace.

- Automatically install the DC/OS Enterprise command-line interface (CLI). <!--(DCOS-39775)-->

    If you have deployed a DC/OS Enterprise cluster, ypu can now automatically install the DC/OS Enterprise CLI when you install the base CLI package. Previously, the DC/OS Enterprise CLI could only be installed manually after the successful installation of the base DC/OS CLI.

    For more information about installing the command-line interface (CLI) and CLI plugins, see [Installing the CLI](/1.13/cli/install) and [Installing the DC/OS Enterprise CLI](/1.13/cli/enterprise-cli/).

- Support basic auto-completion using the TAB key. <!--(DCOS-39774)-->

    You can now use the TAB key to provide automatic completion when typing DC/OS commands. Auto-completion enables you to execute commands in a shell terminal more quickly by attempting to predict the rest of a command or subcommand you are typing. If the suggested text matches the command you intended, you can press the TAB key to accept the suggestion and execute the command.

    For more information about using auto-completion when you are working with the command-line interface (CLI) and CLI plugins, see [Enabling autocompletion for the CLI](/1.13/cli/autocompletion/).

- Enable dynamic auto-completion of cluster names for `dcos cluster attach` and `dcos cluster remove` commands.<!--(DCOS-47214)-->

    You can now use the TAB key to provide automatic completion for potential cluster names when you run the `dcos cluster attach` or `dcos cluster remove` commands.

    For more information about using auto-completion when you are working with the command-line interface (CLI) and CLI plugins, see [Enabling autocompletion for the CLI](/1.13/cli/autocompletion/).

- Add CLI support for macOS using Homebrew. <!--(DCOS-47562)-->

    Homebrew is a software package management program you can use to install and configure packages for computers running macOS or Linux operating systems. With this release, you can install the DC/OS command-line interface (CLI) packages using the Mac OSX `homebrew` utility. Previously, you were required to download all DC/OS CLI plug-ins directly from the DC/OS cluster. By adding support for the Homebrew package manager, operators and developers can keep their CLI packages up-to-date using the `brew` command. For example, you can install the core CLI package by running the following command:

    ```bash
    brew install dcos-cli
    ```

    For more information about installing and using Homebrew, see the [Homebrew website](https://brew.sh/) or the [GitHub repository](https://github.com/Homebrew/brew).

## Data services
- Add a unique version number to Edge-LB pool packages. <!--(DCOS-40527)-->

    You can run a command to return the version number for the Edge-LB pool package you have installed. Using the version number returned by the `edgelb version` command, you can verify whether the Edge-LB pool and the Edge-LB API server versions match. The Edge-LB API server and the Edge-LB pool version numbers should always match. For example, if you have the Edge-LB pool package version v1.3.0 installed, the API server version should be v1.3.0 as well.

- Enable Edge-LB pool instances to be scaled up or down. <!--(DCOS-28440)-->

    You can scale down the Edge-LB pool instances from a higher count to lower if you don't require all pool instances that are configured. To scale down, simply update the `count` variable in the Edge-LB pool configuration file to reflect the number of Edge-LB pool instances you need.

## UI
- Enable independent upgrades of the DC/OS UI. <!--(DCOS-47632)-->

    You can now install and update the DC/OS UI without having to upgrade the DC/OS cluster. This feature enables new updates for DC/OS to be published to the DC/OS catalog and also be available as `.dcos` files for on-premise customers. The ability to install and update the DC/OS UI without upgrading the DC/OS cluster enables you to easily get the latest fixes and capabilities available in the DC/OS UI without affecting cluster operations. You also now have the ability to roll back an update, enabling you to use the DC/OS UI version that was originally shipped with your version of DC/OS if you need to.

- Provide accurate status information for services. <!--(DCOS-43460)-->

    DC/OS 1.13 UI now includes a new tab in the Details section of every SDK-based data service. This new tab provides a clear indication of the status and progress of SDK-based services during the service life cycle, including installation and upgrade activity. From the Details tab, you can see information about the specific operational plans that are currently running or have just completed. You can also view the execution of each task so that you can easily track the progress of the plans you have deployed.

    For more information about viewing up-to-date status information for services and operational plans, see the [Services](/1.13/gui/services/) documentation.

- Identify the public-facing IP address for public agent nodes in the DC/OS UI. <!--(DCOS-49987)-->

    With this release, you can view the public-facing IP addresses for agent nodes in the DC/OS UI. Previously, retrieving the public IP address for a node required writing a custom query. For more information about viewing public IP addresses in the DC/OS UI, see [Finding the public IP address](/1.13/administering-clusters/locate-public-agent/).

    You can look up the public agent IP address using the DC/OS web-based console, command-line interface, or API calls for DC/OS cluster nodes if DC/OS is deployed on a **public cloud provider** such as AWS, Google Cloud, or Azure. If DC/OS is installed on an internal network (on-premise) or a private cloud, nodes do not typically have separate public and private IP addresses. For nodes on an internal network or private cloud, the public IP address is most often the same as the IP address defined for the server in the DNS namespace.

- Add support for internationalization and localization (I18N and L10N - Chinese). <!--(DCOS-39557)-->

    Mesosphere DC/OS 1.13 UI has now been translated into Mandarin Chinese. Mandarin-speaking customers and users can now easily switch the language displayed in the UI and be able to interact with DC/OS operations and functions in English or Chinese. The DC/OS documentation has also been translated to Chinese to support those customers. Support for additional languages can be provided if there's sufficient customer demand.

    For information about changing the language displayed, see the [UI](/1.13/gui/) documentation.

## Installation
- Enable multi-region support using the Universal Installer. <!--(DCOS-45727)-->

    Multi-region deployments enable higher availability for DC/OS clusters and support for multiple regions is crucial for customers who want to maintain uptime without being susceptible for regional outages. For more information, see the documentation for [multi-region deployment](/1.13/installing/evaluation/aws/aws-remote-region/).

- Support dynamic masters on the Universal Installer. <!--(DCOS-45725)-->

    Dynamic masters enable you to create, destroy, and recover master nodes. With this feature, you can use the Universal Installer to downscale or upscale your DC/OS clusters from not just the agent nodes (which is currently supported), but also from the master nodes--if you deem it necessary to do so. For more information, see the documentation for [replaceable masters](/1.13/installing/evaluation/aws/aws-replaceable-masters/).


- Enable Universal Installer and on-premise DC/OS life cycle management with Ansible. <!--(DCOS-45724)-->

    The DC/OS Ansible (`dcos-ansible`) component is a Mesosphere-provided version of the Ansible open-source provisioning, configuration management, and deployment tool that enables you to use supported Ansible roles for installing and upgrading DC/OS Open Source and DC/OS Enterprise clusters on the infrastructure you choose. For more information, see the documentation for [Ansible](/1.13/installing/production/dcos-ansible/).

## Job management and scheduling
- Enhance DC/OS job handling capabilities by adding support for the following:
    - Graphic processing units (GPU) when creating new jobs in the DC/OS UI or with the new DC/OS configuration option `metronome_gpu_scheduling_behavior`.
    - Jobs running in universal container runtime (UCR) containers.
    - File-based secrets.
    - Hybrid cloud deployments.
    - The `IS` constraint operator and the `@region` and `@zone` attributes.

- Provide an option to enable or disable offer suppression when agents are idle.

- Collect metrics for the “root” Metronome process on DC/OS for better observability.

- Add HTTP and uptime metrics for job management.

- Set the default value for the `--gpu_scheduling_behavior` configuration option to `restricted` to prevent jobs from being started on GPU-enabled agents if the job definition did not explicitly request GPU support.

<!--For more information about using these new features, see []().-->

## Marathon
- Enable secure computing (seccomp) and a default seccomp profile for UCR containers to prevent security exploits.

- Replace Marathon-based health and readiness checks with generic DC/OS (Mesos-based) checks.

- Collect metrics for the “root” Marathon framework on DC/OS for better observability.

- Automatically replace instances when a DC/OS agent is decommissioned.

- Set the default value for the `--gpu_scheduling_behavior` configuration option to `restricted` to prevent tasks from being started on GPU-enabled agents if the app or pod definition did not explicitly request GPU support.

- Implement global throttling of Marathon-initiated health checks for better scalability.

- Suppress offers by default when agents are idle for better scalability.

- Close connections on slow event consumers to prevent excessive buffering and reduce the load on Marathon.

## Mesos platform and containerization
- Update the Universal Container Runtime (UCR) to support Docker registry manifest specification v2_schema2 images. <!--(DCOS-43871)-->

    DC/OS Universal Container Runtime (UCR) now fully supports Docker images that are formatted using the Docker v2_schema2 specification. The DC/OS Universal Container Runtime (UCR) also continues to support Docker images that use the v2_schema1 format.

    For more information, see [Universal Container Runtime](/1.13/deploying-services/containerizers/ucr/).

- Add a communication heartbeat to improve resiliency.

    DC/OS clusters now include executor and agent communication channel heartbeats to ensure platform resiliency even if `IPFilter` is enabled with `conntrack`, which usually times out a connection every five days.

- Support zero-downtime for tasks through layer-4 load balancing.

    DC/OS cluster health checks now provide task-readiness information. This information enables zero-downtime for load balancing when services are scaled out. With this feature, load balanced traffic is not redirected to containers until the container health check returns a 'ready' status.

- Add support for CUDA 10 image processing for applications that use graphics processing unit (GPU) resources and are based on the NVIDIA Container Runtime.<!--(COPS-4504)-->

    CUDA provides a parallel computing platform that enables you to use GPU resources for general purpose processing. The CUDA platform provides direct access to the GPU virtual instruction set using common programming languages such as C and C++. The NVIDIA Container Runtime is a container runtime that supports CUDA image processing and is compatible with the Open Containers Initiative (OCI) specification.

    With this release, DC/OS adds support for CUDA, NVIDIA Container Runtime containers, and applications that use GPU resources to enable you to build and deploy containers for GPU-accelerated workloads.

## Networking
- Add a new networking API endpoint to retrieve the public-facing IP address for public agent nodes. <!--(DCOS-28127)-->

    This release introduces a new API endpoint for accessing public-facing IP addresses for the nodes in a cluster. For more information about retrieving and viewing public IP addresses, see [Finding the public IP address](/1.13/administering-clusters/locate-public-agent/).

    You can look up the public agent IP address using the DC/OS web-based console, command-line interface, or API calls for DC/OS cluster nodes if DC/OS is deployed on a public cloud provider such as AWS, Google Cloud, or Azure. If DC/OS is installed on an internal network (on-premise) or a private cloud, nodes do not typically have separate public and private IP addresses. For nodes on an internal network or private cloud, the public IP address is most often the same as the IP address defined for the server in the DNS namespace.

## Security
- Extend the DC/OS authentication architecture to apply to both DC/OS Open Source (OSS) and DC/OS Enterprise clusters. <!--(DCOS-28672)-->

    You can now create unified service accounts that can be used across DC/OS OSS and DC/OS Enterprise clusters. By extending support for service accounts that can be used for all DC/OS clusters, you have the option to install, configure, and manage additional packages, including packages that require a service account when you are running DC/OS Enterprise DC/OS in `strict` mode.

    For more information about authentication and managing accounts, see [Security](/1.13/security) and [User account management](/1.13/security/oss/user-account-management/).

- Support secure computing mode (seccomp) profiles. <!--(DCOS-28442, DCOS-49134)-->

    Secure computing mode (`seccomp`) is a feature provided by the Linux kernel. You can use secure computing mode to restrict the actions allowed within an app or pod container. You can enable secure computing mode using a default profile for Universal Container Runtime (UCR) containers if the operating system you are using supports it.

    With DC/OS, you can use a `seccomp` profile to deny access to specific system calls by default. The profile defines a default action and the rules for overriding that default action for specific system calls.

    Using a secure computing mode profile is an important option if you need to secure access to containers and operations using the principle of least privilege.

    For more information about secure computing mode and the default secure computing profile, see [Secure computing profiles](/1.13/security/oss/secure-compute-profiles/).

## Storage
- Update Beta Rex-Ray to support NVMe EBS volumes. <!--(DCOS-50047)-->

    REX-Ray is a container storage orchestration engine that enables persistence for cloud-native workloads. With Rex-Ray, you can manage native Docker Volume Driver operations through a command-line interface (CLI).

    Amazon Elastic Block Store (Amazon EBS) provides block-level storage volumes for Amazon Elastic Cloud (EC2) instances. Amazon EBS volumes can be attached to any running EC2 instance hosted in the same Amazon availability zone to provide persistent storage that is independent of the deployed instance. EBS storage volumes can be exposed using NVMe (non-volatile memory express) as a host controller interface and storage protocol. NVMe devices enable you to accelerate the transfer of data between nodes and solid-state drives (SSDs) over a computer's connection gateway.

    With this release, DC/OS updates REX-Ray to support NVMe storage when the DC/OS cluster runs on an Amazon instance. To work with NVMe devices, however, you must provide your own `udev` rules and  `nvme-cli` package. For more information about using Rex-Ray, see the [REX-Ray](https://rexray.io/) website and [github repository](https://github.com/rexray).

- Provide a driver that enables AWS Elastic Block Store (EBS) volumes for the Mesosphere Kubernetes Engine (MKE). <!--(DCOS-44789)-->

    You can use the AWS EBS Container Storage Interface (CSI) driver to manage storage volumes for the Mesosphere Kubernetes Engine (MKE). This driver enables MKE users to deploy stateful applications running in a DC/OS cluster on an AWS cloud instance.

- Update support for the Container Storage Interface (CSI) specification. <!--DCOS-51279,DCOS-50136, DCOS-47222-->

    With this release, DC/OS supports the Container Storage Interface (CSI) API, version 1 (v1), specification. You can deploy plugins that are compatible with either the Container Storage Interface (CSI) API, v0 or v1, specification to create persistent volumes through local storage resource providers. DC/OS automatically detects the CSI versions that are supported by the plugins you deploy.

# Issues fixed in this release
The issues that have been fixed in DC/OS 1.13.1 are grouped by feature, functional area, or component. Most change descriptions include one or more issue tracking identifiers enclosed in parentheses for reference.

### Admin Router
- Change the maximum size allowed for uploads to a service through Admin Router (COPS-4651, DCOS-20269, DCOS-52768).

    This release increases the maximum size allowed for uploading packages from 1GB to 16GB. This change enables you to upload larger packages to a registry service without timing out the upload connection.

 - Support `gzip` data compression when serving some UI assets (DCOS-5978, DCOS-40441).

<!--### Command-line interface (CLI) --> 

### Diagnostics and logging
- Add configuration parameters to control timeouts for collecting log files and creating diagnostic bundles (DCOS_OSS-5097, DCOS-41821). 

    Applying a timeout enables you restrict the length of time allowed for reading `systemd` journal entries when creating consolidated diagnostics bundle for troubleshooting and analysis. You can set the following configuration parameters to control timeouts:
    - `command-exec-timeout`: Specifies the maximum number of seconds allowed for executing commands such as `docker ps`. The default is 120 seconds.
    - `diagnostics-job-timeout`: Specifies the maximum number of hours allowed for for completing a single diagnostics bundle creation job. the default is 12 hours.
    - `diagnostics-url-timeout`: Specifies the maximum number of minutes allowed for a single HTTP request. The default is 2 minutes.

### UI
- Update the DC/OS UI package to ensure it correctly identifies task names that have changed between releases and displays the correct task status for tasks that were running before an upgrade (COPS-4920, DCOS-54498).

    Before applying this fix, tasks that were started prior to an upgrade might display No Data when viewing the **Tasks** tab for a service. 

### Installation
- Fix issues that caused some DC/OS components to crash when the `/tmp` directory is mounted using the `noexec` option (DCOS-53077).

- Correct the output returned when running the `dcos_generate_config.sh` or `dcos_generate_config.ee.sh` script with the `--validate-config` option so that it doesn't display warning or error messages about missing deprecated configuration settings such as `ssh_user` and `ssh_key_path` (COPS-4282, DCOS_OSS-4613, DCOS_OSS-5152).

- Fix a missing echo command line in the sample `fault-domain-detect` script that generated a `command not found` error if used unmodified (DCOS-51792). 

<!--### Job management and scheduling --> 

### Marathon
- Improve handling for tasks that return a TASK_UNKNOWN state (COPS-4883, COPS-4913, MARATHON-8624). 

    In most cases, the TASK_UNKNOWN state results when there are explicit reconciliation requests for:
    - Unrecognized tasks on registered agents
    - Tasks requests on unregistered nor unreachable agents

    Prior to this fix, any app instance that returned `TASK_UNKNOWN` as a Mesos task state could cause the DC/OS API to fail with the following error:

    “TASK_UNKNOWN is an unknown Mesos task state”
    
    With this release, the TASK_UNKNOWN state is recognized by other DC/OS components. This state no longer causes operational failures or error messages that require the task to be deleted and relaunched as a new task with a new unique ID.

- Fix an issue with scaling Marathon apps when using a persistent volume (COPS-4892, DCOS_OSS-5212, DCOS-54468).

    Tasks started in previous DC/OS versions using persistent volumes could not be restarted in DC/OS 1.13.0. This issue affected both restarting in response to a task failure, as well as scaling apps by restarting previously suspended tasks. 
  
    The fix in this release ensures that any Marathon task using persistent volumes can be suspended or fail and be restarted reusing its persistent volumes.

- Modify support for volume profiles so that Marathon apps only match disk resources with a profile if a profile is required (DCOS_OSS-5211). 

    Previously, if you configured a Marathon app to use disk resources, but did not specify a disk profile, Marathon would match any disk resource. With this release, Marathon does not use disks resources that have a profile if the service for which it is matching offers does not require a disk with that profile.

- Provide better handling for invalid state command exceptions in InstanceTrackerActor (MARATHON-8623).

- Prevent a rare but benign unchecked null pointer exception when a deployment is canceled (MARATHON-8616).

### Metrics
- Enable framework names to be properly decoded in metric tags (DCOS_OSS-5039).

    Mesos masters allow spaces in framework names by using percent-encoding (%20) of the framework name. This release updates the Telegraf plugin to enable it to decode the framework name and export metrics with the correct tags.

### Networking
- Add round-robin DNS support so that DNS requests do not always return address (A) records in the same order (DCOS_OSS-5118).

- Return canonical name (CNAME) records before address (A or AAAA) records in DNS responses (DCOS_OSS-5108).

    For most DNS clients, the order in which records are returned has no affect. However, there are some DNS clients that require CNAME records to be listed before A records. This change resolves issues for DNS clients that have this requirement.

### Security
- Fix a problem with the `dcos-iam-ldap-sync` service failing to start correctly after a system reboot (COPS-4455, COPS-4814, DCOS-48107, DCOS-53420).

    With this release, the DC/OS identity and access managment LDAP synchronization `systemd` unit no longer relies on the /opt/mesosphere directory being available when the `systemd` configuration is loaded.

- Update the DC/OS identity and access management bouncer service to allow you to use any properly-configured web proxy to access external sites (DCOS_OSS-5167).

### Third-party updates and compatibility
- Update the `urllib3` to version 1.24.2 to address the security vulnerability identified for Python when working with CA certificates in [CVE-2019-11324](https://nvd.nist.gov/vuln/detail/CVE-2019-11324) (DCOS-52210).

    This vulnerability is still undergoing analysis. However, an issue was detected in the Python `urllib3` library where, in certain cases, the desired set of CA certificates is different from the OS store of CA certificates. This issue could be exploited to allow successful SSL connections in situations where the validation should fail.

- Update the DC/OS identity and access management (IAM) CockroachDB component to version 2.0.7 (DCOS-38395).

# Known issues and limitations
This section covers any known issues or limitations that don’t necessarily affect all customers, but might require changes to your environment to address specific scenarios. The issues are grouped by feature, functional area, or component. Where applicable, issue descriptions include one or more tracking identifiers enclosed in parentheses for reference.
<!-- -->

### Separating job configuration details
In this release, jobs and job schedules are created in two separate steps. Because of this change, you must structure the job definition in the JSON editor in distinct sections similar to this:

- job: JSON definition that specifies the job identifier and job configuration details.
- schedule: JSON definition that specifies the schedule details for the job.

This two-step approach to creating JSON for jobs is different from previous releases in which jobs and schedules could be created in one step. In previous releases, the job could have its schedule embedded in its JSON configuration. For information about modifying existing JSON configurations, see [Using separate JSON files for job scheduling](/1.13/release-notes/1.13.0/#Known_issues_and_limitations).

### Authentication tokens after an upgrade
- Authentication tokens that are generated by DC/OS Open Authentication (`dcos-oauth`) before upgrading from DC/OS version 1.12.x to DC/OS version 1.13.x become invalid during the upgrade. To generate a new authentication token for access to DC/OS 1.13.x, log in using valid credentials after completing the upgrade.

### Upgrading Marathon orchestration
- You can only upgrade to Marathon 1.8 from 1.6.x or 1.7.x. To upgrade from an earlier version of Marathon, you must first upgrade to Marathon 1.6.x or 1.7.x.

### Restrictions for Marathon application names
- You should not use restricted keywords in application names.

    You should not add applications with names (identifiers) that end with restart, tasks, or versions. For example, the application names `/restart` and `/foo/restart` are invalid and generate errors when you attempt to issue a GET /v2/apps request. If you have any existing apps with restricted names, attempting any operation--except delete--will result in an error. You should ensure that application names comply with the validation rules before upgrading Marathon.

### Deprecated or decommissioned features
- In DC/OS 1.13, the DC/OS history service has transitioned into the retired state. The history service is scheduled to be decommissioned in DC/OS 1.14. You can find the definitions for each of the feature maturity states documented in the [Mesosphere DC/OS Feature Maturity Lifecycle](/1.13/overview/feature-maturity/). <!--DCOS-50304, DCOS-51996-->

- Some of the configuration parameters previously used to install DC/OS cluster components are no longer valid. The following `dcos_generate_config.sh` command-line options have been deprecated and decommissioned:
    * `--set-superuser-password`
    * `--offline`
    * `--cli-telemetry-disabled`
    * `--validate-config`
    * `--preflight`
    * `--install-prereqs`
    * `--deploy`
    * `--postflight`

    If you attempt to use an option that is no longer valid, the installation script displays a warning message. You can also identify deprecated options by running the `dcos_generate_config.sh` script with the `--help` option. The output for the `--help` option displays [DEPRECATED] for the options that are no longer used.

    These options will be removed in DC/OS 1.14. If you have scripts or programs that use any of the deprecated options, you should update them. <!--(DCOS-48069, DCOS-50263, DCOS-51311, DCOS-51312, DCOS-51174)-->

- The CLI command `dcos node` has been replaced by the new command `dcos node list`.<!--DCOS-51803-->

    Running the `dcos node` command after installing this release automatically redirects to the output of the `dcos node list` command. The `dcos node list` command provides information similar to the output from the `dcos node` command, but also includes an additional column that indicates the public IP address of each node.

    If you have scripts or programs that use output from the `dcos node` command, you should test the output provided by the `dcos node list` command then update your scripts or programs, as needed.

- Marathon-based HTTP, HTTPS, TCP, and Readiness checks are no longer supported. <!--DCOS-42564-->

    Marathon-based HTTP, HTTPS, and TCP health checks have been deprecated since DC/OS 1.9. With this release, Marathon-based readiness checks have also been deprecated.

    If you have not already done so, you should migrate services to use the Mesos Health and Generic checks in place of the Marathon-based checks. As part of this migration, you should keep in mind that you can only specify one Mesos-based Health check and one Mesos-based Generic check.

- Marathon support for App Container (`appc`) images is decommissioned in 1.13.<!--DCOS-42564-->

    There has been no active development for AppC images since 2016. Support for AppC images will be removed in DC/OS 1.14.

- Setting the `gpu_scheduling_behavior` configuration option to `undefined` is no longer supported.<!--DCOS-42564-->

    With this release, the default value for the `gpu_scheduling_behavior` configuration option is `restricted`. The value `undefined` is decommissioned. This value will be removed in DC/OS 1.14.

    If you have scripts or programs that set the `gpu_scheduling_behavior` configuration option to `undefined`, you should update them, as needed.

- Marathon no longer supports the `api_heavy_events` setting.<!--DCOS-42564-->

    With this release, the only response format allowed for `/v2/events` is `light` (in accordance with the previously-published deprecation plan). If you attempt to start Marathon with the `--deprecated_features=api_heavy_events` setting specified, the startup operation will fail with an error.

- Marathon no longer supports Kamon-based metrics and related command-line arguments.<!--DCOS-42564-->

    The following command-line arguments that are related to outdated reporting tools have been removed:
    * `--reporter_graphite`
    * `--reporter_datadog`
    * `--metrics_averaging_window`

    If you specify any of these flags, Marathon will fail to start.

- Proxying server-sent events (sse) from standby Marathon instances is no longer supported.<!--DCOS-42564-->

    DC/OS no longer allows a standby Marathon instance to proxy `/v2/events` from the Marathon leader. Previously, it was possible to use the `proxy_events` flag to force Marathon to proxy the response from `/v2/events`. This standby redirect functionality and the related flag are no longer valid in 1.13.

- Marathon no longer supports the `save_tasks_to_launch_timeout` setting.<!--DCOS-42564-->

    The `save_tasks_to_launch_timeout` option was deprecated in Marathon 1.5 and using it has had no effect on Marathon operations since that time. If you specify the `save_tasks_to_launch_timeout` setting, Marathon will fail to start.

# Updated components change lists
For access to the logs that track specific changes to components that are included in the DC/OS distribution, see the following links:
- Apache Mesos 1.8.0 [change log](https://github.com/apache/mesos/blob/f5770dcf322bd8a88e6c88041364a4089d92be90/CHANGELOG).
- Marathon 1.8.x [change log](https://github.com/mesosphere/marathon/blob/1590825ea77c838a767bfcdb0fbe5b93cddce1c3/changelog.md).
- Metronome 0.6.18 [change log](https://github.com/dcos/metronome/blob/90557686a08d97ef6bb7e55ac9c3a48d72e2a53d/changelog.md).
- DC/OS 1.13.1 [change log](https://github.com/dcos/dcos/blob/1.13.1/CHANGES.md).
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