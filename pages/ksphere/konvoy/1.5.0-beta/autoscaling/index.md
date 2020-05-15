---
layout: layout.pug
navigationTitle: Autoscaling
title: Autoscaling clusters
menuWeight: 12
excerpt: Autoscaling the Konvoy cluster
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

For production clusters, you might want to autoscale, on demand, your clusters.
Konvoy provides an autoscaling feature that works at the node pool level.
Node pools can be configured to define autoscaling properties such as the maximum size
and minimum size of the chosen pools. The Konvoy autoscaler can not scale up or down a pool beyond the
defined max and min thresholds.

Konvoy uses the [cluster-autoscaler][autoscaler] community tool for autoscaling.

<p class="message--note"><strong>NOTE: </strong> This feature is only supported for AWS and Azure cloud providers.</p>

## Configure autoscaling capabilities to the worker pool

In the following example, our cluster specification enables autoscaling for the worker
pool:

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta1
metadata:
  name: mycluster
spec:
  provider: aws
  aws:
    region: us-west-2
    availabilityZones:
    - us-west-2c
  nodePools:
  - name: worker
    count: 2
    machine:
      type: m5.2xlarge
    autoscaling:
      minSize: 2
      maxSize: 4
  - name: control-plane
    controlPlane: true
    count: 3
    machine:
      type: m5.xlarge
  version: v1.5.0  
```

The worker pool scales up to a maximum of 4 machines and scales down
to a minimum of 2 machines.
The scaling decisions are based on the usage of the resources
and requested resources, as detailed below.

<p class="message--note"><strong>NOTE: </strong> Autoscaling is not enabled for control-plane and bastion node pools.</p>

After the cluster specification is configured, `konvoy up -y` applies the required
changes to our cluster to start autoscaling the worker pool on
demand. When the command completes successfully, certain configuration files of our cluster
are stored in Kubernetes.
This keeps the cluster state up-to-date for any change triggered by the autoscaler.
This prevents the system from having multiple or out-dated cluster specifications.

The following files are stored in Kubernetes when using the autoscaling feature:

* `cluster.yaml`: the cluster specification is stored in Kubernetes in the
`konvoy` namespace as part of the resource `KonvoyCluster` resource:

```shell
kubectl get konvoycluster -n konvoy
NAMESPACE                    NAME           DISPLAY NAME   STATUS        PROVIDER   AGE    PROVISIONING PAUSED
konvoy                       mycluster      New Cluster    Provisioned   aws        6d2h
```

<p class="message--note"><strong>NOTE: </strong> The `cluster.yaml` specification is no longer located in the working directory.</p>

A `KonvoyCluster` custom Kubernetes resource has the following structure:

```yaml
apiVersion: kommander.mesosphere.io/v1beta1
kind: KonvoyCluster
metadata:
  generateName: konvoy-
  annotations:
    kommander.mesosphere.io/display-name: Some display name
spec:
  cluster:
    ...Konvoy Kubernetes cluster configuration as in cluster.yaml...
  provisioner:
    ...Konvoy provisioner configuration as in cluster.yaml...
  cloudProviderAccountRef:
    name: ...name of cloud provider account if created otherwise created by default...
  provisioningPaused: ...flag to pause any provisioning actions...
  terraformExtrasProvisionerRef:
    name: ...Konvoy Terraform extra provisioner files if used (optional)...
status:
  adminConfSecretRef:
    name: ...kubeconfig to access the installed cluster...
```

* `ssh-keys`: your ssh credentials are stored in a Kubernetes `Secret` in namespace `konvoy`
with the name `<CLUSTER_NAME>-kubeconfig`.

* `admin.conf`: your kubeconfig file, while present in your working directory,
is also stored in the cluster, but present in the current working directory,
as `<CLUSTER_NAME>-kubeconfig` in the `konvoy` namespace.

* `terraform.tfstate`: this Terraform file stores the state of the cluster, and is crucial for
keeping the infrastructure configuration up-to-date.
Konvoy autoscaler pushes this file to Kubernetes, like it does `cluster.yaml`
and other files, to keep the Terraform state up-to-date, for when the Konvoy autoscaler
triggers scaling actions.

* `extras/provisioner`: all the Terraform extra files are stored in a Kubernetes `ConfigMap`
in the `konvoy` namespace, if present in the working directory.

When all the cluster states are stored in Kubernetes, users can find all their configurations
under the `konvoy` namespace, e.g. `kubectl get all -n konvoy`.

The Konvoy autoscaler deploys two pods.

```shell
kubectl get pods -n konvoy
NAME                                                              READY   STATUS    RESTARTS   AGE
mycluster-kbk4w                                                  1/1     Running   0          5s
mycluster-kubeaddons-konvoy-cluster-autoscaler-55f48c876dp2z9h   1/1     Running   0          98m
```

To make any future change to the configuration of the Konvoy cluster,
you must use the `konvoy pull` command to fetch the required files in your working directory.

```shell
konvoy pull -h
Pull cluster state

