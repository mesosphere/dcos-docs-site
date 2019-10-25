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

- Uninstall Jenkins as per the instructions in [Uninstalling](../uninstall/index.md). Any builds that are current in progress or queued will be lost.
- Use the CLI to update your local cache of the package repository. 
    `dcos package update`
- Install Jenkins, again following the instructions on [Customizing your install](../custom-install/index.md). Make sure you use the same configuration file as previously, specifically pointing Jenkins to the same <code>host-volume</code>.
- Currently it is necessary to upgrade plugins by hand using the Jenkins UI at <code>&lt;dcos_url&gt;/service/jenkins/pluginManager</code>.

## Upgrading to UCR Containerizer

This release supports the optional use of [Universal Container Runtime](../../../../2.0/deploying-services/containerizers/ucr/index.md) (UCR) for the Jenkins Master which offers greater stability and emits metrics to the [DC/OS Monitoring Service](../../../../services/dcos-monitoring/1.1.0/index.md).

Customers can specify use of UCR via the following options:
```
    "advanced": {
        "containerizer": "MESOS"
    }
```

### Strict Mode Clusters with Volumes

Users with data on persistent volumes need ensure the user running with the UCR containerizer must be able to read & write to the previously created persistent volumes.

It is *strongly recommended* that a backup of the persistent volume is performed before proceeding.

The Docker containerizer by default uses the `root` user and volumes may be populated by the `root` user. To upgrade to UCR in this scenario the following steps need to be taken to allow UCR to read & write to volumes:
- [Grant Marathon priviledges](../../../../2.0/security/ent/users-groups/config-linux-user/index.md#overriding-the-default-linux-user-of-a-universe-service) for the`root` user
- Specify the `root` user to run UCR containerizer via the following options
```
    "service": {
       "user": "root"
    }
```