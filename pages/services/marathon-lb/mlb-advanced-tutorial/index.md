---
layout: layout.pug
navigationTitle: Tutorial - Internal and external load balancing
title: Tutorial - Advanced internal and external load balancing
menuWeight: 30
excerpt: How to use Marathon-LB for both internal and external load balancing
enterprise: false
---

This tutorial guides you through the steps for configuring Marathon-LB to be used as an internal and external load balancer.
- The **external load balancer** is used to route external HTTP traffic into the cluster.
- The **internal load balancer** is used for internal service discovery and load balancing within the cluster. 

This tutorial illustrates a DC/OS cluster running on an AWS instance, with external traffic routed directly to an external load balancer first. The external load balancer is configured to expose the “public” agent nodes in the DC/OS cluster. The public agent nodes route inbound requests that then run as containerized DC/OS services for a website.

After completing this tutorial, you will have hands-on practice configuring Marathon-LB for a cluster running on an AWS instance with Marathon-LB providing internal and external load balancing using a sample application.

# Before you begin
* You must have a DC/OS cluster installed by using [AWS cloud templates](/1.12/installing/evaluation/aws/) and credentials.
* The DC/OS cluster must have at least one master node, at least three private agent nodes, and at least one public agent node.
* You must have an account with access to the DC/OS web-based administrative console or DC/OS command-line interface.
* You must have Marathon-LB installed.

# Verify Marathon-LB is installed and running
Before you configure load balancing for external or internal applications, you should verify that you have Marathon-LB installed and working properly. 

To verify you have Marathon-LB installed and running:

1. Find the public IP address for your [public node](/1.12/administering-clusters/locate-public-agent/).

1. Navigate to the `http://<public-agent-IP>:9090/haproxy?stats` endpoint.

1. Review the statistics report page.

    <p>
    <img src="/1.12/img/lb2.jpg" alt="Marathon-LB HAProxy statistics">
    </p>
  
# Deploy internal load balancing
To set up Marathon-LB for internal load balancing, you must first specify some configuration options for the Marathon-LB package. The following steps illustrate how to modify a sample configuration file for **internal load balancing**.

1. Create a file called `marathon-lb-internal.json` with the following contents:

    ```
    {
      "marathon-lb":{
        "name":"marathon-lb-internal",
        "haproxy-group":"internal",
        "bind-http-https":false,
        "role":""
      }
    }
    ```

    The sample configuration file:
    * Changes the name of the app instance to `marathon-lb-internal`.
    * Sets the name of the `HAProxy` group for load balancing to `internal`.
    * Disables HTTP and HTTPS forwarding on ports 80 and 443 because it is not needed.

1. Install the internal Marathon-LB instance to use the custom options specified by running the following command:

    ``` bash
    dcos package install marathon-lb --options=marathon-lb-internal.json --yes
    ```

    There are now two Marathon-LB load balancer instances:
    * Internal (`marathon-lb-internal`)
    * External (`marathon-lb`)

# Deploy an external-facing NGINX app
The following steps illustrate how to modify a sample configuration file to use Marathon-LB to handle load balancing for an external-facing application.

1. Copy the JSON below into a file and name it `nginx-external.json`.

    ``` json
    {
      "id": "nginx-external",
      "container": {
        "type": "DOCKER",
        "portMappings": [
          { "hostPort": 0, "containerPort": 80, "servicePort": 10000 }
        ],
        "docker": {
          "image": "nginx:latest",
          "forcePullImage":true
        }
      },
      "instances": 1,
      "cpus": 0.1,
      "mem": 65,
      "networks": [ { "mode": "container/bridge" } ],
      "healthChecks": [{
          "protocol": "HTTP",
          "path": "/",
          "portIndex": 0,
          "timeoutSeconds": 10,
          "gracePeriodSeconds": 10,
          "intervalSeconds": 2,
          "maxConsecutiveFailures": 10
      }],
      "labels":{
        "HAPROXY_GROUP":"external"
      }
    }
    ```

    The sample application definition includes the `"HAPROXY_GROUP":"external"` label. The `HAPROXY_GROUP` label instructs the external Marathon-LB (`marathon-lb`) instance to expose the application because `marathon-lb` was deployed with the `--group` parameter set to the default `external` value.

