---
layout: layout.pug
navigationTitle: konvoy deploy
title: konvoy deploy
menuWeight: 10
notes: Automatically generated, DO NOT EDIT
enterprise: false
excerpt: Deploy a fully functioning Kubernetes cluster and addons
---

## konvoy deploy

Deploy a fully functioning Kubernetes cluster and addons

### Synopsis

Deploy a fully functioning Kubernetes cluster and addons

```
konvoy deploy [flags]
```

### Options

```
      --force-upgrade               run an upgrade on all nodes requiring an upgrade ignoring upgrade safety checks
  -h, --help                        help for deploy
      --max-parallel-nodes string   set the number of nodes to upgrade in parallel. This can be an integer or a percentage of a nodePool. Set to 1 to run serially (requires --upgrade or --force-upgrade flag) (default "15%")
      --upgrade                     run an upgrade on all nodes requiring an upgrade
      --verbose                     enable debug level logging
      --without-draining            run an upgrade on all nodes requiring an upgrade, without draining the nodes first (requires --upgrade or --force-upgrade flag) (WARNING! usage can result in undefined behavior and service downtime)
  -y, --yes                         run command without prompting
```

### SEE ALSO

* [konvoy](../)	 - deploy and manage Kubernetes clusters
* [konvoy deploy addons](./konvoy-deploy-addons/)	 - Deploy Kubernetes addons
* [konvoy deploy container-networking](./konvoy-deploy-container-networking/)	 - Deploy container networking
* [konvoy deploy kubernetes](./konvoy-deploy-kubernetes/)	 - Deploy a Kubernetes cluster except CNI plugins (use 'deploy container-networking' to deploy those)

