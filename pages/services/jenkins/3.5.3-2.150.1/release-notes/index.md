---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
menuWeight: 1
excerpt: excerpt: Discover the new features, updates, and known limitations in this release of the Jenkins Service
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-jenkins-service -->

 Jenkins 3.5.3-2.150.1 was released on Jan 3, 2019.

# Release Notes for Jenkins Service version 3.5.3-2.150.1

## Improvements
- Update to version 2.150.1 of Jenkins.
- Set `keepalive` for NGINX.
- Switch to Spartan addresses for the Mesos master to make connection to the Mesos leader resilient to failovers.
- Bump all bundled plugins. See [here](https://github.com/mesosphere/dcos-jenkins-service#included-in-this-repo).
