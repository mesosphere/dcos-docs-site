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

* OpsManager Base URI (Host URL or Path where the OpsManager is hosted)

* Project ID (obtained after creating a project on OpsManager UI)

* Generate or use an existing Public API Key.

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
dcos package install mongodbservice --yes --options=options.json
```
Where options.json should contain required key pairs, which are `base_url`,`project_id`, `ops_user_name` and `public_api_key`.

Sample for options.json:

```
{
  "service": {
    "base_url": "http://54.110.97.37:8080",
    "project_id": "5bf3d8fdcg3a9f3ff8588343",
    "ops_user_name": "user",
    "public_api_key": "4d215f3c-e241-4ea7-86fa-g06235a0e19d"
  },
  "node": {
    "count": 1
  }
}

```



