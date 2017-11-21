---
layout: layout.pug
navigationTitle:  Release Notes
title: Release Notes
menuWeight: 120
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/dse-private -->


## Version 2.0.0-5.1.2

# Improvements
- Based on the latest stable release of the dcos-commons SDK, which provides numerous benefits:
  -Integration with DC/OS features such as virtual networking and integration with DC/OS access controls.
  - Orchestrated software and configuration updates, enforcement of version upgrade paths, and ability to pause/resume updates.
  - Placement constraints for pods.  
  - Uniform user experience across a variety of services.
- Upgrade to version 5.1.2 of DataStax Enterprise.
- Upgrade to version 6.1.2 of DataStax Enterprise Opscenter.

# Breaking Changes
- This is a major release available for DC/OS 1.9 or higher. You cannot upgrade to version 2.0.0-5.1.2 from any previous versions of the  package. This is due to the separation of the core DSE nodes from Opscenter.

