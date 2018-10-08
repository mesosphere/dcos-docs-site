---
layout: layout.pug
navigationTitle:  Install Docker on CentOS
title: Install Docker on CentOS
menuWeight: 2
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->



# Requirements and Recommendations

Before installing Docker on CentOS, review the general [requirements and recommendations for running Docker on DC/OS][1] and the following CentOS-specific recommendations:

* Use the Docker yum repository to install Docker on CentOS. The yum repository makes it easy to upgrade and automatically manages dependency installation.

* Prefer the OverlayFS storage driver. OverlayFS avoids known issues with `devicemapper` in `loop-lvm` mode and allows containers to use docker-in-docker, if they want.

* Use CentOS 7.2 or greater. OverlayFS support was improved in 7.2 to fix <a href="https://github.com/docker/docker/issues/10294" target="_blank">a bug with XFS</a>.

* Format node storage as XFS with the `ftype=1` option. As of CentOS 7.2, "<a href="https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/7/html/7.2_Release_Notes/technology-preview-file_systems.html" target="_blank">only XFS is currently supported for use as a lower layer file system</a>".

**Note:** In modern versions of Centos and RHEL, `ftype=1` is the default. The `xfs_info` utility can be used to verify that `ftype=1`.

  ```bash
  mkfs -t xfs -n ftype=1 /dev/sdc1
  ```

# Installation Procedure

Follow the Docker <a href="https://docs.docker.com/engine/installation/linux/centos/" target="_blank">CentOS-specific installation instructions</a>.


# Example: Installing Docker with OverlayFS

The following instructions demonstrate how to use Docker with OverlayFS on CentOS 7.

1.  Upgrade CentOS to 7.4:

    ```bash
    sudo yum upgrade --assumeyes --tolerant
    sudo yum update --assumeyes
    ```

1.  Verify that the kernel is at least 3.10:

    ```
    uname -r
    3.10.0-327.10.1.el7.x86_64
    ```

1.  Enable OverlayFS:

    ```bash
    sudo tee /etc/modules-load.d/overlay.conf <<-'EOF'
    overlay
    EOF
    ```

1.  Reboot to reload kernel modules:

    ```bash
    reboot
    ```

1.  Verify that OverlayFS is enabled:

    ```bash
    lsmod | grep overlay
    overlay
    ```

1.  Configure yum to use the Docker yum repo:

    ```bash
    sudo tee /etc/yum.repos.d/docker.repo <<-'EOF'
    [dockerrepo]
    name=Docker Repository
    baseurl=https://yum.dockerproject.org/repo/main/centos/$releasever/
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

1.  Install the Docker engine, daemon, and service.

    ```bash
    sudo yum install -y docker-engine-1.13.1 docker-engine-selinux-1.13.1
    sudo systemctl start docker
    sudo systemctl enable docker
    ```

    When the process completes, you should see:

    ```
    Complete!
    Created symlink from /etc/systemd/system/multi-user.target.wants/docker.service to /usr/lib/systemd/system/docker.service.
    ```

1. Test that Docker is properly installed:

    ```bash
    sudo docker ps
    ```

For more generic Docker requirements, see [System Requirements: Docker][1].

[1]: /1.10/installing/ent/custom/system-requirements/#docker
