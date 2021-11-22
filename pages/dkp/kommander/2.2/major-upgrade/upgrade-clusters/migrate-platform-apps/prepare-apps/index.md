---
layout: layout.pug
navigationTitle: Prepare Applications
title: Prepare applications for moving
menuWeight: 10
excerpt: Certain applications may need manual intervention prior to moving
beta: false
---

## Prometheus application

<p class="message--note"><strong>NOTE: </strong> <strong>Downtime:</strong> Regardless of the number of command retries, there is going to be a single downtime of Prometheus. This begins when the first run of the command reaches the "KubePrometheusStack" stage and ends when this stage successfully completes for the first time. If the process is interrupted during this stage, Prometheus might remain down until the process is restarted. Repeated attempts to adapt Prometheus after a successful adaptation have no affect and do not result in downtime.</p>

### Manual steps for moving custom Prometheus configurations

#### Alerting

Custom `alertmanager` [configurations](https://docs.d2iq.com/dkp/konvoy/1.8/monitoring/#notify-prometheus-alerts-in-slack) must be copied or re-created [manually](https://docs.d2iq.com/dkp/kommander/2.0/monitoring/#notify-prometheus-alerts-in-slack). You can do this before migrating Prometheus, so that there is no time interval when the alertmanager is not configured.

#### Custom ServiceMonitor objects

You can copy or re-create ServiceMonitors using a label `release: kube-prometheus-stack` instead of `release: prometheus-kubeaddons`. This can be done before processing, using different names or namespaces for the new objects. Also you can re-label existing ServiceMonitors before or after the processing. This can introduce an interval when Prometheus is running but ServiceMonitors have no effect. After the Prometheus-operator in the adapted Prometheus starts, it only looks at ServiceMonitor objects with `release: kube-prometheus-stack` label. As a result, the adapted Prometheus only ignores ServiceMonitors with the old label until they are relabeled.

There are two ways to adapt ServiceMonitors created using Helm values of the Addon:

-   Create standalone ServiceMonitor resources with a label `release: kube-prometheus-stack`. This can be done before processing.

-   Add the custom ServiceMonitor configurations into additionalServiceMonitors into the overrides ConfigMap of the migrated AppDeployment. This can only be done after processing. This results in an interval when the migrated Prometheus application is running but these custom ServiceMonitors are not configured.

<p class="message--important"><strong>IMPORTANT: </strong>To be able to adapt ServiceMonitors created using Helm values of the Addon, you must store the Addon values before starting the moving process. The Addon removal is one of the first processing steps. After that the old Addon values are not accessible.</p>

#### Cleanup

After processing is complete, you may remove both the old alertmanager configuration secret and the old ServiceMonitors having the `release: prometheus-kubeaddons` label. They are no longer used.

### Resolve Prometheus migration issues

-   Users who have a nonstandard configuration of the Addon may have to edit the `kube-prometheus-stack-overrides` ConfigMap for the HelmRelease to get reconciled.

-   The new Prometheus may not select the old PersistentVolumes. This can be due to a name mismatch of actual and expected PersistentVolumeClaims. You can identify the PersistentVolumes of the old Prometheus installation by looking at `migration.kommander.mesosphere.io/statefulset-name` and `migration.kommander.mesosphere.io/statefulset-ns` labels.

## Fluent Bit and logging stack migration

The Kommander 2.1 logging stack is completely different from previous versions. The new logging stack is based on Loki and Grafana. Previous versions were based on Elasticsearch and Kibana. Logging stack migration is triggered by detecting the Fluent Bit Addon. This produces the following:

-   A new Fluent Bit AppDeployment is created on the 2.x side using D2IQ helm value defaults.

-   All the other 2.x logging stack components are installed.

-   The Fluent Bit Addon is deleted.

Elasticsearch, elasticsearch-curator, and kibana Addons are deleted without uninstalling the Helm release formerly managed by the Kubeaddons controller. You must manually uninstall these Helm releases.

### Caveats

-   Customers using Fluent Bit Addon non-default configurations must add corresponding configOverrides to their 2.x AppDeployment. This is based on their 2.x defaults combined with their custom modifications.

-   The remaining components of the old logging stack are not uninstalled. You must delete old logging stacks if they are no longer needed.

-   Customers who use Fluent Bit but do not need other parts of the 2.x logging stack installed, must specify the `--skip-new-logging-stack-apps` flag when moving their applications.

## Kubernetes-dashboard

Currently, any custom modifications of the addon Helm values are not recognized. The moving process overrides them with Kommander 2.0 values and removes the old addon. Backup your settings and reapply them after processing is complete if required.

## Grafana

You must back up any custom Grafana dashboards before running the adaption process.

## Velero

Velero has moved from the Velero namespace to the Kommander namespace. Any backup automation/runbooks should be updated accordingly. Also documentation must include the Velero config update for namespace.

<p class="message--note"><strong>NOTE: </strong>Velero namespace must be Kommander. Set the Velero namespace to Kommander with the <code>velero client config set namespace=kommander</code>. You can also set an environment variable with <code>export VELERO_NAMESPACE=kommander</code>.</p>

## SSO stack

Moving custom-configured identity providers is not supported. After processing the [SSO](../../../../security/oidc) stack must be re-configured again.

## Additional Notes

Do not run the `install` command on a relocated cluster. This might overwrite changes applied by `migrate` command.
