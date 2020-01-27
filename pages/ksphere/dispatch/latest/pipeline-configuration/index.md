---
layout: layout.pug
navigationTitle:  Pipeline Configuration
title: Dispatch Pipeline Configuration Reference
menuWeight: 40
beta: true
excerpt: Configure Build and Test pipelines to automate the development process using declarative languages.
---

# Pipeline Configuration Reference

In Dispatch, CI pipelines are configured using a `Dispatchfile`. The `Dispatchfile` describes 
* all tasks that run as a part of a pipeline
* rules for triggering tasks in a pipeline
* resources produced and consumed as a part of the pipeline (images, git repositories, S3 artifacts, etc).

## Configuration Format

Dispatch supports several different configuration formats for you to choose from. Choose the format that you are most comfortable with.

By default, the `cue` configuration format is used. However, at the top of your `Dispatchfile`, you can declare the `Dispatchfile` format using a shebang syntax (e.g, `#!starlark`, `#!cue`, or `#!json`).

<p class="message--note"><strong>NOTE: </strong>The shebang syntax is just for alpha; during beta we will have a better way to define this.</p>

<details>
<summary><b>JSON</b></summary>

<p>

To set your `Dispatchfile` format as JSON, set the first line of your `Dispatchfile` to:

```sh
#!json
```

