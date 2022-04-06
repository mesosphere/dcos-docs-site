---
layout: layout.pug
navigationTitle: DKP 2.2.0 Release Notes
title: DKP 2.2 Release Notes
menuWeight: 10
excerpt: View release-specific information for DKP 2.2.0
enterprise: false
beta: false
---

**D2iQ&reg; Kommander&reg; (DKP&reg;) version 2.2 was released on April 6, 2022.**

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download DKP[/button]

**Note:** In DKP 2.2, the Konvoy and Kommander binaries have been merged into a single binary, which you can find by selecting the DKP button above. 

[Download](../../download/) and [install](../../install/) the latest version to get started.

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download Kommander. New customers must contact their sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download or install this product.</p>

## Release summary

Welcome to D2iQ Kubernetes Platform (DKP) 2.2! This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages used in Konvoy. In this release, we are beginning the process of combining our two flagship products, Konvoy and Kommander, into a single DKP product with two service level options: DKP Enterprise for multi-cluster environments, and DKP Essential for single-cluster environments.

DKP 2.2 supports Kubernetes versions between 1.21.0 and 1.22.x. Any cluster you want to attach using DKP 2.2 must be running a Kubernetes version in this range.

### Supported versions

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.21.0 |
|**Maximum** | 1.22.x |
|**Default** | 1.22.0|

## New features and capabilities

The following features and capabilities are new for Version 2.2.

### Integrated DKP Upgrade

You can now upgrade Konvoy and Kommander as a single fluid process using a combination of the [DKP CLI](../../cli/dkp) and the UI to upgrade your environment.

For more information, see [DKP Upgrade](../../dkp-upgrade)

### Integration with VMware vSphere

You can use CAPI vSphere Provider while provisioning a [DKP cluster on vSphere](/dkp/konvoy/2.2/choose-infrastructure/vsphere/), which allows you to manage bootstrapping of VMs on a DKP cluster. This gives you improved productivity and speed of deploying VMs on DKP in a VMWare environment, including FIPS builds and air-gapped deployments.

### Zero downtime upgrades for air-gapped deployments

You can now use your laptop or USB drive to transfer pre-created air-gapped bundles, including OS dependencies and DKP binaries into your air-gapped environment with no external connectivity. This improves the availability of the DKP air-gapped deployment and productivity of your IT operations team.

For more information, see the [air-gapped bundle](????????) documentation. 

### Unified DKP user interfaces

The unified DKP user interface provides a smooth experience independent of where you start your journey. A DKP Essential customer can simply update your license to access DKP Enterprise features without having to learn another interface.

### Kaptain AI/ML, D2iQ’s AI/ML offering

For better integration with DKP 2.2 you can launch Kaptain as a catalog application, and also support other platforms such as Amazon AWS, AKS, and Microsoft Azure EKS. This extends D2iQ’s openness to support Kubernetes platforms beyond DKP with Kaptain. Kaptain enables an organization to develop, deploy, and run entire ML workloads in production, at scale, with consistency and reliability.

### DKP Insights

This new predictive analytics tool provides greater support productivity, speed, and reduced costs. The [DKP Insights](../../insights/) Engine collects events and metrics on the Attached cluster, and uses rule-based heuristics on potential problems of varying criticality, so they can be quickly identified and resolved. These Insights are then forwarded and displayed in the DKP Insights Dashboard, where it assists you with routine tasks such as:

- Resolving common issues
- Monitoring resource usage
- Checking security issues
- Verifying workloads and clusters follow best practices

## Component updates

The following services and service components will be upgraded to the listed version:

