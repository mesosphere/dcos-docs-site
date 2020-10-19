---
layout: layout.pug
navigationTitle: Operating Pipeline Runs
title: Operating Pipeline Runs
menuWeight: 90
beta: false
excerpt: This tutorial describes how to operate a pipeline run from the Dashboard. 
---

# Prerequisites

- Access to set up a valid git repository on a konvoy cluster with Dispatch installed. Refer to [installing dispatch on konvoy](../../../install/) and then [hello world tutorial](../../../quickstart/hello-world-in-starlark/) on how to do this.
- [`kubectl`](https://kubernetes.io/docs/tasks/tools/install-kubectl/) and Dispatch [CLI installed](../../../install/cli/) in the environment.

# Contents of this tutorial

* Change the default PipelineRun time out of a Pipeline  
* Stop or Rerun a PipelineRun
* View summary information of all Pipelines
* View summary information of the PipelineRuns of a Pipeline

# Operating PipelineRuns from the Dashboard

## Change the PipelineRun default Timeout

1. From the Konvoy Dashboard, select **CI/CD >Continuous Integration (CI)  >  Repositories**.
1. Select the Repository associated with the Pipeline.
1. Select **Edit**, enter the desired timeout, and then **Save**.

## Stop or Rerun a PipelineRun
Selecting the URL in the SCM Pull Request details, that triggered the PipelineRun, will take you to the PipelineRun view  

OR 

from the Konvoy Dashboard select **CI/CD > Continuous Integration (CI) > Pipelines** select the relevant pipeline to view the table of PipelineRuns summary information. Select the PipelineRun (the build) entry of the PR number (e.g. “pr-11”), or Branch (e.g. “#11”)  that you want to Stop or Rerun and that will take you to the PipelineRun view. 

The status of a running pipeline will indicate that it is Running. Select **Stop** & then **Stop Build** to cancel the Running pipeline. After it is stopped its status will be displayed as **Cancelled**.
To rerun a previously failed or successful PipelineRun select Rerun.

## View Pipeline Information
From the Konvoy Dashboard select **CI/CD > Continuous Integration (CI) > Pipelines** to see a summary of the latest run of every Pipeline. The displayed information includes Pipeline Configuration Name, Status (e.g. Running, Succeeded, Failed, Cancelled), Creation time, and Duration of the PipelineRuns.

To view all the activity of a Pipeline, select the one you are interested in.

## View PipelineRuns Summary
From the Konvoy Dashboard select **CI/CD > Continuous Integration (CI) > Pipelines > Pipeline** to see a summary of the latest PipelineRuns. 

Select **View System PipelineRuns** to see the PipelineRuns that process Dispatchfiles that generate the PipelineRuns corresponding to the actual builds. System PipelineRuns allow you to see problems and errors associated with processing of the Dispatchfile or errors incurred in interactions with the Source Control Management system.  Select View PipelineRuns to see PipelineRuns corresponding to builds.  

To refine the view by PipelineRun number (e.g.”#11”) or pr-number (e.g. “pr-11”) use the Filter box. “11” will filter to PipelineRun number “11” and “pr-11”.

To download all the artifacts output by a specific PipelineRun select Download Artifacts.

To troubleshoot, or inspect in detail (logs, artifacts, the Intermediate Representation of the Dispatch file, parameters, start time, duration, trigger reason and other information), select a specific PipelineRun. See [Pipeline Configuration Reference](../../../references/pipeline-config-ref/) for information on Intermediate Details.
