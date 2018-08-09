---
layout: layout.pug
navigationTitle:  Edge-LB Pool Config Reference
title: Edge-LB Pool Config Reference
menuWeight: 80
excerpt: Reference for all possible Edge-LB pool configuration values

enterprise: false
---

This is a reference for all possible Edge-LB pool configuration values, as well as some examples to demonstrate various use-cases.

# Configuration Reference

The configuration reference containing all possible options and descriptions of each can be found by running the following command:

```
dcos edgelb show --reference
```

For more information, see the [CLI Reference Guide entry for `dcos edgelb show`](/1.1/cli-reference/dcos-edgelb-show/).

# API Versions

A new top level configuration field named `apiVersion` was introduced in Edge-LB v1.1.0. The two models are almost identical with one important difference: `pool.haproxy.backends.servers` (apiVersion `V1`) has been replaced with `pool.haproxy.backends.services` with a more intuitive way to select services/backends for HAProxy.

**Note:** For backwards compatibility, the `apiVersion` field defaults to `V1`. Hence, in order to use the `V2` config, you must explicitly set the `pool.apiVersion` to `"V2"`.

Choose an API version at the left to view the appropriate configuration reference or examples.
