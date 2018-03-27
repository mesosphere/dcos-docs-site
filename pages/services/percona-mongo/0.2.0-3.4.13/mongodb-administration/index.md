---
post_title: MongoDB Administration
menu_order: 65
enterprise: 'no'
---

## MongoDB Users
<a name="mongodb-users"></a>

The percona-mongo service contains several custom plans for modifying MongoDB Users via the percona-mongo CLI tool.

All actions require the username ands password of the MongoDB clusterAdmin *(defined in service configuration)*.

### System Users
<a name="system-users"></a>

The percona-mongo service deploys 4 x default MongoDB users for various purposes.

**Note: These users cannot be modified or removed! Tasks that modify the users below will receive an error**

| Username *(default)*: | Service Config Field:          | MongoDB Role(s):       |
|-----------------------|--------------------------------|------------------------|
| backup                | *"mongodb.backupUser"*         | [backup](https://docs.mongodb.com/manual/reference/built-in-roles/#backup), [clusterMonitor](https://docs.mongodb.com/manual/reference/built-in-roles/#clusterMonitor) |
| clusteradmin          | *"mongodb.clusterAdminUser"*   | [clusterAdmin](https://docs.mongodb.com/manual/reference/built-in-roles/#clusterAdmin)     |
| clustermonitor        | *"mongodb.clusterMonitorUser"* | [clusterMonitor](https://docs.mongodb.com/manual/reference/built-in-roles/#clusterMonitor) |
| useradmin             | *"mongodb.userAdminUser"*      | [userAdmin](https://docs.mongodb.com/manual/reference/built-in-roles/#clusterMonitor)      |

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

1. Add the user to the percona-mongo service using the service CLI tool, providing the filename of the user definition.

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

1. Update the user using the percona-mongo CLI tool by providing the filename of the user definition:

```shell
dcos percona-mongo user update <database> <user-json-file> <useradmin-username> <useradmin-password>
```

### Remove User

To remove a user, provide the database and username to the percona-mongo CLI tool like the following example:

```shell
dcos percona-mongo user remove <database> <username> <useradmin-username> <useradmin-password>
```

### Reload percona-mongo Service/System Users

To reload the percona-mongo [System Users](#system-users), run the following command using the percona-mongo CLI tool:

```shell
dcos percona-mongo user reload-system <useradmin-username> <useradmin-password>
```

### Stop a User Change

To stop an add, update, remove or reload-system operation, run the following command with the action name you would like to stop:

```shell
dcos percona-mongo user stop <action-name>
```

*See 'dcos percona-mongo user stop --help' for more information*
