---
layout: layout.pug
navigationTitle:  Percona Server for MongoDB Administration
title: Percona Server for MongoDB Administration
menuWeight: 65
excerpt:
featureMaturity:
enterprise: false
---

## Backup and Restore

Please see the ["Disaster Recovery"](https://docs.mesosphere.com/services/percona-mongo/0.3.0-3.6.5/disaster-recovery/) section of the documentation.

## Monitoring

Monitoring of [Percona Server for MongoDB](https://www.percona.com/software/mongo-database/percona-server-for-mongodb) is possible using the [DC/OS Metrics component](https://docs.mesosphere.com/1.11/metrics/). Please see the [Metrics API](https://docs.mesosphere.com/1.11/metrics/metrics-api/) documentation for more information on using these metrics.

To enable DC/OS Metrics, ensure the *'Enabled'* flag in the *'Dcos Metrics'* section of the service configuration. 

## Auditing

The [Percona Server for MongoDB Auditing](https://www.percona.com/doc/percona-server-for-mongodb/auditing.html) feature allows detailed logging of actions in MongoDB. The configuration of Auditing is automated by the DC/OS Percona-Mongo service.

To enable Auditing via the UI:
1. Edit a new or existing service configuration.
1. Visit the *'Mongodb Auditlog'* tab of the service configuration.

In the *'Mongodb Auditlog'* tab there are fields to:
1. Enable/disable the feature.
1. Filter the output of the audit log.

### Get Auditlog from UI

1. Visit the *'Files'* page of a MongoDB task *(ending in -mongod)*.
1. Download the file *'auditLog.bson'* in the sub-directory *'mongo-data'*.

### Get Auditlog from CLI
1. Get the task ID of the MongoDB task using the *'dcos task'* CLI command:
```shell
dcos task
```
2. Get an interactive shell on the MongoDB container using the *'dcos task exec'* command:
```shell
dcos task exec --tty --interactive <task-id> /bin/bash
```
3. View the Auditlog by reading the *'auditLog.bson'* file in the *'mongo-data'* sub-directory. You can use the *'bsondump'* command to parse the BSON format.

## Troubleshooting

The MongoDB Log can be gathered in two ways, via the DC/OS UI or the DC/OS CLI.

### Get MongoDB Log from UI

1. Visit the *'Logs'* page of a MongoDB task *(ending in -mongod)*.
1. Press the *'Stdout'* to visit the stdout logging page.

The log can be downloaded from the DC/OS UI by downloading the file *'stdout'*, seen in the *'Files'* tab for the task.

### Get MongoDB Log from CLI

1. Get the task ID of the MongoDB task using the *'dcos task'* CLI command:
```shell
dcos task
```
2. Get an interactive shell on the MongoDB container using the *'dcos task exec'* command:
```shell
dcos task exec --tty --interactive <task-id> /bin/bash
```
3. View the MongoDB log by reading the *'stdout'* file in the current directory.

## Users
<a name="mongodb-users"></a>

The Percona-Mongo service contains several custom plans for modifying MongoDB Users via the Percona-Mongo CLI tool.

All actions require the username and password of the MongoDB clusterAdmin *(defined in service configuration)*.

### DC/OS Percona-Mongo System Users
<a name="system-users"></a>

The Percona-Mongo service deploys 4 x default MongoDB users for various purposes.

**Note: These users cannot be modified or removed! Tasks that modify the users below will receive an error**

| Username *(default)*: | Service Config Field:          | MongoDB Role(s):                                                                           | Internal Purpose: |
|-----------------------|--------------------------------|--------------------------------------------------------------------------------------------|-------------------|
| backup                | *"mongodb.backupUser"*         | [backup](https://docs.mongodb.com/manual/reference/built-in-roles/#backup), [clusterMonitor](https://docs.mongodb.com/manual/reference/built-in-roles/#clusterMonitor) | Backup Tasks |
| clusteradmin          | *"mongodb.clusterAdminUser"*   | [clusterAdmin](https://docs.mongodb.com/manual/reference/built-in-roles/#clusterAdmin)     | Cluster Administration Tasks |
| clustermonitor        | *"mongodb.clusterMonitorUser"* | [clusterMonitor](https://docs.mongodb.com/manual/reference/built-in-roles/#clusterMonitor) | DC/OS Healthchecks |
| useradmin             | *"mongodb.userAdminUser"*      | [userAdmin](https://docs.mongodb.com/manual/reference/built-in-roles/#clusterMonitor)      | User Administration Tasks |

### Add User

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

1. Add the user to the Percona-Mongo service using the service CLI tool, providing the filename of the user definition.

```shell
dcos percona-mongo user add <database> <user-json-file>
```

### Update User

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

1. Update the user using the Percona-Mongo CLI tool by providing the filename of the user definition:

```shell
dcos percona-mongo user update <database> <user-json-file>
```

### Remove User

To remove a user, provide the database and username to the percona-mongo CLI tool like the following example:

```shell
dcos percona-mongo user remove <database> <username>
```

### Reload Percona-Mongo Service/System Users

To reload the Percona-Mongo [System Users](#system-users), run the following command using the Percona-Mongo CLI tool:

```shell
dcos percona-mongo user reload-system
```

### Stop a User Change

To stop an add, update, remove or reload-system operation, run the following command with the action name you would like to stop:

```shell
dcos percona-mongo user stop <action-name>
```

*See 'dcos percona-mongo user stop --help' for more information*
