---
layout: layout.pug
navigationTitle: Upgrade your Preprovisioned Cluster
title: Upgrade your Preprovisioned Cluster
menuWeight: 20
excerpt: Upgrade your Preprovisioned Cluster
beta: true
enterprise: false
---

### Set Keepalived Interface in Konvoy 1.8 Configuration

If `keepalived` is enabled, update Konvoy 1.8 Configuration with the interface used by Keepalived.

1.  Run the following command on any of the control-plane machines to get the interface being used, replacing `<control plane endpoint>` with the cluster's IP.

    ```bash
    ip route get "<control plane endpoint>" | grep -Po '(?<=(dev )).*(?= src| proto)'
    ```

    The output appears similar to this:

    ```sh
    ens192
    ```

1.  Update `cluster.yaml` with the output of the previous command:

    ```yaml
    kind: ClusterConfiguration
    apiVersion: konvoy.mesosphere.io/v1beta2
    metadata:
      name: konvoy-migration
      creationTimestamp: "2021-11-16T23:12:50Z"
    spec:
      kubernetes:
        controlPlane:
          keepalived:
            interface: ens192
    ```

## Create DKP Bootstrap Controllers on Konvoy 1.8 Cluster

You must configure the adopted cluster as self-managed. The bootstrap controllers must successfully deploy on the cluster for it to become self-managed. Do not begin the other adoption steps until this is successful.

```bash
dkp --kubeconfig=admin.conf create bootstrap controllers
```

The output appears similar to this:

```sh
INFO[2021-11-12T18:22:52-08:00] Created bootstrap controllers                 src="bootstrap/controllers.go:106"
INFO[2021-11-12T18:22:52-08:00] Bootstrap controllers are ready               src="bootstrap/controllers.go:110"
INFO[2021-11-12T18:22:52-08:00] Initializing Tigera operator                  src="bootstrap/clusterresourceset.go:37"
INFO[2021-11-12T18:22:53-08:00] Created/Updated Tigera operator               src="bootstrap/clusterresourceset.go:42"
INFO[2021-11-12T18:22:53-08:00] Initializing AWS EBS CSI CustomResourceSet    src="bootstrap/clusterresourceset.go:95"
INFO[2021-11-12T18:22:53-08:00] Created/Updated AWS EBS CSI CustomResourceSet  src="bootstrap/clusterresourceset.go:100"
INFO[2021-11-12T18:22:53-08:00] Initializing Azure Disk CSI CustomResourceSet  src="bootstrap/clusterresourceset.go:102"
INFO[2021-11-12T18:22:54-08:00] Created Azure Disk CustomResourceSet          src="bootstrap/clusterresourceset.go:107"
INFO[2021-11-12T18:22:54-08:00] Initializing Local Volume Provisioner CustomResourceSet  src="bootstrap/clusterresourceset.go:109"
INFO[2021-11-12T18:22:54-08:00] Created/Updated Local Volume Provisioner CustomResourceSet  src="bootstrap/clusterresourceset.go:114"
INFO[2021-11-12T18:22:54-08:00] Initializing Cluster Autoscaler CustomResourceSet  src="bootstrap/clusterresourceset.go:181"
INFO[2021-11-12T18:22:54-08:00] Created/Updated Cluster Autoscaler CustomResourceSet  src="bootstrap/clusterresourceset.go:186"
INFO[2021-11-12T18:22:54-08:00] Initializing Node Feature Discovery CustomResourceSet  src="bootstrap/clusterresourceset.go:239"
INFO[2021-11-12T18:22:54-08:00] Created/Updated Node Feature Discovery CustomResourceSet  src="bootstrap/clusterresourceset.go:244"
INFO[2021-11-12T18:22:55-08:00] Initializing NVIDIA GPU Feature Discovery CustomResourceSet  src="bootstrap/clusterresourceset.go:297"
INFO[2021-11-12T18:22:55-08:00] Created/Updated NVIDIA GPU Feature Discovery CustomResourceSet  src="bootstrap/clusterresourceset.go:302"
```

## Create Konvoy 2.1 Configuration from Konvoy 1.8 Configuration

