---
layout: layout.pug
navigationTitle: Disk Caching
title: Disk Caching in DC/OS Minio
menuWeight: 45
excerpt: Using caching disks to store content 
featureMaturity:
enterprise: false
model: /services/minio/data.yml
render: mustache
---

Disk caching refers to the use of caching disks to store content closer to  tenants. 
## Via CLI

The Disk Caching feature can be enabled by updating the cache settings in the `config.json` file of {{ model.techName }}.

You must specify 
* the number of volumes to be mounted
* cache expiry duration in days
* any wildcard patterns to exclude from being cached

For Example:

  ```json
      "{{ model.serviceName }}_cache_enable": {
        "title": "{{ model.techName }} cache enable",
        "description": "Enable Disk Caching in {{ model.techName }}, to store content closer to the tenants",
        "type": "boolean",
        "default": true
      },
      "{{ model.serviceName }}_cache_expiry": {
        "title": "{{ model.techName }} cache expiry",
        "description": "Days to cache expiry",
        "type": "integer",
        "default": 90
      },
      "{{ model.serviceName }}_cache_exclude": {
        "title": "{{ model.techName }} cache exclude",
        "description": "List of wildcard patterns for prefixes to exclude from cache",
        "type": "string",
        "default": "*.pdf"
      },
      "{{ model.serviceName }}_cache_maxuse": {
        "title": "{{ model.techName }} cache maxuse",
        "description": "Restricting maximum usage of cache",
        "type": "integer",
        "default": 80
      },
      "cache_disk": {
        "title": "Disk size (MB)",
        "description": "Size of Cache disk (in MB)",
        "type": "integer",
        "default": 252
      },
      "cache_disk_type": {
        "title": "Disk type [ROOT, MOUNT]",
        "description": "Mount volumes require preconfiguration in DC/OS",
        "enum": [
          "ROOT",
          "MOUNT"
        ],
        "default": "ROOT"
      }
    }
  ```


## Via DC/OS web interface 

You can enable disk caching in {{ model.techName }} by checking the **{{ model.serviceName }} cache enable** checkbox while installing the {{ model.techName }} service from the DC/OS web interface. You will also need to specify the **{{ model.serviceName }} cache expiry** duration as noted above.

  
  [<img src="../../img/Disk_Caching.png" alt="Disk_Caching" width="800"/>](../../img/Disk_Caching.png)

  Figure 1. - **Edit Configuration** screen in DC/OS web interface

