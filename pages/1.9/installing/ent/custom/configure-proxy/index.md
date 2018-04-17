---
layout: layout.pug
title: Configure DC/OS for Proxy
menuWeight: 900
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


By default the DC/OS [Universe](https://github.com/mesosphere/universe) repository is hosted on the internet. If your DC/OS cluster is behind a corporate proxy, you must specify your proxy configuration in the [configuration file](/1.9/installing/ent/custom/configuration/configuration-parameters/#use-proxy) file before installation. This will enable your cluster to connect to the Universe packages. 

**Important:** You should also configure an HTTP proxy for [Docker](https://docs.docker.com/engine/admin/systemd/#/http-proxy). 
