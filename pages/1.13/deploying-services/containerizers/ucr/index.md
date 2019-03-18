---
layout: layout.pug
navigationTitle:  Universal Container Runtime (UCR)
title: Universal Container Runtime (UCR)
menuWeight: 10
excerpt: Launching Mesos containers using the Universal Container Runtime 
enterprise: false
---

# Provision a Mesos container using UCR

The [Universal Container Runtime (UCR)](http://mesos.apache.org/documentation/latest/container-image) launches Mesos containers from binary executables and extends the Mesos container runtime to support provisioning [Docker](https://docker.com/) images. The UCR has many [advantages](/1.13/deploying-services/containerizers/) over the Docker Engine for running Docker images. Use the Docker Engine only if you need specific [features](/1.13/deploying-services/containerizers/#container-runtime-features) of the Docker package.

# DC/OS web interface
Use this procedure to provision a container with the UCR from the DC/OS web interface.

1. Click the **Services** tab of the DC/OS web interface, then click **RUN A SERVICE**.

1. Click **Single Container**.

1. Enter the service ID.

1. In the **CONTAINER IMAGE** field, optionally enter a container image. Otherwise, enter a command in the **COMMAND** field.

1. Specify the UCR. Click **MORE SETTINGS**. In the **Container Runtime** section, choose the **UNIVERSAL CONTAINER RUNTIME (UCR)** radio button.

1. Click **REVIEW & RUN** and **RUN SERVICE**.


# DC/OS CLI
Use this procedure to provision a container with the UCR from the DC/OS command line.

1. In your [Marathon application definition](/1.13/deploying-services/creating-services/#deploying-a-simple-docker-based-application-with-the-rest-api), set the `container.type` parameter to `MESOS`. Here, we specify a Docker container with the `docker` object. The UCR provides an optional `pullConfig` parameter to enable you to [authenticate to a private Docker registry](/1.13/deploying-services/private-docker-registry/).

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

<table class=“table” bgcolor=#858585>
<tr> 
  <td align=justify style=color:white><strong>Important:</strong> If you leave the "args" field empty, the default entry point will be the launch command for the container. If your container does not have a default entry point, you must specify a command in the "args" field. If you do not, your service will fail to deploy.</td> 
</tr> 
</table>

# Container Image Garbage Collection

For a long running cluster, container images may occupy disk spaces on the agent machines. To improve the operator's experience with UCR, container image GC is introduced, starting from Mesos 1.5.0 (please read [the Mesos docs](http://mesos.apache.org/documentation/latest/container-image/#garbage-collect-unused-container-images) for more details). The image GC is automatic by default in DC/OS while it can be triggered by the operator manually.

## [Automatic Image GC](http://mesos.apache.org/documentation/latest/container-image/#automatic-image-gc-through-agent-flag)

Container Image Auto GC is enabled by default, configured by an image GC config file. This config file can be updated via the `MESOS_IMAGE_GC_CONFIG` environment variable at `/opt/mesosphere/etc/mesos-slave-common`. The default config file is located at `/opt/mesosphere/etc/mesos-slave-image-gc-config.json`, and the following are the parameters of the config file:

- `image_disk_headroom`: The image disk headroom used to calculate the threshold of container image store size. Image garbage collection will be triggered automatically if the image disk usage reaches that threshold. Please note that the headroom value has to be between 0.0 and 1.0. (defaults to be 0.1, which represents 90% disk usage as the threshold)
- `image_disk_watch_interval`: The periodic time interval to check the image store disk usage. Please note that the unit of this time interval is 'nanosecond'. (defaults to be 300000000000, which represents the disk check every 5 minutes)
- `excluded_images`: The excluded image list that should not be garbage collected. (defaults to be an empty list)

## [Manual Image GC](http://mesos.apache.org/documentation/latest/container-image/#manual-image-gc-through-http-api)

Container Image Manual GC can be triggered via the HTTP Operator API. Please see `PRUNE_IMAGES` section in the [v1 Operator API doc](http://mesos.apache.org/documentation/latest/operator-http-api/#prune_images) for more details.

# Further Reading
- [View the Mesos docs for the UCR](http://mesos.apache.org/documentation/latest/container-image/).
