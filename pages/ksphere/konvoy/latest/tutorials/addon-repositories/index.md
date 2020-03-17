---
layout: layout.pug
navigationTitle: Addon Repositiories
title: Addon Repositories
menuWeight: 5
excerpt: Learn more about addon repositories

---
## Addon Repositories

Konvoy uses a `cluster.yaml` file to configure the `ClusterProvisioner` (infrastruture configuration) and the `ClusterConfiguration` (Kubernetes configuration).

The `Kubernetes configuration` consists of two parts, the configuration of the kubernetes version and the `addons configuration`.

Addons are contributed by referencing an `addon repository`. Konvoy comes configured with the [kubernetes-base-addons repository](https://github.com/mesosphere/kubernetes-base-addons). This repository provides all the addons that make Konvoy an enterprise grade distribution, ready for day two operations.

Konvoy Partners and users can create their own addon repositories. For example, a storage partner can create an addon repository to provide his csi storage provisioner. A user can create an addon repository meeting the requirement that all clusters created, in their organization, run specific services.

This topic describes the following:

- The `structure` of an addon repository
- How to `configure` an addon repository in the Konvoy `cluster.yaml`
- The `addon yaml configuration` for different kinds of addons. For example, storage and workloads addons.

<p class="message--note"><strong>NOTE: </strong><code>AddonRepository</code>, the CRD and type provided by <code>kubeaddons</code>, is not the same as the addon repositories described in this topic.</p>

### Addon Repository Structure

The following shows the layout and structure of an addon repository. This example contains one addon for `cockroachdb`.

```yaml
my-addon-repo
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
   |     |- ...

   |- repository.yaml                        <- ...
   |- README.md
```

The folders in the addon repository have the following roles:

- `addons/` - Contains the actual manifests for addon resources.
- `metadata/` - Contains the static metadata for each addon in `addons/`.
- `deployments/` - Contains the default addons specific to the version of Kubernetes in use.

Here is a link to a [sample repository](https://github.com/realmbgl/my-addon-repo) you can experiment with and use as a template for your own addon repository. It contains two addons `awsebscsiprovisioner2` and `cockroachdb`.

### Configure an Addon Repository in cluster.yaml

The following example shows how to configure an additional addon repository in the Konvoy `cluster.yaml` file.

```yaml
...
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta1
metadata:
  name: y-west
  ...
spec:
  ...
  addons:
  - configRepository: https://github.com/mesosphere/kubernetes-base-addons
    configVersion: stable-1.16.4-2
    addonsList:
    - name: awsebscsiprovisioner
      enabled: false
    ...
  - configRepository: https://github.com/realmbgl/my-addon-repo
    configVersion: stable-0.4
    addonsList:
    - name: awsebscsiprovisioner2
      enabled: true  
    - name: cockroachdb
      enabled: true
...
```

The second repository configured, in the example above, is our [sample my-addon-repo](https://github.com/realmbgl/my-addon-repo). It contains the two addons `awsebscsiprovisioner2` and `cockroachdb`. `awsebscsiprovisioner2` is a copy of the `awsebscsiprovisioner` from  the `kubernetes-base-addons` repository. This example shows you can turn the storage provisioner in the `kubernetes-base-addons` repository off and provide a storage provisioner with another addon repository.

When you run `konvoy up` with the above `cluster.yaml` configuration you see the following output. All addons requiring persistent storage get installed after `awsebscsiprovisioner2` providing a default `StorageClass`. For example, cockroachdb, elasticsearch, and velero.

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
elasticsearch                                                          [OK]
elasticsearchexporter                                                  [OK]
kibana                                                                 [OK]

Kubernetes cluster and addons deployed successfully!
```

### Addons

In this section we look at different addon configurations.

#### Storage Provider Addons

This is a link to a sample [storage provider addon](https://github.com/realmbgl/my-addon-repo/blob/master/addons/awsebscsiprovisioner/0.4.x/awsebscsiprovisioner-1.yaml). This is of kind `ClusterAddon`. This means there can only be one per Kubernetes cluster. The addons `chartReference` points to the `helm chart` of the storage provider.

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

##### labels

- `kubeaddons.mesosphere.io/name` - Addon name
- `kubeaddons.mesosphere.io/provides` - Addon functionality. For example, storageclass.

##### annotations

- `catalog.kubeaddons.mesosphere.io/addon-revision` - `appVersion-<revison>`
- `appversion.kubeaddons.mesosphere.io/awsebscsiprovisioner` - Helm chart `appVersion`
- `values.chart.helm.kubeaddons.mesosphere.io/awsebscsiprovisioner` - URI to helm chart `values.yaml` file

##### matchLabels

- `kubeaddons.mesosphere.io/name: defaultstorageclass-protection` - Requires the `defaulstorageclass-protection` addon

#### Workload Addons

This is a sample for a [workload addon](https://github.com/realmbgl/my-addon-repo/blob/master/addons/cockroachdb/19.2.x/cockroachdb-1.yaml). Its of kind `Addon`. The addons `chartReference` points to the `helm chart` of the workload.

```yaml
---
apiVersion: kubeaddons.mesosphere.io/v1beta1
kind: Addon
metadata:
  name: cockroachdb
  namespace: default
  labels:
    kubeaddons.mesosphere.io/name: cockroachdb
    ## TODO: we're temporarily supporting dependency on an existing default storage class
    ## on the cluster, this hack will trigger re-queue on Addons until one exists
    kubeaddons.mesosphere.io/hack-requires-defaultstorageclass: "true"
  annotations:
    catalog.kubeaddons.mesosphere.io/addon-revision: "19.2.2-1"
    appversion.kubeaddons.mesosphere.io/cockroachdb: "19.2.2"
    values.chart.helm.kubeaddons.mesosphere.io/cockroachdb: "https://raw.githubusercontent.com/helm/charts/dfea2ba119be53f0d3f7d70def66e54f9e259768/stable/cockroachdb/values.yaml"
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

##### labels

- `kubeaddons.mesosphere.io/name` - Addon name
- `kubeaddons.mesosphere.io/hack-requires-defaultstorageclass` - Set to `true` if this addon requires a `default StorageClass`

##### annotations

- `catalog.kubeaddons.mesosphere.io/addon-revision`- `appVersion-<revison>`
- `appversion.kubeaddons.mesosphere.io/awsebscsiprovisioner` - Helm chart `appVersion`
- `values.chart.helm.kubeaddons.mesosphere.io/awsebscsiprovisioner` - URI to helm chart `values.yaml` file
