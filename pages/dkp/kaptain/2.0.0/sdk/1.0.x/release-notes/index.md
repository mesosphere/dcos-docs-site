---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
beta: false
menuWeight: 0
---

Kaptain SDK 1.0.1 Release Notes

### New Features

### Improvements and Fixes
* Fix incorrect handling of the S3 endpoint string
* Remove `FailedScheduling` from the events list, introduce timeout for train and tune methods
* Migrate to KServe v0.7.0
* Use default minio tenant image
* Upgrade training operator to 1.4.0
* Don't mutate constants in _check_label_exists
* Handle missing / problem values more gracefully in utilities methods

### Breaking changes
Given the migration from KFServing toi KServe this SDK version is only compatible with Kaptain 2.0

[quick-start]: ../../../tutorials/sdk/quick-start
[image-builder]: ../../../tutorials/sdk/image-builder
