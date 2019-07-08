---
layout: layout.pug
navigationTitle:  Using Containerizers
title: Using Containerizers
menuWeight: 40
excerpt: Using containerizers with Docker Engine and Universal Container Runtime
render: mustache
model: /1.14/data.yml
enterprise: false
---

A containerizer provides a containerization and resource isolation abstraction around a specific container runtime. DC/OS containerizers support the following container runtimes:

- [Universal Container Runtime](/1.14/deploying-services/containerizers/ucr/).
- [Docker Engine](/1.14/deploying-services/containerizers/docker-containerizer/).

The advantages of Universal Container Runtime (UCR) are:

* Removes your dependency on the Docker Engine. If the Docker Engine is not responsive, restarting the Engine causes all containers on the host to stop. In addition, Docker must be installed on each of your agent nodes and you must upgrade Docker on the agent nodes each time a new version of Docker is released.
* Is more stable and allows deployment at scale
* Offers features not available in the Docker Engine, such as GPU and CNI support
* Allows you to take advantage of continuing innovation within both the Mesos and DC/OS, including features such as IP per container, strict container isolation, and more. Refer to the [features matrix](#container-runtime-features) for  additional information.
* Supports collection of container image garbage either automatically or manually

In summary, using the UCR instead of the Docker Engine:

- Reduces service downtime
- Improves on-the-fly upgradability
- Increases cluster stability

# Container Runtime Features

The tables below list the features available with each of the supported container runtimes, which products support the features, and where the feature can be configured.

## DC/OS Features

| Feature                                 | UCR         | Docker    | Comments |
| --------------------------------------- | ----------- | --------- | -------- |
| **Command**                             | Yes         | Yes       |          |
| **Container Images**                    | Yes         | Yes       |          |
| **Image Garbage Collection**            | Yes         | Yes       |          |
| **Pods**                                | Yes         | No        |          |
| **GPUs**                                | Yes         | No        |          |
| **URIs**                                | Yes         | Yes       |          |
| **Docker Options**                      | No          | Yes       |          |
| **Force Pull**                          | Yes         | Yes       |          |
| **Secrets**                             | Yes         | Yes       | DC/OS Enterprise only |
| **File-based Secrets**                  | Yes         | No        | DC/OS Enterprise only |
| **Debugging with exec**                 | Yes         | No        | CLI only |
| **All Security Modes**                  | Yes         | Yes       | DC/OS Enterprise only |

## Container Backend

|  Feature                                | UCR         | Docker    |
| --------------------------------------- | ----------- | --------- |
| **OverlayFS**                           | Yes         | Yes       |
| **Aufs**                                | Yes         | Yes       |
| **Bind**                                | Yes         | N/A       |

## Storage

|  Feature                                | UCR         | Docker    | Comments  |
| --------------------------------------- | ----------- | --------- | --------- |
| **Local Persistent Volumes**            | Yes         | Yes       |           |
| **Host Volumes**                        | Yes         | Yes       | CLI only  |
| **External Volumes**                    | Yes         | Yes       |           |

## Service Endpoints

|  Feature                                | UCR         | Docker    |
| --------------------------------------- | ----------- | --------- |
| **Named Ports**                         | Yes         | Yes       |
| **Numbered Ports**                      | Yes         | Yes       |

## Networking

|  Feature                                | UCR         | Docker    | Comments  |
| --------------------------------------- | ----------- | --------- | --------- |
| **Host Networking**                     | Yes         | Yes       |           |
| **Bridge Networking**                   | Yes         | Yes       |           |
| **CNI**                                 | Yes         | N/A       |           |
| **CNM**                                 | N/A         | Yes       | Docker 1.11+ |
| **L4LB**                                | Yes         | Yes       | Requires defined service endpoints. TCP health checks do not work with L4LB. |

## Private Registry

|  Feature                                | UCR         | Docker    |
| --------------------------------------- | ----------- | --------- |
| **Token-based Container Auth**          | No          | Yes       |
| **Token-based Cluster Auth**            | Yes         | Yes       |
| **Basic Container Auth**                | No          | Yes       |
| **Basic Cluster Auth**                  | Yes         | Yes       |

## Health Checks

|  Feature                                | UCR         | Docker    |Comments   |
| --------------------------------------- | ----------- | --------- | --------- |
| **TCP**                                 | Yes         | Yes       | CLI only  |
| **HTTP/HTTPS**                          | Yes         | Yes       | CLI only  |
| **Command**                             | Yes         | Yes       |           |
| **Local TCP**                           | Yes         | Yes       | CLI only  |
| **Local HTTP/HTTPS**                    | Yes         | Yes       |           |
