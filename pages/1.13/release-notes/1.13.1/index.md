---
layout: layout.pug
navigationTitle: Release notes for 1.13.1
title: Release notes for 1.13.1
menuWeight: 1
excerpt: Release notes for DC/OS 1.13.1, including Open Source attribution, and version policy.
---
DC/OS 1.13.1 was released on May 31, 2019.

[button color="light" href="https://downloads.dcos.io/dcos/stable/1.13.1/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="http://downloads.mesosphere.com/dcos-enterprise/stable/1.13.1/dcos_generate_config.ee.sh"]Download DC/OS Enterprise* [/button]

Registered DC/OS Enterprise customers can access the DC/OS Enterprise configuration file from the <a href="https://support.mesosphere.com/s/downloads">support website</a>. For new customers, contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and install DC/OS Enterprise.

# Release summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

This release provides enhancements and fixes to address reported issues, integrate changes from previous releases, and maintain compatibility and support for the DC/OS ecosystem.

If you have DC/OS deployed in a production environment, see [Known issues and limitations](#known-issues) to see if any potential operational changes for specific scenarios apply to your environment.

# Issues fixed in this release
The issues that have been fixed in DC/OS 1.13.1 are grouped by feature, functional area, or component. Most change descriptions include one or more issue tracking identifiers enclosed in parentheses for reference.

### Admin Router
- Changes the maximum size allowed for uploads to a service through Admin Router (COPS-4651, DCOS-20269, DCOS-52768).

    This release increases the maximum size allowed for uploading packages from 1GB to 16GB. This change enables you to upload larger packages to a registry service without timing out the upload connection.

<!--### Command-line interface (CLI)
- 

### Diagnostics and logging --> 

### GUI
- Updates the DC/OS GUI package to ensure it correctly identifies task names that have changed between releases and displays the correct task status for tasks that were running before an upgrade (COPS-4920, DCOS-54498).

    Before applying this fix, tasks that were started prior to an upgrade might display No Data when viewing the **Tasks** tab for a service. 

### Installation
- Fixes issues that caused some DC/OS components to crash when the `/tmp` directory is mounted using the `noexec` option (DCOS-53077).

<!--### Job management and scheduling --> 

### Marathon
- Improves handling for tasks that return a TASK_UNKNOWN state (COPS-4883, COPS-4913). 

    In most cases, the TASK_UNKNOWN state results when there are explicit reconciliation requests for:
    - Unrecognized tasks on registered agents
    - Tasks requests on unregistered nor unreachable agents

    Prior to this fix, any app instance that returned `TASK_UNKNOWN` as a Mesos task state could cause the DC/OS API to fail with the following error:

    “TASK_UNKNOWN is an unknown Mesos task state”
    
    With this release, the TASK_UNKNOWN state is recognized by other DC/OS components. This state no longer causes operational failures or error messages that require the task to be deleted and relaunched as a new task with a new unique ID.

- Fixes an issue with scaling Marathon apps when using a persistent volume (COPS-4892).

    In some cases, Marathon tasks that used the Docker containerizer and persistent volumes could not be scaled back up to one instance after the app was suspended by scaling the instance count to zero. Before this fix, the task could be restarted but would lose its persistent volume. 
    
    The fix in this release ensure that the Marathon app can be suspended then scaled back up to a running instance without losing the persistent volume.

### Metrics
- Enables framework names to be properly decoded in metric tags (DCOS_OSS-5039).

    Mesos masters allow spaces in framework names by using percent-encoding (%20) of the framework name. This release updates the Telegraf plugin to enable it to decode the framework name and export metrics with the correct tags.

### Networking
- Adds round-robin DNS support so that DNS requests do not always return address (A) records in the same order (DCOS_OSS-5118).

- Returns canonical name (CNAME) records before address (A or AAAA) records in DNS responses (DCOS_OSS-5108).

    For most DNS clients, the order in which records are returned has no affect. However, there are some DNS clients that require CNAME records to be listed before A records. This change resolves issues for DNS clients that have this requirement.

### Security
- Fixes a problem with the `dcos-iam-ldap-sync` service failing to start correctly after a system reboot (COPS-4455, COPS-4814, DCOS-48107, DCOS-53420).

- Updates the DC/OS identity and access management bouncer service to allow you to use any properly-configured web proxy to access external sites (DCOS_OSS-5167).

<!--### Third-party updates and compatibility-->

# Known issues and limitations
This section covers any known issues or limitations that don’t necessarily affect all customers, but might require changes to your environment to address specific scenarios. The issues are grouped by feature, functional area, or component. Where applicable, issue descriptions include one or more tracking identifiers enclosed in parentheses for reference.
<!-- -->

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
