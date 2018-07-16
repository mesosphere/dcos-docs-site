---
layout: layout.pug
navigationTitle:  Installing and Customizing
title: Installing and Customizing
menuWeight: 20
excerpt: Installing and Customizing DC/OS Prometheus via the web interface or CLI
featureMaturity:
enterprise: false
---

DC/OS Prometheus Service is available in the Universe and can be installed by using either the web interface or the DC/OS CLI.

The default DC/OS Prometheus Service installation provides reasonable defaults for trying out the service, but that may not be sufficient for production use. You may require different configurations depending on the context of the deployment.


## Configuration Best Practices for Production
By default, every Prometheus sample consumes 1-2 Bytes of storage. To plan a production configuration of your server, the following formula is recommended:

- Needed_disk_space = retention_time_seconds * ingested_samples_per_second * bytes_per_sample

For installation, the following combination is recommended for the Prometheus server and Alertmanager:
 
- Install Alertmanager with base\first build of framework. We recommend that you install the remaining framework without Alertmanager and the Alertmanager node count should be 0. 
- All the rest of the Prometheus servers should point to the same Alertmanager which was installed with your base\first build. To do this you must pass an Alertmanager endpoint as a target to your Prometheus servers. You can do this using your prometheus yml configuration.
- Install global Prometheus when required. We recommend that you do not configure global Prometheus until you require data to be federated from other slave Prometheus servers.
- To federate data from a Prometheus slave server to global Prometheus, slave Prometheus server endpoints must be passed as targets into the global Prometheus server using the Prometheus configuration yml.
      
## Prerequisites
   
