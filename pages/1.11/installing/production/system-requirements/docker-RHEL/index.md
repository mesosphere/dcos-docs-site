---
layout: layout.pug
navigationTitle:  Docker on RHEL 7.4 
title: Docker on RHEL 7.4 
menuWeight: 10
excerpt: Requirements and recommendations for installing Docker on RHEL
---


# Requirements and Recommendations

Before installing Docker on RHEL, review the general [requirements and recommendations for running Docker on DC/OS][1] and use the following instructions:

* Use the instructions listed in the [Installation](/1.11/installing/production/deploying-dcos/installation/) procedure section to install the DC/OS bootstrap node on RHEL 7.4.

* The Installation procedure section covers the installation of Docker CE 17.05+ on RHEL.

* OverlayFS is now the default in Docker CE. There is no longer a need to specify or configure the overlay driver.

* These instructions are specific to RHEL 7.4. Other versions of RHEL 7 should work but might require minor modifications to the commands.



# Installation Procedure

The following instructions demonstrate how to prepare a RHEL 7.4 system for DC/OS. All of the commands should be run as root or by prefixing each command with 'sudo'

## Preparing RHEL 7.4 system

1.  Disable the firewall.

    ```bash
    systemctl stop firewalld && systemctl disable firewalld
    ```

2.  Subscribe the RHEL system in subscription-manager and add the repos.

    ```bash
    subscription-manager register --username <RHEL-SUBSCRIPTION-USERNAME> --password ******** --auto-attach

    subscription-manager repos --enable=rhel-7-server-rpms
    subscription-manager repos --enable=rhel-7-server-extras-rpms
    subscription-manager repos --enable=rhel-7-server-optional-rpms
    ```

3.  Configure OS for overlay storage.

    ```bash
    echo 'overlay' >> /etc/modules-load.d/overlay.conf
    modprobe overlay
    ```

4.  Run `yum` update.

    ```bash
    yum update --exclude=docker-engine,docker-engine-selinux,centos-release* --assumeyes --tolerant
    ```

5.  Install other necessary tools.

    ```bash
    yum install -y wget curl zip unzip ipset ntp screen bind-utils
    ```

6.  Install `jq` for better parsing of `.json` files.

    ```bash
    wget http://stedolan.github.io/jq/download/linux64/jq

    chmod +x ./jq

    cp jq /usr/bin
    ```

7.  Add a group called nogroup.

    ```bash
    groupadd nogroup
    ```

8.  Enable non-TTY sudo.

    ```bash
    sed -i -e 's/Defaults    requiretty/#Defaults    requiretty/g' /etc/sudoers
    ```

9.  Disable IPv6 (optional).

    ```bash
    sysctl -w net.ipv6.conf.all.disable_ipv6=1
    sysctl -w net.ipv6.conf.default.disable_ipv6=1
    ```

10.  Disable SElinux.

    ```bash
    sed -i s/SELINUX=enforcing/SELINUX=permissive/g /etc/selinux/config
    setenforce 0
    ```

11.  Disable DNSmasq (DC/OS requires access to port 53).

    ```bash
    systemctl stop dnsmasq
    systemctl disable dnsmasq.service
    ```

## Installing Docker

1.  Uninstall old versions of Docker (if present).

	```bash
	sudo yum remove docker \
                  docker-common \
                  docker-selinux \
                  docker-engine
	```

2.  Set up Docker CE repo.

	```bash
	yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
	```

3.  Show versions of Docker CE. The remainder of these instructions assume that you have installed the latest version.

	```bash
	yum list docker-ce --showduplicates | sort -r
	```

4.  Install Docker CE.

	```bash
	yum install docker-ce
	```

5.  Start Docker.

	```bash
	systemctl start docker
	```

6.  Test Docker with hello-world app.

	```bash
	docker run hello-world
	```

7.  Verify that Docker is using the overlay driver.

	```bash
	docker info | grep Storage
	```

To continue setting up DC/OS, see [Installation][2] dcoumentation.


 See [System Requirements: Docker][1] for more generic Docker requirements.

[1]: /1.11/installing/ent/custom/system-requirements/#docker
[2]: /1.11/installing/ent/custom/advanced/
