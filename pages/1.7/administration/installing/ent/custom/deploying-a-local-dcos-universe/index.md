---
layout: layout.pug
navigationTitle:  Deploying a local package repository
title: Deploying a local package repository
menuWeight: 5
excerpt:

enterprise: true
---






You can install and run DC/OS services on a datacenter without internet access with a local Universe. You can install a local Universe that includes the default packages (easiest), or select your own set of local Universe packages (advanced).

#### Prerequisites

*   DC/OS cluster
*   8.5 GB of disk space

# <a name="default"></a>Installing the default Universe packages

1.  Download the [local-universe][1] container to each of your masters.
    
    **Tip:** The `local-universe.tar.gz` file size is 2 GB or more.

2.  Load the container into the local Docker instance on each of your master nodes:
    
        docker load < local-universe.tar.gz
        

3.  Add the [dcos-local-universe-http.service][2] definition to each of your masters at `/etc/systemd/system/dcos-local-universe-http.service` and then start it.
    
        cp dcos-local-universe-http.service /etc/systemd/system/dcos-local-universe-http.service
        systemctl daemon-reload
        systemctl enable dcos-local-universe-http
        systemctl start dcos-local-universe-http
        

4.  Add the [dcos-local-universe-registry.service][3] definition to each of your masters at `/etc/systemd/system/dcos-local-universe-registry.service` and then start it.
    
        cp dcos-local-universe-registry.service /etc/systemd/system/dcos-local-universe-registry.service
        systemctl daemon-reload
        systemctl enable dcos-local-universe-registry
        systemctl start dcos-local-universe-registry
        

5.  Remove the DC/OS Universe repository from a host that has the DC/OS CLI installed. The Universe repository is installed by default with the CLI.

    **Tip:**  You can also remove repositories by clicking **System** -> **Repositories** in the DC/OS UI.
    
        dcos package repo remove Universe
        dcos package repo remove Universe-1.7

6.  Add the local repository by using the DC/OS CLI.
    
        dcos package repo add local-universe-1.7 http://master.mesos:8082/repo-1.7
        dcos package repo add local-universe http://master.mesos:8082/repo
        

7.  To pull from this new repository, you must setup the Docker daemon on every agent to have a valid SSL certificate. To do this, on every agent in your cluster, run the following:
    
        mkdir -p /etc/docker/certs.d/master.mesos:5000
        curl -o /etc/docker/certs.d/master.mesos:5000/ca.crt http://master.mesos:8082/certs/domain.crt
        systemctl restart docker
        
    
    **Tip:** You can use the instructions for insecure registries, instead of this step, however we don't recommend this.
    
    ### FAQ
    
    *   **I can't install CLI subcommands**
        
        Packages are hosted at `master.mesos:8082`. If you cannot resolve or connect to `master.mesos:8082` from your DC/OS CLI install, you cannot install CLI subcommands. If you can connect to port 8082 on your masters, add the IP for one of the masters to `/etc/hosts`.
    
    *   **The images are broken**
        
        All Universe components are hosted inside of your cluster, including the images. The components are served up by `master.mesos:8082`. If you have connectivity to that IP, you can add it to `/etc/hosts` and get the images working.
    
    *   **I don't see the package I was looking for**
        
        By default, only the `selected` packages are bundled. If you'd like to get something else, use the build your own [instructions][4].

# <a name="build"></a>Installing a selected set of Universe packages

To install your own set of packages you must build a customized local Universe Docker image. 

1.  Clone the Universe repository:

        git clone https://github.com/mesosphere/universe.git --branch version-3.x

2.  Build the `universe-base` image:

        cd universe/docker/local-universe/
        sudo make base

3.  Inside the `Makefile` replace `--selected` flag with the comma-separated list of selected packages preceeded by `--include` flag. To minimize the container size and download time, you can select only what you need. If you do not modify the `Makefile` all default Universe packages will be included.

        sed -i -e 's/--selected/--include="marathon-lb,zeppelin"/' Makefile

4.  Build `mesosphere/universe` image and compress it to the `local-universe.tar.gz` file:
        
        sudo make local-universe

5.  Perform steps from 2 to 7 of [Installing the default Universe packages][5] section.

 [1]: https://downloads.mesosphere.com/universe/public/local-universe.tar.gz
 [2]: https://raw.githubusercontent.com/mesosphere/universe/version-3.x/docker/local-universe/dcos-local-universe-http.service
 [3]: https://raw.githubusercontent.com/mesosphere/universe/version-3.x/docker/local-universe/dcos-local-universe-registry.service
 [4]: #build
 [5]: #default
