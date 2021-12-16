---
layout: layout.pug
navigationTitle: ZooKeeper Operator
title: ZooKeeper Operator
menuWeight: 20
excerpt: Information about the ZooKeeper Operator
---

## Overview

[ZooKeeper](https://zookeeper.apache.org/index.html) is a centralized service for maintaining configuration information, naming, providing distributed synchronization, and providing group services. The [ZooKeeper operator](https://github.com/pravega/zookeeper-operator) is a Kubernetes operator that handles the provisioning and management of ZooKeeper clusters. It works by watching custom resources, such as `ZookeeperClusters`, to provision the underlying Kubernetes resources (`StatefulSets`) required for a production-ready ZooKeeper Cluster.

## Installation

1.  Follow the generic installation instructions for workspace catalog applications on the [Application Deployment](../application-deployment/) page.

1.  Within the `AppDeployment`, update the `appRef` to specify the correct `zookeeper-operator` App. You can find the `appRef.name` by listing the available `Apps` in the workspace namespace:

    ```bash
    kubectl get apps -n ${WORKSPACE_NAMESPACE}
    ```

For details on custom configuration for the operator, please refer to the [ZooKeeper operator Helm Chart documentation](https://github.com/pravega/zookeeper-operator/tree/master/charts/zookeeper-operator#configuration).

## Uninstall via the CLI

Uninstalling the ZooKeeper operator will not directly affect any running `ZookeeperCluster`s. By default, the operator will wait for any `ZookeeperClusters` to be deleted before it will fully uninstall (you can set `hooks.delete: true` in the application configuration to disable this behavior). After uninstalling the operator, you will need to manually clean up any leftover Custom Resource Definitions (CRDs).

1.  Delete all `ZookeeperCluster`'s, see [Deleting ZooKeeper Clusters](../../../../projects/applications/catalog-applications/custom-resources-workspace-catalog/zookeeper#deleting-zookeeper-clusters).

1.  Uninstalling a ZooKeeper operator `AppDeployment`:

    ```bash
    kubectl -n <workspace namespace> delete AppDeployment <name of AppDeployment>
    ```

1.  Removing ZooKeeper CRDs:

    <p class="message--warning"><strong>WARNING: </strong>Once you remove the CRDs, all deployed ZookeeperClusters will be deleted!</p>

    ```bash
    kubectl delete crds zookeeperclusters.zookeeper.pravega.io
    ```

## Resources

- [ZooKeeper Operator Documentation](https://github.com/pravega/zookeeper-operator)
- [ZooKeeper Cluster Helm Chart](https://github.com/pravega/zookeeper-operator/tree/master/charts/zookeeper)
- [ZooKeeper Documentation](https://zookeeper.apache.org/)
