---
layout: layout.pug
title: Importing tasks into a Dispatchfile
navigationTitle: Import tasks into a Dispatchfile
beta: false
menuWeight: 30
excerpt: This tutorial describes how to import tasks from another Dispatchfile
---

# Prerequisites

1. The Dispatchfile must be written in `starlark`. The `cue`, `yaml`, and `json` languages do not support file imports.

2. The first line in the Dispatchfile must specify the `dispatch-starlark` version `v0.5` or higher:

    ```bash
    #!mesosphere/dispatch-starlark:v0.5
    ```

3. The imported Dispatchfile must be accessible using the SCM credentials attached to the service account that will execute the main Dispatchfile.

# Introduction

Dispatch let's you import tasks and functions from another Dispatchfile. This relies on Starlark's (library import functionality)[../references/starlark-reference/#importing-custom-libraries]. Your main Dispatchfile can import tasks and functions from another Dispatchfile in the same Git repository (a local import) or from a Dispatchfile in a different Git repository (a remote import).

Over time, your main Dispatchfile will accumulate useful tasks and utility functions. In order to keep the Dispatchfile small and maintainable, it helps to move utility functions to one or more dedicated utility Dispatchfile in the same directory. At some point other projects may want to utilize the same utility functions. At that point the utility Dispatchfile can be extracted to a shared Git repository and both projects can then import it from their main Dispatchfile.

# A basic Dispatchfile

We start with the following basic Dispatchfile that executes the popular (`shellcheck`)[https://github.com/koalaman/shellcheck] linter for shell scripts whenever a pull request modifies a `*.sh` file:

```starlark
#!mesosphere/dispatch-starlark:v0.6

load("github.com/mesosphere/dispatch-catalog/starlark/stable/pipeline@0.0.6", "git_resource", "git_checkout_dir", "pull_request")

source_repo = git_resource("sources")

task("shellcheck",
    inputs=[source_repo],
    steps=[k8s.corev1.Container(
        name="shellcheck",
        image="koalaman/shellcheck:v0.7.1",
        workingDir=git_checkout_dir(source_repo),
        args=["scripts/*.sh"]
    )]
)

action(tasks=["shellcheck"], on=pull_request(paths=["**/*.sh"]))
```

The Dispatchfile contains the following sections:

```starlark
#!mesosphere/dispatch-starlark:v0.6
```

The first line specifies that Dispatch Starlark version v0.6 should be used to execute this Dispatchfile.

```starlark
load("github.com/mesosphere/dispatch-catalog/starlark/stable/pipeline@0.0.6", "git_resource", "git_checkout_dir", "pull_request")
```
The second line is a Starlark import. It imports the `git_resource`, `git_checkout_dir` and `pull_request` functions from the official Dispatch catalog at version `0.0.6` of the catalog. You can look at the definitions of these functions and many other useful ones at the (official Dispatch catalog repository on GitHub)[https://github.com/mesosphere/dispatch-catalog/tree/0.0.6].

```starlark
source_repo = git_resource("sources")
```

This line declares that the current project's Git repository should be checked out and made available as the `sources` Git resource so we can use it throughout the rest of the Dispatchfile. We assign the name of the `sources` Git resource to the `source_repo` variable. Alternatively, we could write `"sources"` wherever we want to refer to the Git resource, but using variables is preferable.

```starlark
task("shellcheck",
    inputs=[source_repo],
    steps=[k8s.corev1.Container(
        name="shellcheck",
        image="koalaman/shellcheck:v0.7.1",
        workingDir=git_checkout_dir(source_repo),
        args=["scripts/*.sh"]
    )]
)
```

We define a new task called "shellcheck" that has a single step, called "shellcheck". The shellcheck task takes the project's source code repository as a Git input resource, which means that the project will be available in the container's filesystem. We then set the working directory to the path where the input resource is checked out. We use the convenient `git_checkout_dir(source_repo)` function from the Dispatch catalog so we don't need to memorize the exact path in the filesystem. We pass "scripts/*.sh" as the only argument to shellcheck, which means that files `*.sh` files in the `./scripts/` directory will be checked.

```starlark
action(tasks=["shellcheck"], on=pull_request(paths=["scripts/*.sh"]))
```

Execute the "shellcheck" task on any pull request that modifies a `*.sh` file in the `./scripts/` directory.

# Extract a task into a local Dispatchfile

The `"shellcheck"` task definition is quite verbose and detracts from the readability of the Dispatchfile. We extract the task to a separate file in the same Git repository.

Contents of `./lints.star`:

```starlark
load("github.com/mesosphere/dispatch-catalog/starlark/stable/pipeline@0.0.6", "git_checkout_dir")

def shellcheck(task_name, git_input, paths):
    """
    Run the shellcheck linter on `paths` relative to the project root directory of the Git resource specified by `git_input`.
    """

    if not task_name:
        task_name = "shellcheck"

    if not paths:
        paths = []

    task(task_name,
        inputs=[git_input],
        steps=[k8s.corev1.Container(
            name="shellcheck",
            image="koalaman/shellcheck:v0.7.1",
            workingDir=git_checkout_dir(git_input),
            args=paths)
        ]
    )

    return task_name
```

Modify the main Dispatchfile to use the `shellcheck` function defined in `lints.star`:

```starlark
#!mesosphere/dispatch-starlark:v0.6

load("github.com/mesosphere/dispatch-catalog/starlark/stable/pipeline@0.0.6", "git_resource", "git_checkout_dir", "pull_request")
load("/lints", "shellcheck")

source_repo = git_resource("sources")

do_shellcheck = shellcheck("shellcheck", git_input=source_repo, paths=["scripts/*.sh"])

action(tasks=[do_shellcheck], on=pull_request(paths=["**/*]))
```

# Extract a task into a remote Dispatchfile

If the shellcheck task could be useful to other teams, you can split the `lints.star` file into a shared Git repository as follows.

If you have a shared Git repository at "https://github.com/example/shared" you can move the `lints.star` file there:

1. Create a new directory in the `github.com/example/shared` repository at `./starlark/`. Copy the `lints.star` file from your project to the `shared` project's `./starlark/lints.star` file.

2. In your project's main Dispatchfile, you can modify the local import to refer to the new file as follows:

```starlark
load("github.com/example/shared/starlark/lints@master", "shellcheck")
```

The branch / tag specifier "@master" in "lints@master" is optional and will default to the project's default branch if not specified.

Any imported Starlark libraries will be retrieved using the same SCM credentials that are registered for the service account that executes the Dispatch pipeline.

# What can be imported?

Any Starlark function can be imported. This means that tasks, steps, and actions can be imported from an external Dispatchfile, as long as those are defined by Starlark functions. In this tutorial we imported a Starlark function `"shellcheck"` that declares a task.

# Validate a Dispatchfile

1. Navigate to your project directory:

    ```bash
    cd my-project/
    ```

2. Render the pipeline locally. This does not execute the pipeline, it only renders it.

    ```bash
    dispatch ci render -f ./Dispatchfile
    ```

3. If it succeeds, you will see output like the following:

    ```yaml
    #!yaml
    # vi:syntax=yaml

    actions:
    - "on":
        pull_request:
          paths:
          - '**/*.sh'
      tasks:
      - shellcheck
    resource:
      sources:
        param:
          revision: $(context.git.commit)
          url: $(context.git.url)
        type: git
    task:
      shellcheck:
        inputs:
        - sources
        steps:
        - args:
          - scripts/*.sh
          image: koalaman/shellcheck:v0.7.1
          name: shellcheck
          resources: {}
          workingDir: $(resources.inputs.sources.path)
    ```

4. To cause the Dispatchfile to become invalid, introduce an error by renaming "load" to "lload" and rerun `dispatch ci render -f ./Dispatchfile`:

    ```bash
    Error: failed to parse stdin: loading Dispatchfile: /tmp/starlark504748155:3:1: undefined: lload
    time="2020-06-23T18:59:43Z" level=fatal msg="failed to parse stdin: loading Dispatchfile: /tmp/starlark504748155:3:1: undefined: lload"
    time="2020-06-23T11:59:43-07:00" level=fatal msg="Failed to parse \"/dev/shm/a.star\": container b3445fc44da897868689b4c573359d76df92e9958131c330614a8688f44cfc68 returned status code 1\ngithub.com/mesosphere/dispatch/pkg/docker.(*Docker).Attach\n\t/home/gustav/repos/mesosphere/dispatch/pkg/docker/docker.go:263\ngithub.com/mesosphere/dispatch/pkg/docker.(*Docker).Run\n\t/home/gustav/repos/mesosphere/dispatch/pkg/docker/docker.go:181\ngithub.com/mesosphere/dispatch/pkg/parser.Parse\n\t/home/gustav/repos/mesosphere/dispatch/pkg/parser/parser.go:85\ngithub.com/mesosphere/dispatch/cmd/dispatch/cmd/ci.NewPrintPipelineCmd.func1\n\t/home/gustav/repos/mesosphere/dispatch/cmd/dispatch/cmd/ci/render.go:35\ngithub.com/spf13/cobra.(*Command).execute\n\t/home/gustav/gopath/pkg/mod/github.com/spf13/cobra@v0.0.7/command.go:842\ngithub.com/spf13/cobra.(*Command).ExecuteC\n\t/home/gustav/gopath/pkg/mod/github.com/spf13/cobra@v0.0.7/command.go:943\ngithub.com/spf13/cobra.(*Command).Execute\n\t/home/gustav/gopath/pkg/mod/github.com/spf13/cobra@v0.0.7/command.go:883\nmain.main\n\t/home/gustav/repos/mesosphere/dispatch/cmd/dispatch/main.go:9\nruntime.main\n\t/home/gustav/go/src/runtime/proc.go:203\nruntime.goexit\n\t/home/gustav/go/src/runtime/asm_amd64.s:1373\nattaching to container\ngithub.com/mesosphere/dispatch/pkg/docker.(*Docker).Run\n\t/home/gustav/repos/mesosphere/dispatch/pkg/docker/docker.go:182\ngithub.com/mesosphere/dispatch/pkg/parser.Parse\n\t/home/gustav/repos/mesosphere/dispatch/pkg/parser/parser.go:85\ngithub.com/mesosphere/dispatch/cmd/dispatch/cmd/ci.NewPrintPipelineCmd.func1\n\t/home/gustav/repos/mesosphere/dispatch/cmd/dispatch/cmd/ci/render.go:35\ngithub.com/spf13/cobra.(*Command).execute\n\t/home/gustav/gopath/pkg/mod/github.com/spf13/cobra@v0.0.7/command.go:842\ngithub.com/spf13/cobra.(*Command).ExecuteC\n\t/home/gustav/gopath/pkg/mod/github.com/spf13/cobra@v0.0.7/command.go:943\ngithub.com/spf13/cobra.(*Command).Execute\n\t/home/gustav/gopath/pkg/mod/github.com/spf13/cobra@v0.0.7/command.go:883\nmain.main\n\t/home/gustav/repos/mesosphere/dispatch/cmd/dispatch/main.go:9\nruntime.main\n\t/home/gustav/go/src/runtime/proc.go:203\nruntime.goexit\n\t/home/gustav/go/src/runtime/asm_amd64.s:1373\nfailed to parse\ngithub.com/mesosphere/dispatch/pkg/parser.Parse\n\t/home/gustav/repos/mesosphere/dispatch/pkg/parser/parser.go:86\ngithub.com/mesosphere/dispatch/cmd/dispatch/cmd/ci.NewPrintPipelineCmd.func1\n\t/home/gustav/repos/mesosphere/dispatch/cmd/dispatch/cmd/ci/render.go:35\ngithub.com/spf13/cobra.(*Command).execute\n\t/home/gustav/gopath/pkg/mod/github.com/spf13/cobra@v0.0.7/command.go:842\ngithub.com/spf13/cobra.(*Command).ExecuteC\n\t/home/gustav/gopath/pkg/mod/github.com/spf13/cobra@v0.0.7/command.go:943\ngithub.com/spf13/cobra.(*Command).Execute\n\t/home/gustav/gopath/pkg/mod/github.com/spf13/cobra@v0.0.7/command.go:883\nmain.main\n\t/home/gustav/repos/mesosphere/dispatch/cmd/dispatch/main.go:9\nruntime.main\n\t/home/gustav/go/src/runtime/proc.go:203\nruntime.goexit\n\t/home/gustav/go/src/runtime/asm_amd64.s:1373"
    ```

    In this case, the first line comlains that the "lload" function is undefined.

If your Dispatchfile imports functions from a private SCM repository, you need to specify a SCM user and authentication token so the `dispatch ci render` command can access the private repository. You can do so as follows:

```bash
dispatch ci render -f ./Dispatchfile --scm-user=your-username --scm-token=...your-personal-access-token... --scm-provider=gitlab --scm-url=https://gitlab.com
```

Alternatively, if the credentials are already present in your cluster, i.e. you have already run `dispatch login github --service-account=team-1` or similar, then you can use those credentials by specifying the associated secret:

```bash
dispatch ci render -f ./Dispatchfile --secret=team-1-basic-auth
```

If the Dispatchfile imports from a private Git repository and no `--secret=` or `--scm-...=` flags are provided, then the `dispatch ci render` command will fail with a "not found" error:

```bash
time="2020-06-23T19:28:09Z" level=info msg="Getting details of repository \"some-private/repo\""
time="2020-06-23T19:28:09Z" level=info msg="HTTP/1.1 GET for https://api.github.com/repos/some-private/repo: 404 Not Found: {\"message\":\"Not Found\",\"documentation_url\":\"https://developer.github.com/v3/repos/#get\"}"
Error: failed to parse stdin: loading Dispatchfile: cannot load github.com/some-private/repo/examples/dindTask: failed to fetch repository "some-private/repo": Not Found
time="2020-06-23T19:28:09Z" level=fatal msg="failed to parse stdin: loading Dispatchfile: cannot load github.com/some-private/repo/examples/dindTask: failed to fetch repository \"some-private/repo\": Not Found"
```
