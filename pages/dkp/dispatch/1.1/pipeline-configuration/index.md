---
layout: layout.pug
navigationTitle:  Pipeline Configuration
title: Dispatch Pipeline Configuration 
menuWeight: 70
beta: false
excerpt: Configure Build and Test pipelines to automate the development process using declarative languages.
---

In Dispatch, CI pipelines are configured using a `Dispatchfile`. The `Dispatchfile` describes:
* all tasks that run as a part of a pipeline
* rules for triggering tasks in a pipeline
* resources produced and consumed as a part of the pipeline (images, git repositories, S3 artifacts, etc).


# Configuration Format

Dispatch supports several different configuration formats for you to choose from. Choose the format that you are most comfortable with.

By default, the `cue` configuration format is used. However, at the top of your `Dispatchfile`, you can declare the `Dispatchfile` format using a shebang syntax:

| Frontend |            Current Version               |
| -------- | ---------------------------------------- |
| starlark | `#!mesosphere/dispatch-starlark:v0.5`    |
| cue      | `#!mesosphere/dispatch-cue:v0.2`  |
| json     | `#!mesosphere/dispatch-json:v0.2` |
| yaml     | `#!mesosphere/dispatch-yaml:v0.2` |

<details>
<summary><b>JSON</b></summary>

<p>

To set your `Dispatchfile` format as JSON, set the first line of your `Dispatchfile` to:

```sh
#!mesosphere/dispatch-json:v0.2
```

JSON is the simplest (but typically most verbose) supported format: when writing JSON syntax, you are writing the Dispatch data structures directly. Refer the [configuration reference](../references/pipeline-config-ref).

As an example, we convert the example from [the repository set up guide](../repo-setup/) to JSON:

```json
#!mesosphere/dispatch-json:v0.2

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

```yaml
#!mesosphere/dispatch-yaml:v0.2

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
#!mesosphere/dispatch-cue:v0.2

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

```python
#!mesosphere/dispatch-starlark:v0.5

load("github.com/mesosphere/dispatch-catalog/starlark/stable/pipeline@0.0.4", "gitResource", "pullRequest", "push")

gitResource("src-git")

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

See [the starlark reference](../references/starlark-reference/) for an overview of the Dispatch standard library methods and data types as well as the [official language reference](https://docs.bazel.build/versions/master/skylark/language.html).

</p>
</details>

To see the rendered output:

```sh
dispatch ci run remote --service-account team-1 -o yaml --dry-run
```

For more information on pipeline configuration, see the [Pipeline Configuration Reference](../references/pipeline-config-ref/) page.
See the list of tutorials [tutorials](./tutorials/) for some commonly used scenarios.
