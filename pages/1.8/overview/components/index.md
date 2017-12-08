---
layout: layout.pug
navigationTitle:  Components
title: Components
menuWeight: 4
excerpt:
featureMaturity:
enterprise: true
---




DC/OS is comprised of many individual open source components that are precisely configured to work together. 

You can log into any host in the DC/OS cluster and view the currently running services by inspecting the <code>/etc/systemd/system/dcos.target.wants/</code> directory. 

You can view the DC/OS component details in the <a href="https://github.com/dcos/dcos/">https://github.com/dcos/dcos/</a> repo in the packages directory. 


<table class="table">
  <tr>
    <th>Component</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>Admin Router Agent</td>
    <td>This component (<code>dcos-adminrouter-agent<code>) is a high performance web server and a reverse proxy server that lists all of the agent nodes in your cluster.</td>
  </tr>
  <tr>
    <td>Admin Router Master</td>
    <td>This component is a high performance web server and a reverse proxy server that lists all of the master nodes in your cluster.</td>
  </tr>
  <tr>
    <td>Admin Router Reloader</td>
    <td>This component <code>dcos-adminrouter-reload.service</code> restarts the Admin Router Nginx server so that it can pick up new DNS resolutions, for example <code>master.mesos</code> and <code>leader.mesos</code>.</td>
  </tr>
  <tr>
    <td>Admin Router Reloader Timer</td>
    <td>This component <code>dcos-adminrouter-reload.timer</code> sets the Admin Router Reloader interval at once per hour.</td>
  </tr>
 <tr>
    <td>Admin Router Service</td>
    <td>This component is an open-source Nginx configuration created by Mesosphere that provides central authentication and proxy to DC/OS services within the cluster. The Admin Router service <code>dcos-adminrouter.service </code> is the core internal load balancer for DC/OS. Admin Router is a customized <a href="https://www.nginx.com/resources/wiki/">Nginx</a> that proxies all of the internal services on port <code>80</code>.</td>
  </tr>
  <tr>
    <td>Certificate Authority</td>
    <td>This component <code>dcos-ca.service</code> is the DC/OS Certificate Authority feature. For more information, see the <a href="/1.8/administration/id-and-access-mgt/">documentation</a>.</td>
  </tr><tr>
    <td>Cluster ID</td>
    <td>The cluster-id service generates a universally unique identifier (UUID) for each cluster. We use this ID to track cluster health remotely (if enabled). This remote tracking allows our support team to better assist our customers.</td>
  </tr>
  <tr>
    <td>Diagnostics</td>
    <td><p>This component <code>dcos-3dt.service</code> is the diagnostics utility for DC/OS systemd components. This service runs on every host, tracking the internal state of the systemd unit. The service runs in two modes, with or without the <code>-pull</code> argument. If running on a master host, it executes <code>/opt/mesosphere/bin/3dt -pull</code> which queries Mesos-DNS for a list of known masters in the cluster, then queries a master (usually itself) <code>:5050/statesummary</code> and gets a list of agents.</p><p>From this complete list of cluster hosts, it queries all 3DT health endpoints <code>:<adminrouter_port>/system/health/v1</code>. This endpoint returns health state for the DC/OS systemd units on that host. The master 3DT processes, along with doing this aggregation also expose <code>/system/health/v1</code> endpoints to feed this data by <code>unit</code> or <code>node</code> IP to the DC/OS user interface.</p></td>
  </tr>
  <tr>
    <td>Diagnostics socket</td>
    <td>This component <code>dcos-3dt.socket</code> is the DC/OS Distributed Diagnostics Tool master API and aggregation socket.</td>
  </tr>
  <tr>
    <td>DNS Dispatcher</td>
    <td>This component <code>dcos-spartan.service</code> is an RFC5625 Compliant DNS Forwarder. It's job is to dual-dispatch DNS to multiple upstream resolvers, and to route DNS to the upstreams or Mesos DNS, depending on some rules.</td>
  </tr>
  <tr>
    <td>DNS Dispatcher Watchdog</td>
    <td>This component (<code>dcos-spartan-watchdog.service</code>) ensures that the DNS Dispatcher is running and healthy. If the DNS Dispatcher is unhealthy, this watchdog service kills it.</td>
  </tr>
  <tr>
    <td>DNS Dispatcher Watchdog Timer</td>
    <td>This component <code>dcos-spartan-watchdog.timer</code> wakes up the DNS Dispatcher Watchdog every 5 minutes, to see if DC/OS needs to restart DNS Dispatcher.</td>
  </tr>  
  <tr>
    <td>Downloads Service
        </td>
    <td>This component (<code>dcos-download.service<code>) downloads the DC/OS installation tarball on first boot.</td>
  </tr>
  <tr>
    <td>Erlang Port Mapping Daemon</td>
    <td>This component <code>dcos-epmd.service</code> supports the internal DC/OS layer 4 load balancer that is called <a href="https://github.com/dcos/minuteman">Minuteman</a>.</td>
  </tr>
  <tr>
    <td>Exhibitor</td>
    <td>This component <code>dcos-exhibitor.service</code> is the <a href="https://github.com/soabase/exhibitor">Exhibitor</a> supervisor for Zookeeper. DC/OS uses Exhibitor, a project originally from Netflix, to manage and automate the deployment of <a href="/1.8/overview/concepts/#exhibitorforzookeeper">ZooKeeper</a>.</td>
  </tr>
  <tr>
    <td>Generate resolv.conf</td>
    <td>This component <code>dcos-gen-resolvconf.service</code> dynamically provisions <code>/etc/resolv.conf</code> so that each cluster host can use Mesos-DNS to resolve task names to the IP and port addresses.</td>
  </tr>
  <tr>
    <td>Generate resolv.conf Timer</td>
    <td>This component <code>dcos-gen-resolvconf.timer</code> periodically updates the systemd-resolved for Mesos DNS.</td>
  </tr>
  <tr>
    <td>History Service</td>
    <td><p>This component <code>dcos-history-service.service</code> enables the DC/OS UI to display cluster usage statistics and stores the dashboard graph data for the UI. This data is stored on disk for 24 hours. Along with storing this data, the history service also exposes a HTTP API for the DC/OS user interface to query. All DC/OS cluster stats which involve memory, CPU, and disk usage are driven by this service.</p>
    <p>Without <a href="/1.8/administration/id-and-access-mgt/">access</a> to the History service, the UI will restart the graph timeline each time that a user opens the Dashboard tab in the UI. With access to the History service, the UI will show historical data, up to 60s prior, in the graph timeline.</p></td>
  </tr>
 <tr>
    <td>Identity and Access Management</td>
    <td>This component <code>dcos-bouncer.service</code> is the DC/OS Identity and Access Management feature. For more information, see the <a href="/1.8/administration/id-and-access-mgt/">documentation</a>.</td>
  </tr>
  <tr>
    <td>Job</td>
    <td>This component <code>dcos-metronome.service/</code> powers the DC/OS Jobs feature. For more information, see the <a href="/1.8/usage/jobs/">documentation</a>.</td>
  </tr>
  <tr>
    <td>Layer 4 Load Balancer</td>
    <td>This component <code>dcos-minuteman.service</code>, also known as <a href="https://github.com/dcos/minuteman">Minuteman</a>, is the DC/OS Layer 4 Load Balancer that enables multi-tier microservices architectures. For more information, see the <a href="/1.8/usage/service-discovery/load-balancing-vips/">documentation</a>.</td>
  </tr>
  <tr>
    <td>Logrotate Mesos Master</td>
    <td>This component <code>dcos-logrotate-master.service</code> automatically manages compression, removal, and mailing of log files for Mesos master processes. This ensures DC/OS services don't overload cluster hosts with too much log data on disk.</td>
  </tr>
  <tr>
    <td>Logrotate Mesos Slave</td>
    <td>This component <code>dcos-logrotate-agent.service/</code> automatically rotates Mesos agent log files for agent nodes.</td>
  </tr>
  <tr>
    <td>Logrotate Timer</td>
    <td>These components <code>dcos-logrotate-agent.timer</code> and <code>dcos-logrotate-master.timer</code> set the logrotate interval at 2 minutes.</td>
  </tr>
  <tr>
    <td>Marathon</td>
    <td>This component <code>dcos-marathon.service</code> is the DC/OS Marathon instance which starts and monitors DC/OS applications and services.</td>
  </tr>
  <tr>
    <td>Mesos Agent</td>
    <td>This component <code>dcos-mesos-slave.service</code> is the mesos-slave process for <a href="/1.8/overview/concepts/#private">private</a> agent nodes.</td>
  </tr>
  <tr>
    <td>Mesos Agent Public</td>
    <td>This component <code>dcos-mesos-slave-public.service</code> is the mesos-slave process for <a href="/1.8/overview/concepts/#public">public</a> agent nodes.</td>
  </tr>
  <tr>
    <td>Mesos DNS</td>
    <td>This component <code>dcos-mesos-dns.service</code> provides service discovery within the cluster. Mesos-DNS is the internal DNS service <code>dcos-mesos-dns.service</code> for the DC/OS cluster. <a href="/1.8/overview/concepts/#mesosdns">Mesos-DNS</a> provides the namespace <code>$service.mesos</code> to all cluster hosts. For example, you can login to your leading mesos master with <code>ssh leader.mesos</code>.</td>
  </tr>
  <tr>
    <td>Mesos Master</td>
    <td>This component <code>dcos-mesos-master.service</code> is the mesos-master process that orchestrates agent tasks.</td>
  </tr>
  <tr>
    <td>Mesos Persistent Volume Discovery</td>
    <td>This component <code>dcos-vol-discovery-pub-agent.service</code> connects to existing Mesos volume mounts on agent nodes during installation. For more information on Mesos Persistent Volumes, see the <a href="http://mesos.apache.org/documentation/latest/persistent-volume/">documentation</a>.</td>
  </tr>
  <tr>
    <td>Network Metrics Aggregator</td>
    <td>This component <code>dcos-networking_api.service</code> provides the DC/OS Network Metrics Aggregation Service and API. For more information, see the <a href="/1.8/usage/service-discovery/load-balancing-vips/">documentation</a>.</td>
  </tr>
  <tr>
    <td>Package service</td>
    <td>This component <code>dcos-cosmos.service </code> is the internal packaging API service. This service is accessed every time that you run <code>dcos package install</code> from the CLI. This API deploys DC/OS packages from the DC/OS <a href="https://github.com/mesosphere/universe">Universe</a> to your DC/OS cluster.</td>
  </tr>
  <tr>
      <td>REX-Ray</td>
      <td>This component (<code>dcos-rexray.service</code>) is the REX-Ray storage method for enabling external persistent volumes in Marathon.</td>
    </tr>
  <tr>
    <td>System Package Manager API</td>
    <td>This component <code>dcos-pkgpanda-api.service</code> provides an API for installing and uninstalling DC/OS components.</td>
  </tr>
  <tr>
    <td>System Package Manager API socket</td>
    <td>This component <code>dcos-pkgpanda-api.socket</code> is the System Package Manager API socket.</td>
  </tr>
  <tr>
    <td>Secrets Service</td>
    <td>This component <code>dcos-secrets.service</code> secures important values like private keys, credentials, and database passwords. For more information, see the <a href="/1.8/administration/secrets/">documentation</a>.</td>
  </tr><tr>
    <td>Signal</td>
    <td>This component <code>dcos-signal.service</code> sends a periodic ping back to Mesosphere with high-level cluster information to help improve DC/OS, and provides advanced monitoring of cluster issues. Signal queries the diagnostics service <code>/system/health/v1/report</code> endpoint on the leading master and sends this data to SegmentIO for use in tracking metrics and customer support.</td>
  </tr>
  <tr>
    <td>Signal Timer</td>
    <td>This component <code>dcos-signal.timer</code> sets the Signal component interval at once per hour.</td>
  </tr>
  <tr>
    <td>Vault</td>
    <td>This component <code>dcos-vault.service</code> is the storage backend for Secrets component.  It manages the secure and durable processing of secrets submitted to the Secrets component. </td>
  </tr>
  <tr>
    <td>Virtual Network Service</td>
    <td>This component <code>dcos-navstar.service</code> is a daemon that provides virtual networking and DNS services. It is the network overlay orchestrator. For more information, see the <a href="https://github.com/dcos/navstar">documentation</a>.</td>
  </tr>
</table>


