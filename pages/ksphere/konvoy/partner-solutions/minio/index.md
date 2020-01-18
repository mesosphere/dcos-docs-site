---
layout: layout.pug
navigationTitle: MinIO
title: MinIO
excerpt: MinIO the S3 Compatible Object Store
menuWeight: 90
category: Storage
image: img/minio.png
---
# MinIO

MinIO is a distributed object storage service for high performance, high scale data infrastructures. It is a drop in replacement for AWS S3 in your own environment. It uses erasure coding to provide highly resilient storage that can tolerate failures of up to n/2 nodes.

## Quick Start

### Install The Operator

**Note:** If the `velero addon` is installed in your `Konvoy cluster` it will already have installed the `MinIO operator` so you `must skip` the operator install step.

Install the MinIO operator.
```
kubectl create -f https://github.com/minio/minio-operator/blob/master/minio-operator.yaml?raw=true
```

### Install The Cluster

Install the MinIO cluster.
```
kubectl create -f https://github.com/minio/minio-operator/blob/master/examples/minioinstance-with-external-service.yaml?raw=true
```

### Access The Cluster

Enable localhost access to the MinIO console.
```
kubectl port-forward service/minio-service 9000
```

Click to open the [MinIO console](http://localhost:9000).

Get the secret key for `access key minio` to login.
```
echo $(kubectl get secret minio-creds-secret -o=jsonpath='{.data.secretkey}' | base64 --decode)
```

### Delete The Cluster And Operator

Delete the cluster.
```
kubectl delete -f https://github.com/minio/minio-operator/blob/master/examples/minioinstance-with-external-service.yaml?raw=true
```

<p class="message--important"><strong>IMPORTANT: </strong>If the <tt>velero add-on</tt> is installed in your <tt>Konvoy cluster</ttt> then you <strong>must not delete</strong> the <tt>MinIO operator</tt>. Skip the following delete step.</p>

Delete the operator.
```
kubectl delete -f https://github.com/minio/minio-operator/blob/master/minio-operator.yaml?raw=true
```

## Information

### Documentation

* [Minio operator](https://github.com/minio/minio-operator/blob/master/README.md)
* [Minio](https://docs.min.io/)
* [Minio client](https://docs.min.io/docs/minio-client-quickstart-guide.html)
* [Minio sdk's](https://docs.min.io/docs/python-client-quickstart-guide.html)

### Release Notes

* [Minio release notes](https://github.com/minio/minio/releases)

### Licensing

* Apache License 2.0

### Maintenance & Support

* [Minio operator](https://github.com/minio/minio-operator/issues)
* [Minio](https://github.com/minio/minio/issues)
* [Minio subnet](https://min.io/subscription)
