---
layout: layout.pug
navigationTitle: Beeline CLI
excerpt: 
title: Using the Beeline CLI in Hive Metastore
menuWeight: 50
model: /mesosphere/dcos/services/hive-metastore/data.yml
render: mustache
enterprise: true
---

Users can interact with the {{ model.techName }} via the Beeline CLI.

# <a name="Using MySQL Database"></a> Using MySQL Database

- Please make sure the `Hive Metastore` & `MySQL` services are deployed and successfully runnning.

- Find the load balanced address for mysql. You'll need this to setup the connection with Beeline. You can find the LB address in the DC/OS UI under the `Services > mysql > Endpoints` tab. It should look similar to:
   ``` 
   mysql.marathon.l4lb.thisdcos.directory:3306
   ```

- Next, find the task-id for the `node-0-server` task of hive-metastore. It starts with `<Hive-Metastore Service name>__node-0-server`.

  ```
  dcos task | grep node-0-server
  ```
- Exec into the `node-0-server` task with the following command:

  ```
  dcos task exec -ti <NODE_0_SERVER_TASK_ID> bash -c \
    'export HADOOP_HOME=hadoop-3.2.0 \
    && export JAVA_HOME=$(ls -d jdk*) \
    && export HIVE_HOME=$(ls -d apache-hive-metastore-*) \
    && bash apache-hive-metastore-3.0.0-bin/bin/beeline \
    -u jdbc:mysql://<MYSQL_LOAD_BALANCED_ADDRESS> \
    -n root \
    -p root'
  ```
  
- Lastly, use the metastore database.

  ```
  use metastore_db;
  ```
- **Note**: Detailed documentation for using `dcos task exec` [link](https://docs.d2iq.com/mesosphere/dcos/1.13/monitoring/debugging/task-exec/).
  
# <a name="Reconnecting an inactive session"></a> Reconnecting an inactive session
  
  In the Beeline prompt, type `!reconnect` and it will reconnect to MySQL.
  
  ```
  !reconnect
  ```

# <a name="Ending an active session"></a> Ending an active session
  
  In the Beeline prompt, type `!quit` and it will end the session.
  
  ```
  !quit
  ```
  
# <a name="Basic Beeline Queries"></a> Basic Beeline Queries

  Beeline supports a rich set of SQL query functions. Few examples:
  ```
  SHOW DATABASES;
  USE <database>;

  SHOW TABLES;
  DESC <table>;
  DESC FORMATTED <table>;

  Simple limited select statements

  SELECT * FROM <TABLE_NAME> limit 25;
  ```

For a list of all Beeline commands, go to the [official Beeline docs](https://cwiki.apache.org/confluence/display/Hive/HiveServer2+Clients#HiveServer2Clients-BeelineCommands).
