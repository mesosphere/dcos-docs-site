---
layout: layout.pug
title: DC/OS Ports
menuWeight: 5
excerpt:
oss: true
enterprise: false
---

[DC/OS components](/docs/1.11/overview/architecture/components/) listen on multiple ports on each node. These ports must be available for installation to succeed.

DC/OS allocates additional ports to services running on top of DC/OS. These ports are required to be available when services are installed.

**Important:** These ports must not be used in a firewall configuration between nodes or cluster zones.

## All nodes

### TCP

| Port | DC/OS Component | systemd Unit | Source | Destination |
|---|---|---|---|---|
| 53 | DC/OS Net | `dcos-net.service` | agent/master | agent/master |
| 61003 | REX-Ray | `dcos-rexray.service` | agent/master (may change due to specific REX-Ray configuration)| agent/master (may change due to specific REX-Ray configuration) |
| 61091 | dcos-metrics | `dcos-metrics-agent.service/dcos-metrics-master.service` | agent/master | agent/extra |
| 61420 | DC/OS Net | `dcos-net.service` | agent/master | agent/master |
| 62080 | DC/OS Net | `dcos-net.service` | agent/master | agent/master |
| 62501 | DC/OS Net | `dcos-net.service` | agent/master | agent/master |

### UDP

| Port | DC/OS Component | systemd Unit | Source | Destination |
|---|---|---|---|---|
| 53 | DC/OS Net | `dcos-net.service` | agent/master | agent/master |

**Note:** UDP port 123 is open for communication with NTP.

## Master

### TCP

| Port | DC/OS Component | systemd Unit | Source | Destination |
|---|---|---|---|---|
| 80    | Admin Router Master (HTTP) | `dcos-adminrouter.service` |public IP| master |
| 443   | Admin Router Master (HTTPS) | `dcos-adminrouter.service`|public IP| master |
| 1337  | DC/OS Secrets |  `dcos-secrets.service` [enterprise type="inline" size="small" /] | localhost| localhost(master) |
| 2181  | ZooKeeper | `dcos-exhibitor.service` | agent/master | master |
| 3888  | Exhibitor, or ZooKeeper and Exhibitor | `dcos-exhibitor.service` | agent/master | master |
| 5050  | Mesos Master | `dcos-mesos-master.service` | agent/master | master |
| 7070  | DC/OS Package Manager (Cosmos) | `dcos-cosmos.service` | localhost| localhost(master) |
| 8080  | Marathon | `dcos-marathon.service` | agent/master | master |
| 8101  | DC/OS Identity and Access Manager | `dcos-bouncer.service` [enterprise type="inline" size="small" /] | localhost| localhost(master) |
| 8123  | Mesos DNS | `dcos-mesos-dns.service` | localhost | localhost |
| 8181  | Exhibitor and ZooKeeper | `dcos-exhibitor.service` | agent/master | master |
| 8200  | Vault | `dcos-vault.service` [enterprise type="inline" size="small" /] | localhost| localhost(master) |
| 8443  | Marathon SSL | `dcos-marathon.service` | agent/master | master |
| 8888  | DC/OS Certificate Authority | `dcos-ca.service` [enterprise type="inline" size="small" /] | localhost| localhost(master) |
| 9090 | DC/OS Jobs (Metronome) | `dcos-metronome.service`| agent/master | master |
| 9443 | DC/OS Jobs (Metronome) SSL | `dcos-metronome.service`| agent/master | master |
| 9990  | DC/OS Package Manager (Cosmos) | `dcos-cosmos.service` | localhost| localhost(master) |
| 15055 | DC/OS History | `dcos-history-service.service` | localhost| localhost(master) |
| 15101 | Marathon libprocess | `dcos-marathon.service` | master | agent/master |
| 15201 | DC/OS Jobs (Metronome) libprocess | `dcos-metronome.service`| master | agent/master |
| 61053 | Mesos DNS | `dcos-mesos-dns.service` | agent/master | master |
| 61430 | DC/OS Net | `dcos-net.service` [enterprise type="inline" size="small" /] | agent/master | master |
| Ephemeral | DC/OS Component Package Manager (Pkgpanda) | `dcos-pkgpanda-api.service` | None | None |

### UDP

| Port | DC/OS Component | systemd Unit | Source | Destination |
|---|---|---|---|---|
| 61053 | Mesos DNS | `dcos-mesos-dns.service`| agent/master | master |

## Agent

### TCP

| Port | DC/OS Component | systemd Unit | Source | Destination |
|---|---|---|---|---|
| 5051  | Mesos Agent | `dcos-mesos-slave.service` | agent/master | agent |
| 61001 | Admin Router Agent (HTTP) | `dcos-adminrouter-agent` | agent/master | agent |
| 61002 | Admin Router Agent (HTTPS) | `dcos-adminrouter-agent` | agent/master | agent |
| 1025-2180 | Default advertised port ranges (for Mesos tasks) | Any Mesos task | agent/master | agent |
| 2182-3887 | Default advertised port ranges (for Mesos tasks) | Any Mesos task | agent/master | agent |
| 3889-5049 | Default advertised port ranges (for Mesos tasks) | Any Mesos task | agent/master | agent |
| 5052-8079 | Default advertised port ranges (for Mesos tasks) | Any Mesos task | agent/master | agent |
| 8082-8180 | Default advertised port ranges (for Mesos tasks) | Any Mesos task | agent/master | agent |
| 8182-32000 | Default advertised port ranges (for Mesos tasks) | Any Mesos task | agent/master | agent |
