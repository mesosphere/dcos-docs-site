---
layout: layout.pug
navigationTitle:  Installing Services
title: Installing Services
menuWeight: 0
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


## Installing a service using the CLI

The general syntax for installing a service with the CLI follows.

```bash
dcos package install [--options=<config-file-name>.json] <servicename>
```

Use the optional `--options` flag to specify the name of the customized JSON file you created in [advanced configuration](/mesosphere/dcos/1.10/deploying-services/config-universe-service/).

For example, you would use the following command to install Chronos with the default parameters.

```bash
dcos package install chronos
```

## Installing a service using the GUI

From the DC/OS GUI you can install services from the **Services** or **Catalog** tab. The Catalog tab shows all of the available DC/OS services from package [repositories](/mesosphere/dcos/1.10/administering-clusters/repo/). The Services tab provides a full featured interface to the native DC/OS Marathon instance.


### Catalog tab

1.  Navigate to the [**Catalog**](/mesosphere/dcos/1.10/gui/catalog/) tab in the DC/OS GUI.

    ![universe](/mesosphere/dcos/1.10/img/ui-dashboard-catalog.png)

2.  Click a package.
    1. Click **REVIEW & RUN**.

       This is some text.

    2. Optionally click [**EDIT**](/mesosphere/dcos/1.10/deploying-services/config-universe-service/), customize parameters, and click **REVIEW & RUN**.
    3. Click **RUN SERVICE**.

### Services tab

1.  Navigate to the [**Services**](/mesosphere/dcos/1.10/gui/services/) tab in the DC/OS GUI.
1.  Click **RUN A SERVICE** and specify your Marathon app definition.

    ![service tab](/mesosphere/dcos/1.10/img/run-a-service.png)

## Verifying your installation

### CLI

```bash
dcos package list
```

### Web GUI

Go to the **Services** tab and confirm that the service is running. For more information, see the GUI [documentation](/mesosphere/dcos/1.10/gui/services/).

![Services](/mesosphere/dcos/1.10/img/tweeter-services6.png)

**Tip:** Some services from the **Community** section of the Catalog will not show up in the DC/OS service listing. For these, inspect the service's Marathon app in the Marathon GUI to verify that the service is running and healthy.
