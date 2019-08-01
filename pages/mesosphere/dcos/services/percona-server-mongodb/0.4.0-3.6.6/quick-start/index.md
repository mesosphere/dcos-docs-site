---
layout: layout.pug
navigationTitle:  Quick Start
title: Quick Start
menuWeight: 20
excerpt: Getting Started with Percona Server for MongoDB
featureMaturity:
enterprise: false
---

# Prerequisites

- [DC/OS installed on your cluster](https://docs.mesosphere.com/latest/administration/installing/).

# Steps

1. Generate and save 4 x random passwords for the system-level MongoDB users *(backup, userAdmin, clusterAdmin and clusterMonitor)*, using the openssl tool:
    ```shell
    $ openssl rand -base64 8
    sLWGYC0yAIU=
    $ openssl rand -base64 8
    7Spl1m2bgo0=
    $ openssl rand -base64 8
    DH1UXPVrKyA=
    $ openssl rand -base64 8
    rtJx/fcJSIk=
    ```

1. Generate and save a 1023-length key for MongoDB using the openssl tool:
    ```shell
    $ openssl rand -base64 756
    ```

1. Install and configure Percona-Server-MongoDB from [the DC/OS web interface](https://docs.mesosphere.com/latest/usage/webinterface/) by adding the 4 x generated passwords and key to the required fields of the `Mongodb Credentials` section of the service config.

1. The service will now deploy with a default configuration. You can monitor its deployment via the **Services** tab of the DC/OS web interface.

1. Gather the `dns` names of the member nodes.
    ```shell
    $ dcos percona-server-mongodb endpoints mongo-port
        {
          "address": [
            "10.0.3.53:27017",
            "10.0.3.159:27017",
            "10.0.1.211:27017"
          ],
          "dns": [
            "mongo-rs-0-mongod.percona-server-mongodb.autoip.dcos.thisdcos.directory:27017",
            "mongo-rs-1-mongod.percona-server-mongodb.autoip.dcos.thisdcos.directory:27017",
            "mongo-rs-2-mongod.percona-server-mongodb.autoip.dcos.thisdcos.directory:27017"
          ]
        }
    ```
1. Connect to MongoDB and add a non-admin user using the [mongo shell](https://docs.mongodb.com/manual/mongo/) tool and the `userAdmin` user (replace username/password for your situation).
    ```shell
    $ mongo mongodb://useradmin:useradminpassword@mongo-rs-0-mongod.percona-server-mongodb.autoip.dcos.thisdcos.directory,mongo-rs-1-mongod.percona-server-mongodb.autoip.dcos.thisdcos.directory,mongo-rs-2-mongod.percona-server-mongodb.autoip.dcos.thisdcos.directory:27017/admin?replicaSet=rs
    > use admin;
    > db.createUser({
          user: "myApp",
          pwd: "myAppPasswd123456",
          roles: [
              { db: "myApp", role: "readWrite" }
          ]
      });
    > quit()
    ```

     You can also add a MongoDB user using the DC/OS CLI and a `.json` file describing the MongoDB user:
    ```shell`
    $ cat <<EOF >myApp.json
    {
          "user": "myApp",
          "pwd": "myAppPasswd123456",
          "roles": [
              { "db": "myApp", "role": "readWrite" }
          ]
    }
    EOF
    $ dcos percona-server-mongodb user add admin myApp.json
    ```

1. Reconnect using your new application-level user `myApp`.
    ```shell
    $ mongo mongodb://myApp:myAppPasswd123456@mongo-rs-0-mongod.percona-server-mongodb.autoip.dcos.thisdcos.directory,mongo-rs-1-mongod.percona-server-mongodb.autoip.dcos.thisdcos.directory,mongo-rs-2-mongod.percona-server-mongodb.autoip.dcos.thisdcos.directory:27017/admin?replicaSet=rs
    ```
1. Change to MongoDB database `myApp` and write a document to the collection `test`.
    ```shell
    > use myApp;
    > db.test.insert({ message: "This is a test!" });
    WriteResult({ "nInserted" : 1 })
    >
    ```
1. Read all documents from collection `test`.
    ```shell
    > db.test.find()
    { "_id" : ObjectId("5ab8fa034af828c184b57616"), "message" : "this is a test!" }
    ```
1. Get the number of documents for collection `test`.
    ```shell
    > db.test.count()
    1
    ```
1. Drop/delete the collection `test`.

    <table class=“table” bgcolor=#7d58ff>
    <tr> 
        <td align=justify style=color:white><strong>Note:</strong> Drops/deletes cannot be undone. Always back up important data before dropping it!</td> 
    </tr> 
    </table>
    
    ```shell
    > db.test.drop()
    true
    ```

# See Also

- [Connecting clients](https://docs.mesosphere.com/services/percona-server-mongodb/0.4.0-3.6.6/connecting-clients/)
