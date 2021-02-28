---
navigationTitle: 1.2.0
title: Release Notes 1.2.0
menuWeight: 10
excerpt: View release-specific information for Dispatch 1.2.0
---

# Release Notes

[button color="purple" href="https://support.d2iq.com/s/entitlement-based-product-downloads"]Download Dispatch [/button]

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and signed on to the support portal to download this product. For new customers, contact your sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download Dispatch.</p>

## v1.2.0 - Released June 22, 2020
Document Modified Date: June 30, 2020

This document describes the new features, caveats, and resolved issues of D2iQ Dispatch.

### Disclaimer

* Release notes are sometimes updated with new information about restrictions and caveats. Please see [https://docs.d2iq.com/dkp/dispatch/](/dkp/dispatch/) for the latest version of the D2iQ Dispatch release-notes.

### Installation and Upgrades

To install Dispatch, follow one of the two options below:
- **Installation**: Run `konvoy init` and then update the `configVersion` for `https://github.com/mesosphere/kubeaddons-dispatch` in your `cluster.yaml`. 

- **Upgrade**: Update the `configVersion` for `https://github.com/mesosphere/kubeaddons-dispatch` in your `cluster.yaml` .

1. Update the following *example* snippet from `cluster.yaml` to upgrade from Dispatch v1.1.0 to 1.2.0.

```yaml
  - configRepository: https://github.com/mesosphere/kubeaddons-dispatch
    configVersion: stable-1.16-1.1.0
    addonsList:
    - name: dispatch
      enabled: false
```

It should read:

```yaml
  - configRepository: https://github.com/mesosphere/kubeaddons-dispatch
    configVersion: stable-1.16-1.2.0
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
|Starlark | 0.6 |
|CUE | 0.4 |
|YAML | 0.3 |
|JSON | 0.3 |

### Improvements since v1.1.0

* Bitbucket Server and Cloud are now supported for code repositories.
* Added support for scheduled builds using cron.
* Dispatch pipelines can now leverage Buildkit to create images.
* GitOps repositories can now be configured to auto-merge pull-requests to automatically trigger deployment.
* Added support for the local runner to test unstaged (default behavior) AND untracked (using `--untracked flag`) changes in user's working directory.
* Enabled garbage collection of Task and Pipeline resources. Previously only PipelineRun, TaskRun, and PipelineResource objects were garbage collected.
* The `dispatch login docker` command now accepts `--username` and `--password` flags to create basic-auth secrets to store docker credentials.
* The report-status task has been extracted into a controller.
* Added new metrics to distinguish user pipelines from system ones like `generate-pipeline`.
* Added support for chatops arguments as `$(context.chatop.args)` in Dispatchfile.
* Added support for matching source and target branches for pull requests in Dispatchfile.
* Upgraded ArgoCD and ArgoCD CLI to v1.5.7.
* Added a tutorial for using upstream ArgoCD CLI with Dispatch.
* Added `dispatch gitops app wait` command to enable ArgoCD to wait for ongoing application sync operations to finish.
* Updated Dispatchfile frontend language Starlark to 0.6.
* Updated Dispatchfile frontend language CUE to 0.4.
* GUI now verifies repository secrets prior to saving them.
* EXPERIMENTAL Starlark standard libraries 0.0.6 released via the [Dispatch Catalog](https://github.com/mesosphere/dispatch-catalog).
* [COPS-6242] Add support for GitLab's nested project groups.
* [COPS-6242] The `update-gitops-repo` command got a new `-api-endpoint=` flag. It must be set to the SCM provider API endpoint URL if the gitops repository is in a nested GitLab project group.

### Caveats

*Breaking Changes*

* The `--docker-config-path` flag of CLI command `dispatch login docker` now creates one or more basic-auth secrets instead of dockerconfigjson secrets as earlier. This only affects workflow if these secrets are used outside of Tekton pipelines.
* The `--scm-provider`, `--scm-url`, `--scm-username`, and `--insecure-skip-tls-verify` flags of CLI command `dispatch ci run remote` have been removed.
* The `--secret` flag of CLI command `dispatch ci run local` has been removed.

*Deprecations*

* The `--git-prefix` flag of CLI commands `dispatch login github`, `dispatch login gitlab` and `dispatch login git` is deprecated and replaced by `--git-server`.
* The `--secret` flag of CLI command `dispatch ci run remote` is deprecated and replaced by `--scm-secret`.
* The `branches` field of pull request conditions in Dispatchfile is deprecated and replaced by `targets`.

### Resolved Issues

* Fixed incorrect population of dashboard-url for generate-pipeline manifests.
* Fixed the report-status task to set --insecure-skip-tls-verify from environment.
* Protect artifacts from being overwritten by user defined tasks using internal (MinIO) storage.
* Ignore branch deletion events from GitHub.
* Bumped KIND version used by the local runner to 0.7.0. This fixes a bug where some older versions of KIND CLI were unable to delete the KIND clusters created by the local runner.
* Fixed PipelineValidationFailed error when some task result variables are not present in Dispatchfile.
