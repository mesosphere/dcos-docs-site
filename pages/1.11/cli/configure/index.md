---
layout: layout.pug
navigationTitle:  Configuring the CLI
title: Configuring the CLI
menuWeight: 2
excerpt: How to configure the command line interface

enterprise: false
---


You can access DC/OS CLI configuration with the [dcos cluster](/1.11/cli/command-reference/dcos-cluster/) and [dcos config](/1.11/cli/command-reference/dcos-config/) command groups.


# Configuring HTTP proxy

If you use a proxy server to connect to the internet, you can configure the CLI to use your proxy server.

**Prerequisites**

*   pip version 7.1.0 or greater.
*   The `http_proxy` and `https_proxy` environment variables are defined to use pip.

To configure a proxy for the CLI:

*   From the CLI terminal, define the environment variables `http_proxy` and `https_proxy`:

        export http_proxy=’http://<user>:<pass>@<proxy_host>:<http_proxy_port>’
        export https_proxy=’https://<user>:<pass>@<proxy_host>:<https_proxy_port>’


*   Define `no_proxy` for domains that you don’t want to use the proxy for:

        export no_proxy=".mesos,.thisdcos.directory,.dcos.directory,.zk,127.0.0.1,localhost,foo.bar.com,.baz.com”
