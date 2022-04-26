---
layout: layout.pug
navigationTitle: konvoy check
title: konvoy check
menuWeight: 10
notes: Automatically generated, DO NOT EDIT
enterprise: false
excerpt: Run checks on the health of the cluster
---

## konvoy check

Run checks on the health of the cluster

### Synopsis

Run checks on the health of the cluster

```
konvoy check [flags]
```

### Options

```
      --cluster-name string   name used to prefix the cluster and all the created resources (default "konvoy")
  -h, --help                  help for check
      --without-addons        skip checking that addons were deployed
```

### SEE ALSO

* [konvoy](../)	 - Deploy and manage Kubernetes clusters
* [konvoy check addons](./konvoy-check-addons/)	 - Run checks on the addons
* [konvoy check fips](./konvoy-check-fips/)	 - Run fips-140-2 module validation checks
* [konvoy check kubernetes](./konvoy-check-kubernetes/)	 - Run checks on the cluster components
* [konvoy check nodes](./konvoy-check-nodes/)	 - Run checks on the nodes
* [konvoy check preflight](./konvoy-check-preflight/)	 - Run checks to validate machines are ready for installation

