---
layout: layout.pug
navigationTitle: Changelog
title: Changelog
menuWeight: 75
excerpt: Changelog for DC/OS Kubernetes
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes-cluster -->

## Version 2.4.9-1.15.10

### Changelog since 2.4.8-1.15.10

#### Bug Fixes

* Update Debian base container images to version stable-20200224-slim.

### Changelog since 2.4.7-1.15.10

#### Improvements

* Add option to configure Kubernetes Controller Manager terminated pod garbage collection threshold.

#### Bug Fixes

* Update base images of Kubernetes API Server, Controller Manager, Scheduler and Kube-proxy to address CVEs.
* Tighten permissions of PKI key files according to CIS benchmark recommendations.

### Changelog since 2.4.6-1.15.6

#### Improvements

* Kubernetes 1.15.10
* dcos-commons 0.57.3
* Calico 3.10.3
* Update Debian base container images to version stable-20200130-slim

### Changelog since 2.4.5-1.15.5

#### Improvements

* Kubernetes 1.15.6
* Calico 3.10.1
* CoreDNS v1.6.5
* Add option to enable AlwaysPullImages Kubernetes admission controller. See [Admission Controllers](/mesosphere/dcos/services/kubernetes/2.4.9-1.15.10/operations/admission-controllers/) for more details.
* Add option to enable Kubernetes secret encryption. See [Kubernetes secret encryption](/mesosphere/dcos/services/kubernetes/2.4.9-1.15.10/operations/encrypt-data) for more details.
* Update Debian base container images to version stable-20191118-slim.
* Remove timeout option from `dcos kubernetes cluster update` command. Now you need to check the status of deployment plan after initiating a package options update or a package version update. Use `dcos kubernetes cluster debug plan show deploy` to check when the update operation finished. This is in line with other DC/OS frameworks behavior.
* Add node controller from [calico/kube-controllers](https://docs.projectcalico.org/v3.10/reference/kube-controllers/configuration#the-calicokube-controllers-container) that watches for the removal of Kubernetes nodes and removes corresponding data from Calico.

#### Bug Fixes

* Fix a bug where sometimes a Kubernetes pod is assigned an IP from a calico-node. Changes the default Calico CNI plugin from host-local to calico-ipam. When upgrading to this MKE version installing the mandatory-addons will take longer since it has to ensure Calico deployment finishes upgrading to calico-ipam before proceeding.

#### Documentation

* Add instructions to install [Gatekeeper](/mesosphere/dcos/services/kubernetes/2.4.9-1.15.10/operations/gatekeeper) and how to use it as a replacement for Kubernetes PodSecurity policies.

### Changelog since 2.4.4-1.15.4

#### Improvements

* Kubernetes 1.15.5
* Docker 19.03.3

#### Bug Fixes

* Fix an issue where the kubelets running in control-plane tasks sometimes report invalid allocatable resources for pods.
* Ensure that control-plane kubelets are always labeled correctly.

### Changelog since 2.4.3-1.15.3

#### Improvements

* Kubernetes 1.15.4

#### Bug Fixes

* Disable Api server insecure port. It was only accessible via localhost on the kube-control-plane task, but to be CIS compliant, we now set the `--insecure-port` flag to 0.

### Changelog since 2.4.2-1.15.3

#### Improvements

* dcos-commons 0.57.0
* Adds configuration options for DC/OS Quota support. See [Quota Support](/mesosphere/dcos/services/kubernetes/2.4.9-1.15.10/operations/quota-support/) for more details.
* Control Plane tasks are now launched with labels that support auto exposure of Kubernetes API via [EdgeLB](/mesosphere/dcos/services/kubernetes/2.4.9-1.15.10/operations/exposing-the-kubernetes-api-marathonlb-edgelb/)


## Version 2.4.2-1.15.3

### Changelog since 2.4.1-1.15.2

#### Improvements

* Kubernetes 1.15.3
* dcos-commons 0.56.3
* Adds [configuration options to enable Kubernetes auditing](/mesosphere/dcos/services/kubernetes/2.4.9-1.15.10/kubernetes-audit/). Kubernetes auditing provides a security-relevant chronological set of records. These document the sequence of activities that have affected the system by users, administrators or other components of the system.

### Changelog since 2.4.0-1.15.1

#### Improvements

* Kubernetes 1.15.2
* Docker 19.03.1
* Calico 3.8.1
* CoreDNS 1.6.1
* dcos-commons 0.56.2
* Improve security of kube-nodes by mounting required host volumes read only.

## Bug Fixes

* Fix a bug where a custom OIDC certificate file isn't available to the Kubernetes Apiserver when OIDC support is enabled.

### Changelog since 2.3.3-1.14.3

#### Improvements

* Kubernetes v1.15.1
* CoreDNS v1.5.0
* Calico v3.8.0
* dcos-commons v0.56.1
* Add option to deploy etcd cluster with 5 nodes. When high_availability is set to \"true\" in the package JSON, a Kubernetes cluster with 3 etcd nodes will be created. However, some Kubernetes clusters require more than 3 etcd nodes for production. Cluster administrators can use this option for those scenarios. This option will provision 5 etcd nodes for the Kubernetes cluster instead. Deploying an etcd cluster with 5 nodes requires a cluster with at least 5 private agents.
* Add required options to configure an OIDC authentication provider for the Kubernetes API Server. See [Configuring the API Server](https://kubernetes.io/docs/reference/access-authn-authz/authentication/#configuring-the-api-server) for more information.

#### Bug Fixes

* Disable API server anonymous authentication
* Fix a bug where Kubernetes clusters created under a DC/OS folder don't export metrics with the correct Kubernetes cluster name.

### Changelog since 2.3.2-1.14.1

#### Improvements

* Kubernetes 1.14.3.
* Calico 3.7.2.

### Changelog since 2.3.1-1.14.2

#### Improvements

* Add media types required to show dropdown box in secrets and service account configuration. This UI feature will ship as an update and with DC/OS 1.13.1. It is not part of 1.13.0. It is backwards compatible such that a simple text input is displayed on older versions of the UI.

#### Bug Fixes

* Downgrade to Kubernernetes 1.14.1 to mitigate https://github.com/kubernetes/kubernetes/issues/78308.
* Correctly configure TLS for the Kubernetes API server to work with intermediate CA certificates.

### Changelog since 2.3.0-1.14.1

#### Improvements

* Kubernetes 1.14.2.
* Docker 18.09.6.
* etcd 3.3.13.
* Calico 3.6.1
* The `node-role.kubernetes.io/master=` label for the control-plane nodes is now set through the Kubernetes API instead of using the `kubelet --node-labels` flag. This happens because [setting any `kubernetes.io` prefixed labels has been deprecated in Kubernetes 1.13 and will be removed in Kubernetes 1.15](https://github.com/kubernetes/kubernetes/pull/68267).
* dcos-commons: 0.56.0
* Add option to expose Kubernetes cluster metrics. If dcos-monitoring package is installed, the Kubernetes cluster metrics are automatically ingested by DC/OS metrics pipeline.

### Changelog since 2.2.2-1.13.5

#### Improvements

* Kubernetes 1.14.1
* Docker 18.09.4
* CoreDNS v1.4.0
* Calico 3.5.4
* Enable [Pod Priority scheduling and preemption](https://kubernetes.io/docs/concepts/configuration/pod-priority-preemption/)
* Allow for defining the maximum amount of disk space taken by pods' containers' log files (defaults to 1MB).
  The default can be overriden by setting the  `kubernetes.maximum_container_log_size` configuration option.

#### Documentation

* Fix a few items in the [limitations section](/mesosphere/dcos/services/kubernetes/2.4.9-1.15.10/limitations/).

### Changelog since 2.2.1-1.13.4

#### Improvements

* Kubernetes v1.13.5
* Expose the Kubernetes controller manager secure port to access metrics with authentication and authorization, and disable the localhost insecure port.
* Expose the scheduler secure port to access metrics with authentication and authorization, and disable the localhost insecure port.
* Improve security of kubelet unauthenticated healthz endpoint by only binding to localhost.
* Improve security of kube-proxy unauthenticated healthz endpoint by only binding to localhost.
* Enable unauthenticated etcd /metrics endpoint on port 2381 by default. Available using DCOS VIP `http://etcd-N-peer.${KUBERNETES_CLUSTER_NAME}.autoip.dcos.thisdcos.directory:2381/metrics` where N is the task instance index.

### Changelog since 2.2.0-1.13.3

#### Improvements

* Kubernetes v1.13.4
* Docker v18.09.3
* Calico v3.5.2
* Support for Mesos pre-reserved roles for etcd, control-plane, public-node and private-node, and placement rules for etcd.
* Modify how etcd placement constraints are defined, there is now a separate `etcd.placement` option. For backwards compatibility, if left empty, the value from `kubernetes.control_plane_placement` will be used.

#### Bug Fixes

* Fix a bug where sometimes Kubernetes workloads running on public agents would not have access to Kubernetes workloads running on private agents.
* Fix a bug where using `--path-to-custom-ca` in `dcos kubernetes cluster kubeconfig` resulted in an improperly encoded `certificate-authority-data` in the generated `kubeconfig` file.

#### Documentation

* Fix the [`etcd` snapshotting](/mesosphere/dcos/services/kubernetes/2.4.9-1.15.10/operations/troubleshooting/) instructions.
* Add section `Mesos Roles` to `Advanced Installation` page.

## Version 2.2.0-1.13.3

### Changelog since 2.1.1-1.12.5

#### Improvements

* Kubernetes v1.13.3
* dcos-commons v0.55.4
* CoreDNS v1.3.1
* Enable CSI features required for CSI integration.
* Automate the task replacement when a DC/OS agent is decommissioned.
* Allow changing automated DC/OS proxy configuration into Kubernetes cluster tasks.

#### Bug Fixes

* Fix a bug where providing `--aws-session-token` for `cluster backup` and `cluster restore` commands did not actually work.
* Fix a bug affecting clusters in which the Kubernetes service CIDR or Calico network CIDR overlapped with Docker's default bridge network by disabling the bridge.

#### Documentation

* Add a [Storage](/mesosphere/dcos/services/kubernetes/2.4.9-1.15.10/operations/storage/) page documenting Container Storage Interface (CSI).

---
## Version 2.1.1-1.12.5

### Changelog since 2.1.0-1.12.3

#### Improvements

* dcos-commons v0.55.0
* Kubernetes v1.12.5
* Docker v18.09.1
* Kubernetes Dashboard v1.10.1
* Enable local-dns-dispatcher in control plane tasks.

#### Bug Fixes

* Fix a bug that might cause pods that have [resource limits crash](https://github.com/kubernetes/kubernetes/issues/61937) on RHEL based systems. The issue is related to Linux kmem accounting turned-on by default by runc. We now turn-off kmem accounting on RHEL-based systems, and on these systems alone. No user intervention is needed, however all of Kubernetes cluster tasks will be replaced, which may cause some downtime.

---
## Version 2.1.0-1.12.3

### Changelog since 2.0.1-1.12.2

#### Improvements

* dcos-commons v0.54.3
* Kubernetes v1.12.3
* CoreDNS v1.2.6
* Calico v3.2.4
* Enable `--peer-client-cert-auth` for `etcd`. When set, etcd will check all incoming peer requests from the cluster for valid client certificates signed by the supplied CA.
* Enable the selection of the desired region where to deploy the Kubernetes cluster.
* Add the new flag `--force` in the `cluster update` command to force the update of the cluster configuration.
* Support relative paths in `--path-to-custom-ca` for `cluster kubeconfig` command, e.g. `--path-to-custom-ca=./my-custom-ca.pem`.
* Move the validation of the service configuration to the Mesosphere Kubernetes Engine.
* Enable `--aws-session-token` for `cluster backup` and `cluster restore` commands. The AWS session token can now be used as part of the AWS credentials.
* Increase the number of retries an etcd task will perform during installation to resolve its own DNS name. This should prevent etcd tasks from getting stuck in a retry loop on larger clusters.

#### Bug Fixes

* Fix a bug that might cause segfault when running `dcos kubernetes cluster kubeconfig`.

#### Documentation

* Documentation section on how to [upgrade](/mesosphere/dcos/services/kubernetes/2.4.9-1.15.10/operations/upgrade/#Mesosphere-Kubernetes-Engine) the `kubernetes` package.

---
## Version 2.0.1-1.12.2

### Changelog since 2.0.0-1.12.1

#### Improvements

* dcos-commons v0.54.2.
* Kubernetes v1.12.2

#### Bug Fixes

* Fix a bug affecting use of private Docker registries.

#### Documentation

* * Add a [Private Docker Registry](../operations/private-docker-registry) page explaining how to configure it.

---
## Version 2.0.0-1.12.1

### Changelog since 1.x

#### Improvements

* Kubernetes v1.12.1 and other components' [version changes](/mesosphere/dcos/services/kubernetes/2.0.0-1.12.1/supported-versions#supported-and-bundled-versions).
* Enable high density deployments of multiple Kubernetes clusters on DC/OS.
* Replace `kube-apiserver`, `kube-controller-manager` and `kube-scheduler` tasks with static pods in a new task `kube-control-plane`.
* Replace `kube-proxy` and `coredns` tasks with static pods, and rename `coredns` to `local-dns-dispatcher`.
* Replace cluster DNS `kube-dns` deployment with `coredns` and prevent co-location of these pods.
* Add the `priorityClassName` field to critical system pods.
* The Kubernetes Dashboard is now secured using HTTPS and will now show the [login view](https://github.com/kubernetes/dashboard/wiki/Access-control#login-view) when accessed.
* Use a dedicated RBAC role for the `kubelet-resource-watchdog`.
* Add options to enable [Calico's Typha](https://github.com/projectcalico/typha).
* Public Kubernetes nodes now reserve ports `80` and `443` of the underlying public DC/OS agent to help prevent issues with port binding, and to making them available for [Ingress](../ingress).
* Installation and package options upgrades are now faster.
* Scaling up a cluster is now performed in parallel and therefore faster. Scaling down a cluster is still performed serially to ensure workload stability while decommissioning Kubernetes nodes.

#### Bug Fixes

* Fix a bug that might cause `kube-node` and `kube-node-public` tasks to freeze in the `STARTED` state, causing installations or upgrades to stop indefinitely.
* Fix a bug that could forever fail to run public Kubernetes node tasks.
* Fix a bug affecting node decommission that could cause Kubernetes apps temporary downtime.

#### Documentation

* Add an [Overview](/mesosphere/dcos/services/kubernetes/2.4.9-1.15.10/overview/) page explaining in detail what changed since the 1.x series of releases.
* Add a [CLI](/mesosphere/dcos/services/kubernetes/2.4.9-1.15.10/cli/) page detailing the new Mesosphere Kubernetes Engine CLI.
* Merge `Advanced Installation` page merging its content into [Customizing your Installation](/mesosphere/dcos/services/kubernetes/2.4.9-1.15.10/operations/customizing-install/).
* Add a [Private Docker Registry](/mesosphere/dcos/services/kubernetes/2.4.9-1.15.10/operations/private-docker-registry/) page explaining how to configure it.
