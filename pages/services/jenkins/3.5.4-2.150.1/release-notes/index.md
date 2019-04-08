---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
menuWeight: 5
excerpt: Discover the new features, updates, and known limitations in this release of the Jenkins Service
enterprise: false
--- 

Jenkins 3.5.4-2.150.1 was released on March 11, 2019.

# Release Notes for Jenkins Service version 3.5.3-2.150.1

## Improvements
- Update to version 2.150.1 of Jenkins.
- Add strict mode support for Jenkins 2.150.1

## Known Limitations
- Docker Build and Publish plugins will need to be manually updated to restore functionality here
- Jenkins will store user records in a slightly different format which prevents downgrades: See[here](https://jenkins.io/security/advisory/2018-12-05/#SECURITY-1072)

<!-- This source repo for this topic is located on https://github.com/mesosphere/dcos-jenkins-service -->