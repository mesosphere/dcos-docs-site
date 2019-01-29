---
layout: layout.pug
navigationTitle:  Tutorial - Basic external load balancing
title: Tutorial - External load balancing for a sample app  
menuWeight: 25
excerpt: How to use an external group for accessing a containerized service through Marathon-LB
enterprise: false
---
This tutorial guides you through the steps for configuring Marathon-LB to run a containerized DC/OS service with external load balancing for a website. After completing this tutorial, you will have hands-on practice configuring load balancing for a sample application.

In this tutorial, you will:
* Download a Docker image that contains NGINX as a sample app.
* Prepare load balancing for the NGINX application on the `dcos.io` website.
* Install Marathon-LB as the edge load balancer for the service.
* Run Marathon-LB on a public-facing node to route inbound network traffic.

# Before you begin
* You must have a DC/OS cluster with a bootstrap node, at least one master node, at least one private agent node, and at least one public agent node.
* You must have an account with access to the DC/OS web-based administrative console or DC/OS command-line interface.
* You must have Marathon-LB installed.

# Download the app definition and container
This tutorial uses a sample app definition file that you can download from the `dcos-website` GitHub repository.

1. Copy [`dcos-website/dcos-website.json`](https://github.com/dcos/dcos-website/blob/develop/dcos-website.json) from the `dcos-website` GitHub repository.

1. Go to the [`mesosphere/dcos-website`](https://hub.docker.com/r/mesosphere/dcos-website/tags) Docker repository and copy the latest `image` tag.

  <p>
  <img src="/1.12/img/dockerhub.png" alt="Mesosphere Docker Hub">
  </p>

  For example, after clicking **Tags**, you might see an identifier similar to this:
  <code>cff383e4f5a51bf04e2d0177c5023e7cebcab3cc</code> 

  <p>
  <img src="/services/img/docker-repo-tag.png" alt="Sample image tag">
  </p>

# Modify the app image tag and public IP address

1. Open the `dcos-website.json` app definition file you downloaded from the repository.

1. Add the `image-tag` in the `docker:image` field with the Docker image tag.

    For example:

    ```json
    {
      "id": "dcos-website",
      "container": {
        "type": "DOCKER",
        "docker": {
          "image": "mesosphere/dcos-website:cff383e4f5a51bf04e2d0177c5023e7cebcab3cc",
          "network": "BRIDGE",
          "portMappings": [
            { "hostPort": 0, "containerPort": 80, "servicePort": 10004 }
          ]
        }
      },
    ```

1. Identify the public-facing IP address for your public agent node. 

    For information about how to find your public agent IP address, see [Finding a public agent IP](https://docs.mesosphere.com/1.12/administering-clusters/locate-public-agent/).

1. In the `labels` field, add an entry for `HAPROXY_0_VHOST` and assign it the value of your public agent IP. 

    For example, if the public agent node IP address is 64.172.103.2, you might add lines similar to the following:

    ```
    "labels":{
            "HAPROXY_DEPLOYMENT_GROUP":"dcos-website",
            "HAPROXY_DEPLOYMENT_ALT_PORT":"10005",
            "HAPROXY_GROUP":"external",
            "HAPROXY_0_REDIRECT_TO_HTTPS":"true",
            "HAPROXY_0_VHOST": "64.172.103.2"
          }
    ```

    Be sure to remove the leading `http://` and the trailing slash () from the IP address, and to add a comma after the preceding field.

    The complete JSON app definition file should resemble the following:

    ```json
      {
        "id": "dcos-website",
        "container": {
          "type": "DOCKER",
          "portMappings": [
            { "hostPort": 0, "containerPort": 80, "servicePort": 10004 }
          ],
          "docker": {
            "image": "mesosphere/dcos-website:cff383e4f5a51bf04e2d0177c5023e7cebcab3cc"
          }
        },
        "instances": 3,
        "cpus": 0.25,
        "mem": 100,
        "network": "BRIDGE",
        "healthChecks": [{
            "protocol": "HTTP",
            "path": "/",
            "portIndex": 0,
            "timeoutSeconds": 2,
            "gracePeriodSeconds": 15,
            "intervalSeconds": 3,
            "maxConsecutiveFailures": 2
        }],
        "labels":{
          "HAPROXY_DEPLOYMENT_GROUP":"dcos-website",
          "HAPROXY_DEPLOYMENT_ALT_PORT":"10005",
          "HAPROXY_GROUP":"external",
          "HAPROXY_0_REDIRECT_TO_HTTPS":"true",
          "HAPROXY_0_VHOST": "64.172.103.2"
        }
      }
    ```

  Only apps with the label `HAPROXY_GROUP=external` will be exposed using this Marathon-LB configuration.

# Add the load-balanced application and check its status 
1. Run the service from the DC/OS CLI using the following command:

    ``` bash
    dcos marathon app add dcos-website.json
    ```

1. Open the DC/OS web-based console URL in a browser, then click **Services** to verify that your application is deployed and running.

    <p>
    <img src="/1.12/img/healthy-dcos-website.png" alt="Healthy service">
    </p>

1. In the web browser, navigate to the IP address for your public agent node to verify the site you have deployed is running.
