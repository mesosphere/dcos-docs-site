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

Use the optional `--options` flag to specify the name of the customized JSON file you created in [advanced configuration](/1.9/deploying-services/config-universe-service/).

For example, you would use the following command to install Chronos with the default parameters.
    
```bash
dcos package install chronos
```
    
## Installing a service using the GUI

From the DC/OS GUI you can install services from the **Services** or **Universe** tab. The Universe tab shows all of the available DC/OS services from package [repositories](/1.9/administering-clusters/repo/). The Services tab provides a full featured interface to the native DC/OS Marathon instance.


### Universe tab

1.  Navigate to the [**Universe > Packages**](/1.9/gui/universe/) page in the DC/OS GUI.

    ![universe](/1.9/img/ui-dashboard-universe.gif)

2.  Choose your package and click **INSTALL PACKAGE**. 

3.  Confirm your installation or choose [**ADVANCED INSTALLATION**](/1.9/deploying-services/config-universe-service/).

### Services tab

1.  Navigate to the [**Services**](/1.9/gui/services/) tab in the DC/OS GUI.
1.  Click **RUN A SERVICE** and specify your Marathon app definition.

    ![service tab](/1.9/img/run-a-service.png)

## Verifying your installation

### CLI

```bash
dcos package list
```

### Web GUI

Go to the **Services** tab and confirm that the service is running. For more information, see the GUI [documentation](/1.9/gui/services/).

![Services](/1.9/img/tweeter-services6.png)

**Tip:** Some services from the "Community Packages" section of the Universe will not show up in the DC/OS service listing. For these, inspect the service's Marathon app in the Marathon GUI to verify that the service is running and healthy.
