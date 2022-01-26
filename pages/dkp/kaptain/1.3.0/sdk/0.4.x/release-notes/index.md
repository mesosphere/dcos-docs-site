---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
beta: false
menuWeight: 0
---

Kaptain SDK 0.4.0 Release Notes

### New Features
* PyTorch models can now be served from the SDK using TorchServe
* Garbage collection support:
    * All resources created during training, tuning, and deployment are labeled that they are managed by Kaptain, and for which model-id they were created.
    * The `kaptain.utils` object has been added with methods to clean up unused resources: `clean_all`, `delete_experiments`
    * The new `kaptain.utils` object also has methods such as `diagnose` that can be used to list resources managed by Kaptain
    * Resource cleanup on cell interruption
* Utilities for ML workloads listing and cleanup:
  * Generic resource utilities: `list_all_resources, delete_resource`
* Kaptain uses the Kubeflow Training SDK and now uses the `V1beta1` KFServing API (upgraded from `V1alpha2`)
* `ModelExportUtil().upload_model` gains an additional parameter: `extra_files`
* `kaptain.env` now contains helpers for docker builder resource configuration env vars
* The Kaniko Pod is now cleaned up immediately after the Docker build completion
* `model.tune()` gains an additional parameter: `delete_experiment`
* `model.requirements` is added to explicitly specify `requirements.txt` for models
* `model.train` gains a new parameter `force_cleanup`, which causes the model to be cleaned up after a successful training
* `model.train` and `model.tune` now have a parameter to control the TTL for training jobs

### Improvements
* Fix an issue that prevented pytorch training single-worker jobs from running
* Stringify model hyper-parameters and training function arguments
