---
layout: layout.pug
navigationTitle: MinIO
title: MinIO
excerpt: MinIO the S3 Compatible Object Store
menuWeight: 90
category: Storage
image: img/minio.png
---

MinIO is a distributed object storage service for high performance, high scale data infrastructures. It is a drop in replacement for AWS S3 in your own environment. It uses erasure coding to provide highly resilient storage that can tolerate failures of up to n/2 nodes.

## quick start

### install the operator

**Note:** If the `velero addon` is installed in your `Konvoy cluster` it will already have installed the `MinIO operator` so you `must skip` the operator install step.

Install the MinIO operator.
```
kubectl create -f https://github.com/minio/minio-operator/blob/master/docs/minio-operator.yaml?raw=true
```

### install the cluster

Install the MinIO cluster.
```
kubectl create -f https://github.com/minio/minio-operator/blob/master/docs/minio-examples/minio-secret.yaml?raw=true
kubectl create -f https://github.com/minio/minio-operator/blob/master/docs/minio-examples/minioinstance.yaml?raw=true
```

### access the cluster

Enable localhost access to the MinIO console.
```
kubectl port-forward service/minio 9000
```

Click to open the [MinIO console](http://localhost:9000).

Get the secret key for `access key minio` to login.
```
echo $(kubectl get secret minio-creds-secret -o=jsonpath='{.data.secretkey}' | base64 --decode)
```

### delete the cluster and operator

Delete the cluster.
```
kubectl delete -f https://github.com/minio/minio-operator/blob/master/docs/minio-examples/minioinstance.yaml?raw=true
kubectl delete -f https://github.com/minio/minio-operator/blob/master/docs/minio-examples/minio-secret.yaml?raw=true
```

**Note:** If the `velero addon` is installed in your `Konvoy cluster` then you `must not delete` the `MinIO operator`, skip the following delete step.

Delete the operator.
```
kubectl delete -f https://github.com/minio/minio-operator/blob/master/docs/minio-operator.yaml?raw=true
```


## information

#### documentation

* [minio operator](https://github.com/minio/minio-operator/blob/master/README.md)
* [minio](https://docs.min.io/)
* [minio client](https://docs.min.io/docs/minio-client-quickstart-guide.html)
* [minio sdk's](https://docs.min.io/docs/python-client-quickstart-guide.html)

#### release notes

* [minio release notes](https://github.com/minio/minio/releases)

#### license

* Apache License 2.0

#### maintenance & support

* [minio operator](https://github.com/minio/minio-operator/issues)
* [minio](https://github.com/minio/minio/issues)
* [minio subnet](https://min.io/subscription)
