---
layout: layout.pug
navigationTitle: 
excerpt: Diagnosing Spark 
title: Troubleshooting
menuWeight: 125
model: /services/spark/data.yml
render: mustache
---

# Dispatcher

*   The Mesos cluster dispatcher is responsible for queuing, tracking, and supervising drivers. Potential problems may
    arise if the dispatcher does not receive the resources offers you expect from Mesos, or if driver submission is
    failing. To debug this class of issue, visit the Mesos UI at `http://<dcos-url>/mesos/` and navigate to the sandbox
    for the dispatcher.

*   {{ model.techShortName }} has an internal mechanism for detecting the IP of the host. We use this method by default, but sometimes it fails, returning errors like these:

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

    In this case, enable the `service.use_bootstrap_for_IP_detect` option in the Dispatcher config, either via the UI,
    editing the task or set to `true` in the options.json, and restart the service.  This will cause the DC/OS-specific
    `bootstrap` utility to detect the IP, which may allow the initialization of the Spark service to complete. 

# Jobs

*   DC/OS {{ model.Name }} jobs are submitted through the dispatcher, which displays {{ model.techShortName }} properties and job state. Start here to verify that the job is configured as you expect.

*   The dispatcher further provides a link to the job's entry in the history server, which displays the {{ model.techShortName }} Job UI.
    This UI shows the link for the job. Navigate to it to debug issues with scheduling and performance.

*   Jobs themselves log output to their sandbox, which you can access through the Mesos UI. The {{ model.techShortName }} logs will be sent to `stderr`, while any output you write in your job will be sent to `stdout`.

*   To disable using the Mesosphere `bootstrap` utility for host IP detection in jobs add
    `spark.mesos.driverEnv.SKIP_BOOTSTRAP_IP_DETECT=true` to your job configuration.

# CLI

The {{ model.techShortName }} CLI is integrated with the dispatcher so that they always use the same version of {{ model.techShortName }}, and so that certain
defaults are honored. To debug issues with their communication, run your jobs with the `--verbose` flag.

# HDFS Kerberos

To debug authentication in a {{ model.techShortName }} job, enable Java security debug output:

    dcos spark run --submit-args="--conf sun.security.krb5.debug=true..."
