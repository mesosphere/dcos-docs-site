---
layout: layout.pug
title: Developing DC/OS Services
menuWeight: 160
excerpt: Developing your own DC/OS components
render: mustache
model: /1.13/data.yml
enterprise: false
---


This section describes the developer-specific DC/OS components, explaining what is necessary to package and provide your own service on DC/OS. 

The Mesosphere Distributed Cloud Operating System (DC/OS) provides the optimal user experience possible for orchestrating and managing a datacenter. If you are an Apache Mesos developer, you are already familiar with developing a framework. DC/OS extends Apache Mesos by including a web interface for health checks and monitoring, a command-line, a service packaging description, and a [repository](/1.13/administering-clusters/repo/) that catalogs those packages.

# <a name="universe"></a>Package Repositories

The DC/OS {{ model.packageRepo }} contains all of the services that are installable on DC/OS. For more information on DC/OS {{ model.packageRepo }}, see the [GitHub {{ model.packageRepo }} repository](https://github.com/mesosphere/universe). Our general recommendation is to use the DC/OS CLI rather than the DC/OS web interface throughout the process of creating a package for the {{ model.packageRepo }}.

All packaged services are required to meet a certain standard as defined by Mesosphere. For details on submitting a DC/OS service, see [Getting Started with {{ model.packageRepo }}](https://github.com/mesosphere/universe/blob/version-3.x/docs/tutorial/GetStarted.md).

# DC/OS service structure

Each DC/OS service in the {{ model.packageRepo }} repo is comprised of JSON configuration files. These files are used create the packages that are installed on DC/OS.

| Filename               | Description                                                                                              | Required |
|------------------------|----------------------------------------------------------------------------------------------------------|----------|
| `config.json`            | Specifies the supported configuration properties, represented as a JSON-schema.                          | No       |
| `marathon.json.mustache` | Specifies a Mustache template that creates a Marathon app definition capable of running your service.    | No       |
| `package.json`           | Specifies the high level metadata about the package.                                                     | Yes      |
| `resource.json`          | Specifies all of the required externally hosted resources (e.g. Docker images, HTTP objects and images). | No       |

For more information, see [Getting Started with {{ model.packageRepo }}](https://github.com/mesosphere/universe/blob/version-3.x/docs/tutorial/GetStarted.md).
