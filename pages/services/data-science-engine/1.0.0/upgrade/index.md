---
layout: layout.pug
navigationTitle: Upgrade
excerpt: Upgrading your instance of DC/OS Data Science Engine
title: Upgrade
menuWeight: -1
model: /services/data-science-engine/data.yml
render: mustache
---
This section describes how to upgrade your installation of {{ model.techName }}.

# {{ model.techName }} Upgrade
Because the {{ model.packageName }} dispatcher persists its state in ZooKeeper, upgrading the  {{ model.techName }} package requires you to complete the following steps:

1. Remove the {{ model.packageName }} package from ZooKeeper.
1. Uninstall the current {{ model.packageName }} package.
1. Install the {{ model.packageName }} upgrade.

To upgrade {{ model.packageName }}, do the following:

1. Navigate to `http://<dcos-url>/exhibitor`.
1. Click `Explorer`.
1. Delete the znode corresponding to your instance of {{ model.packageName }}. By default, the znode instance is `{{ model.packageName }}_mesos_Dispatcher`.
1. Select the {{ model.packageName }} service from the Catalog in the DC/OS UI and click **Delete**, or run the following command from the DC/OS CLI:

    ```bash
    dcos package uninstall --app-id=<app-id> {{ model.packageName }}
    ```

1. Verify that you no longer see your {{ model.packageName }} service on the **Services** page.
1. Reinstall the new {{ model.packageName }} package by running the following command:

    ```bash
    dcos package install {{ model.packageName }}
    ```




