---
layout: layout.pug
navigationTitle: Quick Start
excerpt: Configuring Percona XtraDB Cluster - Quick Start
title: Quick Start
menuWeight: 21
model: /services/pxc/data.yml
render: mustache
---

DC/OS {{ model.techName }} is available in the DC/OS Universe and can be installed by using either the web interface or the DC/OS CLI.

This section will take you through a minimal install of the {{ model.techName }} Service on a cluster.

## Prerequisites
- You must have [DC/OS](/latest/in) installed on your cluster.
- Your cluster must have {{ model.install.minNodeCount }}.
- If you are using Enterprise DC/OS, you may [need to provision a service account](/1.12/security/ent/service-auth/custom-service-auth/) before installing DC/OS {{ model.techName }} Service. Only someone with `superuser` permission can create the service account.
  - `strict` [security mode](/1.12/security/ent/service-auth/custom-service-auth/) requires a service account.
  - In `permissive` security mode a service account is optional.
  - `disabled` security mode does not require a service account.

## Installing from the CLI

If you are using DC/OS Open Source, install {{ model.serviceName }} on the cluster with the following command from the DC/OS CLI. 

```shell
dcos package install --yes {{ model.serviceName }}
```
If you are using Enterprise DC/OS, you may need to follow additional instructions. See the [Install](/services/pxc/0.1.0-5.7.21/operations/install/) section for more information.

## Installing from the web interface

Alternatively, you can install {{ model.techName }} from the DC/OS web interface. The instructions are [here](/services/pxc/0.1.0-5.7.21/operations/install/#installing-from-the-dcos-web-interface).

Once the `install` command is triggered, the service will deploy with a default configuration. You can monitor its deployment via the Services tab of the DC/OS web interface.   

# External Client Access (ProxySQL and Edge-LB configuration)
<!-- Can this section be moved to Operations? The only procedures that should go here are those involved in a minimal installation. -->

## Configuring ProxySQL 
ProxySQL is auto configured by the service with some defaults as in the configuration. 
<!-- What defaults? -->

## Configuring Edge-LB
1. Install Edge-LB using the following steps:

   ```shell
   dcos package repo add --index=0 edgelb-aws \
   https://edge-lb-infinity-artifacts.s3.amazonaws.com/autodelete7d/master/edgelb/stub-universe-edgelb.json
   ```
   ```
   dcos package repo add --index=0 edgelb-pool-aws \
   https://edge-lb-infinity-artifacts.s3.amazonaws.com/autodelete7d/master/edgelb-pool/stub-universe-edgelb-pool.json
   ```
   ```
   dcos package install edgelb --yes
   ```

   ```
   dcos package install edgelb --cli
   ```

   ```
   dcos edgelb create {{ model.serviceAcronym }}-edgelb.json
   ```

1. In the `{{ model.serviceAcronym }}-edgelb.json` file, update the `proxysql-client-endpoint` accordingly:

   ```json
   {
           "apiVersion": "V2",
           "name": "{{ model.serviceAcronym }}",
           "count": 1,
           "haproxy": {
                   "frontends": [{
                                   "bindPort": 3306,
                                   "protocol": "TCP",
                                   "linkBackend": {
                                        "defaultBackend": "{{ model.serviceAcronym }}"
                                }
                        }

                ],
                "backends": [{
                        "name": "{{ model.serviceAcronym }}",
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

1. Run the following command from any host machine running Docker:
   ```shell
   docker run --name mysql-cli -e MYSQL_ROOT_PASSWORD=root -d mysql:5.7
   ```

1. Get into the container by running a bash into this as follows:
   ```shell
   sudo docker exec -ti mysql-cli bash
   ```
1. Note down the public slave security group IP address for the DC/OS cluster on which DC/OS is running. Use this IP address in the following command:
   ```shell
   mysql -u<application_user_name> -p<application_user_passwd> -h<public_slave_securitygrpIP> -P3306
   ```
   This will connect to your {{ model.techName }} cluster. 

Now you may start using the cluster by creating a database and tables on it.


