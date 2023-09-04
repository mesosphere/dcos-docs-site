---
layout: layout.pug
navigationTitle:  Node Pools with Dispatch and Konvoy
title:  Node Pools with Dispatch and Konvoy
menuWeight: 20
beta: false
excerpt: Use node pools with Dispatch and Konvoy
---

It is often important to isolate Dispatch builds and components onto dedicated
node pools for security or performance reasons. This topic covers how to
configure node pools in D2iQ's Kubernetes distribution, Konvoy, to be used with
Dispatch.

# Pre-requisites

* A [working Konvoy cluster](/dkp/konvoy/latest/install/)

# Setup Node Pools

In your Konvoy cluster.yaml, first add the pool to your `nodePools` list in the `ClusterProvisioner` object:

```
  - name: dispatch
    indexType: positional
    count: 10
    machine:
      rootVolumeSize: 80
      rootVolumeType: gp2
      imagefsVolumeEnabled: true
      imagefsVolumeSize: 160
      imagefsVolumeType: gp2
      imagefsVolumeDevice: xvdb
      type: m5.2xlarge
```

Set the `count` and `type` as necessary, then add labels and taints for the nodes to the `nodePools` list in the
`ClusterConfiguration` object. A "[taint](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/)" in Kubernetes is a restriction
on a node to ensure that only pods with a particular "toleration" are scheduled onto it.

```
  - name: dispatch
    labels:
      - key: konvoy.mesosphere.com/node_pool
        value: dispatch
    taints:
      - key: konvoy.mesosphere.com/node_pool
        value: dispatch
        effect: NoExecute
```

The taint key and value can be anything you want, but it should be unique.

For a more detailed guide on configuring node pools in Konvoy, see [the official Konvoy documentation](/dkp/konvoy/latest/install/node-pools/).

# Configure Dispatch

Next, Dispatch needs to be configured in the `cluster.yaml` to use tolerations when creating pods.

To schedule only the Dispatch tasks on the node pool, set the Tekton default pod template to use the
tolerations:

```
    - configRepository: https://github.com/mesosphere/kubeaddons-dispatch
      configVersion: stable-1.16-1.3.0
      addonsList:
        - name: dispatch
          enabled: true
          values: |
            tekton:
              configs:
                defaultPodTemplate: |
                  tolerations:
                  - effect: NoExecute
                    key: konvoy.mesosphere.com/node_pool
                    value: dispatch
                    operator: Equal
```

However, you can configure all Dispatch components to use node pools:

```
    - configRepository: https://github.com/mesosphere/kubeaddons-dispatch
      configVersion: stable-1.16-1.3.0
      addonsList:
        - name: dispatch
          enabled: true
          values: |
            dispatch:
              tolerations:
              - effect: NoExecute
                key: konvoy.mesosphere.com/node_pool
                value: dispatch
                operator: Equal
            argo-cd:
              controller:
                tolerations:
                - effect: NoExecute
                  key: konvoy.mesosphere.com/node_pool
                  value: dispatch
                  operator: Equal
              server:
                tolerations:
                - effect: NoExecute
                  key: konvoy.mesosphere.com/node_pool
                  value: dispatch
                  operator: Equal
              repoServer:
                tolerations:
                - effect: NoExecute
                  key: konvoy.mesosphere.com/node_pool
                  value: dispatch
                  operator: Equal
            tekton-dashboard:
              tolerations:
              - effect: NoExecute
                key: konvoy.mesosphere.com/node_pool
                value: dispatch
                operator: Equal
            tekton:
              tolerations:
              - effect: NoExecute
                key: konvoy.mesosphere.com/node_pool
                value: dispatch
                operator: Equal
              configs:
                defaultPodTemplate: |
                  tolerations:
                  - effect: NoExecute
                    key: konvoy.mesosphere.com/node_pool
                    value: dispatch
                    operator: Equal
```

# Deploy

To deploy your changes to your Konvoy cluster, run `konvoy up`.

# Configure a custom node pool for a repository

It is also possible to configure tolerations for a specific repository.

Create a ConfigMap containing the pod template:

```
apiVersion: v1
kind: ConfigMap
metadata:
  name: repo-tolerations
data:
  template: |-
    tolerations:
    - effect: NoExecute
      key: konvoy.mesosphere.com/node_pool
      value: dispatch
      operator: Equal
```

And then create a repository using:

```bash
dispatch ci repository create --pod-template-config-map-name=repo-tolerations --pod-template-config-map-key=template
```

This will configure the new repository to use the specified tolerations.
