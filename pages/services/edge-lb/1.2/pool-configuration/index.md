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

The API reference, in swagger format, containing all possible options and short descriptions of each endpoint can be found by running the following command:

```
dcos edgelb show --reference
```

For more information, see the [CLI Reference Guide entry for `dcos edgelb show`](/1.2/cli-reference/dcos-edgelb-show/).

Choose an API version at the left to view the appropriate configuration reference or examples.

# API Versions

A new top level pool configuration field named `apiVersion` was introduced in Edge-LB v1.0.0. The two models are almost identical, with one important difference: `pool.haproxy.backends.servers` (in apiVersion `V1`) has been replaced with `pool.haproxy.backends.services`, with a more intuitive way to select services/backends for HAProxy.

**Note:** Edge-LB 1.0 and later supports both the `V1` and `V2` API for backwards compatibility. Therefore clients that were written against Edge-LB versions prior to Edge-LB 1.0 should work without any modifications with Edge-LB 1.0 and later. New setups should use api `V2` as at some point `V1` is going to be deprecated and then removed.

**Note:** The `apiVersion` field in th pool definition defaults to `V2` if it was not provided. Hence, in order to use the `V1` config, you must explicitly set the `pool.apiVersion` to `"V1"`.
