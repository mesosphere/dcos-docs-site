---
layout: layout.pug
navigationTitle:  Finding a public agent IP
title: Finding a public agent IP
menuWeight: 0
excerpt:
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


After you have installed DC/OS with a public agent node declared, you can navigate to the public IP address of your public agent node.

**Prerequisites**

- DC/OS is installed with at least 1 master and [public agent](/1.7/overview/concepts/#public-agent-node) node
- DC/OS [CLI](/1.7/usage/cli/) 0.4.6 or later
- [jQuery](https://github.com/stedolan/jq/wiki/Installation)
- [SSH](/1.7/administration/sshcluster/) configured

You can find your public agent IP by running this command from the DC/OS CLI. This command SSHs to your cluster to obtain cluster information and then pings [ifconfig.co](https://ifconfig.co/) to determine your public IP address. 

```
for id in $(dcos node --json | jq --raw-output '.[] | select(.reserved_resources.slave_public != null) | .id'); do dcos node ssh --option StrictHostKeyChecking=no --option LogLevel=quiet --master-proxy --mesos-id=$id "curl -s ifconfig.co" ; done 2>/dev/null
```

Here is an example where the public IP address is `52.39.29.79`:

```
for id in $(dcos node --json | jq --raw-output '.[] | select(.reserved_resources.slave_public != null) | .id'); do dcos node ssh --option StrictHostKeyChecking=no --option LogLevel=quiet --master-proxy --mesos-id=$id "curl -s ifconfig.co" ; done 2>/dev/null
52.39.29.79
52.40.79.170
52.40.79.170
```
