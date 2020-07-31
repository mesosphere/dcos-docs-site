---
layout: layout.pug
navigationTitle: Edge-LB
excerpt: Accessing the DC/OS Data Science Engine with Edge-LB configuration

title: Edge-LB
menuWeight: 12
model: /mesosphere/dcos/services/data-science-engine/data.yml
render: mustache
enterprise: true
---

1. Follow the documentation available [here](https://docs.d2iq.com/mesosphere/dcos/services/edge-lb/latest/getting-started/installing/) to deploy Edge-LB to your cluster.

1. Create {{ model.techName }} config `dse.json` specifying hostname:

    ```json
    {
      "service": {
        "name" : "dse"
      },
      "networking": {
        "ingress": {
          "enabled": true,
          "hostname": "external.host.com"
        }
      }
    }

1. Deploy {{ model.techName }}:

    ```bash
    dcos package install {{ model.packageName }} --options=dse.json 
    ```
   
1. Create Edge-LB pool configuration file `dse-pool.json`.

1. For HTTPS, ssl certificates should be specified:

    ```json
      "secrets": [
        {
          "secret": "dse-sslcert",
          "file": "dse-sslcert"
        }
      ],
    ```
   
1. For port discovery point backend to {{ model.techName }} notebook task:

    ```json
     ...
     "mesos" : {
        "frameworkName": "dse",
        "taskName": "data-science-engine-0-notebook"
     },
     ...
    ```
   
1. SparkUI should have additional backend rules to handle `Jobs` and `Executors` pages:
    - `sparkuiJobs`:
        ```json
       
            "name": "sparkuiJobs",
            "protocol": "HTTP",
            "rewriteHttp": {
              "path": {
                "fromPath": "/sparkui/jobs",
                "toPath": "/jobs/"
              },
              "request" : {
                "rewritePath": false
              }
            
        ``` 
    - `sparkuiApplications`:
        ```json
            "name": "sparkuiApplications",
            "protocol": "HTTP",
            "rewriteHttp": {
              "path": {
                "fromPath": "/api/v1/",
                "toPath": "/sparkui/api/v1/"
              },
              "request" : {
                "rewritePath": false
              }
        ```
    - `sparkuiExecutorspage`:
        ```json
            "name": "sparkuiExecutorspage",
            "protocol": "HTTP",
            "rewriteHttp": {
              "path": {
                "fromPath": "/static/executorspage-template.html",
                "toPath": "/sparkui/static/executorspage-template.html"
              },
              "request" : {
                "rewritePath": false
              }
        ```

1. Example Edge-LB pool configuration `dse-pool.json` for {{ model.techName }} named `dse` and external hostname `external.host.com`:

    ```json
    {
      "apiVersion": "V2",
      "name": "dse-pool",
      "count": 1,
      "secrets": [
        {
          "secret": "dse-sslcert",
          "file": "dse-sslcert"
        }
      ],
      "haproxy": {
        "frontends": [
          {
            "bindPort": 80,
            "protocol": "HTTP",
            "redirectToHttps": {
              "items": {
                "host": "external.host.com"
              }
            }
          },
          {
            "bindPort": 443,
            "protocol": "HTTPS",
            "certificates": [
              "$SECRETS/dse-sslcert"
            ],
            "linkBackend": {
              "defaultBackend" : "notebook",
              "map": [
                {
                  "hostEq": "external.host.com",
                  "backend": "tensorboard",
                  "pathBeg": "/tensorboard"
                },
                {
                  "hostEq": "external.host.com",
                  "backend": "sparkhistory",
                  "pathBeg": "/sparkhistory"
                },
                {
                  "hostEq": "external.host.com",
                  "backend": "sparkui",
                  "pathBeg": "/sparkui"
                },
                {
                  "hostEq": "external.host.com",
                  "backend": "sparkuiJobs",
                  "pathBeg": "/jobs"
                },
                {
                  "hostEq": "external.host.com",
                  "backend": "sparkuiApplications",
                  "pathBeg": "/api/v1/"
                },
                {
                  "hostEq": "external.host.com",
                  "backend": "sparkuiExecutorspage",
                  "pathBeg": "/static/executorspage-template.html"
                }
              ]
            }
          }
        ],
        "backends": [
          {
            "name": "notebook",
            "protocol": "HTTP",
            "services": [
              {
                "mesos" : {
                  "frameworkName": "dse",
                  "taskName": "data-science-engine-0-notebook"
                },
                "endpoint": {
                  "type": "AUTO_IP",
                  "portName": "notebook"
                }
              }
            ]
          },
           {
             "name": "tensorboard",
             "protocol": "HTTP",
             "services": [
               {
                 "mesos" : {
                   "frameworkName": "dse",
                   "taskName": "data-science-engine-0-notebook"
                 },
                 "endpoint": {
                   "type": "AUTO_IP",
                   "portName": "tensorboard"
                 }
               }
             ]
           },
          {
            "name": "sparkhistory",
            "protocol": "HTTP",
            "rewriteHttp": {
              "path": {
                "fromPath": "/sparkhistory/",
                "toPath": "/"
              }
            },
            "services": [
              {
                "mesos" : {
                  "frameworkName": "dse",
                  "taskName": "data-science-engine-0-notebook"
                },
                "endpoint": {
                  "type": "AUTO_IP",
                  "portName": "sparkhistory"
                }
              }
            ]
          },
          {
            "name": "sparkui",
            "protocol": "HTTP",
            "rewriteHttp": {
              "path": {
                "fromPath": "/sparkui",
                "toPath": "/"
              },
              "response" : {
                "rewriteLocation": false
              }
            },
            "services": [
              {
                "mesos" : {
                  "frameworkName": "dse",
                  "taskName": "data-science-engine-0-notebook"
                },
                "endpoint": {
                  "type": "AUTO_IP",
                  "portName": "sparkui"
                }
              }
            ]
          },
          {
            "name": "sparkuiJobs",
            "protocol": "HTTP",
            "rewriteHttp": {
              "path": {
                "fromPath": "/sparkui/jobs",
                "toPath": "/jobs/"
              },
              "request" : {
                "rewritePath": false
              }
            },
            "services": [
              {
                "mesos" : {
                  "frameworkName": "dse",
                  "taskName": "data-science-engine-0-notebook"
                },
                "endpoint": {
                  "type": "AUTO_IP",
                  "portName": "sparkui"
                }
              }
            ]
          },
          {
            "name": "sparkuiApplications",
            "protocol": "HTTP",
            "rewriteHttp": {
              "path": {
                "fromPath": "/api/v1/",
                "toPath": "/sparkui/api/v1/"
              },
              "request" : {
                "rewritePath": false
              }
            },
            "services": [
              {
                "mesos" : {
                  "frameworkName": "dse",
                  "taskName": "data-science-engine-0-notebook"
                },
                "endpoint": {
                  "type": "AUTO_IP",
                  "portName": "sparkui"
                }
              }
            ]
          },
          {
            "name": "sparkuiExecutorspage",
            "protocol": "HTTP",
            "rewriteHttp": {
              "path": {
                "fromPath": "/static/executorspage-template.html",
                "toPath": "/sparkui/static/executorspage-template.html"
              },
              "request" : {
                "rewritePath": false
              }
            },
            "services": [
              {
                "mesos" : {
                  "frameworkName": "dse",
                  "taskName": "data-science-engine-0-notebook"
                },
                "endpoint": {
                  "type": "AUTO_IP",
                  "portName": "sparkui"
                }
              }
            ]
          }
        ]
      }
    }
    ```

1. Add permissions for Edge-LB pool `dse-pool`:

   ```bash
   dcos security org users grant edge-lb-principal
   dcos:adminrouter:service:dcos-edgelb/pools/dse-pool full
   ```
   
1. Deploy Edge-LB Pool:

   ```bash
   dcos edgelb create dse-pool.json
   ```
   
1. Confirm that our Edge-LB pool can see the backend and the backend is healthy by checking

   ```
   <agent-ip>:9090/haproxy?stats
   ```
   ![Screenshot of HAProxy stats.](/mesosphere/dcos/services/data-science-engine/img/dcos-data-science-engine-edge-lb-haproxy-stats.png)

1. For `dse-pool.json` example access URLs will be:
    - Jupyter Notebook UI - `https://external.host.com/service/dse/` 
    - TensorBoard - `https://external.host.com/tensorboard`
    - SparkHistory  - `https://external.host.com/sparkhistory`
    - SparkUI - `https://external.host.com/sparkui/`
  