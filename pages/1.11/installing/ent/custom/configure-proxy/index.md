---
layout: layout.pug
title: Configure DC/OS for Proxy
menuWeight: 900
excerpt: Using a corporate proxy to configure DC/OS

enterprise: false
---


By default the DC/OS [Universe](https://github.com/mesosphere/universe) repository is hosted on the internet. If your DC/OS cluster is behind a corporate proxy, you must specify your proxy configuration in the [configuration file](/1.11/installing/ent/custom/configuration/configuration-parameters/#use-proxy) file before installation. This will enable your cluster to connect to the Universe packages.

**Important:** You should also configure an HTTP proxy for [Docker](https://docs.docker.com/engine/admin/systemd/#/http-proxy).

When you configure DC/OS to configure a proxy during the installation process by adding the needed information to the `config.yaml` you should be mindful of using the following syntax when specifying the `http` and `https` proxy addresses:

```
http_proxy: http://<proxy-address>:<proxy-port>
https_proxy: http://<proxy-address>:<proxy-port>
```
