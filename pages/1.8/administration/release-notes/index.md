---
layout: layout.pug
navigationTitle:  Release Notes
title: Release Notes
menuWeight: 12
excerpt:
---



The release notes provide a list of useful topics and links for DC/OS.


### Contents
- [Breaking Changes](#breaking)
- [What's New](#whats-new)
- [Minor Releases](#minor)

# <a name="breaking"></a>Breaking Changes
- Removed `/marathon` endpoint on masters in favor of `/service/marathon`. Services such as [Marathon-LB](/1.8/administration/id-and-access-mgt/ent/service-auth/mlb-auth/) now require a JSON WebToken to access the Marathon API. For more information, see the [documentation](/1.8/administration/id-and-access-mgt/ent/service-auth/).
- Manual modifications of Admin Router config are no longer supported. If you require a custom certificate, you must run [HAProxy in front of Admin Router](/1.8/administration/tls-ssl/ent/haproxy-adminrouter/).
- Network Time Protocol (NTP) must be enabled on all nodes for clock synchronization. For more information, see the [documentation](/1.8/administration/installing/ent/custom/system-requirements/).
- When upgrading from 1.7 to 1.8, you must upgrade all master nodes before proceeding. The master nodes will be unusable until upgrade completes. This changed behavior is because we have upgraded the ZooKeeper security. For more information, see the [documentation](/1.8/administration/upgrading/).

# <a name="whats-new"></a>What's New

## Apache Mesos 1.0 and Marathon 1.3 integrated
- Apache Mesos 1.0 [CHANGELOG](https://github.com/apache/mesos/blob/1.0.0/CHANGELOG).
- Marathon 1.3 [release notes](https://github.com/mesosphere/marathon/releases).

## Container Orchestration
#### Services ("Built-In" Marathon)
Marathon is not just one container orchestrator out of many that we support; it is our default way to run things on DC/OS, supporting the full range of DC/OS features. In this release we'll have a major change in the Services tab in DC/OS. The native DC/OS Marathon instance UI is now fully integrated with the DC/OS UI. You can access it from the [**Services**](/1.8/usage/webinterface/) tab on the DC/OS UI. The new fully integrated UI no longer shows a list of frameworks, but shows an embedded Marathon. This means that all of your services and applications are in one place.

For more information, see the [documentation](/1.8/usage/webinterface/#services).

[preview]
#### Jobs - Ability to run scheduled jobs on DC/OS
[/preview]
There is now built-in support of running scheduled jobs. We created a new Apache Mesos framework called [Metronome](https://github.com/dcos/metronome). Metronome is integrated natively with DC/OS and is available from the [**Jobs**](/1.8/usage/webinterface/) tab on the DC/OS UI. You can create and administer scheduled jobs directly from the Jobs tab. Similar to the Services tab for long-running applications, you can manage all of your Jobs from one centralized place. You can set up jobs with a scheduler by using the cron format.

Additionally, you can specify attributes like the time zone or a starting deadline. We also have a JSON view mode which allows you to specify everything in one file to easily copy and paste it. We will constantly improve and extend the given functionality. Metronome will likely replace Chronos as our DC/OS job framework. If you still need Chronos, you can get it from the DC/OS [Universe](https://github.com/mesosphere/universe). 

For more information, see the [documentation](/1.8/usage/jobs/).

[experimental]
## DC/OS Universal container runtime
[/experimental]

The Universal container runtime extends the Mesos containerizer to support provisioning Docker and AppC container images. This means that you can use both the Mesos containerizer and other container image types in DC/OS. You can still use the Docker container runtime directly with DC/OS, but the Universal container runtime supports running Docker images independent of the Docker Engine, which allows for better integration with Mesos.

The Universal container runtime offers the following advantages:

* **Removes your dependency on the Docker daemon**: With previous versions of Docker, if the Docker daemon was not responsive, a restart to the daemon caused all containers to stop on the host. In addition, Docker must be installed on each of your agent nodes to use the Docker containerizer. This means that to use the Docker containerizer you need to upgrade Docker on the agent nodes each time a new version of Docker comes out.
* The Universal container runtime is more stable and allows deployment at scale.
* The Universal container runtime offers features not available in the Docker containerizer, such as GPU and CNI support.
* The Universal container runtime allows you to take advantage of continuing innovation within both the Mesos and DC/OS, including features such as IP per container, strict container isolation and more.

**Note**: The Universal container runtime is in the experimental phase. We encourage you to try it out and [let us know what you think](https://dcos.io/community/).

For more information, see the [documentation](/1.8/usage/containerizers/).

## Networking Services

- Improved Load Balanced VIP Availability and Reachability metrics for troubleshooting <!-- Enterprise -->

[preview]
#### IP per Container with VxLAN based Virtual Networks
[/preview]
DC/OS comes with built-in support for Virtual Networks leveraging the Container Network Interface (CNI) standard, and one default Virtual Network named `dcos`. Any container that attaches to a Virtual Network receives its own dedicated IP. This allows users to run workloads that are not friendly to dynamically assigned ports and would rather bind to the ports in their existing app configuration. Now, with dedicated IP/Container, workloads are free to bind to any port as every container has access to the entire available port range.

For more information, see the [documentation](/1.8/administration/virtual-networks/ip-per-container/).

[preview]
#### DNS Based Service Addresses for Load Balanced Virtual IPs
[/preview]
DC/OS 1.8 introduces DNS Named Service Addresses for VIPs. With DNS Named VIPs, clients connect with a service address instead of an IP address. Due to the way DNS Named VIPs are generated in DC/OS, the risk of collision associated with IP VIPs does not exist. This means that administrators do not need to carefully manage DNS Named VIPs to avoid collision. This also means DNS Named VIPs can be automatically created at the time of service installation. 

For more information, see the [documentation](/1.8/usage/service-discovery/load-balancing-vips/name-based-vips/).

[experimental]
#### Network Isolation of Virtual Network Subnets
[/experimental]
DC/OS now supports the creation of multiple virtual networks at install time and will associate non-overlapping subnets with each of the virtual networks. Further, DC/OS users can program Network Isolation rules across DC/OS agent nodes to ensure that traffic across Virtual Network subnets is isolated.

For more information, see the [documentation](/1.8/administration/virtual-networks/).

## CLI
#### Binary CLIs for Linux, Windows, and Mac
Installing the DC/OS CLI is easier than ever. We’ve replaced the install script with a simple binary CLI.

For more information, see the [documentation](/1.8/usage/cli/install/).

#### Download CLI binaries from DC/OS UI 
Download the CLI binaries directly from the DC/OS UI. For more information, see the [documentation](/1.8/usage/webinterface/).

[preview]
## Package Management Service
[/preview]
Easy to deploy offline Universe. For more information, see the [documentation](/1.8/administration/installing/ent/deploying-a-local-dcos-universe/).

## Security and Governance Services

- Security Event Audit Logging [enterprise type="inline" size="small" /] <!-- Needs more information -->
- Support for importing LDAP Groups [enterprise type="inline" size="small" /] <!-- Needs more information -->
- System components run as non-root [enterprise type="inline" size="small" /]


#### Secrets management service [enterprise type="inline" size="small" /] [preview type="inline" size="small" /]
Secure important values like private keys, credentials, and database passwords. For more information, see the [documentation](/1.8/administration/secrets/).

#### SSO with SAML/OpenID Connect [enterprise type="inline" size="small" /]  [experimental type="inline" size="small" /]
DC/OS Enterprise integrates Identity Providers that support LDAP v3 Interface (including Microsoft Active Directory) and SAML based identity providers such that you can import users external to DC/OS from your existing User Directory and manage authorization on those users and user groups within DC/OS.

For more information, see the [documentation](/1.8/administration/id-and-access-mgt/ent/sso/).

#### Cluster-wide encryption with PKI using built-in CA [enterprise type="inline" size="small" /]  [preview type="inline" size="small" /]
DC/OS Enterprise is designed to run securely on-premises and in the cloud. To ensure cluster security, DC/OS Enterprise supports encrypted communication between DC/OS system components. This is achieved by ensuring that DC/OS runs with a Certificate Authority that issues CA certificates (`CA.crt`) for each system component on the masters and agents installed  at bootstrap time. This mechanism ensures all communication between the various services within DC/OS cluster are over secure SSL/TLS channels.

For more information, see the [documentation](/1.8/administration/tls-ssl/ent/).

#### Service Accounts for secure service mutual authentication [enterprise type="inline" size="small" /] [preview type="inline" size="small" /]
DC/OS Enterprise supports the authentication of services to the Mesos master. For more information, see the [documentation](/1.8/administration/id-and-access-mgt/ent/service-auth/).

#### Comprehensive intra-cluster authentication and authorization controls (Mesos, Marathon, ZooKeeper) [enterprise type="inline" size="small" /] [preview type="inline" size="small" /]

DC/OS Enterprise can be configured to enable or require TLS/SSL encryption. For more information, see the [documentation](/1.8/administration/tls-ssl/ent/).

#### Fine-grained container level authorization controls to set-up a secure multi business group cluster access [enterprise type="inline" size="small" /]  [preview type="inline" size="small" /]
DC/OS Enterprise supports fine-grained workload isolation to enable multiple business groups within an organization to run containers and workloads within a shared cluster but still be guaranteed that there is security isolation in addition to the performance isolation provided by Linux cgroups between different workloads. Workload security isolation is performed by DC/OS Authorization modules on every node that make checks against the DC/OS IAM Service to verify that each user/service is authorized to perform each requested action.

- Mesos HTTP Authentication and Authorization
- Marathon HTTP Authentication and Authorization
- ZooKeeper Authentication and Authorization

For more information, see the [documentation](/1.8/administration/id-and-access-mgt/ent/permissions/).

#### Search/Bind and Client Certificate based authentication for LDAP/AD [enterprise type="inline" size="small" /]  [preview type="inline" size="small" /]
If your organization has user records stored in a directory server supporting LDAP, you can configure DC/OS Enterprise to check user credentials against it. This allows you to avoid having to recreate your user accounts within DC/OS. 

For more information, see the [documentation](/1.8/administration/id-and-access-mgt/ent/ldap/).

#### Identity and Access Management Service [enterprise type="inline" size="small" /] 
DC/OS Enterprise includes a built-in Identity and Access Management (IAM) Service that allows our users to create Users and Groups and assign various Authorization permissions to each user and group. DC/OS Enterprise supports following types of Users and Groups:

* Local User Accounts
* Local Service Accounts
* Local Groups
* External LDAP Users
* External LDAP Groups (only for importing into local group)
* External SAML Users
* External OAuth Users

DC/OS Enterprise IAM Service also includes support for authorization controls that can be assigned to each of the above accounts. As of DC/OS 1.8, users/services can be given specific permissions in the form "‘Subject’ can perform ‘Action’ on ‘Object’" where ‘Object’ can be an API endpoint to a particular DC/OS Service to a Marathon Application group and ‘Action’ enumerates the set of actions that are possible on the Object such as “Create, Read, Update or Delete”.

For more information, see the [documentation](/1.8/administration/id-and-access-mgt/ent/).

    
<!-- ## Cloud Installation
- Advanced AWS and Azure Templates. For more information, see the [documentation](/1.8/administration/installing/cloud/)
- Auto Scaling for AWS, including GovCloud. For more information, see the [documentation](/1.8/administration/installing/cloud/aws/). -->

## DC/OS Data services
- Scheduler authentication for all services. [enterprise type="inline" size="small" /]<!-- [Documentation]() -->
- TLS/SSL support for all frameworks. [enterprise type="inline" size="small" /]<!-- [Documentation]() -->
- Non-root user config (except Cassandra). <!-- [Documentation]() -->
- Binary CLIs for all services. 

[preview]
#### Kafka Service
[/preview]

DC/OS Universe has an updated DC/OS Kafka Service. The updated DC/OS Kafka Service now supports configuring ZK service for Apache Kafka.

For more information, see the [documentation](/services/kafka/).

[preview]
#### Confluent Kafka Service
[/preview]
DC/OS Universe has a DC/OS Confluent Platform Service that is based on the DC/OS Kafka Service. Confluent offers support for the DC/OS Confluent Platform Service on DC/OS Enterprise. 

For more information, see the Universe [documentation](https://github.com/mesosphere/universe/tree/version-3.x/repo/packages/C/confluent-kafka).

[preview]
#### Cassandra Service
[/preview]
DC/OS Universe has an updated DC/OS Cassandra Service. The updated DC/OS Cassandra Service now supports multi-datacenter Cassandra ring topologies, and backup and restore with Azure Storage. 

For more information, see the [documentation](/services/cassandra/).

[preview]
#### Datastax Enterprise (DSE) Service
[/preview]
DC/OS Universe has a DC/OS DataStax Enterprise Service that is based on the DC/OS Cassandra Service. DataStax offers support for the DC/OS DataStax Enterprise Service on DC/OS Enterprise. 

For more information, see the Universe [documentation](https://github.com/mesosphere/universe/tree/version-3.x/repo/packages/D/dse). 

[experimental]
#### HDFS Service
[/experimental]
DC/OS Universe now has a new DC/OS HDFS Service. This new DC/OS HDFS Service is an entirely new implementation sharing no code with the previous DC/OS HDFS Services. DC/OS HDFS Service can be deployed with a single command. Multiple instances of the DC/OS HDFS Service can be deployed to a single DC/OS cluster. Configuration of a DC/OS HDFS Service can updated at runtime without service interruption. DC/OS HDFS Service instances reserve all resources including CPU, Memory, Disk and Network Ports. 

For more information, see the [documentation](/services/hdfs/).

#### Spark Service 
DC/OS Universe has an updated version of Apache Spark based on 1.6.2.  In addition to all the of features of Apache Spark 1.6.2, the DC/OS Spark Service supports Kerberos and SSL with secure HDFS clusters. Latest stable Spark with coarse-grained scheduler. 

For more information, see the [documentation](/services/spark/).

## Developer Agility

- New Artifactory Package. For more information, see the [documentation](https://github.com/JFrogDev/artifactory-dcos/). [preview type="inline" size="small" /]
- New GitLab Package. For more information, see the [documentation](https://mesosphere.com/blog/2016/09/16/gitlab-dcos/). [preview type="inline" size="small" /]
- Updated Jenkins packages. For more information, see the [documentation](/services/jenkins/).

## Enhanced Cloud Templates

-  You can use customized Amazon Machine Images (AMI) based on CentOS 7 or CoreOS to launch DC/OS with the advanced templates. For more information, see the [documentation](/1.8/administration/installing/ent/cloud/aws/advanced/aws-ami/). [preview type="inline" size="small" /]
- You can create custom advanced templates for DC/OS and then deploy and run DC/OS from your own private S3 bucket. For more information, see the [documentation](/1.8/administration/installing/ent/cloud/aws/advanced/).

## Improved UI & CLI improvements
- See the CLI [release notes](https://github.com/dcos/dcos-cli/releases).

# <a name="minor"></a>Minor releases

## <a name="1-8-9"></a>1.8.9 - June 30, 2017

- Marathon 1.3.12 [release notes](https://github.com/mesosphere/marathon/releases/tag/v1.3.12).
- Apache Mesos 1.0.4 [CHANGELOG](https://github.com/mesosphere/mesos/blob/dcos-mesos-1.0.4/CHANGELOG).

### Fixed issues DC/OS

- DCOS_OSS-519 - Universe fails to list packages that are behind corporate web proxy.
- DCOS_OSS-683 - Latest Stable version of CoreOS breaks Admin Router.
- DCOS_OSS-796 - Navstar unhealthy in 1000 node cluster.
- DCOS_OSS-927 Failed to parse task error in Navstar logs.
- DCOS-10426 - Custom VIP label overwritten in JSON.
- DCOS-11781 - Zeppelin package has disappeared from DC/OS Universe GUI.
- DCOS-12054 - DC/OS GUI shows the wrong CPU percent allocation usage.
- DCOS-13598 - DC/OS History service falsely returns information in multi Master environment during failure recovery.  [enterprise type="inline" size="small" /]
- DCOS-14233 - Cannot delete service account. [enterprise type="inline" size="small" /]
- DCOS-14866 - Cross-site scripting vulnerabilities in Metronome.
- DCOS-15033 - DC/OS History component is unauthenticated.  [enterprise type="inline" size="small" /]
- DCOS-15077 - Confusing error when a package is removed from Universe, for an already installed service.
- DCOS-15542 - Cosmos fails for any request that queries Universe through a proxy with authentication.   [enterprise type="inline" size="small" /]
- DCOS-15545 - Despite `.mesos` being present in `no_proxy`, Cosmos makes requests to `http://master.mesos:8082/repo` through the proxy.  [enterprise type="inline" size="small" /]
- DCOS-15652 - Marathon HAProxy Bridge and USER networked Docker containers are not supported.
- DCOS-15653 - Excessive log rotation for Mesos logs.
- DCOS-16208 - When deploying or restarting a Docker image there is a delay of 5-10 minutes before the `myapp-subgroup-outergroup.marathon.containerip.dcos.thisdcos.directory` is resolvable.

## <a name="1-8-8"></a>1.8.8 - Feb 10, 2017

### New and changed features

- Marathon 1.3.9 [release notes](https://github.com/mesosphere/marathon/releases/tag/v1.3.9).
- Apache Mesos 1.0.3 [CHANGELOG](https://github.com/mesosphere/mesos/blob/dcos-mesos-1.0.3-rc1/CHANGELOG).

### Fixed issues DC/OS

#### DC/OS UI

- DCOS-9310 - Default memory for jobs is too low. 
- DCOS-11482 - Jobs UI wipes "artifacts" part from the JSON job descriptor.
- DCOS-11559 - Switching from Bridge to Host Networking leaves portDefinitions that can cause conflicts with Marathon-LB. 
- DCOS-11599 - Jobs attributes are stripped out and not available in UI.
- DCOS-11781 - Zeppelin package is missing from Universe in UI.
- DCOS-11887 - Cron example in the Jobs UI is wrong. 
- DCOS-11984 - Error destroying a service.
- DCOS-12724 - UI filters tabs based on incorrect adminrouter permissions. <!-- EE -->
- DCOS-13243 - Unable to revert Marathon app configuration to older version or switch between versions in the UI. 
- DCOS-13530 - Label keys in the service create form are converted to uppercase.
- DCOS-13692 - DC/OS UI server connection errors because of 10s timeout for the Universe, and 2s timeout everywhere else.

#### Networking Services

- DCOS-10809 - DNS unavailable during DC/OS upgrade. 
- DCOS-11704 - Agent node does not report virtual network logging errors.
- DCOS-12706 - LIBPROCESS_PORT must be explicitly set with Marathon (and other DC/OS services).
- DCOS-12742 - Cosmos HTTPS listening on all interfaces regardless of permission. <!-- EE -->
- DCOS-13192 - Virtual network agent modules have dependency on the Docker daemon at startup. 
- DCOS-13193 - EDNS issues. 
- DCOS-13211 - Cosmos admin and http ports are accessible from all interfaces in DC/OS. <!-- OSS -->
- DCOS-13430 - Virtual network service crashes after installing Marathon-LB.

#### Security and Governance Services

- DCOS-13589 - LDAP group import: error when we don't receive exactly one search result.
- DCOS-12731 - Reset-superuser `AttributeError` upon invocation. 
- DCOS-12730 - Bootstrap Tree schema out of sync with last upgrade bump. 
- DCOS-12729 - Upgrade fails for resource ID validation errors. 
- DCOS-12727 - User can see "directory" and "directory2", even though permission is for "directory".
- DCOS-12726 - Jobs authn/z is still enabled in disabled security mode. 
- DCOS-12725 - System doesn't stop or warn when you delete the last user in the 'Superuser' group.
- DCOS-12328 - Lowercase environment variable that draws its value from a secret is converted to all uppercase. 
- DCOS-13448 - Not all DC/OS services have explicit file descriptor limits.

### Fixed issues Marathon 

- MARATHON-1309 - App groups are not structured properly for upgrades.
- DCOS-11560 - ZooKeeper Connection Timeout is not configurable.

### Fixed issues Mesos

- MESOS-6621 - Nodes continuously restarting, cannot recover.
- MESOS-6917 - Segfault when the executor sets an invalid UUID when sending a status update.

### Known issues and limitations:

- DCOS_OSS-683 - Admin Router on DC/OS 1.8 fails with newer versions of curl. This behavior has been observed in CoreOS 1298.5.0 or newer. This can occur if you install DC/OS 1.8 with a recent version of CoreOS, or upgrade your existing distribution. This is fixed in DC/OS 1.9.
- DCOS_OSS-824 - HDFS 0.9.2-2.6.0 does not work on DC/OS 1.8 with newer versions of CoreOS. This is fixed in DC/OS 1.9.

## <a name="1-8-7"></a>1.8.7 - Nov 14, 2016

### New and changed features
- Marathon [1.3.6](https://github.com/mesosphere/marathon/releases).

### Fixed issues:
- DCOS-9705 - Marathon authn/z is not actually disabled in security disabled mode. [enterprise type="inline" size="small" /]
- DCOS-9773 - DC/OS GUI: early request termination (after 2 seconds) can often result in false negatives. [enterprise type="inline" size="small" /]
- DCOS-10696 - HTTP requests to Marathon time out. [enterprise type="inline" size="small" /]
- DCOS-10871 - Admin Router's JWT validation does not respect the expiration claim. The issue is not present in DC/OS 1.7. [enterprise type="inline" size="small" /]
- DCOS-10874 - 100% CPU usage with DC/OS Enterprise 1.8.5 with Exhibitor, Vault, and Secrets. [enterprise type="inline" size="small" /]
- DCOS-10959 - Update 1.8 Java to 8u112.
- DCOS-11002 - Azure OIDC login fails. [enterprise type="inline" size="small" /]
- DCOS-11027 - Network performance improvements for 1,000 node clusters.
- DCOS-11060 - Can't grant non-superuser access to job group. [enterprise type="inline" size="small" /]
- DCOS-11151 - Secrets broken if secrets and vault leading masters aren't on the same machine. [enterprise type="inline" size="small" /]
- DCOS-11260 - In some situations, Marathon fails to elect a leader during ZooKeeper restart.
- *Warning:* constraint validation change: Constraint validation in Marathon is significantly improved with Marathon 1.3.x. Previously acceptable values for regular expressions, such as LIKE and UNLIKE, may no longer pass validation since they are not valid regular expressions. Where possible, Marathon will correct the regular expression (specifically `*` to `.*`); however, when this is not possible, the constraint will be removed and a warning will be logged for the affected app IDs.


### Known issues and limitations:
- DCOS-11000 - ZooKeeper data is destroyed when the storage backend is lost.
- DCOS-11404 - Unable to resolve `.mesos` domains for a short time period during upgrades from DC/OS 1.7 to 1.8. For more information, see the [documentation](/1.8/administration/upgrading/).

## <a name="1-8-6"></a>1.8.6 - Oct 19, 2016

### Fixed issues:
- DCOS-10626: Fix cases in which DC/OS Marathon, Package Service, or Jobs could not restart. [enterprise type="inline" size="small" /]
- DCOS-450 - Fixed race condition in diagnostics service.

## <a name="1-8-5"></a>1.8.5 - Oct 13, 2016

### New and changed features:
- DCOS-8154 - Enterprise Marathon is upgraded to support secure DC/OS Enterprise clusters. [enterprise type="inline" size="small" /]

### Fixed issues:
- CORE-632 - Fixes for logrotation in Mesos. 
- DCOS-10057 - Destroy services button in the DC/OS UI no longer hangs when users do not have correct permissions.  
- DCOS-9165 - Strict security mode is now supported. For more information, see [documentation](/1.8/administration/installing/ent/custom/configuration-parameters/#security). [enterprise type="inline" size="small" /]
- DCOS-9430 - A JWT is no longer required to access the Mesos HTTP API in `permissive` security mode. [enterprise type="inline" size="small" /]
- DCOS-9805 - DC/OS GUI: user/group deletion may "freeze" the GUI.
- DCOS-9966 - Improved error messages are printed for NTP service startup check.
- DCOS-10203 - All `/service` endpoints become inaccessible 5 days after cluster install. 
- HTTP Proxy is now fixed. For more information, see the [documentation](/1.8/administration/installing/ent/custom/configure-proxy/). 

### Known issues and limitations:
- DCOS-9705 - Marathon authn/z is still enabled in security-disabled mode.
- DCOS-9706 - Marathon should allow anonymous requests in permissive mode.

## <a name="1-8-4"></a>1.8.4 - Sept 15, 2016

### New and changed features:
- DCOS-9173 - The upgrade documentation is updated with instructions for workaround. [enterprise type="inline" size="small" /]
- New simplified hashed-password procedure for custom installation. For more information, see the [documentation](/1.8/administration/installing/ent/custom/cli/). [enterprise type="inline" size="small" /]
- DCOS-8848 - Experimental support for unified containerizer in DC/OS.
- DOCS-1113 - `dcos jobs` command is now available in the CLI. For more information, see the [documentation](/1.8/usage/cli/command-reference/).
- DCOS-9029 - You can now administer DC/OS Enterprise security by using the dcos-enterprise-cli Universe package. For more information, see the [documentation](/1.8/administration/id-and-access-mgt/ent/service-auth/custom-service-auth/). 
- DCOS-9166 - You can now install DC/OS in security disabled mode. [enterprise type="inline" size="small" /]

### Fixed issues:
- DCOS-8208 - If you are using the CloudFormation templates to install, you will not be able to configure your ZooKeeper credentials. If you do not want to use the default credentials that DC/OS supplies, you must install via command line on each VPC instance.
- DCOS-8456 - `security: strict` and `security: disabled` modes have not yet been tested exhaustively. To avoid issues in the early access release, use the `security: permissive` mode. As `security: permissive` is the default, no action is necessary. [enterprise type="inline" size="small" /]
- DCOS-8536 - DC/OS does not currently prevent the deletion of the last user with the `dcos: superuser` permission. [enterprise type="inline" size="small" /]
- DCOS-8768 - The self-signed certificates used by DC/OS Enterprise to achieve TLS encryption do not include the host name. As a result, you cannot use the `--cacert` option in curl commands and instead must use the `-k` flag. [enterprise type="inline" size="small" /]
- DCOS-9029- Enterprise based security-enabled CLI is coming soon. [enterprise type="inline" size="small" /]
- DCOS-9090 Marathon-LB does not install with default options on an auth-enabled DC/OS cluster. For a workaround, see the [documentation](/1.8/usage/service-discovery/marathon-lb/usage-ee/).
- DCOS-7872 - The Secret Store may unexpectedly become sealed. [enterprise type="inline" size="small" /]
 - DCOS-9048 - The Secrets Store may fail to initialize. To resolve this issue, SSH into the master and issue the following command to restart the services: `sudo systemctl restart dcos-vault dcos-secrets`. [enterprise type="inline" size="small" /]
- DCOS-8214 – In multi-master configurations, only one Secrets Store will initialize. [enterprise type="inline" size="small" /]
- DCOS-9151 - Improved the creation of secrets and service accounts. [enterprise type="inline" size="small" /]
- DCOS-9273 - Added external master IPs to Admin Router certs. [enterprise type="inline" size="small" /]
- DCOS-9637 - Now reports the correct URL for AWS templates.
- DCOS-9104 - Task count and resources are correct in the UI.
- DCOS-9617 - The UID of remote users is shown in the UI.
- DCOS-9540 - Secrets service now listens on localhost only. [enterprise type="inline" size="small" /]
- DCOS-9191 - Added DNS for discoverable services to the UI. 
- DCOS-9162 - Enabled Kill and Scale for locked services.

### Known issues and limitations:
- DCOS-9706 - In permissive mode Marathon cannot operate anonymously. [enterprise type="inline" size="small" /]
- DCOS-9705 - After upgrading from 1.7 to 1.8 Marathon ACLs are not disabled. [enterprise type="inline" size="small" /]
- DCOS-9665 - Support for DC/OS Enterprise Azure templates is coming soon. [enterprise type="inline" size="small" /]
- DCOS-8889 - Certificates are removed from the DC/OS UI for scalability. [enterprise type="inline" size="small" /]
- DCOS-9277 - Disabled HTTP2 in Admin Router. [enterprise type="inline" size="small" /]
- DCOS-4298 - Time synchronization of hosts is now required. For more information, see the [system requirements](/1.8/administration/installing/ent/custom/system-requirements/#port-and-protocol).[enterprise type="inline" size="small" /]
- DCOS-9783 - Package service broken with `java.security.InvalidAlgorithmParameterException: the trustAnchors parameter must be non-empty`. The workaround is to restart the Package service (`dcos-cosmos.service`).
- DCOS-9804 - The DC/OS Enterprise CLI returns a spurious error message: `Failed to execute script dcos-security`.


## <a name="1-8-3"></a>1.8.3 - Sept 6, 2016

### New and changed features

- You can generate custom AWS Advanced templates from the custom installer file (`dcos_generate_config.ee.sh --aws-cloudformation`) and a configuration file (`config.yaml`). Only a subset of the configuration file options are allowed (e.g. `resolvers` and `exhibitor_backend` cannot be changed). For more information, see the [documentation](/1.8/administration/installing/ent/cloud/aws/advanced/).
- New version of the Jobs component ([Metronome 0.1.9](https://github.com/dcos/metronome)).
- To clarify the location of the installed files, the DC/OS installer refers to `genconf/` instead of `/genconf/`.
- CentOS AMIs are updated to include a fix for a Docker 1.11.2 bug, which caused Docker to not start.
- DC/OS can now be built using older Docker versions.
- Mesos-DNS [0.5.3-rc2](https://github.com/mesosphere/mesos-dns/blob/master/CHANGELOG).
- New custom installer option (`--set-superuser-password-hash`) will append the hashed password directly to `config.yaml`. [enterprise type="inline" size="small" /]
- Now you can now enter a password directly in a prompt. The previous methods (`--set-superuser-password-hash` and `--hash-password`) required you to enter a password on the command line, which meant that it was stored in places such as `~/.bash_history`. For more information, see the [documentation](/1.8/administration/installing/ent/custom/cli/). [enterprise type="inline" size="small" /]
- Updated DC/OS UI.
- Marathon 1.3.0-RC6 [release notes](https://github.com/mesosphere/marathon/releases)
- Updated the DC/OS Diagnostics component (`dcos-3dt.service`) with numerous bug fixes
- BUILD_DIR is no longer printed when you run the custom installer (`dcos_generate_config.ee.sh`)
- The custom DC/OS installer has been refactored and reworked. 
- `gen_resolvconf.py` will attempt to rename`resolv.conf`, but if that fails it will fall back to writing directly. 
- Client certificates are not recreated every time a DC/OS internal service starts. Instead existing certificates are used when possible. [enterprise type="inline" size="small" /]

### Fixed issues 

- DCOS-326 - Azure downloads URL is fixed.
- Bug fixes to the [mesos-overlay-modules](https://github.com/dcos/mesos-overlay-modules)
- Bug fixes to the Virtual Network Service component (`dcos-navstar.service`).
- Bug fixes for the Vault (`dcos-vault`) component. [enterprise type="inline" size="small" /]
- Bug fixes for the Secrets (`dcos-secrets`) component. Multi-Master initialization still has bugs, but more fixes are coming soon. [enterprise type="inline" size="small" /]
- Bug fixes for the Admin Router Reloader (`dcos-adminrouter-reload.service`) component which create separate reload services for masters and agents. [enterprise type="inline" size="small" /]
- Bug fixes for the Bouncer (`dcos-bouncer.service`) component, including: [enterprise type="inline" size="small" /]
    - DCOS-9348 - Bouncer LDAP client: non-TLS will probably fail w/ an AttributeError
    - DCOS-9409 - Bouncer LDAP test endpoint: 500 due to BouncerLDAPSearchNoResultError
    - DCOS-9433 - Bouncer LDAP client: KeyError: 'dn' when processing Active Directory's search result
    - DCOS-9349 - Bouncer LDAP tests: cover non-TLS connection
    - DCOS-9452 - Bouncer LDAP client: filter search results and account for search references
    - DCOS-9474 - Bouncer LDAP client: allow user/group search base to be an empty string
    - DCOS-8835 - Bouncer LDAP module: log ldap3 Tls obj __str__
    - DCOS-9008 - Bouncer LDAP client: make unbind() more resilient
    - DCOS-8117 - Get secrets and bouncer into ee without list + small fixes
- Bug fix for `dcos_audit_logging` so that DC/OS Enterprise Mesos Modules properly write info to the logs. [enterprise type="inline" size="small" /]


## Known issues and limitations

- DCOS-9610 - CLI: add cmd for starting SSO in browser, wait for auth token to be pasted
- Secrets in Multi-Master initialization has bugs, but more fixes are coming soon. [enterprise type="inline" size="small" /]
- DCOS-9560 - Deletion of nested secrets results in strange result. [enterprise type="inline" size="small" /]

## <a name="1-8-2"></a>1.8.2 - August 25, 2016

### New and changed features

- Marathon [1.3.0-RC5](https://github.com/mesosphere/marathon/releases)
- CentOS 7 AMI builder scripts
- Updated [Cosmos](https://github.com/dcos/cosmos) API for DC/OS services
- Added a flag to the custom installer, `--cli-telemetry-disabled`, to disable the CLI basic telemetry. For more information, see the [documentation](/1.8/administration/installing/ent/custom/cli/).
- Improved handling of `/etc/resolv.conf` around systemd-networkd
- Moved REX-Ray out of the agent advertised port range
- The preflight port check is different for masters and agents
- Removed SPDY and HTTP/2 from admin router (the NGINX and OpenResty is broken)
- Always enable EBS optimization for AWS clusters (EbsOptimized)
- Fold `dcos-vol-discovery-{priv,pub}-agent.service` into the appropriate `dcos-mesos-slave` service, making it easier to change the resources on a host and reset the agent
- Marathon and Jobs (Metronome) run as non-root
- Switch to `/etc/os-release` for OS Detection
- Switch to [argparse's](https://docs.python.org/3/library/argparse.html) default help for `dcos_generate_config.ee.sh`
- General internal code cleanup and technical debt fixes
- Tighten permissions on the ZooKeeper ZNode `/zookeeper` [enterprise type="inline" size="small" /]
- Updated Mesos security modules to fix some bugs [enterprise type="inline" size="small" /]
- Added dockercfg remove hook configuration (`dcos_remove_dockercfg_enable`) [enterprise type="inline" size="small" /]
- Ability to enable or disable Mesos security audit logging [enterprise type="inline" size="small" /]
- Remove the unused dcos_scheduler internal service account
- Add tests for DC/OS LDAP features
<!-- TODO: Something about DCOS_SPACE / get more details from the team building -->

### Fixed issues

- Named VIPS with 2 or more ports in use.
- `dcos-adminrouter-reload.service`
- DC/OS Diagnostics component (`dcos-3dt.service`) checking of timer units which exit non-zero (found the `dcos-adminrouter-reload` bug).

## <a name="1-8-1"></a>1.8.1 - August 2016

### Fixed issues
Over 1350 other fixes and enhancements to DC/OS and DC/OS Services, including:

- DCOS-5701 - Unable to use LDAP due to lack of search bind. [enterprise type="inline" size="small" /]
- DCOS-7415 - Unable to fetch /v2/tasks as plaintext for Marathon 0.15.3 in some cases.
- DCOS-7422 - Improved reconnect logic in the case of root Marathon / Mesos master disconnections.
- DCOS-7810 - Invalid IDs inside of nested groups leading to unexpected blocked deployments.
- DCOS-7926 - Improved Marathon performance while deploying thousands of tasks.
- DCOS-8128 - Improved Marathon task recovery in the case of some network events.
- DCOS-8370 - Apps should not be able to share the same service port on a single host.
- DCOS-8730 - Admin Router does not respect ports provided by external proxy.
- MARATHON-888 - Improved handling of orphaned containers after master failover. 
- MARATHON-956 - Improved Marathon performance to prevent occurrence of "futures timed out" errors.

### <a name="known-issues"></a>Known issues and limitations 

- DCOS-270 - Docker version 1.12.x is not supported.
- DCOS-8975 - Port mapping for virtual networks is not displayed correctly. <!-- OSS -->
- DCOS-9092 - Insecure certificate warning. <!-- For a workaround, see the [documentation](). --> [enterprise type="inline" size="small" /]
<!-- DCOS-7724 - The Secret Store requires the `dcos:superuser` permission to access. [enterprise type="inline" size="small" /] -->
- DCOS-8214 - In multi-master configurations, only one Secrets Store will initialize. To work around this issue, you must manually copy the keys to the other masters, using the following procedure. [enterprise type="inline" size="small" /]
      1. Identify the master with the functional Secrets Store and obtain its public IP address.
      2. SSH into the master with the functional Secrets Store.
      3. Issue the following command to copy the keys securely from the current master to each master with a nonfunctional Secret Store: `scp /var/lib/dcos/secrets/vault/default/* <ip-nonfunctional-master>:~` **Tip:** You will need to issue this command multiple times, once for each nonfunctional master, filling in the IP of the nonfunctional master each time.
      4. SSH into each nonfunctional master and issue the following command: `sudo cp -vf *.pub *.key /var/lib/dcos/secrets/vault/default/`
 - DCOS-8208 - If you are using the CloudFormation templates to install, you will not be able to configure your ZooKeeper credentials. If you do not want to use the default credentials that DC/OS supplies, you must install via command line on each VPC instance.
 - DCOS-8456 - `security: strict` and `security: disabled` modes have not yet been tested exhaustively. To avoid issues in the early access release, use the `security: permissive` mode. As `security: permissive` is the default, no action is necessary. [enterprise type="inline" size="small" /]
 - DCOS-8536 - DC/OS does not currently prevent the deletion of the last user with the `dcos: superuser` permission. [enterprise type="inline" size="small" /]
 - DCOS-8768 - The self-signed certificates used by DC/OS Enterprise to achieve TLS encryption do not include the host name. As a result, you cannot use the `--cacert` option in curl commands and instead must use the `-k` flag. [enterprise type="inline" size="small" /]
 - DCOS-9029- Enterprise based security-enabled CLI is coming soon. [enterprise type="inline" size="small" /]
 - DCOS-9090 Marathon-LB does not install with default options on an auth-enabled DC/OS cluster. For a workaround, see the [documentation](/1.8/usage/service-discovery/marathon-lb/usage-ee/).
 - DCOS-7872 - The Secret Store may unexpectedly become sealed. [enterprise type="inline" size="small" /]
- DCOS-9048 - The Secrets Store may fail to initialize. To resolve this issue, SSH into the master and issue the following command to restart the services: `sudo systemctl restart dcos-vault dcos-secrets`. [enterprise type="inline" size="small" /]
