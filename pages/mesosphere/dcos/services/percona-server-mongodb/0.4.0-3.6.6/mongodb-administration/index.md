---
layout: layout.pug
navigationTitle:  Percona Server for MongoDB Administration
title: Percona Server for MongoDB Administration
menuWeight: 65
excerpt: Administrative options for Percona Sever for MongoDB
featureMaturity:
enterprise: false
---

## Backup and Restore

Please see the ["Disaster Recovery"](https://docs.mesosphere.com/services/percona-server-mongodb/0.4.0-3.6.6/disaster-recovery/) section.

## Scaling

Scaling of the number of MongoDB Replica Set nodes is possible using the service in both the web interface and CLI. Currently scaling up/down to 1, 3, 5 or 7 replica set member is possible, odd numbers are required for high-availability. A Replica Set with 1 node is not recommended as it has no redundancy or high availability.

Note that scaling "up" will cause the MongoDB Replica Set Primary to copy ALL of the replica set data to any new members. This may temporarily degrade database performance. In some cases it is possible your application will temporarily receive errors during a scale "down" if it was reading from a node that was killed in the process of the scale-down. Most MongoDB drivers expect this type of failure to occur.

To scale the Replica Set in the web interface:
1. View the service in the **Services** section.
1. Press **Edit Configuration**.
1. Go to the **Mongodb** section of the service configuration.
1. Change the `count` field to 1, 3, 5 or 7.
1. Wait for the service scheduler process `percona-server-mongodb` to restart and apply the changes.

To scale the Replica Set using the CLI:

   ```shell
   $ dcos percona-server-mongodb scale [up|down] [1|3|5|7]
   ```

To list the current count/scale using the CLI:

   ```shell
   $ dcos percona-server-mongodb scale list
   3
   ```

## Monitoring

Monitoring of [Percona Server for MongoDB](https://www.percona.com/software/mongo-database/percona-server-for-mongodb) is possible using the [DC/OS Metrics component](https://docs.mesosphere.com/1.11/metrics/). Please see the [Metrics API](https://docs.mesosphere.com/1.11/metrics/metrics-api/) documentation for more information on using these metrics.

To enable DC/OS Metrics, ensure the `Enabled` flag in the `Dcos Metrics` section of the service configuration. 

[enterprise]
## SSL/TLS Connections
[/enterprise]

You can enable the SSL/TLS transport security capabilities of [Percona Server for MongoDB](https://www.percona.com/software/mongo-database/percona-server-for-mongodb) using the Percona-Server-MongoDB service combined with the DC/OS Secret Store feature (DC/OS Enterprise Edition only).

3 x SSL [security modes](https://docs.mongodb.com/manual/reference/configuration-options/#net.ssl.mode) are possible with this feature:
1. **allowSSL** - Both insecure and ssl-secured connections are allowed.
1. **preferSSL** - Both insecure and ssl-secured connections are allowed. Replication and sharding will use ssl-secured connections.
1. **requireSSL** - Insecure connections are not allowed.

<table class=“table” bgcolor=#7d58ff>
<tr> 
  <td align=justify style=color:white><strong>Note:</strong> By default, "preferSSL" is used when SSL/TLS support is enabled</td> 
</tr> 
</table>


To start the service with MongoDB SSL/TLS support:

1. Install the `dcos-enterprise-cli`:
    ```shell
    $ dcos package install dcos-enterprise-cli --cli
    ```

1. Create a public-private keypair:
    ```shell
    $ dcos security org service-accounts keypair priv.pem pub.pem
    ```

1. Create a service account for Percona-Server-MongoDB:
    ```shell
    $ dcos security org service-accounts create -p pub.pem -d "Percona-Server-MongoDB" percona-server-mongodb-service-acct
    ```

1. Create a service acccount Secret:
    ```shell
    $ dcos security secrets create-sa-secret priv.pem percona-server-mongodb-service-acct percona-server-mongodb-service-acct-secret
    ```

1. Grant the service account `superuser` privileges:
    ```shell
    $ dcos security org users grant percona-server-mongodb-service-acct dcos:superuser full
    ```

1. In `Services` page of the DC/OS web interface, create a new Percona-Server-MongoDB service.
1. Switch to the `Service` section of the service configuration.
1. Enter the service account name (such as "percona-server-mongodb-service-acct") in the field `principal`.
1. Enter the service account secret name (such as "percona-server-mongodb-service-acct-secret") in the field `secret_name`.
1. Switch to the `Mongodb Ssl` section of the service configuration.
1. Check the `Enabled` box to enable SSL support.

From this point on, deploy the service as usual.

## Auditing

The [Percona Server for MongoDB Auditing](https://www.percona.com/doc/percona-server-for-mongodb/auditing.html) feature allows detailed logging of actions in MongoDB. Auditing configuration is automated by the DC/OS Percona-Server-MongoDB service.

To enable auditing via the web interface:
1. Edit a new or existing service configuration.
1. Visit the **Mongodb Auditlog** tab of the service configuration.

In the **Mongodb Auditlog** tab there are fields to:
1. Enable/disable the feature.
1. Filter the output of the audit log.

### Get auditLog from the web interface

1. Visit the **Files** page of a MongoDB task (ending in -mongod).
1. Download the file `auditLog.bson` in the sub-directory `mongo-data`.

### Get auditLog from CLI
1. Get the task ID of the MongoDB task using the `dcos task` CLI command:
    ```shell
    dcos task
    ```
2. Get an interactive shell on the MongoDB container using the `dcos task exec` command:
    ```shell
    dcos task exec --tty --interactive <task-id> /bin/bash
    ```
3. View the auditLog by reading the `auditLog.bson` file in the `mongo-data` sub-directory. You can use the `bsondump` command to parse the BSON format.

## Troubleshooting

The MongoDB Log can be gathered in two ways, via the DC/OS web interface or the DC/OS CLI.

### Get MongoDB Log from web interface

1. Visit the `Logs` page of a MongoDB task (ending in -mongod).
1. Click the **Stdout** to visit the `stdout` logging page.

The log can be downloaded from the DC/OS web interface by downloading the file `stdout`, seen in the **Files*** tab for the task.

### Get MongoDB Log from CLI

1. Get the task ID of the MongoDB task using the `dcos task` CLI command:
    ```shell
    dcos task
    ```
2. Get an interactive shell on the MongoDB container using the `dcos task exec` command:
    ```shell
    dcos task exec --tty --interactive <task-id> /bin/bash
    ```
3. View the MongoDB log by reading the `stdout` file in the current directory.

## Users
<a name="mongodb-users"></a>

The Percona-Server-MongoDB service contains several custom plans for modifying MongoDB Users via the Percona-Server-MongoDB CLI tool.

All actions require the username and password of the MongoDB clusterAdmin (defined in service configuration).

### DC/OS Percona-Server-MongoDB System Users
<a name="system-users"></a>

The Percona-Server-MongoDB service deploys 4 x default MongoDB users for various purposes.

<table class=“table” bgcolor=#858585>
<tr> 
  <td align=justify style=color:white><strong>Important:</strong> These users cannot be modified or removed! Tasks that modify the users below will receive an error.</td> 
</tr> 
</table>


| Username (default): | Service Config Field:          | MongoDB Role(s):                                                                           | Internal Purpose: |
|-----------------------|--------------------------------|--------------------------------------------------------------------------------------------|-------------------|
| backup                | `mongodb.backupUser`         | [backup](https://docs.mongodb.com/manual/reference/built-in-roles/#backup), [clusterMonitor](https://docs.mongodb.com/manual/reference/built-in-roles/#clusterMonitor) | Backup Tasks |
| clusteradmin          | `mongodb.clusterAdminUser`   | [clusterAdmin](https://docs.mongodb.com/manual/reference/built-in-roles/#clusterAdmin)     | Cluster Administration Tasks |
| clustermonitor        | `mongodb.clusterMonitorUser` | [clusterMonitor](https://docs.mongodb.com/manual/reference/built-in-roles/#clusterMonitor) | DC/OS Healthchecks |
| useradmin             | `mongodb.userAdminUser`      | [userAdmin](https://docs.mongodb.com/manual/reference/built-in-roles/#clusterMonitor)      | User Administration Tasks |

### Add user

To add a user:

1. Create a JSON-formatted file containing a [MongoDB User definition](https://docs.mongodb.com/manual/reference/method/db.createUser/#definition), example:

    ```javascript
    {
      "user": "prodapp",
      "pwd": "123456",
      "roles": [
        { "db": "app", "role": "readWrite" }
      ]
    }
    ```

1. Add the user to the Percona-Server-MongoDB service using the service CLI tool, providing the filename of the user definition.

    ```shell
    $ dcos percona-server-mongodb user add <database> <user-json-file>
    ```

### Update user

1. Create a JSON-formatted file containing a [MongoDB User definition](https://docs.mongodb.com/manual/reference/method/db.createUser/#definition), example:

    ```javascript
    {
      "user": "prodapp",
      "pwd": "123456",
      "roles": [
        { "db": "app", "role": "readWrite" },
        { "db": "anotherApp", "role": "read" },
      ]
    }
    ```

1. Update the user using the Percona-Server-MongoDB CLI tool by providing the filename of the user definition:

    ```shell
    $ dcos percona-server-mongodb user update <database> <user-json-file>
    ```

### Remove User

To remove a user, provide the database and username to the `percona-server-mongodb` CLI tool, as in the following example:

    ```shell
    $ dcos percona-server-mongodb user remove <database> <username>
    ```

### Reload Percona-Server-MongoDB Service/System users

To reload the Percona-Server-MongoDB [System Users](#system-users), run the following command using the Percona-Server-MongoDB CLI tool:

    ```shell
    $ dcos percona-server-mongodb user reload-system
    ```

### Stop a user change

To stop an add, update, remove or reload-system operation, run the following command with the action name you would like to stop:

    ```shell
    $ dcos percona-server-mongodb user stop <action-name>
    ```

See 'dcos percona-server-mongodb user stop --help' for more information*
