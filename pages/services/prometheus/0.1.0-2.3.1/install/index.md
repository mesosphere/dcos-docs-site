---
layout: layout.pug
navigationTitle:  Installing and Customizing
title: Installing and Customizing
menuWeight: 20
excerpt:
featureMaturity:
enterprise: false
---

DCOS Prometheus is available in the Universe and can be installed by using either the web interface or the DC/OS CLI.

The default DC/OS Prometheus Service installation provides reasonable defaults for trying out the service, but that may not be sufficient for production use. You may require different configurations depending on the context of the deployment.


## Configuration Best Practices for Production
By default every prometheus sample consumes 1-2 Bytes of storage, 
      To plan production configuration of server following formula is recommended to be used:

    - Needed_disk_space = retention_time_seconds * ingested_samples_per_second * bytes_per_sample

For Installation below combination is recommended for prometheus server and alert manager
 
    - Install Alert Manager with base\first build of framework , its recommended to install remaining framework without alert manager and alert manager node count should be made zero, 
    all the rest of the prometheus servers should point to the same alert manager which was installed with base\first build,to do this you would require to pass alert manager endpoint as target to your  prometheus servers under your prometheus yml configuration : 
        
    - Install global prometheus when required ,its recommended for global prometheus not to be configure until you require data to be federate from other slave prometheus servers,
    To federate data from promethes slave server to global prometheus,slave prometheus server endpoints to be passed as target into global prometheus server under prometheus configuration yml.
      
## Prerequisites
   
