---
layout: layout.pug
navigationTitle:  Customizing your install
title: Customizing your install
menuWeight: 20
beta: true
excerpt: The Jenkins for DC/OS package accepts a range of custom configuration parameters at install.
featureMaturity:
enterprise: false
---
# About customizing your installation parameters

The Jenkins for DC/OS package accepts a range of custom configuration parameters at install.

By default, Jenkins for DC/OS uses a `/tmp` directory on the local host to store its configuration and build data. At a minimum, you should change this before going into production. We recommend setting up a shared file system. Alternatively, you can pin to an agent.

We also expect that you'll want to customize the default Docker container to add your own dependencies.

# Using the CLI

## About using the CLI

You can perform a custom installation from either the web interface or the CLI.

## Creating a JSON file

1. Create a new file.

    **Tip:** You might want to choose a pattern like `<package-name>-config.json`.
    ```bash
    nano jenkins-config.json
    ```

1. Use the information in the configuration reference below to build your JSON. This example creates a new Jenkins for DC/OS service named `jenkins-myteam` and uses the NFS share located at `/mnt/nfs/jenkins-data`.

    ```json
    {
        "service": {
            "name": "jenkins-myteam",
            "storage": {
                "host-volume": "/mnt/nfs/jenkins_data"
            }
        }
    }
    ```

    **Tip:** The value of `host-volume` is the base path to a share on a NFS server or other distributed filesystem. The actual path on-disk for this example is `mnt/nfs/jenkins_data/jenkins-myteam`.
1. From the CLI, pass the custom options file.

    ```bash
    dcos package install beta-jenkins --options=jenkins-config.json
    ```

