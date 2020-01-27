---
layout: layout.pug
navigationTitle:  Code Repository Configuration
title: Setting up a Repository in Dispatch
menuWeight: 30
beta: true
excerpt: Configure and set up a code repository for access by Dispatch, including configuring a Dispatchfile
---

# Credentials

Credentials are used when a Dispatchfile is executed, to push images and
clone source repositories. These credentials are attached to an individual service account that is specified when a Dispatch repository is created. The Dispatchfile's tasks then
have access to only those credentials that have been attached to the specified
service account.

A Dispatch repository's Dispatchfile is executed in the context of a specific
Kubernetes service account. The Dispatchfile's tasks use credentials attached to
that service account in order to push/pull docker images from a registry or
clone git repositories. These credentials are stored as Kubernetes secrets with
special structure and annotations.

Before registering a new repository with Dispatch, you need to create a service
account and attach credentials to it.

1. Create a service account using the dispatch CLI as follows:

    ```bash
    dispatch serviceaccount create team-1
    ```

    This creates a service account named `team-1`.

1. Create a [Personal Access Token](https://github.com/settings/tokens) for your
Github account. You need to specify the following permissions:

    * FULL access to `admin:repo_hook`: used to register webhooks to report events
      to the Dispatch build server.
    * FULL access to `repo`: used to download source code whether public or private,
      report build status to your commits, etc.

1. After creating the token, remember the secret value. Replace `$YOURGITHUBTOKEN`
with token secret value in the following command:

    ```bash
    dispatch login github --service-account team-1 --user $YOURGITHUBUSERNAME --token $YOURGITHUBTOKEN
    ```

    The `team-1` service account now has these credentials attached as a
    secret, and any Dispatch repository that is configured to use the
    `team-1` service account will operate on GitHub using these credentials.

1. Set up Git SSH credentials. Generate an SSH key pair:

    ```bash
    ssh-keygen -t ed25519 -f dispatch.pem
    ```

    This generates two files:

    * The SSH private key `dispatch.pem` (never copy or share this file anywhere you
      do not trust).
    * The SSH public key `dispatch.pem.pub` which corresponds to the `dispatch.pem`
      private key file. This file is safe to copy or share publicly.

1. Add the SSH public key to your GitHub account:

    * Visit https://github.com/settings/keys
    * Click "New SSH key".
    * Give the key an appropriate title like "Dispatch test 1".
    * Run `cat ./dispatch.pem.pub` in your terminal, copy the output, and paste it in the "Key" text box on the page.
    * Click "Add SSH key".

1. Now that we've registered our SSH public key with GitHub, we add the
corresponding SSH private key to the `team-1` service account:

    ```bash
    dispatch login git --service-account team-1 --private-key-path ./dispatch.pem
    ```

1. Set up Docker Credentials. Dispatch loads Docker registry credentials from Docker's default config file (typically `$HOME/.docker/config.json`), so you should first ensure you have already logged in on all used registries through Docker CLI. To load Docker
registry credentials, run the `login docker` subcommand and specify the service account to attach the credentials to:

    ```bash
    dispatch login docker --service-account team-1
    ```

    Alternatively, you can supply the path to a non-default Docker config file:

    ```bash
    dispatch login docker --service-account team-1 --docker-config-path /path/to/config.json
    ```

# Setting up a repository

Now that you have set up your credentials, let's write some code to deploy. For this tutorial, we will fork a simple "hello world" application prepared for this purpose. Visit [the cicd-hello-world repository](https://github.com/mesosphere/cicd-hello-world) and fork it to
your personal account.


The repository contains various branches named `step_1`, `step_2`, etc. These
correspond to the steps in this tutorial, as well as steps in the next tutorial:
[Deployment with Gitops and Argo CD](../deployment/). The `master` branch is in
a very basic state. We will add to it as we progress through the tutorials.

Clone your new `cicd-hello-world` repository from your personal fork to your
workstation. Looking at the source code, you will see the following files:

- **main.go** contains the code for the Go web server.

- **Dockerfile** describes how to build a docker image from the application source
  code.

- **README.md**

- **License** contains a license file. The application was forked from the example
  'hello-app' application at
  https://github.com/GoogleCloudPlatform/kubernetes-engine-samples/tree/bc8e412670e5f8dd94189e80a0908d08ade196cc/hello-app

## Writing a Basic Dispatchfile

We will write a basic Dispatchfile and save it as `Dispatchfile` in your cloned repository:

```bash
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

A Dispatchfile has three parts:
* `resource`: resources define git repositories, images, and other artifacts that are consumed or produced by a task.
* `task`: defines a set of steps (containers) to run, these do the work of the pipeline.

* `actions`: defines which tasks to run for which events.

In our example:

* The `src-git` resource clones the current repository into each task that specifies `src-git` in its `inputs`.
* The `test` task runs a step that runs all defined Go unit tests.
* There are two `actions` defined:
  * One that runs the `test` task on any push to the `master` branch.
  * One that runs the `test` task on pushes to pull requests or any comments in a pull request that start with `/build`.

After you have saved the file, you can add and commit the `Dispatchfile` to your Git
repository's master branch, then push it to GitHub:

```sh
git add Dispatchfile
git commit -m 'Dispatchfile: initial commit with test task'
git push
```

## Triggering a build locally

To run your Dispatchfile, simply run:

```sh
dispatch build local --tasks test --service-account team-1
```

Alternatively, run it in a running Dispatch cluster with:

```sh
dispatch build tekton --tasks test --service-account team-1 --follow
```

This will 
* submit the Dispatchfile to your Dispatch cluste
* run it using the
`team-1` service account and its attached credentials, and 
* display the
results to you.

After this command exits successfully, you can view the result of the build on GitHub.

Visit https://github.com/your-user/cicd-hello-world/commits/master in your browser (replace "your-user" with your actual GitHub username).

Notice that the new commit "Dispatchfile: initial commit with test task" has a
green checkmark. That means that the build succeeded.

You can click on the the green checkmark and then click on "Details" in order to
view the build log of your first CI pipeline. It is not very glamarous yet, but
it is a good start.

### Building a Docker image

In the previous example, we only ran our tests. Now let's build a Docker image.

First, we need to add a new "docker-image" resource. Dispatch uses this resource
definition to identify the docker image that we are going to build, and push the
resulting image to DockerHub.

We add the "docker-image" resource below the "src-git" resource. The order in
which they are defined is not important.

```sh
resource "src-git": {
  type: "git"
  param url: "$(context.git.url)"
  param revision: "$(context.git.commit)"
}

resource "docker-image": {
  type: "image"
  param url: "your-user/hello-world:$(context.build.name)"
  param digest: "$(inputs.resources.docker-image.digest)"
}
...
```

Make sure you replace `your-user` in the `docker-image` resource definition with
your real DockerHub username. Running the pipeline defined in our Dispatchfile
will push a new docker image called "hello-world" to your DockerHub account.

If you're unsure exactly what changes to make, you can have a look at the diff here: https://github.com/mesosphere/cicd-hello-world/compare/step_1

Next, we'll add a new "build" task definition that will build our docker image.
We add the "build" task definition below the "test" task definition. The order
in which tasks are defined is not important.

```sh
...
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

task "build": {
  inputs: ["src-git"]
  outputs: ["docker-image"]
  deps: ["test"]

  steps: [
    {
      name: "build-and-push"
      image: "chhsiao/kaniko-executor"
      args: [
        "--destination=$(outputs.resources.docker-image.url)",
        "--context=/workspace/src-git",
        "--oci-layout-path=/builder/home/image-outputs/docker-image",
        "--dockerfile=/workspace/src-git/Dockerfile"
      ],
      env: [
        {
          name: "DOCKER_CONFIG",
          value: "/builder/home/.docker"
        }
      ]
    }
  ]
}
...
```

Next, let's modify the list of actions at the bottom of the file to execute the new "build" task:

```sh
...

actions: [
  {
    tasks: ["build"]
    on push: {
      branches: ["master"]
    }
  },
  {
    tasks: ["build"]
    on pull_request: {
      chatops: ["build"]
    }
  },
  {
    tasks: ["build"]
    on tag: {
      names: ["*"]
    }
  }
]
```

If you're unsure exactly what changes to make, you can look at the diff here: https://github.com/mesosphere/cicd-hello-world/compare/step_1...step_2

Since the "build" task depends on the "test" task, we do not need to explicitly
list the "test" task in the actions where the "build" task is specified. If you
prefer to do so you can, by specifying `tasks: ["test", "build"]` instead of
`tasks: ["build"]`, but in this tutorial we will not do so. Dispatch
automatically resolves dependencies between tasks and will run all the tasks
specified in the action, as well as all the tasks on which they depend
(transitively).

In this section, we have added three things to our Dispatchfile:

* An `image` resource that specifies the image that we are publishing in our pipeline.
  * The `$(context.build.name)` variable in the image URL is used to infer the tag to use for the built Docker image from the current build context (either the branch or tag).
  * The `image` resource can be used by other steps to refer to the newly built image by its digest.
* A `build` task that builds and pushes the Docker image. The `docker-image` is its output resource, it has `src-git` as an input resource, and it depends on the `test` task completing successfully.
* A new `on push tags` action that will run our build whenever a new Git tag is pushed.

See the [complete pipeline configuration reference](pipeline-configuration.md) for further assistance configuring your pipeline.

After you've made these modifications to the Dispatchfile, you can `add`, `commit` and `push` your changes:

```sh
git add Dispatchfile
git commit -m 'Dispatchfile: add docker-image resource and build task'
git push
```

If you like, you can run the Dispatch pipeline once more by executing the following command:

```sh
dispatch build local --tasks build --service-account team-1
```

Alternatively, run it in a running Dispatch cluster with:

```sh
dispatch build tekton --tasks build --service-account team-1 --follow
```

After this command exits successfully, you can view the result of the build on GitHub.

Visit https://github.com/your-user/cicd-hello-world/commits/master in your browser (replace "your-user" with your actual GitHub username).

Notice that the latest commit "Dispatchfile: add docker-image" has a green
checkmark. As before, this means that the build succeeded.

Click on the the green checkmark and then click on the "Details" next to the
"build" task in order to view the build log. After the build succeeds, you can
visit DockerHub and see the new image has been pushed. To do so, open your
browser at https://hub.docker.com/r/your-user/hello-world (remember to
replace "your-user" in the URL with your actual DockerHub username)

In [the commit
log](https://github.com/your-user/cicd-hello-world/commits/master) you can see
that the latest commit now shows a green checkmark, too.

#### Push to a private docker registry


If you want to push docker images to a private docker registry as part of your
pipeline, say to `https://docker-registry.local/`, with service account `team-1`, you can execute the following command:

```sh
docker login https://docker-registry.local
dispatch login docker --service-account team-1
```

After you have configured credentials for the service account to use when accessing the private docker registry, you can push your image to it by prefixing the image name with the hostname of the private docker registry in your Dispatchfile as follows:

```sh
resource "docker-image": {
  type: "image"
  param url: "docker-registry.local/hello-world:$(context.build.name)"
  param digest: "$(inputs.resources.docker-image.digest)"
}
```


## Adding a Repository to Dispatch

You are now ready to have the Dispatch service execute your Dispatchfile on pull requests against your repository.

In your shell, navigate to your local git checkout of the `cicd-hello-world`
repository and run the following command:

```sh
dispatch create repository --service-account team-1
```

The `dispatch create repository` command creates a `Repository` object in Kubernetes for your repository
which tells Dispatch which service account and associated credentials to use when executing its Dispatchfile, and how to handle events
received from Github. See [the Repository CRD documentation](../repository-crd/) for details on the Repository object.

Run `kubectl describe repositories -n dispatch` to see the newly created `Repository` object.

You can see the newly created webhook by opening your browser to
https://github.com/your-user/cicd-hello-world/settings/hooks (remember to
replace "your-user" with your real GitHub username). The green checkmark
indicates that GitHub is able to successfully deliver webhook events to your
Dispatch installation.