1.  Create Konvoy 2.1 Configuration

    ```bash
    dkp --kubeconfig=admin.conf prepare-to-adopt cluster preprovisioned
    ```

    ```sh
    secret/konvoy-migration-ca prepared
    secret/konvoy-migration-sa prepared
    secret/konvoy-migration-etcd prepared
    secret/konvoy-migration-proxy prepared
    secret/konvoy-migration-etcd-encryption-config prepared
    secret/konvoy-migration-ssh-key prepared
    preprovisionedinventory.infrastructure.cluster.konvoy.d2iq.io/konvoy-migration-control-plane prepared
    preprovisionedinventory.infrastructure.cluster.konvoy.d2iq.io/konvoy-migration-worker prepared
    secret/konvoy-migration-control-plane-containerd-configuration prepared
    cluster.cluster.x-k8s.io/konvoy-migration prepared
    kubeadmcontrolplane.controlplane.cluster.x-k8s.io/konvoy-migration-control-plane prepared
    preprovisionedcluster.infrastructure.cluster.konvoy.d2iq.io/konvoy-migration prepared
    preprovisionedmachinetemplate.infrastructure.cluster.konvoy.d2iq.io/konvoy-migration-control-plane prepared
    clusterresourceset.addons.cluster.x-k8s.io/calico-installation-konvoy-migration prepared
    configmap/calico-cni-konvoy-migration prepared
    secret/konvoy-migration-control-plane-0 prepared
    kubeadmconfig.bootstrap.cluster.x-k8s.io/konvoy-migration-control-plane-0 prepared
    machine.cluster.x-k8s.io/konvoy-migration-control-plane-0 prepared
    preprovisionedmachine.infrastructure.cluster.konvoy.d2iq.io/konvoy-migration-control-plane-0 prepared
    secret/konvoy-migration-control-plane-1 prepared
    kubeadmconfig.bootstrap.cluster.x-k8s.io/konvoy-migration-control-plane-1 prepared
    machine.cluster.x-k8s.io/konvoy-migration-control-plane-1 prepared
    preprovisionedmachine.infrastructure.cluster.konvoy.d2iq.io/konvoy-migration-control-plane-1 prepared
    secret/konvoy-migration-control-plane-2 prepared
    kubeadmconfig.bootstrap.cluster.x-k8s.io/konvoy-migration-control-plane-2 prepared
    machine.cluster.x-k8s.io/konvoy-migration-control-plane-2 prepared
    preprovisionedmachine.infrastructure.cluster.konvoy.d2iq.io/konvoy-migration-control-plane-2 prepared
    machinedeployment.cluster.x-k8s.io/konvoy-migration-worker prepared
    preprovisionedmachinetemplate.infrastructure.cluster.konvoy.d2iq.io/konvoy-migration-worker prepared
    kubeadmconfigtemplate.bootstrap.cluster.x-k8s.io/konvoy-migration-worker prepared
    secret/konvoy-migration-worker-containerd-configuration prepared
    machineset.cluster.x-k8s.io/konvoy-migration-worker prepared
    secret/konvoy-migration-worker-0 prepared
    kubeadmconfig.bootstrap.cluster.x-k8s.io/konvoy-migration-worker-0 prepared
    machine.cluster.x-k8s.io/konvoy-migration-worker-0 prepared
    preprovisionedmachine.infrastructure.cluster.konvoy.d2iq.io/konvoy-migration-worker-0 prepared
    secret/konvoy-migration-worker-1 prepared
    kubeadmconfig.bootstrap.cluster.x-k8s.io/konvoy-migration-worker-1 prepared
    machine.cluster.x-k8s.io/konvoy-migration-worker-1 prepared
    preprovisionedmachine.infrastructure.cluster.konvoy.d2iq.io/konvoy-migration-worker-1 prepared
    secret/konvoy-migration-worker-2 prepared
    kubeadmconfig.bootstrap.cluster.x-k8s.io/konvoy-migration-worker-2 prepared
    machine.cluster.x-k8s.io/konvoy-migration-worker-2 prepared
    preprovisionedmachine.infrastructure.cluster.konvoy.d2iq.io/konvoy-migration-worker-2 prepared
    secret/konvoy-migration-worker-3 prepared
    kubeadmconfig.bootstrap.cluster.x-k8s.io/konvoy-migration-worker-3 prepared
    machine.cluster.x-k8s.io/konvoy-migration-worker-3 prepared
    preprovisionedmachine.infrastructure.cluster.konvoy.d2iq.io/konvoy-migration-worker-3 prepared
    INFO[2021-11-17T17:25:09-05:00] Run 'export CLUSTER_NAME=konvoy-migration' and follow the rest of the documentation  src="cluster/prepare-to-adopt.go:179"
    ```

