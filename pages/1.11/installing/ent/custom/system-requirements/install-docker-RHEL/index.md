---
layout: layout.pug
navigationTitle:  RHEL 7.4 prerequisites
title: Prepare RHEL 7.4 for DC/OS installation
menuWeight: 3
excerpt: Requirements and recommendations for installing Docker on RHEL

enterprise: false
---


# Requirements and Recommendations

Before installing Docker on RHEL, review the general [requirements and recommendations for running Docker on DC/OS][1] and utilize the instructions below:

* Use these directions to install the DC/OS bootstrap node on RHEL 7.4

* These directions cover the installation of Docker CE 17.05+ on RHEL

* OverlayFS is now the default in Docker CE. There is no longer a need to specify or configure the overlay driver.

* These instructions are specific to RHEL 7.4. Other versions of RHEL 7 should work but might require minor modifications to the commands.



# Installation Procedure

The following instructions demonstrate how to prepare a RHEL 7.4 system for DC/OS. All of the commands should be run as root or by prefixing each command with 'sudo'

1.  Disable the firewall

    ```bash
    systemctl stop firewalld && systemctl disable firewalld
    ```

1.  Subscribe the RHEL system in subscription-manager and add the repos

    ```bash
    subscription-manager register --username <RHEL-SUBSCRIPTION-USERNAME> --password ******** --auto-attach

    subscription-manager repos --enable=rhel-7-server-rpms
    subscription-manager repos --enable=rhel-7-server-extras-rpms
    subscription-manager repos --enable=rhel-7-server-optional-rpms
    ```

1.  Configure OS for overlay storage

    ```bash
    echo 'overlay' >> /etc/modules-load.d/overlay.conf
    modprobe overlay
    ```

1.  Run yum update

    ```bash
    yum update --exclude=docker-engine,docker-engine-selinux,centos-release* --assumeyes --tolerant
    ```

1.  Install other necessary tools:

    ```bash
    yum install -y wget curl zip unzip ipset ntp screen bind-utils
    ```

1.  Install jq for better parsing of .json files

    ```bash
    wget http://stedolan.github.io/jq/download/linux64/jq

    chmod +x ./jq

    cp jq /usr/bin
    ```

1.  Add a group called nogroup

    ```bash
    groupadd nogroup
    ```

1.  Enable non-TTY sudo

    ```bash
    sed -i -e 's/Defaults    requiretty/#Defaults    requiretty/g' /etc/sudoers
    ```

1.  Disable IPv6 (optional)

    ```bash
    sysctl -w net.ipv6.conf.all.disable_ipv6=1
    sysctl -w net.ipv6.conf.default.disable_ipv6=1
    ```

1.  Disable SElinux

    ```bash
    sed -i s/SELINUX=enforcing/SELINUX=permissive/g /etc/selinux/config
    set enforce 0
    ```

1.  Disable DNSmasq (DC/OS requires access to port 53)

    ```bash
    systemctl stop dnsmasq
    systemctl disable dnsmasq.service
    ```

1.  Un-install old versions of Docker (if present)

	```bash
	sudo yum remove docker \
                  docker-common \
                  docker-selinux \
                  docker-engine
	```

1.  Set up Docker CE repo

	```bash
	yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
	```

1.  Show versions of Docker CE. The remainder of these instructions assume that you have installed the latest version.

	```bash
	yum list docker-ce --showduplicates | sort -r
	```

1.  Install Docker CE

	```bash
	yum install docker-ce
	```

1.  Start Docker

	```bash
	systemctl start docker
	```

1.  Test Docker with hello-world app

	```bash
	docker run hello-world
	```

1.  Verify that Docker is using the overlay driver

	```bash
	docker info | grep Storage
	```

To continue setting up DC/OS, [please jump to the Advanced Installer][2]


For more generic Docker requirements, see [System Requirements: Docker][1].

[1]: /1.11/installing/ent/custom/system-requirements/#docker
[2]: /1.11/installing/ent/custom/advanced/
