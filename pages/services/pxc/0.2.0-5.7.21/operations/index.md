---
layout: layout.pug
navigationTitle: Operations
excerpt: Managing, repairing, and monitoring the service
title: Operations
menuWeight: 30
model: /services/pxc/data.yml
render: mustache
---

#include /mesosphere/dcos/services/include/operations.tmpl

# External Client Access (ProxySQL and Edge-LB configuration)


## Configuring ProxySQL 
ProxySQL is auto configured by the service with these defaults: 


- Refresh Interval: 2000
- Threads: 2
- Max Connections: 2048
- Default Query Timeout: 10000
- Poll Timeout: 2000
- Default Schema: information_schema
- Stacksize: 1048576
- Connect Timeout Server: 10000
- Monitor History: 60000
- Monitor Connect Interval: 20000
- Monitor Ping Interval: 10000
- Ping Timeout Server: 200
- Commands Stats: True
- Sessions Sort: True

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
