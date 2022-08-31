---
layout: layout.pug
navigationTitle: Upgrade your AWS Cluster
title: Upgrade your AWS Cluster
menuWeight: 20
excerpt: Upgrade your AWS Cluster
beta: false
enterprise: false
---

<!-- vale proselint.DateCase = NO -->

Follow these steps only if you are upgrading an AWS cluster.

## Create an AMI that is compatible with Konvoy 2.x, Kubernetes v1.20.13, and CentOS 7

After adopting the cluster, you use this AMI to scale up, or replace a failed instance in the control plane and worker node pools.

<p class="message--note"><strong>NOTE: </strong>Konvoy v1.8.4 and v1.8.5 uses Kubernetes version 1.20.13 by default. If upgrading from Konvoy v1.8.3, use Kubernetes version 1.20.11 for the below commands.</p>

1.  Create the AMI using [Konvoy Image Builder][kib] (you must [use the Konvoy Image Builder v1.5.0 release, downloadable from GitHub][kib-releases]):

    ```bash
    echo "kubernetes_version: 1.20.13" > kubever.yaml
    konvoy-image build images/ami/centos-7.yaml --overrides kubever.yaml
    ```

    The output appears similar to this:

    ```sh
    writing new packer configuration to work/centos-7-1637107496-rPzRE
    starting packer build
    centos-7: output will be in this color.

    ...

    Build 'centos-7' finished after 13 minutes 53 seconds.

    ==> Wait completed after 13 minutes 53 seconds

    ==> Builds finished. The artifacts of successful builds are:
    --> centos-7: AMIs were created:
    us-west-2: ami-03364d732f61fb1e2

    --> centos-7: AMIs were created:
    us-west-2: ami-03364d732f61fb1e2
    ```

1.  Add the new AMI IDs to the Konvoy 1.8 configuration. In the example above the AMI that was created is `ami-03364d732f61fb1e2`. Add a `postAdoptImageID:` to every node pool in `cluster.yaml`, setting its value to the AMI ID created in the previous step:

    ```yaml
    kind: ClusterProvisioner
    apiVersion: konvoy.mesosphere.io/v1beta2
    metadata:
      name: konvoy-migration
      creationTimestamp: "2021-11-16T23:12:50Z"
    spec:
      ...
      nodePools:
        - name: worker
          count: 4
          machine:
            imageID: ami-0686851c4e7b1a8e1
            postAdoptImageID: ami-03364d732f61fb1e2
            ...
        - name: control-plane
          controlPlane: true
          count: 3
          machine:
            imageID: ami-0686851c4e7b1a8e1
            postAdoptImageID: ami-03364d732f61fb1e2
            ...
        - name: bastion
          bastion: true
          count: 0
          machine:
            imageID: ami-0686851c4e7b1a8e1
            postAdoptImageID: ami-03364d732f61fb1e2
            ...
    ```

    <p class="message--note"><strong>NOTE: </strong>Konvoy 1.8.3 and above returns an error if the <code>postAdoptImageID</code> fields are present. If you must use the <code>konvoy</code> CLI again after this step, temporarily comment out the <code>postAdoptImageID</code> fields.</p>

## Prepare AWS EBS CSI Plugin for Cluster Adoption

The AWS EBS CSI plugin uses AWS APIs to mount and unmount EBS volumes. It receives permission to use these APIs based on the machine where it runs. In Konvoy 1.8, both control plane and worker machines have the required permissions. In Konvoy 2.1, only control plane machines have the required permissions.

Configure the AWS EBS CSI plugin so that it runs only on the control plane machines, so that the plugin can access the AWS APIs after the upgrade to Konvoy 2.1.

First, configure the EBS CSI controller by running this command:

```bash
kubectl --kubeconfig=admin.conf -n kube-system patch statefulset ebs-csi-controller --patch '{"spec":{"template":{"spec":{"nodeSelector":{"node-role.kubernetes.io/control-plane":""},"tolerations":[{"effect":"NoExecute","operator": "Exists","tolerationSeconds":300},{"effect":"NoSchedule","key":"node-role.kubernetes.io/master","operator":"Exists"},{"key":"CriticalAddonsOnly","operator":"Exists"}]}}}}'
```

```text
statefulset.apps/ebs-csi-controller patched
```

Then, configure the EBS CSI Snapshot controller by running this command:

