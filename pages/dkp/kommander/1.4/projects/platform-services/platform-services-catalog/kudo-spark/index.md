---
layout: layout.pug
navigationTitle: KUDO Spark
render: mustache
title: KUDO Spark
menuWeight: 3
excerpt: Day 2 Operations of KUDO Spark
beta: false
---

<!-- markdownlint-disable MD018 -->

## KUDO Spark

Kommander Catalog adds integration for [KUDO Spark Operator](https://github.com/mesosphere/kudo-spark-operator/), which simplifies day 2 operations of [Apache Spark](https://spark.apache.org/).

#include /dkp/kommander/1.4/include/kudo-intro.tmpl

It is **strongly recommended** to view the [KUDO Spark Documentation](https://github.com/mesosphere/kudo-spark-operator/tree/master/kudo-spark-operator/docs/latest) which covers the KUDO Spark Operator in-depth. This document covers the integration aspects of KUDO Spark Operator with Kommander.

### Installation

#### Kommander Catalog

KUDO Spark is located in the Kommander Catalog. To access the catalog:

#include /dkp/kommander/1.4/include/kommander-catalog-drilldown.tmpl

Below is an example of what should appear in the Kommander UI. The dialog is populated with defaults:

![Spark Service Install Configuration](/dkp/kommander/1.4/img/platform-services-spark-config-dialog.png)

- The **ID** field above is referred to as the Spark `instance` by KUDO.
- [Detailed parameter descriptions](https://github.com/kudobuilder/operators/blob/ef1d2d5d99a081d1ad5cee3d4f8017de81bbc4c4/repository/spark/operator/params.yaml) and defaults are available for each version of KUDO Spark Operator, in this case version `3.0.0-1.1.0`

Select `Deploy` to install Spark.

- Kommander will proceed to install `kudo-controller-manager` in the `kudo-system` namespace if it does not already exist. This is the equivalent of issuing `kubectl kudo init` manually on the CLI.
- KUDO will then install Spark in the Project namespace created using Kommander.
- The deployment progression can be viewed by looking at the `deploy` plan.

```bash
kubectl kudo plan status --instance spark-instance --namespace test-project
```

```sh
Plan(s) for "spark-instance" in namespace "spark":
.
└── spark-instance (Operator-Version: "spark-1.1.0" Active-Plan: "deploy")
    └── Plan deploy (serial strategy) [COMPLETE], last updated 2021-01-25 12:24:26
        ├── Phase preconditions (serial strategy) [COMPLETE]
        │   ├── Step crds [COMPLETE]
        │   ├── Step service-account [COMPLETE]
        │   └── Step rbac [COMPLETE]
        ├── Phase webhook (serial strategy) [COMPLETE]
        │   └── Step webhook [COMPLETE]
        ├── Phase spark (serial strategy) [COMPLETE]
        │   └── Step spark [COMPLETE]
        ├── Phase monitoring (serial strategy) [COMPLETE]
        │   └── Step monitoring [COMPLETE]
        └── Phase history (serial strategy) [COMPLETE]
            ├── Step history-deploy [COMPLETE]
            └── Step history-service [COMPLETE]
```

#### Using KUDO CLI

Requirements:

- Install the [KUDO controller](https://kudo.dev/docs/#getting-started)
- Install the [KUDO CLI](https://kudo.dev/docs/cli/installation.html#cli-installation)

Check existing [limitations](https://github.com/mesosphere/kudo-spark-operator/blob/master/kudo-spark-operator/docs/3.0.0-1.1.0/limitations.md) before installing a KUDO Spark instance. Currently, multi-instance
(multi-tenant) operator installation supports only a single instance per namespace.

Create a namespace for the operator:

```bash
kubectl create ns spark
```

Install a new instance of Spark operator from the official repository, use the following command:

```bash
kubectl kudo install spark --namespace spark
```

This will install a Spark operator instance with the name `spark-instance` to the provided namespace.
You can also specify a different instance name using the `--instance` parameter:

```bash
kubectl kudo install spark --instance spark-operator --namespace spark
```

Verify if the deploy plan for `--instance spark-instance` is complete:

```bash
kubectl kudo plan status --instance spark-instance --namespace spark
```

```sh
Plan(s) for "spark-instance" in namespace "spark":
.
└── spark-instance (Operator-Version: "spark-1.1.0" Active-Plan: "deploy")
    └── Plan deploy (serial strategy) [COMPLETE], last updated 2021-01-25 12:24:26
        ├── Phase preconditions (serial strategy) [COMPLETE]
        │   ├── Step crds [COMPLETE]
        │   ├── Step service-account [COMPLETE]
        │   └── Step rbac [COMPLETE]
        ├── Phase webhook (serial strategy) [COMPLETE]
        │   └── Step webhook [COMPLETE]
        ├── Phase spark (serial strategy) [COMPLETE]
        │   └── Step spark [COMPLETE]
        ├── Phase monitoring (serial strategy) [COMPLETE]
        │   └── Step monitoring [COMPLETE]
        └── Phase history (serial strategy) [COMPLETE]
            ├── Step history-deploy [COMPLETE]
            └── Step history-service [COMPLETE]
```

You can view all configuration options [in the GitHub documentation](https://github.com/mesosphere/kudo-spark-operator/blob/master/kudo-spark-operator/docs/3.0.0-1.1.0/configuration.md)

#### Uninstalling the Spark Operator

The KUDO Spark Operator installation includes Custom Resource Definitions (CRDs) for Spark Applications and the KUDO Spark
Operator instances. While Operator instance can be used on a per-namespace basis, the Custom Resource Definitions
are a cluster-scoped resource which requires a manual cleanup when all KUDO Spark Operator instances are uninstalled.

To completely remove KUDO Spark Operator from a Kubernetes cluster:

1.  Wait for the running jobs to complete or terminate them

    ```bash
    kubectl delete sparkapplications --all
    kubectl delete scheduledsparkapplications --all
    ```

1.  Uninstall each KUDO Spark Operator instance:

    ```bash
    kubectl kudo uninstall --instance spark-instance --namespace spark
    ```

1.  Remove Spark Applications CRDs:

    ```bash
    kubectl delete crds sparkapplications.sparkoperator.k8s.io scheduledsparkapplications.sparkoperator.k8s.io
    ```

#### Installing multiple Spark Operator Instances

Optionally, create dedicated namespaces for installing KUDO Spark instances(for example, `spark-operator-1` and `spark-operator-2` in this example):

```bash
kubectl create ns spark-operator-1 && kubectl create ns spark-operator-2
```

```bash
kubectl kudo install spark --instance=spark-1 --namespace spark-operator-1 -p sparkJobNamespace=spark-operator-1
kubectl kudo install spark --instance=spark-2 --namespace spark-operator-2 -p sparkJobNamespace=spark-operator-2
```

The above commands will install two Spark Operators in two different namespaces. Spark Applications submitted to a specific
namespace will be handled by the Operator installed in the same namespace. This is achieved by explicitly setting
the `sparkJobNamespace` parameter to corresponding operator namespace.

#### KUDO Spark Operator Upgrade Prior to Konvoy Upgrade or Install

Custom Resource Definitions of KUDO Spark Operator versions prior to 3.0.0-1.1.0 do not specify default values for `x-kubernetes-list-map-keys` properties and will fail validation on Kubernetes versions 1.18.x and later.

Perform these steps prior to upgrading or installing Konvoy to prevent or mitigate disruption of currently-running Spark jobs and invalidating Spark CRDs:

1. Wait for the KUDO Spark Operator jobs to finish, or terminate the running jobs.
1. [Uninstall the KUDO Spark Operator](#uninstalling-the-spark-operator).
1. [Install the new KUDO Spark version](#installation).
1. [Upgrade](/dkp/konvoy/1.8/upgrade) or [install](/dkp/konvoy/1.8/install) Konvoy.

### Submitting Spark Applications

To submit Spark Application you should have KUDO Spark Operator installed.

In order to deploy a Spark Application to Kubernetes using the KUDO Spark Operator, it should be described as a Kubernetes object. To do that, create a specification in `yaml` format with all the necessary configuration required for the application.

Let's take a simple `SparkPi` application as an example. The `yaml` specification could be found here: [spark-pi.yaml](https://raw.githubusercontent.com/kudobuilder/operators/master/repository/spark/docs/3.0.0-1.1.0/resources/spark-pi.yaml). This example assumes that you installed KUDO spark to the `spark` namespace.

```yaml
apiVersion: "sparkoperator.k8s.io/v1beta2"
kind: SparkApplication
metadata:
  name: spark-pi
  namespace: spark
spec:
  type: Scala
  mode: cluster
  image: "mesosphere/spark:spark-3.0.0-hadoop-2.9-k8s"
  imagePullPolicy: Always
  mainClass: org.apache.spark.examples.SparkPi
  mainApplicationFile: "local:///opt/spark/examples/jars/spark-examples_2.12-3.0.0.jar"
  sparkConf:
    "spark.ui.port": "4041"
  sparkVersion: "3.0.0"
  restartPolicy:
    type: Never
  driver:
    cores: 1
    memory: "512m"
    labels:
      version: 3.0.0
    serviceAccount: spark-instance-spark-service-account
  executor:
    cores: 1
    instances: 2
    memory: "512m"
    labels:
      version: 3.0.0
```

Spark application configuration is placed under `spec` section including number of executors, number of cores for drivers/executors, amount of memory. There also is a `sparkConf` section, where you can place [configuration parameters](https://spark.apache.org/docs/latest/configuration.html#application-properties) in the form of key-value pairs.

The format for the service account name is `{spark-operator name}-spark-service-account`. If you have installed the spark operator without specifying the instance name, its name will be `spark-instance`, thus the service account name will need to be `spark-instance-spark-service-account`.

#### Creating the application

Submit Spark Application to the operator:

```bash
kubectl create -f spark-pi.yaml
```

List all Spark applications:

```bash
kubectl get sparkapplications -n spark
```

```sh
NAME       AGE
spark-pi   1m
```

Describe the `spark-pi` application:

```bash
kubectl describe sparkapplications spark-pi -n spark
```

Verify that the application has been created and is currently running:

```bash
kubectl get pods -n spark | grep spark-pi
```

```sh
NAME                                  READY   STATUS      RESTARTS   AGE
spark-pi-1571911449587-exec-1         1/1     Running     0          4s
spark-pi-1571911449587-exec-2         1/1     Running     0          4s
spark-pi-driver                       1/1     Running     0          11s
```

Three spark-pi application pods running: one driver and two executors.

Verify the driver pod has completed successfully:

```bash
kubectl logs --tail=20 spark-pi-driver -n spark | grep 'Pi is'
```

```sh
Pi is roughly 3.141644502283289
```

#### Configuring Logging

Logging can be configured by placing a custom `log4j.properties` file to `SPARK_CONF_DIR` directory.
Spark Operator provides a mechanism for mounting Spark configuration files via K8s `ConfigMap` objects.

1.  Create a `ConfigMap` using the following `log4j.properties` as an example:

    ```bash
    cat <<'EOF'>> log4j.properties
    ```

    ```sh
    log4j.rootCategory=DEBUG, console
    log4j.appender.console=org.apache.log4j.ConsoleAppender
    log4j.appender.console.target=System.err
    log4j.appender.console.layout=org.apache.log4j.PatternLayout
    log4j.appender.console.layout.ConversionPattern=%d{yy/MM/dd HH:mm:ss} %p %c{1}: %m%n    
    EOF
    ```

    ```bash
    kubectl create configmap spark-conf-map --from-file log4j.properties
    ```

1.  Add the following lines to `SparkApplication` spec:

    ```yaml
    apiVersion: "sparkoperator.k8s.io/v1beta2"
    kind: SparkApplication
    metadata:
      name: spark-pi
      namespace: spark
    spec:
    ...
        sparkConfigMap: spark-conf-map
        ...
        executor:
          javaOptions: "-Dlog4j.configuration=file:/etc/spark/conf/log4j.properties"
    ```

The contents of `spark-conf-map` will be placed under `/etc/spark/conf` directory for driver and executor pods,
and `SPARK_CONF_DIR` environment variable will be set to this directory.

#### Updating the application

**Example**: increase the number of executors from 2 to 4.
To do so, you need to modify the spec file and update the value of `spec.worker.instances`.

Save the changes and apply the updated spec:

```bash
kubectl apply -f spark-pi.yaml -n spark
```

Verify the number of executors has changed:

```bash
kubectl get pods -n spark | grep spark-pi
```

```sh             
spark-pi-1571999377454-exec-1         1/1     Running     0          118s
spark-pi-1571999377454-exec-2         1/1     Running     0          118s
spark-pi-1571999377454-exec-3         1/1     Running     0          117s
spark-pi-1571999377454-exec-4         1/1     Running     0          117s
spark-pi-driver                       1/1     Running     0          2m4s
```

Delete the application with the following command:

```bash
kubectl delete sparkapplication spark-pi -n spark
```

This will delete all the pods and services related to the application.

### Accessing Spark UI

The are a few ways to expose Spark UI for you application.

When an application is submitted to Kubernetes, the operator automatically creates a `Service` with default type `ClusterIP`, which can be used to access Spark UI externally.

```bash
kubectl get svc -n spark --field-selector metadata.name=spark-pi-ui-svc
```

```sh
NAME                                  TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)             AGE
spark-pi-ui-svc                       ClusterIP   10.0.5.197    <none>        4041/TCP            7s
```

#### Using Port Forwarding

Port forwarding works in a way that connections made to a local port are forwarded to port of the pod which is running the Spark driver. With this connection in place, you can use your local workstation to access Spark UI which is running in the Driver pod.

Command example:

```bash
kubectl port-forward <resource-name> <local-port>:<container-port>
```

In case with `spark-pi` application, the command will look like the following:

```bash
kubectl port-forward spark-pi-driver 4040:4041 -n spark
```

```sh
Forwarding from 127.0.0.1:4040 -> 4041
Forwarding from [::1]:4040 -> 4041
```

After that the Spark UI should be available via URL:  `localhost:4040`

#### Using a Service

It is possible to create a service with special type that will expose our Spark UI globally via cloud network LB.

Service specification can look like the following:

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app: spark-pi-loadbalancer
  name: spark-pi-loadbalancer
spec:
  type: LoadBalancer
  selector:
    spark-role: driver
  ports:
    - protocol: TCP
      port: 80
      targetPort: 4041
```

Specifying `spark-role: driver` as a `selector` allows the service to target the required pod.

Create the service using `kubectl create -f spark-pi-service.yaml -n spark`.

Verify `spark-pi-loadbalancer` service is having an `EXTERNAL-IP` assigned:

```bash
kubectl get svc -n spark --field-selector metadata.name=spark-pi-loadbalancer
```

```sh
NAME                    TYPE           CLUSTER-IP   EXTERNAL-IP                                                               PORT(S)        AGE
spark-pi-loadbalancer   LoadBalancer   10.0.3.19    a55f8bba6615346149d96bf438d87438-1803869262.us-west-2.elb.amazonaws.com   80:31917/TCP   10m
```

Now you can use `a55f8bba6615346149d96bf438d87438-1803869262.us-west-2.elb.amazonaws.com` address in your browser to access Spark UI.

If you want to be able to explore an application's UI after it is finished, consider setting up the [Spark History Server](https://github.com/mesosphere/kudo-spark-operator/blob/master/kudo-spark-operator/docs/latest/history-server.md).

To set up a complete monitoring solution to be able to visualize and analyze your Spark cluster performance using real-time metrics and dashboards, see [Monitoring](#monitoring).

### Available Operator Parameters

The complete list of KUDO Spark Parameters can be found under [detailed parameter descriptions](https://github.com/mesosphere/kudo-spark-operator/blob/master/kudo-spark-operator/operator/params.yaml).

The current parameter set can be retrieved using the kubectl command in conjunction with two additional tools:

- [jq](https://stedolan.github.io/jq)
- [yq](https://mikefarah.gitbook.io/yq)

To retrieve the current parameters, issue the following command in the terminal with appropriate `INSTANCE` value set:

```bash
INSTANCE=spark-instance;
kubectl get instances -o json | jq ".items[] | select(.metadata.name == \"$INSTANCE\") | .spec.parameters" | yq eval -P > spark-params.yml
```

The above command generates a file called `spark-params.yml` with the current values of all the parameters in effect for the `spark` operator instance.

For more information, see [Advanced Configuration](https://github.com/mesosphere/kudo-spark-operator/blob/master/kudo-spark-operator/docs/latest/advanced-configuration.md).

### Updating Operator Parameters

Parameters can be updated using arguments to the KUDO CLI.

**Example**: Enabling Spark History Server

- Enabling [Spark History Server](https://github.com/mesosphere/kudo-spark-operator/blob/master/kudo-spark-operator/docs/latest/history-server.md) using the KUDO CLI:

```bash
kubectl kudo update --instance spark-instance -p enableHistoryServer=true -p historyServerFsLogDirectory=file:///tmp/ -n spark
```

- Monitor the KUDO Spark deployment plan:

```bash
kubectl kudo plan status --instance spark-instance -n spark
```

- Wait for the deployment plan to have a status of `COMPLETE`

When the deployment plan is `COMPLETE` there should be Spark History Server pod running:

```bash
kubectl get pod -l app.kubernetes.io/name=spark-history-server -n spark
```

```sh
NAME                                             READY   STATUS    RESTARTS   AGE
spark-instance-history-server-68f5645c57-5h2g4   1/1     Running   0          31s
```

**Example**: Updating parameters providing YAML file with parameters:

To update multiple parameters at once, it is recommended to submit the updated parameters using the KUDO CLI.

See [Available Parameters](#available-operator-parameters) to get the full list of current parameters as a file.

Apply the desired updates in `spark-params.yml` using the KUDO CLI:

```bash
kubectl kudo update --instance=spark-instance -P spark-params.yml -n spark
```

Wait for the deployment plan to `COMPLETE`.

### Upgrades

**Example**: Upgrade KUDO Spark Operator from `v3.0.0-1.0.1` to `v3.0.0-1.1.0`

When upgrading, you should understand the mapping between Spark versions and operator versions.
Wait and monitor the deployment plan to become `COMPLETE`.

<p class="message--note"><strong>NOTE: </strong>Spark Operator version does not have to match the Apache Spark version to run Spark Applications built with that version. For instance, it is possible to submit Spark 2.4.5 Application using the operator version 3.0.0-1.1.0.</p>

### Monitoring

KUDO Spark Operator has metrics reporting support, which can be enabled during the installation of the operator.
By default, it supports integration with the [Prometheus operator](https://github.com/coreos/prometheus-operator).

Prometheus Operator relies on `ServiceMonitor` kind which describes the set of targets to be monitored.
KUDO Spark Operator configures `ServiceMonitor`s for both the Operator and submitted Spark Applications automatically
when monitoring is enabled.

#### Exporting Spark Operator and Spark Application metrics to Prometheus

##### Prerequisites

* KUDO v0.15.0 or later
* The `prometheus-operator`.
  If you do not already have the `prometheus-operator` installed on your Kubernetes cluster, you can do so by following
  the [quick start guide](https://github.com/coreos/prometheus-operator#quickstart).

##### Metrics configuration

Metrics reporting is disabled by default and can be enabled by passing the following parameter to `kudo install`:

```bash
kubectl kudo install spark --instance=spark -p enableMetrics=true
```

Service endpoints and ServiceMonitor resources are configured to work with Prometheus Operator
out of the box.

Full list of metrics configuration parameters and defaults is available in KUDO Spark [params.yaml](https://github.com/kudobuilder/operators/blob/master/repository/spark/operator/params.yaml).

##### Running Spark Application with metrics enabled

1) Composing your Spark Application yaml:
    - use the following Spark image which includes the `JMXPrometheus` exporter jar: `mesosphere/spark:spark-3.0.0-hadoop-2.9-k8s`
    - enable Driver and Executors metrics reporting by adding the following configuration into `SparkApplication` `spec` section:

      ```yaml
        monitoring:
          exposeDriverMetrics: true
          exposeExecutorMetrics: true
          prometheus:
            jmxExporterJar: "/prometheus/jmx_prometheus_javaagent-0.11.0.jar"
            port: 8090
      ```

      `spec.momitoring.prometheus.port` value should be the same for all submitted Spark Applications in order for metrics to be scraped.
    - if it is necessary to expose the metrics endpoint on a port other than `8090`, do the following:
        - specify desired port when installing the `kudo-spark-operator`:

      ```
      kubectl kudo install spark -p appMetricsPort=<desired_port>
      ```
        - change the `port` value in the `SparkApplication` yaml definition (`spec.monitoring.prometheus.port`)
    - Mark `driver` and, or `executor` with the label `metrics-exposed: "true"`
      ```yaml
      spec:
        driver:
          labels:
             metrics-exposed: "true"
        executor:
          labels:
            metrics-exposed: "true"
      ```
    - Install the SparkApplication:
      ```
      kubectl apply -f <path_to_the_application_yaml>
      ```
   Full application configuration example is available in [spark-application-with-metrics.yaml](https://raw.githubusercontent.com/kudobuilder/operators/master/repository/spark/docs/3.0.0-1.1.0/resources/monitoring/spark-application-with-metrics.yaml)

1) Now, go to the prometheus dashboard (for example, `<kubernetes_endpoint_url>/ops/portal/prometheus/graph`) and search for metrics starting with `spark`. The Prometheus URI might be different depending on how you configured and installed the `prometheus-operator`.

#### Dashboards
* [Spark Applications Dashboard](https://github.com/mesosphere/kudo-spark-operator/blob/master/kudo-spark-operator/docs/latest/resources/dashboards/grafana_spark_applications.json)
* [Spark Operator Dashboard](https://github.com/mesosphere/kudo-spark-operator/blob/master/kudo-spark-operator/docs/latest/resources/dashboards/grafana_spark_operator.json)

Dashboard installation:
1) Open the Grafana site (for example, `<kubernetes_endpoint_url>/ops/portal/grafana`).
1) Press + button and pick `Import` item from the menu.
1) Copy content of the dashboard json file and paste it to the text area on importing form.

For more information visit Grafana documentation: [Importing a dashboard guide](https://grafana.com/docs/grafana/next/dashboards/export-import/#importing-a-dashboard).
