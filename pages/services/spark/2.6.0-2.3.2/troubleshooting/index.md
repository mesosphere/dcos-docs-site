---
layout: layout.pug
navigationTitle: Troubleshooting
excerpt: Troubleshooting DC/OS Apache Spark
title: Troubleshooting
menuWeight: 125
render: mustache
model: /services/spark/data.yml
---

# Dispatcher

* The Mesos cluster dispatcher is responsible for queuing, tracking, and supervising drivers. Potential problems can arise if the dispatcher does not receive the resources offers you expect from Mesos, or if driver submission is failing. To debug this class of issue, visit the Mesos UI at `http://<dcos-url>/mesos/` and navigate to the sandbox for the dispatcher.

* Spark has an internal mechanism for detecting the IP address of the host. DC/OS uses this method by default, but sometimes it fails, returning errors like these:

    ```
    ERROR SparkUncaughtExceptionHandler: Uncaught exception in thread Thread[main,5,main]
        java.net.UnknownHostException: ip-172-31-4-148: ip-172-31-4-148: Name or service not known
            at java.net.InetAddress.getLocalHost(InetAddress.java:1505)
            at org.apache.spark.util.Utils$.findLocalInetAddress(Utils.scala:891)
            at org.apache.spark.util.Utils$.org$apache$spark$util$Utils$$localIpAddress$lzycompute(Utils.scala:884)
            at org.apache.spark.util.Utils$.org$apache$spark$util$Utils$$localIpAddress(Utils.scala:884)
            at org.apache.spark.util.Utils$$anonfun$localHostName$1.apply(Utils.scala:941)
            at org.apache.spark.util.Utils$$anonfun$localHostName$1.apply(Utils.scala:941)
            at scala.Option.getOrElse(Option.scala:121)
            at org.apache.spark.util.Utils$.localHostName(Utils.scala:941)
            at org.apache.spark.deploy.mesos.MesosClusterDispatcherArguments.<init>(MesosClusterDispatcherArguments.scala:27)
            at org.apache.spark.deploy.mesos.MesosClusterDispatcher$.main(MesosClusterDispatcher.scala:103)
            at org.apache.spark.deploy.mesos.MesosClusterDispatcher.main(MesosClusterDispatcher.scala)
        Caused by: java.net.UnknownHostException: ip-172-31-4-148: Name or service not known
            at java.net.Inet6AddressImpl.lookupAllHostAddr(Native Method)
            at java.net.InetAddress$2.lookupAllHostAddr(InetAddress.java:928)
            at java.net.InetAddress.getAddressesFromNameService(InetAddress.java:1323)
            at java.net.InetAddress.getLocalHost(InetAddress.java:1500)
            ... 10 more
    18/01/25 17:42:57 INFO ShutdownHookManager: Shutdown hook called
    ```

    In the case of IP address failures, enable the `service.use_bootstrap_for_IP_detect` option in the dispatcher configuration, by editing the task in the UI or by setting the parameter to `true` in the `options.json` file, then restart the service.  Changing this setting and restarting the service causes the DC/OS-specific
    `bootstrap` utility to detect the IP address, which may allow the initialization of the Spark service to complete.

# Jobs

*   DC/OS Apache Spark jobs are submitted through the dispatcher, which displays Spark properties and job state. Start here to verify that the job is configured as you expect.

*   The dispatcher further provides a link to the job's entry in the history server, which displays the Spark Job UI. The UI shows scheduling and performance information for the job. Go here to debug issues with scheduling and performance.

*   Jobs themselves log output to their sandbox, which you can access through the Mesos UI. The Spark logs are sent to standard error (`stderr`), while any output you write in your job is sent to standard output (`stdout`).

*   To disable using the Mesosphere `bootstrap` utility for host IP detection in jobs, add
    `spark.mesos.driverEnv.SKIP_BOOTSTRAP_IP_DETECT=true` to your job configuration.

# CLI

The Spark CLI is integrated with the dispatcher so that they always use the same version of Spark, and so that certain defaults are honored. To debug issues with their communication, run your jobs with the `--verbose` flag.

# HDFS Kerberos

To debug authentication in a Spark job, enable Java security debug output:

    dcos spark run --submit-args="--conf sun.security.krb5.debug=true..."
