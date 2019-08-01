---
layout: layout.pug
navigationTitle:  Release Notes
title: Release Notes
menuWeight: 0
excerpt: Discover the new features, updates, and known limitations in this release of the Minio Service 
featureMaturity:
enterprise: false
model: /mesosphere/dcos/services/minio/data.yml
render: mustache
---

# Release Notes for {{ model.techName }} Service version 0.1.1

## Bug Fixes
This is the bug fix for statsd of the DC/OS {{ model.techName }} framework.

* Fix a bug where Miniod metrics service crashes on a loop every hour.
 
