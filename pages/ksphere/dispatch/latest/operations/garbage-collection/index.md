---
layout: layout.pug
navigationTitle:  Garbage Collection
title: Dispatch Garbage Collection
menuWeight: 3
excerpt: Configure garbage collection of Dispatch resources.
---

# Garbage Collection

By default, Dispatch deletes all `TaskRuns`, `PipelineRuns`, and `PipelineResources` that are older than 48 hours.

To adjust the age at which resources are garbage collected, set `dispatch.garbageCollectAge` to the desired time.

For example, to set the garbage collection time to 72 hours, set:

```
dispatch init --set dispatch.garbageCollectAge=72h
```
