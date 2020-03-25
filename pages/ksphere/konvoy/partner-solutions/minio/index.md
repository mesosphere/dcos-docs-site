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

# Quick Start

## Install the Operator

<p class="message--note"><strong>NOTE: </strong> If the <tt>velero addon</tt> is installed in your Konvoy cluster, it will already have installed the <tt>MinIO operator</tt>, so you must skip the operator install step.</p>

1. Install the MinIO operator.
    ```bash
    kubectl create -f https://github.com/minio/minio-operator/blob/master/minio-operator.yaml?raw=true
    ```

1. Install the MinIO cluster.
    ```bash
    kubectl create -f https://github.com/minio/minio-operator/blob/master/examples/minioinstance-with-external-service.yaml?raw=true
    ```

1. Enable localhost access to the MinIO console.
    ```bash
    kubectl port-forward service/minio-service 9000
    ```

1. Open the [MinIO console](http://localhost:9000).

1. Get the secret key for `access key minio` to login.
    ```bash
    echo $(kubectl get secret minio-creds-secret -o=jsonpath='{.data.secretkey}' -n velero | base64 --decode)
    ```

## Delete the Cluster and Operator

1. Delete the cluster:
    ```bash
    kubectl delete -f https://github.com/minio/minio-operator/blob/master/examples/minioinstance-with-external-service.yaml?raw=true
    ```

    <p class="message--important"><strong>IMPORTANT: </strong>If the <tt>velero add-on</tt> is installed in your <tt>Konvoy cluster</tt> then you <strong>must not delete</strong> the <tt>MinIO operator</tt>. Skip the following delete step.</p>

1. Delete the operator.
    ```bash
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
