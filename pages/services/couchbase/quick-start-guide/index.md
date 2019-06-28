---
layout: layout.pug
navigationTitle: Configuring DC/OS access for Couchbase
excerpt: How to use Couchbase Server and Couchbase Sync Gateway with DC/OS
title: Configuring DC/OS access for Couchbase
menuWeight: 2
model: /services/couchbase/data.yml
render: mustache
community: true
---

This section is a quick guide on how to configure and use {{ model.serverName }} and {{ model.syncGatewayName }} with {{ model.productName }}.

# Prerequisites

* A running {{ model.productName }} 1.10 or 1.11 cluster

# Install

{{ model.techName }} can be installed using either the {{ model.productName }} {{ model.packageRepo }} web interface or the CLI.

## Install via {{ model.productName }} web interface
When you launch {{ model.techName }} via the {{ model.productName }} {{ model.packageRepo }} web interface, choose `Review & Run`.

[<img src="/services/couchbase/0.2.0-5.5.0/img/couch_install.png" alt="Couchbase Install"/>](/services/couchbase/0.2.0-5.5.0/img/couch_install.png)

Figure 1. {{ model.techName }} install screen

## Install via CLI
The following command will launch the install via the {{ model.productName }} CLI:

```bash
dcos package install {{ model.packageName }}
```
In either case, a default cluster will come up with two data nodes.

[<img src="/services/couchbase/0.2.0-5.5.0/img/couch_install_finished.png" alt="Couchbase Install Finished"/>](/services/couchbase/0.2.0-5.5.0/img/couch_install_finished.png)

Figure 2. {{ model.techName }} installed with two data nodes

You must change the configuration to also bring up `index`, `query`, `full text search`, `eventing`, and `analytics` nodes.

# Accessing the Console

1. Once the cluster is up and running, use the following command to get the `mesos-id` of the host running one of the data nodes.

  ```bash
  $ dcos node
  ```
2. Using the `mesos-id,` create a SSH localhost tunnel.

  ```bash
  $ dcos node ssh --master-proxy --mesos-id=... --option LocalForward=8091=localhost:8091
  ```
3. Open your browser and enter `localhost:8091`. When prompted for credentials, enter the defaults: `Administrator` / `password`.

[<img src="/services/couchbase/0.2.0-5.5.0/img/couch_creds.png" alt="Couchbase Creds"/>](/services/couchbase/0.2.0-5.5.0/img/couch_creds.png)

Figure 3. {{ model.techName }} credentials

This will open the {{ model.techName }} dashboard.

[<img src="/services/couchbase/0.2.0-5.5.0/img/couch_dashboard.png" alt="Couchbase Dashboard"/>](/services/couchbase/0.2.0-5.5.0/img/couch_dashboard.png)

Figure 4. {{ model.techName }} dashboard

# Adding Nodes

Assume we have two data nodes, and we want to add one.

[<img src="/services/couchbase/0.2.0-5.5.0/img/couch_dnodes.png" alt="Couchbase Data Nodes"/>](/services/couchbase/0.2.0-5.5.0/img/couch_dnodes.png)

Figure 5. {{ model.techName }} with two data nodes

You must edit the configuration of your {{ model.techName }} service, and increase the data node count to 3.

[<img src="/services/couchbase/0.2.0-5.5.0/img/couch_edit.png" alt="Couchbase Edit configuration"/>](/services/couchbase/0.2.0-5.5.0/img/couch_edit.png)

Figure 6. Adding a {{ model.techName }} node

A third node is added and an automatic rebalance takes place.

[<img src="/services/couchbase/0.2.0-5.5.0/img/couch_3.png" alt="Couchbase 3rd"/>](/services/couchbase/0.2.0-5.5.0/img/couch_3.png)

Figure 7. {{ model.techName }} with three data nodes

# Adding a Sync Gateway Node

We will use the PouchDB Getting Started app to demonstrate the use of the {{ model.syncGatewayName }}. You will not have to build the app yourself; we have it readily available in a Docker image. First we will create a data bucket, and then we will make the {{ model.syncGatewayName }} available.

## Create a data bucket

1. Create a bucket named `todo`, as shown below.

  [<img src="/services/couchbase/0.2.0-5.5.0/img/data_bucket.png" alt="Data Bucket"/>](/services/couchbase/0.2.0-5.5.0/img/data_bucket.png)

  Figure 8.  Adding a data bucket
2. Create a user named `todo` with password `todo188`, and give that user access to the `todo` bucket.

  [<img src="/services/couchbase/0.2.0-5.5.0/img/add_user.png" alt="Add User"/>](/services/couchbase/0.2.0-5.5.0/img/add_user.png)

  Figure 9. Granting access to user `todo`

3. Use the following {{ model.syncGatewayName }} configuration.

  ```yml
  CORS:
      Headers:
      - Content-Type
      LoginOrigin:
      - '*'
      MaxAge: 1728000
      Origin:
      - '*'
  adminInterface: 0.0.0.0:4985
  databases:
      todo:
          bucket: todo
          password: todo188
          server: http://data.couchbase.l4lb.thisdcos.directory:8091
          username: todo
          users:
              GUEST:
                  admin_channels:
                  - '*'
                  disabled: false
  interface: 0.0.0.0:4984
  log:
  - '*'
  ```

4. Add a {{ model.syncGatewayName }} node to our {{ model.packageName }} service. Note that the former yml is already set as the default.

  [<img src="/services/couchbase/0.2.0-5.5.0/img/edit_conf.png" alt="Edit Configuration"/>](/services/couchbase/0.2.0-5.5.0/img/edit_conf.png)

  Figure 10. Editing the {{ model.syncGatewayName }} configuration
5. Create a file named `todo.json`, with the following content. This is the PouchDB Getting Started app that accesses the {{ model.syncGatewayName }}.

  ```json
  {
    "id": "todo",
    "container": {
      "type": "MESOS",
      "docker": {
        "image": "mesosphere/pdbtd",
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
6. Launch the `todo` app using the following command.
  ```bash
  $ dcos marathon app add todo.json
  ```

## Expose the {{ model.syncGatewayName }} node

Before we can use it, we must expose the {{ model.syncGatewayName }} service and the `todo` app using Edge-LB. 

### Install Edge-LB.

1. Create a file named `lb-sync-gateway.json` containing the following Edge-LB configuration.

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

2. Launch the Edge-LB configuration using the following command.
  ```bash
  $ dcos edgelb create lb-sync-gateway.json
  ```

Now everything is in place.

[<img src="/services/couchbase/0.2.0-5.5.0/img/running.png" alt="running"/>](/services/couchbase/0.2.0-5.5.0/img/running.png)
Figure 11. Edge-LB and {{ model.techName }} running together

3. Get the public IP of your {{ model.productName }} public agent, and enter the following in your browser: `http://<public-ip>:8000` .

[<img src="/services/couchbase/0.2.0-5.5.0/img/todos.png" alt="todos"/>](/services/couchbase/0.2.0-5.5.0/img/todos.png)

Figure 12. The `todo` list is up and running

As you enter items to your `todo` list, you will also be able to see them in the {{ model.packageName }} console in the `todo` bucket. If you open another browser, you will also see the DB synced there.
