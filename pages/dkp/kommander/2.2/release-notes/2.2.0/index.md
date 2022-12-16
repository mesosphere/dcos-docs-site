---
layout: layout.pug
navigationTitle: DKP 2.2.0 Release Notes
title: DKP 2.2 Release Notes
menuWeight: 10
excerpt: View release-specific information for DKP 2.2.0
enterprise: false
beta: false
---

**D2iQ&reg; Kommander&reg; (DKP&reg;) version 2.2 was released on April 8, 2022.**

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download DKP[/button]

**Note:** In DKP 2.2 the Konvoy and Kommander binaries have been merged into a single binary, which you can find by selecting the DKP button above.

[Download](../../download/) and [install](../../../../konvoy/2.2/choose-infrastructure/) the latest version to get started.

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download Kommander. New customers must contact their sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download or install this product.</p>

## Release summary

Welcome to D2iQ Kubernetes Platform (DKP) 2.2! This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages used in Konvoy. In this release, we are beginning the process of combining our two flagship products, Konvoy and Kommander, into a single DKP product with two service level options: DKP Enterprise for multi-cluster environments, and DKP Essential for single-cluster environments.

For this release, we are maintaining the documentation sets for individual platform components Konvoy and Kommander, while publishing some combined DKP documentation for processes, such as Upgrading DKP version.

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

You can now upgrade Konvoy and Kommander as a single fluid process using a combination of the [DKP CLI](../cli/dkp) and the UI to upgrade your environment.

For more information, see [DKP Upgrade](/dkp/kommander/2.2/dkp-upgrade)

### Integration with VMware vSphere

You can use CAPI vSphere Provider while provisioning a [DKP cluster on vSphere](/dkp/konvoy/2.2/choose-infrastructure/vsphere/), which allows you to manage bootstrapping of VMs on a DKP cluster. This gives you improved productivity and speed of deploying VMs on DKP in a VMWare environment, including FIPS builds and air-gapped deployments.

### Zero downtime upgrades for air-gapped deployments

You can now use your laptop or USB drive to transfer pre-created air-gapped bundles, including OS dependencies and DKP binaries into your air-gapped environment with no external connectivity. This improves the availability of the DKP air-gapped deployment and productivity of your IT operations team.

For more information, see the [air-gapped bundle](../../../../konvoy/2.2/choose-infrastructure) documentation in the choose infrastructure topics.

### Unified DKP user interfaces

The unified DKP user interface provides a smooth experience independent of where you start your journey. Both DKP Essential and DKP Enterprise customers will have similar experiences in the User Interface, with DKP Enterprise customers gaining access to additional features and benefits simply by entering their DKP Enterprise [license key](/dkp/kommander/2.2/licensing/).

### Kaptain AI/ML, D2iQ’s AI/ML offering

For better integration with DKP 2.2, you can launch Kaptain as a catalog application. It also supports other platforms such as Amazon AWS EKS and Microsoft Azure AKS. Kaptain extends D2iQ’s ability to support Kubernetes platforms beyond DKP. It further enables an organization to develop, deploy and run entire ML workloads in production, at scale, with consistency and reliability.

### DKP Insights

This new predictive analytics tool provides greater support productivity, speed, and reduced costs. The [DKP Insights](/dkp/kommander/2.2/insights/) Engine collects events and metrics on the Attached cluster, and uses rule-based heuristics on potential problems of varying criticality, so they can be quickly identified and resolved. These Insights are then forwarded and displayed in the DKP Insights Dashboard, where it assists you with routine tasks such as:

- Resolving common issues
- Monitoring resource usage
- Checking security issues
- Verifying workloads and clusters follow best practices

## Deprecations

### Flag default changes

For more information on using FIPS with Konvoy, see [FIPS 140-2 Compliance](../../../../konvoy/2.2/fips/)
The default value for flag `--with-aws-bootstrap-credentials` will be changing from `true` to `false` in version v2.3.0.

### Changes in behavior

A "create first" update strategy first creates a new machine, then deletes the old one. While this strategy works when machine inventory can grow on demand, it does not work if there is a fixed number of machines. Most Preprovisioned clusters have a fixed number of machines. To enable updates for Preprovisioned clusters, DKP uses the "delete first" update strategy, which first deletes an old machine, then creates a new one.

New clusters use the "delete first" strategy by default. Existing clusters are switched to the "delete first" strategy whenever those machines are updated with `update controlplane` and `update nodepool`.

## Component updates

