---
layout: layout.pug
navigationTitle: Platform services
title: Addon Repositories
menuWeight: 5
excerpt: Learn more about platform services
beta: true
render: mustache
model: /dkp/kommander/1.3/data.yml
---
## {{ model.addon }}

Konvoy uses a `cluster.yaml` file to configure the `ClusterProvisioner` (infrastruture configuration) and the `ClusterConfiguration` (Kubernetes configuration).

The `ClusterConfiguration` consists of several parts, including the configuration of the kubernetes version and the `addons` configuration.

{{ model.addon }} are configured by referencing a {{ model.addon }} repository. Konvoy comes configured with the [kubernetes {{ model.addon }} repository][addons_repo]. This repository provides all the {{ model.addon }} that make Konvoy an enterprise grade distribution, ready for day two operations.

Konvoy partners and users can create their own {{ model.addon }} repositories. For example, a storage partner can create a {{ model.addon }} repository to provide their CSI storage provisioner. A user can create a {{ model.addon }} repository to meet the requirements that all clusters created, in their organization, run specific services.

This topic describes the following:

- The `structure` of a {{ model.addon }} repository
- How to `configure` a {{ model.addon }} repository in the Konvoy `cluster.yaml`
- The `addon yaml configuration` for different kinds of {{ model.addon }}. For example, storage and workload {{ model.addon }}.

<p class="message--note"><strong>NOTE: </strong><code>AddonRepository</code>, the CRD and type provided by <code>kubeaddons</code>, is not the same as the {{ model.addon }} repositories described in this topic.</p>

### {{ model.addon }} Repository Structure

The following shows the layout and structure of an {{ model.addon }} repository. This example contains one description for `cockroachdb`.

```text
docs-addon-repo
   |- addons
   |     |- cockroachdb
   |           |- 19.2.x                     <- appVersion <major>.<minior>.x
   |                 |- cockroachdb-1.yaml   <- Addon yaml manifest, filename with revision

   |- metadata
   |     |- root.yaml                        <- Addon metadata
   |     |- static
   |           |- cockroachdb                <- folder for logo, overview documentation, ...
   |                 |- logo.svg
   |                 |- overview.md

   |- deployments
   |     |- 1.16                                   <- Kubernetes Version
   |           |- default-addons-deployments.yaml  <-  AddonsDeployment definition
   |- repository.yaml                        <- AddonRepository definition
   |- README.md
```

The folders in the {{ model.addon }} repository have the following roles:

- `addons/` - Contains the actual manifests for {{ model.addon }} resources.
- `metadata/` - Contains the static metadata for the {{ model.addon }} in `addons/`.
- `deployments/` - Contains the default {{ model.addon }} specific to the version of Kubernetes in use.

Here is a link to a [sample repository][sample_repo] you can experiment with and use as a template for your own {{ model.addon }} repository. It contains the {{ model.addon }} `awsebscsiprovisioner2` and `cockroachdb`.

### Configure {{ model.addon }} in cluster.yaml

The following example shows how to configure an additional {{ model.addon }} repository in the Konvoy `cluster.yaml` file. In the configuration below, the awsebscsiprovisioner2 {{ model.addon }} are of kind `ClusterAddon` described in the [Storage Provider {{ model.addon }} ][storage_provider_addons_section] section. The cockroachdb addon is of kind `Addon` described in the [Workload {{ model.addon }} ][workload_addons_section] section. The `configVersion` (in this case, `configVersion: stable-0.1`) points to the tagged release in your additional {{ model.addon }} repository.

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

The second repository configured, in the example above, is our [sample docs-{{ model.addon }} ][sample_repo]. It contains the {{ model.addon }} `awsebscsiprovisioner2` and `cockroachdb`. `awsebscsiprovisioner2` is a copy of the `awsebscsiprovisioner` from the `kubernetes-base-addons` repository. This example shows you can turn the storage provisioner in the `kubernetes-base-addons` repository off and provide a storage provisioner with another {{ model.addon }} repository.

When you run `konvoy up` with the above `cluster.yaml` configuration you see the following output. All {{ model.addon }} requiring persistent storage get installed after `awsebscsiprovisioner2` providing a default `StorageClass`. For example, cockroachdb, elasticsearch, and velero.

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

###{{ model.addon }}  

In this section we look at different {{ model.addon }} configurations.

#### Storage Provider{{ model.addon }}  

This is a link to a sample [storage provider {{ model.addon }} ][storage_provider_addon] that would get created in a partner's external repository. This is of kind `ClusterAddon`. This means there can only be one per Kubernetes cluster. The {{ model.addon }} `chartReference` points to the `helm chart` of the storage provider.

