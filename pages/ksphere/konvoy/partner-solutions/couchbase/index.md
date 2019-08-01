---
layout: layout.pug
navigationTitle: Couchbase
title: Couchbase
excerpt: Couchbase Autonomous Operator
menuWeight: 40
category: Workload
image: img/couchbase.png
---

The Couchbase Autonomous Operator provides a native integration of Couchbase Server with open source Kubernetes. It enables you to automate the management of common Couchbase tasks such as the configuration, creation, scaling, and recovery of Couchbase clusters. By reducing the complexity of running a Couchbase cluster, it lets you focus on the desired configuration and not worry about the details of manual deployment and lifecycle management.

## quick start


### prerequisites

Add the Couchbase helm chart repository.
```
helm repo add couchbase https://couchbase-partners.github.io/helm-charts/
helm repo update
```

### install the operator

Install the Couchbase operator.
```
helm install --name mycbop couchbase/couchbase-operator
```

Learn more abbout the [operator chart specification](https://docs.couchbase.com/operator/current/helm-operator-config.html).

### install the Couchbase cluster

Installing a Couchbase cluster with `persistent volumes` requires to pass a `values yaml` file to the helm install with the persistent volume configuration. Use the following snippet to create a `values-persistent.yaml` file.

**Note:** Depending on the `Konvoy provisioner` you use you may have to edit the `storageClassName`.

```sh
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

Next install the Couchbase cluster.

```
helm install -f values-persistent.yaml --name mycbc couchbase/couchbase-cluster
```

Learn more about the [cluster chart specification](https://docs.couchbase.com/operator/current/helm-cluster-config.html).

### access the cluster

Enable localhost access to the Couchbase Admin console.
```
kubectl port-forward mycbc-couchbase-cluster-0000 8091:8091
```

Click to open the [Couchbase Admin console](http://localhost:8091).

Get the password for `user named Administrator` to login.
```
echo $(kubectl get secret mycbc-couchbase-cluster -o=jsonpath='{.data.password}' | base64 --decode)
```

### delete the cluster and operator

Delete the cluster and operator using the respective release name.
```
helm delete --purge mycbc
helm delete --purge mycbop
```

## information

#### documentation

* [couchbase autonomous operator](https://docs.couchbase.com/operator/current/overview.html)
* [couchbase autonomous operator - helm](https://docs.couchbase.com/operator/current/helm-setup-guide.html)
* [couchbase server](https://docs.couchbase.com/server/current/introduction/intro.html)
* [couchbase server sdk's](https://docs.couchbase.com/server/current/sdk/overview.html)


#### release notes

* [couchbase autonomous operator release notes](https://docs.couchbase.com/operator/current/release-notes.html)
* [couchbase server release notes](https://docs.couchbase.com/server/current/release-notes/relnotes.html)

#### license

* [couchbase license](https://www.couchbase.com/legal/agreements#ProductLicenses)

#### maintenance & support

* <support@couchbase.com>
