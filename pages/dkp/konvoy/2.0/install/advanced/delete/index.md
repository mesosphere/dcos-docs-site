---
layout: layout.pug
navigationTitle: Delete Cluster
title: Delete Cluster
menuWeight: 40
excerpt: Delete the Kubernetes cluster and clean up your environment
enterprise: false
---

## Prepare to delete a self-managing workload cluster

<p class="message--note"><strong>NOTE: </strong>A self-managing workload cluster cannot delete itself. If your workload cluster is self-managing, you must create a bootstrap cluster and move the cluster lifecycle services to the bootstrap cluster before deleting the workload cluster.</p>

If you did not make your workload cluster self-managing, as described in [Make New Cluster Self-Managing][makeselfmanaging], see [Delete the workload cluster](#delete-the-workload-cluster).

1.  Create a bootstrap cluster:

    The bootstrap cluster will host the Cluster API controllers that reconcile the cluster objects marked for deletion:

    <p class="message--note"><strong>NOTE: </strong>To avoid using the wrong kubeconfig, the following steps use explicit kubeconfig paths and contexts.</p>

    ```sh
    konvoy create bootstrap --kubeconfig $HOME/.kube/config
    ```

    ```sh
    INFO[2021-06-04T15:49:15-07:00] Creating bootstrap cluster                    src="bootstrap/bootstrap.go:143"
    INFO[2021-06-04T15:50:40-07:00] Initializing bootstrap controllers            src="bootstrap/controllers.go:88"
    INFO[2021-06-04T15:52:41-07:00] Created bootstrap controllers                 src="bootstrap/controllers.go:93"
    INFO[2021-06-04T15:52:41-07:00] Waiting for bootstrap controllers to be ready  src="bootstrap/controllers.go:96"
    INFO[2021-06-04T15:53:00-07:00] Bootstrap controllers are ready               src="bootstrap/controllers.go:101"
    INFO[2021-06-04T15:53:00-07:00] Initializing Tigera operator                  src="bootstrap/clusterresourceset.go:35"
    INFO[2021-06-04T15:53:02-07:00] Created Tigera operator                       src="bootstrap/clusterresourceset.go:40"
    INFO[2021-06-04T15:53:02-07:00] Initializing Calico installation              src="bootstrap/clusterresourceset.go:42"
    INFO[2021-06-04T15:53:06-07:00] Created Calico Installation                   src="bootstrap/clusterresourceset.go:47"
    INFO[2021-06-04T15:53:06-07:00] Initializing AWS EBS CSI CustomResourceSet    src="bootstrap/clusterresourceset.go:107"
    INFO[2021-06-04T15:53:08-07:00] Created AWS EBS CSI CustomResourceSet         src="bootstrap/clusterresourceset.go:112"
    INFO[2021-06-04T15:53:09-07:00] Initializing Cluster Autoscaler CustomResourceSet  src="bootstrap/clusterresourceset.go:180"
    INFO[2021-06-04T15:53:09-07:00] Created Cluster Autoscaler CustomResourceSet  src="bootstrap/clusterresourceset.go:185"
    ```

1.  Move the Cluster API objects from the workload to the bootstrap cluster:
    The cluster lifecycle services on the bootstrap cluster are ready, but the workload cluster configuration is on the workload cluster. The `move` command moves the configuration, which takes the form of Cluster API Custom Resource objects, from the workload to the bootstrap cluster. This process is also called a [Pivot][pivot].

    ```sh
    konvoy move \
        --from-kubeconfig ${CLUSTER_NAME}.conf \
        --from-context konvoy-${CLUSTER_NAME}-admin@konvoy-${CLUSTER_NAME} \
        --to-kubeconfig $HOME/.kube/config \
        --to-context kind-konvoy-capi-bootstrapper
    ```

    ```sh
    INFO[2021-06-09T11:47:11-07:00] Running pivot command                         fromClusterKubeconfig=aws-example.conf fromClusterContext= src="move/move.go:83" toClusterKubeconfig=/home/clusteradmin/.kube/config toClusterContext=
    INFO[2021-06-09T11:47:36-07:00] Pivot operation complete.                     src="move/move.go:108"
    INFO[2021-06-09T11:47:36-07:00] You may use the new cluster context by running 'export KUBECONFIG=/home/clusteradmin/.kube/config'  src="move/move.go:109"
    ```

1.  Use the cluster lifecycle services on the workload cluster to check the workload cluster status:

    ```sh
    konvoy describe cluster --kubeconfig $HOME/.kube/config -c ${CLUSTER_NAME}
    ```

    ```sh
    NAME                                                            READY  SEVERITY  REASON  SINCE  MESSAGE
    /aws-example                                                    True                     35s
    ├─ClusterInfrastructure - AWSCluster/aws-example                True                     4m47s
    ├─ControlPlane - KubeadmControlPlane/aws-example-control-plane  True                     36s
    │   └─3 Machine...                                              True                     4m20s
    └─Workers
        └─MachineDeployment/aws-example-md-0
    ```

     <p class="message--note"><strong>NOTE: </strong>After moving the cluster lifecycle services to the workload cluster, remember to use Konvoy with the workload cluster kubeconfig.</p>

    Use konvoy with the bootstrap cluster to delete the workload cluster.

1.  Wait for the cluster control-plane to be ready:

    ```sh
    kubectl --kubeconfig $HOME/.kube/config wait --for=condition=controlplaneready "clusters/${CLUSTER_NAME}" --timeout=60m
    ```

    ```sh
    cluster.cluster.x-k8s.io/aws-example condition met
    ```

## Delete the workload cluster

1.  Make sure your AWS credentials are up to date. Refresh the credentials using this command:

    ```sh
    konvoy update bootstrap credentials aws --kubeconfig $HOME/.kube/config
    ```

1.  Delete the Kubernetes cluster and wait a few minutes:

    Before deleting the cluster, Konvoy deletes all Services of type LoadBalancer on the cluster. Each Service is backed by an AWS Classic ELB. Deleting the Service deletes the ELB that backs it.
    To skip this step, use the flag `--delete-kubernetes-resources=false`.

    <p class="message--note"><strong>NOTE: </strong>Do not skip this step if the VPC is managed by Konvoy. When Konvoy deletes cluster, it deletes the VPC. If the VPC has any AWS Classic ELBs, AWS does not allow the VPC to be deleted, and Konvoy cannot delete the cluster.</p>

    ```sh
    konvoy delete cluster --cluster-name=${CLUSTER_NAME} --kubeconfig $HOME/.kube/config
    ```

    ```sh
    INFO[2021-06-09T11:53:42-07:00] Running cluster delete command                clusterName=aws-example managementClusterKubeconfig= namespace=default src="cluster/delete.go:95"
    INFO[2021-06-09T11:53:42-07:00] Waiting for cluster to be fully deleted       src="cluster/delete.go:123"
    INFO[2021-06-09T12:14:03-07:00] Deleted default/aws-example cluster  src="cluster/delete.go:129"
    ```

    With the cluster deleted, you can delete the bootstrap cluster.

## Delete the bootstrap cluster

```sh
konvoy delete bootstrap
```

```sh
INFO[2021-06-09T12:15:20-07:00] Deleting bootstrap cluster                    src="bootstrap/bootstrap.go:182"
```

[pivot]: https://cluster-api.sigs.k8s.io/reference/glossary.html?highlight=pivot#pivot

## Known Limitations

<p class="message--note"><strong>NOTE: </strong>Be aware of these limitations in the current release of Konvoy.</p>

- The Konvoy version used to create the workload cluster must match the Konvoy version used to delete the workload cluster.

[makeselfmanaging]: ../self-managing
