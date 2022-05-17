---
layout: layout.pug
navigationTitle: Troubleshooting
title: Troubleshooting Konvoy Cluster Storage
menuWeight: 280
excerpt: Understanding and troubleshooting storage in your Konvoy clusters
beta: false
enterprise: false
---

Ensure that you read the [Operations Guide](../operations) prior to this document as it contains several important pieces of context.

## Understanding & Troubleshooting Storage Drivers

This section provides some insights into how storage on Konvoy, using storage drivers, works at a lower level. This intended effect makes it easier for the reader to understand the components involved and more prepared to troubleshoot issues in production systems.

Some storage drivers may be significantly different from others. For the purposes of this documentation we're covering the AWS, GCP and Azure storage drivers which come by default in a Konvoy deployment.

If you're using another driver such as [Portworx][portworx] make sure to review the 3rd party upstream documentation for your solution. In the case of Portworx (a D2iQ partner) their upstream troubleshooting documentation can be found [here][portworxtroubleshooting].

### Driver Structure

In Konvoy, storage solutions are often described in terms of a "driver". Conceptually a driver may contain the following components, or something similar, depending on the implementor:

- storageclasses
- controller
- node plugin pods

Below, we cover these components in more detail using the AWS driver as an example.

#### Storage Class

Driver installations include their own `StorageClass` (SC) resources that provide identification for which `PersistentVolumeClaims` (PVC) they operate on and are responsible for.

For instance the `aws-ebs-csi-driver` provides the following information:

```bash
kubectl get storageclass
```

```sh
NAME                             PROVISIONER       RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
awsebscsiprovisioner (default)   ebs.csi.aws.com   Delete          WaitForFirstConsumer   true                   17s
```

<p class="message--note"><strong>NOTE: </strong>Whichever SC is the (default), this SC is used to provision a PV for any PVC which does not explicitly select a SC. If other SCs exist on the system, the pods may use those rather than the default. When troubleshooting storage issues. pay attention to the SC actually in use to better troubleshoot storage issues.</p>

When investigating storage issues you can verify which SC is actually in use for a pod by looking at the corresponding volume definitions (using an example pod):

```bash
kubectl get pod nginx-stateful-5bdc6968df-gxhgq -o=go-template='{{range .spec.volumes}}{{.persistentVolumeClaim.claimName}}{{"\n"}}{{end}}' |grep -v 'no value'
nginx-data
```

For each entry this output produces (you can have an arbitrary number of volumes associated with a pod, and they can each use a different SC) you can view the SC in use with:

```bash
kubectl get pvc nginx-data -o=go-template='{{.spec.storageClassName}}{{"\n"}}'
awsebscsiprovisioner
```

#### Controllers

[Kubernetes Controllers][kubernetescontrollers] are programs (generally running in a pod on the cluster) that watch API resources and react to changes in state. They are responsible for driving the current state of the cluster to the desired state.

The storage driver controller watches for new PVC resources deployed to the cluster that are configured to use its storage class. The driver responds by automatically creating and binding the PV needed to satisfy that PVC.

It is helpful to first look for the controller pod, itself, and see the pods related to the controller at a glance. Using the AWS driver as an example:

```bash
kubectl -n kube-system get pods | egrep 'ebs-csi-*controller'
```

```sh
ebs-csi-controller-0                                                 6/6     Running   0          21m
ebs-csi-snapshot-controller-0                                        1/1     Running   0          21m
```

In the above example you see two controllers with two different purposes:

- `ebs-csi-controller-0` - the "main" controller responsible for general storage provisioning
- `ebs-csi-snapshot-controller-0` - the auxiliary controller responsible for volume snapshots

When creating a PVC, you can view its events to see which controller performs actions on it:

```bash
kubectl describe pvc nginx-data
```

```sh
Events:
  Type    Reason                 Age   From                                                                       Message
  ----    ------                 ----  ----                                                                       -------
  Normal  WaitForFirstConsumer   21m   persistentvolume-controller                                                waiting for first consumer to be created before binding
  Normal  ExternalProvisioning   21m   persistentvolume-controller                                                waiting for a volume to be created, either by external provisioner "ebs.csi.aws.com" or manually created by system administrator
  Normal  Provisioning           21m   ebs.csi.aws.com_ebs-csi-controller-0_3f916a6a-2845-4377-8987-9cea1062c02d  External provisioner is provisioning volume for claim "default/nginx-data"
```

From the last line in the example above, the controller `ebs-csi-controller-0` has begun provisioning the volume for the PVC `nginx-data`.

When it completes, it displays an event that declares a `Reason` for the event (such as `ProvisioningSucceeded`) and a message about the event:

```sh
Normal  ProvisioningSucceeded  21m   ebs.csi.aws.com_ebs-csi-controller-0_3f916a6a-2845-4377-8987-9cea1062c02d  Successfully provisioned volume pvc-a53be984-d4a3-4c8f-b257-99201df5de74
```

<p class="message--note"><strong>NOTE: </strong>At this point, if the storage has reached <code>ProvisioningSucceeded</code>, and I/O can be performed by the pods to the filesystem/device, and there are still storage problems, the issue may with the storage provider/service/device. The controller may not be involved. See the "Nodes" section for information on debugging storage at a lower level.</p>

Controllers are responsible for setting up workflows and reporting information about tasks as they complete. The job of doing the low-level work, connecting the storage to the right pods, takes place in the "CSI Plugin" pods, documented in the following section.

#### Nodes