```bash
kubectl --kubeconfig=admin.conf -n kube-system patch statefulset ebs-csi-snapshot-controller --patch '{"spec":{"template":{"spec":{"nodeSelector":{"node-role.kubernetes.io/control-plane":""},"tolerations":[{"key":"CriticalAddonsOnly","operator":"Exists"},{"effect":"NoExecute","operator":"Exists","tolerationSeconds":300},{"effect":"NoSchedule","key":"node-role.kubernetes.io/master","operator":"Exists"}]}}}}'
```

```text
statefulset.apps/ebs-csi-snapshot-controller patched
```

## Modify the IAM Roles of Existing Machines

For the cluster adoption to be successful, the control-plane and worker machines must have the expected IAM roles. See [Configure IAM Policies](../../../choose-infrastructure/aws/iam-policies) for more on how to create these IAM Roles and policies. After you've created the IAM resources, you must modify the existing EC2 instances.

1.  Modify the IAM Role of every control plane machine to `control-plane.cluster-api-provider-aws.sigs.k8s.io`.

1.  Modify the IAM Role of every worker node pool machine to `nodes.cluster-api-provider-aws.sigs.k8s.io`.

## Modify Subnets so that new instances are assigned a public IPv4 Address

<!-- TODO This will be different for an air-gapped Konvoy 1.8 cluster. -->

Konvoy 1.8 creates 3 subnets: "control-plane" for control plane machines, "private" for worker pool machines, and "public" for the control plane ELB.

By default, these subnets have routes to an Internet Gateway, but no NAT Gateway. This means that instances need a public IPv4 address for egress to the Internet. Konvoy 1.8 assigns a public IP when it creates an instance. DKP 2.1 does not - it relies on the subnet default.

Modify the "control-plane" and "private" subnets so that, by default, new instances in the subnets are assigned a public IPv4 address.

In the AWS Console:

1.  Open the Subnets view.

1.  Select the subnet.

1.  Then choose the _Modify auto-assign IP settings_ action.

1.  Check the box labeled _Enable auto-assign public IPv4 address_.

1.  Select the _Save_ button.

## Tag the control-plane Subnets

The following steps are only required if your cluster is in multiple Availability Zones (as defined in `ClusterProvisioner.spec.aws.availabilityZones`) and your cluster is using existing Subnets for the control-plane nodepool.

1. Tag the Subnets used by the control-plane nodepool with `konvoy/subnet=control_plane`.

## Create DKP Bootstrap Controllers on Konvoy 1.8 Cluster

You must configure the adopted cluster as self-managed. The bootstrap controllers must successfully deploy on the cluster for it to become self-managed. Do not begin the other cluster adoption steps until this is successful.

CAPA controllers gain access to the AWS APIs from the policies you attach to the IAM instance profile in a later step. The bootstrap credentials can expire, so the controllers on the cluster should not use them.

