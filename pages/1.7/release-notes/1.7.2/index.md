---
layout: layout.pug
navigationTitle:  Release Notes for 1.7.2
title: Release Notes for 1.7.2
menuWeight: 5
excerpt: Release Notes for 1.7.2
enterprise: false
---


These release notes provide a list of useful topics and links for the 1.7.2 release of DC/OS.

# <a name="1-7-2"></a>1.7.2 - June 15, 2016

Issues fixed:

- The DNS port for Mesos masters is now open by default. This parameter is set in the `master_dns_bindall` parameter of the [configuration file](/1.7/administration/installing/ent/custom/configuration-parameters/).
- Various bug fixes to enable upgrades.


 [1]: /1.7/usage/managing-services/install/
 [2]: /1.7/administration/monitoring/
 [3]: /1.7/usage/service-discovery/virtual-ip-addresses/
 [4]: http://mesosphere.github.io/marathon/docs/persistent-volumes.html
 [5]: /1.7/usage/storage/external-storage/
 [6]: /1.7/administration/id-and-access-mgt/ent/managing-permissions/
 [7]: https://github.com/mesosphere/marathon/releases/edit/v1.0.0-RC1
 [8]: https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12311242&version=12334661
 [9]: /1.7/administration/installing/ent/custom/advanced/
 [10]: /1.7/usage/tutorials/public-app/
 [11]: https://github.com/godbus/dbus/issues/45
 [12]: https://issues.apache.org/jira/browse/MESOS-2408
 [13]: https://github.com/emccode/dvdcli/issues/15


# About 1.7

# Packages installable from the UI

You can now install packages from the DC/OS Universe with a single click in the web interface. The packages can be installed with defaults or customized directly in the UI. For more information, see the [documentation][1].

![UI Universe](/1.7/img/ui-universe.gif)

Figure 1 - DC/OS Universe
# DC/OS component health available in the UI

You can monitor the health of your cluster components from the DC/OS web interface. The component health page provides the health status of all DC/OS system components that are running in systemd. You can drill down by health status, host IP address, or specific systemd unit. For more information, see the [documentation][2].

![UI system health](/1.7/img/component-system-view.png)

Figure 2 - Component System View

# <a name="dcos"></a>Improved DC/OS installation

*   Faster automated CLI mode by use of concurrent SSH sessions and fully asynchronous execution. - Improved validation of configuration parameters. <!-- Enterprise -->

*   Distributed DNS Server to enable highly available DNS deployment for service discovery and service availability. <!-- Enterprise -->

*   Simplified process for ZooKeeper Exhibitor orchestration.

# DC/OS Networking

*   DC/OS can map traffic from a single Virtual IP (VIP) to multiple IP addresses and ports. You can assign a VIP to your application by using the DC/OS Marathon web interface.
*   Distributed DNS Server to enable highly available DNS deployment for service discovery and service availability. <!-- where is the documentation for this? -->
*   You can now use the DC/OS Networking tab in the DC/OS web interface to view aggregated metrics for Virtual IPs. You can monitor VIP performance metrics across DC/OS cluster. For more information, see the [documentation][3]. <!-- This Networking feature is enterprise only. -->
*   To enable new DNS caching and VIP features, be sure to open ports 32768-65535 inclusive for both UDP and TCP between all machines in the cluster.

# DC/OS storage services

*   **Stateful applications using Persistent Local Volumes** Configuration, formatting and enablement for DC/OS Services. For more information, see the [documentation][4].

*   **Stateful applications using External Volumes (Experimental)** Consumption (attach & detach to containers) support in DC/OS for Amazon Web Services EBS, OpenStack Cinder, EMC Isilon, ScaleIO, VMAX, XtremeIO & Google Compute Engine). For more information, see the [documentation][5].

# [enterprise] Fine-grained DC/OS access control  [/enterprise]

You can define fine-grained access to Marathon applications that are running in DC/OS by defining advanced ACL groups. Advanced ACL groups can provide multi-tenancy by isolating application teams, and individual users. For more information, see the [documentation][6].

# DC/OS Marathon Updates

<!-- Open DC/OS Edition -->

**Applications and Search** Improved global search with better ranking (fuzzy matching). Groups are now shown as part of search results too. Application list supports for browsing empty groups. Create empty groups directly from the UI. A new sidebar filter to match apps with attached volumes.

**Create and Edit form improvements** Redesigned form with improved usability. We added a completely new JSON editor. Create resident tasks with persistent local volumes from the UI. Greatly simplified port management.

**Support for Persistent Storage** You can now launch tasks that use persistent volumes by specifying volumes either via the UI or the REST API. Marathon will reserve all required resources on a matching agent, and subsequently launch a task on that same agent if needed. Data within the volume will be retained even after relaunching the associated task.

**Support for Scheduler Upgrades** Schedulers are specific applications to Marathon, since they can also launch tasks. A deployment in Marathon for upgrading schedulers also includes the migration of all tasks, the scheduler has started via a protocol.

