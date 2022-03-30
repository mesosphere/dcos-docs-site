---
layout: layout.pug
navigationTitle: Create a New Cluster
title: Create a New Cluster
menuWeight: 35
excerpt: Create a new vSphere Kubernetes cluster
beta: false
enterprise: false
---

## Prerequisites

Before you begin, be sure that you have [created a bootstrap cluster][create-bootstrap]

## Create a new vSphere Kubernetes cluster

Use the following steps to create a new, air-gapped vSphere cluster.

1.  Create a Kubernetes cluster by copying the following command and substituting the valid values for your environment:

    ```bash
    ./konvoy create cluster vsphere
      --cluster-name ${CLUSTER_NAME} \
      --network <NETWORK_NAME> \
      --control-plane-endpoint-host <CONTROL_PLANE_IP> \
      --data-center <DATACENTER_NAME> \
      --data-store <DATASTORE_NAME> \
      --folder <FOLDER_NAME> \
      --server <VCENTER_API_SERVER_URL> \
      --ssh-public-key-file </path/to/key.pub> \
      --resource-pool <RESOURCE_POOL_NAME> \
      --vm-template konvoy-ova-vsphere-os-release-k8s_release-vsphere-timestamp \
      --virtual-ip-interface eth0 \
      --extra-sans <127.0.0.1> \
      --registry-mirror-url https://registry.example.com \
      --registry-mirror-cacert /tmp/registry.pem
    ```

1.  Inspect the created cluster resources with the command:

    ```sh
    kubectl get clusters,kubeadmcontrolplanes,machinedeployments
    ```

1.  Use the `wait` command to monitor the cluster control-plane readiness:

    ```bash
    kubectl wait --for=condition=ControlPlaneReady "clusters/${CLUSTER_NAME}" --timeout=20m
    ```

    ```sh
    cluster.cluster.x-k8s.io/${CLUSTER_NAME} condition met
    ```

    The `READY` status becomes `True` after the cluster control-plane becomes Ready in one of the following steps.

    After DKP creates the objects on the API server, the Cluster API controllers reconcile them, creating infrastructure and machines. As the controllers progress, they update the Status of each object.

1.  Run the DKP `describe` command to monitor the current status of the cluster:

    ```bash
    dkp describe cluster -c ${CLUSTER_NAME}
    ```

    ```sh
    %%% need Vsphere specific output
    NAME                                                            READY  SEVERITY  REASON  SINCE  MESSAGE
    /vsphere-example                                                True                     35s
    ├─ClusterInfrastructure - vSphereCluster/vsphere-example        True                     4m47s
    ├─ControlPlane - KubeadmControlPlane/vm-example-control-plane   True                     36s
    │   └─3 Machine...                                              True                     4m20s
    └─Workers
        └─MachineDeployment/vsphere-example-md-0
    ```

1.  As they progress, the controllers also create Events, which you can list using the command:

    ```bash
    kubectl get events | grep ${CLUSTER_NAME}
    ```

    For brevity, this example uses `grep`. You can also use separate commands to get Events for specific objects, such as `kubectl get events --field-selector involvedObject.kind="vSphereCluster"` and `kubectl get events --field-selector involvedObject.kind="vSphereMachine"`.

    ```sh
    %%% need a (shorter?) vSphere specific output
    ```

Then, you can [explore your new cluster][explore-cluster].

## Known Limitations

<p class="message--note"><strong>NOTE: </strong>Be aware of these limitations in the current release of DKP Konvoy.</p>

- The DKP Konvoy version used to create a bootstrap cluster must match the DKP Konvoy version used to create a workload cluster.

- DKP Konvoy supports deploying one workload cluster.

- DKP Konvoy generates a set of objects for one Node Pool.

- DKP Konvoy does not validate edits to cluster objects.

[prereqs]: ../../prerequisites/
[create-bootstrap]: ../bootstrap/
[explore-cluster]: ../explore
