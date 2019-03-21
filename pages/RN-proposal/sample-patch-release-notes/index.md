---
layout: layout.pug
navigationTitle:  Sample Release Notes 1.11.8
title: Sample Release Notes 1.11.8
menuWeight: 5
excerpt: Sample to illustrate changes to patch-level release notes
---

[button color="purple" href="https://downloads.dcos.io/dcos/stable/1.11.8/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="light" href="https://support.mesosphere.com/hc/en-us/articles/213198586"]Download DC/OS Enterprise[/button]

Version 1.11.8 - Released 7 December 2018.

# Release summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

This component-level release includes changes to improve the user experience, fix reported issues, integrate enhancements from previous releases, and maintain compatibility and support for other packages--such as Marathon and Metronome--used in DC/OS.

If you have DC/OS deployed in a production environment, see [Known issues and limitations](#known-issues) to see if any potential operational changes for specific scenarios apply to your environment.

# Issues fixed in this release
The issues that have been fixed in DC/OS 1.11.8 are grouped by feature, functional area, or component. Most change descriptions include one or more issue tracking identifiers enclosed in parenthesis for reference.

### Web-based graphical user interface (GUI)
- Updates to the DC/OS web-based user interface provide better rendering for elements such as environment variables, secrets, labels, and version information (COPS-3360, DCOS-43934). 

- For improved scalability, the DC/OS web-based user interface starts loading state information immediately after users log on (DCOS-37791, DCOS-42504).

### Marathon
- The upgrade to Marathon 1.6.x enables successful secret validation for secrets included in a Marathon JSON app definition file (COPS-3764).

### Mesos
- Service endpoints for layer-4 load balancing (`l4lb`) addresses with UCR and CNI can be configured and deployed by using the DC/OS UI or through the DC/OS CLI. A fix ensures that the configuration done through the DC/OS UI is not overwritten by using the DC/OS CLI (COPS-3573).

- The Mesos fetcher process automatically retries downloading files using their associated URI if the previously-downloaded and cached versions of the files are not found (COPS-3953).

- Changes to `dcos-log` prevent agents from overwheming the `journald ` logging facility with messages from endpoints and API requests (DCOS-41248).

- Logic changes enable nested containers to run under the same user account as the user associated with their parent container by default. For nested containers in a pod, the default executor’s user--that is, the user running the top-level container--has been the framework user. In a scenario where the framework user is a normal user but the nested container user is `root`, the change in this release enables the second-level nested containers to run as the same user--for example, the `root` user--as the parent top-level container instead of as the framework user by default (DCOS-43544).

- This release fixes an issue that could cause Mesos master endpoints—such as `reserveResources` or `createVolume`—to fail during authorization. For example, before implementing this fix, the authorization requests for an endpoint might fail or be incomplete if there’s extreme load on the IAM service. The change in this release ensures that authorization requests for an endpint are complete before continuing (DCOS-43593).

- The `cgroups` event listener code is used to poll events for a container. An update to this code ensures that the listener closes the file descriptor after read operations are complete. The fix prevents a race condition that can leave the container in an ISOLATING or PROVISIONING state (DCOS-43670, DCOS-44827).

### Metronome
- This release adds support for enhancements and issues fixed in Metronome 0.4.5 (DCOS-45564, DCOS_OSS-2535).

- Metronome initialization improvements prevent Metronome from being in an incomplete state that could cause Mesos offers and associated resources to be held in reserve waiting for the offer to be accepted or declined (DCOS_OSS-3616).

### Networking and load balancing
- The distributed layer-4 load-balancer (dcos-l4lb) network component waits to route traffic until a scale out operation is complete or its health check has passed (COPS-3924).

- This release prevents `dcos-net` from continously restarting `systemd-networkd` on a bare-metal server with bond interfaces (COPS-4034, DCOS_OSS-4398).

- For applications that use Docker containers with a Virtual IP address, backend port mapping resolves access to the application by using the `host_IP:port_number` instead of the `container_ip:port_number` (COPS-4087).

# Known issues and limitations
This section covers any known issues or limitations that don’t necessarily affect all customers, but might require changes to your environment to address specific scenarios. The issues are grouped by feature, functional area, or component. Where applicable, issue descriptions include one or more issue tracking identifiers enclosed in parenthesis for reference.

### Marathon plugin dependency
If you have custom Marathon plugins or have added any Marathon-dependent customization to your cluster, you might need to update the plugins or customized components after you upgrade to this release. For example, if you have a plugin with a dependency on Scala Logging version 3.1.0, which was compiled with Scala 2.11, you need to upgrade the Scala Logging package to version 3.7.2 compiled with Scala 2.12 to maintain compatibility with the logging library used in the Marathon package included in this release of DC/OS.

### Service account permissions for metics
Metrics in DC/OS, version 1.12 and newer, are based on Telegraf. Telegraf provides an agent-based service that runs on each master and agent node in a DC/OS cluster. By default, Telegraf gathers metrics from all of the processes running on the same node, processes them, then sends the collected information to a central metrics database. The  Telegraf program runs under the service accounts `dcos_telegraf_master` and `dcos_telegraf_agent`. These two service account must be granted `dcos::superuser` permissions.

# Updated components change lists
For access to the logs that track specific changes to components that are included in the DC/OS distribution, see the following links:
- Apache Mesos 1.5.x [change log](https://github.com/apache/mesos/blob/b97f0ba29d40a279dec00ffe51512e3b5a146049/CHANGELOG).
- Marathon 1.6.564 [change log](https://github.com/mesosphere/marathon/blob/48bfd6000c544df5ae03de04b42b019d5e9dbd4b/changelog.md).
- Metronome 0.4.4 [change log](https://github.com/dcos/metronome/blob/22945457c7cb10cb14d575ceeb137edd8158ba3c/changelog.md).
- DC/OS 1.12.1 [summary log](https://docs.mesosphere.com/1.11/release-notes/1.11.8/).

# Previous releases
To review changes from a recent previous release, see the following links:
- [Release version 1.10.9](https://docs.mesosphere.com/1.10/release-notes/1.10.9/) - 16 November 2018.
- [Release version 1.11.7](https://docs.mesosphere.com/1.11/release-notes/1.11.7/) - 6 December 2018.
- [Release version 1.12.0](https://docs.mesosphere.com/1.12/release-notes/1.12.0/) - 24 October 2018.
