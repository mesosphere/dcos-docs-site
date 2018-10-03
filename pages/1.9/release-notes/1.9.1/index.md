---
layout: layout.pug
navigationTitle:  Release Notes for 1.9.1
title: Release Notes for 1.9.1
menuWeight: 45
excerpt:
---

DC/OS 1.9.1 was released on July 11, 2017.

[button color="purple" href="https://downloads.dcos.io/dcos/stable/1.9.1/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

DC/OS 1.9 includes many new capabilities and expands the collection of data and developer services, with a focus on:
- Tools for Production Operations - Monitoring and troubleshooting for distributed apps.
- Broader Workload Support - From traditional apps to machine learning.
- Security - New CLI capabilities, enhanced LDAP support, and many small improvements.
- New data and developer services. <!-- NEED A LINK -->

### Contents
- [Breaking Changes](#breaking)
- [What's New](#whats-new)
- [Known Issues and Limitations](#known-issues)
- [Issues Fixed since 1.9.0](#fixed-issues)

# <a name="breaking"></a>Breaking Changes

The DC/OS Identity and Access Management (IAM) SAML Service Provider implementation no longer accepts transient subject NameIDs.

# <a name="whats-new"></a>What's New

### Apache Mesos 1.2.1 and Marathon 1.4.5 integrated

- Marathon 1.4.5 [release notes](https://github.com/mesosphere/marathon/releases/tag/v1.4.5).
- Apache Mesos 1.2.1 [CHANGELOG](https://github.com/mesosphere/mesos/blob/dcos-mesos-1.2.1-rc1/CHANGELOG).

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
  - SAML 2.0: ensure that the authentication flow works against [Shibboleth](https://shibboleth.net/products/identity-provider.html) and improve compatibility with a wide range of identity provider configurations.
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

- If you install DC/OS 1.9 using the [GUI](/1.9/installing/ent/custom/gui/) or [CLI](/1.9/installing/ent/custom/cli/) installation methods, your system will be automatically upgraded to [the latest version of CentOS](https://access.redhat.com/documentation/en/red-hat-enterprise-linux/)
- CoreOS [1235.12.0](https://coreos.com/releases/#1235.12.0).

### Expanded Docker Engine Support

- Docker 1.12 and 1.13 are now [supported](/1.9/installing/ent/custom/system-requirements/). Docker 1.13 is the default version.

### Upgrades

Improved upgrade tooling and experience for on-premise installations. Upgrades now use internal DC/OS APIs to ensure nodes can be upgraded with minimal disruption to running DC/OS services on a node. The upgrade procedure has also been simplified to improve user experience.

For more information, see the [documentation](/1.9/installing/ent/upgrading/).

# <a name="known-issues"></a>Known Issues and Limitations

- DCOS_OSS-691 - DNS becomes briefly unavailable during DC/OS version upgrades.
- DCOS-14005 - Marathon-LB does not support pods.
- DCOS-14021 - [Task logging to journald](/1.9/monitoring/logging/) disabled by default, so task logs will continue to be written to their sandboxes, and logrotated out. The `- DCOS task log` command will work as it did before.
- DCOS-14433 - The [Universal container runtime](/1.9/deploying-services/containerizers/) does not support Azure cloud with Ubuntu.
- DCOS-16350 - You cannot retrieve metrics emitted by an application over statsd unless they are sent in a single batch. If statsd metrics are sent as a sequence of messages, only the most recently received metric will be available from the `/app` endpoint.
- DCOS-16737 - You cannot [generate and publish AWS Advanced Templates](/1.9/installing/oss/cloud/aws/advanced/#create-your-templates) to AWS GovCloud regions. When running the command `dcos_generate_config.sh --aws-cloudformation` with GovCloud credentials you will see an error similar to this:

  ```bash
  $ ./dcos_generate_config.ee.sh --aws-cloudformation
  ====> EXECUTING AWS CLOUD FORMATION TEMPLATE GENERATION
  Generating configuration files...
  Starting new HTTPS connection (1): s3.amazonaws.com
  aws_template_storage_region_name: Unable to determine region location of s3 bucket testbucket: An error occurred (InvalidAccessKeyId) when calling the GetBucketLocation operation: The AWS Access Key Id you provided does not exist in our records.
  ```

- Marathon-7133 - Marathon application history is lost after Marathon restart.

# <a name="fixed-issues"></a>Issues Fixed since 1.9.0

### Fixed issues DC/OS

- CORE-1062 - Chronos launching a Docker container causes Mesos agent to crash.
- DCOS_OSS-720 - Cryptographic Cluster ID is longer than ~50 characters.
- DCOS_OSS-743 - The prerequisite install script breaks Docker 1.13 on CentOS 7.3.
- DCOS_OSS-790 - The pid isolator is disabled for containers launched via the UCR.
- DCOS_OSS-796 - Navstar unhealthy in 1000 node cluster.
- DCOS_OSS-804 - Log messages do not contain the originating module or function name.
- DCOS_OSS-812 - Minuteman crashes for non-TCP protocol.
- DCOS_OSS-876 - Unable to designate whether GPUs (or any other type of resource) should be considered a "scarce" resource in their cluster or not. For more information, see the [`gpus_are_scarce` parameter for config.yaml](/1.9/installing/ent/custom/configuration/configuration-parameters/#gpus-are-scarce).
- DCOS_OSS-947 - When upgrading from 1.8 to 1.9, `/etc/profile.d/dcos.sh` symlink is not updated.
- DCOS_OSS-1064 - Unable to configure Exhibitor to use HTTP basic auth.
- DCOS_OSS-1102 - `dcos-signal` sends the packaging version of installed package rather than packaging version.
- DCOS-13590 - Mesos DNS compresses various fields in records that should not be compressed (e.g., SRV's Target field).
- DCOS-14302 - Chronos requires the hostname inside `/etc/hosts`.
- DCOS-14750 - Cannot see or download the logs when using the GUI installer.
- DCOS-14900 - Unable to specify custom CA cert location for private Docker registry access.  (Enterprise Only)
- DCOS-15295 - DC/OS 1.9 not working in GovCloud.  (Enterprise Only)
- DCOS-15317 - `myid` is missing from the ZooKeeper logs.
- DCOS-15471 Bouncer ZK datastore: polling thread may error out as of failed distributed lock acquisition.  (Enterprise Only)
- DCOS-15495 - DC/OS upgrade script does not support Exhibitor HTTP auth.  (Enterprise Only)
- DCOS-15653 - Log rotation happens 256 times more often than intended.
- OPS-578 - DC/OS CentOS 7 AMI has broken hostname config.