# Configuration reference
The exact configuration can change between releases of the DC/OS Jenkins Service, the following links describe options available for each release.
- [Beta Jenkins 4.0.0-2.204.2 Configuration options.](/mesosphere/dcos/services/beta-jenkins/4.0.0-2.204.2-beta/options-compatibility-matrix/)
- [Jenkins 3.6.0-2.190.1 Configuration options.](https://github.com/mesosphere/universe/blob/version-3.x/repo/packages/J/jenkins/40/config.json)
- [Jenkins 3.5.4-2.150.1 Configuration options.](https://github.com/mesosphere/universe/blob/version-3.x/repo/packages/J/jenkins/30/config.json)
- [Jenkins 3.5.3-2.150.1 Configuration options.](https://github.com/mesosphere/universe/blob/version-3.x/repo/packages/J/jenkins/29/config.json)
- [Jenkins 3.5.2-2.107.2 Configuration options.](https://github.com/mesosphere/universe/blob/version-3.x/repo/packages/J/jenkins/28/config.json)

# Examples

## Create a new instance pinned to a single host

You can also specify an optional `pinned-hostname` constraint. This is useful if you don't have NFS available and need to pin Jenkins to a specific node:

```json
{
    "service": {
        "name": "jenkins-pinned",
        "storage": {
            "host-volume": "/var/jenkins_data",
            "pinned-hostname": "10.0.0.100"
        }
    }
}
```

## Modify known hosts

With the `known-hosts` option you can specify a space-separated list of hostnames from which to retrieve the SSH public keys. This list will be populated on the Jenkins master when the bootstrap script runs (at container launch time). You must manually ensure that the SSH known hosts list is populated in any Jenkins agent containers.
```json
{
    "service": {
        "name": "jenkins-private-git",
    },
    "jenkins-master": {
        "known-hosts": "github.com git.apache.org git.example.com"
    }
}
```

## Installing additional Jenkins plugins

With the `additional-plugins` option you can specify a space sperated list of addtional Jenkins plugins to be installed into the Jenkins master. This list will be populated on the Jenkins master when the bootstrap script runs (at container launch time).
```json
{
    "service": {
        "name": "jenkins-additional-plugins",
    },
    "jenkins-master": {
        "additional-plugins": "gradle:1.34 cvs:2.14 handlebars:1.1.1"
    }
}
```

## Using custom images with pre-installed Jenkins plugins

DC/OS Jenkins service ships with a minimial list of pre-bundled plugins that are officially supported. The [current list can be found at here](https://github.com/mesosphere/dcos-jenkins-service/blob/4.0.0-2.204.2-beta/plugins.conf).

Customers have the option of specifying an image with a custom list of Jenkins plugins they would like to have pre-installed when the Jenkins service starts up.
This process is diffrent from procedure in [installing additional plugins](#installing-additional-jenkins-plugins) as the plugins in this case are bundled into the container image and aren't downloaded everytime the container gets launched.

### Creating a custom image with bundled Jenkins plugins
The process below outlines how to create a custom image with bundled jenkins plugins:
1. Clone the DC/OS Jenkins Github repository
    ```
    git clone https://github.com/mesosphere/dcos-jenkins-service.git
    cd dcos-jenkins-service
    ```
1. Modify `plugins.conf` with the list of desired plugins.
1. Build the docker image. Here we're using `mesosphere/jenkins:custom-image` as the example image tag.
    ```
    docker build -t mesosphere/jenkins:custom-image .
    ```
1. Push the built image to the respective image repository, we're using the default Dockerhub in this example.
    ```
    docker push mesosphere/jenkins:custom-image .
    ```

### Specifying a custom image at service installation time

Once a image has been created with the desired plugins, the custom image can be specified via the options shown below:
```json
{
    "service": {
        "name": "jenkins-custom-image",
        "docker-image": "mesosphere/jenkins:custom-image"
    }
}
```

## Configuring Airgapped clusters

Customers running Jenkins on Airgapped DC/OS clusters should use [Package Registry](/mesosphere/dcos/latest/administering-clusters/package-registry/) to install packages in airgapped environments. Default versions of Jenkins for Package Registry are [available](https://downloads.mesosphere.com/universe/packages/packages.html).

### Configuring Airgapped clusters with custom images.

It is possible to also use a [custom image](#creating-a-custom-image-with-bundled-jenkins-plugins) with Package Registry, the following instructions outline how to create a Jenkins `.dcos` file with a custom image.

1. Install [Package Registry](/mesosphere/dcos/latest/administering-clusters/package-registry/#default-installation)
1. Clone the DC/OS Universe repository.
    ```
    https://github.com/mesosphere/universe.git
    ```
1. Create a working directory for Package Registry to build the `.dcos` files.
    ```
    mkdir output-directory
    ```
1. Copy the desired version of Jenkins, we're using `beta-jenkins` in this example:
    ```
    cp -r universe/tree/version-3.x/repo/packages/B/beta-jenkins/0 output-directory/
    ```
1. The folder `output-directory` should have the following files:
    ```
    config.json
    marathon.json.mustache
    package.json
    resource.json
    ```
1. Modify `resource.json` to use the custom docker image.
    Here we're replacing the default `"mesosphere/jenkins-dev:4.0.0-2.204.2-beta"` with `"mesosphere/jenkins:custom-image"`
    Modify the `docker` image to point to the desired custom image, the resulting file looks like the following with the above example:
    ```json
    {
        "images": {
            "icon-small": "https://downloads.mesosphere.com/assets/universe/000/jenkins-icon-small.png",
            "icon-medium": "https://downloads.mesosphere.com/assets/universe/000/jenkins-icon-medium.png",
            "icon-large": "https://downloads.mesosphere.com/assets/universe/000/jenkins-icon-large.png"
        },
        "assets": {
            "container": {
                "docker": {
                    "jenkins": "mesosphere/jenkins:custom-image"
                }
            }
        }
    }
    ```
1. Complete building the `.dcos` files and uploading them to Package Registry by following the procedure to [build the packages](/mesosphere/dcos/latest/administering-clusters/package-registry/#building-the-packages).