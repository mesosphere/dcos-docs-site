---
layout: layout.pug
navigationTitle: Quick Start
excerpt: Configuring MongoDB - Quick Start
title: Quick Start
menuWeight: 15
model: /services/mongodb-enterprise/data.yml
render: mustache
---

# How to use MongoDB with DC/OS

## Prerequisites

* A running DC/OS cluster

* OpsManager Base URI (Host URL or Path where the OpsManager is hosted)

* Project ID (Obtained after creating a project on OpsManager UI)

* Generate new or use an existing Public API Key from OpsManager.

* Username of the Registered user over OpsManager Organisation.

* Whitelist the IP of host in the OpsManager.


## Install MongoDB OpsManager

For Installing MongoDB OpsManager on a host machine, please gather the requirements specified and follow the steps provided on the [MongoDB OpsManager Installation](https://docs.opsmanager.mongodb.com/current/installation/) page.


## Install MongoDB Service on DC/OS

MongoDB can be installed via either the DC/OS Catalog web interface or by using the CLI. 

Below are the steps to install MongoDB using the DC/OS Catalog Web Interface:

1. Navigate to the **Catalog** screen and choose **{{ model.packageName }}** from the list.**{{ model.packageName }}** package appear on the screen as shown below :

[<img src="../img/Catalog_Service_View.png" alt="Catalog Service View"/>](../img/Catalog_Service_View.png)

 _Figure 1. -Catalog view of mongodbservice for installation

2. Click on the package and edit the Configuration accordingly and then click the Review & Run button to run the service.

[<img src="../img/Config_page.png" alt="Config Page"/>](../img/Config_page.png)

 _Figure 2. -Edit configuration to install  mongodbservice

3. Once the service is started, verify all the nodes are up and running by there status.

[<img src="../img/Running_Stage.png" alt="Running Stage"/>](../img/Running_Stage.png)

 _Figure 3. -Running instances of  mongodbservice

4. check the output log to verify that all the node of the **{{ model.packageName }}** server are up and running successfully.

[<img src="../img/Successful_execution.png" alt="Successful Execution"/>](../img/Successful_execution.png)

 _Figure 4. -Log view of successful running of  mongodbservice instance

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
  }
}

```
Verify the installion of **{{ model.packageName }}** via the DC/OS CLI by below output :

```
# dcos package install mongodbservice --yes --options=options.json
By Deploying, you agree to the Terms and Conditions https://mesosphere.com/catalog-terms-conditions/#community-services
Default configuration requires 3 agent nodes each with: 1 CPU | 2048 MB MEM | 1 5120 MB data Disk | 1 2048 MB log Disk.
Installing Marathon app for package [mongodbservice] version [snapshot]
Installing CLI subcommand for package [mongodbservice] version [snapshot]
New command available: dcos mongodbservice
DC/OS mongodbservice is being installed!
```


