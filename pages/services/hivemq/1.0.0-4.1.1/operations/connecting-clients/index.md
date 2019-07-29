---
layout: layout.pug
navigationTitle:  Connecting Clients
title: Connecting Clients
menuWeight: 40
excerpt:
featureMaturity:
enterprise: false
model: /services/hivemq/data.yml
render: mustache

---

# Connecting MQTT Clients

The Mesosphere DC/OS {{ model.techName }} service provides several endpoints for connecting MQTT clients. In the default configuration, WebSocket and TLS listeners are disabled.
You can update the configuration of your service to enable these listeners without any downtime. See [Configuration](/services/hivemq/1.0.0-4.1.1/operations/configuration/) for more information.

For {{ model.techName }} the state of the broker is distributed across the nodes. This means that your clients can connect at random to any of the nodes.

## Endpoints

The Mesosphere DC/OS {{ model.techName}} service exposes endpoints for connecting directly to the listener of each individual node on the DC/OS agent network.
In addition, a layer 4 virtual IP is created for MQTT listeners of any type.

These endpoints are also published as DNS [SRV records](https://en.wikipedia.org/wiki/SRV_record) on Mesos-DNS. This allows you to provide a custom solution for routing and load-balancing.

See [Discovering the DNS names for a service](/1.12/networking/DNS/mesos-dns/service-naming/#discovering-the-dns-names-for-a-service) for detailed information. 

| Listener type  | individual node | VIP |
|----------------|--------------------------------------------------------------------------|------------------------------------------------------|
| MQTT           | \_mqtt.\_\<service-name\>-\<node-index\>._tcp.\<service-name\>.mesos.          | mqtt.\<service-name\>.l4lb.thisdcos.directory          |
| MQTT-TLS       | \_mqtt-tls.\_\<service-name\>-\<node-index\>._tcp.\<service-name\>.mesos.      | mqtt-tls.\<service-name\>.l4lb.thisdcos.directory      |
| WebSocket      | \_websocket.\_\<service-name\>-\<node-index\>._tcp.\<service-name\>.mesos.     | websocket.\<service-name\>.l4lb.thisdcos.directory     |
| WebSocket-TLS  | \_websocket-tls.\_\<service-name\>-\<node-index\>._tcp.\<service-name\>.mesos. | websocket-tls.\<service-name\>.l4lb.thisdcos.directory |

<p class="message--note"><strong>For foldered service names, remove the separator from <i>service-name</i> to make it a valid DNS name.</strong>

<p class="message--note"><strong>You can customize the port of all VIPs in the service configuration except for the default listener.</strong>

<p class="message--important"><strong>While our service can provide TLS listeners, it usually makes sense to offload TLS termination to an external loadbalancer to reduce the CPU load on the brokers.</strong>

[enterprise]
## Using Edge-LB
[/enterprise]

You can also use [Edge-LB](/services/edge-lb/) for connecting your MQTT clients to the brokers. After setting up Edge-LB, [create a pool](/services/edge-lb/1.3/tutorials/single-lb/) using the following `hivemq-pool.json`. Customize the frontend port and framework name according to your required configuration.

```json
{
  "apiVersion": "V2",
  "name": "hivemq",
  "count": 1,
  "haproxy": {
    "stats": {
      "bindPort": 9090
    },
    "frontends": [{
      "bindPort": 1883,
      "protocol": "TCP",
      "linkBackend": {
        "defaultBackend": "mqtt"
      }
    }],
    "backends": [{
      "name": "mqtt",
      "protocol": "TCP",
      "services": [{
        "mesos": {
          "frameworkName": "hivemq",
          "taskNamePattern": ".*-node"
        },
        "endpoint": {
          "portName": "mqtt"
        }
      }]
    }]
  }
}
```

This will create a minimal, single instance pool for connecting your clients using a public node.

See [V2 Pool Reference](/services/edge-lb/latest/pool-configuration/v2-reference/) for advanced configuration options.

<p class="message--warning"><strong>By default, Edge-LB will only allow 10k concurrent connections. To change this, you will need to use the template commands to dump and update the maxconn parameters in the template.</strong>

<p class="message--warning"><strong>For larger deployments with >50k connections, you should run multiple instances (increase the count of the pool). </strong>
