---
layout: layout.pug
navigationTitle: Quick Start
excerpt: Configuring Minio - Quick Start
title: Quick Start
menuWeight: 11
model: /services/minio/data.yml
render: mustache
---
<!-- This page is incomplete. Please add text to web interface installation procedure. -->
<!-- Done. -->
# How to use {{ model.techName }} with DC/OS 

This section will get you up and running with a basic Minio configuration in a short time.

## Prerequisites

* A running DC/OS 1.11 cluster. (If you do not have one installed, see the instructions in [Getting Started](/services/minio/0.1.0/getting-started/#install-a-basic-cluster).)

* {{ model.techName }} requires {{ model.install.minNodeCount}} to start in distributed mode. ({{ model.techName }} requires that you start {{ model.install.nodeDescription }} in distributed mode.)

* Your DC/OS cluster must contain {{ model.install.minPrivateAgents }}. 

* If DC/OS Secrets are enabled to specify credentials of {{ model.techName }},  then the following Secrets must be created:

  * `service.name/access_key`
  * `service.name/secret_key`

  where `service.name` is the name with which {{ model.techName }} service is installed on DC/OS.

# Install

{{ model.techName }} can be installed via either the DC/OS Catalog web interface or by using the CLI. 

## Via CLI

The following command will launch installation via the DC/OS CLI:

```bash
dcos package install {{ model.packageName }} 
```
  
  [<img src="../img/Package_installed.png" />](../img/Package_installed.png)

<!-- Can you provide a sample output so the user knows when installation has completed? -->
<!-- Done. -->

## Via the web interface
<!-- Please edit this section to include actual text instructions. -->
<!-- Done. -->
Shown below are the steps to install {{ model.techName }} using the DC/OS Catalog Web Interface:

1. Navigate to the **Catalog** screen and choose **{{ model.packageName }}** from the list.

1. **{{ model.packageName }}** package appear on the screen as shown below 
    [<img src="../img/Catalog_Service_View.png" />](../img/Catalog_Service_View.png)
    Figure 1. - **{{ model.packageName }}** package  

1. Click on the package and edit the Configuration accordingly and then click the Review & Run button to run the service.
    [<img src="../img/Node_Count1.png" alt="Node Count"/>](../img/Node_Count1.png)
    Figure 2. - Edit Configuration

1. Once the service is started, verify all the nodes are up and running.
    [<img src="../img/Running_Stage1.png" alt="Running Stage"/>](../img/Running_Stage1.png)
    Figure 3. - Verify Service is up and running

1.  check the output log to verify that all the node of the Minio server are up and running successfully.
    [<img src="../img/Successful_Execution1.png" alt="Successful Execution"/>](../img/Successful_Execution1.png)
    Figure 4. - Service is Installed Successfully.


<!-- Why is this here? If it is REQUIRED for getting a basic installation up and running, it should be so noted in the Prerequisites section. If it is NOT required for a minimal installation, then it should be moved or made into its own page under Configuration or Security. -->
<!-- This section is moved under Configuration. -->

