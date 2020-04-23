---
layout: layout.pug
navigationTitle:  Customizing your install
title: Customizing your install
menuWeight: 20
excerpt:
featureMaturity:
enterprise: false
---
# About customizing your installation parameters

The Jenkins for DC/OS package accepts a range of configuration parameters at install.

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
- [Beta Jenkins 4.0.0-2.204.2 Configuration options.](../options-compatibility-matrix/index.md)
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

## Installing additional plugins

With the `additional-plugins` option you can specify a space sperated list of addtional Jenkins plugins to be installed into the Jenkins master. This list will be populated on the Jenkins master when teh bootstrap script runs (at container launch time).
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