- If you are using Enterprise DC/OS, you may [need to provision a service account](https://docs.mesosphere.com/1.10/security/ent/service-auth/custom-service-auth/) before installing DC/OS Prometheus Service. Only someone with `superuser` permission can create the service account.
  - To use `strict` [security mode](https://docs.mesosphere.com/1.10/security/ent/service-auth/custom-service-auth/), you must have a service account.
  - In `permissive` security mode, a service account is optional.
  - The use of `disabled` security mode does not require a service account.

## Installing from the DC/OS Web Interface

You can install Prometheus from the DC/OS web interface, select the app from the **Catalog** by clicking on **Deploy**. If you install Prometheus from the DC/OS web interface, the `dcos prometheus` CLI commands are not automatically installed to your workstation. They may be manually installed using the DC/OS CLI:


   ```shell
   dcos package install prometheus --cli
   ```

Below is the default Prometheus configuration and should not be changed. By default, the following configuration performs auto discovery of agent nodes of your cluster and monitors via file SD.

Besides monitoring agent nodes, the default configuration also provides features to monitor master nodes via DNS SD configurations.

```
global:
 scrape_interval:     15s #Set the scrape interval to every 15 seconds. Default is every 1 minute

 evaluation_interval: 15s #Evaluate rules every 15 seconds. The default is every 1 minute

#scrape_timeout is set to the global default (10s). "A scrape configuration containing exactly one endpoint to scrape:
 Here it's Prometheus itself"

scrape_configs:

 - job_name: 'dcos-metrics'    #All master nodes are available at master.mesos via their A record

   dns_sd_configs:
     - names: ['master.mesos']
       type: 'A'
       port: 61091    #All agent nodes are written regularly to discovery/agents.json

   file_sd_configs:
     - files: ['discovery/agents.json']

rule_files:
# set of rule files to read alerting rules from
   -  'rules.yml'      
   
#Alert manager target sample , target field should have alert manager endpoint where you want to fire alerts from your prometheus server
alerting:
 alertmanagers:
   - static_configs:
     - targets: ['alertmanager.prometheus.l4lb.thisdcos.directory:9093'] 
```

## Installing alert manager with base build :
   
By default, Prometheus will launch Prometheus server and to spin up with Alertmanager, you must ensure that you have the Alertmanager node count configuration set to 1. You must pass Alertmanager targets as endpoints to your Prometheus server as explained in [default configuration ]().
   
## Installing Prometheus without Alertmanager and pointing to Alertmanager launched with base build:

 To install Prometheus without Alertmanager, you must set the Alertmanager node count to 0. 
 To point the Prometheus server to base\first build Alertmanger, you must pass alert manager endpoint as target for each of Prometheus services we run using the Prometheus configuration yml.

Example:
```
alerting:
 alertmanagers:
   - static_configs:
     - targets: ['alertmanager.prometheus.l4lb.thisdcos.directory:9093']
```

## Install Prometheus standalone with no linkage to Alertmanager\Global Prometheus:

To install a Prometheus server without Alertmanager\Global Prometheus, you should not configure Alertmanager targets under the Prometheus yml, and should not pass any federation configuration to the Prometheus yml.

With this configuration, your Prometheus server would be launched without pointing to Alertmanager.

## Installing multiple instances

By default, Prometheus is installed with a service name of `prometheus`. You may specify a different name using a custom service configuration as follows:

   ```shell
   {
       "service": {
           "name": "prometheus-other"
       }
   }
   ```

When the above json configuration is passed to the `package install prometheus` command via the `--options` argument, the new service will use the name specified in that json configuration:

   ```shell
   dcos package install prometheus --options=prometheus-other.json
   ```
   
You can install multiple instances of Prometheus on your DC/OS cluster by customizing the name of each instance. For example, you might have one instance of Prometheus named `prometheus-staging` and another named `prometheus-prod`, each with its own custom configuration.  After you have specified a custom name for your instance, it can be reached using `dcos prometheus` CLI commands or directly over HTTP as described below.

**Note:** The service name cannot be changed after initial installation. Changing the service name would require installing a new instance of the service with the new name, then copying over any data as necessary to the new instance.

## Installing into folders

In DC/OS 1.10 and later, services may be installed into folders by specifying a slash-delimited service name. For example:

   ```shell
   {
       "service": {
           "name": "/foldered/path/to/prometheus"
       }
   }
   ```
The above example will install the service under a path of foldered => path => to => prometheus. It can then be reached using `dcos prometheus` CLI commands or directly over HTTP as described below.

**Note:**  The service folder location cannot be changed after initial installation. Changing the service location would require installing a new instance of the service with the new location, then copying over any data as necessary to the new instance.

## Service Discovery configuration templates :
Prometheus DC\OS Mesos offers the following service discovery mechanism: service discovery can be configured along with the default Prometheus configuration. You would use the following templates to pass along a default Prometheus configuration using the Prometheus yml.   

1. Consul_sd_config

Consul SD configurations allow you to retrieve scrape targets from Consul's Catalog API. Finding targets happens in two stages. 

- First, a service discovery method such as Consul returns potential targets with metadata. 
- Second, relabelling allows you to choose which of those targets you want to scrape, and how to convert the metadata into target labels.

Let's say you wanted to monitor all services with a `prod` tag and use the Consul service name as the job label. Your scrape configuration would look like:

Template for consul sd config :

```
# The information to access the Consul API. It is to be defined
# as the Consul documentation requires
scrape_configs:
  - job_name: dummy
    consul_sd_configs:
      - server: 'localhost:8500'
    relabel_configs:
      - source_labels: [__meta_consul_tags]
        regex: .*,prod,.*
        action: keep
      - source_labels: [__meta_consul_service]
        target_label: job

```
The first relabel action says to keep processing only those targets which have a `prod` tag. Prometheus exposes the Consul tags as a comma separated list in the label called __meta_consul_tags, with leading and trailing commas added for convenience.

The second relabel action says to copy the service name from the __meta_consul_service label to the job label. This is done to take advantage of the default values for relabel actions, as a straight copy from one label to another is common.

2. Dns_sd_condig

A DNS-based service discovery configuration allows you to specify a set of DNS domain names which are periodically queried to discover a list of targets. This service discovery method only supports basic DNS A, AAAA and SRV record queries,

Default `dns sd` configuration in `dcos prometheus`:

```
scrape_configs:
- job_name: master-metrics #job name 
  # All master nodes are available at master.mesos via their A record
  dns_sd_configs:
    - names: ['master.mesos'] # A list of DNS domain names to be queried. 
      type: 'A' # The type of DNS query to perform.
      port: 61091 # The port number used if the query type is not SRV. 
```

3. EC2_sd_config

EC2 SD configurations allow you to retrieve scrape targets from AWS EC2 instances. 

Template for EC2_sd_config: 

```
# The information to access the EC2 API.
scrape_configs:
  - job_name: 'node' # mention job name as desired
    ec2_sd_configs:
      - region: eu-west-1 # The AWS Region.
        access_key: PUT_THE_ACCESS_KEY_HERE
        secret_key: PUT_THE_SECRET_KEY_HERE
        port: 9100

```

## Virtual Networks

DC/OS Prometheus supports deployment on virtual networks on DC/OS, allowing each container (task) to have its own IP address and not use port resources on the agent machines. This can be specified by passing the following configuration during installation:

   ```shell
   {
       "service": {
           "virtual_network_enabled": true
       }
   }
   ```
**Note:** Once the service is deployed on a virtual network, it cannot be updated to use the host network.

## Integration with DC/OS access controls

In Enterprise DC/OS 1.10 and later, you can integrate your SDK-based service with DC/OS ACLs to grant users and groups access only to  certain services. To do this, install your service into a folder, and then restrict access to some number of folders. Folders also allow you to namespace services; for instance, `staging/prometheus` and `production/prometheus`.

### Steps

  1. In the DC/OS GUI, create a group, then add a user to the group. Or, just create a user. Click **Organization > Groups > +** or **Organization > Users > +**. If you create a group, you must also create a user and add them to the group.

  2. Give the user permissions for the folder where you will install your service. In this example, we are creating a user called developer, who will have access to the /testing folder.

  3. Select the group or user you created. Select ADD PERMISSION and then toggle to INSERT PERMISSION STRING. Add each of the following permissions to your user or group, and then click ADD PERMISSIONS.

   ```shell
   dcos:adminrouter:service:marathon full
   dcos:service:marathon:marathon:services:/testing full
   dcos:adminrouter:ops:mesos full
   dcos:adminrouter:ops:slave full
   ```
  4. Install your service into a folder called `test`. Go to **Catalog**, then search for Prometheus.

  5. Click CONFIGURE and change the service name to `/testing/prometheus`, then deploy. The slashes in your service name are interpreted as folders. You are deploying `prometheus` in the `/testing` folder. Any user with access to the `/testing` folder will have access to the service.

**Note:**
  - Services cannot be renamed. Because the location of the service is specified in the name, you cannot move services between folders.
  - DC/OS 1.9 and earlier does not accept slashes in service names. You may be able to create the service, but you will encounter unexpected problems.

## Interacting with your foldered service

1. Interact with your foldered service via the DC/OS CLI with this flag: --name=/path/to/myservice.
2. To interact with your foldered service over the web directly, use http://<dcos-url>/service/path/to/myservice. E.g., http://<dcos-url>/service/testing/prometheus/v1/endpoints.

## Placement Constraints

Placement constraints allow you to customize where a service is deployed in the DC/OS cluster. Depending on the service, some or all of the components may be configurable using Marathon operators (reference). For example, [["hostname", "UNIQUE"]] ensures that at most one pod instance is deployed per agent.

A common task is to specify a list of whitelisted systems to deploy to. To achieve this, use the following syntax for the placement constraint:
   ```shell
   [["hostname", "LIKE", "10.0.0.159|10.0.1.202|10.0.3.3"]]
  ```
You must include spare capacity in this list, so that if one of the whitelisted systems goes down, there is still enough room to repair your service (via pod replace) without requiring that system.

**Example**

In order to define placement constraints as part of an installation or update of a service, they should be provided as a json encoded string. For example, you can define a placement constraint in an options file as follows:

   ```shell
   cat options.json
   {
       "hello": {
       "placement": "[[\"hostname\", \"UNIQUE\"]]"
       }
   }
   ```
This file can be referenced to install a Prometheus service.

   ```shell
   dcos package install hello-world --options=options.json
   ```
Likewise, this file can be referenced to update a Prometheus service.

   ```shell
   dcos prometheus update start --options=options.json
   ```

## Secured Installation
For secure installation, it is recommended to do folder installation, and folder access should be limited.
