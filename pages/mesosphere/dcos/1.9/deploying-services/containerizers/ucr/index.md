---
layout: layout.pug
navigationTitle:  Universal Container Runtime (UCR)
title: Universal Container Runtime (UCR)
menuWeight: 10
excerpt:
preview: true
enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


The [Universal Container Runtime](http://mesos.apache.org/documentation/latest/container-image)(UCR) extends the Mesos containerizer to support provisioning [Docker](https://docker.com/) container images ([AppC](https://github.com/appc/spec) coming soon). This means that you can use both the Mesos containerizer and other container image types in DC/OS. You can still use the Docker container runtime directly with DC/OS, but the Universal Container Runtime supports running Docker images without depending on the Docker Engine, which allows for better integration with Mesos.

The Universal Container Runtime offers the following advantages:

* **Removes your dependency on the Docker daemon**: With previous versions of Docker, if the Docker daemon was not responsive, a restart to the daemon caused all containers to stop on the host. In addition, Docker must be installed on each of your agent nodes to use the Docker containerizer. This means that to use the Docker containerizer you need to upgrade Docker on the agent nodes each time a new version of Docker comes out.
* The UCR is more stable and allows deployment at scale.
* The UCR offers features not available in the Docker containerizer, such as GPU and CNI support.
* The UCR allows you to take advantage of continuing innovation within both the Mesos and DC/OS, including features such as IP per container, strict container isolation, and more.

# Provision Containers with the Universal Container Runtime from the DC/OS Web Interface

## Prerequisite
If your service [pulls Docker images from a private registry](/mesosphere/dcos/1.9/deploying-services/private-docker-registry/), you must specify the [`cluster_docker_credentials_path` in your `config.yaml`](/mesosphere/dcos/1.9/installing/oss/custom/configuration/configuration-parameters/#cluster-docker-credentials) file before installing DC/OS.

1. Specify the UCR from the web interface. Go to **Services**  > **Run a Service** > **Single Container** > **More Settings**. In the **Container Runtime** section, choose the **Universal Container Runtime** radio button.

1. In the **Container Image** field, enter your container image.

# Provision Containers with the Universal Container Runtime from the DC/OS CLI

## Prerequisite
If your service [pulls Docker images from a private registry](/mesosphere/dcos/1.9/deploying-services/private-docker-registry/), you must specify the [`cluster_docker_credentials_path` in your `config.yaml`](/mesosphere/dcos/1.9/installing/oss/custom/configuration/configuration-parameters/#cluster-docker-credentials) file before installing DC/OS.

1. Specify the container type `MESOS` and a the appropriate object in your [Marathon application definition](/mesosphere/dcos/1.9/deploying-services/creating-services/). Here, we specify a Docker container with the `docker` object.

The Mesos containerizer provides a `credential` with a `principal` and an optional `secret` field to authenticate when downloading the Docker image.

```json
{  
   "id":"mesos-docker",
   "container":{  
      "docker":{  
         "image":"mesosphere/inky",
         "credential":{  
            "principal":"<my-principal>",
            "secret":"<my-secret>"
         }
      },
      "type":"MESOS"
   },
   "args":[  
      "<my-arg>"
   ],
   "cpus":0.2,
   "mem":16.0,
   "instances":1
}
```

**Important:** If you leave the `args` field empty, the default entry point will be the launch command for the container. If your container does not have a default entry point, you must specify a command in the `args` field. If you do not, your service will fail to deploy.

# Limitations
- The UCR is a <a href="/mesosphere/dcos/1.9/overview/feature-maturity/">preview</a> feature in DC/OS 1.9.
- The UCR does not support the following: runtime privileges, Docker options, force pull, named ports, numbered ports, bridge networking, port mapping, private registries with container authentication.

# Further Reading
- [View the Mesos docs for the UCR](http://mesos.apache.org/documentation/latest/container-image/).
