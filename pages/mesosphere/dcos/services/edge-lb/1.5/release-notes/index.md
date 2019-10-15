---
layout: layout.pug
navigationTitle: Release notes
title: Release notes
menuWeight: 1
excerpt: Discover the new features, updates, and known limitations in this release of the Edge-LB service
enterprise: true
---
# Release notes for Edge-LB version 1.5.0
Edge-LB Service version 1.5.0 was released Month Day, Year.

# Breaking Changes
- Templates now use [Sprig](http://masterminds.github.io/sprig/) template funcitons instead of custom functions. The [`env`](http://masterminds.github.io/sprig/os.html) functions are not exposed to templates.

# Deprecation
- The v1 api is now deprecated and may be removed in a future release

# New features and capabilities
- Auto Pools automatically start a pool from a template with values from mesos task labels.
- The certificate generated for `$AUTOCERT` now has a 10 year validity and a random serial number.
- Updates the SDK version from 0.55.2 to 0.57.0.
- Adds apiserver, cloud-controller, dcos-template, lbmgr, and mesos-listener exporter for metrics.
- Metric names renamed in line with Prometheus community guideline.
- The apiserver now uses `container/bridge` network type.
- [Pool constraints](../pool-configuration/v2-reference/#pool) now support region placement constraints.

# Known issues and limitations
- Auto Pool updates are slower as the number of templates increases, or large changes to mesos state (many apps starting or stopping).
