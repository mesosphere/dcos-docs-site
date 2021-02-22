---
layout: layout.pug
navigationTitle: Upgrade Istio when upgrading Konvoy CLI
title: Upgrade Istio when upgrading Konvoy CLI
menuWeight: 1
excerpt: Upgrade Istio when upgrading Konvoy CLI
beta: false
enterprise: false
---

If the [experimental]Istio[/experimental] addon is enabled while running Konvoy 1.6.x and you want to upgrade, you have to make further changes. Before running the `konvoy up --upgrade`, you must edit the istio-operator in the istio-system namespace.

Run this command:

```bash
kubectl edit istiooperator istio-default -n istio-system
```

Locate the `kiali` and `tracing` addons in this configuration and set them to `false`, then save this configuration.

Confirm that you no longer have a Kiali pod running in the istio-system namespace by running `kubectl get pods -n istio-system`. Previously, a `kiali` pod would likely be running if you had the default Istio addon setup and be named something like:

```bash
kiali-55766c967d-xvcxq                  1/1     Running     0          61m
```

After confirming Kiali is no longer running, complete the remaining steps of the Konvoy upgrade.

The [experimental][Kiali][kiali][/experimental] and [experimental][Jaeger][jaeger][/experimental] addons may be enabled at any time during or after the Konvoy upgrade. To enable, adjust your cluster.yaml file to include them:

```yaml
kind: ClusterConfiguration
  ...
  addons:
    - configRepository: https://github.com/mesosphere/kubernetes-base-addons
    ...
      addonsList:
      ...
        - name: jaeger # is currently in Experimental status. More information: https://docs.d2iq.com/dkp/konvoy/latest/version-policy/#experimental-status
          enabled: true
        - name: kiali # is currently in Experimental status. More information: https://docs.d2iq.com/dkp/konvoy/latest/version-policy/#experimental-status
          enabled: true
```

[jaeger]: https://www.jaegertracing.io/
[kiali]: https://kiali.io/
