---
layout: layout.pug
navigationTitle:
excerpt:
title: Getting Started
menuWeight: 10
model: /services/hivemq/data.yml
render: mustache
---

<p class="message--note"><strong>The default configuration will deploy 3 {{ model.techName }} nodes, each requiring 4 CPU cores and 4096MB RAM. In the default configuration, the instances will not be placed on individual DC/OS nodes.</strong>

<p class="message--warning"><strong>If applicable, you may want to also <a href="/services/hivemq/1.0.0-4.2.0/getting-started/#create-a-configuration-file">deploy using an options.json</a> which specifies a license, as the default deployment launches in evaluation mode.</strong>

#include /services/include/getting-started.tmpl

# Connecting to the model.techName Control Center

The {{ model.techName }} service provides a convenient <a name="control center">https://www.hivemq.com/docs/4.1/control-center/introduction.html</a> for displaying general information regarding the status of the cluster as well as managing clients.

There are different ways to access the control center.

## DCOS Tunnel

See [Using a DCOS Tunnel](https://docs.mesosphere.com/latest/developing-services/tunnel/) for more information.

Using this approach you can directly use the provided DNS addresses displayed at the `Endpoints` view of your service.

## DNS name

The DC/OS {{ model.techName }} service binds {{ model.techName }}'s control center to a random port and exposes the address as a DNS record for each cluster node.

You can use these records to create a proxy on a public node to forward requests to the broker using those SRV records. (Implement sticky session on the proxy when doing so)


## SSH Proxy

You can also use the `dcos` CLI's proxy feature to connect to the control center of a single broker directly:

```
mesos_id=$(dcos task hivemq --json | jq -r '.[] | select (.name == "hivemq-0-node").slave_id')
port=$(dcos task hivemq --json  | jq '.[].discovery | select(.name == "hivemq-0") | .ports[] | .[] | select(.name == "control-center").number')
dcos node ssh --master-proxy --mesos-id=$mesos_id --option LocalForward=$port=localhost:$port
```

This will forward the control center port (will be displayed when the SSH tunnel is established) to localhost, allowing you to access the control center of a single HiveMQ node.

<p class="message--note"><strong>You may have to adjust the commands above depending on your services name.</strong>
