---
layout: layout.pug
navigationTitle:  Metronome Placement Constraints
title: Metronome Placement Constraints
menuWeight: 3
excerpt: Understanding Metronome placement constraints

enterprise: false
---

Metronome placement constraints control where jobs run. Constraints have three parts: a field name, an operator, and a value. The field can be the hostname of the agent or any attribute of the agent.

Metronome supports a subset of Marathon operators, and supports all of Marathon's special field names.

# Field Names

## Agent properties as a field name

Constraints with a field name beginning with `@` refer to agent properties.

### Host name

Entering `@hostname` as the field name matches the agent hostname. See `LIKE` operator, below, for a usage example.

### Region and zone as field names

Use the `@region` and `@zone` field names to configure [fault domain awareness and capacity extension](/1.13/deploying-services/fault-domain-awareness/). See `IS` operator, below, for a usage example

## Attribute as field name

If `@hostname`, `@region`, or `@zone` are not specified as field names, then the field name is interpreted as a Mesos [agent attribute](http://mesos.apache.org/documentation/attributes-resources/#attributes).

Metronome supports text, scalar and range attribute values. For scalars and ranges, Metronome will perform a string comparison on the formatted values as they would be specified [per the specification in Mesos](http://mesos.apache.org/documentation/attributes-resources/#attributes).

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

Given an agent with attribute "level:0.8", the following constraints would match:

```json
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

`LIKE` accepts a regular expression as parameter and allows you to run your tasks only on the agents whose field values match the regular expression. Note that the entire value must be matched (imagine there is an implicit `^` and `$` surrounding the regular expression).

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

`LIKE` constraints will not match offers from agents that lack the attribute in question.

If the attribute in question is a scalar, it is rounded to the nearest thousandth using the half-even rounding strategy; zeroes after the decimal are dropped.

## UNLIKE operator
**Value** (required): A regular expression for the value of the attribute.

`UNLIKE` is similar to the `LIKE` operator, but instructs Metronome to only run tasks on agents whose field values **do not** match the regular expression.

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

`UNLIKE` constraints will match offers from agents that lack the attribute in question.