```yaml
---
apiVersion: kubeaddons.mesosphere.io/v1beta1
kind: ClusterAddon
metadata:
  name: awsebscsiprovisioner2
  labels:
    kubeaddons.mesosphere.io/name: awsebscsiprovisioner2
    kubeaddons.mesosphere.io/provides: storageclass
  annotations:
    catalog.kubeaddons.mesosphere.io/addon-revision: "0.4.0-1"
    appversion.kubeaddons.mesosphere.io/awsebscsiprovisioner: "0.4.0"
    values.chart.helm.kubeaddons.mesosphere.io/awsebscsiprovisioner: "https://raw.githubusercontent.com/mesosphere/charts/6c43b8ab10108fb1adba5c6dd10e800e5f1abdd0/stable/awsebscsiprovisioner/values.yaml"
spec:
  namespace: kube-system
  requires:
    - matchLabels:
        kubeaddons.mesosphere.io/name: defaultstorageclass-protection
  kubernetes:
    minSupportedVersion: v1.15.6
  cloudProvider:
    - name: aws
      enabled: true
  chartReference:
    chart: awsebscsiprovisioner
    repo: https://mesosphere.github.io/charts/stable
    version: 0.3.3
    values: |
      ---
      resizer:
        enabled: false
      snapshotter:
        enabled: true
      provisioner:
        enableVolumeScheduling: true
      storageclass:
        isDefault: true
```

##### metadata.labels

- `kubeaddons.mesosphere.io/name` - {{ model.addon }} name
- `kubeaddons.mesosphere.io/provides` - {{ model.addon }} functionality. For example, storageclass.

##### metadata.annotations

- `catalog.kubeaddons.mesosphere.io/addon-revision` - `appVersion-<revison>`
- `appversion.kubeaddons.mesosphere.io/awsebscsiprovisioner` - Helm chart `appVersion`
- `values.chart.helm.kubeaddons.mesosphere.io/awsebscsiprovisioner` - URI to helm chart `values.yaml` file

##### spec.requires[].matchLabels

- `kubeaddons.mesosphere.io/name: defaultstorageclass-protection` - Requires the `defaulstorageclass-protection` addon

#### Workload {{ model.addon }}  

This is a sample for [workload {{ model.addon }} ][workload_addon] that would get created in a partner's external repository. This is of kind `Addon`. The {{ model.addon }} `chartReference` points to the `helm chart` of the workload.

```yaml
---
apiVersion: kubeaddons.mesosphere.io/v1beta1
kind: Addon
metadata:
  name: cockroachdb
  namespace: default
  labels:
    kubeaddons.mesosphere.io/name: cockroachdb
    # TODO: we're temporarily supporting dependencies on an existing default storage class
    # on the cluster, this hack will trigger re-queue on Addons until one exists
    kubeaddons.mesosphere.io/hack-requires-defaultstorageclass: "true"
  annotations:
    catalog.kubeaddons.mesosphere.io/addon-revision: "19.2.2-1"
    appversion.kubeaddons.mesosphere.io/cockroachdb: "19.2.2"
    values.chart.helm.kubeaddons.mesosphere.io/cockroachdb: "https://raw.githubusercontent.com/cockroachdb/helm-charts/5fa0123/cockroachdb/values.yaml"
spec:
  kubernetes:
    minSupportedVersion: v1.15.0
  cloudProvider:
    - name: aws
      enabled: true
    - name: azure
      enabled: true
    - name: docker
      enabled: false
    - name: none
      enabled: true
  chartReference:
    chart: stable/cockroachdb
    version: 3.0.2
```

##### metadata.labels

- `kubeaddons.mesosphere.io/name` - Addon name
- `kubeaddons.mesosphere.io/hack-requires-defaultstorageclass` - Set to `true` if this addon requires a `default StorageClass`

##### metadata.annotations

- `catalog.kubeaddons.mesosphere.io/addon-revision`- `appVersion-<revison>`
- `appversion.kubeaddons.mesosphere.io/awsebscsiprovisioner` - Helm chart `appVersion`
- `values.chart.helm.kubeaddons.mesosphere.io/awsebscsiprovisioner` - URI to helm chart `values.yaml` file

[addons_repo]: https://github.com/mesosphere/kubernetes-base-addons
[sample_repo]: https://github.com/mesosphere/docs-addon-repo
[storage_provider_addon]: https://github.com/mesosphere/docs-addon-repo/blob/master/addons/awsebscsiprovisioner/0.4.x/awsebscsiprovisioner-1.yaml
[storage_provider_addons_section]: #storage-provider-addons
[workload_addon]: https://github.com/mesosphere/docs-addon-repo/blob/master/addons/cockroachdb/19.2.x/cockroachdb-1.yaml
[workload_addons_section]: #workload-addons
