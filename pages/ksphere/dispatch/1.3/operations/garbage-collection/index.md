---
layout: layout.pug
navigationTitle:  Garbage Collection
title: Dispatch Garbage Collection
menuWeight: 20
beta: false
excerpt: Configure garbage collection of Dispatch resources.
---

By default, Dispatch deletes all `TaskRuns`, `PipelineRuns`, and `PipelineResources` that are older than 48 hours.

To adjust the age at which resources are garbage collected, set `dispatch.garbageCollectAge` to the desired time.

For example, to set the garbage collection time to 72 hours, set:

```bash
dispatch init --set dispatch.garbageCollectAge=72h
```

#### Garbage collection of persisted logs 

Dispatch also supports garbage collecting the logging storage. A list of rules can be added globally and overridden on a per repository basis. For example:

```json
[
  {
    "maxBuildAge": 30,
    "maxBuildRuns": 100,
    "tasks": "*"
  },
  {
    "maxBuildAge": 7,
    "maxBuildRuns": 200,
    "tasks": "unit-*"
  }
]
```

Here is the meaning of each field:

- `maxBuildAge`: This specifies the maximum age (in days) of a build. Zero value (0) skips the check.
- `maxBuildRuns`: This specifies the maximum number of builds to retain. Zero value (0) skips the check.
- `tasks`: This is a glob expressions that match task name(s). Specifying `*` (== all tasks) garbage collects the entire pipeline.

Note that at least one of `maxBuildAge` or `maxBuildRuns` is required. If both are 0, the rule is skipped. `tasks` is a mandatory field.

In the above example:
- The first rules prunes pipelines that are 30 days older OR has more than 100 runs.
- The second rule applies to task(s) beginning with "unit-" and are atleast 7 days old OR has more than 200 runs. 

These rules can be configured during Dispatch install time and can be overridden per repository when creating the repository object. For example:

```bash
dispatch ci repository create --log-storage-rules='[{"maxBuildAge":30, "maxBuildRuns":100, "tasks":"*"}]' -ndispatch --service-account team-1
```

This is useful to install Dispatch without any rules and then add rules per repository later on. Repository CRD can also be edited post creation to update any rules.
 
Log pruning is done by a cron job that runs once a day. The cron expression can be changed if you need to run this more frequently in the `{namespace}-log-pruner` cronjob. Note that the minimum value of build age is one day before you change the cron expression.
