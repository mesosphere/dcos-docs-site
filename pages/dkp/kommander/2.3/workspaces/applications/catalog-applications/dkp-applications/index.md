---
layout: layout.pug
navigationTitle: DKP Applications
title: DKP Applications
menuWeight: 20
excerpt: DKP Applications
---
<!-- TODO: settle down the link target to custom applications -->
DKP applications are catalog applications provided by D2iQ for use in your environment.

## Install the DKP catalog via the CLI

Follow these steps to install the DKP catalog from the CLI.

1.  Refer to [air-gapped setup instructions](../../../../install/air-gapped/catalog), if you are running in air-gapped environment.

1.  Set the `WORKSPACE_NAMESPACE` environment variable to the name of your workspace’s namespace:

    ```bash
    export WORKSPACE_NAMESPACE=<workspace namespace>
    ```

1.  Create the `GitRepository`:

    ```yaml
    kubectl apply -f - <<EOF
    apiVersion: source.toolkit.fluxcd.io/v1beta1
    kind: GitRepository
    metadata:
      name: dkp-catalog-applications
      namespace: ${WORKSPACE_NAMESPACE}
      labels:
        kommander.d2iq.io/gitapps-gitrepository-type: catalog
        kommander.d2iq.io/gitrepository-type: catalog
    spec:
      interval: 1m0s
      ref:
        tag: v2.2.0
      timeout: 20s
      url: https://github.com/mesosphere/dkp-catalog-applications  
    EOF
    ```

1.  Verify that you can see the DKP workspace catalog `Apps` available in the UI, and in the CLI, using `kubectl`:

    ```bash
    kubectl get apps -n ${WORKSPACE_NAMESPACE}
    ```

## Workspace DKP catalog applications

| Name                      | App ID             | Supported Kubernetes version |
|---------------------------|--------------------|------------------------------|
| kafka-operator-0.20.0     | kafka-operator     | 1.21                         |
| kafka operator-0.20.2     | kafka-operator     | 1.21 - 1.23                  |
| spark-operator-1.1.6      | spark-operator     | 1.21                         |
| spark operator-1.1.17     | spark-operator     | 1.21 - 1.23                  |
| zookeeper-operator-0.2.13 | zookeeper-operator | 1.21 - 1.23                  |
| kaptain-2.1.0             | kaptain            | 1.21 - 1.23                  |