1.  Update your environment with the cluster name for use in later steps by running the shell command from the last line of output in the previous step:

    ```sh
    INFO[2021-11-15T19:59:35-05:00] Run 'export CLUSTER_NAME=konvoy-migration' and follow the rest of the documentation  src="cluster/adopt.go:178"
    ```

    Then, verify that your environment has the cluster name:

    ```bash
    echo $CLUSTER_NAME
    ```

    The output should be your cluster name, for example:

    ```sh
    konvoy-migration
    ```

## Remove the Konvoy 1.8 Auto-Provisioner

1.  Delete the auto-provisioner helm Chart using the helm CLI (version 3):

    ```bash
    helm --kubeconfig=admin.conf --namespace konvoy uninstall auto-provisioning
    ```

    The output appears similar to this:

    ```sh
    release "auto-provisioning" uninstalled
    ```

1.  Remove the `konvoy` namespace.

    ```sh
    kubectl --kubeconfig=admin.conf delete namespace konvoy
    ```

    The output appears similar to this:

    ```sh
    namespace "konvoy" deleted
    ```

## Prepare Calico to be upgraded

1.  Patch the `calico-node` DaemonSet to trigger a rolling update of the calico-node pods.

    ```bash
    kubectl patch -n kube-system daemonset/calico-node --kubeconfig=admin.conf -p '{"spec":{"template":{"spec":{"$setElementOrder/containers":[{"name":"calico-node"},{"name":"bird-metrics"}],"affinity":null,"containers":[{"$setElementOrder/env":[{"name":"DATASTORE_TYPE"},{"name":"WAIT_FOR_DATASTORE"},{"name":"NODENAME"},{"name":"CALICO_NETWORKING_BACKEND"},{"name":"CLUSTER_TYPE"},{"name":"CALICO_IPV4POOL_IPIP"},{"name":"FELIX_IPINIPMTU"},{"name":"CALICO_IPV4POOL_CIDR"},{"name":"CALICO_DISABLE_FILE_LOGGING"},{"name":"FELIX_DEFAULTENDPOINTTOHOSTACTION"},{"name":"FELIX_IPV6SUPPORT"},{"name":"FELIX_LOGSEVERITYSCREEN"},{"name":"FELIX_HEALTHENABLED"},{"name":"FELIX_PROMETHEUSMETRICSENABLED"},{"name":"FELIX_PROMETHEUSMETRICSPORT"}],"env":[{"$patch":"delete","name":"IP"}],"name":"calico-node"}]}}}}'
    ```

    The output appears similar to this:

    ```sh
    daemonset.apps/calico-node patched
    ```

1.  Wait for the new pods to be rolled out:

    ```bash
    kubectl --kubeconfig=admin.conf -n kube-system rollout status daemonset/calico-node
    ```

    The output appears similar to this:

    ```sh
    Waiting for daemon set "calico-node" rollout to finish: 1 out of 7 new pods have been updated...
    Waiting for daemon set "calico-node" rollout to finish: 2 out of 7 new pods have been updated...
    Waiting for daemon set "calico-node" rollout to finish: 3 out of 7 new pods have been updated...
    Waiting for daemon set "calico-node" rollout to finish: 4 out of 7 new pods have been updated...
    Waiting for daemon set "calico-node" rollout to finish: 5 out of 7 new pods have been updated...
    Waiting for daemon set "calico-node" rollout to finish: 6 out of 7 new pods have been updated...
    daemon set "calico-node" successfully rolled out
    ```

If the number of Pods is less than the number of nodes in the cluster, run the command again.

## Remove the CSI Local Volume Provisioner Addon

The CSI Local Volume Provisioner provides persistent storage for cluster applications. Konvoy 1.8 deploys the provisioner as an Addon, but Konvoy 2.1 deploys it using a different mechanism.

Remove the Addon, so that Konvoy 2.1 can deploy the provisioner, by running this command:

```bash
kubectl delete clusteraddon/localvolumeprovisioner --kubeconfig=admin.conf
```

The output appears similar to this:

```sh
clusteraddon.kubeaddons.mesosphere.io "localvolumeprovisioner" deleted
```

## Adopt the cluster

The `dkp adopt` command performs several steps.

Every Machine has a bootstrap configuration (KubeadmConfig) and bootstrap data (Secret). These must have owner references to be included in the "move" operation.

When the adoption process reconciles a Machine object that has not been bootstrapped, it creates the KubeadmConfig from the associated KubeadmConfigTemplate, and CABPK creates the Secret when it reconciles the KubeadmConfig. The owner references are set at this time.

DKP machines are already bootstrapped and also create the KubeadmConfigs and the Secrets. This command sets the appropriate owner references on these resources.

This command also stops the pause on the Cluster object, which then starts the reconcile process:

```bash
dkp --kubeconfig=admin.conf adopt cluster preprovisioned
```

The output appears similar to this:

```sh
INFO[2021-11-17T17:29:04-05:00] patched KubeadmConfig default/konvoy-migration-control-plane-0 with an ownerReference  src="patch/ownerreferences.go:54"
INFO[2021-11-17T17:29:04-05:00] patched KubeadmConfig default/konvoy-migration-control-plane-1 with an ownerReference  src="patch/ownerreferences.go:54"
INFO[2021-11-17T17:29:04-05:00] patched KubeadmConfig default/konvoy-migration-control-plane-2 with an ownerReference  src="patch/ownerreferences.go:54"
INFO[2021-11-17T17:29:04-05:00] patched KubeadmConfig default/konvoy-migration-worker-0 with an ownerReference  src="patch/ownerreferences.go:54"
INFO[2021-11-17T17:29:04-05:00] patched KubeadmConfig default/konvoy-migration-worker-1 with an ownerReference  src="patch/ownerreferences.go:54"
INFO[2021-11-17T17:29:04-05:00] patched KubeadmConfig default/konvoy-migration-worker-2 with an ownerReference  src="patch/ownerreferences.go:54"
INFO[2021-11-17T17:29:04-05:00] patched KubeadmConfig default/konvoy-migration-worker-3 with an ownerReference  src="patch/ownerreferences.go:54"
INFO[2021-11-17T17:29:04-05:00] patched Secret default/konvoy-migration-control-plane-0 with an ownerReference  src="patch/ownerreferences.go:99"
INFO[2021-11-17T17:29:04-05:00] patched Secret default/konvoy-migration-control-plane-1 with an ownerReference  src="patch/ownerreferences.go:99"
INFO[2021-11-17T17:29:04-05:00] patched Secret default/konvoy-migration-control-plane-2 with an ownerReference  src="patch/ownerreferences.go:99"
INFO[2021-11-17T17:29:04-05:00] patched Secret default/konvoy-migration-worker-0 with an ownerReference  src="patch/ownerreferences.go:99"
INFO[2021-11-17T17:29:04-05:00] patched Secret default/konvoy-migration-worker-1 with an ownerReference  src="patch/ownerreferences.go:99"
INFO[2021-11-17T17:29:04-05:00] patched Secret default/konvoy-migration-worker-2 with an ownerReference  src="patch/ownerreferences.go:99"
INFO[2021-11-17T17:29:04-05:00] patched Secret default/konvoy-migration-worker-3 with an ownerReference  src="patch/ownerreferences.go:99"
INFO[2021-11-17T17:29:04-05:00] unpaused reconciliation of the cluster (konvoy-migration/default)  src="cluster/adopt.go:106"
```

## Wait for Cluster to Reach a Steady State

Describe the cluster with the command:

```bash
dkp --kubeconfig=admin.conf describe cluster --cluster-name $CLUSTER_NAME
```

The output appears similar to this:

```sh
NAME                                                                 READY  SEVERITY  REASON  SINCE  MESSAGE
/konvoy-migration                                                    True                     62s
├─ClusterInfrastructure - PreprovisionedCluster/konvoy-migration
├─ControlPlane - KubeadmControlPlane/konvoy-migration-control-plane  True                     62s
│ └─3 Machines...                                                    True                     66s    See konvoy-migration-control-plane-0, konvoy-migration-control-plane-1, ...
└─Workers
  └─MachineDeployment/konvoy-migration-worker                        True                     52s
    └─4 Machines...                                                  True                     69s    See konvoy-migration-worker-0, konvoy-migration-worker-1, ...
```

The cluster, control plane, and worker node pool should all show the value `True` in the Ready column.

### If the Cluster Never Reaches a Steady State

A race condition where the `Machine` objects are reconciled before the appropriate status is set on the `Cluster` object and it gets *stuck*, stopping it from reaching a steady state. If this happens, delete the CAPPP pod and let Kubernetes restart it to trigger a reconcile:

```bash
kubectl --kubeconfig=admin.conf delete pods -n cappp-system -l control-plane=controller-manager
```

The following output appears:

```sh
pod "cappp-controller-manager-56fcf85446-66z87" deleted
```

## Wait for Calico to upgrade

Confirm that the `calico-node` DaemonSet is running in the `calico-system` namespace.

```bash
kubectl --kubeconfig=admin.conf -n calico-system get daemonset/calico-node
```

The output appears similar to this:

```sh
NAME          DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR            AGE
calico-node   7         7         7       7            7           kubernetes.io/os=linux   4h42m
```

If the number of up-to-date replicas is equal to the number of nodes in the cluster, the upgrade is complete. Otherwise, the upgrade is still in progress. Wait some time and run the command again.

### If no Calico pods display

It may take some time before the DaemonSet is running. If you see that the process is not creating any Calico pods in the new namespace, trigger the DaemonSet to run using this command:

```bash
kubectl delete pods -n capi-system -l cluster.x-k8s.io/provider=cluster-api
```

```sh
pod "capi-controller-manager-d4b9c7c4c-hkqfl" deleted
```

## Prepare the Dex Addon for Kubernetes v1.21.6

The Dex Addon acts as the cluster's OpenID Connect identity provider. You must change its configuration so that it works correctly with both Kubernetes v1.21.6 and v1.20.11.

1.  Edit the Dex configuration

    ```bash
    kubectl --kubeconfig=admin.conf edit -n kubeaddons addon dex
    ```

    Paste the following into the YAML document nested in the `spec.chartReference.values` field of the Addon resource:

    ```yaml
    env:
      - name: KUBERNETES_POD_NAMESPACE
        valueFrom:
          fieldRef:
            fieldPath: metadata.namespace
    ```

    Do **not** change any other values in the Addon resource. The Addon should now look like this. Make sure that the `env` field is vertically aligned with the `image` field.

    ```yaml
    apiVersion: kubeaddons.mesosphere.io/v1beta2
    kind: Addon
    metadata:
      name: dex
      namespace: kubeaddons
      ...
    spec:
      chartReference:
        chart: dex
        ...
        values: |
          ---
          # Temporarily we're going to use our custom built container. Documentation
          # for how to build a new version: https://github.com/mesosphere/dex/blob/v2.27.0-d2iq/README.d2iq.md
          env:
          - name: KUBERNETES_POD_NAMESPACE
            valueFrom:
              fieldRef:
                fieldPath: metadata.namespace
          image: mesosphere/dex
          ...
    ```

## Update pre-provisioned machine templates to include proxy overrides

<p class="message--note"><strong>NOTE: </strong>If you are not utilizing proxies you can skip this section and procedures.</p>

When adopting the DKP cluster, there is no parameter to include the proxy override secret. Therefore, if you require proxy settings in this environment, you need to manually update the pre-provisioned machine templates to include them.

Follow these steps:

1.  Set up the http proxy override file, as described in [HTTP proxy override files](/dkp/konvoy/2.1/image-builder/override-files/create-custom-or-files/proxy-or-files/).

