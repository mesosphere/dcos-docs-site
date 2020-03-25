---
layout: layout.pug
navigationTitle: Addons
title: Addons
menuWeight: 8
excerpt: What are Addons and how are they managed
enterprise: false
---

Addons are applications managed by the Kubeaddons controller.
The controller is installed as part of a Konvoy cluster.
To manage implicit dependencies between applications, the custom resources Addon and ClusterAddon are used.
These resources define the application installation location, the application dependencies, and suitable providers for an application.

Addon and ClusterAddon records are then installed using the Kubernetes API. The kubeaddons controller manages the reconciliation of those definitions to install applications in the correct order.

## Installation

Konvoy installs the kubeaddons controller as part of `konvoy up` during the `deploy addons` stage.
If you remove the kubeaddons controller deployment and need to reinstall it, you can run `konvoy deploy addons`.

## Usage

A set of addons is added to your `cluster.yaml` file as part of `konvoy init`.
Addons are sets of applications, configured and tested to work together, that provide monitoring, logging, alerting, and backups.

Additional addons can be configured from other repositories such as our enterprise or community addon repositories, or your own custom repository.

### Simple

Addons are configured as part of the ClusterConfiguration record in the `cluster.yaml` file.
Addons are part of a git `configRepository` tagged as a `configVersion`.
Each of the items in the `addonsList` is an addon in that repository which has three possible keys: name, enabled, and values.

The `name` matches a name in an Addon record in that repository.

`enabled` specifies if that addon is enabled and should be installed.
A value of `false` indicates that addon should not be installed.
This is similar to omitting the addon from the list, but is used as a placeholder to make identification of possible addons to enable easier.
Addons that are enabled by default _should_ remain enabled as other addons _may_ depend on them.

`values` are used to override values that are passed to helm charts.
This field is not currently used for kudo operators and has no equivalent.

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta1
metadata:
  name: "1.3"
  creationTimestamp: "2020-01-15T02:01:07Z"
spec:
  ...
  addons:
  - configRepository: https://github.com/mesosphere/kubernetes-base-addons
    configVersion: stable-1.16-1.2.0
    addonsList:
    - name: cert-manager
      enabled: true
    - name: external-dns
      enabled: false
```

In this example, `cert-manager` is installed with the D2iQ recommended configuration set in the `kubernetes-base-addons` repository on github as of the `stable-1.16-1.2.0` release.
`external-dns` is not enabled, but can be enabled if needed.

### Advanced

More advanced capabilities are also available.

#### Override helm chart values

For a bare-metal cluster (`konvoy init --provisioner=none`), `metallb` is enabled and a configuration template is provided.
If you add a list of addresses for metallb to use, it assigns those addresses to your LoadBalancer type Services.

```yaml
...
    - name: metallb
      enabled: true
      values: |
        configInline:
          address-pools:
          - name: default
            protocol: layer2
            # configure addresses for your network
            addresses: []
```

#### Add an addon from the Enterprise repository

```yaml
  addons:
  - configRepository: https://github.com/mesosphere/kubernetes-base-addons
    configVersion: stable-1.16-1.2.0
    addonsList:
    - name: cert-manager
      enabled: true
    ...
  - configRepository: https://github.com/mesosphere/kubeaddons-enterprise
    configVersion: v0.0.3
    addonsList:
    - name: zookeeper
      enabled: true
```

## Advanced Application of Kubeaddons

The Kubeaddons operator can be used to pattern and install your sets of software for your internal use, or for public consumption.

### Create an addon repository for your applications

Create a git repository that can be reached from a pod inside your cluster.

#### Repository Structure

See the [D2iQ base addons repository](https://github.com/mesosphere/kubernetes-base-addons) for an example and documentation of the repository structure.

#### Addon Record

Use an Addon record to define customized defaults and dependencies.
As shown in the example below, the metadata is where you define the name, namespace, labels, and annotations.
Labels are used for dependency checking.
Annotations are optional, but can be used for displaying the addon in the kommander catalog.

The `spec` is where the custom resource is defined.

Use the `cloudProvider` list for defining the cloud providers enabled or disabled by default.
If omitted or empty, the Addon is enabled for all cloud providers.
You can also define `values` as part of a provider. Values are added to the `cluster.yaml` file if that provider is selected.

Define dependencies using the `requires` key.
In this example, kibana will not initialize correctly if elasticsearch isn't running when it starts.
To satisfy this requirement there is a `matchLabels` entry that matches an addon whose label `kubeaddons.mesosphere.io/name` has the value `elasticsearch`.
The controller waits to install the kibana addon until the matching elasticsearch addon is installed and in a `ready` state.

```yaml
apiVersion: kubeaddons.mesosphere.io/v1beta1
kind: Addon
metadata:
  name: kibana
  namespace: kubeaddons
  labels:
    kubeaddons.mesosphere.io/name: kibana
  annotations:
    catalog.kubeaddons.mesosphere.io/addon-revision: "6.8.0-1"
    appversion.kubeaddons.mesosphere.io/kibana: "6.8.2"
    endpoint.kubeaddons.mesosphere.io/kibana: "/ops/portal/kibana"
    docs.kubeaddons.mesosphere.io/kibana: "https://www.elastic.co/guide/en/kibana/6.8/index.html"
    values.chart.helm.kubeaddons.mesosphere.io/kibana: "https://raw.githubusercontent.com/helm/charts/09004fa332094693e2e5fcffe474622ba15491ae/stable/kibana/values.yaml"
spec:
  kubernetes:
    minSupportedVersion: v1.15.6
  cloudProvider:
    - name: aws
      enabled: true
    - name: azure
      enabled: true
    - name: docker
      enabled: false
    - name: none
      enabled: true
  requires:
    - matchLabels:
        kubeaddons.mesosphere.io/name: elasticsearch
  chartReference:
    chart: stable/kibana
    # repo: https://kubernetes-charts.storage.googleapis.com/
    version: 3.2.5
    values: |
      ---
      image:
        tag: "6.8.2"

```

##### Helm (V2)

The above example is for a helm chart.
This is expressed using the `chartReference` map.
The `chart` and `version` keys reference the helm chart name, and version.
Use the optional `repo` key to point to a custom repository.
If `repo` is not specified, the [default helm chart](https://github.com/helm/charts/) repo is used.
Override the default chart values using the `values` key.
Changes made here are merged with the chart's `values.yaml` file when applied using helm.

##### Kudo (preview)

*NOTE:* Kudo support is in a preview state.

To define a kudo addon, replace the `chartReference` definition with a `kudoReference`.

```yaml
  kudoReference:
    package: kafka
    repo: https://kudo-repository.storage.googleapis.com/
    version: 1.0.0
```

Similarly to helm, you select the name from the repository with the `package` key.
Select the repository with the `repo` key.
Specify the version with the `version` key.

There is no way to override the kudo operator's `params` at this time.
