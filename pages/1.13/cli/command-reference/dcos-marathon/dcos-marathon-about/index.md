---
layout: layout.pug
navigationTitle:  dcos marathon about
title: dcos marathon about
menuWeight: 0
excerpt: Displays the info.json file for DC/OS Marathon

enterprise: false
---


# Description

The `dcos marathon about` command will print an `info.json` file for DC/OS Marathon..

# Usage

```bash
dcos marathon about
```

# Options

| Name |  Description |
|---------|-------------|
| `--help`   |  Show this message and exit. |



# Example

```json
dcos marathon about
{
  "buildref": "da9365d80f9e3e58b097f7b4eba50b029f306f39",
  "elected": true,
  "frameworkId": "02b1bdc8-2bac-44a0-81ff-65816936b97b-0000",
  "http_config": {
    "http_port": 8080,
    "https_port": 8443
  },
  "leader": "10.0.6.122:8080",
  "marathon_config": {
    "access_control_allow_origin": null,
    "checkpoint": true,
    "decline_offer_duration": 300000,
    "default_network_name": "dcos",
    "env_vars_prefix": null,
    "executor": "//cmd",
    "failover_timeout": 604800,
    "features": [
      "secrets",
      "external_volumes",
      "maintenance_mode",
      "vips",
      "gpu_resources",
      "task_killing"
    ],
    "framework_name": "marathon",
    "ha": true,
    "hostname": "10.0.6.122",
    "launch_token": 100,
    "launch_token_refresh_interval": 30000,
    "leader_proxy_connection_timeout_ms": 5000,
    "leader_proxy_read_timeout_ms": 10000,
    "local_port_max": 20000,
    "local_port_min": 10000,
    "master": "zk://zk-1.zk:2181,zk-2.zk:2181,zk-3.zk:2181,zk-4.zk:2181,zk-5.zk:2181/mesos",
    "max_instances_per_offer": 100,
    "mesos_bridge_name": "mesos-bridge",
    "mesos_heartbeat_failure_threshold": 5,
    "mesos_heartbeat_interval": 15000,
    "mesos_leader_ui_url": "/mesos",
    "mesos_role": "slave_public",
    "mesos_user": "root",
    "min_revive_offers_interval": 5000,
    "offer_matching_timeout": 3000,
    "on_elected_prepare_timeout": 180000,
    "reconciliation_initial_delay": 15000,
    "reconciliation_interval": 600000,
    "revive_offers_for_new_apps": true,
    "revive_offers_repetitions": 3,
    "scale_apps_initial_delay": 15000,
    "scale_apps_interval": 300000,
    "store_cache": true,
    "task_launch_confirm_timeout": 1800000,
    "task_launch_timeout": 86400000,
    "task_lost_expunge_initial_delay": 300000,
    "task_lost_expunge_interval": 30000,
    "task_reservation_timeout": 1800000,
    "webui_url": null
  },
  "name": "marathon",
  "version": "1.7.174",
  "zookeeper_config": {
    "zk": "zk://xxxxxxxx:xxxxxxxx@zk-1.zk:2181,zk-2.zk:2181,zk-3.zk:2181,zk-4.zk:2181,zk-5.zk:2181/marathon",
    "zk_compression": true,
    "zk_compression_threshold": 65536,
    "zk_connection_timeout": 10000,
    "zk_max_node_size": 1024000,
    "zk_max_versions": 50,
    "zk_session_timeout": 10000,
    "zk_timeout": 10000
  }
}
```

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/1.13/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |
