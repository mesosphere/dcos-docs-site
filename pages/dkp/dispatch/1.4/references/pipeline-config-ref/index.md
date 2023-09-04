---
layout: layout.pug
navigationTitle: Pipeline Configuration Reference
title: Dispatch Pipeline Configuration Reference
menuWeight: 90
beta: false
excerpt: Pipeline configuration reference
---


## Pipeline

The `Pipeline` object is the top-level object in a `Dispatchfile`.

|  Field |    Type    | Description | Required? | Default |
| ------ | ---------- | ----------- | --------- | ------- |
| `resource` | Object with string keys and [Resource](#resources) values | Resources to make available for inclusion in tasks | no | {} |
| `task`     | Object with string keys and [Task](#tasks) values | Tasks to define as a part of the pipeline | yes |   |
| `actions`  | [Action](#actions) array | Actions define which tasks to run for which events | no |   |

### Tasks

Tasks define a set of steps (containers) to run sequentially within a pod; these do the work of the pipeline.

|  Field |    Type    | Description | Required? | Default |
| ------- | ---------- | ----------- | --------- | ------- |
| `inputs`  | String array | Resources or Task results that should be included in the task | no | [] |
| `outputs` | String array | Resources that the task outputs to | no | [] |
| `deps`    | String array | Task names that must complete before this task is run (DEPRECATED: use `inputs` instead) | no | [] |
| `steps`   | [Container](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.16/#container-v1-core) array | Containers to run as a part of the task, the containers are run sequentially in the order they are defined | yes | - |
| `volumes` | [Volume](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.16/#volume-v1-core) array | Volumes to make available to the steps | no | [] |
| `timeout` | String | The duration after which a task is considered timed out. See below. The format is that of the [Go `time` package's `ParseDuration` function](https://golang.org/pkg/time/#ParseDuration) | no | Parent PipelineRun timeout if that is set, otherwise the global timeout (typically 1h). |
| `metadata` | [Metadata](#metadata) | The metadata to add on to TaskRuns and Pods created for this Task | no | {} |

If the `timeout` field is set on a task, and then:

- the PipelineRun fails or times out before the task is scheduled, then the task will not be started.
- the PipelineRun times out after the task is started, but before it completes, then the task will continue executing until it succeeds, fails or exceeds its own `timeout` duration. In this scenario, the PipelineRun will still be marked as failed, due to timeout, even though all its tasks may have succeeded individually.

#### Input variables

Input variables can be accessed when listed in the `inputs` of a task. Two types of inputs are supported:

* If an input is a [resource](#resources), then its parameters can be accessed at `$(inputs.resources.NAME.PARAM)`, where `NAME` is the resource name and `PARAM` is the parameter name.
* If an input is a [task](#tasks), then its results can be accessed at `$(inputs.tasks.TASKNAME.STEPNAME)`, where `TASKNAME` is the name of the task and `STEPNAME` is the name of the step in the task. The variable will be equal to the standard output of the referenced step.

#### Output variables

Output variables function like input variables, except they are for `outputs`, rather than `inputs`. Only [resources](#resources) are supported as outputs. An output's parameters can be accessed at `$(outputs.resources.NAME.PARAM)`, where `NAME` is the resource name and `PARAM` is the parameter name.

#### Metadata

A metadata object contains labels and annotations:

| `labels` | String map | Labels to add | no | {} |
| `annotations` | String map | Annotations to add | no | {} |

### Resources

Resources define Git repositories, images, and other artifacts that are consumed or produced by a task. A resource can only be output by at most one task. Any task taking the resource as input will be run after the output task.

|  Field |    Type    | Description | Required? | Default |
| ------ | ---------- | ----------- | --------- | ------- |
| `type`   | String (one of `git`, `image`, `storage`) | The resource type |    yes    |         |
| `params` | Object     | The resource's parameters |    no     |    {}   |
| `secrets` | Object with string keys and a [SecretKeySelector](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.16/#secretkeyselector-v1-core) as value | Secrets to add on to the resource, the key should be the secret's environment variable (either `GOOGLE_APPLICATION_CREDENTIALS` or `BOTO_CONFIG`) | no |   |

#### Types of Resources

In theory, all [resource types](https://github.com/tektoncd/pipeline/blob/master/docs/resources.md) supported by Tekton are supported by Dispatch; however, Git, Image, and Storage resources are the most frequently used resource types.

##### Git

The Git resource is used as an input to tasks and clones a Git repository into the task.

Parameters:

| Field | Description | Required? | Default |
| ---- | ----------- | ------- | --------- |
| `url`  | The Git clone URL to use | yes | - |
| `revision` | The Git branch, tag, or commit reference | yes | - |

##### Image

An Image resource refers to an image that has been or should be built by a task. When used as a task output, the Image resource tells the task where to push the built image to. When used as a task input, the Image resource references the image URL and digest of a previously built image.

Parameters:

| Field | Description | Required? | Default |
| ---- | ----------- | ------- | --------- |
| `url`  | The image URL and tag | yes | - |
| `digest` | The SHA256 digest of the built image | yes | - |

##### Storage

A Storage resource is used for storing built artifacts to pass between built tasks. For example, a build task may build a Go binary and another task may use the binary as a part of a Docker build. Artifacts can be stored in any S3-compatible API, however, a local Minio instance is provisioned by default with a bucket called `artifacts`.

Parameters:

| Field | Description | Required? | Default |
| ---- | ----------- | ------- | --------- |
| `type` | Must be set to `gcs` | yes | - |
| `location` | The S3 bucket to store artifacts in, typically `s3://artifacts` | yes | - |

### Actions

Actions define which tasks to run for which events.

|  Field |    Type    | Description | Required? | Default |
| ------ | ---------- | ----------- | --------- | ------- |
| `name`   | String | The name of the action. Required only if the action has a cron condition | no | - |
| `tasks`  | String array | The tasks to trigger when this action is activated | yes | - |
| `on`     | [Condition](#conditions) | The conditions under which the action is activated | yes | - |

#### Conditions

A condition specifies the requirements for an action to be considered active. Exactly one of `git`, `cron`, or `image` must be set. Fields `push`, `tag`, `pull_request`, `release` are also supported but are DEPRECATED.

|  Field |    Type    | Description | Required? | Default |
| ------ | ---------- | ----------- | --------- | ------- |
| `git`  | [GitCondition](#gitconditions) | Conditions based on git events | no | - |
| `cron`  | [CronCondition](#cronconditions) | Conditions based on cron events | no | - |
| `image`  | [ImageCondition](#imageconditions) | Conditions based on image (docker registry) events | no | - |
| `push` | [GitPushCondition](#gitpushconditions) | Conditions for pushes to branches (DEPRECATED : Use `git` instead) | no | - |
| `tag`  | [GitTagCondition](#tagconditions) | Conditions for tags pushed to the repository (DEPRECATED : Use `git` instead) | no | - |
| `pull_request` | [GitPullRequestCondition](#gitpullrequestconditions) | Conditions for pull request events (comments, pushes) (DEPRECATED : Use `git` instead) | no | - |
| `release` | [GitReleaseCondition](#gitreleaseconditions) | Conditions for release event based triggers (DEPRECATED : Use `git` instead) | no | - |

##### GitConditions

Describes various kinds of conditions that are activated by events from scm repositories. Only one of the following must be set. 

|  Field |    Type    | Description | Required? | Default |
| ------ | ---------- | ----------- | --------- | ------- |
| `push` | [GitPushCondition](#gitpushconditions) | Conditions for pushes to branches| no | - |
| `tag`  | [GitTagCondition](#tagconditions) | Conditions for tags pushed to the repository | no | - |
| `pull_request` | [GitPullRequestCondition](#gitpullrequestconditions) | Conditions for pull request events (comments, pushes) | no | - |
| `release` | [GitReleaseCondition](#gitreleaseconditions) | Conditions for release event based triggers | no | - |

###### PushConditions

A push condition is activated when commits are pushed to any matched branch with any matched file changes.

|  Field |    Type    | Description | Required? | Default |
| ------ | ---------- | ----------- | --------- | ------- |
| `branches`  | String array | Branches to trigger on | no | [] |
| `paths` | String array | Paths in repository to trigger on | no | [] |

The current behavior of push conditions is:

1. If no branches or paths are specified, then a push to any branch will trigger the condition.
2. If branches are specified, then it will only trigger on any matched branch. If paths are specified, it will only trigger if any changed file matches the paths.
3. You can specify positive glob patterns (e.g., "release/\*") or negative glob patterns (e.g., "!debug/\*")  to match a branch or path. A branch or    path matches the globs if it matches at least one positive glob if there is any, and does not match any negative glob.

###### TagConditions

A tag condition is activated when a tag is pushed to the repository.

|  Field |    Type    | Description | Required? | Default |
| ------ | ---------- | ----------- | --------- | ------- |
| `names` | String array | Tag names to trigger on | no | [] |

The current behavior of tag conditions is:

1. If no names are specified, then any tag pushed to the repository will trigger the condition.
2. If names are specified, then it will only trigger on specified tag names.
3. You can specify positive glob patterns (e.g., "release/\*") or negative glob patterns (e.g., "!debug/\*")  to match a tag. A tag matches the globs
   if it matches at least one positive glob if there is any, and does not match any negative glob.

###### PullRequestConditions

A pull request condition is activated when a comment or push is made on a pull request.

|  Field |    Type    | Description | Required? | Default |
| ------ | ---------- | ----------- | --------- | ------- |
| `paths` | String array | Changed paths to trigger on | no | [] |
| `chatops`  | String array | Matches pull request comments that match certain patterns | no | [] |
| `sources` | String array | Matches pull requests whose source branch is in the branches list | no | [] |
| `targets` | String array | Matches pull requests whose merge target is in the branches list | no | [] |
| `branches` | String array | Matches pull requests whose merge target is in the branches list (DEPRECATED: use `targets` instead) | no | [] |
| `labels` | String array | Matches pull request labels | no | [] |

The current behavior of pull request conditions is:

1. If no branches and no chatops are specified, then the action will trigger on any pull request push.
2. If branches are specified, then it will trigger when a pull request is made where the merge target is in the list of branches. If paths are
   specified, it will only trigger if any changed file matches the paths.
3. If chatops are specified, then it will only trigger when a comment starting with a slash (`/`) is made to a pull request, and the word after
   the slash is in the list of chatops. Chatops can be specified in conjunction with branches and/or paths.
4. All the labels need to be matched. Label matching is not regex based and supports exact string matching only except for negative matching (by using `!` prefix).

###### GitReleaseConditions

A release condition is activated when a release is published in the repository. Currently, this is only supported for GitHub repositories.

|  Field |    Type    | Description | Required? | Default |
| ------ | ---------- | ----------- | --------- | ------- |
| `tags` | String array | Release tags to trigger on | no | [] |

The current behavior of tag conditions is:

1. If no tag is specified, then any release published in the repository will trigger the condition.
2. If tags are specified, then it will only trigger on specified tags.
3. You can specify positive glob patterns (e.g., "release/\*") or negative glob patterns (e.g., "!debug/\*")  to match a tag. A tag matches the globs
   if it matches at least one positive glob if there is any, and does not match any negative glob.

##### CronConditions

A cron condition is activated when the schedule embedded is activated. Unlike other conditions, CronConditions are only activated from the default revision (specified during repository creation) of Dispatchfile.

|  Field |    Type    | Description | Required? | Default |
| ------ | ---------- | ----------- | --------- | ------- |
| `schedule` | String | Specify the cron schedule to activate the action. Follows standard [cron syntax](https://www.man7.org/linux/man-pages/man5/crontab.5.html) | yes | - |
| `git` | String | Specify the git based cron condition | no | - |
| `revision` | String | Revision of the repository to checkout to run the builds. Can point to a branch or tag. (DEPRECATED: Use `git` instead.) | no | `master` |

###### GitCronConfig

A GitCronConfig specifies the configuration (`revision` of the git repository to use for pipelines) to use when the associated cron condition is triggered. 

|  Field |    Type    | Description | Required? | Default |
| ------ | ---------- | ----------- | --------- | ------- |
| `revision` | String | Revision of the repository to checkout to run the builds. Can point to a branch or tag. | no | `master` |

##### ImageConditions

Describes various kinds of conditions that are activated by events from registries (Only docker registry is supported currently, more will be added soon). Only one of the following must be set.
   
|  Field |    Type    | Description | Required? | Default |
| ------ | ---------- | ----------- | --------- | ------- |
| `push` | [ImagePushCondition](#imagepushconditions) | Conditions for pushes to specific tags | no | - |

###### ImagePushConditions

A push condition is activated when an image is pushed in the repository. Currently, this is only supported for GitHub repositories.

|  Field |    Type    | Description | Required? | Default |
| ------ | ---------- | ----------- | --------- | ------- |
| `tags` | String array | Image tags to trigger on. Supports globbing and negative patterns. | no | [] |

### Context variables

Dispatch adds a number of context variables to your build. These variables are replaced at runtime after parsing the configuration file.

* `$(context.build.name)`: the most relevant identifier for the build - either branch, tag, pull request, or the user that triggered it.
* `$(context.git.url)`: the URL to the git repository to clone.
* `$(context.git.commit)`: the git commit identifier to clone.
* `$(context.git.branch)`: the git branch the pipeline was triggered for.
* `$(context.git.tag)`: the git tag (if any) the pipeline was triggered for.
* `$(context.chatop.command)`: the ChatOp command that triggered the pipeline.

### Generated Pipeline naming convention

A PipelineRun generated from SCM webhook / cron event has the following convention:

| <repository-name> | - | <build-number>| - |<build-name>| - |<commit-sha>| - |<random-suffix>|
|:---:|---|:---:|---|:---:|---|:---:|---|:---:|
| Name of the associated `Repository` object | - | Integer value pointing to the # of build in this repository. Can be reset. | - | Name of the build. Identical to `$(context.build.name)` | - | 7 character commit SHA | - | 5 character random suffix |

Total length of the PipelineRun name is capped at 64 characters out of which 5 characters are exclusively reserved for a random suffix. Extra characters are right trimmed.
