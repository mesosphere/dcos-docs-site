---
layout: layout.pug
navigationTitle: Configuration
title: Configuration
menuWeight: 10
excerpt: How to configure a Kommander installation
beta: false
enterprise: false
---

You can configure Kommander during the initial installation, and also post-installation using the Kommander CLI.

## Initializing a configuration file

To begin configuring Kommander, run the following command to initialize a default configuration file:

```bash
kommander install --init > kommander.yaml
```

## Configuring applications

After you have a default configuration file, you can then configure each `app` either inline **or** by referencing another `yaml` file. The configuration values for each `app` correspond to the Helm Chart values for the application.

After the initial deployment of Kommander, you can find the application Helm Charts by checking the `spec.chart.spec.sourceRef` field of the associated `HelmRelease`:

```bash
kubectl get helmreleases <application> -o yaml -n kommander
```

### Inline configuration (using values)

In this example, you configure the `centralized-grafana` application with resource limits by defining the Helm Chart values in the Kommander configuration file.

```yaml
apiVersion: config.kommander.mesosphere.io/v1alpha1
kind: Installation
apps:
  centralized-grafana:
    values: |
      grafana:
        resources:
          limits:
            cpu: 150m
            memory: 100Mi
          requests:
            cpu: 100m
            memory: 50Mi
...
```

### Referencing another yaml file (using valuesFrom)

Alternatively, you could create another `yaml` file containing the configuration for `centralized-grafana` and reference that using `valuesFrom`. Point to this file by using either a relative path (from the configuration file location) or by using an absolute path.

```yaml
cat > centralized-grafana.yaml <<EOF
grafana:
  resources:
    limits:
      cpu: 150m
      memory: 100Mi
    requests:
      cpu: 100m
      memory: 50Mi
EOF
```

```yaml
apiVersion: config.kommander.mesosphere.io/v1alpha1
kind: Installation
apps:
  centralized-grafana:
    valuesFrom: centralized-grafana.yaml
...
```

## Minimal Kommander installation

You can install Kommander with a bare minimum of applications on a small environment with smaller memory, storage, and CPU requirements for testing and demo purposes. Refer to the [Install Kommander on a small environment][small_env] documentation for more information.

## Install with configuration file

Add the `--installer-config` flag to the `kommander install` command to use a custom configuration file. To reconfigure applications, you can also run this command after the initial installation.

<p class="message--note"><strong>NOTE: </strong>To ensures Kommander is installed on the workload cluster, use the <code>--kubeconfig=cluster_name.conf</code> flag as an alternative to KUBECONFIG. </p>

```bash
kommander install --installer-config kommander.yaml --kubeconfig=<cluster-kubeconfig>
```

When completed, you can [verify your installation](../networked#verify-installation).

[small_env]: ../small-environment/
