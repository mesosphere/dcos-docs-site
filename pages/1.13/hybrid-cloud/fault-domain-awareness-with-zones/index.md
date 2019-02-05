---
layout: layout.pug
navigationTitle:  Fault Domain Awareness with Zones
title: Fault Domain Awareness with Zones
menuWeight: 5
excerpt: Understanding fault domains
enterprise: false
---

# Overview

A fault domain is a section of a network, for example, a rack in a datacenter or an entire datacenter, that is vulnerable to damage if a critical device or system fails. All instances within a fault domain share similar failure and latency characteristics. Instances in the same fault domain are all affected by failure events within the domain. Placing instances in more than one fault domain reduces the risk that a failure will affect all instances.

DC/OS now supports fault domain awareness. Use fault domain awareness to make your services highly available and to allow for increased capacity when needed.

DC/OS currently supports Mesos' 2-level hierarchical fault domains: zone and region.


# Zone fault domains
Zone fault domains offer a moderate degree of fault isolation because they share the same region. However, network latency between zones in the same region is moderately low (typically < 10ms).

For on-premise deployments, a zone would be a physical data center rack.

For public cloud deployments, a zone would be the "availability zone" concept provided by most cloud providers.

If your goal is high availability, and/or your services are latency-sensitive, place your instances in a one region and balance them across zones.

# Region fault domains

Region fault domains offer the most fault isolation, though inter-region network latency is high.

For on-premise deployments, a region might be a data center.

For public cloud deployments, most cloud providers expose a "region" concept.

You can deploy your instances in a specific region based on the available capacity.
