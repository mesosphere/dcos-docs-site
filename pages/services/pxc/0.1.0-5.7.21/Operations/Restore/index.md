---
layout: layout.pug
navigationTitle: Restore
excerpt: Restoring your Percona XtraDB Cluster service
title: Restore  
menuWeight: 30
model: /services/pxc/data.yml
render: mustache
---

# Restore

The restore plan is a manual process and is used to restore any backed up data from any S3 compatible data store.

The restore process is as follows:

1. Pause all {{ model.techShortName }} pods.

    ```shell
    {
    dcos {{ model.serviceName}} --name={{ model.serviceName}} debug pod pause <pod-name> -t <task-name>
    }
    ```

1. Run the following DC/OS CLI command to start the restore plan.

    ```shell
    {
    dcos {{ model.serviceName}} plan start restore -p ACCESS_KEY_ID=<ACCESS_KEY> -p SECRET_ACCESS_KEY=<SECRET_ACCESS_KEY>
    }
    ```

1. Start the {{ model.techShortName }} pods one by one in sequential manner, using the following command:

    ```shell
    {
    dcos {{ model.serviceName}} --name={{ model.serviceName}} debug pod resume <pod-name> -t <task-name>
    }
    ```

This will restore the backed up {{ model.techShortName }} data to your existing cluster.

