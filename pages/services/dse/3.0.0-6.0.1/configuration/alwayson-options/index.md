---
layout: layout.pug
navigationTitle: AlwaysOnSQL Options
excerpt: Configuring AlwaysOn SQL
title: AlwaysOnSQL Options
menuWeight: 20
model: /services/dse/data.yml
render: mustache
---

# Working with AlwaysOn SQL :

 Configuration of AlwaysOn SQL is divided into the following parts:

  1. Set up and configure the AlwaysOn SQL

  2. Enabling AlwaysOn SQL

  3. Starting and stopping AlwaysOn SQL

  4. Checking the status of AlwaysOn SQL

## Set up and configure the AlwaysOn SQL

  The AlwaysOn SQL configurable options are present in Configuration section for `dse` has options for setting the ports, timeout values, log location, and other Spark or Hive configuration settings.

The template for AlwaysOn SQL Configuration is below:

```
# alwayson_sql_options:
#     enabled: false
#     thrift_port: 10000
#     web_ui_port: 9077
#     reserve_port_wait_time_ms: 100
#     alwayson_sql_status_check_wait_time_ms: 500
#     workpool: alwayson_sql
#     log_dsefs_dir: /spark/log/alwayson_sql
#     auth_user: alwayson_sql
#     runner_max_errors: 10
```
For more information about these options, refer to the detailed documentation [here](https://docs.datastax.com/en/dse/6.0/dse-dev/datastax_enterprise/config/configDseYaml.html#configDseYaml__alwaysonSqlOptions).

## Enabling AlwaysOn SQL

Set `enabled` to `true` in the AlwaysOn SQL options in the `dse` configuration section.

### Starting and stopping AlwaysOn SQL

 If you have enabled AlwaysOn SQL, it will start when the cluster is started. You only need to explicitly start the server if it has been stopped; for example, for a configuration change.
 
 To start AlwaysOn SQL service:

```
    dse client-tool alwayson-sql start
```

 To completely stop AlwaysOn SQL service:
 
```
    dse client-tool alwayson-sql stop
```
 The server must be manually started after issuing a stop command.
 
 To restart a running server:
 
```
    dse client-tool alwayson-sql restart
```

### Checking the status of AlwaysOn SQL

  To find the status of AlwaysOn SQL issue a status command using dse-client-tool.

```
    dse client-tool alwayson-sql status
```

  The returned status is one of:

   - RUNNING: the server is running and ready to accept client requests.
   - STOPPED_AUTO_RESTART: the server is being started but is not yet ready to accept client requests.
   - STOPPED_MANUAL_RESTART: the server was stopped with either a stop or restart command. If the server was issued a restart          command, the status will be changed to STOPPED_AUTO_RESTART as the server starts again.
   - STARTING: the server is actively starting up but is not yet ready to accept client requests.
   
