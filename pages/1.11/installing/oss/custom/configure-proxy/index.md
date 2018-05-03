---
layout: layout.pug
excerpt: Configuring DC/OS by proxy
title: Configuring DC/OS by Proxy
navigationTitle: Configure Proxy
menuWeight: 900
---
<!-- The source repo for this topic is https://github.com/dcos/dcos-docs-site -->


By default the DC/OS [Universe](https://github.com/mesosphere/universe) repository is hosted on the internet. If your DC/OS cluster is behind a corporate proxy, you must specify your proxy configuration in the [configuration file](/1.11/installing/oss/custom/configuration/configuration-parameters/#use-proxy) file before installation. This will enable your cluster to connect to the Universe packages.

**Important:** You should also configure an HTTP proxy for [Docker](https://docs.docker.com/engine/admin/systemd/#/http-proxy).
