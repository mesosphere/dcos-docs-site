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

# Jobs

*   DC/OS Apache Spark jobs are submitted through the dispatcher, which displays Spark properties and job state. Start here to verify that the job is configured as you expect.

*   The dispatcher further provides a link to the job's entry in the history server, which displays the Spark Job UI. The UI shows scheduling and performance information for the job. Go here to debug issues with scheduling and performance.

*   Jobs themselves log output to their sandbox, which you can access through the Mesos UI. The Spark logs are sent to standard error (`stderr`), while any output you write in your job is sent to standard output (`stdout`).

# CLI

The Spark CLI is integrated with the dispatcher so that they always use the same version of Spark, and so that certain defaults are honored. To debug issues with their communication, run your jobs with the `--verbose` flag.

# HDFS Kerberos

To debug authentication in a Spark job, enable Java security debug output:

    dcos spark run --submit-args="--conf sun.security.krb5.debug=true..."
