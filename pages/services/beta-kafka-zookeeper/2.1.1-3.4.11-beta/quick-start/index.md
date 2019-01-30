---
layout: layout.pug
navigationTitle: 
title: Quick Start
menuWeight: 40
excerpt:
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-commons -->


# Prerequisite

- [DC/OS installed on your cluster](/latest/administration/installing/).

1. If you are using open source DC/OS, install an Apache Zookeeper cluster with the following command from the DC/OS CLI. If you are using Enterprise DC/OS, you may need to follow additional instructions. See the Install and Customize section for information.

   ```shell
   dcos package install beta-kafka-zookeeper
   ```

   Alternatively, you can install Apache Zookeeper from [the DC/OS web interface](/latest/usage/webinterface/).

1. The service will now deploy with a default configuration. You can monitor its deployment on the **Services** tab of the DC/OS web interface.

1. Connect a client to Apache Zookeeper.
   ```shell
   dcos beta-kafka-zookeeper endpoints
   [
     "clientport"
   ]

   dcos beta-kafka-zookeeper endpoints clientport
   {
       "vips": ["clientport.zookeeper.l4lb.thisdcos.directory:1140"],
       "address": [
           "10.0.2.193:1140",
           "10.0.1.227:1140",
           "10.0.3.223:1140"
       ],
       "dns": [
           "zookeeper-0-server.zookeeper.autoip.dcos.thisdcos.directory:1140",
           "zookeeper-1-server.zookeeper.autoip.dcos.thisdcos.directory:1140",
           "zookeeper-2-server.zookeeper.autoip.dcos.thisdcos.directory:1140"
       ],
       "vip": "clientport.zookeeper.l4lb.thisdcos.directory:1140"
   }
   ```

You will use the values in the `address` field for the final step.


# Install the ZooKeeper CLI

1. [SSH into one your agent nodes](/1.10/administering-clusters/sshcluster/).
   
   ```
   dcos node ssh --master-proxy --mesos-id=<agent-id>
   ```
   
1. Download the [latest ZooKeeper release](http://zookeeper.apache.org/releases.html) to the node and uncompress it.
   
   ```
   curl -O http://www.trieuvan.com/apache/zookeeper/zookeeper-3.4.11/zookeeper-3.4.11.tar.gz
   tar -xzf zookeeper-3.4.11.tar.gz
   ```
1. Run the `zkCli.sh` script with the proper arguments, including one of the IPs that you found earlier.

   ```
   docker run -it zookeeper zkCli.sh -server 10.0.3.206:1140
   ```


Your output will look like:

```
Connecting to 10.0.2.193:1140
2017-07-24 13:10:41,347 [myid:] - INFO  [main:Environment@100] - Client environment:host.name=10.0.2.193
...
Welcome to ZooKeeper!
...
JLine support is enabled
2017-07-24 13:10:41,737 [myid:] - INFO  [main-SendThread(10.0.2.193:1140):ClientCnxn$SendThread@1299] - Session establishment complete on server 10.0.2.193/10.0.2.193:1140, sessionid = 0x15d75be6fc70000, negotiated timeout = 30000

WATCHER::

WatchedEvent state:SyncConnected type:None path:null
```

This is the same output we would expect when running ZooKeeper locally on just one node. Now, we have all the native ZooKeeper commands available to us.

# Run Commands
To get a list of possible commands, run:

```
help
```

And receive:

```
ZooKeeper -server host:port cmd args
  stat path [watch]
  set path data [version]
  ls path [watch]
  delquota [-n|-b] path
  ls2 path [watch]
  setAcl path acl
  setquota -n|-b val path
  history
  redo cmdno
  printwatches on|off
  delete path [version]
  sync path
  listquota path
  rmr path
  get path [watch]
  create [-s] [-e] path data acl
  addauth scheme auth
  quit
  getAcl path
  close
  connect host:port
[zk: 10.0.2.193:1140(CONNECTED) 1]
```

A simple canary test for a properly configured ZooKeeper cluster is to create a znode, verify its existence, and delete it. Do this by running the following commands:

```
[zk: 10.0.2.193:1140(CONNECTED) 1] create /test my_data

Created /test
```

```
[zk: 10.0.2.193:1140(CONNECTED) 2] ls /

[zookeeper, test]
```

```
[zk: 10.0.2.193:1140(CONNECTED) 3] delete /test
[zk: 10.0.2.193:1140(CONNECTED) 4] ls /

[zookeeper]
```

# High Availability
We can also connect to every node in the cluster when running native ZooKeeper commands. If the connection to a single node in the cluster is lost, ZooKeeper will automatically try to connect you to the next available node in the cluster.

To enable this, pass a comma-delimited list of all agent IPs as an argument to the `zkCli.sh` script. With this example, the command would be:

```
docker run -it zookeeper zkCli.sh -server 10.0.3.206:1140 10.0.3.206:1140,10.0.1.244:1140,10.0.0.244:1140
```

# See Also

- [Connecting clients][1].

 [1]: connecting-clients.md