## Creating a Pull Request

We are now ready to perform our first real CI build. We will,

- Modify the `main.go` file and commit our changes to a new feature branch.
- Create a pull request from our feature branch.
- GitHub will deliver a GitHub event to Dispatch using the new webhook.
- Dispatch will execute a build as defined by our Dispatchfile.
- Dispatch will report the result of the build to the GitHub.
- The result will be shown on the the pull request as a status check.

You can use the GitHub editor to modify the `main.go` file on your fork of the
cicd-hello-world repository or you can create a local feature branch, use your
favourite editor to edit the file, commit your change, and push your feature
branch to your fork of the cicd-hello-world repository.

You can see the exact changes suggested here by looking at this diff:
https://github.com/mesosphere/cicd-hello-world/compare/step_2...step_3

After you push your feature branch to your fork, you can visit
https://github.com/your-user/cicd-hello-world/commits/master (replace
`your-user` with your actual GitHub username) and create a pull request from
your feature branch against the master branch _of your fork_.

A few seconds after you've created your pull request, you will see Dispatch
report that a new CI build has started. You can click on the Details link to
follow the build as it proceeds. After it completes successfully, that status
will be reported back to GitHub and your pull request will show that all its
checks are passing. Merge the pull request.

Merging the pull request applies your feature branch's commits to the `master`
branch of your fork. As we've modified the `master` branch, another CI build is
triggered. You can view the new round of CI by opening your browser at
https://github.com/your-user/cicd-hello-world/commits/master (replace
`your-user` with your actual GitHub username) and clicking on the yellow dot or
green checkmark next to the latest "Merge" commit.

