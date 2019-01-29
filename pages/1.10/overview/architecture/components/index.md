---
layout: layout.pug
navigationTitle:  Components
title: Components
menuWeight: 4
excerpt:
---

<style type="text/css">
h1 .badge,
h2 .badge,
h3 .badge,
h4 .badge,
h5 .badge {
  vertical-align: middle;
  margin-bottom: auto;
}
</style>

DC/OS is composed of many open source microservice components meticulously tuned and configured to work together.

Mesosphere DC/OS Enterprise includes most of the open source DC/OS components but also includes several additional components, modules, and plugins.

![Mesosphere DC/OS Enterprise Components](/1.10/img/dcos-enterprise-components-1.10-portrait.png)

From the top, DC/OS is a batteries-included container platform that handles container orchestration, package management, and security.

From the bottom, DC/OS is an operating system built on top of [Apache Mesos](http://mesos.apache.org/) that handles cluster management and software defined networking while simplifying logging and metrics collection.


# Cluster Management

DC/OS provides a way to view and operate a large number of individual machine-level systems as a single cluster-level system. It hides the complexity of Mesos, the distributed systems kernel, with higher level abstractions, interfaces, and tools. Cluster management is the core of that functionality, including the kernel, its dependencies, and its user interfaces.

<div data-role="collapsible">
<h2 id="apache-mesos">Apache Mesos</h2>
<div>
<p><strong>Description:</strong> Mesos manages resources and tasks as a distributed systems kernel. Mesos Master exposes scheduler, executor, and operator interfaces to facilitate cluster management. Mesos Agent manages individual executors, tasks, and resources on each <a href="/1.10/overview/concepts/#dcos-agent-node">DC/OS agent node</a>. Mesos Agent Public is a Mesos Agent configured to run on <a href="/1.10/overview/concepts/#public-agent-node">DC/OS public agent nodes</a>.</p>
<p>
  <strong>System Service(s):</strong>
  <ul>
    <li><code class="nowrap">dcos-mesos-master.service</code></li>
    <li><code class="nowrap">dcos-mesos-slave.service</code></li>
    <li><code class="nowrap">dcos-mesos-slave-public.service</code></li>
  </ul>
</p>
<p>
  <strong>See Also:</strong>
  <ul>
    <li><a href="http://mesos.apache.org/">Documentation</a></li>
    <li><a href="https://github.com/apache/mesos">Source</a></li>
    <li><a href="https://mesos.apache.org/documentation/latest/endpoints/">API Reference</a></li>
  </ul>
</p>
</div>
</div>

<div data-role="collapsible">
<h2 id="apache-zookeeper">Apache ZooKeeper</h2>
<div>
<p><strong>Description:</strong> ZooKeeper provides consistent, highly available, distributed key-value storage for configuration, synchronization, name registration, and cluster state storage.</p>
<p><strong>System Service(s):</strong> N/A - ZooKeeper is supervised by Exhibitor.</p>
<p>
  <strong>See Also:</strong>
  <ul>
    <li><a href="https://zookeeper.apache.org/">Documentation</a></li>
    <li><a href="https://github.com/apache/zookeeper">Source</a></li>
  </ul>
</p>
</div>
</div>

<div data-role="collapsible">
<h2 id="exhibitor">Exhibitor</h2>
<div>
<p><strong>Description:</strong> Exhibitor supervises ZooKeeper and provides a management web interface.</p>
<p>
  <strong>System Service(s):</strong>
  <ul>
    <li><code class="nowrap">dcos-exhibitor.service</code></li>
  </ul>
</p>
<p>
  <strong>See Also:</strong>
  <ul>
    <li><a href="https://github.com/soabase/exhibitor/wiki">Documentation</a></li>
    <li><a href="https://github.com/dcos/exhibitor">Source</a></li>
    <li><a href="https://github.com/soabase/exhibitor/wiki/REST-Introduction">API Reference</a></li>
  </ul>
</p>
</div>
</div>

<div data-role="collapsible">
<h2 id="dcos-installer">DC/OS Installer</h2>
<div>
<p><strong>Description:</strong> The DC/OS Installer (dcos_generate_config.ee.sh) generates install artifacts and installs DC/OS. As part of the install process on each node, the DC/OS Download service downloads the install artifacts from the bootstrap machine and the DC/OS Setup service installs components using the DC/OS Component Package Manager (Pkgpanda).</p>
<p>
  <strong>System Service(s):</strong>
  <ul>
    <li><code class="nowrap">dcos-download.service</code></li>
    <li><code class="nowrap">dcos-setup.service</code></li>
  </ul>
</p>
<p>
  <strong>See Also:</strong>
  <ul>
    <li><a href="/1.10/installing/oss/">Documentation</a></li>
    <li><a href="https://github.com/dcos/dcos">Source</a></li>
  </ul>
</p>
</div>
</div>

<div data-role="collapsible">
<h2 id="dcos-backup">DC/OS Backup <span class="badge badge--content-header badge--enterprise">ENTERPRISE</span></h2>
<div>
<p><strong><em>NEW IN 1.10.0</em></strong></p>
<p><strong>Description:</strong> DC/OS Backup provides backup and restore of DC/OS component state (Marathon-only in 1.10).</p>
<p>
  <strong>System Service(s):</strong>
  <ul>
    <li><code class="nowrap">dcos-backup-master.service</code></li>
    <li><code class="nowrap">dcos-backup-master.socket</code></li>
  </ul>
</p>
<p>
  <strong>See Also:</strong>
  <ul>
    <li><a href="/1.10/administering-clusters/backup-and-restore/">Documentation</a></li>
    <li><a href="/1.10/administering-clusters/backup-and-restore/backup-restore-api/">API Reference</a></li>
  </ul>
</p>
</div>
</div>

<div data-role="collapsible">
<h2 id="dcos-gui">DC/OS GUI</h2>
<div>
<p><strong>Description:</strong> The DC/OS GUI (web interface) is a browser-based system dashboard and control center.</p>
<p><strong>System Service(s):</strong> N/A - The GUI is served by Admin Router.</p>
<p>
  <strong>See Also:</strong>
  <ul>
    <li><a href="/1.10/gui/">Documentation</a></li>
    <li><a href="https://github.com/dcos/dcos-ui">Source</a></li>
  </ul>
</p>
</div>
</div>

<div data-role="collapsible">
<h2 id="dcos-cli">DC/OS CLI</h2>
<div>
<p><strong>Description:</strong> The DC/OS CLI is a terminal-based remote client.</p>
<p><strong>System Service(s):</strong> N/A - The CLI is a user downloadable binary.</p>
<p>
  <strong>See Also:</strong>
  <ul>
    <li><a href="/1.10/cli/">Documentation</a></li>
    <li><a href="https://github.com/dcos/dcos-cli">Source</a></li>
  </ul>
</p>
</div>
</div>


# Container Orchestration

Container orchestration is the continuous, automated scheduling, coordination, and management of containerized processes and the resources they consume.

DC/OS includes built-in orchestration of the most commonly used high level container-based abstractions: jobs and services. Many use cases are handled directly by these basic abstractions, but they also enable the deployment of custom schedulers for tasks that require more flexible programmatic lifecycle management automation.

<div data-role="collapsible">
<h2 id="marathon">Marathon</h2>
<div>
<p><strong>Description:</strong> Marathon orchestrates long-lived containerized services (apps and pods).</p>
<p>
  <strong>System Service(s):</strong>
  <ul>
    <li><code class="nowrap">dcos-marathon.service</code></li>
  </ul>
</p>
<p>
  <strong>See Also:</strong>
  <ul>
    <li><a href="https://mesosphere.github.io/marathon/">Website</a></li>
    <li><a href="/1.10/deploying-services/">Documentation</a></li>
    <li><a href="https://github.com/mesosphere/marathon">Source</a></li>
    <li><a href="/1.10/deploying-services/marathon-api/">API Reference</a></li>
  </ul>
</p>
</div>
</div>

<div data-role="collapsible">
<h2 id="dcos-jobs">DC/OS Jobs (Metronome)</h2>
<div>
<p><strong>Description:</strong> DC/OS Jobs (Metronome) orchestrates short-lived, scheduled or immediate, containerized jobs.</p>
<p>
  <strong>System Service(s):</strong>
  <ul>
    <li><code class="nowrap">dcos-metronome.service</code></li>
  </ul>
</p>
<p>
  <strong>See Also:</strong>
  <ul>
    <li><a href="/1.10/deploying-jobs/">Documentation</a></li>
    <li><a href="https://github.com/dcos/metronome">Source</a></li>
    <li><a href="https://dcos.github.io/metronome/docs/generated/api.html">API Reference</a></li>
  </ul>
</p>
</div>
</div>


# Container Runtimes

Container runtimes execute and manage machine level processes in isolated operating system level environments.

DC/OS supports multiple container runtimes using [Mesos' containerizer abstraction](http://mesos.apache.org/documentation/latest/containerizers/).

<div data-role="collapsible">
<h2 id="universal-container-runtime">Universal Container Runtime</h2>
<div>
<p><strong>Description:</strong> Universal Container Runtime (Mesos Containerizer) is a logical component built-in to the Mesos Agent, not technically a separate process. It containerizes Mesos tasks with configurable isolators. Universal Container Runtime supports multiple image formats, including Docker images without using Docker Engine.</p>
<p><strong>System Service(s):</strong> N/A - Universal Container Runtime is part of Mesos Agent.</p>
<p>
  <strong>See Also:</strong>
  <ul>
    <li><a href="http://mesos.apache.org/documentation/latest/containerizers/">Mesos Containerizer Documentation</a></li>
  </ul>
</p>
</div>
</div>

<div data-role="collapsible">
<h2 id="docker-engine">Docker Engine</h2>
<div>
<p><strong>Description:</strong> Docker Engine is not installed by the DC/OS Installer, but rather is a system dependency that runs on each node. Mesos Agent also includes a separate logical component called Docker Containerizer which delegates the containerization of Mesos task to Docker Engine.</p>
<p>
  <strong>System Service(s):</strong>
  <ul>
    <li><code class="nowrap">docker.service</code> - Docker Engine is not installed by the DC/OS installer.</li>
  </ul>
</p>
<p>
  <strong>See Also:</strong>
  <ul>
    <li><a href="http://mesos.apache.org/documentation/latest/docker-containerizer/">Docker Containerizer Documentation</a></li>
    <li><a href="https://docs.docker.com/engine/">Docker Engine Documentation</a></li>
    <li><a href="https://github.com/docker/docker/">Docker Engine Source</a></li>
  </ul>
</p>
</div>
</div>

<div data-role="collapsible">
<h2 id="docker-gc">Docker GC</h2>
<div>
<p><strong>Description:</strong> Docker GC periodically garbage collects Docker containers and images.</p>
<p>
  <strong>System Service(s):</strong>
  <ul>
    <li><code class="nowrap">dcos-docker-gc.service</code></li>
    <li><code class="nowrap">dcos-docker-gc.timer</code></li>
  </ul>
</p>
<p>
  <strong>See Also:</strong>
  <ul>
    <li><a href="https://github.com/spotify/docker-gc">Source</a></li>
  </ul>
</p>
</div>
</div>


# Logging and Metrics

No software runs perfectly, especially not the first time. Distribute tasks across a cluster and the normal patterns of analyzing and debugging these services become tedious and painful. So DC/OS includes several components to help ease the pain of debugging distributed systems by aggregating, caching, and streaming logs, metrics, and cluster state metadata.

<div data-role="collapsible">
<h2 id="dcos-network-metrics">DC/OS Network Metrics <span class="badge badge--content-header badge--enterprise">ENTERPRISE</span></h2>
<div>
<p><strong>Description:</strong> DC/OS Network Metrics exposes networking-related metrics. DC/OS Network Metrics is also known as the DC/OS Networking API.</p>
<p>
  <strong>System Service(s):</strong>
  <ul>
    <li><code class="nowrap">dcos-networking_api.service</code></li>
  </ul>
</p>
</div>
</div>

<div data-role="collapsible">
<h2 id="dcos-diagnostics">DC/OS Diagnostics</h2>
<div>
<p><strong>Description:</strong> DC/OS Diagnostics aggregates and exposes component health. DC/OS Diagnostics is also known as DC/OS Distributed Diagnostics Tool.</p>
<p>
  <strong>System Service(s):</strong>
  <ul>
    <li><code class="nowrap">dcos-diagnostics.service</code></li>
    <li><code class="nowrap">dcos-diagnostics.socket</code></li>
  </ul>
</p>
<p>
  <strong>See Also:</strong>
  <ul>
    <li><a href="https://github.com/dcos/dcos-diagnostics">Source</a></li>
    <li><a href="/1.10/monitoring/#system-health-http-api-endpoint">API Reference</a></li>
  </ul>
</p>
</div>
</div>

<div data-role="collapsible">
<h2 id="dcos-log">DC/OS Log</h2>
<div>
<p><strong>Description:</strong> The DC/OS Log service exposes node, component, and container (task) logs.</p>
<p>
  <strong>System Service(s):</strong>
  <ul>
    <li><code class="nowrap">dcos-log-master.service</code></li>
    <li><code class="nowrap">dcos-log-master.socket</code></li>
    <li><code class="nowrap">dcos-log-agent.service</code></li>
    <li><code class="nowrap">dcos-log-agent.socket</code></li>
  </ul>
</p>
<p>
  <strong>See Also:</strong>
  <ul>
    <li><a href="https://github.com/dcos/dcos-log">Source</a></li>
    <li><a href="/1.10/monitoring/logging/logging-api/">API Reference</a></li>
  </ul>
</p>
</div>
</div>

<div data-role="collapsible">
<h2 id="logrotate">Logrotate</h2>
<div>
<p><strong>Description:</strong> Logrotate manages rotation, compression, and deletion of historical log files.</p>
<p>
  <strong>System Service(s):</strong>
  <ul>
    <li><code class="nowrap">dcos-logrotate-master.service</code></li>
    <li><code class="nowrap">dcos-logrotate-master.timer</code></li>
    <li><code class="nowrap">dcos-logrotate-agent.service</code></li>
    <li><code class="nowrap">dcos-logrotate-agent.timer</code></li>
  </ul>
</p>
<p>
  <strong>See Also:</strong>
  <ul>
    <li><a href="https://linux.die.net/man/8/logrotate">Documentation</a></li>
    <li><a href="https://github.com/logrotate/logrotate">Source</a></li>
  </ul>
</p>
</div>
</div>

<div data-role="collapsible">
<h2 id="dcos-metrics">DC/OS Metrics</h2>
<div>
<p><strong>Description:</strong> The DC/OS Metrics service exposes node, container, and application metrics.</p>
<p>
  <strong>System Service(s):</strong>
  <ul>
    <li><code class="nowrap">dcos-metrics-master.service</code></li>
    <li><code class="nowrap">dcos-metrics-master.socket</code></li>
    <li><code class="nowrap">dcos-metrics-agent.service</code></li>
    <li><code class="nowrap">dcos-metrics-agent.socket</code></li>
  </ul>
</p>
<p>
  <strong>See Also:</strong>
  <ul>
    <li><a href="https://github.com/dcos/dcos-metrics">Source</a></li>
    <li><a href="/1.10/metrics/metrics-api/">API Reference</a></li>
  </ul>
</p>
</div>
</div>

<div data-role="collapsible">
<h2 id="dcos-signal">DC/OS Signal</h2>
<div>
<p><strong>Description:</strong> The DC/OS Signal service reports cluster telemetry and analytics to help improve DC/OS. Administrators can <a href="/1.10/installing/production/deploying-dcos/opt-out/#telemetry">opt-out of telemetry</a> at install time.</p>
<p>
  <strong>System Service(s):</strong>
  <ul>
    <li><code class="nowrap">dcos-signal.service</code></li>
    <li><code class="nowrap">dcos-signal.timer</code></li>
  </ul>
</p>
<p>
  <strong>See Also:</strong>
  <ul>
    <li><a href="https://github.com/dcos/dcos-signal">Source</a></li>
  </ul>
</p>
</div>
</div>

<div data-role="collapsible">
<h2 id="dcos-history">DC/OS History</h2>
<div>
<p><strong>Description:</strong> The DC/OS History service caches and exposes historical system state to facilitate cluster usage statistics in the GUI.</p>
<p>
  <strong>System Service(s):</strong>
  <ul>
    <li><code class="nowrap">dcos-history.service</code></li>
  </ul>
</p>
<p>
  <strong>See Also:</strong>
  <ul>
    <li><a href="https://github.com/dcos/dcos/tree/master/packages/dcos-history/extra">Source</a></li>
    <li><a href="https://github.com/dcos/dcos/tree/master/packages/dcos-history/extra#api">API Reference</a></li>
  </ul>
</p>
</div>
</div>


# Networking

In a world where machines are given numbers instead of names, tasks are scheduled automatically, dependencies are declaratively defined, and services run in distributed sets, network administration also needs to be elevated from plugging in cables to configuring software-defined networks. To accomplish this, DC/OS includes a fleet of networking components for routing, proxying, name resolution, virtual IPs, load balancing, and distributed reconfiguration.

<div data-role="collapsible">
<h2 id="admin-router">Admin Router</h2>
<div>
<p><strong>Description:</strong> Admin Router exposes a unified control plane proxy for components and services using <a href="https://www.nginx.com/">NGINX</a>. Admin Router Agent proxies node-specific health, logs, metrics, and package management internal endpoints.</p>
<p>
  <strong>System Service(s):</strong>
  <ul>
    <li><code class="nowrap">dcos-adminrouter.service</code></li>
    <li><code class="nowrap">dcos-adminrouter-agent.service</code></li>
  </ul>
</p>
<p>
  <strong>See Also:</strong>
  <ul>
    <li><a href="https://github.com/dcos/adminrouter">Source</a></li>
  </ul>
</p>
</div>
</div>

<div data-role="collapsible">
<h2 id="mesos-dns">Mesos DNS</h2>
<div>
<p><strong>Description:</strong> Mesos DNS provides domain name based service discovery within the cluster.</p>
<p>
  <strong>System Service(s):</strong>
  <ul>
    <li><code class="nowrap">dcos-mesos-dns.service</code></li>
  </ul>
</p>
<p>
  <strong>See Also:</strong>
  <ul>
    <li><a href="http://mesosphere.github.io/mesos-dns/">Documentation</a></li>
    <li><a href="https://github.com/mesosphere/mesos-dns">Source</a></li>
    <li><a href="/1.10/networking/mesos-dns/mesos-dns-api/">API Reference</a></li>
  </ul>
</p>
</div>
</div>

<div data-role="collapsible">
<h2 id="dns-forwarder">DNS Forwarder (Spartan)</h2>
<div>
<p><strong>Description:</strong> DNS Forwarder (Spartan) forwards DNS requests to multiple DNS servers. Spartan Watchdog restarts Spartan when it is unhealthy.</p>
<p>
  <strong>System Service(s):</strong>
  <ul>
    <li><code class="nowrap">dcos-spartan.service</code></li>
    <li><code class="nowrap">dcos-spartan-watchdog.service</code></li>
    <li><code class="nowrap">dcos-spartan-watchdog.timer</code></li>
  </ul>
</p>
<p>
  <strong>See Also:</strong>
  <ul>
    <li><a href="https://github.com/dcos/spartan">Source</a></li>
  </ul>
</p>
</div>
</div>

<div data-role="collapsible">
<h2 id="generate-resolv.conf">Generate resolv.conf</h2>
<div>
<p><strong>Description:</strong> Generate resolv.conf configures network name resolution by updating <code class="nowrap">/etc/resolv.conf</code> to facilitate DC/OS's software defined networking.</p>
<p>
  <strong>System Service(s):</strong>
  <ul>
    <li><code class="nowrap">dcos-gen-resolvconf.service</code></li>
    <li><code class="nowrap">dcos-gen-resolvconf.timer</code></li>
  </ul>
</p>
<p>
  <strong>See Also:</strong>
  <ul>
    <li><a href="https://github.com/dcos/dcos/blob/master/packages/dcos-net/extra/gen_resolvconf.py">Source</a></li>
  </ul>
</p>
</div>
</div>

<div data-role="collapsible">
<h2 id="minuteman">Minuteman</h2>
<div>
<p><strong>Description:</strong> Minuteman provides distributed <a href="https://en.wikipedia.org/wiki/Transport_layer">Layer 4</a> virtual IP load balancing.</p>
<p><strong>System Service(s):</strong> N/A - Included in <a href="#navstar">Navstar</a>.</p>
<p>
  <strong>See Also:</strong>
  <ul>
    <li><a href="/1.10/networking/load-balancing-vips/">Documentation</a></li>
    <li><a href="https://github.com/dcos/minuteman">Source</a></li>
  </ul>
</p>
</div>
</div>

<div data-role="collapsible">
<h2 id="navstar">Navstar</h2>
<div>
<p><strong>Description:</strong> Navstar orchestrates virtual overlay networks using <a href="https://en.wikipedia.org/wiki/Virtual_Extensible_LAN">VXLAN</a> and manages distributed Layer 4 virtual IP load balancing.</p>
<p>
  <strong>System Service(s):</strong>
  <ul>
    <li><code class="nowrap">dcos-navstar.service</code></li>
  </ul>
</p>
<p>
  <strong>See Also:</strong>
  <ul>
    <li><a href="https://github.com/dcos/navstar">Source</a></li>
  </ul>
</p>
</div>
</div>

<div data-role="collapsible">
<h2 id="epmd">Erlang Port Mapping Daemon (EPMD)</h2>
<div>
<p><strong>Description:</strong> Erlang Port Mapping Daemon (EPMD) facilitates communication between distributed Erlang programs.</p>
<p>
  <strong>System Service(s):</strong>
  <ul>
    <li><code class="nowrap">dcos-epmd.service</code></li>
  </ul>
</p>
<p>
  <strong>See Also:</strong>
  <ul>
    <li><a href="https://github.com/erlang/epmd">Source</a></li>
  </ul>
</p>
</div>
</div>


# Package Management

Just as machine operating systems need package management to install, upgrade, configure, and remove individual applications and services, a datacenter operating system needs package management to do the same for distributed services. In DC/OS there are two levels of package management: machine-level for components; and cluster-level for user services.

<div data-role="collapsible">
<h2 id="dcos-package-manager">DC/OS Package Manager (Cosmos)</h2>
<div>
<p><strong>Description:</strong> DC/OS Package Manager (Cosmos) installs and manages DC/OS packages from <a href="/1.10/administering-clusters/repo/">DC/OS package repositories</a>, such as the <a href="https://github.com/mesosphere/universe">Mesosphere Universe</a>.</p>
<p>
  <strong>System Service(s):</strong>
  <ul>
    <li><code class="nowrap">dcos-cosmos.service</code></li>
  </ul>
</p>
<p>
  <strong>See Also:</strong>
  <ul>
    <li><a href="https://github.com/dcos/cosmos">Source</a></li>
    <li><a href="/1.10/deploying-services/package-api/">API Reference</a></li>
  </ul>
</p>
</div>
</div>

<div data-role="collapsible">
<h2 id="dcos-component-package-manager">DC/OS Component Package Manager (Pkgpanda)</h2>
<div>
<p><strong>Description:</strong> DC/OS Component Package Manager (Pkgpanda) installs and manages DC/OS components.</p>
<p>
  <strong>System Service(s):</strong>
  <ul>
    <li><code class="nowrap">dcos-pkgpanda-api.service</code></li>
    <li><code class="nowrap">dcos-pkgpanda-api.socket</code></li>
  </ul>
</p>
<p>
  <strong>See Also:</strong>
  <ul>
    <li><a href="https://github.com/dcos/dcos/tree/master/pkgpanda">Source</a></li>
    <li><a href="/1.10/administering-clusters/component-management/">API Reference</a></li>
  </ul>
</p>
</div>
</div>


[enterprise]
# IAM and Security
[/enterprise]

Identity and access management in **DC/OS Enterprise** is governed by an internal database of users, user groups, and permissions. External identity providers can also be attached to take advantage of existing databases. Permissions are enforced both at the edge by Admin Router's reverse proxy and also at the component level for controlling access to specific actions. Secrets, like SSL certificates, can also be securely generated, managed, stored, and injected into user services.

<div data-role="collapsible">
<h2 id="dcos-iam">DC/OS Identity and Access Manager (Bouncer) </h2>
<div>
<p><strong>Description:</strong> DC/OS Identity and Access Manager (Bouncer) controls access to DC/OS components and services by managing users, user groups, service accounts, permissions, and identity providers. In addition to managing a local user database, DC/OS IAM can delegate to external identity providers using LDAP, SAML, or Open ID Connect. For fine grained access control, other DC/OS components, like Mesos and Marathon, integrate with DC/OS IAM directly. DC/OS IAM is also known as Bouncer.</p>
<p>
  <strong>System Service(s):</strong>
  <ul>
    <li><code class="nowrap">dcos-bouncer.service</code></li>
  </ul>
</p>
<p>
  <strong>See Also:</strong>
  <ul>
    <li><a href="/1.10/security/ent/">Documentation</a></li>
    <li><a href="/1.10/security/ent/iam-api/">API Reference</a></li>
  </ul>
</p>
</div>
</div>

<div data-role="collapsible">
<h2 id="cockroachdb">CockroachDB</h2>
<div>
<p><strong><em>NEW IN 1.10.0</em></strong></p>
<p><strong>Description:</strong> CockroachDB is a distributed SQL database built on a transactional and strongly consistent key-value store.</p>
<p><strong>Note:</strong> CockroachDB is currently only used by <a href="#dcos-iam">DC/OS Identity and Access Manager (Bouncer)</a>.</p>
<p>
  <strong>System Service(s):</strong>
  <ul>
    <li><code class="nowrap">dcos-cockroach.service</code></li>
  </ul>
</p>
<p>
  <strong>See Also:</strong>
  <ul>
    <li><a href="https://www.cockroachlabs.com/docs/">Documentation</a></li>
    <li><a href="https://github.com/cockroachdb/cockroach">Source</a></li>
  </ul>
</p>
</div>
</div>

<div data-role="collapsible">
<h2 id="dcos-certificate-authority">DC/OS Certificate Authority</h2>
<div>
<p><strong>Description:</strong> DC/OS Certificate Authority (CA) issues signed digital certificates for secure communication. DC/OS CA is based on Cloudflare's <a href="https://github.com/cloudflare/cfssl">Cfssl</a>.</p>
<p>
  <strong>System Service(s):</strong>
  <ul>
    <li><code class="nowrap">dcos-ca.service</code></li>
  </ul>
</p>
<p>
  <strong>See Also:</strong>
  <ul>
    <li><a href="/1.10/security/ent/tls-ssl/">Documentation</a></li>
    <li><a href="/1.10/security/ent/tls-ssl/ca-api/">API Reference</a></li>
  </ul>
</p>
</div>
</div>

<div data-role="collapsible">
<h2 id="dcos-secrets">DC/OS Secrets</h2>
<div>
<p><strong>Description:</strong> DC/OS Secrets provides a secure API for storing and retrieving secrets from Vault, a secret store.</p>
<p>
  <strong>System Service(s):</strong>
  <ul>
    <li><code class="nowrap">dcos-secrets.service</code></li>
  </ul>
</p>
<p>
  <strong>See Also:</strong>
  <ul>
    <li><a href="/1.10/security/ent/secrets/">Documentation</a></li>
    <li><a href="/1.10/security/ent/secrets/secrets-api/">API Reference</a></li>
  </ul>
</p>
</div>
</div>

<div data-role="collapsible">
<h2 id="vault">Vault</h2>
<div>
<p><strong>Description:</strong> Vault is a tool for securely managing secrets. A secret is anything that you want to tightly control access to, such as API keys, passwords, certificates, and more. Vault provides a unified interface to any secret, while providing tight access control and recording a detailed audit log.</p>
<p>
  <strong>System Service(s):</strong>
  <ul>
    <li><code class="nowrap">dcos-vault.service</code></li>
  </ul>
</p>
<p>
  <strong>See Also:</strong>
  <ul>
    <li><a href="https://www.vaultproject.io/docs/">Documentation</a></li>
    <li><a href="https://github.com/mesosphere/vault/">Source</a></li>
    <li><a href="https://www.vaultproject.io/api/">API Reference</a></li>
  </ul>
</p>
</div>
</div>

# Storage

DC/OS provides multiple different ways to provision and allocate disk space and volumes to tasks. One of those methods, external persistent volumes, is managed by its own component.

<div data-role="collapsible">
<h2 id="rex-ray">REX-Ray</h2>
<div>
<p><strong>Description:</strong> REX-Ray orchestrates provisioning, attachment, and mounting of external persistent volumes.</p>
<p>
  <strong>System Service(s):</strong>
  <ul>
    <li><code class="nowrap">dcos-rexray.service</code></li>
  </ul>
</p>
<p>
  <strong>See Also:</strong>
  <ul>
    <li><a href="http://rexray.readthedocs.io/">Documentation</a></li>
    <li><a href="https://github.com/codedellemc/rexray">Source</a></li>
  </ul>
</p>
</div>
</div>


<!-- # Legacy Component Changes -->


# Sockets and Timers

Several components are configured to use [systemd sockets](https://www.freedesktop.org/software/systemd/man/systemd.socket.html) which allows them to be started on-demand when a request comes in, rather than running continuously and consuming resources unnecessarily. While these sockets are separate [systemd units](https://www.freedesktop.org/software/systemd/man/systemd.unit.html) they are not considered separate components.

Several components are configured to use [systemd timers](https://www.freedesktop.org/software/systemd/man/systemd.timer.html) which allows them to be periodically executed or restarted. Periodic execution avoids continuous execution and consuming resources unnecessarily. Periodic restarting allows for picking up new configurations from downstream dependencies, like time-based DNS cache expiration. While these timers are separate [systemd units](https://www.freedesktop.org/software/systemd/man/systemd.unit.html) they are not considered separate components.


# Component Installation

DC/OS components are installed, upgraded, and managed by [DC/OS Component Package Manager (Pkgpanda)](https://github.com/dcos/dcos/tree/master/pkgpanda), a package manager for systemd units.

To see the full list of packages managed by the DC/OS installer, see the [packages directory of the DC/OS source repository](https://github.com/dcos/dcos/tree/master/packages).


# Systemd Services

Most DC/OS components run as [systemd services](/1.10/overview/concepts/#systemd-service) on the DC/OS nodes.

To see a list of the systemd components running on any particular node, list the contents of the `/etc/systemd/system/dcos.target.wants/` directory or execute `systemctl | grep dcos-` to see their current status.

## Master Node

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

## Private Agent Node

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

## Public Agent Node

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
