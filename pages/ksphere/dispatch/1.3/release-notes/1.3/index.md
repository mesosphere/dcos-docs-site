---
layout: layout.pug
navigationTitle: 1.3.0
title: Release Notes 1.3.0
menuWeight: 10
beta: true
excerpt: View release-specific information for Dispatch 1.3.0 
---

# Release Notes for Dispatch 1.3.0

[button color="purple" href="https://support.d2iq.com/s/entitlement-based-product-downloads"]Download Dispatch [/button]

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and signed on to the support portal to download this product. For new customers, contact your sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download Dispatch.</p>

## v1.3.0 Beta 2 - Released September 9, 2020
Document Modified Date: Released September 9, 2020

This document describes the new features, caveats, and resolved issues of D2iQ Dispatch. 
__**This is a Beta release & for Evaluation only and NOT for Production use.**__

### Disclaimer

* Release notes are sometimes updated with new information about restrictions and caveats. Please see [https://docs.d2iq.com/ksphere/dispatch/](https://docs.d2iq.com/ksphere/dispatch/) for the latest version of the D2iQ Dispatch release-notes.

### Installation and Upgrades

To install Dispatch, follow one of the two options below:
- **Installation**: Run `konvoy init` and then update the `configVersion` for `https://github.com/mesosphere/kubeaddons-dispatch` in your `cluster.yaml`. 

- **Upgrade**: Update the `configVersion` for `https://github.com/mesosphere/kubeaddons-dispatch` in your `cluster.yaml` .

1. Update the following *example* snippet from `cluster.yaml` to upgrade Dispatch 1.2.x to 1.3.0-beta1.

```yaml
  - configRepository: https://github.com/mesosphere/kubeaddons-dispatch
    configVersion: stable-1.16-1.2.0
    addonsList:
    - name: dispatch
      enabled: false
```

It should read:

```yaml
  - configRepository: https://github.com/mesosphere/kubeaddons-dispatch
    configVersion: stable-1.16-1.3.0-beta1
    addonsList:
    - name: dispatch
      enabled: true
```

2. Apply the configuration to install/upgrade Dispatch to the Konvoy cluster.
```
konvoy up
```

3. Verify that the installation/upgrade is successful.
```
helm test dispatch-kubeaddons
```
### Frontend Languages

| Frontend Language | Version |
| ------------------ | ------- |
|Starlark | 0.8-beta1 |
|CUE | 0.6-beta1 |
|YAML | 0.5-beta1 |
|JSON | 0.5-beta1 |

### Improvements since v1.2.0

- Upgraded Tekton to v0.14.2 and Tekton dashboard to v0.8.0.
- Upgraded ArgoCD to v1.6.2. 
- Updated UI to support Build view including:
  - Viewing logs, artifacts and Dispatchfile.
  - Support for stopping and rerunning Pipelines.
  - Support for incremental build numbers of Pipelineruns.
- Support for label matching for pull request actions in Dispatchfile.
- Added `timeout` field to Repository objects. Allows overriding of the default PipelineRun timeout duration for a Repository.
- Added a new `--timeout` flag to the dispatch CI repository create command that takes a [Go duration string](https://golang.org/pkg/time/#ParseDuration) (e.g., `2h30m45s`). This sets the PipelineRun timeout for the Repository being created.
- Added a new `timeout` field to the task type in the Dispatchfile. This overrides the PipelineRun timeout for the task. If the PipelineRun times out before the task is completed, the task will continue executing until it reaches its own timeout, but the PipelineRun as a whole will be marked as failed due to timeout.
- Added helm chart option `tekton.configs.defaultPodTemplate` to support node pool selections and other pod settings for all Dispatch tasks. See documentation of Tekton pod templates [Tekton pod templates](https://tekton.dev/docs/pipelines/podtemplates/) for more information.
- Automatically detect the Dispatch installation namespace by checking the labels on the namespace specified by `--namespace`.
- Print warning when the CLI and server have different versions.
- Added `--git-server` to `dispatch ci repository create` in order to select which of the `--service-account`'s SCM secrets to use.
- Allow multiple dispatch login commands to be executed for the same service account.
- Trigger pipelines with GitHub release events.
- Support tolerations via configuring global and per-repository pod template.
- Support tolerations on Dispatch components.
- Support automatic cancellation of pipelineruns superseded by new pipelineruns.

### Caveats

*Breaking Changes*

- The helm chart option `eventSink.defaultStepResources` is renamed to `dispatch.defaultStepResources`.
- The `--dispatch-namespace` CLI option is now deprecated, as its value is automatically determined.
- The `--scm-secret` CLI option is now deprecated. Use `--service-account` instead, and the SCM secret will be automatically determined.
- The `--dispatchfile-repository-scm-secret` CLI option is deprecated. The SCM secret for accessing the Dispatchfile is determined from the `--service-account` and the `--dispatchfile-repository`. 
- The `--secret` option has been removed from the dispatch login commands, use `--service-account` instead. 

### Resolved Issues

- Allow login to github after login to docker. (COPS-6292)
- Fixed a bug where the garbage collector only reclaimed resources in the last watched namespace.
- Fixed garbage collector to only skip old objects with dispatch catalog labels if they are Pipeline or Task objects.
- Fixed a bug where created artifacts were not collected after task failure.
- Fixed Dispatchfile YAML parser to handle quoted "on" keyword correctly.
- Fixed the pipeline generation to handle large webhook event payloads.