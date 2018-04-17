---
post_title: Release Notes
menu_order: 120
enterprise: 'no'
---

## Version 0.2.0-1.5.0-beta

### Breaking changes
- Dropped support for DC/OS 1.9 and earlier
- The configuration of HDFS requires a URI where `core-site.xml` and `hfds-site.xml` can be fetched, and not the DC/OS HDFS service name

### New Features
- Added support for RHEL / Centos clusters running with a strict security mode
- Added region awareness to the scheduler
- Added support support for using `hdfs://default` as an HDFS path
- Added support for Kerberized HDFS (requires `kinit` in the Docker image used)
- Added support for Marathon-style placement constraints

### Improvements
- Added DC/OS TensorFlow Docker images to resource definition to allow for use in airgapped clusters
- Moved JDK and Hadoop dependencies out of the Docker
- Updated JRE to 8u162
- Updated bundled Hadoop version to 2.7.5
- Updated default TensorFlow version to 1.5.0
- Enabled caching in the Mesos fetcher

### Bug Fixes
- Fixed installation on strict mode clusters
- Switched to Mesos healtchecks to address an issue where uninstall may not complete

## Version 0.1.1-1.3.0-beta

### New Features
- Added support for HDFS

### Bug Fixes
- Uninstall now handles failed tasks correctly
- Fixed a bug where setting `use_tensorboard` enabled GCE instead of the TensorBoard task

## Version 0.1.0-1.3.0-beta

- Initial beta release based on [TensorFlow r1.3](https://www.tensorflow.org/versions/r1.3/)
