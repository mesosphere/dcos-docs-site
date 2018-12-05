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

# How to use {{ model.techName }} with DC/OS 

## Prerequisites

* A running DC/OS 1.11 cluster (If you do not have one installed, see the instructions in [Getting Started](/services/minio/0.1.0/getting-started/#install-a-basic-cluster).)

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

## Via the web interface
<!-- Please edit this section to include actual text instructions. -->
Shown below are the steps to install {{ model.techName }} using the DC/OS Catalog Web Interface:

1. Navigate to the **Catalog** screen and choose **{{ model.packageName }}** from the list.

1. In service view...
    [<img src="../img/Catalog_Service_View.png" />](../img/Catalog_Service_View.png)
    Figure 1. - 

1. Edit configuration
    [<img src="../img/Node_Count1.png" alt="Node Count"/>](../img/Node_Count1.png)
    Figure 2. - 
1. Verify up and running
    [<img src="../img/Running_Stage1.png" alt="Running Stage"/>](../img/Running_Stage1.png)
    Figure 3. - 

1.  Check output log (why?)
    [<img src="../img/Successful_Execution1.png" alt="Successful Execution"/>](../img/Successful_Execution1.png)
    Figure 4. - 


## Accessing the {{ model.techName }} web interface with Edge-LB configuration
<!-- Why is this here? If it is REQUIRED for getting a basic installation up and running, it should be so noted in the Prerequisites section. If it is NOT required for a minimal installation, then it should be moved or made into its own page under Configuration or Security. -->
### Steps

For Edge-LB pool configuration:
1. Add repo of `Edge-LB-aws`.

1. Add repo of `Edge-LB-Pool-aws`.

1. Install Edge-LB:

    ```shell
    dcos package install edgelb --yes
    ``` 

1. Create the configuration JSON file with required parameters to access {{ model.techName }}. 

      Example without TLS:

      ```json
      {
      "apiVersion": "V2",
      "name": "minio",
      "count": 1,
      "haproxy": {
        "frontends": [
          {
            "bindPort": 9001,
            "protocol": "HTTP",
            "linkBackend": {
              "defaultBackend": "miniodemo"
            }
          }
        ],
        "backends": [
        {
          "name": "miniodemo",
          "protocol": "HTTP",
          "services": [{
            "endpoint": {
              "type": "ADDRESS",
              "address": "{{ model.packageName }}.miniodemo.l4lb.thisdcos.directory",
              "port": 9000
            }
          }]
        }
      ]
      }
    }
      ```
 
1. Create `edge-pool` using the JSON configuration file created in the preceding step:
    ```shell
    dcos edgelb create edgelb-pool-config.json
    ```    
1. Access {{ model.techName }}:
    ```shell
    http://<Public IP of the Public Node of the cluster>>:9001/minio
    ```      

    Now you can connect with the {{ model.techName }} server using the {{ model.techName }} client on the public IP of the public agent running EdgeLB, and the port number at which {{ model.techName }} server is bound at EdgeLB.

    [<img src="../img/edgelb_without_tls.png" alt="Without TLS"/>](../img/egdelb_without_tls.png)
    Figure 5. - 
