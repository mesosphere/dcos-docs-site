---
layout: layout.pug
navigationTitle:  Upgrading
title: Upgrading
menuWeight: 60
excerpt:
featureMaturity:
enterprise: false
---
# Upgrading

To upgrade from one version of the Jenkins for DC/OS package to another, simply uninstall the current version, update your package repository cache, and install a new version.

- Uninstall Jenkins as per the instructions in [Uninstalling](https://docs.d2iq.com/mesosphere/dcos/services/jenkins/latest/uninstall/). Any builds that are currently in progress or queued will be lost.
- Use the CLI to update your local cache of the package repository. 
    `dcos package update`
- Install Jenkins, again following the instructions on [Customizing your install](https://docs.d2iq.com/mesosphere/dcos/services/jenkins/latest/custom-install/). Make sure you use the same configuration file as previously, specifically pointing Jenkins to the same <code>host-volume</code>.
- Currently it is necessary to upgrade plugins by hand using the Jenkins UI at <code>&lt;dcos_url&gt;/service/jenkins/pluginManager</code>.

## Upgrading to UCR Containerizer

This release supports the optional use of [Universal Container Runtime](https://docs.d2iq.com/mesosphere/dcos/latest/deploying-services/containerizers/ucr/) (UCR) for the Jenkins Master which offers greater stability and emits metrics to the [DC/OS Monitoring Service](https://docs.d2iq.com/mesosphere/dcos/services/dcos-monitoring/latest/).

Customers can specify use of UCR via the following options:
```
    "advanced": {
        "containerizer": "MESOS"
    }
```

### Strict Mode Clusters with Volumes

Users with data on persistent volumes need to ensure the user running with the UCR containerizer must be able to read & write to the previously created persistent volumes.

It is *strongly recommended* that a backup of the persistent volume is performed before proceeding.

By default, the Docker containerizer uses the `root` user, and volumes may be populated by the `root` user. To upgrade to UCR in this scenario, the following steps need to be taken to allow UCR to read & write to volumes:
- [Grant Marathon priviledges](https://docs.d2iq.com/mesosphere/dcos/latest/security/ent/users-groups/config-linux-user/#overriding-the-default-linux-user-of-a-catalog-service) for the`root` user
- Specify the `root` user to run UCR containerizer via the following options
```
    "service": {
       "user": "root"
    }
```
