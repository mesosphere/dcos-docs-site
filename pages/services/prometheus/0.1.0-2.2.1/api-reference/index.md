---
layout: layout.pug
navigationTitle:  API Reference
title: API Reference
menuWeight: 90
excerpt: DC/OS Prometheus Service HTTP API Reference
featureMaturity:
enterprise: false
---

<!-- {% raw %} disable mustache templating in this file: retain nifid examples as-is -->

The DC/OS Prometheus Service have exppression browser that may be accessed from outside the cluster. The <dcos_url> parameter referenced below indicates the base URL of the DC/OS cluster on which the DC/OS Prometheus Service is deployed.

The expression browser is available at /graph on the Prometheus server, allowing you to enter any expression and see its result either in a table or graphed over time.

This is primarily useful for ad-hoc queries and debugging, prometheus expression browser would require to be accessed via Edge-LB.

Prometheus HTTP API details can be found at https://prometheus.io/docs/prometheus/latest/querying/api/
