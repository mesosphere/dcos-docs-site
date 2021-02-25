---
layout: layout.pug
navigationTitle:  Release Notes
title: Release Notes
menuWeight: 5
excerpt: Discover the new features, updates, and known limitations in this release of the NiFi Service
model: /mesosphere/dcos/services/nifi/data.yml
render: mustache
---

## NiFi was released on 17, September 2020

## Release Notes for NiFi Service version 1.0.1-1.9.2

This release of the NiFi service updates the SDK version to [0.57.3](https://github.com/mesosphere/dcos-commons/releases/tag/0.57.3) which includes important bug fixes.

## Bug Fix
- The following ports are now advertised and will be reserved by Mesos:
    - `node-http`: NiFi HTTP Port.
    - `node-lb`: NiFi Load Balance Port
    - `node-proto`: NiFi Node Protocol Port
    - `node-inputsoc`: NiFi Input Socket Port

Previously these ports were not advertised to Mesos and other services could have reserved these ports leading to failures after the service tasks are launched.

## Changes
- NiFi Node Protocol port has changed from `12000` to `11443`