---
layout: layout.pug
navigationTitle: Artifacts
title: Pipelinerun Artifacts
menuWeight: 15
beta: false
excerpt: Learn how to view pipelinerun artifacts
---

Pipelines can emit artifacts that can be viewed/downloaded from either the CLI or UI.

## Listing artifacts

To list the artifacts of a pipeline:

```bash
dispatch ci artifacts list --pipelinerun <pipelineRunId> --namespace <pipelineRunNamespace>
```

## Downloading artifacts

To download pipeline artifacts:

```bash
dispatch ci artifacts fetch --pipelinerun <pipelineRunId> --namespace <pipelineRunNamespace> --artifact-path=<optional-path-of-artifact> --output=<optional-path-to-save-artifact>
```

`artifact-path` flag defaults to `*` which means the command will download a zip of all pipeline artifacts.