```bash
dkp --kubeconfig=admin.conf create bootstrap controllers --with-aws-bootstrap-credentials=false
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

1.  Create the Konvoy 2.1 configuration with the command:

    ```bash
    dkp --kubeconfig=admin.conf prepare-to-adopt cluster aws
    ```

    The output appears similar to this:

    ```sh
    secret/konvoy-migration-ca adopted
    secret/konvoy-migration-sa adopted
    secret/konvoy-migration-etcd adopted
    secret/konvoy-migration-proxy adopted
    secret/konvoy-migration-etcd-encryption-config adopted
    cluster.cluster.x-k8s.io/konvoy-migration adopted
    awscluster.infrastructure.cluster.x-k8s.io/konvoy-migration adopted
    kubeadmcontrolplane.controlplane.cluster.x-k8s.io/konvoy-migration-control-plane adopted
    awsmachinetemplate.infrastructure.cluster.x-k8s.io/konvoy-migration-control-plane adopted
    clusterresourceset.addons.cluster.x-k8s.io/calico-installation-konvoy-migration adopted
    configmap/calico-cni-konvoy-migration adopted
    secret/konvoy-migration-control-plane-0 adopted
    kubeadmconfig.bootstrap.cluster.x-k8s.io/konvoy-migration-control-plane-0 adopted
    machine.cluster.x-k8s.io/konvoy-migration-control-plane-0 adopted
    awsmachine.infrastructure.cluster.x-k8s.io/konvoy-migration-control-plane-0 adopted
    secret/konvoy-migration-control-plane-1 adopted
    kubeadmconfig.bootstrap.cluster.x-k8s.io/konvoy-migration-control-plane-1 adopted
    machine.cluster.x-k8s.io/konvoy-migration-control-plane-1 adopted
    awsmachine.infrastructure.cluster.x-k8s.io/konvoy-migration-control-plane-1 adopted
    secret/konvoy-migration-control-plane-2 adopted
    kubeadmconfig.bootstrap.cluster.x-k8s.io/konvoy-migration-control-plane-2 adopted
    machine.cluster.x-k8s.io/konvoy-migration-control-plane-2 adopted
    awsmachine.infrastructure.cluster.x-k8s.io/konvoy-migration-control-plane-2 adopted
    machinedeployment.cluster.x-k8s.io/konvoy-migration-worker adopted
    awsmachinetemplate.infrastructure.cluster.x-k8s.io/konvoy-migration-worker adopted
    kubeadmconfigtemplate.bootstrap.cluster.x-k8s.io/konvoy-migration-worker adopted
    machineset.cluster.x-k8s.io/konvoy-migration-worker adopted
    secret/konvoy-migration-worker-0 adopted
    kubeadmconfig.bootstrap.cluster.x-k8s.io/konvoy-migration-worker-0 adopted
    machine.cluster.x-k8s.io/konvoy-migration-worker-0 adopted
    awsmachine.infrastructure.cluster.x-k8s.io/konvoy-migration-worker-0 adopted
    secret/konvoy-migration-worker-1 adopted
    kubeadmconfig.bootstrap.cluster.x-k8s.io/konvoy-migration-worker-1 adopted
    machine.cluster.x-k8s.io/konvoy-migration-worker-1 adopted
    awsmachine.infrastructure.cluster.x-k8s.io/konvoy-migration-worker-1 adopted
    secret/konvoy-migration-worker-2 adopted
    kubeadmconfig.bootstrap.cluster.x-k8s.io/konvoy-migration-worker-2 adopted
    machine.cluster.x-k8s.io/konvoy-migration-worker-2 adopted
    awsmachine.infrastructure.cluster.x-k8s.io/konvoy-migration-worker-2 adopted
    secret/konvoy-migration-worker-3 adopted
    kubeadmconfig.bootstrap.cluster.x-k8s.io/konvoy-migration-worker-3 adopted
    machine.cluster.x-k8s.io/konvoy-migration-worker-3 adopted
    INFO[2021-11-15T19:59:35-05:00] Run 'export CLUSTER_NAME=konvoy-migration' and follow the rest of the documentation  src="cluster/adopt.go:178"
    ```

1.  Update your environment with the cluster name for use in later steps, by running the shell command from the last line of output in the previous step, `export CLUSTER_NAME=konvoy-migration` in this example:

    ```bash
    export CLUSTER_NAME=<your cluster name>
    ```

1.  Then, verify that your environment has the cluster name:

    ```bash
    echo $CLUSTER_NAME
    ```

    The output should be your cluster name, for example:

    ```sh
    konvoy-migration
    ```

## Update the Pod Subnet Configuration

1.  Find the Pod subnet in your Konvoy 1.8 cluster configuration:

    ```bash
    grep "podSubnet" cluster.yaml
    ```

    The output appears similar to this:

    ```text
    podSubnet: 192.168.0.0/16
    ```

1.  Add the Pod subnet to the `kubeadm-config` ConfigMap by copying the field from the cluster configuration and pasting it into the ConfigMap:

    ```bash
    kubectl --kubeconfig=admin.conf -n kube-system edit configmap kubeadm-config
    ```

    Do **not** change any other values in the ConfigMap. After you add the Pod subnet, the ConfigMap should look like this:

    ```yaml
    apiVersion: v1
    data:
      ClusterConfiguration: |
        ...
        networking:
          ...
          podSubnet: 192.168.0.0/16
    ```

## Remove the Konvoy 1.8 Auto-Provisioner

1.  Delete the auto-provisioner Helm chart using the Helm CLI (version 3):

    ```bash
    helm --kubeconfig=admin.conf --namespace konvoy uninstall auto-provisioning
    ```

    The output appears similar to this:

    ```sh
    release "auto-provisioning" uninstalled
    ```

1.  Remove the `konvoy` namespace:

    ```bash
    kubectl --kubeconfig=admin.conf delete namespace konvoy
    ```

    The output appears similar to this:

    ```sh
    namespace "konvoy" deleted
    ```

## Prepare Calico to be upgraded

1.  Patch the `calico-node` DaemonSet to trigger a rolling update of the calico-node pods with the command:

    ```bash
    kubectl --kubeconfig=admin.conf patch -n kube-system daemonset/calico-node -p '{"spec":{"template":{"spec":{"$setElementOrder/containers":[{"name":"calico-node"},{"name":"bird-metrics"}],"affinity":null,"containers":[{"$setElementOrder/env":[{"name":"DATASTORE_TYPE"},{"name":"WAIT_FOR_DATASTORE"},{"name":"NODENAME"},{"name":"CALICO_NETWORKING_BACKEND"},{"name":"CLUSTER_TYPE"},{"name":"CALICO_IPV4POOL_IPIP"},{"name":"FELIX_IPINIPMTU"},{"name":"CALICO_IPV4POOL_CIDR"},{"name":"CALICO_DISABLE_FILE_LOGGING"},{"name":"FELIX_DEFAULTENDPOINTTOHOSTACTION"},{"name":"FELIX_IPV6SUPPORT"},{"name":"FELIX_LOGSEVERITYSCREEN"},{"name":"FELIX_HEALTHENABLED"},{"name":"FELIX_PROMETHEUSMETRICSENABLED"},{"name":"FELIX_PROMETHEUSMETRICSPORT"}],"env":[{"$patch":"delete","name":"IP"}],"name":"calico-node"}]}}}}'
    ```

    The output appears similar to this:

    ```sh
    daemonset.apps/calico-node patched
    ```

1.  Wait for the new pods to finish rolling out:

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

## Adopt the cluster

The `dkp adopt` command performs several steps.

Every Machine has a bootstrap configuration (KubeadmConfig) and bootstrap data (Secret). These must have owner references to be included in the "move" operation.

When the cluster adoption process reconciles a Machine object that has not been bootstrapped, it creates the KubeadmConfig from the associated KubeadmConfigTemplate, and CABPK creates the Secret when it reconciles the KubeadmConfig. The owner references are set at this time.

DKP machines are already bootstrapped and also create the KubeadmConfigs and the Secrets. This command will set the appropriate owner references on these resources.

If your cluster is in multiple Availability Zones a DKP 2.x nodepool worker will be automatically created for each zone, appending the name of the Availability Zone to the nodepool's name.

This command also stops the pause on the Cluster object, which then starts the reconcile process:

```bash
dkp --kubeconfig=admin.conf adopt cluster aws
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
├─ClusterInfrastructure - AWSCluster/konvoy-migration                True                     62s
├─ControlPlane - KubeadmControlPlane/konvoy-migration-control-plane  True                     62s
│ └─3 Machines...                                                    True                     66s    See konvoy-migration-control-plane-0, konvoy-migration-control-plane-1, ...
└─Workers
  └─MachineDeployment/konvoy-migration-worker                        True                     52s
    └─4 Machines...                                                  True                     69s    See konvoy-migration-worker-0, konvoy-migration-worker-1, ...
