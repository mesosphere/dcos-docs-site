---
layout: layout.pug
navigationTitle: Quick Start
excerpt: Configuring Percona XtraDB Cluster - Quick Start
title: Quick Start
menuWeight: 15
---

# How to use Percona XtraDB Cluster with DC/OS

## Prerequisite

- DC/OS should be installed on your cluster.
- kafka-zookeeper is installed in the cluster from category.

## Steps

If you are using open source DC/OS, install percona-pxc-mysql on the cluster with the following command from the DC/OS CLI. If you are using Enterprise DC/OS, you may need to follow additional instructions. See the Install and Customize section for information.

```shell
dcos package install --yes percona-pxc-mysql
```
Alternatively, you can install percona-pxc-mysql from [the DC/OS web interface].

Once the install command is triggered, the service will deploy with a default configuration. You can monitor its deployment via the Services tab of the DC/OS web interface. Mentioned below is the complete list of DC/OS percona-pxc-mysql Commands Available:
   
1. View the configuration for this service

    ```shell
    dcos percona-pxc-mysql describe
    ```
2. View client endpoints   

    ```shell  
    dcos percona-pxc-mysql endpoints [<name>]
    ```
3. Show all plans for this service    

    ```shell  
    dcos percona-pxc-mysql plan list
    ```    
4. Display the status of the plan with the provided plan name

    ```shell 
    dcos percona-pxc-mysql plan status [<flags>] <plan>   
    --json  Show raw JSON response instead of user-friendly tree
    ```    
5. Start the plan with the provided name and any optional plan arguments

    ```shell 
    dcos percona-pxc-mysql plan start <flags> <plan>
    -p, --params=PARAMS ...  Envvar definition in VAR=value form; can be repeated for multiple variables
    ```      
6. Stop the running plan with the provided name

    ```shell 
    dcos percona-pxc-mysql plan stop <plan>
    ```          
7. Pause the plan, or a specific phase in that plan with the provided phase name (or UUID)

    ```shell 
    dcos percona-pxc-mysql plan pause <plan> [<phase>]
    ```               
7. Resume the plan, or a specific phase in that plan with the provided phase name (or UUID)

    ```shell 
    dcos percona-pxc-mysql plan resume <plan> [<phase>]
    ```    
8. Restart the plan with the provided name, or a specific phase in the plan with the provided name, or a specific step in a              phase of the plan with the provided step name.   
    
    ```shell 
    dcos percona-pxc-mysql plan force-restart <plan> <phase> <step>
    ```       
9. Force complete a specific step in the provided phase. Example uses include the following: Abort a sidecar operation due to observed failure or known required manual preparation that was not performed

    ```shell 
    dcos percona-pxc-mysql plan force-complete <plan> [<phase> [<step>]]
    ```   
    
10. Display the list of known pod instances                 

    ```shell 
    dcos percona-pxc-mysql pod list
    ```   
    
11. Restarts a given pod without moving it to a new agent

    ```shell 
    dcos percona-pxc-mysql pod restart <pod>
    ```      
12. Destroys a given pod and moves it to a new agent  
 
    ```shell 
    dcos percona-pxc-mysql pod replace <pod>
    ```      
13. Launches an update operation
 
    ```shell 
    dcos percona-pxc-mysql update start [<flags>]
    --options=OPTIONS  Path to a JSON file that contains customized package installation options
    --package-version=PACKAGE-VERSION  
                       The desired package version
    --replace          Replace the existing configuration in whole. Otherwise, the existing configuration and options are merged.
    ```     

14. Force complete a specific step in the provided phase
  
    ```shell 
    dcos percona-pxc-mysql update force-complete <phase> <step>
    ```         

15. Restart update plan, or specific step in the provided phase

    ```shell 
    dcos percona-pxc-mysql update force-restart [<phase> [<step>]]
    ``` 

16. View a list of available package versions to downgrade or upgrade to
    
    ```shell 
    dcos percona-pxc-mysql update package-versions
    ```     
    
17. Pause update plan

    ```shell 
    dcos percona-pxc-mysql update pause
    ```  
18. Resume update plan

    ```shell 
    dcos percona-pxc-mysql update resume
    ```  
    
19. View status of a running update   
  
    ```shell 
    dcos percona-pxc-mysql update status [<flags>]
    --json  Show raw JSON response instead of user-friendly tree
    ```               

# External Client Access(Proxysql and EdgeLB configuration)

Proxysql is auto configured by the service with some defaults as in the configuration. To install EdgeLB using the following steps:

```shell
dcos package repo add --index=0 edgelb-aws \
https://edge-lb-infinity-artifacts.s3.amazonaws.com/autodelete7d/master/edgelb/stub-universe-edgelb.json

dcos package repo add --index=0 edgelb-pool-aws \
https://edge-lb-infinity-artifacts.s3.amazonaws.com/autodelete7d/master/edgelb-pool/stub-universe-edgelb-pool.json

dcos package install edgelb --yes

dcos package install edgelb --cli

dcos edgelb create pxc-edgelb.json
```
In the below pxc-edgelb.json file, need to update the proxysql-client-endpoint accordingly:

