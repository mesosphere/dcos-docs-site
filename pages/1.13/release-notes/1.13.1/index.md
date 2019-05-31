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

 - Supports `gzip` data compression when serving some UI assets (DCOS-5978, DCOS-40441).

<!--### Command-line interface (CLI) --> 

### Diagnostics and logging
- Adds configuration parameters to control timeouts for collecting log files and creating diagnostic bundles (DCOS_OSS-5097, DCOS-41821). 

    Applying a timeout enables you restrict the length of time allowed for reading `systemd` journal entries when creating consolidated diagnostics bundle for troubleshooting and analysis. You can set the following configuration parameters to control timeouts:
    - `command-exec-timeout`: Specifies the maximum number of seconds allowed for executing commands such as `docker ps`. The default is 120 seconds.
    - `diagnostics-job-timeout`: Specifies the maximum number of hours allowed for for completing a single diagnostics bundle creation job. the default is 12 hours.
    - `diagnostics-url-timeout`: Specifies the maximum number of minutes allowed for a single HTTP request. The default is 2 minutes.

### GUI
- Updates the DC/OS GUI package to ensure it correctly identifies task names that have changed between releases and displays the correct task status for tasks that were running before an upgrade (COPS-4920, DCOS-54498).

    Before applying this fix, tasks that were started prior to an upgrade might display No Data when viewing the **Tasks** tab for a service. 

### Installation
- Fixes issues that caused some DC/OS components to crash when the `/tmp` directory is mounted using the `noexec` option (DCOS-53077).

- Corrects the output returned when running the `dcos_generate_config.sh` or `dcos_generate_config.ee.sh` script with the `--validate-config` option so that it doesn't display warning or error messages about missing deprecated configuration settings such as `ssh_user` and `ssh_key_path` (COPS-4282, DCOS_OSS-4613, DCOS_OSS-5152).

- Fixes a missing echo command line in the sample `fault-domain-detect` script that generated a `command not found` error if used unmodified (DCOS-51792). 

<!--### Job management and scheduling --> 

### Marathon
- Improves handling for tasks that return a TASK_UNKNOWN state (COPS-4883, COPS-4913, MARATHON-8624). 

    In most cases, the TASK_UNKNOWN state results when there are explicit reconciliation requests for:
    - Unrecognized tasks on registered agents
    - Tasks requests on unregistered nor unreachable agents

    Prior to this fix, any app instance that returned `TASK_UNKNOWN` as a Mesos task state could cause the DC/OS API to fail with the following error:

    “TASK_UNKNOWN is an unknown Mesos task state”
    
    With this release, the TASK_UNKNOWN state is recognized by other DC/OS components. This state no longer causes operational failures or error messages that require the task to be deleted and relaunched as a new task with a new unique ID.

- Fixes an issue with scaling Marathon apps when using a persistent volume (COPS-4892, DCOS_OSS-5212, DCOS-54468).

    In some cases, Marathon tasks that used the Docker containerizer and persistent volumes could not be scaled back up to one instance after the app was suspended by scaling the instance count to zero. Before this fix, the task could be restarted but would lose its persistent volume. 
    
    The fix in this release ensure that the Marathon app can be suspended then scaled back up to a running instance without losing the persistent volume.

- Modifies support for volume profiles so that Marathon apps only match disk resources with a profile if a profile is required (DCOS_OSS-5211). 

    Previously, if you configured a Marathon app to use disk resources, but did not specify a disk profile, Marathon would match any disk resource. With this release, Marathon does not use disks resources that have a profile if the service for which it is matching offers does not require a disk with that profile.

- Provides better handling for invalid state command exceptions in InstanceTrackerActor (MARATHON-8623).

- Prevents a rare but benign unchecked null pointer exception when a deployment is canceled (MARATHON-8616).

### Metrics
- Enables framework names to be properly decoded in metric tags (DCOS_OSS-5039).

    Mesos masters allow spaces in framework names by using percent-encoding (%20) of the framework name. This release updates the Telegraf plugin to enable it to decode the framework name and export metrics with the correct tags.

### Networking
- Adds round-robin DNS support so that DNS requests do not always return address (A) records in the same order (DCOS_OSS-5118).

- Returns canonical name (CNAME) records before address (A or AAAA) records in DNS responses (DCOS_OSS-5108).

    For most DNS clients, the order in which records are returned has no affect. However, there are some DNS clients that require CNAME records to be listed before A records. This change resolves issues for DNS clients that have this requirement.

### Security
- Fixes a problem with the `dcos-iam-ldap-sync` service failing to start correctly after a system reboot (COPS-4455, COPS-4814, DCOS-48107, DCOS-53420).

    With this release, the DC/OS identity and access managment LDAP synchronization `systemd` unit no longer relies on the /opt/mesosphere directory being available when the `systemd` configuration is loaded.

- Updates the DC/OS identity and access management bouncer service to allow you to use any properly-configured web proxy to access external sites (DCOS_OSS-5167).

### Third-party updates and compatibility
- Updates the `urllib3` to version 1.24.2 to address the security vulnerability identified for Python when working with CA certificates in [CVE-2019-11324](https://nvd.nist.gov/vuln/detail/CVE-2019-11324) (DCOS-52210).

    This vulnerability is still undergoing analysis. However, an issue was detected in the Python `urllib3` library where, in certain cases, the desired set of CA certificates is different from the OS store of CA certificates. This issue could be expolited to allow successful SSL connections in situations where the validation should fail.

- Updates the DC/OS identity and access management (IAM) CockroachDB component to version 2.0.7 (DCOS-38395).

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

- Marathon-based HTTP, HTTPS, TCP, and Readiness checks <!--DCOS-42564-->

    Marathon.based HTTP, HTTPS, and TCP health checks have been deprecated since DC/OS 1.9. With this release, Marathon-based readiness checks have also been deprecated.

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
