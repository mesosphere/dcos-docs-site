---
layout: layout.pug
navigationTitle:  Original Mesos Containerizer
title: Original Mesos Containerizer
menuWeight: 0
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


The Mesos Containerizer is the original container runtime in Mesos. It does not support Docker containers, though it supports a range of isolators that can be composed to create a container. The Mesos Containerizer also does not support container images.

To specify the original Mesos containerizer, add the following parameter to your Marathon application definition:

```json
{  
   "id":"/simple-service",
   "instances":1,
   "container":{  
      "type":"MESOS"
   },
   "cpus":0.1,
   "mem":128,
   "cmd":"sleep 10"
}
```

- [View the Mesos docs for the Mesos containerizer](http://mesos.apache.org/documentation/latest/containerizers/).
