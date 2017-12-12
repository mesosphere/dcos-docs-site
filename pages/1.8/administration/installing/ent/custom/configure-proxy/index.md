---
layout: layout.pug
title: Configure DC/OS for Proxy
menuWeight: 900
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


The DC/OS [Universe](https://github.com/mesosphere/universe) repository is hosted on the internet by default. You can also deploy the Universe [offline](/1.8/administration/installing/ent/deploying-a-local-dcos-universe/). If your DC/OS cluster is behind a corporate proxy, you must specify your proxy configuration in the [configuration file](/1.8/administration/installing/ent/custom/configuration-parameters/#use_proxy) file before installation. This will enable your cluster to connect to the Universe packages. 

**Important:** You should also configure an HTTP proxy for [Docker](https://docs.docker.com/engine/admin/systemd/#/http-proxy). 
