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

Refer to the the Docker [CentOS-specific installation instructions](https://docs.docker.com/install/linux/docker-ce/centos/) for a more thorough breakdown, keeping in mind the above customer advisory.

## Example: Installing the Red Hat's fork of Docker 1.13 on RHEL

1.  Install Docker CE:

    ```bash
    sudo yum install -y docker --enablerepo=rhui-REGION-rhel-server-extras
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

To continue setting up DC/OS, [please jump to the Advanced Installer][4]

For more generic Docker requirements, see [System Requirements: Docker][1].

[1]: /1.10/installing/production/system-requirements/#docker
[2]: https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/7/html/7.2_Release_Notes/technology-preview-file_systems.html
[3]: https://docs.docker.com/install/linux/docker-ce/centos/
[4]: /1.10/installing/production/deploying-dcos/installation/
