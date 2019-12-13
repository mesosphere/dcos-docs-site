---
layout: layout.pug
navigationTitle:  Configuring the CLI
title: Configuring the CLI
menuWeight: 2
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


You can access DC/OS CLI configuration with this command:

    dcos config show
    
You should see this output:
    
    core.dcos_url=http://dcos.example.com
    core.email=jdoe@example.com
    core.reporting=False
    core.ssl_verify=false
    core.timeout=5
    

This configuration is stored in the `~/.dcos/dcos.toml` configuration file.

# Configuring the DC/OS URL

If you are using multiple DC/OS installations (e.g. dev, test, prod), you might have to reconfigure the CLI to point to a new cluster. This can be done by changing the value of the `dcos_url` configuration field.

*   View the current value of `dcos_url` with this command:
    
        dcos config show core.dcos_url
        http://example.com
        

*   Update the value of `dcos_url` with this command:
    
        dcos config set core.dcos_url http://example.com
        
    
    Subsequent commands will now be issued to the updated URL.

# Configuring HTTP Proxy

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
