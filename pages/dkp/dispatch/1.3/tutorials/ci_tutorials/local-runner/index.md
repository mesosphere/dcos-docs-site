---
layout: layout.pug
title: Run pipelines locally
navigationTitle: Running pipelines locally
beta: false
menuWeight: 70
excerpt: This tutorial describes how to trigger pipelines locally
---

# Run a pipeline locally

This topic provides a step-by-step tutorial for running a Dispatchfile locally powered by [KIND](https://kind.sigs.k8s.io/). Local runner is a handy way to run a Dispatchfile on a git repository locally. The runners handles the end to end flow of a creating a kubernetes cluster (using KIND), installing Dispatch on to the cluster and then running the tests on the cluster. Optional flags exist to teardown the KIND cluster at the end of the run.   

# Prerequisites

- Some basic knowledge of git.
- Dispatch [CLI installed](../../../install/cli/) in the environment.
- Docker daemon running in the environment.

Use Dispatch CLI to run the Dispatchfile on a user's machine:

1. Run the `dispatch ci run local ...` command on a locally cloned repository.
1. Dispatch CLI starts a KIND cluster (or `--kind-context` can be used to specify the name of an existing KIND cluster to reuse).
1. Dispatch CLI installs Dispatch in the KIND cluster.
1. The local repository is mounted into the KIND cluster and is used for running Dispatchfile as tekton pipelineruns.

# Set up a repository

Do a `dispatch --version` and ensure that the CLI is at least 1.2.0 or above. Clone the repository of interest to a local working directory. For the purpose of this tutorial, we will use the hello world application described in [hello-world tutorial](../../../quickstart/hello-world-in-starlark/). Start with an empty directory and add the following files. Skip this step if you already have a repository with a valid `Dispatchfile`:

**Note:** Skip the following if you are cloning a git repository. 
Create an empty directory and add the following files:
```bash
cat <<EOF | > main.go
package main

import "fmt"

func main() {
	fmt.Printf("Hello %v!", World())
}

func World() string {
	return "World"
}
EOF
cat <<EOF | > main_test.go
package main

import (
	"testing"
)

func Test_World(t *testing.T) {
	actual := World()
	if actual != "World" {
		t.Fail()
	}
}
EOF
cat <<EOF | > Dispatchfile
#!mesosphere/dispatch-starlark:v0.5
# vi:syntax=python

load("github.com/mesosphere/dispatch-catalog/starlark/stable/pipeline@master", "git_resource", "git_checkout_dir")

git = git_resource("helloworld-git")

task("unit-test-simple",
    steps=[k8s.corev1.Container(
        name="unit-test-simple",
        image="golang:1.15.7-buster",
        workingDir=git_checkout_dir(git),
        command=["go", "test", "-v", "./..."])])
EOF
```

Ensure that the `go test` works on the code manually:

```bash
go test ./...
```

The results should look like the following:

```text
=== RUN   Test_World
--- PASS: Test_World (0.00s)
PASS
```

This is completely optional and is intended to get a feel of how the output would look. Next, lets make sure that the Dispatchfile renders correctly using the Dispatch CLI:

```bash
dispatch ci render -f Dispatchfile
```

The results should look like the following:

```bash
#!yaml
# vi:syntax=yaml

resource:
  helloworld-git:
    param:
      revision: $(context.git.commit)
      url: $(context.git.url)
    type: git
task:
  unit-test-simple:
    steps:
    - command:
      - go
      - test
      - ./...
      image: golang:1.15.7-buster
      name: unit-test-simple
      resources: {}
      workingDir: $(resources.inputs.helloworld-git.path)
```

Now that the source code is setup correctly, run the Dispatchfile locally.

# Run the tests with local files

The local runner can be used as follows to run the `unit-test-simple` task from Dispatchfile:

```bash
dispatch ci run local --task unit-test-simple
```

- This command assumes that the git repo (directory containing `.git` folder) exists in the current working directory. You can override it using the `--git-repo` flag.
- To retain the cluster (for debugging, reuse etc.,) pass `--skip-cluster-delete` flag.
- To install certain manifests into the cluster, the `--with-file` flag can be specified.
- Both `--task` flag and `--with-file` flag can be specified multiple number of times.

**Note** These commands take a while if you are running for the first time, but the subsequent runs are faster.

## Running tests on unstaged or untracked files

By default, the local runner consumes all the unstaged files (changes exist in your working directory, but Git hasn’t recorded them into its version history yet) in the given directory and runs the specified tasks on them.

To run the tests on a specific revision (e.g.: a specific branch or tag or event a commit SHA), the `--revision` flag can be specified. Example:

```bash
dispatch ci run local --task unit-test-simple --revision HEAD
``` 

Or, in order to run the tests on ALL local changes (untracked - file exists locally, but isn't a part of the Git repository) `--untracked` flag can be exercised:

```bash
dispatch ci run local --task unit-test-simple --untracked
```

This would run the tests on all local files including those that are not tracked by git.