```shell
{
        "apiVersion": "V2",
        "name": "pxc",
        "count": 1,
        "haproxy": {
                "frontends": [{
                                "bindPort": 3306,
                                "protocol": "TCP",
                                "linkBackend": {
                                        "defaultBackend": "pxc"
                                }
                        }

                ],
                "backends": [{
                        "name": "pxc",
                        "protocol": "TCP",
                        "services": [{
                                "endpoint": {
                                        "type": "ADDRESS",
                                        "address": "<proxysql-client-endpoint>",
                                        "port": 3306
                                }
                        }]
                }]
        }
}
```
Need to run the following command from any host machine running docker:
```shell
docker run --name mysql-cli -e MYSQL_ROOT_PASSWORD=root -d mysql:5.7
```
After this we need to get into the container by running a bash into this as follows:
```shell
sudo docker exec -ti mysql-cli bash
```
Then we need to note down the Public slave security group IP for the DC/OS cluster on which DC/OS is running. We then will need to use the IP in the following command:
```shell
mysql -u<application_user_name> -p<application_user_passwd> -h<public_slave_securitygrpIP> -P3306
```
This will connect to the PXC cluster. Now start using the cluster by creating a db and tables into it.


# How to see Metrices with Prometheus and Garafana with DC/OS

## Prerequisites

* A running DC/OS 1.11 cluster

## Install

Prometheus can be installed via either the DC/OS Catalog web interface or by using the CLI. The following command will launch the install via the DC/OS CLI:

```bash
dcos package install prometheus
```

Install Grafana from the service catalog as well. It can be used as a graphing tool.
```bash
dcos package install --yes grafana
```

[<img src="/services/pxc/0.1.0-5.7.21/img/prom_install.png" alt="Prometheus Install"/>](/services/pxc/0.1.0-5.7.21/img/prom_install.png)


The framework provides options to enter the Prometheus, AlertManager and Rules config. The default Prometheus configuration scrapes a DC/OS master and agents in the clusters. Append any new config to the end.

## Accessing the Prometheus UI

Once the framework is up and running:
1. Install Edge-LB.
2. Create a file named `prometheus-edgelb.json` containing the following `edge-lb` configuration:

```
{
  "apiVersion": "V2",
  "name": "prometheus",
  "count": 1,
  "haproxy": {
    "frontends": [
      {
        "bindPort": 9092,
        "protocol": "HTTP",
        "linkBackend": {
          "defaultBackend": "prometheus"
        }
      },
      {
        "bindPort": 9093,
        "protocol": "HTTP",
        "linkBackend": {
          "defaultBackend": "alertmanager"
        }
      },
      {
        "bindPort": 9094,
        "protocol": "HTTP",
        "linkBackend": {
          "defaultBackend": "grafana"
        }
      },
      {
        "bindPort": 9091,
        "protocol": "HTTP",
        "linkBackend": {
          "defaultBackend": "pushgateway"
        }
      }
    ],
    "backends": [
     {
      "name": "prometheus",
      "protocol": "HTTP",
      "services": [{
        "endpoint": {
          "type": "ADDRESS",
          "address": "prometheus.prometheus.l4lb.thisdcos.directory",
          "port": 9090
        }
      }]
    },
    {
     "name": "alertmanager",
     "protocol": "HTTP",
     "services": [{
       "endpoint": {
         "type": "ADDRESS",
         "address": "alertmanager.prometheus.l4lb.thisdcos.directory",
         "port": 9093
       }
     }]
   },
   {
    "name": "grafana",
    "protocol": "HTTP",
    "services": [{
      "endpoint": {
        "type": "ADDRESS",
        "address": "grafana.grafana.l4lb.thisdcos.directory",
        "port": 3000
      }
    }]
   },
   {
    "name": "pushgateway",
    "protocol": "HTTP",
    "services": [{
      "endpoint": {
        "type": "ADDRESS",
        "address": "pushgateway.prometheus.l4lb.thisdcos.directory",
        "port": 9091
      }
    }]
   }
   ]
  }
}
```


3. In your browser enter the following address.

Promtheus UI:
```
http://<public-agent-ip>:9092
```

[<img src="/services/pxc/0.1.0-5.7.21/img/prom_dashboard.png" alt="Prometheus Dashboard"/>](/services/pxc/0.1.0-5.7.21/img/prom_dashboard.png)


This is the console view within the `Graph` tab.

You can also verify that Prometheus is serving metrics about itself by navigating to its metrics endpoint:

```
http://<public-agent-ip>:9092/metrics
```

### Using the Expression browser

Go back to the console view, and enter this into the expression console:

`prometheus_target_interval_length_seconds`

This should return a number of different time series (along with the latest value recorded for each), all with the metric name prometheus_target_interval_length_seconds.

As another example, enter the following expression to graph the per-second rate of chunks being created in the self-scraped Prometheus:

`rate(prometheus_tsdb_head_chunks_created_total[1m])`

[<img src="/services/pxc/0.1.0-5.7.21/img/prom_graphing.png" alt="Prometheus Graphing"/>](/services/pxc/0.1.0-5.7.21/img/prom_graphing.png)

## Using Grafana with Prometheus

```
http://<public-agent-ip>:9094
```

Credentials: admin / admin

[<img src="/services/pxc/0.1.0-5.7.21/img/grafana_login.png" alt="Grafana Logging"/>](/services/pxc/0.1.0-5.7.21/img/grafana_login.png)

which takes you to the Grafana console.


You can add Prometheus as a data source:

[<img src="/services/pxc/0.1.0-5.7.21/img/grafana_datasource.png" alt="Grafana Data Source"/>](/services/pxc/0.1.0-5.7.21/img/grafana_datasource.png)


Save and Test. Now you are ready to use Prometheus as a data source in Grafana.

To create a graph, select your `Prometheus` datasource, and enter any Prometheus expression into the "Query" field, while using the "Metric" field to lookup metrics via autocompletion.

The following shows an example Prometheus graph configuration:

[<img src="/services/pxc/0.1.0-5.7.21/img/grafana_prom.png" alt="Grafana Prom Graph"/>](/services/pxc/0.1.0-5.7.21/img/grafana_prom.png)
