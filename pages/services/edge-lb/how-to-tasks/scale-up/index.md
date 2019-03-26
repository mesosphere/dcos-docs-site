---
layout: layout.pug
navigationTitle: Scaling up load-balancer instances
title: Scaling up load-balancer instances
menuWeight: 25
excerpt: How to scale up load balancer instances
enterprise: true
---

# Before you begin

- Edge-LB [installed and running](/services/edge-lb/getting-started/installing/).

# Scale down Edge-LB pool instances

To scale down Edge-LB pool instances change the count to a lower number. E.g. if the previous count in the Edge-LB pool config was 5, change it to 2.

An Example config file for Edge-LB pool config:

```json
{
  "id": "/my-app",
  ...
  "name": "sample-minimal",
  "count": 2,
  ...
}
```

