---
layout: layout.pug
navigationTitle: Resource Management
title: Resource Management
menuWeight: 50
beta: false
excerpt: Configure resources to be shared in a controlled fashion between multiple instances of Dispatch from a single cluster
---

# Manage resources

Pods launched from builds can be augmented with tolerations and other scheduling parameters. Backed by Tekton's pod template, [a wide range of parameters are supported](https://github.com/tektoncd/pipeline/blob/v0.14.2/docs/podtemplates.md) beyond tolerations, affinity, nodeSelector, etc.

Configure Dispatch instances globally to use a pod template by initializing the `tekton.configs.defaultPodTemplate` field in `values.yaml`. 

For example:

```yaml
tekton:
  configs:
    defaultPodTemplate: |
      schedulerName: default-scheduler
      tolerations:
      - effect: NoExecute
        key: node.kubernetes.io/not-ready
        operator: Exists
        tolerationSeconds: 600
```

This file configuration creates an entry in the `config-defaults` ConfigMap that is consumed by Tekton to launch pods with the following template:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: config-defaults
data:
  default-pod-template: |-
    schedulerName: default-scheduler
    tolerations:
    - effect: NoExecute
      key: node.kubernetes.io/not-ready
      operator: Exists
      tolerationSeconds: 600
  <...>
```

Installing Dispatch with this `values.yaml` injects all pods with specified tolerations.

## Customize a pod template at the repository level

You can also customize a pod template at a repository level; if you do, then the global default acts as a fallback configuration. This can be accomplished by creating a ConfigMap and configuring a repository to use that ConfigMap.

Consider the following template which adds a `nodeSelector` constraint:

```yaml
nodeSelector:
  disktype: ssd
```

To enforce this for all pipelineruns for a repository, create a ConfigMap:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: custom-pod-template-config
data:
  my-ssd-template: |-
    nodeSelector:
      disktype: ssd
```

And then create a repository using:

```bash
dispatch ci repository create --pod-template-config-map-name custom-pod-template-config --pod-template-config-map-key my-ssd-template ....
```

This would configure all the pipelineruns related to this repository to be launched with the specified pod template.

**Note**: The ConfigMap must be present in the same namespace as that of the repository.
