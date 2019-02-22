---
layout: layout.pug
navigationTitle: Configuring DC/OS access for Spinnaker
excerpt: How to use Spinakker with DC/OS
title: Configuring DC/OS access for Spinnaker
menuWeight: 2
model: /services/spinnaker/data.yml
render: mustache
---

This section is a quick guide on how to configure and use {{ model.techName }} with DC/OS.

# Prerequisites

* A running DC/OS 1.10 or 1.11 cluster

# Overview

DC/OS {{ model.techName }} is an automated service that makes it easy to deploy and manage [{{ model.techName }}](https://www.spinnaker.io/) on [DC/OS](https://mesosphere.com/product/).

{{ model.techName }} is an open source, multi-cloud continuous delivery platform for releasing software changes with high velocity and confidence. Created at Netflix, it has been battle-tested in production by hundreds of teams over millions of deployments. It combines a powerful and flexible pipeline management system with integrations to the major cloud providers. The {{ model.techName }} service is a micro service composition. You can read a good overview on the micro services involved  [here](https://www.spinnaker.io/reference/architecture/).

<p class="message--important"><strong>IMPORTANT: </strong>The DC/OS {{ model.techName }} service currently only works with <strong>DC/OS Enterprise</strong>.</p>


# Installing with Defaults

This section provides a quick and easy procedure for configuring and installing {{ model.techName }}. You can find different custom configurations in the [Configuration section](/services/spinnaker/0.3.0-1.9.2/configuration/) of these documents.  

## From the CLI
The `DC/OS {{ model.techName }} service` uses `minio`, an s3-compatible backing store for the {{ model.techName }} `front50` service.
1. To get started run the following two commands:
```
dcos package install marathon-lb --yes
dcos package install minio --yes
```
2.  `marathon-lb` will make the `minio` web interface accessible via the DC/OS public agent. In your browser enter the following address.
```
http://<public-agent-ip>:9000
```
The `minio` credentials are minio / minio123.

The DC/OS {{ model.techName }} service allows you to deliver to the `DC/OS cluster` the service runs itself in. The {{ model.techName }} `deck` and `gate` services will be made available via a proxy or Edge-LB running on the DC/OS cluster's public agent. **Note down the hostname/ip of the public agent `<public-agent-ip>` in your DC/OS cluster.**

## From the web interface

1. In the DC/OS catalog/universe, select {{ model.techName }}, which will show you the following package description.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/inst01.png" alt="{{ model.techName }} Quick Start"/>](/services/spinnaker/0.3.0-1.9.2/img/inst01.png)

Figure 1. {{ model.techName }} package

2. Select **Review & Run**.

3. In the service section fill in the proxy hostname with the hostname of the public agent noted down earlier.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/inst02.png" alt="{{ model.techName }} Quick Start"/>](/services/spinnaker/0.3.0-1.9.2/img/inst02.png)

Figure 2. Service section

4. If `minio` and `DC/OS` default credentials are available, then you are ready to select **Review & Run**. Otherwise the next two steps show how to configure your specific credentials.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/inst03.png" alt="{{ model.techName }} Quick Start"/>](/services/spinnaker/0.3.0-1.9.2/img/inst03.png)

Figure 3. Default credentials available

5. Configure the `minio` credentials as shown on the following screen.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/inst04.png" alt="{{ model.techName }} Quick Start"/>](/services/spinnaker/0.3.0-1.9.2/img/inst04.png)

Figure 4. `Minio` credentials

6. Configure the `DC/OS` credentials as shown on the following screen.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/inst05.png" alt="{{ model.techName }} Quick Start"/>](/services/spinnaker/0.3.0-1.9.2/img/inst05.png)

Figure 5. DC/OS credentials

7. Once the service is running, launch a simple `proxy` to get access to the {{ model.techName }} `deck` and `gate` service. Create the marathon `proxy.json` file with the following content and add the marathon app.

```
{
  "id": "spinnaker-proxy",
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "mesosphere/spinproxy2",
      "forcePullImage": true
    }
  },
  "args": [],
  "cpus": 0.1,
  "mem": 256,
  "env": {
  },
  "instances": 1,
  "constraints": [],
  "acceptedResourceRoles": [
      "slave_public"
  ]
}
```

```
dcos marathon app add proxy.json
```

7. Go to the [Using {{ model.techName }}](#using-spinnaker) section to learn how to access the {{ model.techName }} web interface, and to get an overview of the {{ model.techName }} concepts with samples.


# Using {{ model.techName }}

Go to your browser and enter the following url to get to the {{ model.techName }} user interface.

```
http://<public-agent-ip>:9001
```
