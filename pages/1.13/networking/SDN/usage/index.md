---
layout: layout.pug
navigationTitle:  Using SDNs
title: Using an SDN
menuWeight: 20
excerpt: Using a software defined network
enterprise: false
---

<!-- The source repo for this topic is https://github.com/dcos/dcos-docs-site -->


DC/OS provides each container with its own IP address by allowing you to run containers on a wide variety of IP-based virtual networks. In order to run containers on a virtual network, you must install a CNI or CNM network out-of-band. DC/OS itself comes with its own virtual networking solution called [DC/OS Overlay](/1.13/networking/SDN/dcos-overlay/), which the you can use to provide containers with unique IP addresses.

# Using Virtual Networks

First, you must [configure the virtual networks](/1.13/networking/SDN/dcos-overlay/). Virtual networks are configured at install time. You must specify a canonical name for each network in the `config.yaml`. When your service needs to launch a container, refer to it by that canonical name. To use a virtual network in a Marathon app definition, specify the `"network": "USER"` property along with an `ipAddress` field in the form: `{"ipAddress": {"network": "$MYNETWORK"}}`. The value of `$MYNETWORK` is the canonical name of the network.

# Example

The following Marathon application definition specifies a network named `dcos-1`, which refers to the target DC/OS virtual network of the same name.

```json
{
   "id":"my-networking",
   "cmd":"env; ip -o addr; sleep 30",
   "cpus":0.10,
   "mem":64,
   "instances":1,
   "backoffFactor":1.14472988585,
   "backoffSeconds":5,
   "ipAddress":{
      "networkName":"dcos-1"
   },
   "container":{
      "type":"DOCKER",
      "docker":{
         "network":"USER",
         "image":"busybox",
         "portMappings":[
            {
               "containerPort":123,
               "servicePort":80,
               "name":"foo"
            }
         ]
      }
   }
}
```

Learn more about ports and networking in [Marathon](/1.13/deploying-services/service-ports/).
