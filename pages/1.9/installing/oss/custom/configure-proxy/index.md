---
layout: layout.pug
excerpt:
title: Configure DC/OS for Proxy
navigationTitle: Configure Proxy
menuWeight: 900
---

By default the DC/OS [Universe](https://github.com/mesosphere/universe) repository is hosted on the internet. If your DC/OS cluster is behind a corporate proxy, you must specify your proxy configuration in the [configuration file](/1.9/installing/oss/custom/configuration/configuration-parameters/#use-proxy) file before installation. This will enable your cluster to connect to the Universe packages. 

**Important:** You should also configure an HTTP proxy for [Docker](https://docs.docker.com/engine/admin/systemd/#/http-proxy). 
