---
layout: layout.pug
navigationTitle: Dependencies
title: Addon Dependencies
menuWeight: 7
excerpt: Understand addon dependencies and interactions
beta: false
enterprise: false
---

<!-- markdownlint-disable MD018 -->

When deploying Konvoy, addons are a integral part of the cluster's functionality. When deploying or troubleshooting addons, it helps to understand how addons interact and may require other addons as dependencies.

If an addon's dependency does not successfully deploy, the addon requiring that dependency does not successfully deploy. Addon dependencies are determined by their `.spec.requires` key value pair item.

For example, the cert-manager addon is a dependency of traefik. If we take a look at the traefik `ClusterAddon` object, we see the following `.spec.requires` key value pair item:

```yaml
   - matchLabels:
        kubeaddons.mesosphere.io/name: cert-manager
```

As indicated by the key `matchLabels`, the addon looks for its dependencies using labels on objects.

If we then view the `.metadata.labels` key value pair item of the cert-manager `ClusterAddon` object, we see the following label:

```yaml
   kubeaddons.mesosphere.io/name: cert-manager
```

In this example, if the cert-manager addon does not deploy, the traefik addon does not deploy.

In addition to understanding why an addon does not deploy, these concepts help troubleshoot an addon not working properly. An addon dependency could not be healthy and cause issues. The table below lists Konvoy addons and their dependencies.

|  **Addon** | **Dependencies** |
| --- | --- |
|  awsebscsiprovisioner | `kubeaddons.mesosphere.io/name: defaultstorageclass-protection` |
|  awsebsprovisioner | `kubeaddons.mesosphere.io/name: defaultstorageclass-protection` |
|  defaultstorageclass-protection | `kubeaddons.mesosphere.io/name: cert-manager` |
|  dex | `kubeaddons.mesosphere.io/provides: ingresscontroller` |
|  dex-k8s-authenticator | `kubeaddons.mesosphere.io/name: dex`<br/>`kubeaddons.mesosphere.io/provides: ingresscontroller` |
|  elasticsearch-curator | `kubeaddons.mesosphere.io/name: elasticsearch` |
|  elasticsearchexporter | `kubeaddons.mesosphere.io/name: elasticsearch` |
|  flagger | `kubeaddons.mesosphere.io/name: istio` |
|  fluentbit | `kubeaddons.mesosphere.io/name: elasticsearch` |
|  gatekeeper | `kubeaddons.mesosphere.io/name: cert-manager` |
|  gcpdisk-csi-driver | `kubeaddons.mesosphere.io/name: defaultstorageclass-protection` |
|  gcpdiskprovisioner | `kubeaddons.mesosphere.io/name: defaultstorageclass-protection`<br/>`kubeaddons.mesosphere.io/name: gcpdisk-csi-driver` |
|  [experimental]istio[/experimental] | `kubeaddons.mesosphere.io/name: cert-manager` |
|  kibana | `kubeaddons.mesosphere.io/name: elasticsearch` |
|  kube-oidc-proxy | `kubeaddons.mesosphere.io/provides: ingresscontroller`<br/>`kubeaddons.mesosphere.io/name: cert-manager<br/>kubeaddons.mesosphere.io/name: dex` |
|  localvolumeprovisioner | `kubeaddons.mesosphere.io/name: defaultstorageclass-protection` |
|  prometheusadapter | `kubeaddons.mesosphere.io/name: prometheus` |
|  traefik | `kubeaddons.mesosphere.io/name: cert-manager` |
|  traefik-forward-auth | `kubeaddons.mesosphere.io/name: dex`<br/>`kubeaddons.mesosphere.io/provides: ingresscontroller` |
|  velero | `kubeaddons.mesosphere.io/provides: ingresscontroller` |

Some dependency labels in the above table have a label key of `kubeaddons.mesosphere.io/provides`. The table below lists multiple addons that can have these labels.

|  **`kubeaddons.mesosphere.io/provides` value** | **Addon(s)** |
| --- | --- |
|  `storageclass` | awsebsprovisioner<br/>azurediskprovisioner<br/>awsebscsiprovisioner<br/>gcpdiskprovisioner<br/>localvolumeprovisioner |
|  `nvidia` | nvidia |
|  `csi-driver` | azuredisk-csi-driver<br/>gcpdisk-csi-driver |
|  `loadbalancer` | metallb |
|  `ingresscontroller` | traefik |

## Related information

For information on related topics or procedures, refer to the following:

- [Introduction to KBA](../../addons)
- [Current KBA Release Information](../../release-notes/kubernetes-base-addon)
- [Create an Addon Repository](../addon-repositories)
