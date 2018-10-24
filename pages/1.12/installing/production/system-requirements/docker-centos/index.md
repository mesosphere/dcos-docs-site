---
layout: layout.pug
navigationTitle:  Docker on CentOS/RHEL
title: Installing Docker on CentOS/RHEL
menuWeight: 5
excerpt: Requirements, recommendations and procedures for installing Docker CE on CentOS/RHEL
---

# Requirements and Recommendations

These directions cover the installation of Docker CE on CentOS/RHEL. Before installing Docker on CentOS/RHEL, review the general [requirements and recommendations for running Docker on DC/OS][1] and the following CentOS/RHEL-specific recommendations:

* OverlayFS is now the default in Docker CE. There is no longer a need to specify or configure the overlay driver. Prefer the OverlayFS storage driver. OverlayFS avoids known issues with `devicemapper` in `loop-lvm` mode and allows containers to use docker-in-docker, if they want.

* These instructions are specific to CentOS/RHEL 7.4. Other versions of CentOS/RHEL 7 should work but might require minor modifications to the commands.

* Format node storage as XFS with the `ftype=1` option. As of CentOS/RHEL 7.2, [only XFS is currently supported for use as a lower layer file system][2].

* For more generic Docker requirements, see [System Requirements: Docker](/1.12/installing/production/system-requirements/#docker).

<p class="message--note"><strong>NOTE: </strong> In modern versions of Centos and RHEL, <code>ftype=1</code> is the default. The <code>xfs_info</code> utility can be used to verify that <code>ftype=1</code>.</p>


    ```bash
    mkfs -t xfs -n ftype=1 /dev/sdc1
    ```

## Customer Advisory
A recently discovered bug in Docker 17.x’s handling of cgroups kernel memory controller (kmem) causes instability for the entire system when the `kmem` accounting feature is activated. Customers may notice tasks or commands getting stuck indefinitely and kernel-related error messages in the system logs. Mesosphere DC/OS customers and community members who utilize RedHat or CentOS as their base operating systems are strongly advised to install and use RedHat’s fork of Docker 1.13. This fork of Docker does not require an RHN subscription.

<p class="message--note"><strong>NOTE: </strong>More specific details on the Docker bug and mitigation instructions are located <a href="https://mesosphere-community.force.com/s/article/Critical-Issue-KMEM-MSPH-2018-0006">here</a>.</p>

# Installation

Follow the Docker [CentOS-specific installation instructions](https://docs.docker.com/install/linux/docker-ce/centos/).

### RHEL-only requirements

You must register with the subcription-manager to enable additional repos.

Follow the Docker [CentOS-specific installation instructions][3]

### RHEL Only: subcription-manager

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

1.  Un-install old versions of Docker (if present):

    ```bash
    sudo yum remove docker \
                  docker-common \
                  docker-selinux \
                  docker-engine
    ```

1.  Set up Docker CE repository:

    ```bash
    sudo yum-config-manager \
        --add-repo \
        https://download.docker.com/linux/centos/docker-ce.repo
    ```

1.  Show versions of Docker CE. 

    ```bash
    sudo yum list docker-ce --showduplicates | sort -r
    ```

The remainder of these instructions assume that you have installed the latest version.

6.  Install Docker CE:

    ```bash
    sudo yum install docker-ce
    ```

1.  Start Docker:

    ```bash
    sudo systemctl start docker
    sudo systemctl enable docker
    ```

1.  Test Docker with `hello-world` app:

    ```bash
    sudo docker run hello-world
    ```

1.  Verify that Docker is using the overlay driver:

    ```bash
    sudo docker info | grep Storage
    ```

To continue setting up DC/OS, [please jump to the Advanced Installer][4]

For more generic Docker requirements, see [System Requirements: Docker][1].

[1]: /1.12/installing/production/system-requirements/#docker
[2]: https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/7/html/7.2_Release_Notes/technology-preview-file_systems.html
[3]: https://docs.docker.com/install/linux/docker-ce/centos/
[4]: /1.12/installing/production/deploying-dcos/installation/