1. Deploy the external NGINX app on DC/OS using this command:

    ``` bash 
    dcos marathon app add nginx-external.json
    ```

# Deploy an internal-facing NGINX app
The following steps illustrate how to modify a sample configuration file to use Marathon-LB to handle load balancing for an internal-facing application.

1. Copy the JSON below into a file and name it `nginx-internal.json`.

    ``` json
    {
      "id": "nginx-internal",
      "networks": [
        { "mode": "container/bridge" }
      ],
      "container": {
        "type": "DOCKER",
        "docker": {
          "image": "nginx:latest",
          "forcePullImage": true
        },
        "portMappings": [
          {
            "hostPort": 0,
            "containerPort": 80,
            "servicePort": 10001
          }
        ]
      },
      "instances": 1,
      "cpus": 0.1,
      "mem": 65,
      "healthChecks": [
        {
          "protocol": "HTTP",
          "path": "/",
          "portIndex": 0,
          "timeoutSeconds": 10,
          "gracePeriodSeconds": 10,
          "intervalSeconds": 2,
          "maxConsecutiveFailures": 10
        }
      ],
      "labels": {
        "HAPROXY_GROUP": "internal"
      }
    }
    ```

    This sample app definition specifies the `servicePort` parameter to expose the internal NGINX app service to Marathon-LB on port 10001. By default, ports 10000 through to 10100 are reserved for Marathon-LB services. Unless you modify the reserved port range, you should begin numbering your service ports from 10000.

1. Deploy the internal NGINX app on DC/OS using this command:

    ``` bash
    dcos marathon app add nginx-internal.json
    ```

# Deploy an external and internal facing NGINX app
The following steps illustrate how to modify a sample configuration file to do load balancing for an application that is accessible both externally from a public agent IP address and internally from within the cluster.

1. Copy the JSON below into a file and name it `nginx-everywhere.json`. 

    ``` json
    {
      "id": "nginx-everywhere",
      "networks": [
        { "mode": "container/bridge" }
      ],
      "container": {
        "type": "DOCKER",
        "docker": {
          "image": "nginx:latest",
          "forcePullImage":true
        },
        "portMappings": [
          { "hostPort": 0, "containerPort": 80, "servicePort": 10002 }
        ]
      },
      "instances": 1,
      "cpus": 0.1,
      "mem": 65,
      "healthChecks": [{
          "protocol": "HTTP",
          "path": "/",
          "portIndex": 0,
          "timeoutSeconds": 10,
          "gracePeriodSeconds": 10,
          "intervalSeconds": 2,
          "maxConsecutiveFailures": 10
      }],
      "labels":{
        "HAPROXY_GROUP":"external,internal"
      }
    }
    ```

    This sample configuration file exposes the app both internally and externally with a unique `servicePort` setting that does not overlap with the other NGINX instances. Service ports can be defined either by using `portMappings` like the examples in this tutorial, or with the `ports` parameter in the Marathon app definition.

1. Deploy the NGINX everywhere app on DC/OS using this command:

    ``` bash
    dcos marathon app add nginx-everywhere.json
    ```

# Confirm apps are deployed and accessible
You can test your load balancing configurations by opening a [secure shell (SSH)](/1.12/administering-clusters/sshcluster/) into one of the instances in the cluster (such as a master), and running `curl` for the endpoints. For example, run the following commands.

* To test access to the external load balancer, run:
  `curl http://marathon-lb.marathon.mesos:10000`

* To test access to the internal load balancer, run:
  `curl http://marathon-lb-internal.marathon.mesos:10001`

