---
layout: layout.pug
navigationTitle:  Release Notes for 1.9.5
title: Release Notes for 1.9.5
menuWeight: 25
excerpt:
---

DC/OS 1.9.5 was released on October 12, 2017.

[button color="purple" href="https://downloads.dcos.io/dcos/stable/1.9.5/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

DC/OS 1.9 includes many new capabilities and expands the collection of data and developer services, with a focus on:
- Tools for Production Operations - Monitoring and troubleshooting for distributed apps.
- Broader Workload Support - From traditional apps to machine learning.
- Security - New CLI capabilities, enhanced LDAP support, and many small improvements.
- New data and developer services.

### Contents
- [Breaking Changes](#breaking)
- [What's New](#whats-new)
- [Known Issues and Limitations](#known-issues)
- [Issues Fixed in 1.9.5](#fixed-issues)

# <a name="breaking"></a>Breaking Changes

The DC/OS Identity and Access Management (IAM) SAML service provider implementation no longer accepts transient subject NameIDs.

# <a name="whats-new"></a>What's New

### Apache Mesos 1.2.2 and Marathon 1.4.8 integrated

- Marathon 1.4.8 [release notes](https://github.com/mesosphere/marathon/releases/tag/v1.4.8).
- Apache Mesos 1.2.2 [CHANGELOG](https://github.com/mesosphere/mesos/blob/dcos-mesos-1.2.x-d95a031/CHANGELOG). We also include patches from the forthcoming Apache Mesos 1.2.3.

## Container Orchestration
Added support for pods, GPUs, and made significant scalability improvements.

[preview]
#### Pods
[/preview]

Multiple co-located containers per instance, scheduled on the same host. For more information, see the [documentation](/1.9/deploying-services/pods/).

[preview]
#### GPU
[/preview]

- Leverage GPUs to run novel algorithms.
- Because DC/OS GPU support is compatible with nvidia-docker, you can test locally with nvidia-docker and then deploy to production with DC/OS.
- Allocate GPUs on a per container basis, including isolation guarantees

For more information, see the [documentation](/1.9/deploying-services/gpu/).

## DC/OS Monitoring and Operations

[preview]
### Remote Process Injection for Debugging
[/preview]

The new `dcos task exec` command allows you to remotely execute a process inside the container of a deployed Mesos task, providing the following features.

- An optional `--interactive` flag for interactive sessions.
- Attach to a remote pseudoterminal (aka PTY) inside a container via the optional `--tty` flag.
- Combine the `--interactive` and `--tty` flags to launch an interactive bash session or to run `top` and see the resource usage of your container in real time.

For more information, see the debugging [documentation](/1.9/monitoring/debugging/).

[preview]
### Logging
[/preview]

Stream task and system logs to journald by setting the `mesos_container_log_sink` install-time parameter to `journald` or `journald+logrotate`. This allows you to:

- Include task metadata like container ID in your queries to more easily locate the logs that you want.
- Use the new DC/OS CLI commands `dcos node log` and `dcos task log` to query logs. You can also make HTTP requests directly against the new Logging API.
- Set up log aggregation solutions such as Logstash to get logs into their aggregated storage solutions.

For more information, see the [documentation](/1.9/monitoring/logging/).

[preview]
### Metrics
[/preview]

- Node-level HTTP API that returns metrics from tasks, cgroup allocations per container, and host level metrics such as load and memory allocation.
- StatsD endpoint in every container for forwarding metrics to the DC/OS metrics service. This service is what exposes the HTTP API.
- Any metric sent to STATSD_UDP_HOST/PORT is available in the HTTP API’s `/container/<container_id>/app` endpoint.

For more information, see the [documentation](/1.9/metrics/).

### Tool for Troubleshooting Service Deployment Failures

- The new service deployment troubleshooting tool allows you to find out why your applications aren’t starting from the GUI and CLI.

  ![Service deploy GUI](/1.9/img/dcos-offers.png)

### Improved GUI

- New look and feel and improved navigation.

  ![New GUI](/1.9/img/dcos-dash.png)

- Usability improvements to the service create workflow.

  ![Improved GUI](/1.9/img/dcos-create.png)

## Networking Services

- CNI support for 3rd party CNI plugins.
- Performance improvements across all networking features.

## Security and Governance

- DC/OS Identity and Access Management (IAM) highlights:

  - LDAP group import: support importing `posixGroup` objects according to [RFC2307](https://www.ietf.org/rfc/rfc2307) and [RFC2307bis](https://tools.ietf.org/html/draft-howard-rfc2307bis-02), and ensure compatibility with [FreeIPA](https://www.freeipa.org) and [OpenLDAP](https://www.openldap.org/).
  - SAML 2.0: ensure that the authentication flow works against [Shibboleth](https://www.shibboleth.net/products/identity-provider/) and improve compatibility with a wide range of identity provider configurations.
  - OpenID Connect: ensure that the authentication flow works against [dex](https://github.com/coreos/dex) as well as against [Azure Active Directory](https://azure.microsoft.com/en-us/services/active-directory/), and allow for customizing the identity provider certificate verification in back-channel communication. Enhance configuration validation for a better user experience.

- DC/OS CLI highlights:

  - Support single sign-on authentication via OpenID Connect and SAML 2.0 against the DC/OS IAM.
  - Support authentication with service account credentials.

- Introduce various secrets improvements (for more information, see the [secrets documentation](/1.9/security/ent/secrets/)).
- Security hardening across the platform, including Mesos, Marathon, and Admin Router.

## Developer Services

- Jenkins

    - The Jenkins DC/OS service will now work with DC/OS clusters in strict mode. <!-- (Enterprise Only) -->
    - Marathon plugin now supports service accounts, allowing easy automated and secure deploys to DC/OS clusters. <!-- (Enterprise Only) -->

## Other Improvements

### DC/OS Internals

- Update DC/OS internal JDK to 8u112 for security [fixes](http://www.oracle.com/technetwork/java/javase/2col/8u112-bugfixes-3124974.html).
- Update DC/OS internal Python from 3.4 to 3.5.
- The `dcos_generate_config.ee.sh --aws-cloudformation` command will now determine the region of the s3 bucket automatically, preventing region mistakes.
- Added `dcos-shell` which activates the DC/OS environment for running other DC/OS command line tools.
- Added the `reset-superuser` script which attempts to create or restore superuser privileges for a given DC/OS user. <!-- Enterprise -->

### Expanded OS Support

- If you install DC/OS 1.9 using the [GUI](/1.9/installing/ent/custom/gui/) or [CLI](/1.9/installing/ent/custom/cli/) installation methods, your system will be automatically upgraded to [the latest version of CentOS](https://access.redhat.com/documentation/en/red-hat-enterprise-linux/).
- CoreOS [1235.12.0](https://coreos.com/releases/#1235.12.0).

### Expanded Docker Engine Support

- Docker 1.12 and 1.13 are now [supported](/1.9/installing/ent/custom/system-requirements/). Docker 1.13 is the default version.

### Upgrades

Improved upgrade tooling and experience for on-premise installations. Upgrades now use internal DC/OS APIs to ensure nodes can be upgraded with minimal disruption to running DC/OS services on a node. The upgrade procedure has also been simplified to improve user experience.

For more information, see the [documentation](/1.9/installing/ent/upgrading/).

# <a name="known-issues"></a>Known Issues and Limitations

- DCOS_OSS-691 - DNS becomes unavailable during DC/OS version upgrades.
- DCOS-14005 - Marathon-LB does not support pods.
- DCOS-14021 - [Task logging to journald](/1.9/monitoring/logging/) disabled by default, so task logs will continue to be written to their sandboxes, and logrotated out. The `dcos task log` command will work as it did before.
- DCOS-16737 - You cannot [generate and publish AWS Advanced Templates](/1.9/installing/ent/cloud/aws/advanced/#create-your-templates) to AWS GovCloud regions. When running the command `dcos_generate_config.ee.sh --aws-cloudformation` with GovCloud credentials you will see an error similar to this:

  ```bash
  $ ./dcos_generate_config.ee.sh --aws-cloudformation
  ====> EXECUTING AWS CLOUD FORMATION TEMPLATE GENERATION
  Generating configuration files...
  Starting new HTTPS connection (1): s3.amazonaws.com
  aws_template_storage_region_name: Unable to determine region location of s3 bucket testbucket: An error occurred (InvalidAccessKeyId) when calling the GetBucketLocation operation: The AWS Access Key Id you provided does not exist in our records.
  ```
- Marathon-7133 - Marathon application history is lost after Marathon restart.
- CORE-1191 -  The Mesos master's event queue can get backlogged with the default settings, causing performance problems. These can be mitigated by setting the following configuration parameter in your `config.yaml` file at install time. See the [Configuration Reference](/1.9/installing/ent/custom/configuration/configuration-parameters/) for more information. **Note:** Lowering this parameter also reduces the number of tasks per framework that the `dcos task` subcommands can access for debugging. If you run a framework with many short tasks, such as Spark, you may not want to reduce this value.

  ```yaml
  mesos_max_completed_tasks_per_framework: 20
  ```

<a name="fixed-issues"></a>
# Issues Fixed in 1.9.5

- CORE-1292 - Remove the systemd prereq requirement of `leader.mesos` for Mesos agent.
- DOCS-2077 - DC/OS 1.9 Custom Installation documentation: clarified where the `opt/mesosphere` directory must be.
- DCOS-18830 - Dashboard CPU allocation not rounding correctly.
- DCOS-18350 - DC/OS IAM (Bouncer): set TMPDIR to `/var/lib/dcos/bouncer/tmp`. This allows `/tmp`, and other directories, to be mounted as `noexec`.
- DCOS_OSS-1574 - Navstar updated due to crashes on Core OS 1465+.
- MARATHON-7576 - Change default `UnreachableStrategy` to `0,0`.
