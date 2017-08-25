---
layout: layout.pug
title: Install Docker on CentOS
menuWeight: 0
excerpt: ""
featureMaturity: ""
enterprise: 'yes'
navigationTitle:  Install Docker on CentOS
---





Docker's <a href="https://docs.docker.com/engine/installation/linux/centos/" target="_blank">CentOS-specific installation instructions</a> are the most current information for the latest version of Docker. However, these recommendations and instructions should make it easier to manage the Docker installation over time and mitigate several known issues with various other configurations.

# Recommendations

In addition to the general [Docker requirements and recommendations for DC/OS][1], the following CentOS-specific recommendations should improve your DC/OS experience.

*   Use Docker's yum repository to install Docker on CentOS. The yum repository makes it easy to upgrade and automatically manages dependency installation.

*   Prefer the OverlayFS storage driver. OverlayFS avoids known issues with `devicemapper` in `loop-lvm` mode and allows containers to use docker-in-docker, if they want.

*   Use CentOS 7.2 or greater. OverlayFS support was improved in 7.2 to fix <a href="https://github.com/docker/docker/issues/10294" target="_blank">a bug with XFS</a>.

*   Format node storage as XFS. As of CentOS 7.2, "<a href="https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/7/html/7.2_Release_Notes/technology-preview-file_systems.html" target="_blank">only XFS is currently supported for use as a lower layer file system</a>".

# Instructions

These instructions show how to use Docker with OverlayFS on CentOS 7.

1.  Upgrade CentOS to 7.2:
    
        sudo yum upgrade --assumeyes --tolerant
        sudo yum update --assumeyes
        

2.  Verify that the kernel is at least 3.10:
    
        uname -r 
          3.10.0-327.10.1.el7.x86_64
        

3.  Enable OverlayFS:
    
        sudo tee /etc/modules-load.d/overlay.conf <<-'EOF'
        overlay
        EOF
        

4.  Reboot to reload kernel modules:
    
        sudo reboot
        

5.  Verify that OverlayFS is enabled:
    
        lsmod | grep overlay
        overlay
        

6.  Configure yum to use the Docker yum repo:
    
        sudo tee /etc/yum.repos.d/docker.repo <<-'EOF'
        [dockerrepo]
        name=Docker Repository
        baseurl=https://yum.dockerproject.org/repo/main/centos/$releasever/
        enabled=1
        gpgcheck=1
        gpgkey=https://yum.dockerproject.org/gpg
        EOF
        

7.  Configure systemd to run the Docker Daemon with OverlayFS:
    
        sudo mkdir -p /etc/systemd/system/docker.service.d && sudo tee /etc/systemd/system/docker.service.d/override.conf <<- EOF
        [Service]
        ExecStart=
        ExecStart=/usr/bin/docker daemon --storage-driver=overlay -H fd://
        EOF
        

8.  Install the Docker engine, daemon, and service:
    
        sudo yum install --assumeyes --tolerant docker-engine
        sudo systemctl start docker
        sudo systemctl enable docker
        
    
    When the process completes, you should see:
    
        Complete!
        Created symlink from /etc/systemd/system/multi-user.target.wants/docker.service to /usr/lib/systemd/system/docker.service.
        

9.  Test that Docker is properly installed:
    
        sudo docker ps
        

For more generic Docker requirements, see [System Requirements: Docker][1].

 [1]: /docs/1.7/administration/installing/custom/system-requirements/#docker