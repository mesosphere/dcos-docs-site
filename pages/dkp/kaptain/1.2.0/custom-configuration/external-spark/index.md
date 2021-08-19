---
layout: layout.pug
navigationTitle: External Spark Operator
title: Configure Kaptain to use an external Spark Operator
menuWeight: 70
excerpt: Configure Kaptain to use an external Spark Operator installed on a cluster
beta: false
enterprise: false
---

Kaptain includes a Spark Operator and installs it by default, but it is only accessible to Kaptain users.
If a global Spark Operator is required on the cluster, Kaptain needs additional configuration to use it and to avoid conflicts when running Spark Applications.

## Prerequisites

- A Provisioned Konvoy cluster running Konvoy `v1.7.0` or above.

## Installing Kaptain alongside an existing Spark Operator
To avoid conflicts with an existing Spark Operator installed on a cluster, Kaptain needs to be installed
without the Spark Operator.

Create or update a configuration file named `parameters.yaml` that includes the following property:
```yaml
installSparkOperator: "false"
```

To install Kaptain with the provided parameters, run the following command on the cluster:
```bash
kubectl kudo install ./kubeflow-1.3.0_1.2.0.tgz \
		--instance kaptain \
		-P parameters.yaml \
		--namespace kubeflow \
		--create-namespace
```

Create a `ClusterRole` to allow Kubeflow users to run Spark Applications and save it to a file named `spark-role.yaml`:

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

Use `kubectl` to apply the `ClusterRole` to the cluster:

```bash
kubectl apply -f spark-role.yaml
```

## Configuring Kaptain to use an external Spark Operator after the installation
By default, the Spark instance installed by Kaptain is only usable by Kaptain users.
If all cluster users need access to Spark Applications, you need to install an external Spark Operator and disable the one included with Kaptain.
Spark Operator installation steps are available in the [KUDO Spark Operator documentation][kudo_spark_install].


First, you must disable the default Spark Operator in Kaptain. Create or update a configuration file named `parameters.yaml` to include the following property:
```yaml
installSparkOperator: "false"
```

Update the Kaptain instance to disable the Spark Operator:
```bash
kubectl kudo update \
		--instance kaptain \
		-P parameters.yaml \
		--namespace kubeflow
```

Re-create the `ClusterRole` to allow Kaptain users to run Spark Applications and save it to a file named `spark-role.yaml`:

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
If you installed Kaptain without the Spark Operator enabled, it is possible to enable it after the installation.

Delete the previously created `ClusterRole` if it exists:
```bash
kubectl delete clusterrole spark-operator-role
```

Create or update a configuration file named `parameters.yaml` to include the following property:
```yaml
installSparkOperator: "true"
```

Update the Kaptain instance to enable the Spark Operator:
```bash
kubectl kudo update --instance kaptain -P parameters.yaml
```
[kudo_spark_install]: https://github.com/kudobuilder/operators/tree/master/repository/spark
