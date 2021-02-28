---
navigationTitle: Placement Constraints
title: Placement Constraints
menuWeight: 60
excerpt: Placement constraints
---

# Placement constraints

You can use placement constraints to customize where in a DC/OS cluster services are deployed.
Placement constraints use the [Marathon operators](http://mesosphere.github.io/marathon/docs/constraints.html) syntax.
For example, `[["hostname", "UNIQUE"]]` ensures that, at most, one pod instance is deployed per agent.

A common task is to specify a list of whitelisted systems to deploy to.
To achieve this, use the following syntax for the placement constraint:

```json
"placement_constraints": "hostname:LIKE:192.168.2.193",
```

<p class="message--important"><strong>IMPORTANT: </strong> Include excess capacity so that if one of the whitelisted systems goes down, there is still enough capacity to repair your service.</p>

## Update placement constraints

Clusters change, and so will your placement constraints. Already-running service pods are **not** impacted by changes in placement constraints. Altering a placement constraint could invalidate the current placement of a running pod, and the pod is not relocated automatically, as doing so is a destructive action.
To update the placement constraints of a pod:

1. Update the placement constraint definition in the service.
1. For each affected pod, perform a `pod replace` procedure, one at a time. This (destructively) moves the pod into accordance with the new placement constraints.

# Grafana server placement constraints

To control where the Grafana server is placed, please specify the placement constraints, as in the following:

```json
{
  "grafana": {
    "placement_constraints": "[[\"hostname\", \"IS\", \"10.0.0.73\"]]"
  }
}
```