* To test access to the `nginx` app from the external load balancer, run:
  `curl http://marathon-lb.marathon.mesos:10002/`

* To test access to the `nginx` app from the internal load balancer, run:
  `curl http://marathon-lb-internal.marathon.mesos:10002/`

Each of these commands should return the NGINX ‘Welcome’ page similar to the following:

<p>
<img src="/1.12/img/lb3.jpg" alt="NGINX Welcome">
</p>

# Using virtual hosts
An important feature of Marathon-LB is support for virtual hosts (vhost). Virtual hosts enable you to route HTTP traffic for multiple hosts (FQDNs) to the correct endpoint. For example, you could have two distinct web properties, `ilovesteak.com` and `steaknow.com`, with DNS for both pointing to the same load balancer on the same port. You can use virtual host information to ensure `HAProxy` routes traffic to the correct endpoint based on the domain name.

To demonstrate how to use virtual hosts:
1. Find your public agent IP address.

1. Modify the app definition to point to the public agent DNS name. 

    You can modify your app by using the [DC/OS command-line interface](#virtual-host-cli) or [web-based console](#virtual-host-web).

1. Deploy the modified app definition to use the new configuration.

<a name="virtual-host-cli"></a>

## Modifying with app definition with the CLI
If you are working with the external NGINX app and the `nginx-external.json` app definition file, you can modify and deploy the virtual host settings for the the NGINX application using the DC/OS CLI.

1. Add the HAPROXY_0_VHOST label to your local `nginx-external.json` file. 

    In this example, the public DNS name is `brenden-j-publicsl-1ltlkzeh6b2g6-1145355943.us-west-2.elb.amazonaws.com` so you would modify the app definition to contain settings similar to this code segment:

    ```
      "labels":{
        "HAPROXY_GROUP":"external",
        "HAPROXY_0_VHOST":"brenden-j-publicsl-1ltlkzeh6b2g6-1145355943.us-west-2.elb.amazonaws.com"
      }
    }
    ```
    The app definition should not include the leading `http://` or the trailing slash (`/`) in the public DNS name.

1. Replace the contents of the deployed `nginx-external.json` with your modified local copy and deploy the modified configuration in a single step by running the following command:

    ```bash
    cat nginx-external.json | dcos marathon app update nginx-external
    ```

    You should see output similar to this:
    <pre>
    Created deployment 5f3e06ff-e077-48ee-afc0-745f167bc105
    </pre>

    Alternatively, you could deploy the modified NGINX external app definition as a separate step by running this command:<br>
    <code>dcos marathon app add nginx-external.json</code>

<a name="virtual-host-web"></a>

## Modifying with app definition with the web-based console
If you are working with the external NGINX application and the `nginx-external.json` app definition file, you can modify and deploy the virtual host settings for the the NGINX application using the DC/OS web-based console. 

1. Open a web browser and navigate to the URL for the DC/OS web-based console.

1. Click **Services**, then select the `nginx-external` service.

1. Click the vertical ellipsis menu at the far right, then select **Edit**.

1. Click **Environment**, then select **Add Label**.

1. Type `HAPROXY_0_VHOST` for the **Key** and the public agent DNS name for the **Value**.
    <p>
    <img src="/1.12/img/nginx-external-gui.png" alt="Update app">
    </p>

    * The `HAPROXY_0_VHOST` label instructs Marathon-LB to expose NGINX on the external load balancer with a virtual host.

    * The 0 in the label key corresponds to the `servicePort` index, beginning from 0. 
    
    If you have multiple `servicePort` definitions, you would iterate them as 0, 1, 2, and so on. Specifying the `servicePort` is not required, however, because Marathon assigns one by default.

1. Click **Review & Run**, then click **Run Service**.

1. Navigate to the public agent in your browser to verify that you see the NGINX welcome page.

    <p>
    <img src="/1.12/img/nginx-external-gui.png" alt="Update app">
    </p>