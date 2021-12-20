---
layout: layout.pug
navigationTitle: Workspace Catalog Applications
title: Workspace Catalog Applications
menuWeight: 20
excerpt: Workspace Catalog Applications
---
<!-- TODO: settle down the link target to custom applications -->
Catalog applications are any third-party or open source applications that appear in the Catalog. These applications can be provided by D2iQ for use in your environment.

## Install the workspace catalog via the CLI

1.  Set the `WORKSPACE_NAMESPACE` environment variable to the name of your workspace’s namespace:

    ```bash
    export WORKSPACE_NAMESPACE=<workspace namespace>
    ```

1.  Create the `GitRepository`:

    ```sh
    kubectl apply -f - <<EOF
    apiVersion: source.toolkit.fluxcd.io/v1beta1
    kind: GitRepository
    metadata:
      name: dkp-catalog-applications
      namespace: ${WORKSPACE_NAMESPACE}
      labels:
        kommander.d2iq.io/gitapps-gitrepository-type: catalog
    spec:
      interval: 1m0s
      ref:
        branch: main
      timeout: 20s
      url: https://github.com/mesosphere/dkp-catalog-applications  
    EOF
    ```

1.  You should now see the workspace catalog `Apps` available in the UI, and in the CLI using `kubectl`:

    ```bash
    kubectl get apps -n ${WORKSPACE_NAMESPACE}
    ```

## Workspace catalog applications

| NAME                          | APP ID                |
| ----------------------------- | --------------------- |
| kafka-operator-0.20.0         | kafka-operator        |
| spark-operator-1.1.6          | spark-operator        |
| zookeeper-operator-0.2.13     | zookeeper-operator    |
