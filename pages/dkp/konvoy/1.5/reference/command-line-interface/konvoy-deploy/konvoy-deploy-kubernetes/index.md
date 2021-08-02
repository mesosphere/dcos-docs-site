---
layout: layout.pug
navigationTitle: konvoy deploy kubernetes
title: konvoy deploy kubernetes
menuWeight: 10
notes: Automatically generated, DO NOT EDIT
enterprise: false
excerpt: Deploy a Kubernetes cluster except CNI plugins (use 'deploy container-networking' to deploy those)
---

## konvoy deploy kubernetes

Deploy a Kubernetes cluster except CNI plugins (use 'deploy container-networking' to deploy those)

### Synopsis

Deploy a Kubernetes cluster except CNI plugins (use 'deploy container-networking' to deploy those)

```
konvoy deploy kubernetes [flags]
```

### Options

```
      --cluster-name string         name used to prefix the cluster and all the created resources (default "konvoy")
      --force-upgrade               run an upgrade on all control-plane and worker nodes if needed, ignoring upgrade safety checks
  -h, --help                        help for kubernetes
      --max-parallel-nodes string   set the number of nodes to upgrade in parallel. This can be an integer or a percentage of a nodePool. Set to 1 to run serially (requires --upgrade or --force-upgrade flag) (default "15%")
      --skip-state-upload           skip the upload of the state to Kubernetes cluster
      --target-node-pools strings   comma-separated list of target node pools
      --upgrade                     run an upgrade on all nodes requiring an upgrade
      --verbose                     enable debug level logging
      --with-checks                 execute checks after each deployment step
      --without-draining            run an upgrade on all nodes requiring an upgrade, without draining the nodes first (requires --upgrade or --force-upgrade flag) (WARNING! usage can result in undefined behavior and service downtime)
  -y, --yes                         run command without prompting
```

### SEE ALSO

* [konvoy deploy](../)	 - Deploy a fully functioning Kubernetes cluster and addons
