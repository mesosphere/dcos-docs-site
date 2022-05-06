---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
beta: false
menuWeight: 0
---

Kaptain SDK 1.0.1 Release Notes

## Improvements and Fixes

- Fixed incorrect handling of the S3 endpoint string
- New `timeout` parameter for `Model.train` and `Model.tune` methods
- Upgraded from KFServing 0.6.1 to KServe 0.7.0
- Upgraded kubeflow-training to 1.4.0

## Breaking changes

Due to the migration from KFServing to KServe, this SDK version is only compatible with Kaptain 2.1.
