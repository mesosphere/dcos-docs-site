---
layout: layout.pug
navigationTitle: 
title: Deployment Best Practices
menuWeight: 21
excerpt:

---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-commons -->


- Use Mesosphere Enterprise DC/OS's placement rules to map your DSE cluster nodes or DC to different availability zones to achieve high resiliency.
- Set up a routine backup services using OpsCenter to back up your business critical data in a regular basis.  The data can be stored on the DSE nodes themselves or on AWS S3 buckets depending on your IT policy or business needs.
- Set up a routine repair services using OpsCenter to ensure all data on a replica is consistent within your DSE clusters.
