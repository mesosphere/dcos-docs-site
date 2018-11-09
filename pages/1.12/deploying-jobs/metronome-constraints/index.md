---
layout: layout.pug
navigationTitle:  Metronome Placement Constraints
title: Metronome Placement Constraints
menuWeight: 3
excerpt: Understanding Metronome placement constraints

enterprise: false
---

Metronome placement constraints control where jobs run. Constraints have three parts: a field name, an operator, and a value. The field can be the hostname of the agent node or any attribute of the agent node.

Metronome supports a subset of Marathon operators, and supports all of Marathon's special field names.

# Field Names

## Agent properties as a field name

Constraints with a field name beginning with `@` refer to agent properties.

### Host name

Entering `@hostname` as the field name matches the agent node hostnames. See `LIKE operator`, below, for a usage example.

### Region and zone as field names

Use the `@region` and `@zone` field names to configure [fault domain awareness and capacity extension](/1.12/deploying-services/fault-domain-awareness/). See `IS oeprator`, below, for a usage example

## Attribute as field name

If `@hostname`, `@region`, or `@zone` are not specified as field names, then the field name is interpreted as a Mesos agent node attribute. A Mesos agent node attribute allows you to tag an agent node. See `mesos-slave --help` to learn how to set the attributes. If the specified attribute is not defined on the agent node, most operators will refuse to run tasks on it. In fact, only the `UNLIKE` operator will (and always will) accept this offer for now, while other operators will always refuse it.

Metronome supports text, scalar, range, and set attribute values. For scalars, ranges, and sets, Marathon will perform a string comparison on the formatted values. The format matches that of the Mesos attribute formatting. For ranges and sets, the format is `[begin-end,...]` and `{item,...}` respectively. For example, you might have a range formatted as `[100-200]` and a set formatted as `{a,b,c}`. Regex is allowed for LIKE and UNLIKE operators; to match ANY value, use the string `.*`.

# Operators

## IS operator

Supported in DC/OS 1.12.1 and later.

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

### Example

The following example will cause a job to run in the region us-east-1:

```json
{
  "description": "Remote Sleeper",
  "id": "sleeper-remote",
  "run": {
    ...,
    "placement": {
      "constraints": [
        { "attribute": "@region", "operator": "IS", "value": "us-east-1" }
      ]
    }
  }
}
```

## LIKE operator
**Value** (required): A regular expression for the value of the attribute.

`LIKE` accepts a regular expression as parameter and allows you to run your tasks only on the agent nodes whose field values match the regular expression. Note that the entire value must be matched (imagine there is an implicit `^` and `$` surrounding the regular expression).

```json
{
  "description": "Important Job",
  "id": "sleeper",
  "run": {
    ...,
    "placement": {
      "constraints": [
        { "attribute": "@hostname", "operator": "LIKE", "value": "host-[7-9]" }
      ]
    }
  }
}
```

If the attribute in question is a scalar, it is rounded to the nearest thousandth using the half-even rounding strategy; zeroes after the decimal are dropped.

## UNLIKE operator
**Value** (required): A regular expression for the value of the attribute.

`UNLIKE` is similar to the `LIKE` operator, but instructs Metronome to only run tasks on agent nodes whose field values **do not** match the regular expression.

``` json
{
  "description": "Important Job",
  "id": "sleeper",
  "run": {
    ...,
    "placement": {
      "constraints": [
        { "attribute": "@hostname", "operator": "UNLIKE", "value": "temp-host-.*" }
      ]
    }
  }
}
```

