---
layout: layout.pug
navigationTitle: Quick Start
excerpt: Configuring MongoDB - Quick Start
title: Quick Start
menuWeight: 15
---

# How to use MongoDB with DC/OS

## Prerequisites

* A running DC/OS 1.11 cluster

* MongoDB requires atleast three nodes to start in distributed mode. DC/OS cluster must contain atleast three Private slaves. 

* If DC/OS Secrets are enabled to specify credentials of MongoDB then following Secrets must be created:  service.name/access_key and service.name/secret_key. Where service.name is the name with which MongoDB service is installed on DC/OS.

## Install

MongoDB can be installed via either the DC/OS Catalog web interface or by using the CLI. The following command will launch the install via the DC/OS CLI:

```bash
dcos package install mongodbservice --yes
```
Below are the steps to install MongoDB using the DC/OS Catalog Web Interface:

[<img src="../img/Catalog_Service_View.png" alt="Catalog Service View"/>](../img/Catalog_Service_View.png)

[<img src="../img/Config_page.png" alt="Config Page"/>](../img/Config_page.png)

[<img src="../img/Running_Stage.png" alt="Running Stage"/>](../img/Running_Stage.png)

[<img src="../img/Successful_execution.png" alt="Successful Execution"/>](../img/Successful_execution.png)




## Accessing the MongoDB UI with MongoDB OpsManager

### Steps

For Installing MongoDB OpsManager on a host machine:

  <strong> Tip: </strong> For host machine configuration details, please go through this  [link](https://docs.opsmanager.mongodb.com/current/tutorial/install-simple-test-deployment/).

  1. Configure yum to install MongoDB
  
  ```
  echo "[mongodb-org-4.0]
  name=MongoDB Repository
  baseurl=https://repo.mongodb.org/yum/redhat/7.0/mongodb-org/4.0/x86_64/
  gpgcheck=1
  enabled=1
  gpgkey=https://www.mongodb.org/static/pgp/server-4.0.asc" | sudo tee /etc/yum.repos.d/mongodb.repo 
  ```
  
  2. Install MongoDB.
  
  ```
  sudo yum install -y mongodb-org mongodb-org-shell
  ```

  3. Create the Ops Manager Application Database directory:
  ```
  sudo mkdir -p /data/appdb
  sudo chown -R mongod:mongod /data
  ``` 
  4. Start the Ops Manager Application Database mongod instance:

  ```
  sudo -u mongod mongod --port 27017 --dbpath /data/appdb \
  --logpath /data/appdb/mongodb.log \
  --wiredTigerCacheSizeGB 1 --fork
  ```
 
 5. Download the Ops Manager package:
 
 To get the latest package version of MongoDB OpsManager, please download the package (tar.gz) from [MongoDB Download Center](http://www.mongodb.com/download-center/ops-manager?jmp=docs)
    
 The downloaded package is named mongodb-mms-<version>.x86_64.tar.gz , where <version> is the version number.
   
 6. Install Ops Manager:
 
  ```
  tar -zxf mongodb-mms-<version>.x86_64.tar.gz
  ```
 7. Start Ops Manager:
 
 ```
 <install_directory>/bin/mongodb-mms start
 ```
 8. Open the Ops Manager home page and register the first user.
 
 Enter the following URL in a browser, where <OpsManagerHost> is the fully qualified domain name of the server:
  
 ```
  http://<OpsManagerHost>:8080
 ```

[<img src="../img/edgelb_without_tls.png" alt="Without TLS"/>](../img/egdelb_without_tls.png)
   
