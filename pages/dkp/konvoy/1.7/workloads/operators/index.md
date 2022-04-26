---
layout: layout.pug
navigationTitle: Controllers and Operators
title: Controllers and Operators
menuWeight: 8
beta: false
enterprise: false
---

## Controllers

Almost all aspects of component management, including workloads, are managed by [controllers][controller] in Kubernetes. Nodes are managed by a NodeController, Deployments are managed by a DeploymentController, etc. The core Kubernetes controllers are enabled by the Kubernetes Controller Manager. A controller is a program running inside or outside the cluster which has a non-terminating control loop. That control loop focuses on a specific state of the system. In Kubernetes, most control loops look at a declared or desired state and compare it to the currently observed state. Based on that comparison, the control loop may or may not take some action.

For example: ReplicaSetController. When a ReplicaSet is first created, the controller sees that (for example), the desired number of replicas is equal to 1. When it looks at the number of pods for this ReplicaSet, it sees there are 0. The controller then uses the defined Pod spec defined in the ReplicaSet spec, to `POST` a pod definition to the APIServer, which the Scheduler will then manage. The controller will continuously loop, checking to see if all ReplicaSets goals are established. Notice it does NOT create the instance of the Pod or schedule the Pod; it has a very finite interest.

While Kubernetes defines a standard set of controllers, it allows for custom controllers to be added to the system. In a default configuration, the system controllers run on the master. When adding a new controller to the system, while it can run anywhere that has connectivity to the customer, it is most commonly deployed as a workload in the cluster (meaning it is running on a worker node).

What a controller is capable of doing is up to its developer, which includes:

- No change in workloads, it can only label and annotate pods.
- Augment workloads. For instance, the [Istio][istio] controller can detect a new Pod deployment and add a controller to the pod before it is scheduled.
- Create and manage long running workloads.
- Create short running analytical workloads.

## Operators

[Operators][operator] is a Kubernetes term defining a pattern that includes a controller and often includes a [Custom Resource Definition][crd]. The concept of an Operator is that it provides specialized behavior that is specific to a domain. Think of it as a controller that is automatically performing operations instead of requiring a human to do it for a specific `kind` of service.

For example: A Cassandra operator that knows how to make sure that a new data node is deployed in a fault-tolerant way. Or the Cassandra operator, requesting Cassandra to rebalance data based on large changes in the scale of the data nodes.

It is common vernacular to use controller and operator interchangeably in Kubernetes parlance.

### Deploy Controller/Operator Workloads

When deploying a controller into a cluster, there a number of concerns that must be understood and addressed, which includes:

- Security - RBAC, Service Accounts, etc.
- Custom Resource Definitions (CRDs) that define new kinds.

It depends on the packaging being used as to how these will be handled. While many languages are supported in working with Kubernetes, [Go][go] has the most mature support.
There are 4 project styles that enable operator development. which are:

- [Controller-runtime][controller-runtime] and [Client-Go][client-go]
- [Kubebuilder][kubebuilder]
- [Operator SDK][operator-sdk]
- [KUDO][kudo]

Each of these defines their own way of deploying their workloads based on their packaging style. If you are working with an operator that is based solely on controller-runtime, there is no defined packaging and it is most likely you will have that controller packaged in a [docker][docker] image and will deploy it using techniques defined for [user defined workloads][user-workloads]. Details for working with [KUDO][kudo] and [Operator SDK][operator-sdk] are provided below.

## Related information

For information on related topics or procedures, refer to the following:

- [Deploying KUDO Workloads][kudo]
- [Deploying Operator SDK Workloads][operator-sdk]

[client-go]: https://github.com/kubernetes/client-go
[controller]: https://kubernetes.io/docs/concepts/architecture/controller/
[controller-runtime]: https://github.com/kubernetes-sigs/controller-runtime/
[crd]: https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/
[docker]: https://www.docker.com/
[go]: https://golang.org/
[istio]: https://istio.io/
[kubebuilder]: https://github.com/kubernetes-sigs/kubebuilder
[kudo]: kudo
[operator]: https://kubernetes.io/docs/concepts/extend-kubernetes/operator/
[operator-sdk]: operator-sdk
[user-workloads]: ../user-workloads
