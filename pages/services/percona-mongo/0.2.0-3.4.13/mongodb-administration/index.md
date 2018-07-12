---
layout: layout.pug
navigationTitle:  Percona Server for MongoDB Administration
title: Percona Server for MongoDB Administration
menuWeight: 65
excerpt:
featureMaturity:
enterprise: false
---

## Backups

Please see the "Disaster and Recovery" section of the documentation.

## Monitoring

Monitoring of [Percona Server for MongoDB](https://www.percona.com/software/mongo-database/percona-server-for-mongodb) is currently only possible via the optional [Percona Monitoring and Management](https://www.percona.com/software/database-tools/percona-monitoring-and-management) support. Monitoring via DC/OS Metrics is planned in the near future.

<a name="installing-pmm-client"></a>
### Installing PMM Client

The installation and configuration of the PMM Client is automated via the DC/OS Percona-Mongo Service.

To enable the installation of the PMM Client on all MongoDB nodes launched by the service, visit the 'Percona Pmm' tab of the service configuration and set the *"enabled"* field to true.

In the 'Percona Pmm' tab there are fields to set the:
- PMM Server Address *(hostname:port)*
- PMM Query Analytics *(enabled/disabled)*
- PMM Server SSL *(enabled/disabled)*
- PMM Server Username+Password
- PMM Client Version
- Port numbers for Linux and MongoDB monitoring *(default: 0 causes random port assignment)*

The pmm-client will be installed, configured and started at the start time of the MongoDB tasks. Combined with the mongod logs, you will see the following lines *(or similar)* in the stdout logs:
    ```shell
    2018-03-29 17:51:38.114 3     mongodb-executor-linux  INFO    MongoDB server is now reachable
    2018-03-29 17:51:38.114 3     mongodb-executor-linux  INFO    Repairing all PMM client services
    2018-03-29 17:51:38.124 3     mongodb-executor-linux  INFO    Listing PMM services
    2018-03-29 17:51:38.177 3     mongodb-executor-linux  INFO    Starting PMM metrics services  linux_port=1025 max_retries=5 mongodb_port=1026
    2018-03-29 17:51:38.429 3     mongodb-executor-linux  INFO    Added PMM service linux:metrics, pmm-admin out: 'OK, now monitoring this system.'
    2018-03-29 17:51:38.502 3     mongodb-executor-linux  INFO    Added PMM service mongodb:metrics, pmm-admin out: 'OK, now monitoring MongoDB metrics using URI clustermonitor:***@localhost:27017'
    2018-03-29 17:51:38.502 3     mongodb-executor-linux  INFO    Listing PMM services
    2018-03-29 17:51:38.531 3     mongodb-executor-linux  INFO    Starting PMM Query Analytics (QAN) agent service  max_retries=5
    2018-03-29 17:51:40.705 3     mongodb-executor-linux  INFO    Added PMM service mongodb:queries, pmm-admin out: 'OK, now monitoring MongoDB queries using URI clustermonitor:***@localhost:27017
    It is required for correct operation that profiling of monitored MongoDB databases be enabled.
    Note that profiling is not enabled by default because it may reduce the performance of your MongoDB server.
    For more information read PMM documentation (https://www.percona.com/doc/percona-monitoring-and-management/conf-mongodb.html).'
    2018-03-29 17:51:40.705 3     mongodb-executor-linux  INFO    Completed PMM client executor
    ```

*Note: The PMM Client uses the ['clusterMonitor' MongoDB user](#system-users) to gather data*

### Running PMM Server as a Marathon Job

*Note: this feature is in Beta. Some features of the PMM Server and PMM Query Analytics may not function correctly.*

The following process launches a single PMM Server container in DC/OS. This should be done **before** starting the Percona-Mongo service:
1. Visit the *'Services'* tab of the DC/OS UI.
1. Select *'Run a Service'*.
1. Select *'JSON Configuration'*.
1. Paste the following PMM Server job definition, modify if required:
    ```javascript
    {
      "id": "/pmm-server",
      "container": {
        "type": "DOCKER",
        "volumes": [
          {
            "external": {
              "name": "pmm-prometheus",
              "provider": "dvdi",
              "options": {
                "dvdi/driver": "rexray"
              }
            },
            "mode": "RW",
            "containerPath": "/opt/prometheus/data"
          },
          {
            "external": {
              "name": "pmm-consul",
              "provider": "dvdi",
              "options": {
                "dvdi/driver": "rexray"
              }
            },
            "mode": "RW",
            "containerPath": "/opt/consul-data"
          },
          {
            "external": {
              "name": "pmm-mysql",
              "provider": "dvdi",
              "options": {
                "dvdi/driver": "rexray"
              }
            },
            "mode": "RW",
            "containerPath": "/var/lib/mysql"
          },
          {
            "external": {
              "name": "pmm-grafana",
              "provider": "dvdi",
              "options": {
                "dvdi/driver": "rexray"
              }
            },
            "mode": "RW",
            "containerPath": "/var/lib/grafana"
          }
        ],
        "docker": {
          "image": "percona/pmm-server:1.8.1"
        },
        "portMappings": [
          {
            "containerPort": 80,
            "hostPort": 0,
            "labels": {
              "VIP_0": "/pmm-server:80"
            },
            "protocol": "tcp",
            "name": "pmm-server"
          }
        ]
      },
      "cpus": 2,
      "healthChecks": [
        {
          "portIndex": 0,
          "protocol": "MESOS_HTTP",
          "path": "/ping"
        }
      ],
      "instances": 1,
      "mem": 2048,
      "networks": [
        {
          "name": "dcos",
          "mode": "container"
        }
      ],
      "requirePorts": false,
      "constraints": [],
      "fetch": []
    }
    ```
1. On success, the service will become available at the DC/OS VIP *'pmm-server.marathon.l4lb.thisdcos.directory:80'*. You may need to to use a [DC/OS Tunnel](https://docs.mesosphere.com/1.10/administration/access-node/tunnel/) to visit the PMM HTTP interface *(at 'http://pmm-server.marathon.l4lb.thisdcos.directory')*.
1. Use the DC/OS VIP *'pmm-server.marathon.l4lb.thisdcos.directory:80'* as the *'Percona PMM server address'* parameter in your DC/OS Percona-Mongo service configuration ['Percona Pmm' section](#installing-pmm-client).

## Auditing

The [Percona Server for MongoDB Auditing](https://www.percona.com/doc/percona-server-for-mongodb/auditing.html) feature allows detailed logging of actions in MongoDB. The configuration of Auditing is automated by the DC/OS Percona-Mongo service.

To enable Auditing via the UI:
1. Edit a new or existing service configuration.
1. Visit the 'Mongodb Auditlog' tab of the service configuration.

In the 'Mongodb Auditlog' tab there are fields to:
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
| clustermonitor        | *"mongodb.clusterMonitorUser"* | [clusterMonitor](https://docs.mongodb.com/manual/reference/built-in-roles/#clusterMonitor) | DC/OS Healthchecks, Monitoring and [Percona PMM](https://www.percona.com/software/database-tools/percona-monitoring-and-management) *(optional)* |
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
dcos percona-mongo user add <database> <user-json-file> <useradmin-username> <useradmin-password>
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
dcos percona-mongo user update <database> <user-json-file> <useradmin-username> <useradmin-password>
```

### Remove User

To remove a user, provide the database and username to the percona-mongo CLI tool like the following example:

```shell
dcos percona-mongo user remove <database> <username> <useradmin-username> <useradmin-password>
```

### Reload Percona-Mongo Service/System Users

To reload the Percona-Mongo [System Users](#system-users), run the following command using the Percona-Mongo CLI tool:

```shell
dcos percona-mongo user reload-system <useradmin-username> <useradmin-password>
```

### Stop a User Change

To stop an add, update, remove or reload-system operation, run the following command with the action name you would like to stop:

```shell
dcos percona-mongo user stop <action-name>
```

*See 'dcos percona-mongo user stop --help' for more information*
