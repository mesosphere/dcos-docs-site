---
layout: layout.pug
navigationTitle: Kibana on Kommander
render: mustache
title: Kibana on Kommander
menuWeight: 3
excerpt: Kibana Day 2 Operations
beta: false
---

<!-- markdownlint-disable MD018 -->

### Kibana overview

[Kibana](https://www.elastic.co/what-is/kibana) is an free and open frontend application that sits on top of the Elastic Stack, providing search and data visualization capabilities for data indexed in Elasticsearch. Commonly known as the charting tool for the Elastic Stack (previously referred to as the ELK Stack after Elasticsearch, Logstash, and Kibana), Kibana also acts as the user interface for monitoring, managing, and securing an Elastic Stack cluster, and as the centralized hub for built-in solutions developed on the Elastic Stack.

### Kommander catalog

Kommander catalog adds integration for Elasticsearch in [Helm-based drivers](/dkp/kommander/1.4/projects/platform-services/helm-based/)

To access the catalog:
#include /dkp/kommander/1.4/include/kommander-catalog-drilldown.tmpl

### Install

From the [Project Catalog](/dkp/kommander/1.4/projects/platform-services/) select the desired version of Elasticsearch, and select **Deploy**.

The Kommander UI should resemble the following image. The dialog is populated with appropriate defaults:

![Kibana Service Install Configuration](/dkp/kommander/1.4/img/platform-services-kibana-config-dialog.png)

- The **kibana.elasticsearchHosts** should point to the Elasticsearch client node.

You will see the following pods under the project namespace on the Kubernetes cluster (assuming elasticsearch service is already running):

```bash
kubectl get pods
```

```sh
NAME                                                              READY   STATUS    RESTARTS   AGE
elasticsearch-oss-client-0                                        1/1     Running   0          21m
elasticsearch-oss-data-0                                          1/1     Running   0          21m
elasticsearch-oss-data-1                                          1/1     Running   0          21m
elasticsearch-oss-data-2                                          1/1     Running   0          21m
elasticsearch-oss-master-0                                        1/1     Running   0          21m
elasticsearch-oss-master-1                                        1/1     Running   0          21m
elasticsearch-oss-master-2                                        1/1     Running   0          21m
kibana-kubeaddons-kibana-65f88487c8-t28td                         1/1     Running   0          71s
```

### Parameters

The Kommander Catalog Kibana Platform Service creates an ensemble of the upstream [Kibana Helm Chart](https://github.com/elastic/helm-charts/tree/master/kibana)

Full list of [Configuration Parameters](https://github.com/elastic/helm-charts/tree/master/kibana#configuration) that can be applied to Kibana Platform Service.

The current set of default parameters applied can be found [in this file](https://github.com/mesosphere/kubeaddons-elastic/tree/kibana-7.10.x/values.yaml).

### Services Exposed

The following services are exposed by Elasticsearch and Kibana.

```bash
kubectl get svc
```

```sh
NAME                                                       TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)             AGE
elasticsearch-oss-client                                   ClusterIP   10.0.50.166   <none>        9200/TCP,9300/TCP   33m
elasticsearch-oss-client-headless                          ClusterIP   None          <none>        9200/TCP,9300/TCP   33m
elasticsearch-oss-data                                     ClusterIP   10.0.19.66    <none>        9200/TCP,9300/TCP   33m
elasticsearch-oss-data-headless                            ClusterIP   None          <none>        9200/TCP,9300/TCP   33m
elasticsearch-oss-ingest                                   ClusterIP   10.0.61.113   <none>        9200/TCP,9300/TCP   33m
elasticsearch-oss-ingest-headless                          ClusterIP   None          <none>        9200/TCP,9300/TCP   33m
elasticsearch-oss-master                                   ClusterIP   10.0.28.71    <none>        9200/TCP,9300/TCP   33m
elasticsearch-oss-master-headless                          ClusterIP   None          <none>        9200/TCP,9300/TCP   33m
kibana-kubeaddons-kibana                                   ClusterIP   10.0.33.80    <none>        5601/TCP            13m
```