```

The cluster, control plane, and worker node pool should all show the value `True` in the Ready column.

## Wait for Calico to be upgraded

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
kubectl --kubeconfig=admin.conf delete pods -n capi-system -l cluster.x-k8s.io/provider=cluster-api
```

The output appears similar to this:

```sh
pod "capi-controller-manager-d4b9c7c4c-hkqfl" deleted
```

## Create an AMI that is compatible with Konvoy 2.x, Kubernetes v1.21.6, and CentOS 7

You use this AMI to update the cluster Kubernetes version to v1.21.6.

1.  Create the AMI using [Konvoy Image Builder][kib] (you must [use the Konvoy Image Builder v1.5.0 release, downloadable from GitHub][kib-releases]):

    ```bash
    echo "kubernetes_version: 1.21.6" > kubever.yaml
    konvoy-image build images/ami/centos-7.yaml --overrides kubever.yaml
    ```

    The output appears similar to this:

    ```sh
    writing new packer configuration to work/centos-7-1637107496-rPzRE
    starting packer build
    centos-7: output will be in this color.

    ...
    Build 'centos-7' finished after 13 minutes 53 seconds.

    ==> Wait completed after 13 minutes 53 seconds

    ==> Builds finished. The artifacts of successful builds are:
    --> centos-7: AMIs were created:
    us-west-2: ami-0e7253eeb699eddca

    --> centos-7: AMIs were created:
    us-west-2: ami-0e7253eeb699eddca
    ```

