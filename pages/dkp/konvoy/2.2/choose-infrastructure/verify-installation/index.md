---
layout: layout.pug
navigationTitle: 
title: Verify Konvoy installation
menuWeight: 50
excerpt: Check DKP components to verify the status of your cluster
enterprise: false
beta: false
---

In this section, we show you how to verify a Konvoy installation.

## Check the cluster infrastructure and nodes

DKP ships with some default diagnosis tools to check your cluster (such as the `describe` command).
You can use those tools to validate your installation.

If you have not done so already, set the environment variable for your cluster name, substituting `my-dkp-cluster` with the name of your cluster:

```bash
export CLUSTER_NAME=my-dkp-cluster
```

Then, run this command to check the health of the cluster infrastructure:

```bash
dkp describe cluster --cluster-name=${CLUSTER_NAME}
```

If the cluster is healthy, you should see output similar to this:

```sh
NAME                                                               READY  SEVERITY  REASON  SINCE  MESSAGE
Cluster/my-dkp-cluster                                             True                     121m          
├─ClusterInfrastructure - AWSCluster/my-dkp-cluster                True                     121m          
├─ControlPlane - KubeadmControlPlane/my-dkp-cluster-control-plane  True                     121m          
│ ├─Machine/my-dkp-cluster-control-plane-h52t6                     True                     121m          
│ ├─Machine/my-dkp-cluster-control-plane-knrrh                     True                     121m          
│ └─Machine/my-dkp-cluster-control-plane-zmjjx                     True                     121m          
└─Workers                                                                                              
  └─MachineDeployment/my-dkp-cluster-md-0                          True                     121m          
    ├─Machine/my-dkp-cluster-md-0-88488cb74-2vxjq                  True                     121m          
    ├─Machine/my-dkp-cluster-md-0-88488cb74-84xsd                  True                     121m          
    ├─Machine/my-dkp-cluster-md-0-88488cb74-9xmc6                  True                     121m          
    └─Machine/my-dkp-cluster-md-0-88488cb74-mjf6s                  True                     121m     
```

Use this `kubectl` command to check to see if all cluster nodes are ready:

```bash
kubectl get nodes
```

The output should look similar to this, with all statuses set to `Ready`

```bash
NAME                                         STATUS   ROLES                  AGE    VERSION
ip-10-0-112-116.us-west-2.compute.internal   Ready    <none>                 135m   v1.21.6
ip-10-0-122-142.us-west-2.compute.internal   Ready    <none>                 135m   v1.21.6
ip-10-0-186-214.us-west-2.compute.internal   Ready    control-plane,master   133m   v1.21.6
ip-10-0-231-82.us-west-2.compute.internal    Ready    control-plane,master   135m   v1.21.6
ip-10-0-71-114.us-west-2.compute.internal    Ready    <none>                 135m   v1.21.6
ip-10-0-71-207.us-west-2.compute.internal    Ready    <none>                 135m   v1.21.6
ip-10-0-85-253.us-west-2.compute.internal    Ready    control-plane,master   137m   v1.21.6
```

If your install is successful, all the above commands should return as Ready or True.

## Verify all pods are running

All pods installed by DKP should be in `Running` or `Completed` status if the install is successful.

```bash
kubectl get pods --all-namespaces
```

## Troubleshooting

If any pod is not in `Running` or `Completed` status, you may need to investigate further why.
If it appears that something has not deployed properly or fully, you can run a [diagnostic bundle][diag-bundle]:

```bash
dkp diagnose
```

This collects information from pods and infrastructure. Read [more about generating a support bundle and the different configurations that it supports][diag-bundle].

[diag-bundle]: ../../troubleshooting/generate-a-support-bundle
