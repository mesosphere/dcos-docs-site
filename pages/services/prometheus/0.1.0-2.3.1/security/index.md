---
layout: layout.pug
navigationTitle: Security
title: Security
menuWeight: 50
excerpt: DC/OS Prometheus Service Security
featureMaturity:
enterprise: false
---

# DC/OS Prometheus Security

Prometheus is a monitoring system, not a security framework. Accordingly given the massive work that’d be involved in creating and maintaining a security framework, Prometheus team decided to instead leave the task up to 3rd party systems such as Nginx and Apache. These already implement the security feature and are well maintained, and allow the Prometheus project to focus on its core goal of monitoring.

The DC/OS Prometheus service provides security via foldered installation, folders can be created and folders can be permissioned to restrict the services.

For More details on Prometheus Security Model can be found at :https://prometheus.io/docs/operating/security/
