---
layout: layout.pug
title: Configure DC/OS for Proxy
menuWeight: 9
excerpt:

enterprise: true
---




By default the DC/OS [Universe](https://github.com/mesosphere/universe) repository is hosted on the internet. If your DC/OS cluster is behind a corporate proxy, you must update your configuration post-installation to fetch the Universe packages. 

## Configure DC/OS Master node

1.  Create `/var/lib/dcos/` directory if it doesn't exist and add the following variables in the file `/var/lib/dcos/environment.proxy`:

    ```
    http_proxy=http://<user>:<pass>@<proxy_host>:<http_proxy_port>
    https_proxy=https://<user>:<pass>@<proxy_host>:<https_proxy_port>
    no_proxy=".mesos,.thisdcos.directory,.dcos.directory,.zk,127.0.0.1,localhost"
    ```
    
    If you are not sure about the values for `http_proxy` and `https_proxy` variables for your environment, contact your system administrator.
    If you have any hosts or domains you would like to bypass the proxy you can add them to the `no_proxy` variable like this: `no_proxy=".mesos,.thisdcos.directory,.dcos.directory,.zk,127.0.0.1,localhost,foo.bar.com,.baz.com"`
    
1.  Restart the Cosmos service for the changes to take effect.

    ```
    sudo systemctl restart dcos-cosmos
    ```

## Configure DC/OS Private Agent Node

1.  Create `/var/lib/dcos/` directory if it doesn't exist and add `http_proxy`, `https_proxy`, and `no_proxy` lines from above in the file `/var/lib/dcos/mesos-slave-common`.


1.  Restart the Mesos Agent service for the changes to take effect.

    ```
    sudo systemctl restart dcos-mesos-slave
    ```

## Configure DC/OS Public Agent Node

1.  Create `/var/lib/dcos/` directory if it doesn't exist and add `http_proxy`, `https_proxy` and `no_proxy` lines from above in the file `/var/lib/dcos/mesos-slave-common`.


1.  Restart the Mesos Agent service for the changes to take effect.

    ```
    sudo systemctl restart dcos-mesos-slave-public
    ```

