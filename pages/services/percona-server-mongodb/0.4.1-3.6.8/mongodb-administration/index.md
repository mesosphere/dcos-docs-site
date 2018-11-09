---
layout: layout.pug
navigationTitle:  Administration
title: Percona Server for MongoDB Administration
menuWeight: 65
excerpt: Administrative options for Percona Sever for MongoDB
featureMaturity:
enterprise: false
model: /services/percona-server-mongodb/data.yml
render: mustache
---

## Back up and Restore

Please see the ["Disaster Recovery"](https://docs.mesosphere.com/services/{{ model.serviceName }}/0.4.1-3.6.8/disaster-recovery/) section.

## Scaling

Scaling of the number of {{ model.dbName }} Replica Set nodes is possible using the service in both the web interface and CLI. Currently scaling up/down to 1, 3, 5 or 7 replica set members is possible; odd numbers are required for high-availability. A Replica Set with only one node is not recommended as it has no redundancy or high availability.

Note that scaling "up" will cause the {{ model.dbName }} Replica Set Primary to copy **all** of the replica set data to any new members. This may temporarily degrade database performance. In some cases it is possible your application will temporarily receive errors during a scale "down" if it was reading from a node that was killed in the process of the scale-down. Most {{ model.dbName }} drivers expect this type of failure to occur.

To scale the Replica Set in the web interface:
1. View the service in the **Services** section.
1. Press **Edit Configuration**.
1. Go to the **Mongodb** section of the service configuration.
1. Change the `count` field to 1, 3, 5 or 7.
1. Wait for the service scheduler process `{{ model.serviceName }}` to restart and apply the changes.

To scale the Replica Set using the CLI:

   ```shell
   $ dcos {{ model.serviceName }} scale [up|down] [1|3|5|7]
   ```

To list the current count/scale using the CLI:

   ```shell
   $ dcos {{ model.serviceName }} scale list
   3
   ```

## Monitoring

Monitoring of [{{ model.techName }}](https://www.percona.com/software/mongo-database/percona-server-for-mongodb) is possible using the [DC/OS Metrics component](https://docs.mesosphere.com/1.12/metrics/). Please see the [Metrics API](https://docs.mesosphere.com/1.12/metrics/metrics-api/) documentation for more information on using these metrics.

To enable DC/OS Metrics, toggle the `Enabled` flag in the `Dcos Metrics` section of the service configuration. 

[enterprise]
## SSL/TLS Connections
[/enterprise]

You can enable the SSL/TLS transport security capabilities of [{{ model.techName }}](https://www.percona.com/software/mongo-database/percona-server-for-mongodb) using the {{ model.serviceName }} service combined with the DC/OS [Secret Store feature](https://docs.mesosphere.com/1.12/security/ent/secrets/) (DC/OS Enterprise Edition only).

3 x SSL [security modes](https://docs.mongodb.com/manual/reference/configuration-options/#net.ssl.mode) are possible with this feature:
1. **allowSSL** - Both insecure and ssl-secured connections are allowed.
1. **preferSSL** - Both insecure and ssl-secured connections are allowed. Replication and sharding will use ssl-secured connections.
1. **requireSSL** - Insecure connections are not allowed.

<p class="message--note"><strong>NOTE: </strong> By default, <tt>preferSSL</tt> is used when SSL/TLS support is enabled.</p>


To start the service with {{ model.dbName }} SSL/TLS support:

1. Install the `dcos-enterprise-cli`:
    ```shell
    $ dcos package install dcos-enterprise-cli --cli
    ```

1. Create a public-private keypair:
    ```shell
    $ dcos security org service-accounts keypair priv.pem pub.pem
    ```

1. Create a service account for {{ model.serviceName }}:
    ```shell
    $ dcos security org service-accounts create -p pub.pem -d "{{ model.serviceName }}" {{ model.serviceName }}-service-acct
    ```

1. Create a service acccount Secret:
    ```shell
    $ dcos security secrets create-sa-secret priv.pem {{ model.serviceName }}-service-acct {{ model.serviceName }}-service-acct-secret
    ```

1. Grant the service account `superuser` privileges:
    ```shell
    $ dcos security org users grant {{ model.serviceName }}-service-acct dcos:superuser full
    ```

1. On the `Services` page of the DC/OS web interface, create a new {{ model.serviceName }} service.
1. Switch to the `Service` section of the service configuration.
1. Enter the service account name (such as "{{ model.serviceName }}-service-acct") in the field `principal`.
1. Enter the service account secret name (such as "{{ model.serviceName }}-service-acct-secret") in the field `secret_name`.
1. Switch to the `Mongodb Ssl` section of the service configuration.
1. Check the `Enabled` box to enable SSL support.

From this point on, deploy the service as usual.

## Auditing

The [{{ model.techName }} Auditing](https://www.percona.com/doc/percona-server-for-mongodb/auditing.html) feature allows detailed logging of actions in {{ model.dbName }}. Auditing configuration is automated by the DC/OS {{ model.serviceName }} service.

To enable auditing via the web interface:
1. Edit a new or existing service configuration.
1. Visit the **Mongodb Auditlog** tab of the service configuration.

In the **Mongodb Auditlog** tab there are fields to:
1. Enable/disable the feature.
1. Filter the output of the audit log.

### Get auditLog from the web interface

1. Visit the **Files** page of a {{ model.dbName }} task (ending in -mongod).
1. Download the file `auditLog.bson` in the sub-directory `mongo-data`.

### Get auditLog from CLI
1. Get the task ID of the {{ model.dbName }} task using the `dcos task` CLI command:
    ```shell
    dcos task
    ```
2. Get an interactive shell on the {{ model.dbName }} container using the `dcos task exec` command:
    ```shell
    dcos task exec --tty --interactive <task-id> /bin/bash
    ```
3. View the auditLog by reading the `auditLog.bson` file in the `mongo-data` sub-directory. You can use the `bsondump` command to parse the BSON format.

## Troubleshooting

The {{ model.dbName }} Log can be gathered in two ways: via the DC/OS web interface or the DC/OS CLI.

### Get {{ model.dbName }} Log from web interface

1. Visit the `Logs` page of a {{ model.dbName }} task (ending in -mongod).
1. Click the **Stdout** to visit the `stdout` logging page.

The log can be downloaded from the DC/OS web interface by downloading the file `stdout`, seen in the **Files*** tab for the task.

### Get {{ model.dbName }} Log from CLI

1. Get the task ID of the {{ model.dbName }} task using the `dcos task` CLI command:
    ```shell
    dcos task
    ```
2. Get an interactive shell on the {{ model.dbName }} container using the `dcos task exec` command:
    ```shell
    dcos task exec --tty --interactive <task-id> /bin/bash
    ```
3. View the {{ model.dbName }} log by reading the `stdout` file in the current directory.

## Users
<a name="mongodb-users"></a>

The {{ model.techName }} service contains several custom plans for modifying {{ model.dbName }} users via the {{ model.serviceName }} CLI tool.

All actions require the username and password of the {{ model.dbName }} clusterAdmin (defined in the service configuration).

### DC/OS {{ model.serviceName }} System Users
<a name="system-users"></a>

The {{ model.serviceName }} service deploys 4 x default {{ model.dbName }} users for various purposes.

<p class="message--important"><strong>IMPORTANT: </strong> These users cannot be modified or removed. Tasks that modify the users below will receive an error.</p>


| Username (default): | Service Config Field:          | {{ model.dbName }} Role(s):                                                                           | Internal Purpose: |
|-----------------------|--------------------------------|--------------------------------------------------------------------------------------------|-------------------|
| backup                | `mongodb.backupUser`         | [backup](https://docs.mongodb.com/manual/reference/built-in-roles/#backup), [clusterMonitor](https://docs.mongodb.com/manual/reference/built-in-roles/#clusterMonitor) | Backup Tasks |
| clusteradmin          | `mongodb.clusterAdminUser`   | [clusterAdmin](https://docs.mongodb.com/manual/reference/built-in-roles/#clusterAdmin)     | Cluster Administration Tasks |
| clustermonitor        | `mongodb.clusterMonitorUser` | [clusterMonitor](https://docs.mongodb.com/manual/reference/built-in-roles/#clusterMonitor) | DC/OS Healthchecks |
| useradmin             | `mongodb.userAdminUser`      | [userAdmin](https://docs.mongodb.com/manual/reference/built-in-roles/#clusterMonitor)      | User Administration Tasks |

### Add user

To add a user:

1. Create a JSON-formatted file containing a [{{ model.dbName }} User definition](https://docs.mongodb.com/manual/reference/method/db.createUser/#definition), example:

    ```javascript
    {
      "user": "prodapp",
      "pwd": "123456",
      "roles": [
        { "db": "app", "role": "readWrite" }
      ]
    }
    ```

1. Add the user to the {{ model.serviceName }} service using the service CLI tool, providing the filename of the user definition.

    ```shell
    $ dcos {{ model.serviceName }} user add <database> <user-json-file>
    ```

### Update user

1. Create a JSON-formatted file containing a [{{ model.dbName }} User definition](https://docs.mongodb.com/manual/reference/method/db.createUser/#definition), example:

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

1. Update the user using the {{ model.serviceName }} CLI tool by providing the filename of the user definition:

    ```shell
    $ dcos {{ model.serviceName }} user update <database> <user-json-file>
    ```

### Remove User

To remove a user, provide the database and username to the `{{ model.serviceName }}` CLI tool, as in the following example:

    $ dcos {{ model.serviceName }} user remove <database> <username>

### Reload {{ model.serviceName }} Service/System users

To reload the {{ model.serviceName }} [System Users](#system-users), run the following command using the {{ model.serviceName }} CLI tool:

    
    $ dcos {{ model.serviceName }} user reload-system
    

### Stop a user change

To stop an add, update, remove or reload-system operation, run the following command with the action name you would like to stop:

    $ dcos {{ model.serviceName }} user stop <action-name>
  

See `dcos {{ model.serviceName }} user stop --help` for more information.
