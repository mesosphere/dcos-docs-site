---
layout: layout.pug
navigationTitle: Kommander Platform Services
render: mustache
model: /dkp/kommander/1.3/data.yml
title: Kommander Platform Services
menuWeight: 3
excerpt: What are Kommander Platform Services
beta: true
enterprise: false
---

<!-- markdownlint-disable MD018 -->

#include /dkp/kommander/1.3/include/kba-addon-intro.tmpl

## Configuring Konvoy Platform Services

Platform Services are configured via the `addons` section under `ClusterConfiguration` within Konvoy's `cluster.yaml`

Platform Services are configured by referencing various Platform Services repositories. Konvoy comes pre-configured with [Base Platform Services](https://github.com/mesosphere/kubernetes-base-addons) repository. This repository provides all the Platform Services that make Konvoy an enterprise grade distribution, ready for day two operations.

In general, Platform-Services come in two categories:
- `ClusterAddon` - A Platform Service that is cluster-scoped.
- `Addon` - A Platform Service that is namespace-scoped.

Konvoy partners and users can create their own Platform Services repositories. For example, a storage partner can create a Platform Services repository to provide their CSI storage provisioner. A user can create a Platform Services repository to meet the requirements that all clusters created, in their organization, run specific services. The [Creating Platform Services]() section covers these details.


### Configuring Platform Services in `cluster.yaml`

The following example shows how to configure an additional {{ model.addon }} repository in the Konvoy `cluster.yaml` file.

In the configuration example below, we'll disable the bundled `awsebscsiprovisioner` in order to use an partner provided `awsebscsiprovisioner2`. Both these Platform Services are of the cluster-scoped `ClusterAddon` kind. Additionally the `cockroachdb` namespace-scoped Platform Service is enabled.

The example partner repository referenced via `configRepository` is `https://github.com/mesosphere/docs-addon-repo` and `configVersion` points to a tagged release within the repository.

```yaml
...
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta2
metadata:
  name: y-west
  ...
spec:
  ...
  addons:
  - configRepository: https://github.com/mesosphere/kubernetes-base-addons
    configVersion: testing-1.19-3.2.0
    addonsList:
    - name: awsebscsiprovisioner
      enabled: false
    ...
  - configRepository: https://github.com/mesosphere/docs-addon-repo
    configVersion: stable-0.1
    addonsList:
    - name: awsebscsiprovisioner2
      enabled: true
    - name: cockroachdb
      enabled: true
...
```

The second repository configured, in the example above, is our [sample docs-{{ model.addon }} ][sample_repo].
It contains the {{ model.addon }} `awsebscsiprovisioner2` and `cockroachdb` Platform Services. 
Since `awsebscsiprovisioner2` is a copy of the `awsebscsiprovisioner` from the `kubernetes-base-addons` repository. This example shows you can turn the storage provisioner in the `kubernetes-base-addons` repository off and provide a storage provisioner with another {{ model.addon }} repository.

When you run `konvoy up` with the above `cluster.yaml` configuration you see the following output. All {{ model.addon }} requiring persistent storage get installed after `awsebscsiprovisioner2` providing a default `StorageClass`. For example, `cockroachdb, elasticsearch, and velero.

```yaml
STAGE [Deploying Enabled Addons]
konvoyconfig                                                           [OK]
dashboard                                                              [OK]
reloader                                                               [OK]
fluentbit                                                              [OK]
external-dns                                                           [OK]
opsportal                                                              [OK]
cert-manager                                                           [OK]
defaultstorageclass-protection                                         [OK]
gatekeeper                                                             [OK]
awsebscsiprovisioner2                  <<<                             [OK]
traefik                                                                [OK]
prometheus                                                             [OK]
cockroachdb                                                            [OK]
dex                                                                    [OK]
velero                                                                 [OK]
prometheusadapter                                                      [OK]
kube-oidc-proxy                                                        [OK]
dex-k8s-authenticator                                                  [OK]
traefik-forward-auth                                                   [OK]
kommander                                                              [OK]
elasticsearch-curator                                                  [OK]
elasticsearch                                                          [OK]
elasticsearchexporter                                                  [OK]
kibana                                                                 [OK]

Kubernetes cluster and addons deployed successfully!
```

## Related information

For information on related topics or procedures, refer to the following:

- [Current {{ model.addon }} Release Information](../release-notes/kubernetes-base-addon)
- [{{ model.addon }} Configuration Requirements](../addons/requirements/)
