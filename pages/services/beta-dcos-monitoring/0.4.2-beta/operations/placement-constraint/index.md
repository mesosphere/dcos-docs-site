---
layout: layout.pug
navigationTitle: Placement Constraints
title: Placement Constraints
menuWeight: 60
excerpt: Placement constraints
render: mustache
model: ../../data.yml
---

#include /services/include/beta-software-warning.tmpl

# Placement constraints

Placement constraints allow you to customize where a service is deployed in the DC/OS cluster.
Placement constraints use the [Marathon operators](http://mesosphere.github.io/marathon/docs/constraints.html) syntax.
For example, `[["hostname", "UNIQUE"]]` ensures that at most one pod instance is deployed per agent.

A common task is to specify a list of whitelisted systems to deploy to.
To achieve this, use the following syntax for the placement constraint:

```json
[["hostname", "LIKE", "10.0.0.159|10.0.1.202|10.0.3.3"]]
```

<p class="message--important"><strong>IMPORTANT: </strong> Be sure to include excess capacity in such a scenario so that if one of the whitelisted systems goes down, there is still enough capacity to repair your service.</p>

## Updating placement constraints

Clusters change, and so will your placement constraints.
However, already-running service pods will **not** be affected by changes in placement constraints.
This is because altering a placement constraint might invalidate the current placement of a running pod, and the pod will not be relocated automatically, as doing so is a destructive action.
We recommend using the following procedure to update the placement constraints of a pod:

1. Update the placement constraint definition in the service.
1. For each affected pod, perform a `pod replace` procedure, one at a time. This will (destructively) move the pod to be in accordance with the new placement constraints.

# Grafana server placement constraints

To control where the Grafana server is placed, please specify the placement constraints, as in the following:

```json
{
  "grafana": {
    "placement_constraints": "[[\"hostname\", \"IS\", \"10.0.0.73\"]]"
  }
}
```
