---
layout: layout.pug
title: Configure DC/OS for Proxy
menuWeight: 10
excerpt: Using a corporate proxy to configure DC/OS
---


By default, the DC/OS [Universe](https://github.com/mesosphere/universe) repository is hosted on the internet. If your DC/OS cluster is behind a corporate proxy, you must specify your proxy configuration in the [configuration file](/1.11/installing/production/advanced-configuration/configuration-reference/#use-proxy) file before installation. This will enable your cluster to connect to the Universe packages.

**Note:** You should also configure an HTTP proxy for [Docker](https://docs.docker.com/engine/admin/systemd/#/http-proxy).