- If you are using Enterprise DC/OS, you may [need to provision a service account](https://docs.mesosphere.com/1.10/security/ent/service-auth/custom-service-auth/) before installing DC/OS Prometheus Service. Only someone with `superuser` permission can create the service account.
  - `strict` [security mode](https://docs.mesosphere.com/1.10/security/ent/service-auth/custom-service-auth/) requires a service account.
  - In `permissive` security mode a service account is optional.
  - `disabled` security mode does not require a service account.

## Installing from the DC/OS Web Interface

Note:  You can install Prometheus from the DC/OS web interface by clicking on Deploy after selecting the app from Catalog.
   
If you install Prometheus from the DC/OS web interface, the 
dcos prometheus CLI commands are not automatically installed to your workstation. They may be manually installed using the DC/OS CLI:


   ```shell
   dcos package install prometheus --cli
   ```

Below is the default prometheus configuration and should not be changed, by default below configuration does auto discovery of agent nodes of your cluster and monitors via file sd.

Apart from monitoring agent nodes , default configuration also provides feature to monitor master node via DNS SD configurations.

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
   
   By default , prometheus will launch prometheus server and to spin up with alert manager ,you would require to ensure you have node count of alert manager configuration set to 1 and you would need to pass alert manager target as endpoints to your prometheus server as explained in above section as default configuration 
   
## Installing Prometheus without Alert Manager and point to Alert Manager launched with base build:

 To install Prometheus without alert manager , alert manager node count would require to be made zero under. 
 To point Prometheus server to base\first build Alert manger,we require to pass alert manager endpoint as target for each of Prometheus services we run under prometheus configuration yml.

```
Example : 
alerting:
 alertmanagers:
   - static_configs:
     - targets: ['alertmanager.prometheus.l4lb.thisdcos.directory:9093']
```

## Install Prometheus standalone with no linkage to Alert Manager\Global Prometheus:

To Install Prometheus server without alert manager\global prometheus , you should not be configuring alert manager targets under prometheus yml and should not pass any federation configuration to prometheus yml.

With these configuration Prometheus server would be launched without pointing to Alert Manager.

## Installing multiple instances

By default, the prometheus is installed with a service name of prometheus. You may specify a different name using a custom service configuration as follows:

   ```shell
   {
       "service": {
           "name": "prometheus-other"
       }
   }
   ```

When the above JSON configuration is passed to the package install prometheus  command via the --options argument, the new service will use the name specified in that JSON configuration:

   ```shell
   dcos package install prometheus --options=prometheus-other.json
   ```
   
Multiple instances of Prometheus may be installed into your DC/OS cluster by customizing the name of each instance. For example, you might have one instance of Prometheus named prometheus-staging and another named prometheus-prod, each with its own custom  configuration.

After specifying a custom name for your instance, it can be reached using dcos prometheus CLI commands or directly over HTTP as described below.

Note: The service name cannot be changed after initial install. Changing the service name would require installing a new instance of the service against the new name, then copying over any data as necessary to the new instance.

## Installing into folders

In DC/OS 1.10 and above, services may be installed into folders by specifying a slash-delimited service name. For example:

   ```shell
   {
       "service": {
           "name": "/foldered/path/to/prometheus"
       }
   }
   ```
The above example will install the service under a path of foldered => path => to => prometheus. It can then be reached using dcos prometheus  CLI commands or directly over HTTP as described below.

Note:  The service folder location cannot be changed after initial install.Changing the service location would require installing a new instance of the service against the new location, then copying over any data as necessary to the new instance.

## Service Discovery configuration templates :
Prometheus DC\OS mesos offers follwoing service discovery mechanism, service discovery can be configured along with default prometheus configuration available , below are the templates you would require to pass along with default prometheus configuration under prometheus yml   

**1. Consul_sd_config :**
Consul SD configurations allow retrieving scrape targets from Consul's Catalog API.

Prometheus support consul , lets see how to use it.
 
Finding targets happens in two stages. First a service discovery method such as Consul returns potential targets with metadata. 

Secondly relabelling allows you to choose which of those targets you want to scrape, and how to convert the metadata into target labels

Lets say you wanted to monitor all services with a prod tag and use the Consul service name as the job label. Your scrape configuration would look like:

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
The first relabel action says to keep processing only those targets who have a prod tag. Prometheus exposes the Consul tags as a comma separated list in the label called __meta_consul_tags, with leading and trailing commas added for convenience.

The second relabel action says to copy the service name from the __meta_consul_service label to the job label. This is take advantage of the default values for relabel actions, as a straight copy from one label to another is common.

**2. Dns_sd_condig :** 

A DNS-based service discovery configuration allows specifying a set of DNS domain names which are periodically queried to discover a list of targets.
This service discovery method only supports basic DNS A, AAAA and SRV record queries,

Default dns sd configuration in dcos prometheus:

```
scrape_configs:
- job_name: master-metrics #job name 
  # All master nodes are available at master.mesos via their A record
  dns_sd_configs:
    - names: ['master.mesos'] # A list of DNS domain names to be queried. 
      type: 'A' # The type of DNS query to perform.
      port: 61091 # The port number used if the query type is not SRV. 
```

**3. EC2_sd_config  :**

EC2 SD configurations allow retrieving scrape targets from AWS EC2 instances. 

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
Note: Once the service is deployed on a virtual network, it cannot be updated to use the host network.

## Integration with DC/OS access controls

In Enterprise DC/OS 1.10 and above, you can integrate your SDK-based service with DC/OS ACLs to grant users and groups access to only certain services. You do this by installing your service into a folder, and then restricting access to some number of folders. Folders also allow you to namespace services. For instance, staging/prometheus and production/prometheus.

Steps:

  1. In the DC/OS GUI, create a group, then add a user to the group. Or, just create a user. Click Organization > Groups > + or Organization > Users > +. If you create a group, you must also create a user and add them to the group.

  2. Give the user permissions for the folder where you will install your service. In this example, we are creating a user called developer, who will have access to the /testing folder.

  3. Select the group or user you created. Select ADD PERMISSION and then toggle to INSERT PERMISSION STRING. Add each of the following permissions to your user or group, and then click ADD PERMISSIONS.

   ```shell
   dcos:adminrouter:service:marathon full
   dcos:service:marathon:marathon:services:/testing full
   dcos:adminrouter:ops:mesos full
   dcos:adminrouter:ops:slave full
   ```
  4. Install your service into a folder called test. Go to Catalog, then search for prometheus.

  5. Click CONFIGURE and change the service name to /testing/prometheus, then deploy.
     The slashes in your service name are interpreted as folders. You are deploying prometheus in the /testing folder. Any user with access to the /testing folder will have access to the service.

Important:

  a. Services cannot be renamed. Because the location of the service is specified in the name, you cannot move services between folders.
  b. DC/OS 1.9 and earlier does not accept slashes in service names. You may be able to create the service, but you will encounter unexpected problems.

## Interacting with your foldered service

1. Interact with your foldered service via the DC/OS CLI with this flag: --name=/path/to/myservice.
2. To interact with your foldered service over the web directly, use http://<dcos-url>/service/path/to/myservice. E.g., http://<dcos-url>/service/testing/prometheus/v1/endpoints.

## Placement Constraints

Placement constraints allow you to customize where a service is deployed in the DC/OS cluster. Depending on the service, some or all components may be configurable using Marathon operators (reference). For example, [["hostname", "UNIQUE"]] ensures that at most one pod instance is deployed per agent.

A common task is to specify a list of whitelisted systems to deploy to. To achieve this, use the following syntax for the placement constraint:
   ```shell
   [["hostname", "LIKE", "10.0.0.159|10.0.1.202|10.0.3.3"]]
  ```
You must include spare capacity in this list, so that if one of the whitelisted systems goes down, there is still enough room to repair your service (via pod replace) without requiring that system.

**Example**

In order to define placement constraints as part of an install or update of a service they should be provided as a JSON encoded string. For example one can define a placement constraint in an options file as follows:

   ```shell
   cat options.json
   {
       "hello": {
       "placement": "[[\"hostname\", \"UNIQUE\"]]"
       }
   }
   ```
This file can be referenced to install a prometheus service.

   ```shell
   dcos package install hello-world --options=options.json
   ```
Likewise this file can be referenced to update a prometheus service.

   ```shell
   dcos prometheus update start --options=options.json
   ```

## Secured Installation
For secure installation its recommended to do folder installation and folder access should be limited.
