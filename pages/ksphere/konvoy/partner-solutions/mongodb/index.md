---
layout: layout.pug
navigationTitle: MongoDB
title: MongoDB
excerpt: MongoDB the General Purpose, Document Based, Distributed Database
menuWeight: 100
category: Workload
image: img/mongodb.png
---

MongoDB is a general purpose, document-based, distributed database built for modern application developers and for the cloud era.

## quick start

### prerequisites

Before you can get started with the operator you need either an account on [MongoDB Cloud Manager](http://cloud.mongodb.com) or install [MongoDB Ops Manager](https://docs.opsmanager.mongodb.com/current/tutorial/install-simple-test-deployment/) outside of the Konvoy cluster on a `dedicated VM`.

Once you have access to `Cloud Manager` or your own `Ops Manager` you need to go to you `account settings`. There create an `api key` and `whitelist the ips` of your Konvoy cluster worker nodes.

### install the operator

First clone the `mongodb-enterprise-kubernetes` repository, and change to the `mongodb-enterprise-kubernetes` folder.

```sh
git clone https://github.com/mongodb/mongodb-enterprise-kubernetes.git
cd mongodb-enterprise-kubernetes
```

Next create the `mongodb namespace`.

```sh
kubectl create namespace mongodb
```

We then install the `MongoDB operator`.

```sh
helm template helm_chart > operator.yaml
kubectl apply -f operator.yaml
```

When clusters get created using the operator they need to be able to access the `mongodb ops manager`. A `secret` with the credentials and a `config map` with the ops manager address and project is required.

Lets first create the `ops-manager-secret`.

```sh
kubectl -n mongodb create secret generic ops-manager-secret --from-literal="user=<first.last@example.com>" --from-literal="publicApiKey=<my-public-api-key>"
```

While the former secret creation still works also for MongoDB Cloud Manager, its no longer the recommended way. MongoDB Cloud Manager recently introduced a more secure model for API access, where all access is controlled through `Programmatic API` keys. So, if you're using Cloud Manager, you'll need to configure a [Programmatic API key](https://docs.cloudmanager.mongodb.com/tutorial/configure-public-api-access/) and an IP whitelist. The steps for creating the API key you can find [here](https://docs.cloudmanager.mongodb.com/tutorial/configure-public-api-access/#manage-programmatic-access-to-an-organization). In the following yaml snippet set the `user` key in the secret to the programmatic api key `publicApiKey` value and, albeit confusing, set the `publicApiKey` value of the secret to the `privateApiKey` value from Cloud Manager you copied when creating the key.

```sh
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

Next we create the configmap `ops-manager-cm`. The `baseUrl` is `https://cloud.mongodb.com` if you use `MongoDB Cloud Manager`, or `http://<ops-manager-hostname>:8080` if you use `MongoDB Ops Manager`.

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

### install the cluster

The MongoDB operator allows you to create [different cluster types](https://docs.mongodb.com/kubernetes-operator/master/deploy/).

In the following we create a MongoDB cluster of type `replica set`.

```sh
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

Checking on the pods in the mongodb namespace you should see the following.

```sh
kubectl get pods -n mongodb

NAME                                          READY   STATUS    RESTARTS   AGE
mongodb-enterprise-operator-6c9999fd8-vc4g9   1/1     Running   0          22m
mongodb-rs-0                                  1/1     Running   0          2m9s
mongodb-rs-1                                  1/1     Running   0          119s
mongodb-rs-2                                  1/1     Running   0          113s
```

In the ops manager UI switch to the `organization` named `myproject` (drop down under your user name top right), you should also see the cluster once you switch to that organization.

### access the cluster

Exec into one of the mongodb-rs-* pods.

```sh
kubectl exec -ti -n mongodb mongodb-rs-0 bash
```

In the pod we run the [mongo shell](https://docs.mongodb.com/manual/mongo/).

```sh
./var/lib/mongodb-mms-automation/mongodb-linux-x86_64-4.0.6/bin/mongo
```

Use the mongo shell command `rs.status()` to see the status of the cluster.

```sh
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

### delete the cluster and operator

First delete the cluster.

```
kubectl delete MongoDB mongodb-rs -n mongodb
```

Next delete the secret and config map.

```
kubectl delete secret ops-manager-secret -n mongodb
kubectl delete cm ops-manager-cm -n mongodb
```

Last we delete the operator

```
kubectl delete -f operator.yaml
```

## information

#### documentation

* [mongodb operator](https://docs.mongodb.com/kubernetes-operator/master/tutorial/install-k8s-operator/)
* [mongodb ops manager simple install](https://docs.opsmanager.mongodb.com/current/tutorial/install-simple-test-deployment/)
* [mongodb ops manager production install](https://docs.opsmanager.mongodb.com/current/installation/)
* [mongodb](https://docs.mongodb.com/)
* [mongodb shell](https://docs.mongodb.com/manual/mongo/)

#### release notes

* [mongo db operator release notes](https://docs.mongodb.com/kubernetes-operator/master/release-notes/)
* [mongo db release notes](https://docs.mongodb.com/manual/release-notes/4.0/)

#### license

* [mongodb licensing](https://www.mongodb.com/community/licensing)

#### maintenance & support

* [mongodb support](https://support.mongodb.com/welcome)
