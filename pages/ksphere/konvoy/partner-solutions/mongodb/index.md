---
layout: layout.pug
navigationTitle: MongoDB
title: MongoDB
excerpt: MongoDB the General Purpose, Document Based, Distributed Database
menuWeight: 100
category: Workload
image: img/mongodb.png
---
# MongoDB

MongoDB is a general purpose, document-based, distributed database built for modern application developers and for the cloud era.

## Quick Start

### Prerequisites

Before you can get started with the operator you need either 

* an account on [MongoDB Cloud Manager](http://cloud.mongodb.com) or 
* [MongoDB Ops Manager](https://docs.opsmanager.mongodb.com/current/tutorial/install-simple-test-deployment/) installed outside of the Konvoy cluster on a `dedicated VM`

Once you have either access to `Cloud Manager` or your own `Ops Manager`, you use it to create an `api key` and to `whitelist the ips` of your Konvoy cluster worker nodes.

For `Cloud Manager`, you'll need to configure a [Programmatic API key](https://docs.cloudmanager.mongodb.com/tutorial/configure-public-api-access/) and an IP whitelist of your Konvoy cluster worker nodes. The steps for creating the API key are [here](https://docs.cloudmanager.mongodb.com/tutorial/configure-public-api-access/#manage-programmatic-access-to-an-organization).

For `Ops Manager` go to your account settings. There create an `api key` and `whitelist the ips` of your Konvoy cluster worker nodes.


### Install the Operator

1.  Clone the `mongodb-enterprise-kubernetes` repository, and change to the `mongodb-enterprise-kubernetes` folder.
    ```bash
    git clone https://github.com/mongodb/mongodb-enterprise-kubernetes.git
    cd mongodb-enterprise-kubernetes
    ```

1. Create the `mongodb namespace`.

    ```bash
    kubectl create namespace mongodb
    ```

1. Install the `MongoDB operator`.

    ```bash
    helm template helm_chart > operator.yaml
    kubectl apply -f operator.yaml
    ```

1. When clusters are created using the operator, they must be able to access either `MongoDB Cloud Manager` or `MongoDB Ops Manager`. A `secret` with the credentials and a `config map` with the respective manager address and project is required.

    For `MongoDB Cloud Manager` you create the `ops-manager-secret` the following way. In the yaml snippet, set the `user` key in the secret to the programmatic api key `publicApiKey` value and, albeit confusing, set the `publicApiKey` value of the secret to the `privateApiKey` value from Cloud Manager you copied when creating the key.

    ```yaml
    cat <<EOF | kubectl apply -f -
    apiVersion: v1
    kind: Secret
    metadata:
      name: "ops-manager-secret"
      namespace: mongodb
    stringData:
      user: "JXPIDQEA"      # This is the Public Key value
      publicApiKey: "<Paste the privateApiKey value from Cloud Manager here!>"
    EOF
    ```

    For `MongoDB Ops Manager` you create the `ops-manager-secret` the following way.

    ```bash
    kubectl -n mongodb create secret generic ops-manager-secret --from-literal="user=<first.last@example.com>" --from-literal="publicApiKey=<my-public-api-key>"
    ```

1. Create the configmap `ops-manager-cm`. The `baseUrl` is `https://cloud.mongodb.com` if you use `MongoDB Cloud Manager`, or `http://<ops-manager-hostname>:8080` if you use `MongoDB Ops Manager`.

    ```sh
    cat <<EOF | kubectl apply -f -
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: ops-manager-cm
      namespace: mongodb
    data:
      projectName: "myproject"
      baseUrl: https://cloud.mongodb.com
    EOF
    ```

### Install the Cluster

The MongoDB operator allows you to create [different cluster types](https://docs.mongodb.com/kubernetes-operator/master/deploy/).

In the following procedure, we create a MongoDB cluster of type `replica set`.

```bash
cat <<EOF | kubectl apply -f -
apiVersion: mongodb.com/v1
kind: MongoDB
metadata:
  name: mongodb-rs
  namespace: mongodb
spec:
  members: 3
  version: 4.0.6
  project: ops-manager-cm
  credentials: ops-manager-secret
  type: ReplicaSet
  persistent: true
EOF
```

Checking on the pods in the `mongodb` namespace, you should see the following.

  ```bash
  kubectl get pods -n mongodb

  NAME                                          READY   STATUS    RESTARTS   AGE
  mongodb-enterprise-operator-6c9999fd8-vc4g9   1/1     Running   0          22m
  mongodb-rs-0                                  1/1     Running   0          2m9s
  mongodb-rs-1                                  1/1     Running   0          119s
  mongodb-rs-2                                  1/1     Running   0          113s
  ```

In the ops manager UI, switch to the organization named `myproject` (drop down under your user name top right); you should also see the cluster once you switch to that organization.

### Access the Cluster

1. Exec into one of the mongodb-rs-* pods.

    ```bash
    kubectl exec -ti -n mongodb mongodb-rs-0 bash
    ```

1. In the pod, run the [mongo shell](https://docs.mongodb.com/manual/mongo/).

    ```bash
    ./var/lib/mongodb-mms-automation/mongodb-linux-x86_64-4.0.6/bin/mongo
    ```

1. Use the mongo shell command `rs.status()` to see the status of the cluster.

    ```bash
    mongodb-rs:PRIMARY> rs.status()

    {
      ...
      "members" : [
        {
          "_id" : 0,
          "name" : "mongodb-rs-0.mongodb-rs-svc.mongodb.svc.cluster.local:27017",
                                ...
        },
        {
          "_id" : 1,
          "name" : "mongodb-rs-1.mongodb-rs-svc.mongodb.svc.cluster.local:27017",
                                ...
        },
        {
          "_id" : 2,
          "name" : "mongodb-rs-2.mongodb-rs-svc.mongodb.svc.cluster.local:27017",
                                ...
                }
      ],
      ...
    }
    ```

### Delete the Cluster and Operator

1. Delete the cluster.

    ```bash
    kubectl delete MongoDB mongodb-rs -n mongodb
    ```

1. Delete the secret and config map.

    ```bash
    kubectl delete secret ops-manager-secret -n mongodb
    kubectl delete cm ops-manager-cm -n mongodb
    ```

1. Delete the operator

    ```bash
    kubectl delete -f operator.yaml
    ```

## Information

### Documentation

* [MongoDB operator](https://docs.mongodb.com/kubernetes-operator/master/tutorial/install-k8s-operator/)
* [MongoDB ops manager simple install](https://docs.opsmanager.mongodb.com/current/tutorial/install-simple-test-deployment/)
* [MongoDB ops manager production install](https://docs.opsmanager.mongodb.com/current/installation/)
* [MongoDB](https://docs.mongodb.com/)
* [MongoDB shell](https://docs.mongodb.com/manual/mongo/)
* [MongoDB compass - explore and manipulate your data](https://www.mongodb.com/products/compass)

### Release Notes

* [MongoDB operator release notes](https://docs.mongodb.com/kubernetes-operator/master/release-notes/)
* [MongoDB release notes](https://docs.mongodb.com/manual/release-notes/4.0/)

#### Licensing

* [MongoDB licensing](https://www.mongodb.com/community/licensing)

### maintenance & support

* [MongoDB support](https://support.mongodb.com/welcome)
