---
layout: layout.pug
navigationTitle: Quick Start
excerpt: How to use Couchbase with DC/OS
title: Quick Start
menuWeight: 15
---

This section gives a quick end 2 end tour on how to configure and use Couchbase with DC/OS.



# How to use Couchbase with DC/OS

## Prerequisites

* A running DC/OS 1.11 cluster

## Install

Couchbase can be installed via either the DC/OS Catalog UI or by using the CLI. The following command will launch the install via the DC/OS CLI:

```bash
dcos package install couchbase
```

[<img src="/services/couchbase/0.2.0-5.5.0/img/couch_install.png" alt="Couchbase Install"/>](/services/couchbase/0.2.0-5.5.0/img/couch_install.png)

In either case a default cluster will only come up with two data nodes. You need to change the configuration to also bring up index, query and full text search nodes.

For a couchbase cluster with 2 data node, 1 index node, 1 query node, and 1 full text search node you need a dc/os cluster with 5 private agents.


## Accessing the Console

Once the cluster is up and running use the following command to get the mesos-id of the host running one of the data nodes.

```bash
$ dcos node
```

Using the mesos-id create a ssh localhost tunnel.

```bash
$ dcos node ssh --master-proxy --mesos-id=... --option LocalForward=8091=localhost:8091
```

Now go to your browser and enter localhost:8091. When prompted for credentials enter Administrator / password.

[<img src="/services/couchbase/0.2.0-5.5.0/img/couch_creds.png" alt="Couchbase Creds"/>](/services/couchbase/0.2.0-5.5.0/img/couch_creds.png)

Which gets you to the console.

[<img src="/services/couchbase/0.2.0-5.5.0/img/couch_dashboard.png" alt="Couchbase Dashboard"/>](/services/couchbase/0.2.0-5.5.0/img/couch_dashboard.png)

## Adding Nodes

Let’s say we have two data nodes, and we want to go to three.

[<img src="/services/couchbase/0.2.0-5.5.0/img/couch_dnodes.png" alt="Couchbase Data Nodes"/>](/services/couchbase/0.2.0-5.5.0/img/couch_dnodes.png)

You need to go and edit the configuration of your couchbase service, and increase the data node count to 3.

[<img src="/services/couchbase/0.2.0-5.5.0/img/couch_edit.png" alt="Couchbase Edit configuration"/>](/services/couchbase/0.2.0-5.5.0/img/couch_edit.png)

A 3rd node gets added with a pending rebalance.

[<img src="/services/couchbase/0.2.0-5.5.0/img/couch_3.png" alt="Couchbase 3rd"/>](/services/couchbase/0.2.0-5.5.0/img/couch_3.png)

You can rebalance by clicking the button in the couchbase console, or you can use the following dc/os cli command

```bash
$ dcos couchbase plan start rebalance
```

Voila we have a three data node cluster.

[<img src="/services/couchbase/0.2.0-5.5.0/img/couch_cluster.png" alt="Couchbase cluster"/>](/services/couchbase/0.2.0-5.5.0/img/couch_cluster.png)


## Adding a Sync Gateway Node

We will use the pouchdb getting started app to demonstrate the usage of the couchbase sync gateway. You will not have to build the app yourself we have it readily available in a docker image.

First some prep before we create the sync gateway node. Create a bucket named ‘todo’ as shown below.

[<img src="/services/couchbase/0.2.0-5.5.0/img/data_bucket.png" alt="Data Bucket"/>](/services/couchbase/0.2.0-5.5.0/img/data_bucket.png)

Next create a user ‘todo’ with password ‘todo188’.

[<img src="/services/couchbase/0.2.0-5.5.0/img/add_user.png" alt="Add User"/>](/services/couchbase/0.2.0-5.5.0/img/add_user.png)

Followed by giving the ‘todo’ user access to the ‘todo’ bucket.

[<img src="/services/couchbase/0.2.0-5.5.0/img/new_user.png" alt="New User"/>](/services/couchbase/0.2.0-5.5.0/img/new_user.png)

Next use the dc/os console to create a secret with the id *couchbase/sync-gateway*, and the following json as value. This is the config json used by the sync gateway.

```json
{
  "interface": "0.0.0.0:4984",
  "adminInterface": "0.0.0.0:4985",
  "log": [
    "*"
  ],
  "databases": {
    "todo": {
      "server": "http://data.couchbase.l4lb.thisdcos.directory:8091",
      "bucket": "todo",
      "username": "todo",
      "password": "todo188",
      "users": {
        "GUEST": {
          "disabled": false,
          "admin_channels": [
            "*"
          ]
        }
      }
    }
  },
  "CORS": {
    "Origin": [
      "*"
    ],
    "LoginOrigin": [
      "*"
    ],
    "Headers": [
      "Content-Type"
    ],
    "MaxAge": 1728000
  }
}
```

Now we are ready to add a sync gateway node to our couchbase service.

[<img src="/services/couchbase/0.2.0-5.5.0/img/edit_conf.png" alt="Edit Configuration"/>](/services/couchbase/0.2.0-5.5.0/img/edit_conf.png)

Create a file named todo.json, with the following content. This is the pouchdb getting started app that accesses the sync gateway.


```json
{
  "id": "todo",
  "container": {
    "type": "MESOS",
    "docker": {
      "image": "realmbgl/pdbtd",
      "forcePullImage": true
    }
  },
  "portDefinitions": [
     {
      "name": "api",
      "port": 8000,
      "protocol": "tcp",
      "labels": {
        "VIP_0": "todo:8000"
      }
     }
  ],
  "cmd": "python -m http.server $PORT0"
}
```

Launch the todo app using the following command.

```bash
$ dcos marathon app add todo.json
```

Before we can play with it we need to expose the sync gateway service and the todo app using edge-lb. Install edge-lb.

Create a file named lb-sync-gateway.json containing the following edge-lb configuration.

```json
{
  "apiVersion": "V2",
  "name": "lb-sync-gateway",
  "count": 1,
  "haproxy": {
    "frontends": [
      {
        "bindPort": 4984,
        "protocol": "HTTP",
        "linkBackend": {
          "defaultBackend": "sgw"
        }
      },
      {
        "bindPort": 8000,
        "protocol": "HTTP",
        "linkBackend": {
          "defaultBackend": "todo"
        }
      }
    ],
    "backends": [
     {
      "name": "sgw",
      "protocol": "HTTP",
      "services": [{
        "endpoint": {
          "type": "ADDRESS",
          "address": "sync-gateway.couchbase.l4lb.thisdcos.directory",
          "port": 4984
        }
      }]
    },
    {
      "name": "todo",
      "protocol": "HTTP",
      "services": [{
        "endpoint": {
          "type": "ADDRESS",
          "address": "todo.marathon.l4lb.thisdcos.directory",
          "port": 8000
        }
      }]
    }]
  }
}
```

Launch the edge-lb configuration using the following command.

```bash
$ dcos edgelb create lb-sync-gateway.json
```

Now everything is in place.

[<img src="/services/couchbase/0.2.0-5.5.0/img/running.png" alt="running"/>](/services/couchbase/0.2.0-5.5.0/img/running.png)

Get the public ip of your dc/os public agent, and enter the following in your browser http://<public-ip>:8000 .

[<img src="/services/couchbase/0.2.0-5.5.0/img/todos.png" alt="todos"/>](/services/couchbase/0.2.0-5.5.0/img/todos.png)

As you enter todo’s you will also be able to see them in the couchbase console in the ‘todo’ bucket. If you open another browser, you will also see the db there synced.
