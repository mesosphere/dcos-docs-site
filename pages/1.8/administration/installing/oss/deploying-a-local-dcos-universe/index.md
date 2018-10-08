---
layout: layout.pug
navigationTitle:  Deploying a local Universe
excerpt:
title: Deploying a local Universe
menuWeight: 1000
preview: true
---


You can install and run DC/OS services on a datacenter without internet access with a local [Universe](https://github.com/mesosphere/universe). You can install a local Universe that includes the default packages (easiest), or select your own set of local Universe packages (advanced).

**Important:** macOS is not supported.

**Prerequisites:**

*   8.5 GB of disk space
*   System must meet bootstrap node hardware [prerequisites](/1.8/administration/installing/oss/custom/system-requirements/)
*   Network access to port 8082 on all master nodes

# <a name="default"></a>Installing the default Universe packages

1.  Because DC/OS 1.8 is not the latest release, you will need to build your own local Universe image. Follow [these instructions][4], skipping step 3.

2.  Load the container into the local Docker instance on each of your master nodes:

    ```bash
    docker load < local-universe.tar.gz
    ```

1.  Download the [dcos-local-universe-http.service][2] definition.

3.  Add the `dcos-local-universe-http.service` definition to each of your masters at `/etc/systemd/system/dcos-local-universe-http.service` and then start it.

    ```bash
    cp dcos-local-universe-http.service /etc/systemd/system/dcos-local-universe-http.service
    systemctl daemon-reload
    systemctl enable dcos-local-universe-http
    systemctl start dcos-local-universe-http
    ```

1.  Download the [dcos-local-universe-registry.service][3] definition.

4.  Add the `dcos-local-universe-registry.service` definition to each of your masters at `/etc/systemd/system/dcos-local-universe-registry.service` and then start it.

    ```bash
    cp dcos-local-universe-registry.service /etc/systemd/system/dcos-local-universe-registry.service
    systemctl daemon-reload
    systemctl enable dcos-local-universe-registry
    systemctl start dcos-local-universe-registry
    ```

5.  Remove the DC/OS Universe repository from a host that has the DC/OS CLI installed. The Universe repository is installed by default with the CLI.

    ```bash
    dcos package repo remove Universe
    ```

    **Tip:** You can also add or remove repositories by using the DC/OS web interface. Simply go to **System > Overview > Repositories**.

6.  Add the local repository by using the DC/OS CLI.

    ```bash
    dcos package repo add local-universe http://master.mesos:8082/repo
    ```

7.  To pull from this new repository, you must setup the Docker daemon on every agent to have a valid SSL certificate. For each agent node:

    1.  [SSH](/1.8/administration/access-node/sshcluster/) to your agents node.

    1.  Run the following commands:

        ```bash
        mkdir -p /etc/docker/certs.d/master.mesos:5000
        curl -o /etc/docker/certs.d/master.mesos:5000/ca.crt http://master.mesos:8082/certs/domain.crt
        systemctl restart docker
        ```

    **Tip:** You can use the instructions for insecure registries, instead of this step, however we don't recommend this.

### FAQ

*   **I can't install CLI subcommands**

    Packages are hosted at `master.mesos:8082`. If you cannot resolve or connect to `master.mesos:8082` from your DC/OS CLI install, you cannot install CLI subcommands. If you can connect to port 8082 on your masters, add the IP for one of the masters to `/etc/hosts`.

*   **The images are broken**

    All Universe components are hosted inside of your cluster, including the images. The components are served up by `master.mesos:8082`. If you have connectivity to that IP, you can add it to `/etc/hosts` and get the images working.

*   **I don't see the package I was looking for**

    By default, only the `selected` packages are bundled. If you'd like to get something else, use the build your own [instructions][4].

# <a name="build"></a>Installing your own set of Universe packages

#### Prerequisites

*   Git:
    *   **Unix/Linux:** See these <a href="https://git-scm.com/book/en/v2/Getting-Started-Installing-Git" target="_blank">installation instructions</a>.

To install your own set of packages you must build a customized local Universe Docker image.

1.  Clone the Universe repository:

    ```bash
    git clone https://github.com/mesosphere/universe.git --branch version-3.x
    ```

2.  Build the `universe-base` image:

    ```bash
    cd universe/docker/local-universe/
    sudo make base
    ```

3.  Build the `mesosphere/universe` Docker image and compress it to the `local-universe.tar.gz`
file. Specify a comma-separated list of package names and versions using the `DCOS_PACKAGE_INCLUDE`
variable. To minimize the container size and download time, you can select only what you need. If
you do not use the `DCOS_PACKAGE_INCLUDE` variable, all *selected* Universe packages will be
included. To view which packages are selected, click on the **Catalog** tab in the DC/OS web
interface.

    ```bash
    sudo make DCOS_VERSION=1.8 DCOS_PACKAGE_INCLUDE="cassandra:1.0.25-3.0.10,marathon:1.4.2" local-universe
    ```

4.  Perform all of the steps in the [Installing the default Universe packages](#build) section. But instead of using the default local-package container, use the package file you just built.

    

 [1]: https://downloads.mesosphere.com/universe/public/local-universe.tar.gz
 [2]: https://raw.githubusercontent.com/mesosphere/universe/version-3.x/docker/local-universe/dcos-local-universe-http.service
 [3]: https://raw.githubusercontent.com/mesosphere/universe/version-3.x/docker/local-universe/dcos-local-universe-registry.service
 [4]: #build
 [5]: #default
