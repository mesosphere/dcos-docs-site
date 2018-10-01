---
layout: layout.pug
navigationTitle: Spark Resource Options
title: Spark Resources
menuWeight: 20
excerpt: Configuring Spark Resources for DSE 6.0.2
featureMaturity:
enterprise: true
model: /services/dse/data.yml
render: mustache
---

# Spark Resources Configuration template

   {{ model.techName }} can control the memory and cores offered by particular Spark Workers in semi-automatic fashion. You can define the total amount of physical resources available to Spark Workers, and optionally add named work pools with specific resources dedicated to them.

## Resource Manager Options

```
resource_manager_options:
   worker_options:
       cores_total: 0.7
       memory_total: 0.6

       workpools:
          - name: alwayson_sql
          cores: 0.25
          memory: 0.25
```
## Worker Options
   
### cores_total

  If the option is not specified, the default value 0.7 is used. `cores_total` is the number of total system cores available to Spark. This setting can be the exact number of cores or a fraction of the total system cores.

  When the value is expressed as a fraction, the available resources are calculated in the following way:

    `Spark Worker cores = cores_total * total system cores`

   The lowest value that you can assign to Spark Worker cores is 1 core. If the results are lower, no exception is thrown and the values are automatically limited. The range of fractional values is 0.01 to 1.

### memory_total
   
   The amount of total system memory available to Spark. This setting can be the exact amount of memory or a fraction of the total system memory. When the value is an absolute value, you can use standard suffixes like M for megabyte and G for gigabyte.
   
   When the value is expressed as a fraction, the available resources are calculated in the following way:

    `Spark Worker memory = memory_total * (total system memory - memory assigned to {{ model.techName }})`

   The lowest values that you can assign to Spark Worker memory is 64 MB. If the results are lower, no exception is thrown and the values are automatically limited. The fractional range of values is 0.01 to 1. If the option is not specified, the default value 0.6 is used.
   
### workpools
   
   Named work pools that can use a portion of the total resources defined under `worker_options`. A default work pool named `default` is used if no work pools are defined in this section. If work pools are defined, the resources allocated to the work pools are taken from the total amount, with the remaining resources available to the default work pool. The total amount of resources defined in the workpools section must not exceed the resources available to Spark in `worker_options`.
   
   A work pool named `alwayson_sql` is created by default for AlwaysOn SQL. By default, it is configured to use 25% of the resources available to Spark.

### name

   The name of the work pool.

### cores
   
   The number of system cores to use in this work pool expressed as either an absolute value or a fractional value. This option follows the same rules as `cores_total`.

### memory
    
   The amount of memory to use in this work pool expressed as either an absolute value or a fractional value. This option follows the same rules as `memory_total`.
