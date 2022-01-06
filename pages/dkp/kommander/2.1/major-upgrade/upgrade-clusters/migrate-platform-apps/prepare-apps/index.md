---
layout: layout.pug
navigationTitle: Prepare Applications
title: Prepare applications for moving
menuWeight: 10
excerpt: Certain applications may need manual intervention prior to moving
beta: false
---

<!-- markdownlint-disable MD0013 MD030 -->

## Prometheus application

<p class="message--note"><strong>NOTE: </strong> <strong>Downtime:</strong> Regardless of the number of command retries, there is a single downtime of Prometheus that begins when the first run of the command reaches the "KubePrometheusStack" stage and ends when this stage successfully completes for the first time. If the process is interrupted during this stage, Prometheus may remain down until the process is restarted. Repeated attempts to adapt Prometheus after a successful adaptation have no affect and do not result in downtime.</p>

### Move custom Prometheus configurations

#### Alerting

You must copy or [recreate](/dkp/kommander/2.1/monitoring/#notify-prometheus-alerts-in-slack) custom `alertmanager` [configurations](/dkp/konvoy/1.8/monitoring/#notify-prometheus-alerts-in-slack) before adapting Prometheus, so that there is no time interval when the `alertmanager` is not configured.

#### Custom ServiceMonitor objects

Copy or re-create ServiceMonitors using the label `release: kube-prometheus-stack` instead of `release: prometheus-kubeaddons` before processing, using different names or namespaces for the new objects. Or, you can re-label any existing ServiceMonitors before or after processing, but this will introduce an interval where Prometheus is running but the ServiceMonitors have no effect. After the Prometheus-operator in the adapted Prometheus starts, it only looks at ServiceMonitor objects with `release: kube-prometheus-stack` label, and it ignores ServiceMonitors with the old label until they are re-labeled.

ServiceMonitors created using Helm values of the Addon can be adapted in two ways:

-   Create new standalone ServiceMonitor resources with the label `release: kube-prometheus-stack`. This can be done before processing.

-   Add the custom ServiceMonitor configurations into an additionalServiceMonitors section of the overrides ConfigMap of the Prometheus AppDeployment. This can only be done after processing. This results in an interval when the adapted Prometheus application is running but these custom ServiceMonitors are not configured.

<p class="message--important"><strong>IMPORTANT: </strong>To be able to adapt ServiceMonitors created using Helm values of the Addon, you must store the Addon values before starting the moving process. The Addon removal is one of the first processing steps. After that the old Addon values are not accessible.</p>

#### Cleanup

After processing is complete, remove both the old alertmanager configuration secret and any ServiceMonitors that have the `release: prometheus-kubeaddons` label.

### Resolve Prometheus adaption issues

-   If you customized the Addon, you may have to edit the `kube-prometheus-stack-overrides` ConfigMap for the HelmRelease to get reconciled.

-   If you customized the storage for Prometheus, it is possible the adaption cannot select the old PersistentVolumes. For example, there could be a name mismatch between the actual and expected PersistentVolumeClaims. You can identify the PersistentVolumes of the old Prometheus installation by inspecting the `migration.kommander.mesosphere.io/statefulset-name` and `migration.kommander.mesosphere.io/statefulset-ns` labels.

## Fluent Bit and logging stack adaption

The Kommander 2.1 logging stack is different from previous versions and is based on Loki and Grafana. Previous versions were based on Elasticsearch and Kibana. Logging stack adaption is triggered by detecting the Fluent Bit Addon. This results in the following actions:

-   A new Fluent Bit AppDeployment is created using D2iQ Helm value defaults.

-   All the other 2.x logging stack components are installed.

-   The Fluent Bit Addon is deleted.

Elasticsearch, elasticsearch-curator, and Kibana Addons are deleted without uninstalling the Helm release formerly managed by the Kubeaddons controller. You must manually uninstall these Helm releases.

### Caveats

-   If you customized the Fluent Bit Addon configuration in 1.x, you must add corresponding configOverrides to your 2.x AppDeployment. The configOverrides should be based on the 2.x defaults combined with your custom modifications.

-   The remaining components of the old logging stack are not uninstalled, and must be manually deleted. See the [post upgrade cleanup](../cleanup) section for details.

-   If your 1.8 cluster only used use Fluent Bit and you do not need other parts of the 2.x logging stack installed, specify the `--skip-new-logging-stack-apps` flag when performing the adaption process.

## Kubernetes-dashboard

Currently, any custom modifications of the addon Helm values are not recognized. The moving process overrides them with Kommander 2.1 values and removes the old addon. Backup your settings and reapply them after processing is complete if required.

## Grafana

You must back up any custom Grafana dashboards before running the adaption process.

## Velero

In 2.x, the Velero install has moved from the `velero` namespace to the `kommander` namespace. If you have runbooks or automation that invokes the velero tool, make sure to update them as suggested below.

<p class="message--note"><strong>NOTE: </strong> The Velero namespace can be set to <code>kommander</code> with the command <code>velero client config set namespace=kommander</code>. Alternatively you can set the environment variable <code>export VELERO_NAMESPACE=kommander</code>, or use the velero <code>--namespace kommander</code> command line option.</p>

## SSO stack

The adaption procedure is not able to adapt custom configured identity providers. After processing, the [SSO](../../../../security/oidc) stack must be configured again.

## Additional Notes

Do not run the `install` command on a relocated cluster. This may overwrite changes applied by the `migrate` command.