When upgrading to this release, the following services and service components are upgraded to the listed version:


| Common Application Name | APP ID | Version | Component Versions |
|----------------------|--------------------- |---------|--------------------|
| Cert Manager | cert-manager | 1.7.1 | - chart: 1.7.1<br>- cert-manager: 1.7.1 |
| Chartmuseum | chartmuseum | 3.6.2 | - chart: 3.6.2<br>- chartmuseum: 3.6.2 |
| Dex | dex | 2.9.14  | - chart: 2.9.14<br>- dex: 2.22.0 |
| External DNS | external-dns | 6.1.8  | - chart: 6.1.8<br>- external-dns: 0.10.2 |
| Fluent Bit | fluent-bit | 0.19.20 | - chart: 0.19.20<br>- fluent-bit: 1.8.13 |
| Flux | kommander-flux | 0.27.4 |  |
| Gatekeeper | gatekeeper | 3.7.0 | - chart: 3.7.0<br>- gatekeeper: 3.7.0 |
| Grafana | grafana-logging | 6.22.0 | - chart: 6.22.0<br>- grafana: 8.3.6 |
| Loki | grafana-loki | 0.33.2 | - chart: 0.33.1<br>- loki: 2.2.1  |
| Istio | istio | 1.11.6 | - chart: 1.11.6<br>- istio: 1.11.5 |
| Jaeger | jaeger | 2.29.0  | - chart: 2.29.0<br>- jaeger: 1.31.0 |
| Karma | karma | 2.0.1 | - chart: 2.0.1<br>- karma: 0.88 |
| Kiali | kiali | 1.47.0 | - chart: 1.47.0<br>- kiali: 1.47.0 |
| Knative | knative | 0.3.9 | - chart: 0.3.9<br>- knative: 0.22.3 |
| Kube OIDC Proxy | kube-oidc-proxy | 0.3.1 | - chart: 0.3.1<br>- kube-oidc-proxy: 0.3.0 |
| Kube Prometheus Stack | [kube-prometheus-stack][kube-prometheus-stack] | 33.1.5 | - chart: 33.1.5 <br>- prometheus-operator: 0.54.1<br>- prometheus: 2.33.4<br>- prometheus alertmanager: 0.23.0<br>- grafana: 8.3.6 |
| Kubecost | kubecost | 0.23.3 | - chart: 0.23.3<br>- cost-analyzer: 1.91.2 |
| Kubefed | kubefed | 0.9.1 | - chart: 0.9.1<br>- kubefed: 0.9.1 |
| Kubernetes Dashboard | kubernetes-dashboard | 5.1.1 | - chart: 5.1.1<br>- kubernetes-dashboard: 2.4.0 |
| Kubetunnel | kubetunnel | 0.0.11 | - chart: 0.0.11<br>- kubetunnel: 0.0.11 |
| Logging Operator | logging-operator | 3.17.2 | - chart: 3.17.2<br>- logging-operator: 3.17.2 |
| Minio | minio-operator | 4.4.10 | - chart: 4.4.10<br>- minio: 4.4.10 |
| NFS Server Provisioner | nfs-server-provisioner | 0.6.0 | - chart: 0.6.0<br>- nfs-provisioner: 2.3.0 |
| Nvidia | nvidia | 0.4.4 | - chart: 0.4.4<br>- nvidia-device-plugin: 0.9.0 |
| Grafana (project) | project-grafana-logging| 6.20.6 | - chart: 6.20.6<br>- grafana: 8.3.6 |
| Loki (project) | project-grafana-loki | 0.33.2 | - chart: 0.33.1<br>- loki: 2.2.1 |
|  | project-logging | 1.0.0 |  |
| Prometheus Adapter  | prometheus-adapter | 2.17.1 | - chart: 2.17.1<br>- prometheus-adapter: 0.9.1 |
| Reloader | reloader | 0.0.104 | - chart: 0.0.104<br>- reloader: 0.0.104 |
| Thanos | thanos | 0.4.6 | - chart: 0.4.6<br>- thanos: 0.9.0 |
| Traefik | traefik | 10.9.1 | - chart: 10.9.1<br>- traefik: 2.5.6 |
| Traefik ForwardAuth | traefik-forward-auth | 0.3.6 | - chart: 0.3.6<br>- traefik-forward-auth: 3.1.0 |
| Velero | velero | 3.1.5 | - chart: 3.1.5<br>- velero: 1.5.2 |


## Known issues

### Overriding configuration for kube-oidc-proxy and traefik-forward-auth

