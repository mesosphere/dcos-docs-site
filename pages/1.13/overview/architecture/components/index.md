---
layout: layout.pug
navigationTitle:  Components
title: Components
menuWeight: 4
excerpt: Understanding DC/OS components

---

DC/OS is composed of many open source microservice components meticulously tuned and configured to work together. Mesosphere DC/OS Enterprise includes most of the open source DC/OS components but also includes several additional components, modules, and plugins.

![Mesosphere DC/OS Enterprise Components](/1.13/img/dcos-components-1-12-updated.png)

Figure 1 - DC/OS components

From the top, DC/OS is an inclusive container platform that handles container orchestration, package management, and security. From the bottom, DC/OS is an operating system built on top of [Apache Mesos](http://mesos.apache.org/) that handles cluster management and software defined networking, while simplifying logging and metrics collection.

<a name="cluster-management"><a>
# Cluster management

DC/OS provides a way to view and operate a large number of individual machine-level systems as a single cluster-level system. It hides the complexity of Mesos, the distributed systems kernel, with higher level abstractions, interfaces, and tools. Cluster management is the core of that functionality, including the kernel, its dependencies, and its user interfaces.

<a name="apache-mesos"></a>
## Apache Mesos

Mesos manages resources and tasks as a distributed systems kernel. Mesos Master exposes scheduler, executor, and operator interfaces to facilitate cluster management. Mesos Agent manages individual executors, tasks, and resources on each [DC/OS agent node](/1.13/overview/concepts/#dcos-agent-node). Mesos Agent Public is a Mesos Agent configured to run on [DC/OS public agent nodes](/1.13/overview/concepts/#public-agent-node).

### System services

- `dcos-mesos-master.service`
- `dcos-mesos-slave.service`
- `dcos-mesos-slave-public.service`

Read the following documentation resources to learn more about Apache Mesos:

- [Documentation](http://mesos.apache.org/)
- [Source](https://github.com/apache/mesos)
- [API Reference](https://mesos.apache.org/documentation/latest/endpoints/)

<a name="apache-zookeeper"></a>
## Apache ZooKeeper

ZooKeeper provides consistent, highly available, distributed key-value storage for configuration, synchronization, name registration, and cluster state storage.

### System services

N/A - ZooKeeper is supervised by Exhibitor.

Read the following documentation resources to learn more about Apache ZooKeeper:

- [Documentation](https://zookeeper.apache.org/)
- [Source](https://github.com/apache/zookeeper)


<a name="exhibitor"></a>
## Exhibitor

Exhibitor supervises ZooKeeper and provides a management web interface.

### System service

- `dcos-exhibitor.service`

Read the following documentation resources to learn more about Exhibitor:

- [Documentation](https://github.com/soabase/exhibitor/wiki)
- [Source](https://github.com/dcos/exhibitor)
- [API Reference](https://github.com/soabase/exhibitor/wiki/REST-Introduction)

<a name="dcos-installer"></a>

## DC/OS Installer

The DC/OS Installer (`dcos_generate_config.ee.sh`) generates install artifacts and installs DC/OS. As part of the install process on each node, the DC/OS Download service downloads the install artifacts from the bootstrap machine and the DC/OS Setup service installs components using the DC/OS Component Package Manager (Pkgpanda).

### System services

- `dcos-download.service`
- `dcos-setup.service`

Read the following documentation resources to learn more about DC/OS and installation methods:

- [Documentation](/1.13/installing/)
- [Source](https://github.com/dcos/dcos)

[enterprise]
<a name="dcos-backup"></a>

## DC/OS backup
[/enterprise]
DC/OS Backup provides backup and restore of DC/OS component state (Marathon-only in 1.10).

### System services

- `dcos-backup-master.service`
- `dcos-backup-master.socket`

Read the following documentation resources to learn more about backing up and restoring your cluster:

- [Documentation](/1.13/administering-clusters/backup-and-restore/)
- [API Reference](/1.13/administering-clusters/backup-and-restore/backup-restore-api/)


<a name="dcos-gui"></a>

## DC/OS GUI

The DC/OS GUI (web interface) is a browser-based system dashboard and control center.

### System service

N/A - The GUI is served by Admin Router.

Read the following documentation resources to learn more about DC/OS GUI:

- [Documentation](/1.13/gui/)
- [Source](https://github.com/dcos/dcos-ui)


<a name="dcos-cli"></a>

## DC/OS CLI

The DC/OS CLI is a terminal-based remote client.

### System service

N/A - The CLI is a user downloadable binary.

Read the following documentation resources to learn more about DC/OS CLI:

- [Documentation](/1.13/cli/)
- [Source](https://github.com/dcos/dcos-cli)

# Container orchestration

Container orchestration is the continuous, automated scheduling, coordination, and management of containerized processes and the resources they consume. DC/OS includes built-in orchestration of the most commonly used high level container-based abstractions: jobs and services. Many use cases are handled directly by these basic abstractions, but they also enable the deployment of custom schedulers for tasks that require more flexible programmatic lifecycle management automation.

<a name="marathon"></a>

## Marathon

Marathon orchestrates long-lived containerized services (apps and pods).

### System service

- `dcos-marathon.service`

Read the following documentation resources to learn more about DC/OS Marathon:

- [Website](https://mesosphere.github.io/marathon/)
- [Documentation](/1.13/deploying-services/)
- [Source](https://github.com/mesosphere/marathon)
- [API Reference](/1.13/deploying-services/marathon-api/)

<a name="dcos-jobs"></a>

## DC/OS jobs (Metronome)

DC/OS jobs (Metronome) orchestrates short-lived, scheduled or immediate, containerized jobs.

### System service

- `dcos-metronome.service`

Read the following documentation resources to learn more about DC/OS Metronome:

- [Documentation](/1.13/deploying-jobs/)
- [Source](https://github.com/dcos/metronome)
- [API Reference](https://dcos.github.io/metronome/docs/generated/api.html)

# Container runtimes

Container runtimes execute and manage machine level processes in isolated operating system level environments. DC/OS supports multiple container runtimes using [Mesos' containerizer abstraction](http://mesos.apache.org/documentation/latest/containerizers/).

<a name="universal-container-runtime"></a>

## Universal Container Runtime

Universal Container Runtime (Mesos Containerizer) is a logical component built-in to the Mesos Agent, not technically a separate process. It containerizes Mesos tasks with configurable isolators. Universal Container Runtime supports multiple image formats, including Docker images without using Docker Engine.

### System service

N/A - Universal Container Runtime is part of Mesos Agent.

Read the following documentation resource to learn more about Universal Container Runtime:

- [Mesos Containerizer Documentation](http://mesos.apache.org/documentation/latest/containerizers/)

<a name="docker-engine"></a>

## Docker Engine

Docker Engine is not installed by the DC/OS Installer, but rather is a system dependency that runs on each node. The Mesos Agent also includes a separate logical component called Docker Containerizer which delegates the containerization of Mesos task to Docker Engine.

### System service

- `docker.service` - Docker Engine is not installed by the DC/OS installer.

Read the following documentation resource to learn more about Docker Engine:

- [Docker ContainerizerDocumentation](http://mesos.apache.org/documentation/latest/docker-containerizer)
- [Docker Engine Documentation](https://docs.docker.com/engine/)
- [Docker Engine Source](https://github.com/docker/docker/)


<a name="docker-gc"></a>
## Docker GC

Docker GC periodically collects Docker "garbage" containers and images.

### System services

- `dcos-docker-gc.service`
- `dcos-docker-gc.timer`

Read the following documentation resource to learn more about Docker GC:

- [Source](https://github.com/spotify/docker-gc)

# Logging and metrics

No software runs perfectly, especially not the first time. Distributing tasks across a cluster, as well as the normal patterns of analyzing and debugging these services, become tedious. DC/OS includes several components to help ease the pain of debugging distributed systems by aggregating, caching, and streaming logs, metrics, and cluster state metadata.

<a name="dcos-network-metrics"></a>
[enterprise]

## DC/OS network metrics
[/enterprise]

DC/OS network metrics exposes networking-related metrics. DC/OS network metrics are also known as the DC/OS Networking API.

### System service

- `dcos-networking_api.service`

<a name="dcos-diagnostics"></a>

## DC/OS diagnostics

DC/OS diagnostics aggregate and expose component health. DC/OS diagnostics are also known as DC/OS Distributed Diagnostics Tool.

### System services

- `dcos-diagnostics.service`
- `dcos-diagnostics.socket`

Read the following documentation resources to learn more about DC/OS Diagnostics:

- [Source](https://github.com/dcos/dcos-diagnostics)
- [API Reference](/1.13/monitoring/#system-health-http-api-endpoint)

<a name="dcos-log"></a>

## DC/OS log

The DC/OS log service exposes node, component, and container (task) logs.

### System services

- `dcos-log-master.service`
- `dcos-log-master.socket`
- `dcos-log-agent.service`
- `dcos-log-agent.socket`

Read the following documentation resources to learn more about DC/OS Logs:

- [Source](https://github.com/dcos/dcos-log)
- [API Reference](/1.13/monitoring/logging/logging-api/)

<a name="logrotate"></a>

## Logrotate

Logrotate manages rotation, compression, and deletion of historical log files.

### System services

- `dcos-logrotate-master.service`
- `dcos-logrotate-master.timer`
- `dcos-logrotate-agent.service`
- `dcos-logrotate-agent.timer`

Read the following documentation resources to learn more about DC/OS Logrotate:

- [Documentation](https://linux.die.net/man/8/logrotate)
- [Source](https://github.com/logrotate/logrotate)

<a name="telegraf"></a>

## Telegraf

Telegraf is a configurable metrics pipeline. By default, it collects system, container, and application metrics.

### System services

- `dcos-telegraf.service`
- `dcos-telegraf.socket`

Read the following documentation resources to learn more about DC/OS Telegraf:

- [Source](https://github.com/dcos/telegraf)
- [API Reference](/1.13/metrics/metrics-api/)

<a name="dcos-signal"></a>

## DC/OS signal

The DC/OS signal service reports cluster telemetry and analytics to help improve DC/OS. Administrators can [opt out of telemetry](/1.13/installing/oss/opt-out/#telemetry) at installation time.

### System services

- `dcos-signal.service`
- `dcos-signal.timer`

Read the following documentation resources to learn more about DC/OS Signal:

- [Source](https://github.com/dcos/dcos-signal)

<a name="dcos-history"></a>

## DC/OS history

The DC/OS history service caches and exposes the historical system state to facilitate cluster usage statistics in the GUI.

### System service

- `dcos-history.service`

Read the following documentation resources to learn more about DC/OS History:

- [Source](https://github.com/dcos/dcos/tree/master/packages/dcos-history/extra)
- [API Reference](https://github.com/dcos/dcos/tree/master/packages/dcos-history/extra#api)

# Networking

In a world where machines are given numbers instead of names, tasks are scheduled automatically, dependencies are declaratively defined, and services run in distributed sets, network administration also needs to be elevated from plugging in cables to configuring software-defined networks. To accomplish this, DC/OS includes a fleet of networking components for routing, proxying, name resolution, virtual IPs, load balancing, and distributed reconfiguration.

<a name="admin-router"></a>

## Admin Router

Admin Router exposes a unified control plane proxy for components and services using [NGINX](https://www.nginx.com/). Admin Router Agent provides proxies for node-specific health, logs, metrics, and package management internal endpoints.

### System services

- `dcos-adminrouter.service`
- `dcos-adminrouter-agent.service`

Read the following documentation resource to learn more about DC/OS Admin Router:

- [Source](https://github.com/dcos/adminrouter)

<a name="mesos-dns"></a>

## Mesos DNS

Mesos DNS provides domain name based service discovery within the cluster.

### System service

- `dcos-mesos-dns.service`

Read the following documentation resources to learn more about Mesos DNS:

- [Documentation](http://mesosphere.github.io/mesos-dns/)
- [Source](https://github.com/mesosphere/mesos-dns)
- [API Reference](/1.13/networking/DNS/mesos-dns/mesos-dns-api/)

<a name="dns-forwarder"></a>

## DC/OS Net

`dcos-net` is an Erlang VM that hosts the following networking applications:
- `dcos-dns`: A distributed DNS-based service discovery.
- `dcos-overlay`: An SDN solution for UCR and Docker containers.
- `dcos-l4lb`: A distributed layer-4 load-balancer.

### System services

- `dcos-net.service`
- `dcos-net-watchdog.service`

Read the following documentation resource to learn more about DC/OS Net:

- [Source](https://github.com/dcos/dcos-net)

<a name="generate-resolv.conf"></a>

## `Generate resolv.conf`

`Generate resolv.conf` configures network name resolution by updating `/etc/resolv.conf` to facilitate DC/OS's software defined networking.

### System services

- `dcos-gen-resolvconf.service`
- `dcos-gen-resolvconf.timer`

Read the following documentation resource to learn more about `Generate resolv.conf`:

- [Source](https://github.com/dcos/dcos/blob/master/packages/dcos-net/extra/gen_resolvconf.py)

# Package management

Just as machine operating systems need package management to install, upgrade, configure, and remove individual applications and services, a datacenter operating system needs package management to do the same for distributed services. In DC/OS there are two levels of package management: machine-level for components; and cluster-level for user services.


<a name="dcos-package-manager"></a>

## DC/OS package manager (Cosmos)

The DC/OS package manager (Cosmos) installs and manages DC/OS packages from [DC/OS package repositories](/1.13/administering-clusters/repo/), such as the [Mesosphere Universe](https://github.com/mesosphere/universe).

### System service

- `dcos-cosmos.service`

Read the following documentation resources to learn more about DC/OS Package Manager (Cosmos):

- [Source](https://github.com/dcos/cosmos)
- [API Reference](/1.13/deploying-services/package-api/)

<a name="dcos-component-package-manager"></a>

## DC/OS Component Package Manager (Pkgpanda)

DC/OS Component Package Manager (Pkgpanda) installs and manages DC/OS components.

### System Service

- `dcos-pkgpanda-api.service`
- `dcos-pkgpanda-api.socket`


Read the following documentation resources to learn more about DC/OS Component Package Manager (Pkgpanda):

- [Source](https://github.com/dcos/dcos/tree/master/pkgpanda)
- [API Reference](/1.13/administering-clusters/component-management/)

[enterprise]
# IAM and Security
[/enterprise]

Identity and access management in DC/OS Enterprise is governed by an internal database of users, user groups, and permissions. External identity providers can also be attached to take advantage of existing databases. Permissions are enforced both at the edge by Admin Router's reverse proxy and also at the component level for controlling access to specific actions. Secrets, like SSL certificates, can also be securely generated, managed, stored, and injected into user services.

<a name="dcos-iam"></a>

## DC/OS Identity and Access Manager (Bouncer)

DC/OS Identity and Access Manager (IAM) controls access to DC/OS components and services by managing users, user groups, service accounts, permissions, and identity providers. In addition to managing a local user database, DC/OS IAM can delegate to external identity providers using LDAP, SAML, or Open ID Connect. For fine grained access control, other DC/OS components, like Mesos and Marathon, integrate with DC/OS IAM directly. DC/OS IAM is also known as Bouncer.

### System service

- `dcos-bouncer.service`

Read the following documentation resources to learn more about DC/OS Identity and Access Manager (Bouncer):

- [Documentation](/1.13/security/)
- [API Reference](/1.13/security/ent/iam-api/)

<a name="cockroachdb"></a>

## CockroachDB

CockroachDB is a distributed SQL database built on a transactional and strongly consistent key-value store.

<p class="message--note"><strong>NOTE: </strong> CockroachDB is currently only used by <a href="#dcos-iam">DC/OS Identity and Access Manager</a>.</p>

### System service

- `dcos-cockroach.service`

Read the following documentation resources to learn more about CockroachDB:

- [Documentation](https://www.cockroachlabs.com/docs/)
- [Source](https://github.com/cockroachdb/cockroach)

<a name="dcos-certificate-authority"></a>

## DC/OS Certificate Authority

DC/OS Certificate Authority (CA) issues signed digital certificates for secure communication. DC/OS CA is based on Cloudflare's <a href="https://github.com/cloudflare/cfssl">Cfssl</a>.

### System service

- `dcos-ca.service`

Read the following documentation resources to learn more about DC/OS Certificate Authority:

- [Documentation](/1.13/security/ent/tls-ssl/)
- [API Reference](/1.13/security/ent/tls-ssl/ca-api/)

<a name="dcos-secrets"></a>

## DC/OS secrets

DC/OS secrets provide a secure API for storing and retrieving secrets from Vault, a secret store.

### System service

- `dcos-secrets.service`

Read the following documentation resources to learn more about DC/OS Secrets:
- [Documentation](/1.13/security/ent/secrets/)
- [API Reference](/1.13/security/ent/secrets/secrets-api/)

<a name="vault"></a>
## Vault

Vault is a tool for securely managing secrets. A secret is anything that you want to control access to, such as API keys, passwords, certificates, and more. Vault provides a unified interface to any secret, while providing tight access control and recording a detailed audit log.

### System service

- `dcos-vault.service`

Read the following documentation resources to learn more about Vault:

- [Documentation](https://www.vaultproject.io/docs/)
- [Source](https://github.com/mesosphere/vault/)
- [API Reference](https://www.vaultproject.io/api/)

# Storage

DC/OS provides many different ways to provision and allocate disk space and volumes to tasks. One of those methods, external persistent volumes, is managed by its own component.

<a name="rex-ray"></a>

## REX-Ray

REX-Ray orchestrates provisioning, attachment, and mounting of external persistent volumes.

### System service

- `dcos-rexray.service`

Read the following documentation resources to learn more about REX-Ray:

- [Documentation](http://rexray.readthedocs.io/)
- [Source](https://github.com/codedellemc/rexray)

# Sockets and timers

Several components are configured to use on-demand [systemd sockets](https://www.freedesktop.org/software/systemd/man/systemd.socket.html) which allows them to be started when a request comes in, rather than running continuously and consuming resources unnecessarily. While these sockets are separate [systemd units](https://www.freedesktop.org/software/systemd/man/systemd.unit.html) they are not considered separate components.

Several components are configured to use [systemd timers](https://www.freedesktop.org/software/systemd/man/systemd.timer.html) which allows them to be periodically executed or restarted. Periodic execution avoids continuous execution and consuming resources unnecessarily. Periodic restarting allows for picking up new configurations from downstream dependencies, like time-based DNS cache expiration. While these timers are separate [systemd units](https://www.freedesktop.org/software/systemd/man/systemd.unit.html) they are not considered separate components.

# Component installation

DC/OS components are installed, upgraded, and managed by [DC/OS Component Package Manager (Pkgpanda)](https://github.com/dcos/dcos/tree/master/pkgpanda), a package manager for `systemd` units.

To see the full list of packages managed by the DC/OS installer, see the [packages directory of the DC/OS source repository](https://github.com/dcos/dcos/tree/master/packages).

# `Systemd` services

Most DC/OS components run as [systemd services](/1.13/overview/concepts/#systemd-service) on the DC/OS nodes.

To see a list of the `systemd` components running on any particular node, list the contents of the `/etc/systemd/system/dcos.target.wants/` directory or execute `systemctl | grep dcos-` to see their current status.

## Master node

```
$ ls /etc/systemd/system/dcos.target.wants/ -1
dcos-adminrouter.service
dcos-backup-master.service
dcos-backup-master.socket
dcos-bouncer-legacy.service
dcos-bouncer.service
dcos-ca.service
dcos-cockroach.service
dcos-cosmos.service
dcos-diagnostics.service
dcos-diagnostics.socket
dcos-epmd.service
dcos-exhibitor.service
dcos-gen-resolvconf.service
dcos-gen-resolvconf.timer
dcos-history.service
dcos-log-master.service
dcos-log-master.socket
dcos-logrotate-master.service
dcos-logrotate-master.timer
dcos-marathon.service
dcos-mesos-dns.service
dcos-mesos-master.service
dcos-metrics-master.service
dcos-metrics-master.socket
dcos-metronome.service
dcos-navstar.service
dcos-networking_api.service
dcos-pkgpanda-api.service
dcos-secrets.service
dcos-secrets.socket
dcos-signal.service
dcos-signal.timer
dcos-spartan.service
dcos-spartan-watchdog.service
dcos-spartan-watchdog.timer
dcos-vault.service
```

## Private agent node

```
$ ls /etc/systemd/system/dcos.target.wants/ -1
dcos-adminrouter-agent.service
dcos-diagnostics.service
dcos-diagnostics.socket
dcos-docker-gc.service
dcos-docker-gc.timer
dcos-epmd.service
dcos-gen-resolvconf.service
dcos-gen-resolvconf.timer
dcos-log-agent.service
dcos-log-agent.socket
dcos-logrotate-agent.service
dcos-logrotate-agent.timer
dcos-mesos-slave.service
dcos-metrics-agent.service
dcos-metrics-agent.socket
dcos-navstar.service
dcos-pkgpanda-api.service
dcos-rexray.service
dcos-signal.timer
dcos-spartan.service
dcos-spartan-watchdog.service
dcos-spartan-watchdog.timer
```

## Public agent node

```
$ ls /etc/systemd/system/dcos.target.wants/ -1
dcos-adminrouter-agent.service
dcos-diagnostics.service
dcos-diagnostics.socket
dcos-docker-gc.service
dcos-docker-gc.timer
dcos-epmd.service
dcos-gen-resolvconf.service
dcos-gen-resolvconf.timer
dcos-log-agent.service
dcos-log-agent.socket
dcos-logrotate-agent.service
dcos-logrotate-agent.timer
dcos-mesos-slave-public.service
dcos-metrics-agent.service
dcos-metrics-agent.socket
dcos-navstar.service
dcos-pkgpanda-api.service
dcos-rexray.service
dcos-signal.timer
dcos-spartan.service
dcos-spartan-watchdog.service
dcos-spartan-watchdog.timer
```
