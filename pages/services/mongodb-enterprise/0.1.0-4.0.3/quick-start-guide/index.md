---
layout: layout.pug
navigationTitle: Quick Start
excerpt: Configuring MongoDB - Quick Start
title: Quick Start
menuWeight: 15
---

# How to use MongoDB with DC/OS

## Prerequisites

* A running DC/OS cluster

* Have OpsManager Base URI (Host URL or Path where the OpsManager is hosted)

* Have Project ID (obtained after creating a project on OpsManager UI)

* Have or generate a Public API Key.

* Username of the Registered user over OpsManager Organisation.

* Add the IP of host to the OpsManager API Whitelist.


## Install MongoDB OpsManager

For Installing MongoDB OpsManager on a host machine, please gather the requirements specified and follow the steps provided on the [MongoDB OpsManager Installation](https://docs.opsmanager.mongodb.com/current/installation/) page.


## Install MongoDB Service on DC/OS

MongoDB can be installed via either the DC/OS Catalog web interface or by using the CLI. 

Below are the steps to install MongoDB using the DC/OS Catalog Web Interface:

[<img src="../img/Catalog_Service_View.png" alt="Catalog Service View"/>](../img/Catalog_Service_View.png)

[<img src="../img/Config_page.png" alt="Config Page"/>](../img/Config_page.png)

[<img src="../img/Running_Stage.png" alt="Running Stage"/>](../img/Running_Stage.png)

[<img src="../img/Successful_execution.png" alt="Successful Execution"/>](../img/Successful_execution.png)

The following command will launch the install via the DC/OS CLI:

```bash
dcos package install mongodbservice --yes
```