JSON is the simplest (but typically most verbose) supported format: when writing JSON syntax, you are writing the Dispatch data structures directly and can reference the [configuration reference](#Reference) below.

As an example, we convert the example from [the repository set up guide](../repo-setup/) to JSON:

```
#!json

{
    "resource": {
        "src-git": {
            "type": "git",
            "param": {
                "url": "$(context.git.url)",
                "revision": "$(context.git.commit)"
            }
        }
    },
    "task": {
        "test": {
            "inputs": [
                "src-git"
            ],
            "steps": [
                {
                    "name": "test",
                    "image": "golang:1.13.0-buster",
                    "command": [
                        "go",
                        "test",
                        "./..."
                    ],
                    "workingDir": "/workspace/src-git"
                }
            ]
        }
    },
    "actions": [
        {
            "tasks": [
                "test"
            ],
            "on": {
                "push": {
                    "branches": [
                        "master"
                    ]
                }
            }
        },
        {
            "tasks": [
                "test"
            ],
            "on": {
                "pull_request": {
                    "chatops": [
                        "test"
                    ]
                }
            }
        }
    ]
}
```
</p>
</details>

<details>
<summary><b>YAML</b></summary>

<p>

YAML is another popular configuration format supported to write your Dispatch pipeline data structure. Here is an example:

```sh
#!yaml

resource:
  src-git:
    type: git
    param:
      url: "$(context.git.url)"
      revision: "$(context.git.commit)"
task:
  test:
    inputs: ["src-git"]
    steps:
    - name: test
      image: golang:1.13.0-buster
      command: ["go", "test", "./..."]
      workingDir: "/workspace/src-git"
actions:
- tasks: ["test"]
  on:
    push:
      branches:
      - master
- tasks: ["test"]
  on:
    pull_request:
      chatops:
      - test
```
</p>
</details>

<details>
<summary><b>CUE</b></summary>

<p>

[CUE](https://cue.googlesource.com/cue/) is a language developed by Google to make it easy to define and validate types and constraints for data, making it possible to re-use and simplify configuration. CUE is a superset of JSON. See the [official CUE tutorial](https://cue.googlesource.com/cue/+/HEAD/doc/tutorial/basics/Readme.md) for a gentle introduction to cue.

The following example is a simple restructuring of the JSON example taking advantage of CUE's JSON sugar syntax to improve readability:

```json
#!cue

resource "src-git": {
  type: "git"
  param url: "$(context.git.url)"
  param revision: "$(context.git.commit)"
}

task "test": {
  inputs: ["src-git"]

  steps: [
    {
      name: "test"
      image: "golang:1.13.0-buster"
      command: [ "go", "test", "./..." ]
      workingDir: "/workspace/src-git"
    }
  ]
}

actions: [
  {
    tasks: ["test"]
    on push: {
      branches: ["master"]
    }
  },
  {
    tasks: ["test"]
    on pull_request: {
      chatops: ["test"]
    }
  }
]
```
</p>
</details>

<details>
<summary><b>Starlark</b></summary>

<p>

[Starlark](https://github.com/bazelbuild/starlark) is a configuration language originally developed for use in the Bazel build tool which is based on Python. Using Starlark, developers can take advantage of language features they're used to in regular development (loops, user defined functions, conditionals, modules, testing, editor integrations, etc). Additionally, the Dispatch project provides a basic standard library that makes it simpler to define pipelines.

```sh
#!starlark

gitResource("src-git", url="$(context.git.url)", revision="$(context.git.commit)")

task("test", inputs = ["src-git"], steps = [k8s.corev1.Container(
    name = "test",
    image = "golang:1.13.0-buster",
    command = [ "go", "test", "./..." ],
    workingDir = "/workspace/src-git",
    resources = k8s.corev1.ResourceRequirements(
        limits = {
            "cpu": k8s.resource_quantity("1000m"),
            "memory": k8s.resource_quantity("8Gi")
        }
    )
)])

action(tasks = ["test"], on = push(branches = ["master"]))
action(tasks = ["test"], on = pullRequest(chatops = ["test"]))
```

Dispatch datatypes can be referenced with the `p` package, e.g., `p.Pipeline()`, `p.Task()`. Kubernetes datatypes can be referenced with the `k8s` package, e.g., `k8s.corev1.Container()`, `k8s.metav1.ObjectMeta()`.

See [the starlark reference](../starlark-reference/) for an overview of the Dispatch standard library methods and data types as well as the [official language reference](https://docs.bazel.build/versions/master/skylark/language.html).

</p>
</details>

To see the rendered output:

```sh
dispatch build tekton -o yaml --dry-run
```

## Reference

### Pipeline

The `Pipeline` object is the top level object in a `Dispatchfile`.

|  Field |    Type    | Description | Required? | Default |
| ------ | ---------- | ----------- | --------- | ------- |
| `resource` | Object with string keys and [Resource](#Resources) values | Resources to make available for inclusion in tasks | no | {} |
| `task`     | Object with string keys and [Task](#Tasks) values | Tasks to define as a part of the pipeline | yes |   |
| `actions`  | [Action](#Actions) array | Actions define which tasks to run for which events | no |   |

### Tasks

Tasks define a set of steps (containers) to run sequentially within a pod; these do the work of the pipeline.

|  Field |    Type    | Description | Required? | Default |
| ------- | ---------- | ----------- | --------- | ------- |
| `inputs`  | String array | Resources that should be included in the task | no | [] |
| `outputs` | String array | Resources that the task outputs to | no | [] |
| `deps`    | String array | Task names that must complete before this task is run | no | [] |
| `steps`   | [Container](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.16/#container-v1-core) array | Containers to run as a part of the task, the containers are run sequentially in the order they are defined | yes | - |
| `volumes` | [Volume](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.16/#volume-v1-core) array | Volumes to make available to the steps | no | [] |

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
| `tasks`  | String array | The tasks to trigger when this action is activated | yes | - |
| `on`     | [Condition](#Conditions) | The conditions under which the action is activated | yes | - |

#### Conditions

A condition specifies the requirements for an action to be considered active. Exactly one of `push`, `tag` or `pull_request` must be set.

|  Field |    Type    | Description | Required? | Default |
| ------ | ---------- | ----------- | --------- | ------- |
| `push`  | [PushCondition](#PushConditions) | Conditions for pushes to branches | no | - |
| `tag`  | [TagCondition](#TagConditions) | Conditions for tags pushed to the repository | no | - |
| `pull_request` | [PullRequestCondition](#PullRequestConditions) | Conditions for pull request events (comments, pushes) | no | - |

##### PushConditions

A push condition is activated when commits are pushed to any matched branch with any matched file changes.

|  Field |    Type    | Description | Required? | Default |
| ------ | ---------- | ----------- | --------- | ------- |
| `branches`  | String array | Branches to trigger on | no | [] |
| `paths` | String array | Paths in repository to trigger on | no | [] |

The current behavior of push conditions is:

1. If no branches or paths are specified, then a push to any branch will trigger the condition.
2. If branches are specified, then it will only trigger on any matched branch. If paths are specified, it will only trigger if any changed file matches the paths.
3. You can specify positive glob patterns (e.g., "release/\*") or negative glob patterns (e.g., "!debug/\*")  to match a branch or path. A branch or    path matches the globs if it matches at least one positive glob if there is any, and does not match any negative glob.

##### TagConditions

A tag condition is activated when a tag is pushed to the repository.

|  Field |    Type    | Description | Required? | Default |
| ------ | ---------- | ----------- | --------- | ------- |
| `names` | String array | Tag names to trigger on | no | [] |

The current behavior of tag conditions is:

1. If no names are specified, then any tag pushed to the repository will trigger the condition.
2. If names are specified, then it will only trigger on specified tag names.
3. You can specify positive glob patterns (e.g., "release/\*") or negative glob patterns (e.g., "!debug/\*")  to match a tag. A tag matches the globs
   if it matches at least one positive glob if there is any, and does not match any negative glob.

##### PullRequestConditions

A pull request condition is activated when a comment or push is made on a pull request.

|  Field |    Type    | Description | Required? | Default |
| ------ | ---------- | ----------- | --------- | ------- |
| `branches` | String array | Matches pull requests whose merge target is a branch in the branches list | no | [] |
| `paths` | String array | Changed paths to trigger on | no | [] |
| `chatops`  | String array | Matches pull request comments that match certain patterns | no | [] |

The current behavior of pull request conditions is:

1. If no branches and no chatops are specified, then the action will trigger on any pull request push.
2. If branches are specified, then it will trigger when a pull request is made where the merge target is in the list of branches. If paths are
   specified, it will only trigger if any changed file matches the paths.
3. If chatops are specified, then it will only trigger when a comment starting with a slash (`/`) is made to a pull request, and the word after
   the slash is in the list of chatops. Chatops can be specified in conjunction with branches and/or paths.

### Context variables

Dispatch adds a number of context variables to your build. These variables are replaced at runtime after parsing the configuration file.

* `$(context.build.name)`: the most relevant identifier for the build - either branch, tag, pull request, or the user that triggered it.
* `$(context.git.url)`: the URL to the git repository to clone.
* `$(context.git.commit)`: the git commit identifier to clone.
* `$(context.git.branch)`: the git branch the pipeline was triggered for.
* `$(context.git.tag)`: the git tag (if any) the pipeline was triggered for.
* `$(context.chatop.command)`: the ChatOp command that triggered the pipeline.
