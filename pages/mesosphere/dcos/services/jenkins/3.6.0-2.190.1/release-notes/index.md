---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
menuWeight: 5
excerpt: Discover the new features, updates, and known limitations in this release of the Jenkins Service
enterprise: false
--- 

Jenkins 3.6.0-2.190.1

## Improvements
- Updates to version 2.190.1 (LTS)
- Updates [jenkins-mesos-plugin](https://github.com/jenkinsci/mesos-plugin) to 1.0.0 which includes offer-suppression to improve scalability in a mixed-framework cluster.
- Users can optionally select the [Universal Container Runtime](../../../../2.0/deploying-services/containerizers/ucr/index.md) (UCR) for the Jenkins Master which offers greater stability and emits metrics to the [DC/OS Monitoring Service](../../../../services/dcos-monitoring/1.1.0/index.md).
- Support for multi-tenancy features on DC/OS 2.0
- Bundled plugins have been updated to their latest versions.


## Known Limitations
- Docker build and publish plugins will be manually updated to restore the plugin functionality
- Read more information about [forced migration of user records](https://jenkins.io/security/advisory/2018-12-05/#SECURITY-1072) documentation.


<!-- This source repo for this topic is located on https://github.com/mesosphere/dcos-jenkins-service -->
