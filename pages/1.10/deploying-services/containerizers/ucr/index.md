---
layout: layout.pug
navigationTitle:  Universal Container Runtime (UCR)
title: Universal Container Runtime (UCR)
menuWeight: 10
excerpt:
preview: false
enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


The [Universal Container Runtime (UCR)](http://mesos.apache.org/documentation/latest/container-image) launches Mesos containers from binary executables and extends the Mesos container runtime to support provisioning [Docker](https://docker.com/) images. The UCR has many [advantages](/1.10/deploying-services/containerizers/) over the Docker Engine for running Docker images.  Use the Docker Engine only if you need specific [features](/1.10/deploying-services/containerizers/#container-runtime-features) of the Docker package. 

# Provision a container with the UCR from the DC/OS web interface

1. Click the **Services** tab of the DC/OS web interface, then click **RUN A SERVICE**.

1. Click **Single Container**.

1. Enter the service ID.

1. In the **CONTAINER IMAGE** field, optionally enter a container image. Otherwise, enter a command in the **COMMAND** field. 

1. Specify the UCR. Click **MORE SETTINGS**. In the **Container Runtime** section, choose the **UNIVERSAL CONTAINER RUNTIME (UCR)** radio button.

1. Click **REVIEW & RUN** and **RUN SERVICE**.


# Provision a container with the UCR from the DC/OS CLI

1. In your [Marathon application definition](/1.10/deploying-services/creating-services/#deploying-a-simple-docker-based-application-with-the-rest-api), set the `container.type` parameter to `MESOS`. Here, we specify a Docker container with the `docker` object. The UCR provides an optional `pullConfig` parameter to enable you to [authenticate to a private Docker registry](/1.10/deploying-services/private-docker-registry/).

```json
{
  "id": "/nginx-bridge",
  "container": {
    "portMappings": [
      {
        "containerPort": 80,
        "hostPort": 0,
        "labels": {
          "VIP_0": "/nginx2:1024"
        },
        "protocol": "tcp",
        "servicePort": 10000,
        "name": "webport"
      }
    ],
    "type": "MESOS",
    "volumes": [],
    "docker": {
        "image": "nginx",
        "forcePullImage": false,
        "pullConfig": {
            "secret": "pullConfigSecret"
        },
        "parameters": []
        }
    },
    "secrets": {
      "pullConfigSecret": {
        "source": "/mesos-docker/pullConfig"
    }
  },
  "args":[
  "<my-arg>"
  ],
  "cpus": 0.5,
  "disk": 0,
  "instances": 1,
  "mem": 128,
  "networks": [
    {
    "mode": "container/bridge"
    }
  ],
  "requirePorts": false
}
```

**Important:** If you leave the `args` field empty, the default entry point will be the launch command for the container. If your container does not have a default entry point, you must specify a command in the `args` field. If you do not, your service will fail to deploy.

# Limitations
1. The UCR does not support the following: runtime privileges, Docker options, private registries with container authentication.
2. Image garbage collection is not supported and requires the Docker disk file cleaned up at all agent nodes.
3. Image Pull Secrets for Accessing Private Registry requires base64-encoded credentials: [ https://docs.mesosphere.com/1.10/deploying-services/private-docker-registry]( https://docs.mesosphere.com/1.10/deploying-services/private-docker-registry).

# Further Reading
- [View the Mesos docs for UCR](http://mesos.apache.org/documentation/latest/container-image/).
