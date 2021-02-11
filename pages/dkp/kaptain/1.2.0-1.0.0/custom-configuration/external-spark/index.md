---
layout: layout.pug
navigationTitle: External Spark Operator
title: Configure Kaptain to use external Spark Operator
menuWeight: 70
excerpt: Configure Kaptain to use external Spark Operator installed on a cluster
beta: false
enterprise: false
---

Learn how to configure Kaptain to use external Spark Operator installed on a cluster.
Kaptan includes a Spark Operator and installs it by default. In case a global Spark Operator required on the cluster,
Kaptain needs additional configuration to use it and to avoid conflicts when running Spark Applications.

## Prerequisites

-   You already provisioned a Konvoy cluster using at least `v1.7.0`.

## Installing Kaptain alongside the existing Spark Operator
To avoid conflicts with the existing Spark Operator installed on a cluster, Kaptain needs to be installed
without the Spark Operator.

Create or update a configuration file `parameters.yaml` to include the following property:
```yaml
installSparkOperator: "false"
```

To install Kaptain with the provided parameters, run the following command on the cluster:
```bash
kubectl kudo install ./kubeflow-1.2.0_1.0.0.tgz \
		--instance kaptain \
		-P parameters.yaml \
		--namespace kubeflow \
		--create-namespace
```

Create `ClusterRole` to allow Kubeflow users run Spark Applications and save it to a file `spark-role.yaml`:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: spark-operator-role
  labels:
    rbac.authorization.kubeflow.org/aggregate-to-kubeflow-edit: "true"
rules:
- apiGroups:
  - sparkoperator.k8s.io
  resources:
  - sparkapplications
  - scheduledsparkapplications
  - sparkapplications/status
  - scheduledsparkapplications/status
  verbs:
  - '*'
- apiGroups:
  - scheduling.incubator.k8s.io
  - scheduling.sigs.dev
  resources:
  - podgroups
  verbs:
  - '*'
```

Use `kubectl` to apply the created `ClusterRole` to the cluster:

```bash
kubectl apply -f spark-role.yaml
```

## Configuring Kaptain to use external Spark Operator after the installation
For the scenarios when not only Kaptain users need to run Spark Applications, you need to install an external
Spark Operator and disable the one included with Kaptain. Spark Operator installation steps are available in the
[KUDO Spark Operator documentation](https://github.com/kudobuilder/operators/tree/master/repository/spark).

Disable the default Spark Operator in Kaptain. Create or update a configuration file `parameters.yaml` to include the following property:
```yaml
installSparkOperator: "false"
```

Update Kaptain instance to disable Spark Operator:
```bash
kubectl kudo update \
		--instance kaptain \
		-P parameters.yaml \
		--namespace kubeflow
```

Re-create `ClusterRole` to allow Kaptain users run Spark Applications and save it to a file `spark-role.yaml`:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: spark-operator-role
  labels:
    rbac.authorization.kubeflow.org/aggregate-to-kubeflow-edit: "true"
rules:
- apiGroups:
  - sparkoperator.k8s.io
  resources:
  - sparkapplications
  - scheduledsparkapplications
  - sparkapplications/status
  - scheduledsparkapplications/status
  verbs:
  - '*'
- apiGroups:
  - scheduling.incubator.k8s.io
  - scheduling.sigs.dev
  resources:
  - podgroups
  verbs:
  - '*'
```

Use `kubectl` to apply the created `ClusterRole` to the cluster:

```bash
kubectl apply -f spark-role.yaml
```

## Enabling the default Spark Operator in Kaptain
For the cases when Kaptain was installed without the Spark Operator it is possible to enable it after the installation.  

Delete the previously created `ClusterRole` if it exists:
```bash
kubectl delete clusterrole spark-operator-role
```

Create or update a configuration file `parameters.yaml` to include the following property:
```yaml
installSparkOperator: "true"
```

Update Kaptain instance to enable the Spark Operator:
```bash
kubectl kudo update --instance kaptain -P parameters.yaml
```
