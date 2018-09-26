---
layout: layout.pug
title: Configure DC/OS for Proxy
menuWeight: 10
excerpt: Using a corporate proxy to configure DC/OS
---


By default, the DC/OS [Universe](https://github.com/mesosphere/universe) repository is hosted on the internet. If your DC/OS cluster is behind a corporate proxy, you must specify your proxy configuration in the [configuration file](/1.12/installing/production/advanced-configuration/configuration-reference/#use-proxy) file before installation. This will enable your cluster to connect to the Universe packages.

<p class="message--note"><strong>NOTE: </strong>You should also configure an HTTP proxy for <a href="https://docs.docker.com/engine/admin/systemd/#/http-proxy">Docker</a>.</p>
