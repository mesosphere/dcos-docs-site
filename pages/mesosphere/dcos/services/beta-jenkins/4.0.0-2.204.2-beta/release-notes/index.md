---
layout: layout.pug
navigationTitle: Jenkins for DC/OS Beta Release Notes
title: Jenkins for DC/OS Beta Release Notes
menuWeight: 0
beta: true
excerpt: Discover the new features, updates, and known limitations in this release of the Jenkins for DC/OS Service
enterprise: false
--- 

Jenkins 4.0.0-2.204.2

## Improvements
- Updates to Jenkins version 2.204.2 (LTS)
- Updates [jenkins-mesos-plugin](https://github.com/jenkinsci/mesos-plugin) to 2.0.0-beta which is a major overhaul of the plugin.
    - The jenkins-mesos-plugin has been replatformed on the [Unified Scheduler Iterface (USI)](https://github.com/mesosphere/usi) Library which provides better long-term support and more rapid delivery of Mesos features. The following features are in use:
        - Mesos v1 API
        - Offer-suppression
        - [Universal Container Runtime](https://docs.d2iq.com/mesosphere/dcos/latest/deploying-services/containerizers/ucr)
        - [Multi-Tenancy Features](/mesosphere/dcos/latest/multi-tenancy)
- Support for configurable Jenkins plugins
    - Removes previous hardcoded list of bundled plugins.
    - A list of user desired plugins can be specified at installation time which will be installed into the service before it is started.
- [Jenkins Configuration as Code (JCasC)](https://github.com/jenkinsci/configuration-as-code-plugin) is bundled by default and is used to configure Jenkins and its plugins.

## Changes from previous 3.x.y releases.
- Configuration options have changed significantly from the previous releases. See the [options compatiblity matrix](/mesosphere/dcos/services/beta-jenkins/4.0.0-2.204.2-beta/options-compatibility-matrix/) for differences between current and previous releases.
- [Universal Container Runtime](https://docs.d2iq.com/mesosphere/dcos/latest/deploying-services/containerizers/ucr) (UCR) is now the default containerizer for the Jenkins master.
- The default user has changed from `root` to `nobody` for both the Jenkins Master and Agents.
- Agent labels of `linux` and `windows` types are applied by default.

<!-- This source repo for this topic is located on https://github.com/mesosphere/dcos-jenkins-service -->
