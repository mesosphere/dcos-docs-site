---
layout: layout.pug
navigationTitle: konvoy up
title: konvoy up
menuWeight: 10
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
excerpt: Run provision, and deploy (kubernetes, container-networking, and addons) to create or update a Kubernetes cluster reflecting the provided configuration and inventory files
---

## konvoy up

Run provision, and deploy (kubernetes, container-networking, and addons) to create or update a Kubernetes cluster reflecting the provided configuration and inventory files

```
konvoy up [flags]
```

### Options

```
      --addons-repositories strings   A comma separated list of addons repositories with uri@version (default [https://github.com/mesosphere/kubeaddons-kommander@testing-1.20-1.4.4-rc.2,https://github.com/mesosphere/kubeaddons-dispatch@stable-1.20-1.4.6,https://github.com/mesosphere/kubernetes-base-addons@stable-1.20-4.4.0])
      --cluster-name string           name used to prefix the cluster and all the created resources (default "konvoy")
      --force-push                    force push the cluster state
      --force-reduce-control-plane    allow a reduction for the number of control plane nodes in a cluster
      --force-upgrade                 run an upgrade on all control-plane and worker nodes if needed, ignoring upgrade safety checks
  -h, --help                          help for up
      --max-parallel-nodes string     set the number of nodes to upgrade in parallel. This can be an integer or a percentage of a nodePool. Set to 1 to run serially (requires --upgrade or --force-upgrade flag) (default "15%")
      --mode string                   apply operating mode to configuration, supported modes [default, fips] (default "default")
      --provisioner string            select a provisioner [aws|azure|gcp|vsphere|docker|none] (default "aws")
      --skip-credentials-display      skip displaying the admin credentials after the install
      --skip-provisioning-retry       do not retry the provisioning stage in case of errors
      --skip-state-upload             skip the upload of the state to Kubernetes cluster
      --target-node-pools strings     comma-separated list of target node pools
      --upgrade                       run an upgrade on all nodes requiring an upgrade
      --verbose                       enable debug level logging
      --with-checks                   execute checks after each deployment step
      --without-addons                skip installing the addons
      --without-draining              run an upgrade on all nodes requiring an upgrade, without draining the nodes first (requires --upgrade or --force-upgrade flag) (WARNING! usage can result in undefined behavior and service downtime)
  -y, --yes                           run command without prompting
```

### SEE ALSO

* [konvoy](../)	 - Deploy and manage Kubernetes clusters

