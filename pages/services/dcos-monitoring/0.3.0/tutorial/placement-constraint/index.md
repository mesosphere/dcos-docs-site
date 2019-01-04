---
layout: layout.pug
navigationTitle: Placement Constraints
title: Placement Constraints
menuWeight: 40
excerpt: Placement Constraints
---

# Placement constraints

Placement constraints allow you to customize where a service is deployed in the DC/OS cluster.
Placement constraints use the [Marathon operators](http://mesosphere.github.io/marathon/docs/constraints.html) syntax.
For example, `[["hostname", "UNIQUE"]]` ensures that at most one pod instance is deployed per agent.

A common task is to specify a list of whitelisted systems to deploy to.
To achieve this, use the following syntax for the placement constraint:

```json
[["hostname", "LIKE", "10.0.0.159|10.0.1.202|10.0.3.3"]]
```

*IMPORTANT*: Be sure to include excess capacity in such a scenario so that if one of the whitelisted systems goes down, there is still enough capacity to repair your service.

## Updating placement constraints

Clusters change, and as such so will your placement constraints.
However, already running service pods will **not** be affected by changes in placement constraints.
This is because altering a placement constraint might invalidate the current placement of a running pod, and the pod will not be relocated automatically as doing so is a destructive action.
We recommend using the following procedure to update the placement constraints of a pod:

- Update the placement constraint definition in the service.
- For each affected pod, one at a time, perform a `pod replace`.
  This will (destructively) move the pod to be in accordance with the new placement constraints.

# Grafana server placement constraints

To control where to place Grafana server, please specify the placement constraints like the following:

```json
{
  "grafana": {
    "placement_constraints": "[[\"hostname\", \"IS\", \"10.0.0.73\"]]"
  }
}
```
