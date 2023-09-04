---
layout: layout.pug
navigationTitle:  Calico
title: Calico
menuWeight: 10
render: mustache
model: /mesosphere/dcos/2.2/data.yml
excerpt: Understanding DC/OS Calico Integration
enterprise: false
---

## Overview

This package provides DC/OS Calico component to support Calico networking containers and network policy in DC/OS.

## DC/OS Calico components

DC/OS Calico component integrates the [Calico networking](https://www.projectcalico.org) into DC/OS, by providing the Calico CNI plugin for Mesos Universal Container Runtime and the Calico libnetwork plugin for Docker Engine. In addition, the calico control panel will provide the functionality of configuring the network policy for DC/OS workloads.

### DC/OS Calico services

DC/OS Calico integrates Calico into DC/OS for managing container networking and network security, three services are introduced:

* `dcos-calico-bird.service`: A BGP client that exchanges routing information between hosts for Calico. [(source)](https://github.com/projectcalico/bird)
* `dcos-calico-confd.service`: The confd templating engine monitors etcd datastores and generating and reloading bird configuration dynamically. [(source)](https://github.com/projectcalico/node)
* `dcos-calico-felix.service`: the control panel for Calico networking to program routes and ACL's for containers. [(source)](https://github.com/projectcalico/node)
* `dcos-calico-libntwork-plugin.service`: the network plugin for Docker that provides Calico networking to the Docker Engine. [(source)](https://github.com/projectcalico/libnetwork-plugin)

### DC/OS Calico CLI

The DC/OS command line includes a `calico` plugin that allows running `calicoctl` commands from outside the cluster. To run any `calicoctl` command intead run it as `dcos calico` for example `dcos calico get nodes`:

```sh
dcos calico get nodes
NAME
172.16.0.23
172.16.2.241
172.16.21.4
172.16.9.234

```

## DC/OS configuration reference (networking)

| Parameter | Description |
|-----------|-------------|
| calico_network_cidr | Subnet allocated for calico. The subnet specified by `calico_network_cidr` MUST not overlap with those for VXLAN backends or virtual networks defined for [DC/OS virtual networks](/mesosphere/dcos/2.2/installing/production/advanced-configuration/configuration-reference/#dcos-overlay-enable). [ Default: 172.29.0.0/16 ] |
| calico_vxlan_enabled | Control, whether IP-in-IP or VXLAN mode is used for calico, by default VXLAN, is suggested to be used instead of VXLAN. `calico_vxlan_enabled` is supposed to set to 'true' for the environment that IP in IP is not supported, like Azure. [Default: 'true'] |
| calico_ipinip_mtu | The MTU to set on the Calico IPIP tunnel device. This configuration works when calico_vxlan_enabled is set to be false. Please refer to the [calico documentation](https://docs.projectcalico.org/networking/mtu) for a suitable MTU configuration. [Default: 1480] |
| calico_vxlan_port | The UDP port used for calico VXLAN. This configuration works when calico_vxlan_enabled is set to be true. [Default: 4789] |
| calico_vxlan_vni | The virtual network ID used for calico VXLAN. This configuration works when calico_vxlan_enabled is set to be true. [Default: 4096] |
| calico_vxlan_mtu | The MTU to set on the Calico VXLAN tunnel device. This configuration works when calico_vxlan_enabled is set to be true. Please refer to the [calico documentation](https://docs.projectcalico.org/networking/mtu) for a suitable MTU configuration [Default: 1450] |
| calico_veth_mtu | The MTU to set on the veth pair devices, e.g. both the container interface and host-end interface. Please refer to the [calico documentation](https://docs.projectcalico.org/networking/mtu) for a suitable MTU configuration [Default: 1500] |



### Calico networking (universal container runtime)

To use Calico networking containers, you only have to specify the network name as `calico`.

The following marathon app definition example will launch a container using the _Mesos UCR engine_ and plug it to the `calico` network:

```json
{
  "id": "/calico-ucr",
  "instances": 1,
  "container": {
    "type": "MESOS",
    "volumes": [],
    "docker": {
      "image": "mesosphere/id-server:2.1.0"
    },
    "portMappings": []
  },
  "cpus": 0.1,
  "mem": 128,
  "requirePorts": false,
  "networks": [
    {
      "mode": "container",
      "name": "calico"
    }
  ],
  "healthChecks": [],
  "fetch": [],
  "constraints": []
}
```

### Calico networking (Docker engine)

Like with the previous example, the following marathon app definition will launch a container using the _Docker Engine_ and plug it to the `calico` network:

```json
{
  "id": "/calico-docker",
  "instances": 1,
  "container": {
    "type": "DOCKER",
    "volumes": [],
    "docker": {
      "image": "mesosphere/id-server:2.1.0"
    },
    "portMappings": []
  },
  "cpus": 0.1,
  "mem": 128,
  "requirePorts": false,
  "networks": [
    {
      "mode": "container",
      "name": "calico"
    }
  ],
  "healthChecks": [],
  "fetch": [],
  "constraints": []
}
```

## Administration topics

### Network policies

Network policy provides the ability to control network traffic by an ordered set of rules applied to the endpoints specified by a label selector, please refer to the [calico documentation](https://docs.projectcalico.org/reference/resources/networkpolicy) for a detailed explanation of policy rule definitions and label selector syntax.

In DC/OS, Calico network policy is exposed directly to the operators, so that the operator can manage their traffic control according to different scenarios.

limitations on network policy we have in DC/OS:

* Calico network policy is a namespaced resource, but for now, we support only `default` namespace in DC/OS, and all the namespaced Calico resources should be defined under `default` namespace.
* Calico network policy takes effect only on Calico networking containers, which means labels set on non-Calico networking containers like `hostnetwork`, `dcos` and `bridge` will not count in Calico network policy.
* UCR containers: Labels for network policy MUST be set in `NetworkInfo.Labels` for Mesos, and for Marathon, they should be in `networks.[].labels`, for example:

```json
{
  "id": "/client",
  "instances": 1,
  "container": {
    "type": "MESOS",
    ...
  },
   ...
  "networks": [
    {
      "mode": "container",
      "name": "calico",
      "labels": {
        "role": "client"
      }
    }
  ],
  ...
}
```

* Docker Containers: Labels for network policy MUST be set in `container.docker.paramaters` and prefixed with `org.projectcalico.label`, for example:

```json
{
  "id": "/client",
  "instances": 1,
  "container": {
    "type": "Docker",
    "docker": {
      "parameters": [
        {
          "key": "label",
          "value": "org.projectcalico.label.role=client"
        },
        {
          "key": "label",
          "value": "org.projectcalico.label.public=yes"
        }
      ]
    },
    ...
  },
  ...
}
```

### Default profile

Calico Profile groups endpoints which inherit labels defined in the profile, for example, each namespace has one corresponding profile to granting labels to Pods in the namespace. Calico profile supports policy rules for traffic control but is deprecated in favor of much more flexible NetworkPolicy and GlobalNetworkPolicy resources.

In our case, all Calico networking containers will be assigned with a default profile with the same name as CNI network, `calico` by default, and this profile allows all requests. L4LB and L7 proxy requests in which the source IP address is NATed to that of tunnel interfaces generated by Calico are currently not supported. This profile can found in the following YAML definition:

```yaml
apiVersion: projectcalico.org/v3
kind: Profile
metadata:
  name: calico
spec:
  egress:
  - action: Allow
    destination: {}
    source: {}
  ingress:
  - action: Allow
    destination: {}
    source: {}
  labelsToApply:
    calico: ""
```

For a more detailed description of the Calico profile, please read the [calico documentation](https://docs.projectcalico.org/reference/resources/profile).

### Network policy examples

In the following business isolation example, we have three application definitions as shown below, and both bookstore-frontend and bookstore-server are labeled with `"biz_type": "bookstore"`, while fruitstore-frontend is labeled with `"biz_type": "fruitstore"`. Here we will create a network policy to deny the requests from fruitstore-frontend to bookstore-server while allow requests from bookstore-frontend to bookstore-server.

```
+----------------------+      +------------------------+
|                      |      |                        |
|  bookstore-frontend  |      |   fruitstore-frontend  |
|                      |      |                        |
+-----------------+----+      +----+-------------------+
                  |                |
                  |                |
                  |                x
                  |                |
             +----v----------------v--+
             |                        |
             |   bookstore-server     |
             |                        |
             +------------------------+
```

#### Launch Marathon 5.3.1. applications

The Marathon application definition of bookstore-frontend with policy label `"biz_type": "bookstore"`:

```json
{
  "id": "/bookstore-frontend",
  "instances": 1,
  "container": {
    "type": "MESOS",
    "volumes": [],
    "docker": {
      "image": "mesosphere/id-server:2.1.0"
    },
    "portMappings": []
  },
  "cpus": 0.1,
  "mem": 128,
  "requirePorts": false,
  "networks": [
    {
      "mode": "container",
      "name": "calico",
      "labels": {
        "biz_type": "bookstore"
      }
    }
  ],
  "healthChecks": [],
  "fetch": [],
  "constraints": []
}
```
The Marathon application definition of bookstore-server with policy label `"biz_type": "bookstore"` and `"role": "server"`, available on port 80:

```json
{
  "id": "/bookstore-server",
  "instances": 1,
  "container": {
    "type": "MESOS",
    "volumes": [],
    "docker": {
      "image": "mesosphere/id-server:2.1.0"
    },
    "portMappings": []
  },
  "cpus": 0.1,
  "mem": 128,
  "requirePorts": false,
  "networks": [
    {
      "mode": "container",
      "name": "calico",
      "labels": {
        "biz_type": "bookstore",
        "role": "server"
      }
    }
  ],
  "healthChecks": [],
  "fetch": [],
  "constraints": []
}
```
The Marathon application definition of fruitstore-frontend with policy label `"biz_type": "fruitstore"`:

```json
{
  "id": "/fruitstore-frontend",
  "instances": 1,
  "container": {
    "type": "MESOS",
    "volumes": [],
    "docker": {
      "image": "mesosphere/id-server:2.1.0"
    },
    "portMappings": []
  },
  "cpus": 0.1,
  "mem": 128,
  "requirePorts": false,
  "networks": [
    {
      "mode": "container",
      "name": "calico",
      "labels": {
        "biz_type": "fruitstore"
      }
    }
  ],
  "healthChecks": [],
  "fetch": [],
  "constraints": []
}
```

Lauch the above three Marathon applications by executing `dcos marathon app add ${app_definition_yaml_file}`, and we will then obtain three running Marathon applications as show below:

```sh
dcos task list
         NAME              HOST      USER     STATE                                         ID                                                    AGENT ID                  REGION  ZONE
  fruitstore-frontend  172.16.2.233  root  TASK_RUNNING  fruitstore-frontend.instance-8a3ed6db-2a47-11ea-91b3-66db602e14f5._app.1  0a1399a2-fe1f-4613-a618-f45159e12f2a-S0  N/A     N/A
  bookstore-server     172.16.29.45  root  TASK_RUNNING  bookstore-server.instance-825bcbda-2a47-11ea-91b3-66db602e14f5._app.1     0a1399a2-fe1f-4613-a618-f45159e12f2a-S1  N/A     N/A
  bookstore-frontend   172.16.2.233  root  TASK_RUNNING  bookstore-frontend.instance-79853919-2a47-11ea-91b3-66db602e14f5._app.1   0a1399a2-fe1f-4613-a618-f45159e12f2a-S0  N/A     N/A
```

#### Frontends and server connectivity test

Before applying network policy, the requests from bookstore-frontend and fruitstore-frontend to bookstore-server are successful, here we expect the FQDN `bookstore-server.marathon.containerip.dcos.thisdcos.directory` to return the bookstore-server container IP address:
```sh
dcos task exec fruitstore-frontend wget -qO- bookstore-server.marathon.containerip.dcos.thisdcos.directory:80/id
hubfeu2yculh%

dcos task exec bookstore-frontend wget -qO- bookstore-server.marathon.containerip.dcos.thisdcos.directory:80/id
hubfeu2yculh%
```

#### Apply network policy

This network policy takes effect on bookstore-server and allows requests from applications with label `biz_type` set as `bookstore` while rejects those from applications with label `biz_type` set as `fruitstore`:
```yaml
apiVersion: projectcalico.org/v3
kind: NetworkPolicy
metadata:
  name: allow-bookstore-cliient-to-server
spec:
  selector: biz_type == 'bookstore' && role == 'server'
  types:
  - Ingress
  ingress:
  - action: Allow
    protocol: TCP
    source:
      selector:  biz_type == 'bookstore'
    destination:
      ports:
      - 80
  - action: Deny
    protocol: TCP
    source:
      selector: biz_type == 'fruitstore'
    destination:
      ports:
      - 80
```
Temporarily, we can log into a DC/OS node, and apply the network policy by executing `dcos calico apply -f ${network_policy_yaml_file}`.

Request from bookstore-frontend is successful as expected:
```sh
dcos task exec bookstore-frontend wget -qO- bookstore-server.marathon.containerip.dcos.thisdcos.directory:80/id
hubfeu2yculh%
```

Request from fruitstore-frontend is timed out for packets are dropped.
```sh
dcos task exec fruitstore-frontend wget -qO- --timeout=5 bookstore-server.marathon.containerip.dcos.thisdcos.directory:80/id
wget: can't connect to remote host (192.168.219.133): Connection timed out
```

### Adding network profiles

In most of the use cases a single calico profile is enough. However if for any reason more networks needs to be created, you should be aware of some corner cases.

> ⚠️ NOTE: The `calico-libnetwork-plugin` (the network interface to Docker Runtime) implicitly links the IP Pool to the calico profile associated with the respective calico docker network.

That said, to add a network profile, you should:

1. Create a new IP pool. For example:
  ```yaml
  apiVersion: projectcalico.org/v3
  kind: IPPool
  metadata:
    name: <network-name>
  spec:
    cidr: 10.1.0.0/16
    natOutgoing: true
    disabled: false
  ```

  Save the above yaml to `ip.yml` then run:

  ```sh
  dcos calico create -f ip.yml
  ```

2. Create a new calico profile. For example:
  ```yaml
  apiVersion: projectcalico.org/v3
  kind: Profile
  metadata:
    name: <profile-name>
  spec:
    egress:
    - action: Allow
      destination: {}
      source: {}
    ingress:
    - action: Allow
      destination: {}
      source: {}
    labelsToApply:
      calico: ""
  ```

  Save the above yaml to `profile.yml` then run:

  ```sh
  dcos calico create -f profile.yml
  ```

3. On **every agent**, create a new docker network that will use the new profile. You can use the following command, making sure the subnet matches the cidr from the pool:
  ```sh
  docker network create \
      --opt org.projectcalico.profile=<profile-name> \
      --driver calico \
      --ipam-driver calico-ipam \
      --subnet=10.1.0.0/16 \
      <network-name>
  ```

## Migrate Applications from DC/OS Overlay to Calico

Automatic Migration for all services existing within a DC/OS cluster is impossible. Services can be launched by a variety of Apache Mesos frameworks ranging from production-proven platform [Marathon](https://mesosphere.github.io/marathon/) to services built on top of [dcos-common](https://github.com/mesosphere/dcos-commons. This includes existing, stateful services such as [Cassandra](https://docs.d2iq.com/mesosphere/dcos/services/cassandra) and [Spark](https://docs.d2iq.com/mesosphere/dcos/services/spark), or services being hosted from your environment.

### Marathon application(aka DC/OS services)

There are at least two ways to effect a change for the Marathon application:

- DC/OS CLI
Update the application definition to replace the network name `dcos` with `calico`
`dcos app update calico_network_app.json`

for this method, the corresponding file, `calico_network_app.json` contains the definition of a Calico network application that differs from a DC/OS network application as follows:
```json
  {
   "networks": [
     {
       "mode": "container",
-      "name": "dcos"
+      "name": "calico"
     }
   ]
  }
```

- DC/OS GUI

Navigate to the networking tab for services, and change the network type from `Virtual Network: dcos` to `Virtual Network: calico`.

### DC/OS services built on top of dcos-common

Normally, there are two components in DC/OS services:
- Scheduler - a Marathon application executing a plan to launch a Pod
- Pods - worker applications performing the service's responsibilities.

As the definition of the scheduler and pods are defined as release packages, and to make a permanent change in case the scheduler and Pods are using a virtual network, we have to generate new releases of DC/OS services after executing the following changes:

- For Schedulers
The Marathon application definition of a scheduler is defined as a template, marathon.json.mustache, inside the package definition, and is filled out by the operators according to the variables defined in `config.json`. The operator is expected to make sure `VIRTUAL_NETWORK_NAME` to be `calico` when the virtual network is enabled.

- For Pods
`dcos-common` allows pods to join virtual networks, with the `dcos` virtual network available by default. Migrating the application from `dcos` to `calico` requires the change as follows:

```yaml
pods:
  pod-on-virtual-network:
    count: {{COUNT}}
    networks:
-     dcos:
+     calico:
    tasks:
      ...
  pod-on-host:
    count: {{COUNT}}
    tasks:
      ...
```

## Troubleshooting

Diagnostic info including Calico resources, components logs, and BGP peer status are collected in DC/OS node diagnostic bundle to debug Calico networking issues, please execute  `dcos node diagnostic create` to create a diagnostic bundle, and download the diagnostic bundle by executing `dcos node diagnostic download <diagnostic-bundle-name>`.
