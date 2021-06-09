---
layout: layout.pug
navigationTitle: Delete Cluster
title: Delete Cluster
menuWeight: 40
excerpt: Delete the Kubernetes cluster and clean up your environment
beta: true
enterprise: false
---

## Prepare to delete a self-managing workload cluster

<p class="message--note"><strong>NOTE: </strong>A self-managing workload cluster cannot delete itself. If your workload cluster is self-managing, you must create a bootstrap cluster and move the cluster lifecycle services to the bootstrap cluster before deleting the workload cluster.</p>

If you did not make your workload cluster self-managing, as described in [Make New Cluster Self-Managing][makeselfmanaging], see [Delete the workload cluster](#delete-the-workload-cluster).

1.  Create a bootstrap cluster:

    The bootstrap cluster will host the Cluster API controllers that reconcile the cluster objects marked for deletion:

    ```sh
    konvoy2 create bootstrap
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
    INFO[2021-06-04T15:53:08-07:00] Initializing Azure Disk CSI CustomResourceSet  src="bootstrap/clusterresourceset.go:114"
    INFO[2021-06-04T15:53:09-07:00] Created Azure Disk CustomResourceSet          src="bootstrap/clusterresourceset.go:119"
    ```

1.  Move the Cluster API objects from the workload to the bootstrap cluster:
    The cluster lifecycle services on the bootstrap cluster are ready, but the workload cluster configuration is on the workload cluster. The `move` command moves the configuration, which takes the form of Cluster API Custom Resource objects, from the workload to the bootstrap cluster. This process is also called a [Pivot][pivot].

    ```sh
    konvoy2 move --from-kubeconfig ${CLUSTER_NAME}.conf --to-kubeconfig <path to bootstrap kubeconfig>
    ```

    ```sh
    INFO[2021-06-09T11:47:11-07:00] Running pivot command                         fromClusterKubeconfig=aws-example.conf fromClusterKubeconfigContext= src="move/move.go:83" toClusterKubeconfig=/home/clusteradmin/.kube/config toClusterKubeconfigContext=
    INFO[2021-06-09T11:47:36-07:00] Pivot operation complete.                     src="move/move.go:108"
    WARN[2021-06-09T11:47:36-07:00] Use may use the new cluster context by running 'export KUBECONFIG=/home/clusteradmin/.kube/config'  src="move/move.go:109"
    ```

1.  Use the cluster lifecycle services on the workload cluster to check the workload cluster status:

    ```sh
    konvoy2 describe cluster --kubeconfig <path to bootstrap kubeconfig> -c ${CLUSTER_NAME}
    ```

    ```sh
    NAME                                                            READY  SEVERITY  REASON  SINCE  MESSAGE
    /aws-example                                                    True                     7m50s
    ├─ClusterInfrastructure - AWSCluster/aws-example                True                     7m54s
    └─ControlPlane - KubeadmControlPlane/aws-example-control-plane  True                     7m50s
    └─Machine/aws-example-control-plane-bjrrp                       True                     7m53s
    ```

     <p class="message--note"><strong>NOTE: </strong>After moving the cluster lifecycle services to the workload cluster, remember to use Konvoy with the workload cluster kubeconfig.</p>

    Use konvoy with the bootstrap cluster to delete the workload cluster.

1.  Wait for the cluster control-plane to be ready:

    ```sh
    kubectl --kubeconfig <path to bootstrap kubeconfig> wait --for=condition=controlplaneready "clusters/${CLUSTER_NAME}" --timeout=60m
    ```

    ```sh
    cluster.cluster.x-k8s.io/aws-example condition met
    ```

## Delete the workload cluster

1.  Delete all LoadBalancer-type Services from the workload cluster.

    Each LoadBalancer-type Service is backed by an AWS Elastic Load Balancer (ELB). All of these ELBs must be deleted to allow the cluster resources to be completely deleted.

    Generate a list of `kubectl` commands to delete each LoadBalancer-type Service in the cluster:

    ```sh
    kubectl --kubeconfig=${CLUSTER_NAME}.conf get -A svc --output=jsonpath='{range .items[?(@.spec.type=="LoadBalancer")]}{"kubectl --kubeconfig=${CLUSTER_NAME}.conf --namespace="}{.metadata.namespace}{" delete service "}{.metadata.name}{"\n"}{end}'
    ```

    Copy and paste the output to run the commands:

    ```sh
    kubectl --kubeconfig=${CLUSTER_NAME}.conf --namespace=default delete service example-service
    ```

    ```sh
    service "example-service" deleted
    ```

1.  Make sure your AWS credentials are up to date. Refresh the credentials using this command:

    ```sh
    konvoy2 update bootstrap credentials aws
    ```

1.  Delete the Kubernetes cluster and wait a few minutes:

    ```sh
    konvoy2 delete cluster --cluster-name=${CLUSTER_NAME}
    ```

    ```sh
    INFO[2021-06-09T11:53:42-07:00] Running cluster delete command                clusterName=aws-example managementClusterKubeconfig= namespace=default src="cluster/delete.go:95"
    INFO[2021-06-09T11:53:42-07:00] Waiting for cluster to be fully deleted       src="cluster/delete.go:123"
    INFO[2021-06-09T12:14:03-07:00] Deleted default/aws-example cluster  src="cluster/delete.go:129"
    ```

    With the bootstrap cluster deleted, you can delete the bootstrap cluster.

## Delete the bootstrap cluster

```sh
konvoy2 delete bootstrap
```

```sh
INFO[2021-06-09T12:15:20-07:00] Deleting bootstrap cluster                    src="bootstrap/bootstrap.go:182"
```

[pivot]: https://cluster-api.sigs.k8s.io/reference/glossary.html?highlight=pivot#pivot

## Known Limitations

<p class="message--note"><strong>NOTE: </strong>Be aware of these limitations in the current release of Konvoy.</p>

- The Konvoy version used to create the workload cluster must match the Konvoy version used to delete the workload cluster.

[makeselfmanaging]: ../self-managing
