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
https_proxy: https://<proxy-address>:<proxy-port>
```

If this is however problematic and you cannot deploy any UCR based applications, please check the `stderr` log of the application you're trying to provision (e.g. Elastic) and see if the following error is occurring:

```
E0704 HH:MM:SS.MS 18419 fetcher.cpp:600] EXIT with status 1: Failed to fetch 'https://downloads.mesosphere.com/<package-name>/assets/<version>/<filename>.zip': Error downloading resource: SSL connect error
Failed to synchronize with agent (it's probably exited)
```

If this is the case you can run the following test to see if you will need to make some changes.

**1.)** Log into a cluster node and run `dcos-shell`.
**2.)** Run a `curl -v <download-file-that-is-failing>.zip`
**3.)** If you're getting the following error, it means that you are experiencing issues with the current limitations of the internal `curl` version and the proxy you are using:

`curl: (35) error:140770FC:SSL routines:SSL23_GET_SERVER_HELLO:unknown protocol`

**4.)** To see if a configuration change will actually work around this situation you can run the following when still inside `dcos-shell`: `https_proxy=http://<proxy-address>:<http-proxy-port>`
**5.)** Then, re-run the `curl` command from step **2**.
**6.)** If this succeeds and you can access/retrieve the file manually, a configuration change will need to be made to the clusters `config.yaml` where you need to specify the following:

```
http_proxy: http://<proxy-address>:<proxy-port>
https_proxy: http://<proxy-address>:<proxy-port>
```

This configuration change can then be applied by running our suggested upgrade/configuration change procedure.

