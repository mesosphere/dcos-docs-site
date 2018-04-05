---
layout: layout.pug
navigationTitle:  Install Docker on CentOS/RHEL
title: Install Docker on CentOS/RHEL
menuWeight: 2
excerpt:

enterprise: false
---

# Requirements and Recommendations

Before installing Docker on CentOS/RHEL, review the general [requirements and recommendations for running Docker on DC/OS][1] and the following CentOS/RHEL-specific recommendations:

* These directions cover the installation of Docker CE on CentOS/RHEL

* OverlayFS is now the default in Docker CE. There is no longer a need to specify or configure the overlay driver. Prefer the OverlayFS storage driver. OverlayFS avoids known issues with `devicemapper` in `loop-lvm` mode and allows containers to use docker-in-docker, if they want.

* These instructions are specific to CentOS/RHEL 7.4. Other versions of CentOS/RHEL 7 should work but might require minor modifications to the commands.

* Format node storage as XFS with the `ftype=1` option. As of CentOS/RHEL 7.2, [only XFS is currently supported for use as a lower layer file system][2].

    ```bash
    mkfs -t xfs -n ftype=1 /dev/sdc1
    ```

# Installation Procedure

Follow the Docker [CentOS-specific installation instructions][3]


# Only applies to RHEL: register with the subcription-manager to enable additional repos

1.  Subscribe the RHEL system in subscription-manager and add the repos

    ```bash
    sudo subscription-manager register --username <RHEL-SUBSCRIPTION-USERNAME> --password ******** --auto-attach

    sudo subscription-manager repos --enable=rhel-7-server-rpms
    sudo subscription-manager repos --enable=rhel-7-server-extras-rpms
    sudo subscription-manager repos --enable=rhel-7-server-optional-rpms
    ```

# Example: Installing Docker with OverlayFS on CentOS/RedHat

The following instructions demonstrate how to use Docker with OverlayFS on CentOS 7.

1.  Configure OS for overlay storage

    ```bash
    sudo echo 'overlay' >> /etc/modules-load.d/overlay.conf
    sudo modprobe overlay
    ```

1.  Run yum update

    ```bash
    sudo yum update --exclude=docker-engine,docker-engine-selinux,centos-release* --assumeyes --tolerant
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
    sudo yum-config-manager \
        --add-repo \
        https://download.docker.com/linux/centos/docker-ce.repo
    ```

1.  Show versions of Docker CE. The remainder of these instructions assume that you have installed the latest version.

    ```bash
    sudo yum list docker-ce --showduplicates | sort -r
    ```

1.  Install Docker CE

    ```bash
    sudo yum install docker-ce
    ```

1.  Start Docker

    ```bash
    sudo systemctl start docker
    sudo systemctl enable docker
    ```

1.  Test Docker with hello-world app

    ```bash
    sudo docker run hello-world
    ```

1.  Verify that Docker is using the overlay driver

    ```bash
    sudo docker info | grep Storage
    ```

To continue setting up DC/OS, [please jump to the Advanced Installer][4]


For more generic Docker requirements, see [System Requirements: Docker][1].

[1]: /1.11/installing/ent/custom/system-requirements/#docker
[2]: https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/7/html/7.2_Release_Notes/technology-preview-file_systems.html
[3]: https://docs.docker.com/install/linux/docker-ce/centos/
[4]: /1.11/installing/ent/custom/advanced/
