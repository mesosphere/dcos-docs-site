---
layout: layout.pug
navigationTitle: Elasticsearch Exporter on Kommander
render: mustache
title: Elasticsearch Exporter on Kommander
menuWeight: 3
excerpt: Elasticsearch Exporter Day 2 Operations
beta: false
---

### Elasticsearch Exporter overview

[Elasticsearch Exporter](https://github.com/justwatchcom/elasticsearch_exporter) is a prometheus exporter for various metrics about ElasticSearch.

### Kommander catalog

Kommander catalog adds integration for Elasticsearch Exporter in [Helm-based drivers](https://docs.d2iq.com/dkp/kommander/1.3/projects/platform-services/helm-based/)

To access the catalog:
#include /dkp/kommander/1.3/include/kommander-catalog-drilldown.tmpl

### Install

From the [Project Catalog](/dkp/kommander/1.3/projects/platform-services/) select the desired version of Elasticsearch Exporter, and select **Deploy**.

The Kommander UI should resemble the following image. The dialog is populated with appropriate defaults:

![Elasticsearch Exporter Service Install Configuration](/dkp/kommander/1.3/img/platform-services-elasticsearch-exporter-config-dialog.png)

- The **es.uri** field above should refer to the Elasticsearch client.

You will see the following pods under the project namespace on the Kubernetes cluster (assuming Elasticsearch is already running):
```
$ kubectl get pods
NAME                                                              READY   STATUS    RESTARTS   AGE
elasticsearch-oss-client-0                                        1/1     Running   0          111s
elasticsearch-oss-data-0                                          1/1     Running   0          111s
elasticsearch-oss-data-1                                          1/1     Running   0          111s
elasticsearch-oss-data-2                                          1/1     Running   0          111s
elasticsearch-oss-master-0                                        1/1     Running   0          111s
elasticsearch-oss-master-1                                        1/1     Running   0          111s
elasticsearch-oss-master-2                                        1/1     Running   0          111s
es-exporter-kubeaddons-prometheus-elasticsearch-exporter-6nlv8g   1/1     Running   0          10s
```

### Parameters
Full list of [Configuration Parameters](https://github.com/mesosphere/charts/tree/master/stable/elasticsearch-exporter#configuration) that can be applied to Elasticsearch Exporter Platform service. The current set of default parameters applied can be found [in this file](https://github.com/mesosphere/charts/blob/master/stable/elasticsearch-exporter/values.yaml).


### Services Exposed

The following services are exposed by Elasticsearch and Elasticsearch exporter.
```
$ kubectl get svc
NAME                                                       TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)             AGE
elasticsearch-oss-client                                   ClusterIP   10.0.50.166   <none>        9200/TCP,9300/TCP   33m
elasticsearch-oss-client-headless                          ClusterIP   None          <none>        9200/TCP,9300/TCP   33m
elasticsearch-oss-data                                     ClusterIP   10.0.19.66    <none>        9200/TCP,9300/TCP   33m
elasticsearch-oss-data-headless                            ClusterIP   None          <none>        9200/TCP,9300/TCP   33m
elasticsearch-oss-ingest                                   ClusterIP   10.0.61.113   <none>        9200/TCP,9300/TCP   33m
elasticsearch-oss-ingest-headless                          ClusterIP   None          <none>        9200/TCP,9300/TCP   33m
elasticsearch-oss-master                                   ClusterIP   10.0.28.71    <none>        9200/TCP,9300/TCP   33m
elasticsearch-oss-master-headless                          ClusterIP   None          <none>        9200/TCP,9300/TCP   33m
es-exporter-kubeaddons-prometheus-elasticsearch-exporter   ClusterIP   10.0.54.150   <none>        9108/TCP            31m
```
