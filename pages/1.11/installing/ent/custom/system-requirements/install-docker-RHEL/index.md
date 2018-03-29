---
layout: layout.pug
navigationTitle:  Install Docker on RHEL
title: Install Docker on RHEL
menuWeight: 3
excerpt:

enterprise: false
---

# Requirements and Recommendations

Before installing Docker on RHEL, review the general [requirements and recommendations for running Docker on DC/OS][1] and utilize the instructions below:

* These directions cover the installation of Docker CE 17.05 on RHEL

# Installation Procedure

The following instructions demonstrate how to install Docker CE on RHEL 7.4.

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

1.  Un-install old versions of Docker (if present)

    ```bash
    sudo yum remove docker \
                  docker-common \
                  docker-selinux \
                  docker-engine
    ```

1.  Configure yum to use the Docker yum repo:

    ```bash
    sudo tee /etc/yum.repos.d/docker.repo <<-'EOF'
    [dockerrepo]
    name=Docker Repository
    baseurl=https://yum.dockerproject.org/repo/main/centos/7
    enabled=1
    gpgcheck=1
    gpgkey=https://yum.dockerproject.org/gpg
    EOF
    ```

1.  Configure systemd to run the Docker Daemon with OverlayFS:

    ```bash
    sudo mkdir -p /etc/systemd/system/docker.service.d && sudo tee /etc/systemd/system/docker.service.d/override.conf <<- EOF
    [Service]
    ExecStart=
    ExecStart=/usr/bin/dockerd --storage-driver=overlay
    EOF
    ```

1. Install the Docker engine, daemon, and service.

    ```bash
    sudo yum install -y docker-engine-17.05.0.ce docker-engine-selinux-17.05.0.ce
    sudo systemctl start docker
    sudo systemctl enable docker
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
