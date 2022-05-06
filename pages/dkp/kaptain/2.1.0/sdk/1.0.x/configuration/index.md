---
layout: layout.pug
navigationTitle: Environment Variables
title: Environment Variables
beta: false
menuWeight: 1
---

Various aspects of the SDK can be configured via the following environment variables.

### Logging configuration
- **KAPTAIN_SDK_VERBOSE**: will set the output to show all of the pod logs and any event related to Job, Pods, Secrets, and
    Service Accounts.
- **KAPTAIN_SDK_LOG_TIMEFORMAT**: a string used to change the format of the log date time from the default "%Y-%m-%d
    %H:%M:%S,%f" following strftime format.
- **KAPTAIN_SDK_DEBUG**: will set the logging level to DEBUG for Kaptain related logging.

A `"true"` value is any of `"true"`, `"yes"`, `"y"`, or `"1"`; anything else is interpreted as `"false"`. Changing the environment
variables `KAPTAIN_SDK_LOG_TIMEFORMAT` and `KAPTAIN_SDK_DEBUG` only take effect if used at the beginning of the script or
Notebook.

You can also change these environment variables from Python/Jupyter using the variables in `kaptain.envs`. Changing them this way
will make the changes take effect immediately. For example:

```python
import kaptain.envs as envs   # (showing default values)

envs.DEBUG = False
envs.VERBOSE = False
envs.LOG_TIMEFORMAT = "%Y/%m/%d %H:%M:%S,%f"
```
### Image build configuration

Use the following environment variables to set resources required for image building jobs: 

- **DOCKER_BUILDER_CPU_LIMIT**: set `resources.cpu` limit for image building job (default: `1`).
- **DOCKER_BUILDER_MEM_LIMIT**: set `resources.memory` limit for image building job (default: `1G`).
- **DOCKER_BUILDER_CPU_REQUEST**: set `resources.cpu` request for image building job (default: `500m`)
- **DOCKER_BUILDER_MEM_REQUEST**: set `resources.memory` request for image building job (default: `500M`)

### Cleanup

Use the following environment variables to configure automatic cleanup of the resources created by Kaptain SDK at every step of the model lifecycle.

- **KAPTAIN_SDK_DELETE_EXPERIMENT**: If set to "True", delete the `Experiment` resource upon the completion of the tuning step. **Note**: once the experiment is deleted, it will not be available for viewing in the Katib UI.
- **KAPTAIN_SDK_TTL_SECONDS_AFTER_FINISHED**: Number of seconds after which a completed training job gets automatically deleted.
- **KAPTAIN_SDK_FORCE_CLEANUP**: If set to "True", delete completed training jobs automatically ignoring the TTL.
