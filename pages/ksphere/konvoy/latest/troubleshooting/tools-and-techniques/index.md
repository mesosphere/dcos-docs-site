---
layout: layout.pug
navigationTitle: Troubleshooting Technique
title: Troubleshooting Technique
menuWeight: 12
excerpt: Techniques and tools for debugging Kubernetes problems
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

Kubernetes offers a robust API for interrogating the state of the cluster, configuration environment, applications deployed on it, and the networking that connects it all.

The Kubernetes community documentation provides tremendous value for analyzing a problem and identifying a solution.

- [Troubleshooting Overview][ts-overview]
- [Troubleshooting your Cluster][ts-cluster]
- [Troubleshooting your Application][ts-application]
- [Determine Reason for a Pod Failure][ts-pod-failure]
- [Debug Pods][ts-pods]
- [Debug Services][ts-services]
- [Debugging Nodes with `crictl`][ts-crictl]
- [Getting a Shell into a Running Container][ts-live-shell]

Reviewing the community documentation is strongly recommended, as it provides significant useful context.

# Exploring Errors in Kubernetes

While distributed systems experience many categories of errors, and there is no singular process for diagnosing all errors in Kubernetes, there are a few steps that can help you find your way around.

## Identify the type of failure

**Networking errors** will often be manifest in:

- Pods starting, but being unable to reach other pods. Check pod logs for indications via `kubectl logs`.
- Pods failing to start, stuck in Pending state, or are unscheduleable. Check Kubernetes state via `kubectl describe pod`, and notice the Events section.
- Services unreachable, either within the cluster or externally. Check Kubernetes state via `kubectl describe service`.
  - A misconfiguration of the service's `selector` will result in the service successfully registering, but no pods being selected as endpoints behind it. As such, `kubectl describe service` will show it having no associated endpoints.

**Storage failures** will often be manifest in:

- Pods failing to start, stuck in Pending state, or are unscheduleable. Check Kubernetes state via `kubectl describe pod`, and notice the Events section.
- PersistentVolumeClaims being unresolved. Check Kubernetes state for related objects, `kubectl get sc,pv,pvc`; this should also be indicated in the Pod's Events section.
- Applications exceeding storage allocation; Check pod logs for indications via `kubectl logs`.

**Deployment Configuration failures** will often manifest in:

- Pods failing to start, stuck in Pending state, or are unscheduleable.
  Check Kubernetes state via `kubectl describe pod`, and notice the Events section.
  - Often this results from misconfigured storage volumes, [configuration maps][task-configmap], or [secrets][task-secret].

# Diagnostics with Konvoy

Konvoy offers automation to identify many infrastructure and configuration problems. These diagnostics focus on Kubernetes' core system, the underlying infrastructure, and the operational tools Konvoy provides within Kubernetes.

**NOTE** These diagnostics _do not_ target application runtime errors, errors in their configuration, or any side-effects of application workloads inside Kubernetes.

## Verify system prerequisites

Running Kubernetes with Konvoy requires some specific system configurations on each machine. This command validates those requirements:

```bash
konvoy check preflight
```

Preflight checks target the underlying infrastructure, and its viablilty for hosting a Kubernetes cluster.
These checks can help isolate and identify underlying problems that would effect Kubernetes, but may not be directly apparent in Kubernetes API.
Some of the requirements it validates:

- The machine is reachable by SSH, and has a suitable SSH configuration
- A suitable version of Python is installed
- Operating System matches supported platforms
- Nodes can reach public Docker registries and find required images
- Package registries for supported OS are reachable
- Swap is disabled
- Compatible network configurations (e.g. avoiding subnet overlaps)
- Nodes can reach each other on their networks
- Required network ports are available

Running the preflight checks is recommended when:

- A node seems to be unreachable or unresponsive, in Kubernetes.
- Applications are failing to communicate across the cluster.
- Operating system upgrades, system configuration, or network maintenance may have interrupted service.

## Verify health of nodes

Once a Kubernetes cluster is operational, additional node health checks are available by querying the API.
This command performs those checks:

```bash
konvoy check nodes
```

Node health checks target the system components of Kubernetes and container orchestration on each node.
These checks can help isolate and identify machine-specific problems that may interfere with application (pod) operations and connectivity.
In addition to all the preflight checks, this also validates:

- Required kernel settings are in effect, mostly for container networking
- Critical Kubernetes components are running and healthy
- Critical system commands are available

Running node health checks is recommended when:

- Kubernetes reports that a node is unhealthy
- Pods are scheduled to a node, but not starting
- Pods are running, but not reachable within the cluster's network

**NOTE** Some pod execution errors may be explored via [local node debugging with crictl][ts-crictl].

## Verify Kubernetes cluster health

As a Kubernetes cluster lifecycle advances, a cluster will need upgrades, and nodes will be added, removed, and undergo other maintenance.
This command checks that the cluster is healthy, after operations like these:

```bash
konvoy check kubernetes
```

This suite of checks validates:

- The container network (calico) is running and healthy on all nodes
- All nodes in the cluster infrastructure are reporting healthy in Kubernetes
- Control plane components report correct versions

Running Kubernetes health checks is recommended when:

- The API server appears to be down, unreachable, or unresponsive
- Deployments are failing: pods and other resources cannot be created in the API
- Deployments appear to succeed, but expected results are failing
  - Example: A Service (type LoadBalancer) was created, but the External IP is never reported for the service.
- Applications in the cluster cannot connect to each other's services.
- After all cluster upgrades

**NOTE** Control plane components in Konvoy are deployed as containers, so some debugging efforts may require [local node debugging with crictl][ts-crictl].

## Verify installed addons

Konvoy provides a suite of opertional tools, to fulfill a production-ready Kubernetes environment.
This command ensures that they're all installed and running correctly:

```bash
konvoy check addons
```

In particular, this checks:

- All enabled addons are installed and running
- The deployed addons match the configuration of `cluster.yaml`

**NOTE** If you manually customize components of a deployed addon, without tuning the associated `values` field for that addon in `cluster.yaml`, this command may report an error in your addon deployment.

Running addon health checks is recommended when:

- Any Konvoy addon is unreachable or unresponsive, e.g. Prometheus is down
- Logging and metrics data are not updating in Kibana and Grafana
- An application deployed with an Ingress is unreachable

**NOTE** In Konvoy, addons behave like applications.
For further insight, review [the Kubernetes application troubleshooting guide][ts-application].

[ts-overview]: https://kubernetes.io/docs/tasks/debug-application-cluster/troubleshooting/
[ts-application]: https://kubernetes.io/docs/tasks/debug-application-cluster/debug-application/
[ts-cluster]: https://kubernetes.io/docs/tasks/debug-application-cluster/debug-cluster/
[ts-pods]: https://kubernetes.io/docs/tasks/debug-application-cluster/debug-pod-replication-controller/
[ts-services]: https://kubernetes.io/docs/tasks/debug-application-cluster/debug-service/
[ts-crictl]: https://kubernetes.io/docs/tasks/debug-application-cluster/crictl/
[ts-pod-failure]: https://kubernetes.io/docs/tasks/debug-application-cluster/determine-reason-pod-failure/
[ts-live-shell]: https://kubernetes.io/docs/tasks/debug-application-cluster/get-shell-running-container/
[secret]: https://kubernetes.io/docs/concepts/configuration/secret/
[task-secret]: https://kubernetes.io/docs/tasks/inject-data-application/distribute-credentials-secure/
[task-configmap]: https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/
