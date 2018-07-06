---
post_title: Install and Customize
menu_order: 20
enterprise: 'no'
---

 DCOS Prometheus is available in the Universe and can be installed by using either the web interface or the DC/OS CLI.

The default DC/OS Prometheus Service installation provides reasonable defaults for trying out the service, but that may not be sufficient for production use. You may require different configurations depending on the context of the deployment.


## Configuration Best Practices for Production
  
    - Install Alert Manager with base\first build of framework , its recommended to install remaining framework without alert manager and alert manager check box not to be checked, 
    all the rest of the prometheus servers should point to the same alert manager which was installed with base\first build,to do this you would require to pass alert manager endpoint as target to your  prometheus servers.
        
    - Install global prometheus when required ,its recommended for global prometheus not to be configure until you require data to be federate from other salve prometheus servers,
    To federate data from promethes slave server to global prometheus,slave prometheus server endpoints to be passed as target into global prometheus server under prometheus configuration yml.
      
## Prerequisites
   
- If you are using Enterprise DC/OS, you may [need to provision a service account](https://docs.mesosphere.com/1.10/security/ent/service-auth/custom-service-auth/) before installing DC/OS Prometheus Service. Only someone with `superuser` permission can create the service account.
  - `strict` [security mode](https://docs.mesosphere.com/1.10/security/ent/service-auth/custom-service-auth/) requires a service account.
  - In `permissive` security mode a service account is optional.
  - `disabled` security mode does not require a service account.
- Your cluster must have at least 3 private nodes.

# Installing from the DC/OS CLI

To start a basic test cluster of Prometheus, run the following command on the DC/OS CLI. Enterprise DC/OS users must follow additional instructions.

   ```shell
   dcos package install prometheus 
   ```

This command creates a new instance with the default name prometheus. Two instances cannot share the same name, so installing additional instances beyond the default instance requires customizing the name at install time for each additional instance. However, the application can be installed using the same name in case of foldered installation, weherein we can install the same application in different folders.

All dcos prometheus CLI commands have a --name  argument allowing the user to specify which instance to query. If you do not specify a service name, the CLI assumes a default value matching the package name, i.e. prometheus. The default value for --name can be customized via the DC/OS CLI configuration:

   ```shell
   dcos prometheus --name=prometheus <cmd>
   ```

You can specify a custom configuration in an `options.json` file and pass it to `dcos package install` using the `--options` parameter.

   ```shell
   dcos package install prometheus --options=options.json
   ```

For more information on building the `options.json` file, see [DC/OS documentation](https://docs.mesosphere.com/latest/usage/managing-services/config-universe-service/) for service configuration access.

## Installing from the DC/OS Web Interface

Note:  Alternatively, you can install Prometheus from the DC/OS web interface by clicking on Deploy after selecting the app from Catalog.
   
If you install Prometheus from the DC/OS web interface, the 
dcos prometheus CLI commands are not automatically installed to your workstation. They may be manually installed using the DC/OS CLI:


   ```shell
   dcos package install prometheus --cli
   ```

## Installing HA-alert manager with base build :
   
   By default , prometheus will launch HA-prometheus server and to spin up with HA-Alert manager , alert manager check box need to be checked.
   
## Installing HA-Prometheus without Alert Manager and point to HA-Alert Manager launched with base build:

 To install HA-Prometheus without alert manager , alert manager check box not to be checked under alert manager config.
 To point HA-Prometheus server to base\first build HA-Alert manger,we require to pass alert manager endpoint as target for each of HA-Prometheus services we run under prometheus configuration yml.

## Installing HA-global prometheus 

To federate data from slave prometheus to global prometheus,HA-global prometheus is requird to be installed.
To install global prometheus, you would require to mention global prometheus specific configuration changes to prometheus yml and slave prometheus end points needs to be passed as target with in single quotes comma separated.

Note: mention global prometheus configuration only when you require federation else its not recommended to be checked.

## Install HA-Prometheus standalone with no linkage to Alert Manager\Global Prometheus:

To Install HA-Prometheus server without alert manager\global prometheus , you should not check on alert manager check box , alert manager target check box and should not put global prometheus configuration.

With these configuration HA-Prometheus server would be launched without pointing to HA-Alert Manager.

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

## Service Discovery
Each Service Discovery requires parameters to be passed for thier respective SD, Promethesu DC\OS mesos offers follwoing service discovery mechanism :

1. Consul_sd_config :
Consul SD configurations allow retrieving scrape targets from Consul's Catalog API.

Parameters required for consul sd :
           
            consul  : 
            server  : <host> | default = "localhost:8500"
            service : A list of services for which targets are retrieved. If omitted, all services are scraped.
 
2. Dns_sd_condig : 

A DNS-based service discovery configuration allows specifying a set of DNS domain names which are periodically queried to discover a list of targets.
This service discovery method only supports basic DNS A, AAAA and SRV record queries, but not the advanced DNS-SD approach specified in RFC6763.

Parameters required for dns sd :

           dnsjobname       : Job name 
           Domain name      : DNS domain names to be queried
           Query Type       : The type of DNS query to perform,default = 'SRV' 
           Dns port         : The port number used if the query type is not SRV
           Refresh interval : <duration> The time after which the provided names are refreshed

3. EC2 SD :
EC2 SD configurations allow retrieving scrape targets from AWS EC2 instances. 


        Region name  : The AWS Region <string>
        Access key   : The AWS API keys. If blank, the environment variables `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are used.
        Secret key   : <secret>
        Ec2 port     :  The port to scrape metrics from
   
4. Marathon Sd Config :
 Marathon SD configurations allow retrieving scrape targets using the Marathon REST API. Prometheus will periodically check the REST endpoint for currently running tasks and create a target group for every app that has at least one healthy task.

        Marathon job name : JOb Name
        Polling interval  : refresh_interval <duration>
        Servername        : List of URLs to be used to contact Marathon servers.You need to provide at least one server URL.

## Addressing named instances

After you’ve installed the service under a custom name or under a folder, it may be accessed from all dcos prometheus CLI commands using the --name argument. By default, the --name value defaults to the name of the package, or prometheus.

For example, if you had an instance named prometheus-dev, the following command would invoke a pod list command against it:

   ```shell
   dcos prometheus --name=prometheus-dev pod list
   ```
The same query would be over HTTP as follows:

   ```shell
   curl -H "Authorization:token=$auth_token" <dcos_url>/service/prometheus-dev/v1/pod
   ```
Likewise, if you had an instance in a folder like /foldered/path/to/prometheus, the following command would invoke a pod list command against it:

   ```shell
   dcos prometheus --name=/foldered/path/to/prometheus pod list
   ```
   
Similarly, it could be queried directly over HTTP as follows:

   ```shell
   curl -H "Authorization:token=$auth_token" <dcos_url>/service/foldered/path/to/prometheus-dev/v1/pod
   ```
Note: You may add a -v (verbose) argument to any dcos prometheus command to see the underlying HTTP queries that are being made. This can be a useful tool to see where the CLI is getting its information. In practice, dcos prometheus commands are a thin wrapper around an HTTP interface provided by the DC/OS Prometheus Service itself.

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


## Minimal Installation

For development purposes, you may wish to install Prometheus on a local DC/OS cluster. For this, you can use dcos-docker or dcos-vagrant.
To start a minimal cluster with a single broker, create a JSON options file named sample-prometheus-minimal.json:

   ```shell
   {
       "node": {
       "count": 1,
       "mem": 512,
       "cpu": 0.5
       }
   }
   ```
The command below creates a cluster using sample-prometheus-minimal.json:


   ```shell
   dcos package install prometheus --options=sample-prometheus-minimal.json
   ```
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