**Support for Ports Metadata** The v2 REST API was extended to support additional ports metadata (protocol, name, and labels) through the portDefinition application field. Marathon will pass this new information to Mesos, who will in turn make it available for service discovery purposes.

**Support for HTTP based plugin extensions** Plugins can now implement HTTP endpoints.

**Updated Auth plugin interface** The Authentication and Authorization plugin interface was redesigned to support more sophisticated plugins.

**Added a leader duration metric** The metrics include now a gauge that measures the time elapsed since the last leader election happened. This is helpful to diagnose stability problems and how often leader election happens.

**Better error messages** API error messages are now more consistent and easier to understand for both humans and computers.

**Improved Task Kill behavior in deployments by performing kills in batches** When stopping/restarting an application, Marathon will now perform the kills in batches, to avoid overwhelming Mesos. Support the `TASK_KILLING` state available in Mesos 0.28

<!-- Enterprise Edition -->

**Support for Authentication and Authorization**  It is now possible to authorize operations to applications in Marathon. The authentication service in DC/OS allows defining actions, that are allowed to perform on applications. Marathon will enforce those rules. [enterprise type="inline" size="small"/]

For the full set of changes, please refer to the [Marathon Release Notes][7].

# <a name="mesos"></a>DC/OS Mesos Update

*   The Apache Mesos kernel is now at [version 0.28][8].

# <a name="known-issues"></a>Known Issues and Limitations

**DC/OS general**

*   You cannot use an NFS mount for Exhibitor storage with the automated command line installation method. To use an NFS mount for Exhibitor storage (`exhibitor_storage_backend: shared_filesystem`), you must use the [Manual command line installation method][9].
*   The Service and Agent panels of the DC/OS Web Interface won't render over 5,000 tasks. If you have a service or agent that has over 5,000 your browser may experience slowness. In this case you can close said browser tab and reopen the DC/OS web interface.
*   After providing the **Agent Private IP List**, the automated GUI installer continues to show a warning for **Master Private IP List** that you can ignore: `agent_list must be provided along with master_list`.
*   The automated GUI installer does not validate whether there are duplicate IPs in the **Master Private IP List** and **Agent Private IP List** until you go back and re-click in the **Master Private IP List** window.
*   If you stop and restart the automated GUI installer after running pre-flight, the setup page will not show you which IP detect script was selected.
*   The automated installer only provisions private agents. To install public agents please see the [documentation][10].
*   Occasionally the system health backend might panic and exit because of [this bug][11] in godbus library.
*   You can sort system health by systemd unit. However, this search can bring up misleading information as the service itself can be healthy but the node on which it runs is not. This manifests itself as a service showing "healthy" but nodes associated with that service as "unhealthy". Some people find this behavior confusing.
*   The system health API relies on Mesos DNS to know about all the cluster hosts. It finds these hosts by combining a query from `mesos.master` A records as well as `leader.mesos:5050/slaves` to get the complete list of hosts in the cluster. This system has a known bug where an agent will not show up in the list returned from `leader.mesos:5050/slaves` if the Mesos slave service is not healthy. This means the system health API will not show this host. If you experience this behavior it's most likely your Mesos slave service on the missing host is unhealthy.
*   Beginning with the next release of DC/OS the `slave_public` role for public agents is changing to `agent_public`.

**DC/OS Marathon**

*   **Persistent local volumes** With Docker, the containerPath must be relative and will always appear in `/mnt/mesos/sandbox/`. If your application (e.g. a DB) needs an absolute directory this won’t work.

    *   Volume cleanup [MESOS-2408][12]
    *   If you go above your quota, your task will be killed and that task can never recover.

*   **External/network volumes** No RO access from multiple tasks [emccode/dvdcli/issues/15][13]

*   **Authorization** - In this release we have perimeter security & auth, but not internal auth. Requests originating in the cluster - i.e. that don’t have an auth token issued by AdminRouter - are not subject to authorization. Example: Marathon-LB running on DC/OS will work as expected against a Marathon with Security Plugin enabled: It will see all apps despite not having authentication credentials. [enterprise type="inline" size="small"/]

See additional known issues at <a href="https://support.mesosphere.com" target="_blank">support.mesosphere.com</a>.

 [1]: /1.7/usage/managing-services/install/
 [2]: /1.7/administration/monitoring/
 [3]: /1.7/usage/service-discovery/virtual-ip-addresses/
 [4]: http://mesosphere.github.io/marathon/docs/persistent-volumes.html
 [5]: /1.7/usage/storage/external-storage/
 [6]: /1.7/administration/id-and-access-mgt/ent/managing-permissions/
 [7]: https://github.com/mesosphere/marathon/releases/edit/v1.0.0-RC1
 [8]: https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12311242&version=12334661
 [9]: /1.7/administration/installing/ent/custom/advanced/
 [10]: /1.7/usage/tutorials/public-app/
 [11]: https://github.com/godbus/dbus/issues/45
 [12]: https://issues.apache.org/jira/browse/MESOS-2408
 [13]: https://github.com/emccode/dvdcli/issues/15
