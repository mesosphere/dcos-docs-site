---
layout: layout.pug
navigationTitle: User Defined Workloads
title: Standard Workloads
menuWeight: 4
beta: false
excerpt: Deploy a user defined workload on Konvoy
---

## Standard Workloads

The default standard Kubernetes workload declaration format is JSON. However, most of the time YAML, a subset of JSON, is used. This format is used for all packaging mechanisms and is essential to know when working with Kubernetes.

### Manifest Files

This is a common layout in JSON or YAML that describes a Kubernetes resource. It has the following form:

```yaml
apiVersion:
kind:
metadata:
spec:
```

The `apiVersion` and `kind` provide the type and version of a resource to be created. The `metadata` is used to provide the name along with other metadata. The `spec` is different depending on the `kind` of resource being expressed.

Frequently, deployment of workloads requires more than 1 resource and there is a desire to manage the resources together. In this case, you can combine the resources in the same file, known as the manifest file, providing in YAML `---` as a separator between resources. An example might be a `nginx` pod, with a service definition as shown:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-svc
spec:
  type: LoadBalancer
  ports:
  - port: 80
  selector:
    app: nginx
---
apiVersion: v1
kind: Pod
metadata:
  labels:
    app: nginx
  name: nginx
spec:
  containers:
  - image: nginx:1.19.3
    name: nginx
```

### Deploying a workload

If this manifest file was named `nginx.yaml`, to deploy this workload, use the `kubectl create` command as follows:

```bash
kubectl create -f nginx.yaml
```

<p class="message--note"><strong>NOTE: </strong>Make sure you are in the correct namespace or specify the namespace with <code>-n &lt;ns&gt;</code> as part of the command.</p>

This creates a Kubernetes Pod and Service. It takes time for the workload to start running. This includes getting scheduled, pulling the image, and executing the service. In the case of a pod, you can check its status by `get`ting the pods or watching the pods. An example:

```bash
kubectl get pod
```

```sh
NAME    READY   STATUS    RESTARTS   AGE
nginx   1/1     Running   0          5m15s
```

### Debugging

All the events for pod workloads are recorded as Kubernetes `events` and provide good insight to understanding any challenges that might be present. Run `kubectl get events` to retrieve these events. This data expires by default after 1 hour.

```bash
kubectl get events
```

```sh
LAST SEEN   TYPE     REASON      OBJECT      MESSAGE
67s         Normal   Scheduled   pod/nginx   Successfully assigned default/nginx to kind-control-plane
67s         Normal   Pulled      pod/nginx   Container image "nginx:1.19.3" already present on machine
67s         Normal   Created     pod/nginx   Created container nginx
66s         Normal   Started     pod/nginx   Started container nginx
```

`events` provide the order of events, such as scheduled, pulled, created, and started. It also indicates the node that it was scheduled to and what imaging is being pulled (or in this case that it is resident on the node and no pull occurred).

The previous example is a successful case. The following example shows a pod that is `pending`.

```bash
kubectl get pod
```

```sh
NAME    READY   STATUS    RESTARTS   AGE
nginx   0/1     Pending   0          104s
```

The events show:

```bash
kubectl get events
```

```sh
LAST SEEN   TYPE      REASON             OBJECT      MESSAGE
8s          Warning   FailedScheduling   pod/nginx   0/1 nodes are available: 1 Insufficient cpu.
```

Here, the reason for the "pending" is there is a "FailedScheduling." The message indicates there are no nodes that have sufficient CPUs for the workload configuration.

## Related information

For information on related topics or procedures, refer to the following:

- [Install and Setup kubectl][kubectl]
- [Overview of kubectl][kubectl-overview]
- [kubectl Cheat Sheet][kubectl-cheatsheet]

[kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[kubectl-cheatsheet]: https://kubernetes.io/docs/reference/kubectl/cheatsheet/
[kubectl-overview]: https://kubernetes.io/docs/reference/kubectl/overview/
