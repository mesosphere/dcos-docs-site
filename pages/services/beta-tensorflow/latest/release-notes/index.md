---
post_title: Release Notes
menu_order: 120
enterprise: 'no'
---

## Version 1.0.0-1.5.0-beta

<!-- TODO: Add a general note here how this is a full beta release -->

### Breaking changes
- Dropped support for DC/OS 1.9 and earlier
- TF-15: The configuration of HDFS requires a URI where `core-site.xml` and `hfds-site.xml` can be fetched, and not the DC/OS HDFS service name

### New Features
- Added region awareness to the scheduler <!-- TODO: Check the wording of this -->
- Added support support for using `hdfs://default` as an HDFS path
- Added support for Kerberized HDFS (requires `kinit` in the Docker image used)
- Added support for Marathon-style placement constraints

### Improvements
<!-- TODO: Is it "airgapped" or "air-gapped" -->
- Added DC/OS TensorFlow Docker images to resource definition to allow for use in air-gapped clusters
- Move JDK and Hadoop dependencies out of the Docker
- Update JRE to 8u162
- Update bundled Hadoop version to 2.7.5
- Update default TensorFlow version to 1.5.0
- Enable caching in the Mesos fetcher

### Bug Fixes
- Fix installation on strict mode clusters

## Version 0.1.1-1.3.0-beta

### New Features
- Added support for HDFS

### Bug Fixes
- Uninstall now handles failed tasks correctly
- Fixed a bug where setting `use_tensorboard` enabled GCE instead of the TensorBoard task

## Version 0.1.0-1.3.0-beta

- Initial beta release based on [TensorFlow r1.3](https://www.tensorflow.org/versions/r1.3/)