| Platform Application                           | Version | Component Versions                                                                                                        |
|------------------------------------------------|---------|---------------------------------------------------------------------------------------------------------------------------|
| [kube-prometheus-stack][kube-prometheus-stack] | 33.1.4  | chart: 33.1.4- <br>prometheus-operator: 0.57.0<br>prometheus: 2.33.4<br>prometheus alertmanager: 0.23.0<br>grafana: 8.3.6 |
| centralized-kubecost                           | 0.20.0  |                                                                                                                           |
| cert-manager                                   | 0.2.7   |                                                                                                                           |
| dex                                            | 2.9.10  |                                                                                                                           |
| external-dns                                   | 2.20.5  |                                                                                                                           |
| fluent-bit                                     | 0.16.2  |                                                                                                                           |
| gatekeeper                                     | 0.6.8   |                                                                                                                           |
| grafana-logging                                | 6.16.14 |                                                                                                                           |
| grafana-loki                                   | 0.33.1  |                                                                                                                           |
| istio                                          | 1.9.1   |                                                                                                                           |
| jaeger                                         | 2.21.0  |                                                                                                                           |
| karma                                          | 2.0.0   |                                                                                                                           |
| kiali                                          | 1.29.1  |                                                                                                                           |
| knative                                        | 0.18.3  |                                                                                                                           |
| kube-oidc-proxy                                | 0.2.5   |                                                                                                                           |
| kube-prometheus-stack                          | 18.1.1  |                                                                                                                           |
| kubecost                                       | 0.20.0  |                                                                                                                           |
| kubefed                                        | 0.9.0   |                                                                                                                           |
| kubernetes-dashboard                           | 5.0.2   |                                                                                                                           |
| kubetunnel                                     | 0.0.8   |                                                                                                                           |
| logging-operator                               | 3.15.0  |                                                                                                                           |
| metallb                                        | 0.12.2  |                                                                                                                           |
| minio-operator                                 | 4.1.7   |                                                                                                                           |
| nfs-server-provisioner                         | 0.6.0   |                                                                                                                           |
| nvidia                                         | 0.4.3   |                                                                                                                           |
| project-grafana-logging                        | 6.16.14 |                                                                                                                           |
| project-grafana-loki                           | 0.33.1  |                                                                                                                           |
| project-logging                                | 1.0.0   |                                                                                                                           |
| prometheus-adapter                             | 2.11.1  |                                                                                                                           |
| reloader                                       | 0.0.99  |                                                                                                                           |
| thanos                                         | 0.4.5   |                                                                                                                           |
| traefik                                        | 10.3.0  |                                                                                                                           |
| traefik-forward-auth                           | 0.3.2   |                                                                                                                           |
| velero                                         | 3.1.1   |                                                                                                                           |

## Known issues

### Overriding configuration for kube-oidc-proxy and traefik-forward-auth

Configuration overrides for kube-oidc-proxy and traefik-forward-auth platform applications must be manually applied for each cluster that requires custom configuration on top of the default configuration. Passing in the configuration via the CLI installer *will not work*. Instead, you must edit the cluster's custom configuration in the appropriate `FederatedConfigMap`'s `spec.overrides` list. For kube-oidc-proxy, the `FederatedConfigMap` is called `kube-oidc-proxy-overrides`, and for traefik-forward-auth, it is called `traefik-forward-auth-kommander-overrides`. See below for an example to override the kube-oidc-proxy configuration to use a custom domain `mycluster.domain.dom`:

```bash
kubectl edit federatedconfigmap kube-oidc-proxy-overrides -n kommander
```

Modify `oidc.issuerUrl` under the `values.yaml` key to override it for the `host-cluster` cluster:

```sh
apiVersion: types.kubefed.io/v1beta1
kind: FederatedConfigMap
metadata:
  name: kube-oidc-proxy-overrides
  namespace: kommander
[...]
spec:
  overrides:
  - clusterName: host-cluster
    clusterOverrides:
    - op: add
      path: /data
      value:
        values.yaml: |
          initContainers: []
          oidc:
            caPEM: |
              <redacted>
            caSecretName: ""
            clientId: kube-apiserver
            clientSecret:
              value: <redacted>
            groupsClaim: groups
            groupsPrefix: 'oidc:'
            issuerUrl: mycluster.domain.dom/dex
            usernameClaim: email
[...]
```

#### Default update strategy changed to "delete first" for Preprovisioned clusters

A "create first" update strategy first creates a new machine, then deletes the old one. While this strategy works when machine inventory can grow on demand, it does not work if there is a fixed number of machines. Most Preprovisioned clusters have a fixed number of machines. To enable updates for Preprovisioned clusters, DKP uses the "delete first" update strategy, which first deletes an old machine, then creates a new one.

New clusters use the "delete first" strategy by default. Existing clusters are switched to the "delete first" strategy whenever their machines are updated with `update controlplane` and `update nodepool`.

## Additional resources

<!-- Add links to external documentation as needed -->

For information about working with native Kubernetes, see the [Kubernetes documentation][kubernetes-doc].

[kubernetes-doc]: https://kubernetes.io/docs/home/
