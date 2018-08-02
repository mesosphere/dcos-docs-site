---
layout: layout.pug
navigationTitle:  Quick Start
title: Quick Start
menuWeight: 40
excerpt:
featureMaturity:
enterprise: false
---

# Prerequisite

- [DC/OS installed on your cluster](https://docs.mesosphere.com/latest/administration/installing/).

# Steps

1. If you are using open source DC/OS, install Percona-Mongo cluster with the following command from the DC/OS CLI. If you are using Enterprise DC/OS, you may need to follow additional instructions. See the Install and Customize section for information.

    ```shell
    dcos package install percona-mongo
    ```

    Alternatively, you can install Percona-Mongo from [the DC/OS web interface](https://docs.mesosphere.com/latest/usage/webinterface/).

1. The service will now deploy with a default configuration. You can monitor its deployment via the Services tab of the DC/OS web interface.

1. Gather the *"dns"* names of the member nodes.
    ```shell
    $ dcos percona-mongo endpoints mongo-port
        {
          "address": [
            "10.0.3.53:27017",
            "10.0.3.159:27017",
            "10.0.1.211:27017"
          ],
          "dns": [
            "mongo-rs-0-mongod.percona-mongo.autoip.dcos.thisdcos.directory:27017",
            "mongo-rs-1-mongod.percona-mongo.autoip.dcos.thisdcos.directory:27017",
            "mongo-rs-2-mongod.percona-mongo.autoip.dcos.thisdcos.directory:27017"
          ]
        }
    ```
1. Connect to MongoDB using the [mongo shell](https://docs.mongodb.com/manual/mongo/) tool and the *clusterAdmin* user *(replace username/password for your situation)*.
    ```shell
    $ mongo mongodb://useradmin:useradminpassword@mongo-rs-0-mongod.percona-mongo.autoip.dcos.thisdcos.directory,mongo-rs-1-mongod.percona-mongo.autoip.dcos.thisdcos.directory,mongo-rs-2-mongod.percona-mongo.autoip.dcos.thisdcos.directory:27017/admin?replicaSet=rs
    ```
1. Create a non-admin user for your application and exit the shell.
    ```shell
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
1. Reconnect using your new application-level user *"myApp"*.
    ```shell
    $ mongo mongodb://myApp:myAppPasswd123456@mongo-rs-0-mongod.percona-mongo.autoip.dcos.thisdcos.directory,mongo-rs-1-mongod.percona-mongo.autoip.dcos.thisdcos.directory,mongo-rs-2-mongod.percona-mongo.autoip.dcos.thisdcos.directory:27017/admin?replicaSet=rs
    ```
1. Change to MongoDB database "myApp" and write a document to the collection "test".
    ```shell
    > use myApp;
    > db.test.insert({ message: "this is a test!" });
    WriteResult({ "nInserted" : 1 })
    >
    ```
1. Read all documents from collection "test".
    ```shell
    > db.test.find()
    { "_id" : ObjectId("5ab8fa034af828c184b57616"), "message" : "this is a test!" }
    ```
1. Get the number of documents for collection "test".
    ```shell
    > db.test.count()
    1
    ```
1. Drop/delete the collection "test" **(NOTE: drops/deletes cannot be undone, always backup important data before dropping it!)**
    ```shell
    > db.test.drop()
    true
    ```

# See Also

- [Connecting clients][1].
 [1]: [https://docs.mesosphere.com/services/percona-mongo/0.2.0-3.4.13/connecting-clients/](https://docs.mesosphere.com/services/percona-mongo/0.2.0-3.4.13/connecting-clients/)