[Kubernetes Nodes][kubernetesnodes] are often important to storage drivers as the node is where the `csi-plugin` creates and connects the remote (or local) filesystems and storage devices.

Sometimes, the controller has done it's job but the underlying storage is still not working properly. The answers may be in the underlying system the Kubernetes components are running on.

Failures at this level, for example, the Linux device level, or the cloud storage provider level, can grow far beyond the scope of this document. If you deployed Konvoy using `AWS`, `GCP` or `Azure` storage drivers, please refer to the cloud storage provider's documentation to debug these issues further:

- [AWS EBS][awsstoragedocs]
- [GCP][gcpstoragedocs]
- [Azure][azurestoragedocs]

If you're using [Portworx][portworx] these resources may be particularly helpful to you:

- [Portworx Documentation][portworxdocs]
- [Portworx Support][portworxsupport]

##### Plugin Pods

Plugin Pods are related to the "Controllers" section above, but are the actual instruments of the [Container Storage Interface][csi] which connects storage to the appropriate pods.

These are generally implemented as [Daemonsets][kubernetesdaemonsets] which deploy a pod for every node. This supports the provisioning of storage on that node, for its storage class, and any containers needed to support that particular storage implementation.

###### AWS Overview

In this section we provide an overview of the AWS Driver's node plugin pods, starting with a look at the underlying pods running on each node:

```bash
kubectl -n kube-system get daemonsets
```

```sh
NAME           DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR                 AGE
ebs-csi-node   7         7         7       7            7           beta.kubernetes.io/os=linux   21m
```

```bash
kubectl -n kube-system get pods | grep ebs-csi-node
```

```sh
ebs-csi-node-2t4b6                                                   3/3     Running   0          21m
ebs-csi-node-46bql                                                   3/3     Running   0          21m
ebs-csi-node-5p82m                                                   3/3     Running   0          21m
ebs-csi-node-7tkxt                                                   3/3     Running   0          21m
ebs-csi-node-886wg                                                   3/3     Running   0          21m
ebs-csi-node-wchrr                                                   3/3     Running   0          21m
ebs-csi-node-wqx59                                                   3/3     Running   0          21m
```

These pods consist of three containers, which run on the node, that coordinate the connection of storage to pods which are scheduled to that node, and have volume claims:

```bash
kubectl -n kube-system get pods ebs-csi-node-2dmp5 -o=go-template='{{range .spec.containers}}{{.name}}{{"\n"}}{{end}}'
ebs-plugin
node-driver-registrar
liveness-probe
```

The purpose of these containers running on each node are:

- ebs-plugin: connects to the AWS EBS API and does the API work to create and connect EBS storage to the underlying Linux system
- node-driver-registrar: a standard CSI sidecar container which connects the node's Kubelet to the CSI driver (to dig deeper see the [node-driver-registrar documentation][nodedriverregdocs])
- liveness-probe: a standard CSI sidecar container which monitors and reports the health of the CSI driver (to dig deeper see the [liveness-probe documentation][liveprobedocs])

When troubleshooting problems in this part of the driver stack (see the "Examples" section below for additional context) problems that arise because of EBS API errors generally show up in the logs for the `ebs-plugin` container. For example:

```bash
kubectl -n kube-system logs ebs-csi-node-2dmp5 ebs-plugin
```

```sh
I0811 20:39:19.763926       1 driver.go:62] Driver: ebs.csi.aws.com Version: v0.5.0
I0811 20:39:19.772867       1 mount_linux.go:163] Cannot run systemd-run, assuming non-systemd OS
I0811 20:39:19.772887       1 mount_linux.go:164] systemd-run failed with: exit status 1
I0811 20:39:19.772900       1 mount_linux.go:165] systemd-run output: Failed to create bus connection: No such file or directory
I0811 20:39:19.772970       1 driver.go:62] Driver: ebs.csi.aws.com Version: v0.5.0
panic: EC2 instance metadata is not available
```

At this point, the troubleshooting moves to the narrower scope of debugging the [plugin][ebsplugin] and the [AWS API][awsapi].

[d2iq]:https://d2iq.com
[solutions]:https://d2iq.com/solutions/
[portworx]:https://portworx.com
[portworxtroubleshooting]:https://docs.portworx.com/portworx-install-with-kubernetes/operate-and-maintain-on-kubernetes/troubleshooting/troubleshoot-and-get-support/
[portworxdocs]:https://docs.portworx.com
[portworxsupport]:https://docs.portworx.com/support/
[kubernetescontrollers]:https://kubernetes.io/docs/concepts/architecture/controller/
[kubernetesnodes]:https://kubernetes.io/docs/concepts/architecture/nodes/
[kubernetestaints]:https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/
[kuberneteskubelet]:https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/
[kubernetesdaemonsets]:https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/
[containerd]:https://containerd.io
[containerddocs]:https://containerd.io/docs/
[csi]:https://github.com/container-storage-interface/spec
[nodedriverregdocs]:https://kubernetes-csi.github.io/docs/node-driver-registrar.html
[liveprobedocs]:https://kubernetes-csi.github.io/docs/livenessprobe.html
[ebsplugin]:https://github.com/kubernetes-sigs/aws-ebs-csi-driver
[awsapi]:https://docs.aws.amazon.com/AWSEC2/latest/APIReference/Welcome.html
[awsstoragedocs]:https://aws.amazon.com/ebs/
[gcpstoragedocs]:https://cloud.google.com/storage
[azurestoragedocs]:https://azure.microsoft.com/services/storage
