---
layout: layout.pug
navigationTitle: Quick Start Guide
excerpt: Get up and running with JupyterLab
title: Quick Start
menuWeight: 2
model: /services/jupyterlab/data.yml
render: mustache
---

This page explains how to install the {{ model.techName }} Service.

# Prerequisites


- DC/OS and DC/OS CLI installed with a minimum of {{ model.minNodeCount } agent nodes, with {{ model.nodeDescription }}.
- Depending on your security mode, {{ model.techName }} requires service authentication for access to DC/OS. See Provisioning a service account for more information.

| Security Mode | Service Account |
|----------------|------------------|
| Disabled | Not available |
| Permissive | Optional |
| Strict | Required |

# Install Mesosphere Jupyter Service

## From the CLI
Install the {{ model.packageName }} package. This may take a few minutes. This step installs the {{ model.packageName }} service, {{ model.packageName }} CLI, dispatcher, and, optionally, the history server. See the History Server section for information about how to install the history server.

   ```bash
   dcos package install {{ model.packageName }}
   ```

   Expected output:

   ```bash
   Installing Marathon app for package [{{ model.packageName }}] version [2.8.0-2.4.0]
   Installing CLI subcommand for package [{{ model.packageName }}] version [2.8.0-2.4.0]
   New command available: dcos {{ model.packageName }}
   DC/OS {{ model.packageName }} is being installed!

       Documentation: https://docs.mesosphere.com/services/{{ model.packageName }}/
       Issues: https://docs.mesosphere.com/support/
   ```
<p class="message--note"><strong>NOTE: </strong>Type dcos {{ model.packageName }} to view the {{ model.packageName }} CLI options.</p>

1. Run the sample {{ model.packageName }}Pi jar for DC/OS. You can view the example source here.
1. Use the following command to run a {{ model.packageName }} job which calculates the value of Pi.

    ```bash
    dcos {{ model.packageName }} run --submit-args="--class org.apache.{{ model.packageName }}.examples.{{ model.packageName }}Pi https://downloads.mesosphere.com/{{ model.packageName }}/assets/{{ model.packageName }}-examples_2.11-2.0.1.jar 30"
    ```

    Expected output:

    ```bash
    2017/08/24 15:42:07 Using docker image mesosphere/{{ model.packageName }}:2.8.0-2.4.0-hadoop-2.9 for drivers
    2017/08/24 15:42:07 Pulling image mesosphere/{{ model.packageName }}:2.8.0-2.4.0-hadoop-2.9 for executors, by default. To bypass set {{ model.packageName }}.mesos.executor.docker.forcePullImage=false
    2017/08/24 15:42:07 Setting DCOS_SPACE to /{{ model.packageName }}
    Run job succeeded. Submission id: driver-20170824224209-0001
    ```
1. View the standard output from your job:

    ```bash
    dcos {{ model.packageName }} log driver-20170824224209-0001
    ```

    Expected output:

    ```bash
    Pi is roughly 3.141853333333333
    ```

1. Run a Python {{ model.packageName }}Pi jar. You can view the example source here.

1. Use the following command to run a Python {{ model.packageName }} job which calculates the value of Pi.

    ```bash
    dcos {{ model.packageName }} run --submit-args="https://downloads.mesosphere.com/{{ model.packageName }}/examples/pi.py 30"
    ```

    Expected output:

    ```bash
    2017/08/24 15:44:20 Parsing application as Python job
    2017/08/24 15:44:23 Using docker image mesosphere/{{ model.packageName }}:2.8.0-2.4.0-hadoop-2.9 for drivers
    2017/08/24 15:44:23 Pulling image mesosphere/{{ model.packageName }}:2.8.0-2.4.0-hadoop-2.9 for executors, by default. To bypass set {{ model.packageName }}.mesos.executor.docker.forcePullImage=false
    2017/08/24 15:44:23 Setting DCOS_SPACE to /{{ model.packageName }}
    Run job succeeded. Submission id: driver-20170824224423-0002
    ```

1. View the standard output from your job:

    ```bash
    dcos task log --completed driver-20170616213917-0002
    ```
    Expected output:
    ```bash
    Pi is roughly 3.142715
    ```

1. Run an R job. You can view the example source here.

   1. Use the following command to run an R job.

       ```bash
       dcos {{ model.packageName }} run --submit-args="https://downloads.mesosphere.com/{{ model.packageName }}/examples/dataframe.R"
       ```
       Expected output:
       ```bash
       2017/08/24 15:45:21 Parsing application as R job
       2017/08/24 15:45:23 Using docker image mesosphere/{{ model.packageName }}:2.8.0-2.4.0-hadoop-2.9 for drivers
       2017/08/24 15:45:23 Pulling image mesosphere/{{ model.packageName }}:2.8.0-2.4.0-hadoop-2.9 for executors, by default. To bypass set {{ model.packageName }}.mesos.executor.docker.forcePullImage=false
       2017/08/24 15:45:23 Setting DCOS_SPACE to /{{ model.packageName }}
       Run job succeeded. Submission id: driver-20170824224524-0003
       ```

   2. Use the following command to view the standard output from your job.

       ```bash
       dcos {{ model.packageName }} log --lines_count=10 driver-20170824224524-0003
       ```

       Expected output:

       ```bash
       In Filter(nzchar, unlist(strsplit(input, ",|\\s"))) :
         bytecode version mismatch; using eval
       root
        |-- name: string (nullable = true)
        |-- age: double (nullable = true)
       root
        |-- age: long (nullable = true)
        |-- name: string (nullable = true)
           name
       1 Justin
       ```

# Next steps

- To view the status of your job, run the `dcos {{ model.packageName }} webui` command then visit the {{ model.packageName }} cluster dispatcher UI at `http://<dcos-url>/service/{{ model.packageName }}/` .
- To view the logs, see the documentation for Mesosphere DC/OS monitoring.
- To view details about your {{ model.packageName }} job, run the `dcos task log --completed <submissionId>` command.

From the UI
This is a quick description of how to install JupyterLab from the DC/OS UI. For more detailed instructions, with illustrations, see the Install and Customize pages.
From the DC/OS UI, click Catalog and search for the JupyterLab package.
Select the package, then click Review & Run to display the Edit Configuration page.
Configure the package settings using  the DC/OS UI or by clicking JSON Editor and modifying the app definition manually. For example, you might customize the package by enabling HDFS support.
At a minimum, you must specify the external public agent host name as a Networking configuration setting. For more information about customizing the configuration, see the Install and Customize pages.
Click Networking.
Under External Access, select Enabled, and enter name of the public agent host used to access the JupyterLab package.
Click Review & Run.
Review the installation notes, then click Run Service to deploy the JupyterLab package.

Installing JupyterLab from the UI
From the Catalog, select JupyterLab.
Review the Preinstall Notes to make sure you understand all the options available at install time. Click Review & Run when you are finished.


The Edit Configuration page has 7 configuration tabs down the left hand side. The fields will either be blank or will be filled in with the default values. If you prefer to configure your service using a JSON file, click on the Edit JSON button in the upper right to open a "split-screen" view. Any changes made to either side of this view will be reflected in the other.


The first configuration tab you will edit is the Service tab. In these fields, you will configure the service name, define the CPUs allocated to it, and set other fields. 

The second configuration tab is the OIDC tab, where  you will configure client IDs, secrets, and other identification values.
The third configuration tab is the S3 tab, where you can define the AWS region, endpoint, and any other values required.


The fourth configuration tab is for Spark.

The fifth configuration tab is for Storage.

The sixth configuration tab is for Networking.

The seventh configuration tab is for Environment. 




