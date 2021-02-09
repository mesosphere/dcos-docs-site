---
layout: layout.pug
navigationTitle:  Configure a Repository
title: Setting up a Repository in Dispatch
menuWeight: 20
beta: false
excerpt: Configure and set up a code repository for access by Dispatch, including configuring a Dispatchfile
---

# Credentials

Credentials are used when a Dispatchfile is executed, to push images and
clone source repositories. These credentials are attached to an individual service account that is specified when a Dispatch repository is created. The Dispatchfile's tasks then
have access to only those credentials that have been attached to the specified
service account. See the [Credentials](../credentials/) section for complete instructions.

# Namespaces

Unless otherwise specified, the Dispatch CLI commands create repositories, secrets, pipelines and tasks in the `default` namespace. For production installations, we suggest you create a new namespace dedicated to your CI workloads, for example, `dispatch-work` or `dispatch-ci`. You will then specify that namespace when using the CLI.

Examples:

```bash
dispatch -n dispatch-ci login docker --service-account=team1
```

or

```bash
dispatch -n dispatch-work ci create repository
```

# How to set up a repository

We will fork a simple "hello world" application prepared for this purpose. Visit [the cicd-hello-world repository](https://github.com/mesosphere/cicd-hello-world) and fork it to
your personal account.

The repository contains various branches named `step_1`, `step_2`, etc. These
correspond to the steps in this tutorial, as well as steps in the next tutorial:
[Deployment with Gitops and Argo CD](../../cd_tutorials/). The `master` branch is in
a very basic state. We will add to it as we progress through the tutorials.

Clone your new `cicd-hello-world` repository from your personal fork to your
workstation. Looking at the source code, you will see the following files:

- **main.go** contains the code for the Go web server.

- **Dockerfile** describes how to build a docker image from the application source
  code.

- **README.md**

- **License** contains a license file.

The application was forked from the example [`hello-app` application](
  https://github.com/GoogleCloudPlatform/kubernetes-engine-samples/tree/bc8e412670e5f8dd94189e80a0908d08ade196cc/hello-app).
  
## Creating Secrets using the Dispatch dashboard

Before you begin:

- You must have [set up credentials](///tutorials/ci_tutorials/credentials/#setting-up-github-credentials) for the service account for Dispatch to access the source control management service on behalf of your account.

- Ensure that the [namespace to be used exists](https:///tutorials/ci_tutorials/repo-setup/#namespaces). 

1. From the Konvoy Dashboard, select **CI/CD > CI/CD >Continuous Integration (CI) > Secrets > Create Secret**.

2. Select the source control management service of the Repository (GitHub, GitLab, Docker or BitBucket).  

3. Fill out the form, select **Verify and Save**.

## Writing a Basic Dispatchfile

We will write a basic Dispatchfile and save it as `Dispatchfile` in your cloned repository:

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

A Dispatchfile has three parts:
* `resource`: resources define git repositories, images, and other artifacts that are consumed or produced by a task.
* `task`: defines a set of steps (containers) to run, these do the work of the pipeline.

* `actions`: defines which tasks to run for which events.

In our example:

* The `src-git` resource clones the current repository into each task that specifies `src-git` in its `inputs`.
* The `test` task runs a step that runs all defined Go unit tests.
* There are two `actions` defined:
  * One that runs the `test` task on any push to the `master` branch.
  * One that runs the `test` task on pushes to pull requests or any comments in a pull request that start with `/test`.

After you have saved the file as `Dispatchfile`, run `dispatch ci render` to output the pipeline rendered as YAML to check for any syntax errors.

Next, you can add and commit the `Dispatchfile` to your Git
repository's master branch, then push it to GitHub:

```bash
git add Dispatchfile
git commit -m 'Dispatchfile: initial commit with test task'
git push
```

## Triggering a build locally

If you want to preview your build, you can set up a local 'kind' Kubernetes cluster, run the command `dispatch ci run local`, and then destroy the cluster afterwards. For a full tutorial on running builds locally see [the Local Runner tutorial](../local-runner/).

To run your Dispatchfile, run:

```bash
dispatch ci run local --task test
```

Alternatively, you can run the `dispatch ci run remote` command in a running Dispatch cluster:

```bash
dispatch ci run remote --task test --follow
```

This will:

* submit the Dispatchfile to your Dispatch cluster
* run it using the `team-1` service account and its attached credentials, and
* display the results to you.

After this command exits successfully, you can view the result of the build on GitHub.

Visit https://github.com/your-user/cicd-hello-world/commits/master in your browser (replace "your-user" with your actual GitHub username).

<!-- You can click on the the green checkmark and then click on "Details" in order to
view the build log of your first CI pipeline. It is not very glamorous yet, but
it is a good start. -->

### Building a Docker image

In the previous example, we only ran our tests. Now let's build a Docker image.

First, we need to add a new "docker-image" resource to the Dispatchfile. Dispatch uses this resource definition to identify the docker image that we are going to build, and push the
resulting image to DockerHub. We add the "docker-image" resource below the "src-git" resource. The order in which they are defined is not important.

```bash
resource "src-git": {
  type: "git"
  param url: "$(context.git.url)"
  param revision: "$(context.git.commit)"
}

resource "docker-image": {
  type: "image"
  param url: "your-dockerhub-user/hello-world:$(context.build.name)"
  param digest: "$(inputs.resources.docker-image.digest)"
}
...
```

Make sure you use your real DockerHub username. Running the pipeline defined in our Dispatchfile
will push a new docker image called "hello-world" to your DockerHub account.

If you are unsure exactly what changes to make, you can have a look at the diff [here](https://github.com/mesosphere/cicd-hello-world/compare/step_1).

Next, we'll add a new "build" task definition that will build our docker image.
We add the "build" task definition below the "test" task definition. The order
in which tasks are defined is not important.

```bash
...
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
        "--oci-layout-path=/workspace/output/docker-image",
        "--dockerfile=/workspace/src-git/Dockerfile"
      ]
    }
  ]
}
...
```

Next, let's modify the list of actions at the bottom of the file to execute the new "build" task:

```json
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

If you are unsure exactly what changes to make, you can look at the diff [here](https://github.com/mesosphere/cicd-hello-world/compare/step_1...step_2).

Since the "build" task depends on the "test" task, we do not need to explicitly list the "test" task in the actions where the "build" task is specified. If you
prefer to do so you can, by specifying `tasks: ["test", "build"]` instead of `tasks: ["build"]`, but in this tutorial we will not do so. Dispatch automatically resolves dependencies between tasks and will run all the tasks specified in the action, as well as all the tasks on which they depend (transitively).

In this section, we have added three things to our Dispatchfile:

* An `image` resource that specifies the image that we are publishing in our pipeline.
  * The `$(context.build.name)` variable in the image URL is used to infer the tag to use for the built Docker image from the current build context (either the branch or tag).
  * The `image` resource can be used by other steps to refer to the newly built image by its digest.
* A `build` task that builds and pushes the Docker image. The `docker-image` is its output resource, it has `src-git` as an input resource, and it depends on the `test` task completing successfully.
* A new `on push tags` action that will run our build whenever a new Git tag is pushed.

See the [complete pipeline configuration reference](/pipeline-configuration/) for further assistance configuring your pipeline.

After you've made these modifications to the Dispatchfile, you can `add`, `commit` and `push` your changes:

```bash
git add Dispatchfile
git commit -m 'Dispatchfile: add docker-image resource and build task'
git push
```

If you like, you can run the Dispatch pipeline once more by executing the following command:

```bash
dispatch ci run local --task build team-1
```

Alternatively, run it in a running Dispatch cluster with:

```bash
dispatch ci run remote --task build --service-account team-1 --follow
```

The result should look like this:

```bash
$ dispatch ci run remote --task test  --service-account team-1 --follow

...

Name: vjone-cicd-hello-world-your-username-6803b68-jdssn
Namespace: dispatch
Pipeline Ref: vjone-cicd-hello-world-your-username-6803b68-jdssn

Status
STARTED DURATION STATUS
16 seconds ago 16 seconds Succeeded

Resources
NAME RESOURCE REF
src-git src-git-mmt44

Params
No params

Taskruns
NAME TASK NAME STARTED DURATION STATUS
vjone-cicd-hello-world-your-username-6803b68-jdssn-test-djqcr test 16 seconds ago 16 seconds Succeeded
cicd-hello-world/ Tue Jan 28$"

```


<!-- After this command exits successfully, you can view the result of the build on GitHub.

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
that the latest commit now shows a green checkmark, too. -->

#### Push to a private docker registry


If you want to push docker images to a private docker registry as part of your pipeline, say to `https://docker-registry.local/`, with service account `team-1`, you can execute the following command:

```sh
docker login https://docker-registry.local
dispatch login docker  --service-account team-1
```

After you have configured credentials for the service account to use when accessing the private docker registry, you can push your image to it by prefixing the image name with the hostname of the private docker registry in your Dispatchfile as follows:

```bash
resource "docker-image": {
  type: "image"
  param url: "docker-registry.local/hello-world:$(context.build.name)"
  param digest: "$(inputs.resources.docker-image.digest)"
}
```


## Adding a Repository to Dispatch

You are now ready to have the Dispatch service execute your Dispatchfile on pull requests against your repository.

In your shell, navigate to your local git checkout of the `cicd-hello-world` repository and run the following command:

```sh
dispatch ci repository create --service-account team-1
```

The `dispatch ci repository create` command creates a `Repository` object in Kubernetes for your repository which tells Dispatch which service account and associated credentials to use when executing its Dispatchfile, and how to handle events received from your source control management service (e.g., GitHub or GitLab, which is inferred from the credentials of the service account). See [the Repository CRD documentation](../../../references/repository-crd/) for details on the Repository object.


Run `kubectl describe repositories -n dispatch` to see the newly created `Repository` object.

You can see the newly created webhook by opening your browser to https://github.com/your-user/cicd-hello-world/settings/hooks (remember to replace "your-user" with your real GitHub username). The green checkmark indicates that GitHub is able to successfully deliver webhook events to your Dispatch installation.

By default, PipelineRuns will timeout after 1 hour. If your repository's CI requires more time to complete, you can override the default timeout by setting the `--timeout=<duration>` option. The following example sets the timeout for this repository to 2 hours and 30 minutes:

```sh
dispatch ci repository create --service-account=team-1 --timeout=2h30m
```

## Adding a Repository to Dispatch using the Dispatch dashboard

1. From **Continuous Integration (CI)  >  Repositories**
To add a Repository select **+ Add Repository**. 

1. Select an exisiting Namespace to select an existing Service Account or create a new Service Account. To create a new Service Account type its name and select **Create Service Account**.

1. Once you have selected Namespace and Service Account you should select the Git Secret from one of those listed. If the Repository requires Docker secrets then select **+ Docker Secret** and choose from the list of Docker secrets displayed.

1. Once the required information is entered select **SAVE**.

### Pipeline auto-cancellation

Dispatch includes a feature where it will automatically stop running builds from previous commits for a given branch or pull request. This helps to ensure that the cluster is not wasting resources on obsolete builds if the pull request or branch is updated before the build completes. This feature is enabled by default, but it can be disable by setting `--disable-auto-cancel` on the Dispatch CLI:

```sh
dispatch ci repository create --service-account=team-1 --disable-auto-cancel
```

## Creating a Pull Request

We are now ready to perform our first real CI build. We will:

- Modify the `main.go` file
- Commit our changes to a new feature branch.
- Create a pull request from our feature branch.

GitHub will deliver a GitHub event to Dispatch using the new webhook. Dispatch will execute a build as defined by our Dispatchfile. Then Dispatch will report the result of the build to  GitHub. The result will be shown on the pull request as a status check.

You can use the GitHub editor to modify the `main.go` file on your fork of the cicd-hello-world repository or you can create a local feature branch, use your
favourite editor to edit the file, commit your change, and push your feature branch to your fork of the cicd-hello-world repository.

You can see the exact changes suggested here by looking at this [diff](https://github.com/mesosphere/cicd-hello-world/compare/step_2...step_3).

After you push your feature branch to your fork, you can visit
[https://github.com/your-user/cicd-hello-world/commits/master](https://github.com/your-user/cicd-hello-world/commits/master) (replace
`your-user` with your actual GitHub username) and create a pull request from
your feature branch against the master branch **of your fork**.

A few seconds after you've created your pull request, you will see Dispatch report that a new CI build has started. You can click on the Details link to
follow the build as it proceeds. After it completes successfully, that status will be reported back to GitHub and your pull request will show that all its
checks are passing. Merge the pull request.

Merging the pull request applies your feature branch's commits to the `master`
branch of your fork. As we've modified the `master` branch, another CI build is
triggered. You can view the new round of CI by opening your browser at
[https://github.com/your-user/cicd-hello-world/commits/master](https://github.com/your-user/cicd-hello-world/commits/master) (replace
`your-user` with your actual GitHub username) and clicking on the yellow dot next to the latest "Merge" commit.

Now that we have modified the master and confirmed that the current `master` branch
passed CI, we will use the GitHub UI to tag a new release.

1. Open your browser at [https://github.com/your-user/cicd-hello-world/releases](https://github.com/your-user/cicd-hello-world/releases).(Replace `your-user` with your actual GitHub username)
1. Click the "Create a new release" button.
1. In the "Tag version" text field, enter `v0.1`.
1. Leave the "Target" as `Target: master`.
1. For "Release title" enter "v0.1-alpha"
1. Leave the description text box empty.
1. Check the "This is a pre-release" checkbox.
1. Click the "Publish release" button.

You have now tagged and created a new release.  Creating a tag starts another CI build. There is no link in the GitHub UI that takes you directly to the new build in the Dispatch dashboard.  Instead, you can view the build status of the last master build and navigate from there using the breadcrumb links.  For example, select Pipeline in **Continuous Integration (CI) > Pipeline > PipelineRun** at the top of the Dispatch dashboard page.

1. Open your browser at https://github.com/your-user/cicd-hello-world/commits/master.
2. Click on the green checkmark next to the latest commit.
3. Click on the “Details” link next to “build”. This takes you to the Dispatch dashboard PipelineRun page.
4. Select the Pipeline link in the breadcrumbs (e.g. Open your browser at https://github.com/your-user/cicd-hello-world/commits/master.
5. Click on the green checkmark next to the latest commit.
6. Click on the “Details” link next to “build”. This takes you to the Dispatch dashboard’s PipelineRun page.
7. Click on the Pipeline link in the breadcrumb links (e.g. **Continuous Integration (CI) > Pipeline > PipelineRun**) at the top of the Dispatch dashboard’s PipelineRun page. 
8. You will see the latest build (the one at the very top) is for the v0.1 alpha tag.
9. After it completes, it will push a docker image to DockerHub with the v0.1 tag: your-user/hello-world:v0.1.  at the top of the Dispatch dashboard page.
10. You will see the latest build (the one at the very top) is for the v0.1 alpha tag.
11. After it completes, it will push a docker image to DockerHub with the v0.1 tag: your-user/hello-world:v0.1.

You have successfully created a release.

Now that you have configured CI for your project, proceed to the next tutorial:
[Deployment with Gitops and Argo CD](../../cd_tutorials/).

## Slack Notifications

If you would like to receive notifications in a Slack channel, add the [Github Slack integration](https://slack.github.com/) to your Slack channel.
