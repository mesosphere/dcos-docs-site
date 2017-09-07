---
layout: layout.pug
title: Using Containerizers
menuWeight: 40
excerpt: ""
featureMaturity: ""
enterprise: 'no'
navigationTitle:  Using Containerizers
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


A containerizer is a Mesos agent component responsible for launching containers, within which you can run a service. Running services in containers offers a number of benefits, including the ability to isolate tasks from one another and control task resources programmatically.

DC/OS supports the following Mesos containerizer types:

- The [DC/OS Universal Container Runtime](/docs/1.10/deploying-services/containerizers/ucr/).

- The [Docker containerizer](/docs/1.10/deploying-services/containerizers/docker-containerizer/).

The tables below provide a feature comparison of your containerizer choices on DC/OS.

## DC/OS Features

| Feature																	| Docker			| UCR 			| Comments |
navigationTitle:  Using Containerizers
| --------------------------------------- | ----------- | --------- | -------- |
| **Command**                             | Yes         | Yes       |          |
| **Container Images** 										| Yes					| Yes				|					 |
| **Pods**																| No					| Yes				|					 |
| **GPUs**																| No					| Yes				|					 |
| **URIs**																| Yes					| Yes				|					 |
| **Docker Options**											| Yes					| No				|					 |
| **Force Pull**													| Yes					| Yes				|	CLI only |
| **Secrets**															| Yes					| Yes				| Enterprise DC/OS only |
| **Debugging with exec**         				| No					| Yes				|	CLI only |
| **All Security Modes**									| Yes					| Yes				| Enterprise DC/OS only |

## Container Backend

|	Feature																	|	Docker			|	UCR			  |
navigationTitle:  Using Containerizers
| --------------------------------------- | ----------- | --------- |
| **Overlayfs**                           | Yes         | Yes       |
| **Aufs**                                | Yes         | Yes       |
| **Bind**                                | N/A         | Yes       |

## Storage

|	Feature																	|	Docker			|	UCR				| Comments  |
navigationTitle:  Using Containerizers
| --------------------------------------- | ----------- | --------- | --------- |
| **Local Persistent Volumes**						| Yes					| Yes				|						|
| **Host Volumes**												| Yes					| Yes				| CLI only  |
| **External Volumes**                    | Yes         | Yes       |           |

## Service Endpoints

|	Feature																	|	Docker			|	UCR				|
navigationTitle:  Using Containerizers
| --------------------------------------- | ----------- | --------- |
| **Named Ports**													| Yes					| Yes				|
| **Numbered Ports**											| Yes					| Yes				|

## Networking

|	Feature																	|	Docker			|	UCR				|Comments   |
navigationTitle:  Using Containerizers
| --------------------------------------- | ----------- | --------- | --------- |
| **Host Networking**       							| Yes					| Yes				|						|
| **Bridge Networking**       						| Yes					| No				|						|
| **CNI**         												| N/A					| Yes				|						|
| **CNM**                    							| Yes					| N/A				| Docker 1.11+ |
| **L4lB**        												| Yes					| Yes				|	Requires defined service endpoints. TCP health checks do not work with L4LB |

## Private Registry

|	Feature													|	Docker			|	UCR				|
navigationTitle:  Using Containerizers
| ------------------------------- | ----------- | --------- |
| **Token-based Container Auth**	| Yes					| No				|
| **Token-based Cluster Auth**		| Yes					| Yes				|
| **Basic Container Auth**        | Yes         | No        |
| **Basic Cluster Auth**          | Yes         | Yes       |

## Health Checks

|	Feature																	|	Docker			|	UCR				|Comments   |
navigationTitle:  Using Containerizers
| --------------------------------------- | ----------- | --------- | --------- |
| **TCP**													        | Yes					| Yes				|	CLI only	|
| **HTTP/HTTPS**                          | Yes         | Yes       | CLI only  |
| **Command**                             | Yes         | Yes       |           |
| **Local TCP**                           | Yes         | Yes       | CLI only  |
| **Local HTTP/HTTPS**                    | Yes         | Yes       |           |
