---
layout: layout.pug
navigationTitle:  API Reference
title: API Reference
menuWeight: 80
excerpt: Reference for all API endpoints exposed by the Edge-LB package

enterprise: false
---

The Edge-LB API enables users to create and manage pools of load balancers.
# API Versions

A new top level configuration field named `apiVersion` was introduced in Edge-LB v1.0.0. The two models are almost identical, with one important difference: `pool.haproxy.backends.servers` (apiVersion `V1`) has been replaced with `pool.haproxy.backends.services`, with a more intuitive way to select services/backends for HAProxy.

**Note:** Edge-LB 1.0 supports both the `V1` and `V2` API for backwards compatibility. Therefore clients that were written against Edge-LB versions prior to Edge-LB 1.0 should work without any modifications with Edge-LB 1.0.

Choose an API version at the left to view the appropriate swagger definition.
