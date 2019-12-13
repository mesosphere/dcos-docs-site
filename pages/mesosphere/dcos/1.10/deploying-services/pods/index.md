---
layout: layout.pug
navigationTitle:  Pods
title: Pods
menuWeight: 85
excerpt:
preview: true
enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


# Overview
Pods enable you to share storage, networking, and other resources among a group of applications on a single agent. You can then address them as one group rather than as separate applications and manage health as a unit.

Pods allow quick, convenient coordination between applications that need to work together. For example, a primary service and a related analytics service or log scraper. Pods are particularly useful for transitioning legacy applications to a microservices-based architecture.

# Features
- Co-located containers.
- Pod-level resource isolation.
- Pod-level sandbox and ephemeral volumes.
- Pod-level health checks.