Configuration overrides for kube-oidc-proxy and traefik-forward-auth platform applications must be manually applied for each cluster that requires custom configuration on top of the default configuration. Passing in the configuration via the CLI installer *will not work*. Instead, you must edit the cluster's custom configuration in the appropriate `FederatedConfigMap`'s `spec.overrides` list. For kube-oidc-proxy, the `FederatedConfigMap` is called `kube-oidc-proxy-overrides`, and for traefik-forward-auth, it is called `traefik-forward-auth-kommander-overrides`. See below for an example to override the kube-oidc-proxy configuration to use a custom domain `mycluster.domain.dom`:

```bash
kubectl edit federatedconfigmap kube-oidc-proxy-overrides -n kommander
```

Modify `oidc.issuerUrl` under the `values.yaml` key to override it for the `host-cluster` cluster:

```yaml
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

### Spark operator failure workaround

Upgrading catalog applications using Spark Operator can fail when running `dkp upgrade catalogapp` due to the operator not starting. If this occurs, use the following workaround:

1.  Run the `dkp upgrade catalogapp` command.
1.  Monitor the failure of `spark-operator`.
1.  Get the workspace namespace name and export it.

    ```bash
    export WORKSPACE_NAMESPACE=<SPARK_OPERATOR_WS_NS>
    ```

1.  Export the spark-operator AppDeployment name.

    ```bash
    # e.g., this value can be spark-operator-1
    # if your spark-operator AppDeployment name doesn't contain "spark", you must adjust the grep command accordingly
    export SPARK_APPD_NAME=$(kubectl get appdeployment -n $WORKSPACE_NAMESPACE -o jsonpath='{range .items[*]} {.metadata.name}{"\n"}{end}' | grep spark)
    ```

1.  Export the service account name of your `spark-operator`.

    ```bash
    # if your provided values override, please look it up in that ConfigMap
    # this is the default value defined in spark-operator-1.1.6-d2iq-defaults ConfigMap
    export SPARK_OPERATOR_SERVICE_ACCOUNT=spark-operator-service-account
    ```

1.  Run the following command.

    ```yaml
    kubectl apply -f - <<EOF
    ---
    apiVersion: rbac.authorization.k8s.io/v1
    kind: ClusterRole
    metadata:
      name: spark-operator
      annotations:
        "helm.sh/hook": pre-install, pre-upgrade
        "helm.sh/hook-delete-policy": hook-failed, before-hook-creation
      labels:
        app.kubernetes.io/instance: spark-operator
        app.kubernetes.io/managed-by: Helm
        app.kubernetes.io/name: spark-operator
        app.kubernetes.io/version: v1beta2-1.3.3-3.1.1
        helm.sh/chart: spark-operator-1.1.17
        helm.toolkit.fluxcd.io/name: $SPARK_APPD_NAME
        helm.toolkit.fluxcd.io/namespace: $WORKSPACE_NAMESPACE
    rules:
    - apiGroups:
      - ""
      resources:
      - pods
      verbs:
      - "*"
    - apiGroups:
      - ""
      resources:
      - services
      - configmaps
      - secrets
      verbs:
      - create
      - get
      - delete
      - update
    - apiGroups:
      - extensions
      - networking.k8s.io
      resources:
      - ingresses
      verbs:
      - create
      - get
      - delete
    - apiGroups:
      - ""
      resources:
      - nodes
      verbs:
      - get
    - apiGroups:
      - ""
      resources:
      - events
      verbs:
      - create
      - update
      - patch
    - apiGroups:
      - ""
      resources:
      - resourcequotas
      verbs:
      - get
      - list
      - watch
    - apiGroups:
      - apiextensions.k8s.io
      resources:
      - customresourcedefinitions
      verbs:
      - create
      - get
      - update
      - delete
    - apiGroups:
      - admissionregistration.k8s.io
      resources:
      - mutatingwebhookconfigurations
      - validatingwebhookconfigurations
      verbs:
      - create
      - get
      - update
      - delete
    - apiGroups:
      - sparkoperator.k8s.io
      resources:
      - sparkapplications
      - sparkapplications/status
      - scheduledsparkapplications
      - scheduledsparkapplications/status
      verbs:
      - "*"
    - apiGroups:
      - batch
      resources:
      - jobs
      verbs:
      - delete
    ---
    apiVersion: rbac.authorization.k8s.io/v1
    kind: ClusterRoleBinding
    metadata:
      name: spark-operator
      annotations:
        "helm.sh/hook": pre-install, pre-upgrade
        "helm.sh/hook-delete-policy": hook-failed, before-hook-creation
      labels:
        app.kubernetes.io/instance: spark-operator
        app.kubernetes.io/managed-by: Helm
        app.kubernetes.io/name: spark-operator
        app.kubernetes.io/version: v1beta2-1.3.3-3.1.1
        helm.sh/chart: spark-operator-1.1.17
        helm.toolkit.fluxcd.io/name: $SPARK_APPD_NAME
        helm.toolkit.fluxcd.io/namespace: $WORKSPACE_NAMESPACE
    subjects:
    - kind: ServiceAccount
      name: $SPARK_OPERATOR_SERVICE_ACCOUNT
      namespace: $WORKSPACE_NAMESPACE
    roleRef:
      kind: ClusterRole
      name: spark-operator
      apiGroup: rbac.authorization.k8s.io
    ---
    apiVersion: v1
    kind: ServiceAccount
    metadata:
      annotations:
        helm.sh/hook: pre-install, pre-upgrade
        helm.sh/hook-delete-policy: hook-failed
      labels:
        app.kubernetes.io/instance: spark-operator
        app.kubernetes.io/managed-by: Helm
        app.kubernetes.io/name: spark-operator
        app.kubernetes.io/version: v1beta2-1.3.3-3.1.1
        helm.sh/chart: spark-operator-1.1.17
        helm.toolkit.fluxcd.io/name: $SPARK_APPD_NAME
        helm.toolkit.fluxcd.io/namespace: $WORKSPACE_NAMESPACE
      name: $SPARK_OPERATOR_SERVICE_ACCOUNT
      namespace: $WORKSPACE_NAMESPACE
    EOF
    ```

1.  If you want to force a pod recreation, you can delete the old pod in `CrashLoopBackoff` by running:

    ```bash
    # spark-operator is the default value
    # if you override the HelmRelease name in your override configmap, use that value in the following command
    export SPARK_OPERATOR_RELEASE_NAME=spark-operator
    # only one instance of spark operator should be deployed per cluster
    kubectl delete pod -n $WORKSPACE_NAMESPACE $(kubectl get pod -l app.kubernetes.io/name=$SPARK_OPERATOR_RELEASE_NAME -n $WORKSPACE_NAMESPACE -o jsonpath='{range .items[0]}{.metadata.name}')
    ```

### Minio Disk insufficient space when upgrading

When upgrading DKP from v2.1.x to v2.2.x, the upgrade can fail due to insufficient space on the MinIO Disk. To avoid this issue, we recommend that you disable the `fluent-bit` Platform Application before upgrading. 

### Calico not updated during DKP upgrade

When upgrading a DKP cluster, after what seems to be a successful upgrade, the Calico service might not update as expected and, therefor, is still using the old image. The wrong CNI ClusterResourceSet is being generated and not accounting for Flatcar. This issue only impacts Calico, no other add-ons.

Follow these steps to manually correct this issue:

1.  Update the ConfigMap as follows:

    ```
    cat <<EOF | kubectl apply -f -
    apiVersion: v1
    data:
      custom-resources.yaml: |+
        # This section includes base Calico installation configuration.
        # For more information, see: https://docs.projectcalico.org/reference/installation/api
        apiVersion: operator.tigera.io/v1
        kind: Installation
        metadata:
          name: default
        spec:
          # Configures Calico networking.
          calicoNetwork:
            # Note: The ipPools section cannot be modified post-install.
            ipPools:
            - blockSize: 26
              cidr: 192.168.0.0/16
              encapsulation: IPIP
              natOutgoing: Enabled
              nodeSelector: all()
            bgp: Enabled
            nodeAddressAutodetectionV4:
              firstFound: true
          # FlexVolume path must be mounted under /opt on flatcar/coreos systems
          flexVolumePath: /opt/libexec/kubernetes/kubelet-plugins/volume/exec/
    kind: ConfigMap
    metadata:
      name: calico-cni-installation-c3-0193d
    EOF
    ```

1.  Execute these commands: `kubectl edit calico-cni-installation-c3-0193d` and update `spec.clusterSelector.matchLabels.konvoy.d2iq.io/osHint` to `konvoy.d2iq.io/osHint: flatcar`

## Additional resources

For more information about working with native Kubernetes, see the [Kubernetes documentation][kubernetes-doc].

[kube-prometheus-stack]: https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack
[kubernetes-doc]: https://kubernetes.io/docs/home/
