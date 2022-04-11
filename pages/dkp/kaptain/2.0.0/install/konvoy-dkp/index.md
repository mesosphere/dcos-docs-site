---
layout: layout.pug
navigationTitle: Install Kaptain on DKP 2.x
title: Install Kaptain on DKP 2.x
menuWeight: 8
excerpt: Install Kaptain on DKP 2.x
beta: false
enterprise: false
---

<p class="message--warning"><strong>WARNING: </strong>
Kaptain deploys to all clusters in your selected Workspace. If you do not want to deploy Kaptain to a certain cluster, you must move it to another Workspace.
</p>

## Requirements

Before proceeding, verify that your environment meets the following basic requirements:

- Control plane
  - min. 3 nodes
  - min. 4 cores _per node_
  - min. 200 GiB free disk space _per node_
  - min. 16 GiB RAM _per node_
- Workers
  - min. 6 nodes
  - min. 8 cores _per node_
  - min. 200 GiB free disk space _per node_
  - min. 32 GiB RAM _per node_
- GPUs (optional)
  - NVIDIA only
  - min. 200 GiB free disk space per instance
  - min. 64 GiB RAM per instance
  - min. 12 GiB GPU RAM per instance

Please note that these numbers are for the bare minimum.
Running any real world machine learning workloads on Kaptain bumps these requirements for nodes, CPUs, RAM, GPUs, and persistent disks.
In particular, the number of CPU and/or GPU workers, as well as RAM, must be increased considerably.
The amounts depend on the number, complexity, and size of the workloads, as well as the amount of metadata and log data stored with each run.

For on-premise installations, horizontal scalability is limited by the overall size of the cluster and quotas therein.
For cloud installations, scaling out can be limited by resource quotas.

## Prerequisites for DKP 2.x

- A DKP cluster with the following Platform applications enabled:

  - Istio
  - Knative

- [`kubectl`][kubectl] on your installation machine

- For multi-cluster environments (Enterprise license): Ensure you have configured [Kaptain to authenticate with a Management Cluster][dex].

- For DKP 2.x, ensure the following applications are enabled in Kommander:

  1. Use the existing Kommander configuration file, or initialize the default one:

  ```bash
  kommander install --init > kommander-config.yaml
  ```

  1. Ensure the following applications are enabled in the config:

  ```yaml
  apiVersion: config.kommander.mesosphere.io/v1alpha1
  kind: Installation
  apps:
    ...
    dex:
    dex-k8s-authenticator:
    kube-prometheus-stack:
    istio:
    knative:
    minio-operator:
    traefik:
    nvidia:  # to enable GPU support
    ...
  ```

  1. For GPU deployment, follow the instructions in [Kommander GPU documentation][kommander-gpu].

  1. Apply the new configuration to Kommander:

  ```bash
  kommander install --installer-config kommander-config.yaml
  ```

  Check [Kommander installation documentation][kommander-install] for more information.

<p class="message--note"><strong>NOTE: </strong>Starting from the 1.3 release, Spark Operator is no longer installed by default with Kaptain.</p>

In case you need to run Spark jobs on Kubernetes using Spark Operator, it needs to be installed separately.
Use the following instructions to install Spark Operator from Kommander Catalog [DKP 2.x][install-spark-dkp2]

## Install Kaptain

- Install the [kubectl-kudo CLI plugin][kudo_cli]

- After the Konvoy cluster has been deployed (including Istio and KNative), install KUDO:

  ```bash
  kubectl kudo init --wait
  ```

- Download [kubeflow-1.4.0_1.3.0.tgz][download] tarball.
<p class="message--note"><strong>NOTE: </strong>Starting with Kaptain 1.2.0, automatic profile creation on initial login is now disabled by default. See <a href="../../user-management">User Management</a> for more details.</p>

- Set required configuration based on the target platform:
  - When installing on Konvoy 1.x, add the following configuration to `parameters.yaml` file:
  ```bash
  cat >> parameters.yaml << END
  dkpPlatformVersion: 1
  installMinioOperator: true
  END
  ```
- When installing on DKP 2.x, add the following configuration to `parameters.yaml` file:

  ```bash
  # set the OIDC Provider CA bundle
  OIDC_PROVIDER_CA_BUNDLE=$(kubectl get secret kommander-traefik-certificate -n kommander -o jsonpath="{.data.ca\.crt}")

  cat >> parameters.yaml << END
  oidcProviderBase64CaBundle: ${OIDC_PROVIDER_CA_BUNDLE}
  END
  ```

- Install Kaptain:
  ```bash
  kubectl kudo install --instance kaptain --namespace kubeflow --create-namespace \
    ./kubeflow-1.4.0_1.3.0.tgz \
    -P parameters.yaml
  ```
- If you would like to inject additional annotations to Kaptain's default `kubeflow-ingressgateway` `Gateway`, you can pass in the service annotations as parameters:
  ```bash
  kubectl kudo install --instance kaptain --namespace kubeflow --create-namespace \
    ./kubeflow-1.4.0_1.3.0.tgz \
    -P parameters.yaml \
    -p kubeflowIngressGatewayServiceAnnotations='{"foo": "abc","bar": "xyz"}'
  ```
- Monitor the installation by running:
  ```bash
  kubectl kudo plan status --instance kaptain -n kubeflow
  ```

## Log in to Kaptain

Once all components have been deployed, you can log in to Kaptain:

- Discover the cluster endpoint and copy it to the clipboard.
  If you are running Kaptain _on-premises_:
  ```bash
  kubectl get svc kubeflow-ingressgateway --namespace kubeflow -o jsonpath="{.status.loadBalancer.ingress[*].ip}"
  ```
  Or if you are running Kaptain on _AWS_:
  ```bash
  kubectl get svc kubeflow-ingressgateway --namespace kubeflow -o jsonpath="{.status.loadBalancer.ingress[*].hostname}"
  ```
- Get the login credentials from Konvoy to authenticate:
  - For Konvoy 1.x:
    ```bash
    konvoy get ops-portal
    ```
  - For DKP 2.x:
    ```
    kubectl -n kommander get secret dkp-credentials -o go-template='Username: {{.data.username|base64decode}}{{ "\n"}}Password: {{.data.password|base64decode}}{{ "\n"}}'
    ```

## Uninstall Kaptain

- Use the following commands to uninstall Kaptain.
  ```bash
  kubectl kudo uninstall --instance kaptain --namespace kubeflow --wait
  kubectl delete operatorversions.kudo.dev kubeflow-1.4.0-1.3.0 --namespace kubeflow
  kubectl delete operators.kudo.dev kubeflow --namespace kubeflow
  ```

[download]: ../../download/
[install-spark-dkp2]: /dkp/kommander/2.1/workspaces/applications/catalog-applications/dkp-applications/spark-operator/
[install-spark-konvoy1]: /dkp/kommander/1.4/projects/platform-services/platform-services-catalog/kudo-spark/
[kommander-install]: /dkp/kommander/latest/install/
[kommander-gpu]: /dkp/kommander/latest/gpu/
[konvoy-gpu]: /dkp/konvoy/1.8/gpu/
[konvoy_deploy_addons]: /dkp/konvoy/1.8/upgrade/upgrade-kubernetes-addons/#prepare-for-addons-upgrade
[kudo_cli]: https://kudo.dev/#get-kudo
[kubectl]: https://kubernetes.io/docs/tasks/tools/#kubectl
[dex]: https://docs.d2iq.com/dkp/kaptain/2.0.0/configuration/external-dex/
