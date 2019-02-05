---
layout: layout.pug
navigationTitle:  Installing Services
title: Installing Services
menuWeight: 0
excerpt: Installing and verifying a service using the CLI or the web interface

enterprise: false
---

## Installing a service using the CLI

The general syntax for installing a service with the CLI follows.

```bash
dcos package install [--options=<config-file-name>.json] <servicename>
```

Use the optional `--options` flag to specify the name of the customized JSON file you created in [advanced configuration](/1.13/deploying-services/config-universe-service/).

For example, you would use the following command to install Chronos with the default parameters.

```bash
dcos package install chronos
```

## Installing a service using the web interface

From the DC/OS web interface you can install services from the **Services** or **Catalog** tab. The Catalog tab shows all of the available DC/OS services from package [repositories](/1.13/administering-clusters/repo/). The Services tab provides a full featured interface to the native DC/OS Marathon instance.


### Catalog tab

1.  Navigate to the [**Catalog**](/1.13/gui/catalog/) tab in the DC/OS web interface.

    ![universe](/1.13/img/GUI-Catalog-Main_View-1_12.png)

    Figure 1. Universe catalog

2.  Click a package.
    1. Click **REVIEW & RUN**.
    2. Optionally click [**EDIT**](/1.13/deploying-services/config-universe-service/), customize parameters, and click **REVIEW & RUN**.
    3. Click **RUN SERVICE**.

### Services tab

1.  Navigate to the [**Services**](/1.13/gui/services/) tab in the DC/OS web interface.
1.  Click **RUN A SERVICE** and specify your Marathon app definition.

    ![service tab](/1.13/img/GUI-Services-No_Services_Running-1_12.png)

    Figure 2. Services screen

## Verifying your installation

### CLI

```bash
dcos package list
```

### Web interface

Go to the **Services** tab and confirm that the service is running. For more information, see the web interface [documentation](/1.13/gui/services/).

![Services](/1.13/img/GUI-Services-Running_Services_View-1_12.png)

Figure 3. Service is running

Some services from the **Community** section of the Catalog will not show up in the DC/OS service listing. For these, inspect the service's Marathon app in the Marathon web interface to verify that the service is running and healthy.
