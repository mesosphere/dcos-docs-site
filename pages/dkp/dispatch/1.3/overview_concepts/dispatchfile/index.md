---
layout: layout.pug
navigationTitle:  Dispatchfile
title: Dispatchfile
menuWeight: 10
beta: false
excerpt: Declaratively define a CI pipeline in Dispatch.
---

Automating the processing of building, testing and delivering an application to a registry uses a `Dispatchfile` to define how the Continuous Integration (CI) pipeline will execute and when it will be executed.  It is declarative in nature, and can be written in Starlark, CUE, JSON or YAML.  

A Dispatchfile has three parts:

* `resource`: resources define git repositories, images, and other artifacts that are consumed or produced by a task.
* `task`: defines a set of steps (containers) to run, these do the work of the pipeline.
* `actions`: defines which tasks to run for which events.
  
In the examples below, written in JSON, YAML, CUE and Starlark:

* The `src-git` resource clones the current repository into each task that specifies `src-git` in its `inputs`.
* The `test` task runs a step that runs all defined Go unit tests.
* There are two `actions` defined:
  * One that runs the `test` task on any push to the `master` branch.
  * One that runs the `test` task on pushes to pull requests or any comments in a pull request that start with `/test`.

<details>
<summary><b>JSON</b></summary>

<p>

To set your `Dispatchfile` format as JSON, set the first line of your `Dispatchfile` to:

```sh
#!mesosphere/dispatch-json:v0.2
```

JSON is the simplest (but typically most verbose) supported format: when writing JSON syntax, you are writing the Dispatch data structures directly. Refer to the [configuration reference](../../references/pipeline-config-ref/).

As an example, we convert the example from [the repository set up guide](../../tutorials/ci_tutorials/repo-setup/) to JSON:

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
                    "image": "golang:1.15.7-buster",
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
      image: golang:1.15.7-buster
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

The following example is a simple restructuring of the JSON example taking advantage of CUE's JSON syntactic sugar syntax to improve readability:

```json
#!mesosphere/dispatch-cue:v0.3

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
      image: "golang:1.15.7-buster"
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
    image = "golang:1.15.7-buster",
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

See the [starlark reference](../../references/starlark-reference/) for an overview of the Dispatch standard library methods and data types as well as the [official language reference](https://docs.bazel.build/versions/master/skylark/language.html).

</p>
</details>

To see the rendered output:

```sh
dispatch ci run remote --service-account team-1 -o yaml --dry-run
```

For more information on pipeline configuration, see the [Pipeline Configuration Reference](../../references/pipeline-config-ref/) page.
See the list of tutorials [tutorials](../../tutorials/) for some commonly used scenarios.

