---
layout: layout.pug
navigationTitle: Couchbase
title: Couchbase
excerpt: Couchbase Autonomous Operator  
menuWeight: 40
category: Workload
image: img/couchbase.png
---
# Couchbase
The Couchbase Autonomous Operator provides a native integration of Couchbase Server with open source Kubernetes. It enables you to automate the management of common Couchbase tasks such as the configuration, creation, scaling, and recovery of Couchbase clusters. By reducing the complexity of running a Couchbase cluster, it lets you focus on the desired configuration and not worry about the details of manual deployment and lifecycle management.

## Quick Start


### Prerequisites

Add the Couchbase helm chart repository.
```bash
helm repo add couchbase https://couchbase-partners.github.io/helm-charts/
helm repo update
```

### Install the Operator

Install the Couchbase operator.
```bash
helm install --name mycbop couchbase/couchbase-operator
```

Learn more about the [operator chart specification](https://docs.couchbase.com/operator/current/helm-operator-config.html).

### Install the Couchbase Cluster

Installing a Couchbase cluster with `persistent volumes` requires you to pass a `values yaml` file to the helm install with the persistent volume configuration. Use the following snippet to create a `values-persistent.yaml` file.

<p class="message--note"><strong>NOTE: </strong>Depending on the Konvoy provisioner you use, you may have to edit the <tt>storageClassName</tt>.</p>

```bash
cat >values-persistent.yaml <<EOL
couchbaseCluster:
  servers:
    all_services:
      pod:
        volumeMounts:
          default: couchbase
          data:  couchbase
  securityContext:
      fsGroup: 1000
  volumeClaimTemplates:
    - metadata:
        name: couchbase
      spec:
        storageClassName: "awsebscsiprovisioner"
        resources:
          requests:
            storage: 1Gi
EOL
```

Next, install the Couchbase cluster.

```bash
helm install -f values-persistent.yaml --name mycbc couchbase/couchbase-cluster
```

Learn more about the [cluster chart specification](https://docs.couchbase.com/operator/current/helm-cluster-config.html).

### Access the Cluster

Enable localhost access to the Couchbase Admin console.
```bash
kubectl port-forward mycbc-couchbase-cluster-0000 8091:8091
```

Click to open the [Couchbase Admin console](http://localhost:8091).

Get the password for `user named Administrator` to login.
```bash
echo $(kubectl get secret mycbc-couchbase-cluster -o=jsonpath='{.data.password}' | base64 --decode)
```

### Delete the Cluster and Operator

Delete the cluster and operator using the respective release name.
```bash
helm delete --purge mycbc
helm delete --purge mycbop
```

## Information

### Documentation

* [Couchbase autonomous operator](https://docs.couchbase.com/operator/current/overview.html)
* [Couchbase autonomous operator - helm](https://docs.couchbase.com/operator/current/helm-setup-guide.html)
* [Couchbase server](https://docs.couchbase.com/server/current/introduction/intro.html)
* [Couchbase server sdk's](https://docs.couchbase.com/server/current/sdk/overview.html)


### Release Notes

* [Couchbase autonomous operator release notes](https://docs.couchbase.com/operator/current/release-notes.html)
* [Couchbase server release notes](https://docs.couchbase.com/server/current/release-notes/relnotes.html)

### License

* [Couchbase license](https://www.couchbase.com/legal/agreements#ProductLicenses)

### Maintenance and Support

* <support@couchbase.com>
