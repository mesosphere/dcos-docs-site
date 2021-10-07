---
layout: layout.pug
navigationTitle: FIPS 140 Mode Performance Impact
title: FIPS 140 Mode Performance Impact
excerpt: Understand the performance impact from operating your cluster in FIPS 140 mode
beta: true
enterprise: false
menuWeight: 40
---

The Go language cryptographic module, Goboring, relies on CGO’s foreign function interface to call C-language functions exposed by the cryptographic module. Each call into the C library starts with a base overhead of 200ns.

One [benchmark](https://github.com/golang/go/issues/21525) finds that the time to encrypt a single AES-128 block increased from 13ns to 209ns over the internal golang implementation. The preferred mode of D2iQ's FIPS module is `TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384`.

The aggregate impact on a stable control plane seems to be an increase of around 10% CPU utilization over default operation. Workloads that do not directly interact with the control plane are not affected.
