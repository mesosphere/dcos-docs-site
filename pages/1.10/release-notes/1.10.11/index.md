---
layout: layout.pug
navigationTitle:  Release Notes for 1.10.11
title: Release Notes for 1.10.11
menuWeight: 3
excerpt:
---

DC/OS 1.10.11 was released on February 12, 2019.

[button color="purple" href="https://downloads.dcos.io/dcos/stable/1.10.11/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="light" href="http://downloads.mesosphere.com/dcos-enterprise/stable/1.10.11/dcos_generate_config.ee.sh"]Download DC/OS Enterprise[/button]

# Updated Components in DC/OS 1.10.11
DC/OS 1.10.11 includes the following:
- Apache Mesos 1.4.3 [change log](https://github.com/apache/mesos/blob/e929d413328e10f6d358899500d5aaedd9d9bc51/CHANGELOG).
- Marathon 1.5.12 [change log](https://github.com/mesosphere/marathon/releases/tag/v1.5.12).
- Metronome 0.4.4 [change log](https://github.com/dcos/metronome/releases/tag/v0.4.4).

# Issues Fixed in DC/OS 1.10.11
This release of DC/OS 1.11.10 addresses a security vulnerablity for container runtimes as identified by the RunC community and registered in the [Common Vulnerabilities and Exposures (CVR)](https://cve.mitre.org/) database.

For information about other issues fixed or known issues for the most recent release of DC/OS 1.10 prior to this security fix, see the [release notes 1.10.10](https://docs.mesosphere.com/1.10/release-notes/1.10.10/).

## Mesos 
- DCOS-48052 - An update to the containerizer launch binary prevents a malicious user from exploiting the `init` helper function used by container runtimes--including DockerD, containerD, and UCR. Without this change, a malicious user could gain access to a container's root-level permissions and use those permissions to execute potentially malicious code on the host.

  This issue has been reported by the RunC community (CVE-2019-5736) and affects the Docker Engine and Mesosphere Kubernetes Engine (MKE) container runtime components. The issue has also been reported by the Apache Mesos community for the Mesosphere Universal Container Runtime (UCR). All existing versions of DC/OS, Mesosphere Kuberentes Engine, and Docker Engine are affected by this vulnerability. However, this vulnerability does not affect DC/OS clusters or UCR containers if the cluster runs using the `strict` security mode and uses the default `nobody` user account to launch UCR containers.

  For additional information about this vulnerability and its effect on DC/OS, see [Container runtime vulnerability](https://support.mesosphere.com/s/article/Known-Issue-Container-Runtime-Vulnerability-MSPH-2019-0003) and the [Docker Engine release notes](https://docs.docker.com/engine/release-notes/).

# About DC/OS 1.10

DC/OS 1.10 includes many new capabilities for operators and expands the collection of Data and Developer Services with a focus on:

- Core DC/OS service continuity - System resilience, IAM scalability and simplified upgrades.
- Robust security - Custom CA certificate and file-based secrets support. [enterprise type="inline" size="small" /]
- Enterprise-ready networking - New DC/OS Edge-LB for higher availability and security. [enterprise type="inline" size="small" /]
- Kubernetes is now available on DC/OS.
- Data services enhancements across the board.
  - Ability to deploy to CNI-Based virtual networks.
  - Rolling configuration update and upgrade support from the CLI. [enterprise type="inline" size="small" /]
  - Ability to deploy Data Services into folders to enable multi team deployments. [enterprise type="inline" size="small" /]

You can try out the new features and updated data services. Provide feedback through our support channel: <a href="https://support.mesosphere.com/">support.mesosphere.com</a>.

## New Features and Capabilities

### Networking
- You can configure Spartan to delegate a particular domain (for example, `\*.foo.company.com`) to a particular upstream.

- DC/OS supports any type of container network interface (CNI) network plugin. [View the documentation](/1.10/networking/virtual-networks/cni-plugins/).

- You can use Edge-LB load balancer to balance Mesos tasks. The Edge-LB load balancer does not support strict security mode. [View the documentation](/services/edge-lb/0.1/).[enterprise type="inline" size="small" /]

[enterprise type="block" size="large"]
### Security
[/ enterprise]

- Custom CA certificate support.
  Installation time [configuration options](/1.10/security/ent/tls-ssl/ca-custom/) have been added that allow you to configure DC/OS Enterprise to use a custom CA certificate and corresponding private key, which DC/OS then uses for issuing all component certificates. The custom CA certificate can be an intermediate CA certificate so that that all certificates used within the DC/OS cluster derive from your organization’s X.509 certification hierarchy.

- Enhanced secrets management with file-based secrets.
  You can now make a secret available to your service in the sandbox of the task. [View the documentation](/1.10/security/ent/secrets/use-secrets/).

- Vastly improved IAM scalability and performance characteristics.
  The new system removes hard limits on the number of users, groups, and permissions that can be stored, and shows stable read and write performance as the dataset grows.

- Docker `pullConfig` parameter.
  Use this parameter in your service definition to authenticate to a private Docker registry. [View the documentation](/1.10/deploying-services/private-docker-registry/#referencing-private-docker-registry-credentials-in-the-secrets-store-enterprise).

 - Enterprise CLI permissions management commands.
   It is now possible to manage permissions to protect resources using the [DC/OS Enterprise CLI](/1.10/security/ent/perms-management/).

### Kubernetes on DC/OS

- Kubernetes on DC/OS is beta with DC/OS 1.10. You can install the package from the DC/OS Service Catalog or by using the DC/OS Kubernetes [quickstart](https://github.com/mesosphere/dcos-kubernetes-quickstart).

### Updated DC/OS Data Services

- Ability to deploy to CNI-Based Virtual Networks.

- Rolling Configuration Update and Upgrades support via the CLI. [enterprise type="inline" size="small" /]

- Ability to deploy Data Services into Folders to enable multi team deployments. [enterprise type="inline" size="small" /]

The following updated data services packages are compatible with DC/OS 1.10.

- [Cassandra](/services/cassandra/)
- [Elastic](/services/elastic/)
- [HDFS](/services/hdfs/)
- [Kafka](/services/kafka/)
- [Apache Spark](/services/spark/)

For more information, see the documenation or release notes for the specific data services package in which you are interested.

### Platform
- Node and cluster health checks.
  Write your own custom health checks or use the predefined checks to access and use information about your cluster, including available ports, Mesos agent status, and IP detect script validation. [View the documentation](/1.10/installing/oss/custom/node-cluster-health-check/).

- Enhanced upgrades with [backup and restore](/1.10/administering-clusters/backup-and-restore/), and pre/post flight checks. [enterprise type="inline" size="small" /]

- Universal Container Runtime (UCR).
  Adds port mapping support for containers running on the CNI network. Port mapping support allows UCR to have a default bridge network, similar to Docker's default bridge network. This gives UCR feature parity with Docker Engine enabling use of Mesos Runtime as the default container runtime.

- Scale and performance limits.

### CLI
- DC/OS 1.10 requires DC/OS CLI 0.5.x.
- DC/OS CLI 0.5.x adds [multi-cluster support](/1.10/cli/multi-cluster-cli/) with [`dcos cluster`](/1.10/cli/command-reference/dcos-cluster) commands. Multi-cluster support has a number of consequences:

   - DC/OS CLI 0.4.x has a single configuration file, stored by default in `~/.dcos/dcos.toml`. DC/OS CLI 0.5.x has a configuration file for **each connected cluster**. Each cluster configuration file is stored by default in `~/.dcos/clusters/<cluster_id>/dcos.toml`.
   - DC/OS CLI 0.5.x introduces the `dcos cluster setup` command to configure a connection to a cluster and log into the cluster.
    -  Updating to the DC/OS CLI 0.5.x and running any CLI command triggers conversion from the old to the new configuration structure.
    
    If you attempt to update the cluster configuration using a `dcos config set` command after using `dcos cluster setup` or converting to DC/OS CLI 0.5.x, the command prints a warning message saying the command is deprecated and that cluster configuration state might now be corrupted.
  
    If you have the `DCOS_CONFIG` environment variable configured:
    - _After_ conversion to the new configuration structure, `DCOS_CONFIG` is no longer honored.
    - _Before_ you call `dcos cluster setup`, you can change the configuration pointed to by `DCOS_CONFIG` using `dcos config set`. This command prints a warning message saying the command is deprecated and recommends using `dcos cluster setup`.
  
  CLI modules are cluster-specific and stored in `~/.dcos/clusters/<cluster_id>/subcommands`. Therefore you must install a CLI module for each cluster. For example, if you connect to cluster 1, and install the Spark module, then connect to cluster 2 which is also running Spark, Spark CLI commands are not available until you install the module for that cluster.

### GUI
The GUI sidebar tabs have been updated to offer a more intuitive experience.

- The "Deployments" subpage under the "Services" tab has been moved to a toggle-able modal in the "Services" page.

- The "Security" tab has been removed. The "Secrets" tab that used to be under "Security" is now a top-level tab. [enterprise type="inline" size="small" /]

- The "Universe" tab has been renamed to "Catalog" and the "Installed" subpage has been removed.

- The "System Overview" tab has been renamed to "Overview".

## Breaking Changes
- Marathon Networking API Changes in 1.5.

  The networking section of the Marathon API has changed significantly in version 1.5. Marathon can still accept requests using the 1.4 version of the API, but it will always reply with the 1.5 version of the app definition. This will break tools that consume networking-related fields of the service definition. [View the documentation](https://github.com/mesosphere/marathon/blob/master/docs/docs/networking.md).

- TLS 1.0 is no longer enabled by default in Admin Router. [enterprise type="inline" size="small" /]

  TLS 1.0 no longer meets common minimum security requirements. To use TLS 1.0, set `adminrouter_tls_1_0_enabled` to `true` in your `config.yaml` at install time. The default is `false`.

- Moved file location for the DC/OS CA bundle in the sandbox of Mesos tasks from `$MESOS_SANDBOX/.ssl/ca.crt` to `$MESOS_SANDBOX/.ssl/ca-bundle.crt` and declared the new file path to be stable.

- Marathon-LB 1.11.0 or greater is required for DC/OS 1.10.

  Before upgrading to DC/OS 1.10, uninstall your existing Marathon-LB package and reinstall the updated version.

- REX-Ray configuration change.

  DC/OS 1.10 upgrades REX-Ray from v0.3.3 to v0.9.0 and the REX-Ray configuration format has changed. If you have specified custom REX-Ray configuration in the [`rexray_config`](/1.10/installing/oss/custom/configuration/configuration-parameters/#rexray-config) parameter of your `config.yaml` file, either update the configuration to the new format or remove `rexray_config` and set the parameter to `rexray_config_preset: aws`, which configures the `rexray_config` parameter to the default REX-Ray configuration bundled with DC/OS. This option has the benefit of automatically upgrading your cluster's REX-Ray configuration when you upgrade to a newer version of DC/OS.

  <p class="message--note"><strong>NOTE: </strong>The `rexray_config_preset: aws` option is only relevant to DC/OS clusters running on AWS.<p>

- New flow to change the `dcos_url` and log in.

  The new command to set up your cluster URL is `dcos cluster setup <dcos_url>`. For details, see [CLI](#cli).

- Hard CFS CPU limits enabled by default.

  DC/OS 1.10 enforces hard CPU limits with CFS isolation for both the Docker and Universal Container Runtimes. This will give more predictable performance across all tasks but might lead to a slowdown for tasks (and thereby also deployments) who have previously have consumed more CPU cycles than allocated. See [MESOS-6134](https://issues.apache.org/jira/browse/MESOS-6134) for more details.