## Prepare the Dex Addon for Kubernetes v1.21.6

The Dex Addon acts as the cluster's OpenID Connect identity provider. You must change its configuration so that it works correctly with both Kubernetes v1.21.6 and v1.20.13.

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

## Update the cluster control plane Kubernetes version to v1.21.6

1.  Add your Kubernetes v1.21.6 AMI to your environment:

    ```bash
    export CONTROL_PLANE_AMI_ID=<your ami ID>
    ```

    Then verify that your environment has the AMI ID:

    ```bash
    echo $CONTROL_PLANE_AMI_ID
    ```

    The output should be the ID of the Kubernetes v1.21.6 AMI you created, for example:

    ```sh
    ami-0e7253eeb699eddca
    ```

1.  Prepare patches with the above AMI and Kubernetes version.

    ```bash
    export KUBERNETES_VERSION=v1.21.6
    export KUBEADMCONTROLPLANE_NAME=$(set -o nounset -o pipefail; kubectl --kubeconfig=admin.conf get kubeadmcontrolplanes --selector=cluster.x-k8s.io/cluster-name=${CLUSTER_NAME} -ojsonpath='{.items[0].metadata.name}')
    export CURRENT_TEMPLATE_NAME=$(kubectl --kubeconfig=admin.conf get kubeadmcontrolplanes ${KUBEADMCONTROLPLANE_NAME} -ojsonpath='{.spec.machineTemplate.infrastructureRef.name}')
    export NEW_TEMPLATE_NAME=${KUBEADMCONTROLPLANE_NAME}-${KUBERNETES_VERSION}

    cat <<EOF > control-plane-kubernetes-version-patch.yaml
    apiVersion: controlplane.cluster.x-k8s.io/v1alpha4
    kind: KubeadmControlPlane
    spec:
      version: ${KUBERNETES_VERSION}
    EOF

    cat <<EOF > control-plane-machine-image-patch.yaml
    apiVersion: infrastructure.cluster.x-k8s.io/v1alpha4
    kind: AWSMachineTemplate
    spec:
      template:
        spec:
          ami:
            id: ${CONTROL_PLANE_AMI_ID}
    EOF
    ```

