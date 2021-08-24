---
layout: layout.pug
navigationTitle: Update the image and other properties of worker machines
title: Update the image and other properties of worker machines
menuWeight: 5
excerpt: Learn how to update the image and other properties of worker machines
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

If your cluster workload changes, use a different instance type for your worker machines. To ensure your worker machines' operating system is up to date, use a different machine image that includes a more recent patch version of the operating system.

By default, Konvoy groups your worker machines in the `worker` node pool. If you change properties of the machines and apply the change, the machines may be destroyed and re-created, disrupting their running workloads.

This tutorial describes how to update the properties of worker machines without disrupting your cluster workload. You create a new node pool, with up-to-date properties. You then move your workload, to the new node pool, from the `worker` nodepool, and then scale down the `worker` node pool.

Follow these steps:

1. Use this command to list all node pools, and identify the node pool with worker machines:

    ```bash
    konvoy get nodepools
    ```

    <p class="message--note"><strong>NOTE: </strong>  If your workers are grouped in the <code>worker</code> node pool, the default for a Konvoy cluster, skip this step. If your cluster uses a different worker node pool, use that node pool name instead of <code>worker</code> in the following steps.</p>

1. Create a new node pool, called `worker2`, copying the properties of the `worker` node pool.

    ```bash
    konvoy create nodepool worker2 --from worker
    ```

1. Edit `cluster.yaml` to change the machine image and other properties of the `worker2` node pool if needed. If necessary, update the count.

    This is an excerpt of an edited `cluster.yaml`. Note that, compared to the `worker` node pool, the `worker2` node pool has twice as many nodes, uses a different instance type, a different machine image, and allocates twice as much space for image and container storage.

    ```yaml
    kind: ClusterProvisioner
    apiVersion: konvoy.mesosphere.io/v1beta1
    spec:
    nodePools:
    - name: worker
        count: 4
        machine:
        rootVolumeSize: 80
        rootVolumeType: gp2
        imagefsVolumeEnabled: true
        imagefsVolumeSize: 160
        imagefsVolumeType: gp2
        imagefsVolumeDevice: xvdb
        type: m5.2xlarge
        imageID: ami-01ed306a12b7d1c96
    - name: worker2
        count: 8
        machine:
        rootVolumeSize: 80
        rootVolumeType: gp2
        imagefsVolumeEnabled: true
        imagefsVolumeSize: 320
        imagefsVolumeType: gp2
        imagefsVolumeDevice: xvdb
        type: p2.xlarge
        imageID: ami-079f731edfe27c29c
    ```

1. Apply the change to your infrastructure:

    ```bash
    konvoy up
    ```

1. Move your workload, from the machines in the `worker` pool, to the machines in the `worker2` pool. For more information on draining, see [Safely Drain a Node][drain-node].

    ```bash
    konvoy drain nodepool worker
    ```

1. Verify your workload has been rescheduled and is healthy. To list all Pods that are not Running, use this command:

    ```bash
    kubectl get pods --all-namespaces=true --field-selector=status.phase!=Running
    ```

    <p class="message--note"><strong>NOTE: </strong> No single method applies for all workloads. A pod that is not Running can be, but is not always, a sign of an unhealthy workload. We recommend you implement application health checks and exercise them when migrating your workload from one node pool to another. For information on implementing health checks in Kubernetes, see <a href="https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/">Configure Liveness, Readiness and Startup Probes</a>.</p>

1. Scale down the `worker` node pool to zero.

   ```bash
    konvoy scale nodepool worker --count=0
    konvoy up
   ```

    <p class="message--note"><strong>NOTE: </strong>Due to a known issue, Konvoy does not currently support deleting a node pool from its configuration.</p>

[drain-node]: https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/