Usage:
  konvoy pull state [flags]

Flags:
      --cluster-name string   Name used to prefix the cluster and all the created resources (default "mycluster")
  -h, --help                  help for pull
      --verbose               enable debug level logging
```

```shell
konvoy pull

Kubernetes cluster state pulled successfully!
```

`konvoy pull` fetches the cluster state, and creates or updates the required files to continue
operating the cluster from the working directory.
We recommendation using `pull` right before making any changes to the Konvoy cluster.
In the future, Konvoy will warn users when there are differences between the Konvoy cluster state in the
working directory, versus the cluster state in Kubernetes.

In addition to `konvoy pull`, Konvoy provides a new command to store the cluster
state in Kubernetes, `konvoy push`:

```shell
konvoy push -h
Push cluster state

Usage:
  konvoy push state [flags]

Flags:
      --cloud-provider-account-name string   Name of the Cloud Provider Account used to create the resources
      --force                                Force push the cluster state
  -h, --help                                 help for push
      --verbose                              enable debug level logging
```

This `push` command stores the cluster state, on demand, in Kubernetes.
It allows lets users specify a certain cloud provider credentials that might differ
from those used during the cluster bootstrap operation.

```shell
konvoy push --cloud-provider-account-name=my-specific-aws-cloudaccount

Kubernetes cluster state pushed successfully!
```

To use this command, you need to create a previous `CloudProviderAccount` Kubernetes resource which references a Kubernetes
secret with the [AWS][aws-prerequisites] or [Azure][azure-prerequisites] cloud credentials.

```yaml
apiVersion: kommander.mesosphere.io/v1beta1
kind: CloudProviderAccount
metadata:
  generateName: my-specific-aws-cloudaccount
  annotations:
    kommander.mesosphere.io/display-name: Some display name
spec:
  provider: aws
  credentialsRef:
    name: ...name of secret created above...
```

An example of a Kubernetes secret, with the credentials, could be:

```yaml
apiVersion: v1
kind: Secret
metadata:
  generateName: myawscreds-
data:
  credentials: ...aws credentials file content...
  config: ...optional aws config file content...
type: kommander.mesosphere.io/aws-credentials
```

## Autoscaler scaling decision making

The Konvoy autoscaler scales clusters based on the following conditions:

* there are pods that failed to run in the cluster due to insufficient resources.
* there are nodes in the cluster that have been underutilized for an extended period of time and their pods can be placed on other existing nodes.

Likewise Konvoy autoscale does **not** scale clusters under the following conditions:

* All the pods in the `candidate` node to be deleted are:
  * Pods with restrictive PodDisruptionBudget.
  * `Kube-system` pods that:
    * are not run on the node by default, *
    * don't have a [pod disruption budget][pod-disruption-budget] set or their PDB is too restrictive.
  * Pods that are not backed by a controller object (so not created by deployment, replica set, job, stateful set etc). *
  * Pods with local storage. *
  * Pods with the `priorityClassName: system-cluster-critical` property set on the pod spec, (to prevent your pod from being evicted).
  * Pods that cannot be moved elsewhere due to various constraints (lack of resources, non-matching node selectors or affinity, matching anti-affinity, etc).
  * Pods that have the following annotation set:

```yaml
"cluster-autoscaler.kubernetes.io/safe-to-evict": "false"
```

* the Konvoy machine specification does not provide enough resources to schedule the pending applications.

To disable the autoscaling of a node pool, remove the `autoscaling` property
from the node pool.

The Konvoy autoscaler deletion of nodes in the pools does not follow a specific
algorithm, it picks one node from the node pool for deletion.
Consequently certain disruptions can be caused when scaling down nodes.

## Autoscaler metrics and events

The Konvoy autoscaler provides some custom metrics that are automatically scraped
by our Prometheus adddon, if configured. These metrics contain the prefix `cluster_autoscaler_*`
and can be searched and consumed by Grafana or the Prometheus console.

Whenever a scaling decision is triggered successfully, a new event is registered
in our respective `KonvoyCluster` resource in Kubernetes. These are the two events representing
scaling up and down decisions, as shown below:

```shell
Events:
  Type    Reason                  Age    From                Message
  ----    ------                  ----   ----                -------
  Normal  ClusterScaleUpSuccess   13m    cluster-autoscaler  2 machine(s) added to nodepool "worker" by autoscaler (provider: konvoy)
  ...
  Normal  ClusterScaleDownSuccess 3m     cluster-autoscaler  1 machine removed from nodepool "worker" by autoscaler (provider: konvoy)
```

[autoscaler]: https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler
[aws-prerequisites]: ../install/install-aws#prerequisites
[azure-prerequisites]: ../install/install-azure#prerequisites
[pod-disruption-budget]: https://kubernetes.io/docs/concepts/workloads/pods/disruptions/#how-disruption-budgets-work