1.  Start the update.

    Create a new AWSMachineTemplate; it is a copy of the currently used AWSMachineTemplate, patched with the up-to-date machine properties.

    ```bash
    kubectl --kubeconfig=admin.conf get awsmachinetemplate ${CURRENT_TEMPLATE_NAME} --output=yaml \
      | kubectl --kubeconfig=admin.conf patch --local=true -f- --patch="{\"metadata\": {\"name\": \"$NEW_TEMPLATE_NAME\"} }" --type=merge --output=yaml \
      | kubectl --kubeconfig=admin.conf patch --local=true -f- --patch-file=control-plane-machine-image-patch.yaml --type=merge --output=yaml \
      | kubectl --kubeconfig=admin.conf create -f-
    ```

    The output appears similar to this:

    ```sh
    awsmachinetemplate.infrastructure.cluster.x-k8s.io/konvoy-migrate-control-plane-v1.21.6 created
    ```

    Patch the KubeadmControlPlane to reference the new AWSMachineTemplate created in the previous step, and to use the new Kubernetes version.

    <p class="message--note"><strong>NOTE: </strong>Patching the KubeadmControlPlane starts the control plane update. The process updates machines with updated properties, and deletes machines with out-of-date properties, in a "rolling" update. New machines replace old machines one at a time. The update waits for each new machine to join the control plane successfully. Regardless of the specified replica count, the update works in the same way.

    ```bash
    kubectl --kubeconfig=admin.conf get kubeadmcontrolplane ${KUBEADMCONTROLPLANE_NAME} --output=yaml \
      | kubectl --kubeconfig=admin.conf patch --local=true -f- --patch="{\"spec\": {\"machineTemplate\": {\"infrastructureRef\": {\"name\": \"$NEW_TEMPLATE_NAME\"} } } }" --type=merge --output=yaml \
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

<p class="message--note"><strong>NOTE: </strong>If your <strong>cluster is in multiple Availability Zones</strong>, repeat the following for the number of zones, using values <code>0</code>,<code>1</code>,<code>2</code> in <code>{.items[0].metadata.name}</code> when exporting <code>MACHINEDEPLOYMENT_NAME</code>.</p>

1.  Add your Kubernetes v1.21.6 AMI to your environment:

    ```bash
    export WORKER_AMI_ID=<your ami ID>
    ```

1.  Then, verify that your environment has the AMI ID:

    ```bash
    echo $WORKER_AMI_ID
    ```

    The output should be the ID of the Kubernetes v1.21.6 AMI you created earlier, for this example:

    ```sh
    ami-0e7253eeb699eddca
    ```

1.  Prepare patches with the above AMI and Kubernetes version.

    ```bash
    export KUBERNETES_VERSION=v1.21.6
    export MACHINEDEPLOYMENT_NAME=$(set -o nounset -o pipefail; kubectl --kubeconfig=admin.conf get machinedeployments --selector=cluster.x-k8s.io/cluster-name=${CLUSTER_NAME} -ojsonpath='{.items[0].metadata.name}')
    export CURRENT_TEMPLATE_NAME=$(kubectl --kubeconfig=admin.conf get machinedeployments ${MACHINEDEPLOYMENT_NAME} -ojsonpath='{.spec.template.spec.infrastructureRef.name}')
    export NEW_TEMPLATE_NAME=${MACHINEDEPLOYMENT_NAME}-${KUBERNETES_VERSION}

    cat <<EOF > node-pool-kubernetes-version-patch.yaml
    apiVersion: cluster.x-k8s.io/v1alpha4
    kind: MachineDeployment
    spec:
      template:
        spec:
          version: ${KUBERNETES_VERSION}
    EOF

    cat <<EOF > node-pool-machine-image-patch.yaml
    apiVersion: infrastructure.cluster.x-k8s.io/v1alpha4
    kind: AWSMachineTemplate
    spec:
      template:
        spec:
          ami:
            id: ${WORKER_AMI_ID}
    EOF
    ```

1.  Start the update.

    Create a new AWSMachineTemplate; it is a copy of the currently used AWSMachineTemplate, patched with the up-to-date machine properties.

    ```bash
    kubectl --kubeconfig=admin.conf get awsmachinetemplate ${CURRENT_TEMPLATE_NAME} --output=yaml \
      | kubectl --kubeconfig=admin.conf patch --local=true -f- --patch="{\"metadata\": {\"name\": \"$NEW_TEMPLATE_NAME\"} }" --type=merge --output=yaml \
      | kubectl --kubeconfig=admin.conf patch --local=true -f- --patch-file=node-pool-machine-image-patch.yaml --type=merge --output=yaml \
      | kubectl --kubeconfig=admin.conf create -f-
    ```

    The output appears similar to this:

    ```sh
    awsmachinetemplate.infrastructure.cluster.x-k8s.io/konvoy-migrate-worker-v1.21.6 created
    ```

    Patch the MachineDeployment to reference the new AWSMachineTemplate created in the previous step, and to use the new Kubernetes version.

    <p class="message--note"><strong>NOTE: </strong>Patching the MachineDeployment starts the worker node pool update. This process creates machines with updated properties, and deletes machines with out-of-date properties, in a "rolling" update. New machines replace old machines one at a time. The update waits for each new machine to join the cluster successfully.</p>

    ```bash
    kubectl --kubeconfig=admin.conf get machinedeployment ${MACHINEDEPLOYMENT_NAME} --output=yaml \
      | kubectl --kubeconfig=admin.conf patch --local=true -f- --patch="{\"spec\": {\"template\": {\"spec\": {\"infrastructureRef\": {\"name\": \"$NEW_TEMPLATE_NAME\"} } } } }" --type=merge --output=yaml \
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

    <p class="message--note"><strong>NOTE: </strong>As stated above, if your <strong>cluster is in multiple Availability Zones</strong>, return to step 3 in this section.
    Edit the <code>export MACHINEDEPLOYMENT_NAME</code> section that has the number of zones, and increment it by one (for example if you had <code>export MACHINEDEPLOYMENT_NAME= ...'{.items[0].metadata.name}'</code> - adjust this to say <code>export MACHINEDEPLOYMENT_NAME= ...'{.items[1].metadata.name}'</code>.
    Then, follow the steps until the <code>machinedeployment</code> update is complete.
    Repeat these steps for all of the Availability Zones for your cluster.</p>

[kib]: ../../../image-builder
[kib-releases]: https://github.com/mesosphere/konvoy-image-builder/releases
