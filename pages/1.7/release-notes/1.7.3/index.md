---
layout: layout.pug
title: Release Notes for  1.7.3
excerpt:

enterprise: false
---

The release notes provide a list of useful topics and links for DC/OS.

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

## <a name="1-7-3"></a>1.7.3 - July 27, 2016

New features and changes:

- REX-Ray is upgraded to 0.3.3.
- Marathon is upgraded to [1.1.2](https://github.com/mesosphere/marathon/releases/tag/v1.1.2).
- New Mesos config (`'docker_stop_timeout'`) that allows you to set an explicit Docker timeout. By default this is set to `'docker_stop_timeout': '20secs'`.
- Assign disk resources to the Mesos default role, rather than all (`*`).
- The DC/OS [Admin Router](/1.7/overview/concepts/#adminrouter) now configures the Mesos master cache for less upstream stress.
- DC/OS installations on Azure now use Docker 1.11.0 (previously version 1.11.2).
- For better stability, DC/OS installations on Azure are pinned to the Ubuntu 16.04 LTS image.

Issues fixed:

- [MESOS-5389](https://issues.apache.org/jira/browse/MESOS-5389) - docker containerizer should prefix relative volume.container_path values with the path to the sandbox
- [MESOS-5680](https://issues.apache.org/jira/browse/MESOS-5680) - We should not 'chown -R' on persistent volumes every time container tries to use it
- [MESOS-5341](https://issues.apache.org/jira/browse/MESOS-5341) - Enabled docker volume support for DockerContainerizer
- [MESOS-5449](https://issues.apache.org/jira/browse/MESOS-5449) - Memory leak in SchedulerProcess.declineOffer
- [MESOS-5576](https://issues.apache.org/jira/browse/MESOS-5576) - Masters may drop the first message they send between masters after a network partition


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