1.  Set up the http proxy override secret, as described in [Create a secret](/dkp/konvoy/2.1/choose-infrastructure/pre-provisioned/create-secrets-and-overrides/#create-a-secret).

1.  Update the Control Plane Preprovisioned Machine Template:

    ```bash
    export CLUSTER_NAME=<cluster name> # (if not set already)
    kubectl edit preprovisionedmachinetemplate ${CLUSTER_NAME}-control-plane --kubeconfig ${CLUSTER_NAME}.conf
    ```

    Within `spec.template.spec`, add the following section aligned with the `inventoryRef` section, e.g.:

    ```yaml
          inventoryRef:
            name: ${CLUSTER_NAME}-control-plane
          overrideRef:
            name: ${CLUSTER_NAME}-user-overrides
    ```

1.  Update Worker Preprovisioned Machine Template:

    ```bash
    kubectl edit preprovisionedmachinetemplate ${CLUSTER_NAME}-worker --kubeconfig ${CLUSTER_NAME}.conf
    ```

    Within `spec.template.spec`, add the following section aligned with the `inventoryRef` section, e.g.:

    ```yaml
          inventoryRef:
            name: ${CLUSTER_NAME}-worker
          overrideRef:
            name: ${CLUSTER_NAME}-user-overrides
    ```

<p class="message--note"><strong>NOTE: </strong>Replace <code>&lt;cluster name&gt;</code> with the actual name of your cluster to be upgraded.</p>

## Update the cluster control plane Kubernetes version to v1.21.6

<!-- Insert GPG key here? See Incident D2IQ-95189 for the information. -->

1.  Prepare a patch with the Kubernetes version.

    ```yaml
    cat <<EOF > control-plane-kubernetes-version-patch.yaml
    apiVersion: controlplane.cluster.x-k8s.io/v1alpha4
    kind: KubeadmControlPlane
    spec:
      version: v1.21.6
      rolloutStrategy:
        rollingUpdate:
          maxSurge: 0
    EOF
    ```

1.  Start the update.

    Patch the KubeadmControlPlane to use the new Kubernetes version.

    <p class="message--note"><strong>NOTE: </strong>Patching the KubeadmControlPlane starts the control plane update. The process updates machines with updated properties, and deletes machines with out-of-date properties, in a "rolling" update. New machines replace old machines one at a time. The update waits for each new machine to join the control plane successfully. Regardless of the specified replica count, the update works in the same way.

    ```bash
    KUBEADMCONTROLPLANE_NAME=$(set -o nounset -o pipefail; kubectl --kubeconfig=admin.conf get kubeadmcontrolplanes --selector=cluster.x-k8s.io/cluster-name=${CLUSTER_NAME} -ojsonpath='{.items[0].metadata.name}')

    kubectl --kubeconfig=admin.conf get kubeadmcontrolplane ${KUBEADMCONTROLPLANE_NAME} --output=yaml \
      | kubectl --kubeconfig=admin.conf patch --local=true -f- --patch-file=control-plane-kubernetes-version-patch.yaml --type=merge --output=yaml \
      | kubectl --kubeconfig=admin.conf apply -f-
    ```

    The output appears similar to this:

    ```sh
    kubeadmcontrolplane.controlplane.cluster.x-k8s.io/konvoy-migrate-control-plane configured
    ```

1.  Wait for the update to complete. When the condition `Ready` is true, the update is complete.

    ```bash
    kubectl --kubeconfig=admin.conf wait --timeout=10m kubeadmcontrolplane ${KUBEADMCONTROLPLANE_NAME} --for=condition=Ready
    ```

## Update the cluster worker node pool to Kubernetes version v1.21.6

1.  Prepare a patch with the Kubernetes version.

    ```yaml
    cat <<EOF > node-pool-kubernetes-version-patch.yaml
    apiVersion: cluster.x-k8s.io/v1alpha4
    kind: MachineDeployment
    spec:
      template:
        spec:
          version: v1.21.6
      strategy:
        rollingUpdate:
          maxSurge: 0
          maxUnavailable: 0
    EOF
    ```

1.  Start the update.

    Patch the MachineDeployment to use the new Kubernetes version.

    <p class="message--note"><strong>NOTE: </strong>Patching the MachineDeployment starts the worker node pool update. This process creates machines with updated properties, and deletes machines with out-of-date properties, in a "rolling" update. New machines replace old machines one at a time. The update waits for each new machine to join the cluster successfully.</p>

    ```bash
    MACHINEDEPLOYMENT_NAME=$(set -o nounset -o pipefail; kubectl --kubeconfig=admin.conf get machinedeployments --selector=cluster.x-k8s.io/cluster-name=${CLUSTER_NAME} -ojsonpath='{.items[0].metadata.name}')

    kubectl --kubeconfig=admin.conf get machinedeployment ${MACHINEDEPLOYMENT_NAME} --output=yaml \
      | kubectl --kubeconfig=admin.conf patch --local=true -f- --patch-file=node-pool-kubernetes-version-patch.yaml --type=merge --output=yaml \
      | kubectl --kubeconfig=admin.conf apply -f-
    ```

    The output appears similar to this:

    ```sh
    machinedeployment.cluster.x-k8s.io/konvoy-migration-worker configured
    ```

1.  Wait for the update to complete.

    When the number of replicas is equal to the number of updated replicas, the update is complete.

    <!-- NOTE: `kubectl wait` is the preferred solution, but cannot be used with MachineDeployment, because it does not yet have Conditions (https://github.com/kubernetes-sigs/cluster-api/pull/4625) -->

    ```bash
    timeout 10m bash -c \
      "until [[ $(kubectl --kubeconfig=admin.conf get machinedeployment ${MACHINEDEPLOYMENT_NAME} -ojsonpath='{.status.replicas}') \
                == \
                $(kubectl --kubeconfig=admin.conf get machinedeployment ${MACHINEDEPLOYMENT_NAME} -ojsonpath='{.status.updatedReplicas}')
      ]]; do sleep 30; done"
    ```
