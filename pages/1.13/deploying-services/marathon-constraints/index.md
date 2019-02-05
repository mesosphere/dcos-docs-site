---
layout: layout.pug
navigationTitle:  Marathon Placement Constraints
title: Marathon Placement Constraints
menuWeight: 3
excerpt: Understanding Marathon placement constraints

enterprise: false
---

Marathon placement constraints control where services run to allow optimizing for either fault tolerance (by spreading a task out on multiple nodes) or locality (by running all of a service's tasks on the same node). Constraints have three parts: a field name, an operator, and an optional parameter. The field can be the hostname of the agent node or any attribute of the agent node.

# Field Names

## Agent properties as a field name

Constraints with a field name beginning with `@` refer to agent properties.

### Host name

Entering `@hostname` as the field name matches the agent node hostnames. See `UNIQUE operator`, below, for a usage example.

### Region and zone as field names

Use the `@region` and `@zone` field names to configure [fault domain awareness and capacity extension](/1.13/deploying-services/fault-domain-awareness/).

## Attribute as field name

If `@hostname`, `@region`, or `@zone` are not specified as field names, then the field name is interpreted as a Mesos agent node attribute. A Mesos agent node attribute allows you to tag an agent node. See `mesos-slave --help` to learn how to set the attributes. If the specified attribute is not defined on the agent node, most operators will refuse to run tasks on it. In fact, only the `UNLIKE` operator will (and always will) accept this offer for now, while other operators will always refuse it.

Marathon supports text, scalar, range, and set attribute values. For scalars, ranges, and sets, Marathon will perform a string comparison on the formatted values. The format matches that of the Mesos attribute formatting. For ranges and sets, the format is `[begin-end,...]` and `{item,...}` respectively. For example, you might have a range formatted as `[100-200]` and a set formatted as `{a,b,c}`. Regex is allowed for LIKE and UNLIKE operators; to match ANY value, use the string `.*`.

# Operators

## CLUSTER operator
**Value** (optional): A string value.
When a value is specified, tasks are launched on agent nodes with an attribute whose value matches exactly.

`CLUSTER` allows you to run all of your service's tasks on agent nodes that share a certain attribute. This is useful, for example, if you have services with special hardware needs, or if you want to run them on the same rack for low latency.

Naming the field name `hostname` tells Marathon that the launched tasks of the app or pod should be launched together on the same agent:
* When a value for `hostname` is specified, tasks are launched on the agent whose hostname matches the value.
* When the `hostname` value is empty or unspecified, the first instance is launched on **any** agent node and the remaining tasks are launched alongside it on the same agent.

When the field name is an attribute, Marathon handles tasks differently:
* When a value is specified, tasks are launched on any agent with an attribute named according the field **and** with a value matching that of the constraint.
* When the value is empty or unspecified, the first instance is launched on any agent with an attribute named according to the field; the value of the attribute on that agent is used for future constraint matches.

## Examples
The example below specifies the exact rack on which to run app tasks:

``` json
{
  "id": "sleep-cluster",
  "cmd": "sleep 60",
  "instances": 3,
  "constraints": [["rack_id", "CLUSTER", "rack-1"]]
}
```

This example leaves the value field empty. This tells Marathon that all of the app tasks should run on the same rack, but does not specify which.

``` json
{
  "id": "sleep-cluster",
  "cmd": "sleep 60",
  "instances": 3,
  "constraints": [["rack_id", "CLUSTER"]]
}
```

This example uses the specified `hostname`, which means a service must run on a specific node.

``` json
{
  "id": "sleep-cluster",
  "cmd": "sleep 60",
  "instances": 3,
  "constraints": [["hostname", "CLUSTER", "a.specific.node.com"]]
}
```

Below, the field is named `hostname`, but the value is empty. This tells Marathon that all app tasks must run on the same node, but does not specify which.

``` json
{
  "id": "sleep-cluster",
  "cmd": "sleep 60",
  "instances": 3,
  "constraints": [["hostname", "CLUSTER"]]
}
```

## LIKE operator
**Value** (required): A regular expression for the value of the attribute.

`LIKE` accepts a regular expression as parameter and allows you to run your tasks only on the agent nodes whose field values match the regular expression. Note that the entire value must be matched (imagine there is an implicit `^` and `$` surrounding the regular expression)

``` json
{
  "id": "sleep-group-by",
  "cmd": "sleep 60",
  "instances": 3,
  "constraints": [["rack_id", "LIKE", "rack-[1-3]"]]
}
```

If the attribute in question is a scalar, it is rounded to the nearest thousandth using the half-even rounding strategy; zeroes after the decimal are dropped.

## UNLIKE operator
**Value** (required): A regular expression for the value of the attribute.

`UNLIKE` is similar to the `LIKE` operator, but instructs Marathon to only run tasks on agent nodes whose field values **do not** match the regular expression. Note that the entire value must be matched (imagine there is an implicit `^` and `$` surrounding the regular expression)

``` json
{
  "id": "sleep-group-by",
  "cmd": "sleep 60",
  "instances": 3,
  "constraints": [["rack_id", "UNLIKE", "rack-[7-9]"]]
}
```

## MAX_PER operator
**Value** (required): An integer, for example `"2"`.

`MAX_PER` accepts a number as parameter that specifies the maximum size of each group. It can be used to limit tasks across racks or datacenters.

``` json
{
  "id": "sleep-group-by",
  "cmd": "sleep 60",
  "instances": 3,
  "constraints": [["rack_id", "MAX_PER", "2"]]
}
```

## UNIQUE operator
`UNIQUE` does not accept a value.

`UNIQUE` tells Marathon to enforce uniqueness of the attribute across all of a service's tasks. For example, the following constraint ensures that there is only one service task running on each host.

``` json
{
  "id": "sleep-unique",
  "cmd": "sleep 60",
  "instances": 3,
  "constraints": [["hostname", "UNIQUE"]]
}
```

## GROUP_BY operator
**Value** (optional): An integer, for example `"3"`.

`GROUP_BY` can be used to distribute tasks evenly across racks or datacenters for high availability.

``` json
{
  "id": "sleep-group-by",
  "cmd": "sleep 60",
  "instances": 3,
  "constraints": [["rack_id", "GROUP_BY"]]
}
```

Marathon only knows about different values of the attribute (e.g. "`rack_id`") by analyzing incoming offers from Mesos. If tasks are not already spread across all possible values, specify the number of values in constraints. If you do not specify the number of values, you might find that the tasks are only distributed in one value, even though you are using the `GROUP_BY` constraint. For example, if you are spreading across 3 racks, use:

``` json
{
  "id": "sleep-group-by",
  "cmd": "sleep 60",
  "instances": 3,
  "constraints": [["rack_id", "GROUP_BY", "3"]]
}
```

## IS operator

**Value** (required): A Mesos Scalar or Text value, as specified by the [Mesos Attributes and Resources Type Specification](http://mesos.apache.org/documentation/latest/attributes-resources/#types):

```
scalar : floatValue

floatValue : ( intValue ( "." intValue )? ) | ...

intValue : [0-9]+

text : [a-zA-Z0-9_/.-]
```

### Comparing text values

When an `IS` constraint is specified, a task is only launched on nodes that have the specified value.

``` json
{
  "id": "sleep-cluster",
  "cmd": "sleep 60",
  "instances": 3,
  "constraints": [["rack", "IS", "rack-1"]]
}
```

### Comparing scalar values

When comparing scalars, the value is compared to the nearest thousandth (using half-even rounding strategy).

Given a node with attribute "level:0.8", the following constraints would match:

``` json
[["level", "IS", "0.8"]]

[["level", "IS", "0.80"]]

[["level", "IS", "0.8001"]]
```