<p class="message--caution"><strong>CAUTION: </strong>The following section relies on functionality not yet released in Dispatch v0.1.0</p>

Now that we hae modified master and confirmed that the current `master` branch
passed CI, we will use the GitHub UI to tag a new release.

1. Open your browser at https://github.com/your-user/cicd-hello-world/releases
(replace `your-user` with your actual GitHub username)
1. Click the "Create a new release" button.
1. In the "Tag version" text field, enter `v0.1`.
1. Leave the "Target" as `Target: master`.
1. For "Release title" enter "v0.1-alpha"
1. Leave the description text box empty.
1. Check the "This is a pre-release" checkbox.
1. Hit the "Publish release" button.

You have now tagged and created a new release. Creating a tag starts another CI
build. There is no link in the GitHub UI that can take you directly to the new
build. Instead, you can view the build status of the last `master` build and
navigate from there to the latest build (which will be for the tag we just
created.)

1. Open your browser at https://github.com/your-user/cicd-hello-world/commits/master
1. Click on the green checkmark next to the latest commit.
1. Click on the "Details" link next to "build". This takes you to the now-familiar Tekton dashboard.
1. In the sidebar click on "PipelineRuns".
1. You will see the latest build (the one at the very top) is for the v0.1 alpha tag.
1. After it completes, if will push a docker image to DockerHub with the `v0.1` tag: `your-user/hello-world:v0.1`.

You have successfully created a release.

Now that you have configured CI for your project, proceed to the next tutorial:
[Deployment with Gitops and Argo CD](../deployment/)

## Slack Notifications

If you would like to receive notifications in a Slack channel, add the [Github Slack integration](https://slack.github.com/) to your Slack channel.
