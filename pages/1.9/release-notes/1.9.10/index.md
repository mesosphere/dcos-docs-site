---
layout: layout.pug
navigationTitle: Release Notes for 1.9.10
title: Release Notes for 1.9.10
menuWeight: 0
excerpt: Release notes for DC/OS 1.9.10
---

DC/OS 1.9.10 was released on July 17, 2018.

[button color="purple" href="https://downloads.dcos.io/dcos/stable/1.9.10/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="light" href="https://support.mesosphere.com/hc/en-us/articles/213198586"]Download DC/OS Enterprise[/button]

DC/OS 1.9.10 includes the following:
- Updated to Mesos 1.2.3 ([change log](https://github.com/mesosphere/mesos/blob/dcos-mesos-1.2.x-6e1adf7/CHANGELOG)).
- Updated to Marathon 1.4.12 ([change log](https://github.com/mesosphere/marathon/releases/tag/v1.4.12)).
- Updated to Metronome 0.3.5 ([change log](https://github.com/dcos/metronome/releases/tag/v0.3.5)).

# Issues Fixed in DC/OS 1.9.10

- COPS-1840/DCOS_OSS-3793 - Change Admin Router(nginx) log to access logs with the daemon facility.
- COPS-3445/MESOS-8830 - Prevent Mesos agents from garbage-collecting persistent volumes.
- COPS-3368/MARATHON-8285 - Fix an issue where Marathon accepts an offer without deploying a service or logging a failure.
- DCOS_OSS-2564 - Add runtime capabilities to a docker container.
- DCOS_OSS-3602 - Fix instability issue: L4LB is unstable during deployment of new VIPS.


# About DC/OS 1.9

DC/OS 1.9 includes many new capabilities for Operators, and expands the collection of Data and Developer Services with a focus on:

- Tools for Production Operations - Monitoring and troubleshooting for distributed apps.
- Broader Workload Support - From traditional apps to machine learning.
- Security - New CLI capabilities, enhanced LDAP support, and many small improvements. [enterprise type="inline" size="small" /]
- New data and developer services.

## Breaking Changes

The DC/OS Identity and Access Management (IAM) SAML service provider implementation no longer accepts transient subject NameIDs.

## New Features and Capabilities

### Apache Mesos 1.2.2 and Marathon 1.4.8 integrated

- Marathon 1.4.8 [release notes](https://github.com/mesosphere/marathon/releases/tag/v1.4.8).
- Apache Mesos 1.2.2 [CHANGELOG](https://github.com/mesosphere/mesos/blob/dcos-mesos-1.2.x-d95a031/CHANGELOG). Patches from the forthcoming Apache Mesos 1.2.3 are included. 

### Container Orchestration
Added support for pods, GPUs, and made significant scalability improvements.

[preview]
### Pods
[/preview]
Multiple co-located containers per instance, scheduled on the same host. For more information, see the [documentation](/1.9/deploying-services/pods/).

[preview]
### GPU
[/preview]
- Leverage GPUs to run novel algorithms.
- Because DC/OS GPU support is compatible with nvidia-docker, you can test locally with nvidia-docker and then deploy to production with DC/OS.
- Allocate GPUs on a per container basis, including isolation guarantees

For more information, see the [documentation](/1.9/deploying-services/gpu/).

### DC/OS Monitoring and Operations

[preview]
#### Remote Process Injection for Debugging
[/preview]

The new `dcos task exec` command allows you to remotely execute a process inside the container of a deployed Mesos task by providing the following features:

- An optional `--interactive` flag for interactive sessions.
- Attach to a remote pseudoterminal (aka PTY) inside a container via the optional `--tty` flag.
- Combine the `--interactive` and `--tty` flags to launch an interactive bash session or to run `top` and see the resource usage of your container in real time.

For more information, see the debugging [documentation](/1.9/monitoring/debugging/).

[preview]
#### Logging
[/preview]

Stream task and system logs to `journald` by setting the `mesos_container_log_sink` install-time parameter to `journald` or `journald+logrotate`. This allows you to do the following tasks:

- Include task metadata like container ID in your queries to more easily locate the logs that you want.
- Use the new DC/OS CLI commands `dcos node log` and `dcos task log` to query logs. You can also make HTTP requests directly against the new Logging API.
- Set up log aggregation solutions such as Logstash to get logs into their aggregated storage solutions.

For more information, see the [documentation](/1.9/monitoring/logging/).

[preview]
#### Metrics
[/preview]

- Node-level HTTP API that returns metrics from tasks, cgroup allocations per container, and host level metrics such as load and memory allocation.
- StatsD endpoint in every container for forwarding metrics to the DC/OS metrics service. This service is what exposes the HTTP API.
- Any metric sent to STATSD_UDP_HOST/PORT is available in the HTTP API’s `/container/<container_id>/app` endpoint.

For more information, see the [documentation](/1.9/metrics/).

#### Tool for Troubleshooting Service Deployment Failures

- The new service deployment troubleshooting tool allows you to find out why your applications are not starting from the GUI and CLI.

  ![Service deploy GUI](/1.9/img/dcos-offers.png)

#### Improved GUI

- Improved navigation.

  ![New GUI](/1.9/img/dcos-dash.png)

- Usability improvements to the service create workflow.

  ![Improved GUI](/1.9/img/dcos-create.png)

### Networking Services

- CNI support for 3rd party CNI plugins.
- Performance improvements across all networking features.

### Security and Governance [enterprise type="inline" size="small" /]

- DC/OS Identity and Access Management (IAM) highlights: [enterprise type="inline" size="small" /]

  - LDAP group import: Support importing `posixGroup` objects according to [RFC2307](https://www.ietf.org/rfc/rfc2307) and [RFC2307bis](https://tools.ietf.org/html/draft-howard-rfc2307bis-02), and ensure compatibility with [FreeIPA](https://www.freeipa.org) and [OpenLDAP](https://www.openldap.org/). [enterprise type="inline" size="small" /]
  - SAML 2.0: Ensure that the authentication flow works against [Shibboleth](https://www.shibboleth.net/products/identity-provider/) and improve compatibility with a wide range of identity provider configurations. [enterprise type="inline" size="small" /]
  - OpenID Connect: Ensure that the authentication flow works against [dex](https://github.com/coreos/dex) and [Azure Active Directory](https://azure.microsoft.com/en-us/services/active-directory/). The authentication flow must allow customizing the identity provider certificate verification in back-channel communication. Enhance configuration validation for a better user experience. [enterprise type="inline" size="small" /]

- DC/OS CLI highlights: [enterprise type="inline" size="small" /]

  - Support single sign-on authentication via OpenID Connect and SAML 2.0 against the DC/OS IAM. [enterprise type="inline" size="small" /]
  - Support authentication with service account credentials. [enterprise type="inline" size="small" /] 

- Introduce various secrets improvements. For more information, see the [secrets documentation](/1.9/security/ent/secrets/). [enterprise type="inline" size="small" /]
- Security hardening across the platform, including Mesos, Marathon, and Admin Router. [enterprise type="inline" size="small" /]

### Developer Services

- Jenkins

    - The Jenkins DC/OS service will now work with DC/OS clusters in strict mode. [enterprise type="inline" size="small" /]
    - Marathon plugin now supports service accounts, allowing easy automated and secure deploys to DC/OS clusters. [enterprise type="inline" size="small" /]

### Other Improvements

#### DC/OS Internals

- Update DC/OS internal JDK to 8u112 for security [fixes](http://www.oracle.com/technetwork/java/javase/2col/8u112-bugfixes-3124974.html). 
- Update DC/OS internal Python from 3.4 to 3.5. [enterprise type="inline" size="small" /]
- The `dcos_generate_config.sh --aws-cloudformation` command will automaticlally determine the region of the s3 bucket and prevent region mistakes.
- Added `dcos-shell` which activates the DC/OS environment for running other DC/OS command line tools. [enterprise type="inline" size="small" /]
- Added the `reset-superuser` script which attempts to create or restore superuser privileges for a given DC/OS user. [enterprise type="inline" size="small" /]

#### Expanded OS Support [enterprise type="inline" size="small" /]

- If you install DC/OS 1.9 using the [GUI](/1.9/installing/ent/custom/gui/) or [CLI](/1.9/installing/ent/custom/cli/) installation methods, your system will be automatically upgraded to [the latest version of CentOS](https://access.redhat.com/documentation/en/red-hat-enterprise-linux/).
- CoreOS [1235.12.0](https://coreos.com/releases/#1235.12.0).

#### Expanded Docker Engine Support [enterprise type="inline" size="small" /]

- Docker 1.12 and 1.13 are now [supported](/1.9/installing/ent/custom/system-requirements/). Docker 1.13 is the default version.

#### Upgrades [enterprise type="inline" size="small" /]

Improved upgrade tooling and experience for on-premise installations. Upgrades now use internal DC/OS APIs to ensure nodes can be upgraded with minimal disruption to running DC/OS services on a node. The upgrade procedure has also been simplified to improve user experience.

For more information, see the [documentation](/1.9/installing/ent/upgrading/).

# Known Issues and Limitations

- DCOS_OSS-691 - DNS becomes unavailable during DC/OS version upgrades.
- DCOS-14005 - Marathon-LB does not support pods.
- DCOS-14021 - [Task logging to `journald`](/1.9/monitoring/logging/) is disabled by default. Task logs will continue to be written to their sandboxes, and logrotated out. The `dcos task log` command is an active command.
- DCOS-16737 - You cannot [generate and publish AWS Advanced Templates](/1.9/installing/ent/cloud/aws/advanced/#create-your-templates) to AWS GovCloud regions. [enterprise type="inline" size="small" /]
  The following error occcurs when you run the command `dcos_generate_config.ee.sh --aws-cloudformation` with GovCloud credentials:

  ```bash
  $ ./dcos_generate_config.sh --aws-cloudformation
  ====> EXECUTING AWS CLOUD FORMATION TEMPLATE GENERATION
  Generating configuration files...
  Starting new HTTPS connection (1): s3.amazonaws.com
  aws_template_storage_region_name: Unable to determine region location of s3 bucket testbucket: An error occurred (InvalidAccessKeyId) when calling the GetBucketLocation operation: The AWS Access Key Id you provided does not exist in our records.
  ```
- Marathon-7133 - Marathon application history is lost after Marathon restart.
- CORE-1191 -  The Mesos master's event queue can get backlogged with the default settings thus causing performance problems. These can be mitigated by setting the following configuration parameter in your `config.yaml` file at install time. See the [Configuration Reference](/1.9/installing/ent/custom/configuration/configuration-parameters/) for more information. 

**Note:** Lowering this parameter also reduces the number of tasks per framework that the `dcos task` subcommands can access for debugging. If you run a framework with many short tasks, such as Spark, you may not want to reduce this value.

  ```yaml
  mesos_max_completed_tasks_per_framework: 20
  ```

