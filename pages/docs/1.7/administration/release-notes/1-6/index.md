---
layout: layout.pug
title: DC/OS 1.6
menuWeight: 3
excerpt:
enterprise: true
featureMaturity:
---








The release notes provide a list of useful topics and links for Mesosphere DC/OS.

# DC/OS Access Control Service

You can now enable authorization and authentication in your datacenter.

*   Provides an HTTP API for managing users, groups, and access control lists.
*   Provides an interface for authentication and authorization.
*   Uses a highly available persistence layer.
*   Provides a login endpoint that allows for authentication against a DC/OS-internal set of users or against a remote directory service via LDAP 3 (RFC 4510).

For more information, see the [documentation][1].

DCOS 1.6 deprecates the use of BasicAuth.

# <a name="dcos"></a>Improved DC/OS installation

**Automated DC/OS Installer**

New automated DC/OS installer that includes a GUI or command line invocation.

*   Automated GUI installer provides a graphical user interface that guides you through the installation of DC/OS Enterprise Edition. With the GUI installer you can interactively install DC/OS to a cluster, using a minimal configuration set. This minimal configuration set includes Zookeeper as the Exhibitor shared storage and a static master list (known master IP addresses, not behind a VIP). For more information, see the [documentation][2].
*   Automated command line installer provides a guided installation of DC/OS Enterprise Edition with the full configuration set available. For more information, see the [documentation][3].

**Ease of installation**

*   A flattened configuration file that no longer includes nested hashes of `cluster_config` and `ssh_config`. All the parameters for your cluster go in one place, at one level.

**New Configuration Parameters**

*   `superuser_username` and `superuser_password_hash` are new configuration parameters for authentication to the DC/OS. For more information, see the [documentation][4].

# DC/OS Web Interface

**Integration with DC/OS access control service**

*   Access to the DC/OS web interface now requires login.
*   Superusers can manage users and groups from a corresponding control panel.
*   Superusers can control user or group access to services by adding them to the corresponding access control lists.
*   Superusers can configure a directory (LDAP) back-end for other users to authenticate against.
*   For more information, see the [documentation][5].

**Mesos UI capabilities now in the DC/OS web interface** You can view cluster task information that was previously only available in the Mesos interface.

*   **File browser** You can now browse and download files in Task sandboxes formerly found in the Mesos UI. Files can be downloaded by using the DC/OS web interface.
*   **Log Viewer** You can now view live logs for stderr and stdout in the DC/OS web interface.

**Fixes and improvements**

*   Table scrolling issue is fixed.
*   Modal sizing, resizing, and scrolling issues are fixed.
*   The Intercom button and DC/OS Tour buttons are now optional in web interface.
*   Issue with graphs showing NaN is fixed.
*   Issue with no stroke on graphs when at 0% is fixed.

# DC/OS Command Line Interface (CLI)

Added support for authentication against DC/OS access control service.

# DC/OS Marathon Upgrade

DC/OS 1.6 now includes Marathon 0.15.1 with many UI enhancements.

<a href="/wp-content/uploads/2016/02/mara-relnotes-1-6.png" rel="attachment wp-att-3392"><img src="/wp-content/uploads/2016/02/mara-relnotes-1-6-800x443.png" alt="mara-relnotes-1-6" width="800" height="443" class="alignnone size-large wp-image-3392" /></a>

*   **Perform actions directly from the Applications list** You can now perform common Marathon functions, including scale, destroy, and suspend, directly from a contextual dropdown menu in the Applications list. You no longer have to click through to the application detail view. Additionally, you can perform scale and delete operations on entire Groups!

*   **Better feedback** The feedback dialogs have been completely redesigned for clarity and usability. Color-coded severity levels are now shown: info, warning and error. The action button labels have been rephrased for improved usability. Buttons that can lead to dangerous actions, such as "force scale" are no longer preselected by default.

*   **Application Health** The health status details are now shown in the application details page.

# Advanced AWS Templates

The advanced DC/OS AWS CloudFormation Templates extend the basic DC/OS template functionality by adding the ability to instantiate a complete DC/OS cluster on an existing VPC/Subnet combination, extend/update an existing DC/OS cluster by adding more agent nodes, or create a new DC/OS cluster that consists of 1-7 masters and unlimited agent nodes.

*   New AWS Cloudformation template types available: Infra, Master, Private Agent, and Public Agent
*   Supports deployment to customer provided VPC
*   Instance Type can be specified for Master and Agent templates
*   Composable: template deployments can be deployed and combined with each other in a pluggable fashion, for multiple agent auto-scale groups, multiple DC/OS clusters within the same VPC, etc.

Contact <a href="mailto:sales@mesosphere.io" target="_blank">sales@mesosphere.io</a> for more information.

# <a name="mesos"></a>DC/OS Mesos Upgrade

The Apache Mesos kernel is now at [version 0.27][6].

*   [MESOS-1791][7]: Support for resource quota that provides non-revocable resource guarantees without tying reservations to particular Mesos agents. Please refer to the quota documentation for more information. 
*   [MESOS-191][8]: Multiple disk support to allow for disk IO intensive applications to achieve reliable, high performance. 
*   [MESOS-4085][9]: Flexible roles with the introduction of implicit roles. It deprecates the whitelist functionality that was implemented by specifying --roles during master startup to provide a static list of roles. 
*   [MESOS-2353][10]: Performance improvement of the state endpoint for large clusters. 
*   Furthermore, 167+ bugfixes and improvements made it into this release. For full release notes with all features and bug fixes, please refer to the [CHANGELOG][11].

# <a name="known-issues"></a>Known Issues and Limitations

*   You cannot use an NFS mount for Exhibitor storage with the automated command line installation method. To use an NFS mount for Exhibitor storage (`exhibitor_storage_backend: shared_filesystem`), you must use the [Manual command line installation method][12].
*   The Service and Agent panels of the DC/OS Web Interface won't render over 5,000 tasks. If you have a service or agent that has over 5,000 your browser may experience slowness. In this case you can close said browser tab and reopen the DC/OS web interface.
*   See additional known issues at <a href="https://support.mesosphere.com" target="_blank">support.mesosphere.com</a>.

 [1]: /docs/1.7/administration/id-and-access-mgt/ent/
 [2]: /docs/1.7/administration/installing/custom/gui/
 [3]: /docs/1.7/administration/installing/custom/cli/
 [4]: /docs/1.7/administration/installing/custom/cli/#scrollNav-4
 [5]: /docs/1.7/administration/id-and-access-mgt/ent/managing-users-and-groups/
 [6]: http://mesos.apache.org/blog/mesos-0-27-0-released/
 [7]: https://issues.apache.org/jira/browse/MESOS-1791
 [8]: https://issues.apache.org/jira/browse/MESOS-191
 [9]: https://issues.apache.org/jira/browse/MESOS-4085
 [10]: https://issues.apache.org/jira/browse/MESOS-2353
 [11]: https://git-wip-us.apache.org/repos/asf?p=mesos.git;a=blob_plain;f=CHANGELOG;hb=0.27.0
 [12]: /docs/1.7/administration/installing/custom/advanced/