---
layout: layout.pug
navigationTitle:  Docker Engine
title: Docker Engine
menuWeight: 20
excerpt: Launching Docker containers from Docker images
render: mustache
model: /mesosphere/dcos/2.0/data.yml
enterprise: false
---

[Docker Engine](https://www.docker.com/products/docker-engine) launches Docker containers from Docker images. Use the Docker Engine if you need the [features](/mesosphere/dcos/2.0/deploying-services/containerizers/#container-runtime-features) of the Docker Engine. 

If you aren't using features that are specific to the Docker engine, you should consider using the DC/OS [Universal Container Runtime](/mesosphere/dcos/2.0/deploying-services/containerizers/ucr/). The DC/OS [Universal Container Runtime](/mesosphere/dcos/2.0/deploying-services/containerizers/ucr/) provides features such as support for GPU resources that are not available for Docker containers.

# Provision a container with the Docker Engine

* The default entry point is the launch command for the container. If the entry point accepts arguments, you can specify them in the `args` field of the Marathon app definition. If there is no default entry point, you must specify a command in the `cmd` field. It is invalid to supply both `cmd` and `args` for the same app.
* When you run a Docker image in the Docker Engine, the underlying Docker log files are not truncated or rotated. These files can become arbitrarily large (and often go to a system disk rather than a storage disk). This can cause a server with limited disk space to run out of disk space. Mesosphere recommends that you disable Docker logging if you are using Docker Engine. To do this, set the `log-driver` parameter to `none` in the `containers.docker.parameters` field of your app definition. If you are provisioning the container using the DC/OS UI:
  1. Click the **JSON EDITOR** toggle button.

     ![json editor](/mesosphere/dcos/2.0/img/json-editor-toggle.png)

     Figure 1. JSON Editor toggle button

  1. Enter the `parameters` field in the JSON configuration.


## DC/OS UI

1. Click the **Services** tab of the DC/OS UI, then click **RUN A SERVICE**.

1. Click **Single Container**.

1. Enter the service ID.

1. In the **CONTAINER IMAGE** field, enter a container image.

1. Click **MORE SETTINGS**. In the **Container Runtime** section, choose the **DOCKER ENGINE** radio button.

1. Click **REVIEW & RUN** and **RUN SERVICE**.

## DC/OS CLI

In your [Marathon application definition](/mesosphere/dcos/2.0/deploying-services/creating-services/#deploying-a-simple-docker-based-application-with-the-rest-api), set the `container.type` parameter to `DOCKER`.

```json
{  
   "id":"<my-service>",
   "container":{  
      "type":"DOCKER",
      "docker":{
         "image":"<my-image>",
         "parameters": [
           {
             "key": "log-driver",
             "value": "none"
           }
         ]
      }
   },
   "args":[  
      "<my-arg>"
   ]
}
```

For examples, see [Deploying a Docker-based Service](/mesosphere/dcos/2.0/deploying-services/creating-services/deploy-docker-app/).

# Further Reading

- [View the Mesos docs for the Docker containerizer](http://mesos.apache.org/documentation/latest/docker-containerizer/).
