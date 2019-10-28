---
layout: layout.pug
navigationTitle:  Installing Services
title: Installing Services
menuWeight: 0
excerpt: Installing and verifying a service using the CLI or the UI
render: mustache
model: /mesosphere/dcos/2.0/data.yml
enterprise: false
---

## Installing a service using the CLI

The general syntax for installing a service with the CLI is:

```bash
dcos package install [--options=<config-file-name>.json] <servicename>
```

Use the optional `--options` flag to specify the name of the customized JSON file you created in [advanced configuration](/mesosphere/dcos/2.0/deploying-services/config-universe-service/).

For example, use the following command to install Chronos with the default parameters.

```bash
dcos package install chronos
```

## Installing a service using the UI

From the DC/OS UI you can install services from the **Services** or **{{ model.packageRepo }}** tab. The {{ model.packageRepo }} tab shows all of the available DC/OS services from package [repositories](/mesosphere/dcos/2.0/administering-clusters/package-registry/). The Services tab provides a full featured interface to the native DC/OS Marathon instance.


### {{ model.packageRepo }} tab

1.  Navigate to the [**{{ model.packageRepo }}**](/mesosphere/dcos/2.0/gui/catalog/) tab in the DC/OS UI.

    ![{{ model.packageRepo }}](/mesosphere/dcos/2.0/img/GUI-Catalog-Main_View-1_12.png)

    Figure 1. {{ model.packageRepo }} 

2.  Click a package.
    1. Click **REVIEW & RUN**.
    2. Optionally click [**EDIT**](/mesosphere/dcos/2.0/deploying-services/config-universe-service/), customize parameters, and click **REVIEW & RUN**.
    3. Click **RUN SERVICE**.

### Services tab

1.  Navigate to the [**Services**](/mesosphere/dcos/2.0/gui/services/) tab in the DC/OS UI.
1.  Click **RUN A SERVICE** and specify your Marathon app definition.

    ![service tab](/mesosphere/dcos/2.0/img/GUI-Services-No_Services_Running-1_12.png)

    Figure 2. Services screen

## Verifying your installation

### CLI

```bash
dcos package list
```

### UI

Go to the **Services** tab and confirm that the service is running. For more information, see the UI [documentation](/mesosphere/dcos/2.0/gui/services/).

![Services](/mesosphere/dcos/2.0/img/GUI-Services-Running_Services_View-1_12.png)

Figure 3. Service is running

Some services from the **Community** section of the {{ model.packageRepo }} will not show up in the DC/OS service listing. For these, inspect the service's Marathon app in the Marathon UI to verify that the service is running and healthy.
