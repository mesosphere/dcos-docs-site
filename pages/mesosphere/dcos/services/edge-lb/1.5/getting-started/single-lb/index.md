---
layout: layout.pug
navigationTitle: Expose and load balance a sample service
title: Expose and load balance a sample service
menuWeight: 15
excerpt: Illustrates the basic steps for load balancing a single service running on DC/OS
enterprise: true
---

These sample exercises demonstrate how to prepare load balancing for access to a single DC/OS&trade; service. For this tutorial, the access requests originate outside of the DC/OS cluster and are routed into the cluster through a public-facing IP address. This scenario illustrates the most common way that organizations get started with a load balancing solution.

# Before you begin
You must have:
* Edge-LB installed as described in the Edge-LB [installation instructions](/mesosphere/dcos/services/edge-lb/1.5/getting-started/installing).
* The core DC/OS command-line interface (CLI) installed and configured to communicate with the DC/OS cluster.
* The `edgelb` command-line interface (CLI) installed.
* An active and properly-configured DC/OS Enterprise cluster.
* A DC/OS Enterprise cluster that has at least one DC/OS **private agent** node to run the load-balanced service and at least one DC/OS **public agent** node for exposing the load-balanced service.

# Preview of what you will do
These procedures show you how to configure an Edge-LB instance to provide public access to a simple Marathon&trade; app. In this tutorial, you will:
* Create and deploy a sample Marathon app called `ping`.
* Expose the `ping` app through the Edge-LB pool instance called `ping-lb`.
* Access the sample `ping` app through the public agent URL.

# Create the sample app definition
1. Open a text editor, then copy and paste the following sample app definition to create the `ping.json` file:

    ```json
    {
      "id": "/ping",
      "cpus": 0.1,
      "mem": 32,
      "instances": 1,
      "cmd": "echo \"pong\" > index.html && python -m http.server $PORT0",
      "container": {
        "type": "DOCKER",
        "docker": {
          "image": "python:3"
        }
      },
      "healthChecks": [
      {
        "protocol": "MESOS_HTTP",
        "path": "/",
        "portIndex": 0,
        "gracePeriodSeconds": 5,
        "intervalSeconds": 10,
        "timeoutSeconds": 10,
        "maxConsecutiveFailures": 3
      }
      ],
      "portDefinitions": [
      {
        "protocol": "tcp",
        "port": 0,
        "name": "pong-port"
      }
      ],
      "requirePorts": true
    }
    ```

    In this sample app definition, notice that the `portDefinitions.name` field matches the `haproxy.backends.endpoint.portName` setting. If these fields don't match, the pool will not deploy successfully.

1. Deploy the `ping` service by installing the `ping.json` app definition:

    ```bash
    dcos marathon app add ping.json
    ```

    This command displays a confirmation message similar to the following, if deployment is successful:
    ```
    Created deployment dfeec06f-5d64-44e0-b6f2-4ddb61fb0887
    ```

# Create the Edge-LB pool configuration file
1. Open a text editor, then copy and paste the following Edge-LB pool configuration settings to create the `ping-lb.json` Edge-LB pool instance:

    ```json
    {
      "apiVersion": "V2",
      "name": "ping-lb",
      "count": 5,
      "haproxy": {
        "frontends": [
        {
          "bindPort": 15001,
          "protocol": "HTTP",
          "linkBackend": {
            "defaultBackend": "ping-backend"
          }
        }
      ],
        "backends": [
        {
          "name": "ping-backend",
          "protocol": "HTTP",
          "services": [
          {
            "marathon": {
              "serviceID": "/ping"
            },
            "endpoint": {
              "portName": "pong-port"
            }
          }
        ]
        }
      ],
        "stats": {
          "bindPort": 0
        }
      }
    }
    ```

1. Review the configuration settings to verify they meet the following guidelines and requirements:
    - The `name` indicates the pool instance name.
      In this sample pool configuration file, the instance name is `ping-lb`. You must have this name to edit, update, or delete the Edge-LB pool instance after you deploy it.

    - The `haproxy.frontends.linkBackend.defaultBackend` must match the `haproxy.backends.name` value.
      In this sample pool configuration file, the backend name is `ping-backend`.

    - The `haproxy.backends.endpoint.portName` in the pool configuration file must match the `portDefinitions.name` in the app definition file. In this sample pool configuration file, the name is `pong-port`.

    - The `haproxy.frontends.bindPort` setting indicates the port used to access the app. In this sample pool configuration file, the app is accessible on port 15001.

    - The `haproxy.stats.bindPort` setting indicates that the port for accessing load-balancing statistics. In this sample configuration file, the setting of `0` specifies that the port is dynamically allocated.

    - The `haproxy.backends.marathon.serviceID` must match the name of the app definition.
      In this sample pool configuration file, the service name is `/ping`.

    <p class="message--note"><strong>NOTE: </strong>When you deploy a cluster with Terraform, the default firewall configuration allows you to access only ports 80 (http) and 443 (https). Everything else is blocked. You may want to add public agent ports to the main.tf file (the Terraform configuration file of the running cluster) in module "dcos." To add public agent ports, add a line like this one, <code>public_agents_additional_ports = [ 15001, 10020, 9090, 1025 ]</code>, and then re-deploy the cluster.</p>

