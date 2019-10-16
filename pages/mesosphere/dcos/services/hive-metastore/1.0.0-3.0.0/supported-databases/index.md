---
layout: layout.pug
navigationTitle: Supported Databases
excerpt: Supported Databases
title: Getting Started
menuWeight: 25
model: /mesosphere/dcos/services/hive-metastore/data.yml
render: mustache
---

## Supported Databases

The DC/OS {{ model.techName }} supports the following relational databases (RDBMS):
 - Derby
 - MySQL
 - Percona-MySQL

### Install the {{ model.techShortName }} with Derby
By default, {{ model.techName }} configuration is set to the default embedded Derby database for development usage. However, it is not intended for use beyond simple testing.

```
dcos package install {{ model.packageName }}
```


### Install the {{ model.techShortName }}  with MySQL
The {{ model.techShortName }} can also be backed by a MySQL database. This is recommended for production use.

- Users must deploy MySQL:

   ```
   dcos package install mysql
   ```

- Next, find the load balanced address for mysql. You'll need this to configure hive-metastore properly. You can find the LB address in the DC/OS UI under Services > mysql > Endpoints tab. It should look similar to:
   `mysql.marathon.l4lb.thisdcos.directory:3306`.

- Next, configure the `{{ model.packageName }}` package with the following configs:
   
   - Create a custom config file that will be used to install `{{ model.serviceName }} `, and save it as `metastore-options.json`.

      ```
      {
        "hive_metastore": {
          "database": "mysql",
          "database_user_name": "root",
          "database_password": "root",
          "database_address": "mysql.marathon.l4lb.thisdcos.directory:3306"
        }
      }
      ```
        
    - Deploy the `{{ model.techShortName }}` package:
      ```
      dcos package install hive-metastore --options=metastore-options.json
      ```

### Install Metastore with Percona-MySQL
Percona-MySQL is an enterprise-grade HA drop-in replacement for MySQL. To enable usage with Percona-MySQL:

- Users must deploy Percona-MySQL with the following configs:
   
  - Create a custom config file that will be used to install `percona-pxc-mysql`, and save it as `percona-options.json`.

      ```
      {
        "pxc-advanced": {
          "pxc_strict_mode": "PERMISSIVE"
        }
      }
      ```
      - `pxc_strict_mode` can also be set to `DISABLED`.
  - Deploy the Percona-MySQL package
      ```
      dcos package install percona-pxc-mysql --options=percona-options.json
      ```
  
- Next, configure the `{{ model.packageName }}` package with the following configs:
   
   - Create a custom config file that will be used to install `hive-metastore`, and save it as `metastore-options.json`.

      ```
      {
        "hive_metastore": {
          "database": "mysql",
          "database_user_name": "root",
          "database_password": "root",
          "database_address": "pxc-db.percona-pxc-mysql.l4lb.thisdcos.directory:3306"
        }
      }
      ```
    - The `database_address` assumes default installation of `percona-pxc-mysql`. If using custom configs, users can find the `vip` endpoint using percona's CLI command:

      ```
      $ dcos percona-pxc-mysql endpoints pxc-db-port
      ```

    - Deploy the `hive-metastore` package:
      ```
      dcos package install hive-metastore --options=metastore-options.json
      ```
   
- #### Limitations
  Currently, {{ model.techName }} is only compatible with Percona's `PERMISSIVE` and `DISABLED` modes. See the [limitations](../limitations/index.md) docs for more details.
  
