---
layout: layout.pug
navigationTitle:  Release Notes for 1.9.0 RC1
title: Release Notes for 1.9.0 RC1
menuWeight: 70
excerpt:
---

These are the release notes for DC/OS 1.9.0 Release Candidate 1.

[button color="purple" href="https://downloads.dcos.io/dcos/EarlyAccess/commit/26d16366a29aba258541a8653b00522c4c1c21fc/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

DC/OS 1.9 includes many new capabilities and expands the collection of data and developer services, with a focus on:
- Tools for Production Operations - Monitoring and troubleshooting for distributed apps.
- Broader Workload Support - From traditional apps to machine learning.
- Security - New CLI capabilities, enhanced LDAP support, and many small improvements.
- New data and developer services. <!-- NEED A LINK -->

Please try out the new features and updated services. Provide any feedback through our support channel: [support.mesosphere.com](https://support.mesosphere.com/).

### Contents
- [What's New](#whats-new)
- [Known Issues and Limitations](#known-issues)

# <a name="whats-new"></a>What's New

### Apache Mesos 1.2 and Marathon 1.4 integrated

- Apache Mesos 1.2 [CHANGELOG](https://github.com/apache/mesos/blob/1.2.x/CHANGELOG).
- Marathon 1.4 [release notes](https://github.com/mesosphere/marathon/releases).

## Container Orchestration

- Pods - Multiple co-located containers per instance, scheduled on the same host. For more information, see the [documentation](/1.9/deploying-services/pods/). [preview type="inline" size="small" /]
- GPU - Leverage GPUs to run novel algorithms. For more information, see the [documentation](/1.9/deploying-services/gpu/). [preview type="inline" size="small" /]
- Significant scalability improvements.

## DC/OS Monitoring and Operations

[experimental]
### Remote Process Injection for Debugging
[/experimental]

The new `dcos task exec` command allows you to remotely execute a process inside the container of a deployed Mesos task, providing the following features.

- An optional `--interactive` flag for interactive sessions.
- Attach to a remote pseudoterminal (aka PTY) inside a container via the optional `--tty` flag.
- Combine the `--interactive` and `--tty` flags to launch an interactive bash session or to run `top` and see the resource usage of your container in real time.

For more information, see the documentation for the `dcos task exec` command [here](/1.9/monitoring/debugging/).

[experimental]
### Logging
[/experimental]

Stream task and system logs to journald by setting the `mesos_container_log_sink` install-time parameter to `journald` or `journald+logrotate`. This allows you to:

- Include task metadata like container ID in your queries to more easily locate the logs that you want.
- Use the new DC/OS CLI commands `dcos node log` and `dcos task log` to query logs. You can also make HTTP requests directly against the new Logging API.
- Set up log aggregation solutions such as Logstash to get logs into their aggregated storage solutions.

For more information, see the [documentation](/1.9/monitoring/logging/).

[experimental]
### Metrics 
[/experimental]

- Node-level HTTP API that returns metrics from task, cgroup allocations per container, and host level metrics such as load and memory allocation.
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

### Expanded OS Support

- CentOS [7.3](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/7/html/7.3_Release_Notes/index.html).
- CoreOS [1235.8.0](https://coreos.com/releases/#1235.8.0).

### Expanded Docker Engine Support

- Docker 1.12 is now [supported](/1.9/installing/ent/custom/system-requirements/).

### Upgrades

Improved upgrade tooling and experience for on-premise installations. Upgrades now use internal DC/OS APIs to ensure nodes can be upgraded with minimal disruption to running DC/OS services on a node. The upgrade procedure has also been simplified to improve user experience.

For more information, see the [documentation](/1.9/installing/ent/upgrading/).

# <a name="known-issues"></a>Known Issues and Limitations

- Marathon-LB does not support pods.
- If you install DC/OS 1.9 by using the [GUI](/1.9/installing/ent/custom/gui/) or [CLI](/1.9/installing/ent/custom/cli/) install methods, your system will be automatically upgraded to CentOS 7.3.
- The next 1.9 release candidate will use CentOS 7.3 as the default version.
- The next 1.9 release candidate will use Docker 1.13 as the default version.
- The next 1.9 release candidate will have [task logging to journald](/1.9/monitoring/logging/) disabled by default, so task logs will continue to be written to their sandboxes, and logrotated out. The `dcos task log` command will work as it did before.
- [4137](https://github.com/mesosphere/marathon/issues/4137) - Volumes do not persist.