# Deploy an Edge-LB pool to expose the service

1. Deploy the `ping-lb.json` pool configuration file to create the `ping-lb` pool instance for load balancing access to the `ping` service:

    ```bash
    dcos edgelb create ping-lb.json
    ```

    The command displays a confirmation message similar to the following:
    ```
    Successfully created ping-lb. Check "dcos edgelb show ping-lb" or "dcos edgelb status ping-lb" for deployment status
    ```

1. Verify the service and the pool instance have been deployed successfully:

    ```bash
    dcos marathon app list
    ```

    The command displays information similar to the following:
    ```
    ID                          MEM   CPUS  TASKS  HEALTH  DEPLOYMENT  WAITING  CONTAINER  CMD
    /dcos-edgelb/api            1024   1     1/1    1/1       ---      False      MESOS    cp -vR /dcosfilestmp/*...
    /dcos-edgelb/pools/ping-lb  2048   1     1/1    1/1       ---      False      MESOS    export...
    /ping                        32   0.1    1/1    1/1       ---      False      DOCKER   echo "pong" > index.html &&...
    ```

1. Verify the pool configuration for the frontend and statistics ports:

    ```bash
    dcos edgelb list
    ```
    This command displays information similar to the following:
    ```
    NAME     APIVERSION  COUNT  ROLE          PORTS
    ping-lb  V2          5      slave_public  0, 15001
    ```

1. Verify the tasks associated with the deployed services and the pool instance:

    ```bash
    dcos task list
    ```
    This command displays information similar to the following:
    ```
    NAME                       HOST        USER  STATE  ID                                                              MESOS ID                                     REGION          ZONE
    api.dcos-edgelb            10.0.2.231  root    R    dcos-edgelb_api.17a52ec2-5177-11e9-9149-e2160eee24f2            e9153020-fe99-49d7-9d10-773adf12e726-S1  aws/us-west-2  aws/us-west-2c
    ping                       10.0.2.231  root    R    ping.1b56da33-5179-11e9-9149-e2160eee24f2                       e9153020-fe99-49d7-9d10-773adf12e726-S1  aws/us-west-2  aws/us-west-2c
    ping-lb.pools.dcos-edgelb  10.0.2.231  root    R    dcos-edgelb_pools_ping-lb.88344f14-517a-11e9-9149-e2160eee24f2  e9153020-fe99-49d7-9d10-773adf12e726-S1  aws/us-west-2  aws/us-west-2c
    ```

1. Verify that the Edge-LB pool instance was deployed successfully with the configured frontend and backend ports:

    ```bash
    dcos edgelb endpoints ping-lb
    ```
    This command displays information similar to the following:

    ```
    NAME            PORT   INTERNAL IP
    frontend_port0  15001  10.0.5.105
    stats_port      1025   10.0.5.105
    ```

    Optionally, you can view the Edge-LB pool configuration as formatted output or in JSON file format using one of the following commands:

    ```bash
    dcos edgelb show ping-lb

    dcos edgelb show ping-lb --json
    ```

    You will see output similar to the following:

    ```bash
    Summary:
      NAME         ping-lb
      APIVERSION   V2
      COUNT        5
      ROLE         slave_public
      CONSTRAINTS  hostname:UNIQUE
      STATSPORT    0

    Frontends:
      NAME                    PORT   PROTOCOL
      frontend_0.0.0.0_15001  15001  HTTP

    Backends:
      FRONTEND                NAME          PROTOCOL  BALANCE
      frontend_0.0.0.0_15001  ping-backend  HTTP      roundrobin

    Marathon Services:
      BACKEND       TYPE     SERVICE  CONTAINER  PORT       CHECK
      ping-backend  AUTO_IP  /ping               pong-port  enabled

    Mesos Services:
      BACKEND  TYPE  FRAMEWORK  TASK  PORT  CHECK
    ```

# Access the sample load balanced service
After you have configured and tested the `ping` service and `ping-lb` pool configuration file, you can verify you have access to the service.

1. Open a web browser and navigate to the public-facing IP address.

    If your DC/OS Enterprise cluster is 1.13, or newer, you can view the public-facing IP address by clicking **Nodes** in the DC/OS web-based console, or by using the command:

    ```bash
    dcos node list
    ```

    In most cases, this command returns node information that includes both the private and public IP addresses for each node. You should keep in mind, however, that the public and private IP addresses returned might not be accurate if the Edge-LB pool uses virtual networks.

    For more information about finding the public IP address for a public agent node, see [Finding a public agent IP](/mesosphere/dcos/2.0/administering-clusters/locate-public-agent/).

1. Verify that you can access the deployed service using the public-facing IP address and the frontend port 15001:

    ```bash
    http://<public_agent_public_IP>:15001
    ```

    For example, if the public IP address for the public agent node is 34.211.65.249, access the `pong` service by opening `http://34.211.65.249:15001`.

    If you have not enabled additional ports by changing the main.tf file and re-deploying the cluster, you can access the "pong" service by executing the following command with one of the default [ports](/mesosphere/dcos/2.0/installing/production/system-requirements/ports) which are 80 and 443, with your public IPs included:

    ```
    $ curl <public IP address>:443
    Output: pong
    ```
