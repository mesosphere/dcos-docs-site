---
layout: layout.pug
navigationTitle:  Configure Rolling Deployments
title: Rolling Deployments
menuWeight: 10
beta: false
excerpt: Implement GitOps processes to Continuously Deploy applications
---

# Prerequisites

To use the `dispatch gitops` CLI command, you must have the necessary RBAC permissions to port-forward to the `argocd-server` pod in the `dispatch` namespace. If your user already has the `cluster-admin` role, then you can simply proceed. If you want to allow users to manage GitOps applications using the `dispatch gitops` CLI command, then you must grant them the following permissions: `get`, `list`, `create` permission on `pods` and `pods/portforward`. You can do so by defining the following role:

```yaml
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: allow-port-forward
  namespace: dispatch
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["list"]
- apiGroups: [""]
  resources: ["pods/portforward"]
  verbs: ["create"]
```

Then, create a rolebinding to grant permission to a specific user or group:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: allow-port-forward
  namespace: dispatch
subjects:
- kind: User
  name: bob
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: allow-port-forward
  apiGroup: ""
```

# Deploying Applications with GitOps

Dispatch enables software and applications to be continuously deployed (CD) using GitOps processes. GitOps enables the application to be deployed as per a manifest that is stored in a Git repository.  This ensures that the application deployment can be automated, audited and declaratively deployed to the infrastructure.

This section assumes that you have followed the [Dispatch Installation](../../../install/) and [Setting up a repository to use Dispatch](../../ci_tutorials/repo-setup/) procedures, and have set up Dispatch CI for a hello-world application.

## What is GitOps?

GitOps is a modern software deployment strategy. The configuration describing how your application is deployed to a cluster are stored in a Git repository. The configuration is continuously synchronized from this Git repository to the cluster, ensuring that the specified state of the cluster always matches what is defined in the "GitOps" Git repository.

The benefits of following a GitOps deployment strategy are:

* Familiar, collaborative change and review process. Engineers are intimately familiar with Git-based workflows: branches, pull requests, code reviews, etc. GitOps leverages this experience to control deployment of software and updates to catch issues early.
* Clear change log and audit trail. The Git commit log serves as an audit trail to answer the question: "**who** changed **what**, and **when**?" Having such information readily available allows you to reach out to the right people when
  fixing or triaging a production incident to determine the **why** and correctly resolve the issue as quickly as possible. Additionally, Dispatch's CD component (Argo CD) maintains a separate audit trail in the form of Kubernetes Events, as changes to a Git repository don't include exactly when those changes were deployed.
* Avoid configuration drift. The scope of manual changes made by operators expands over time. It soon becomes difficult to know which cluster configuration is critical and which is left over from temporary workarounds or live debugging. Over time, changing a project configuration or replicating a deployment to a new environment becomes a daunting task. GitOps supports simple,  reproducible deployment to multiple different clusters by having a single source of truth for cluster and application configuration.

That said, there are some cases when live debugging is necessary in order to resolve an incident in the minimum amount of time. In such cases, a pull request-based workflow adds expensive overhead when you need it least. Dispatch's CD strategy supports this scenario by letting you disable the Auto Sync feature. After Auto Sync is disabled, Dispatch will stop synchronizing the cluster state from the GitOps git repository. This lets you use `kubectl`, `helm` or whichever tool you need to resolve the issue.

After you are done, Dispatch will show that your cluster configuration has diverged from your GitOps repository. The diff can be viewed in the UI and the changes carefully transferred back to the GitOps repository. After the diff between the cluster and the GitOps repository drops to zero, you can safely re-enable Auto Sync.

Dispatch leverages the [Argo CD](https://argoproj.github.io/argo-cd/) Open Source project to manage Continuous Delivery of your software. It is installed as part of Dispatch.

## Canary deployment

If you are satisfied using the standard Kubernetes deployment strategies such as `RollingUpdate` or `Recreate`, then you are all set. Alternatively, proceed to the [canary deployment](../canary-deployment/) page to configure your application for progressive delivery using Flagger and Istio.

# Quick Start

This section provides a set of instructions for deploying a simple `hello-world` application to your Kubernetes cluster using Dispatch. The subsequent sections provide background and go into greater details regarding the individual steps.

<p class="message--note"><strong>NOTE: </strong>You should use either your <tt>GitHub username</tt> or your <tt>Dockerhub username</tt> in all the following steps. </p>

1. Fork `https://github.com/mesosphere/cicd-hello-world-gitops` to your own account.
1. Run the following:

    ```bash
	dispatch serviceaccount create team-1
    dispatch login github --service-account team-1 --user $YOURGITHUBUSERNAME --token $YOURGITHUBTOKEN
    ```

1. Run the following:

    ```bash
    dispatch gitops app create hello-world --repository=https://github.com/your-github-user/cicd-hello-world-gitops --service-account team-1
    ```

1. Add the GitOps repository as a resource to your hello-world application's Dispatchfile:

      ```bash
      resource "gitops-git": {
        type: "git"
        param url: "https://github.com/your-github-user/cicd-hello-world-gitops"
      }
      ```

1. Add a `deploy` task to your hello-world application's Dispatchfile:

    <details>
    <summary><b>GitHub</b></summary>

    ```cue
    task "deploy": {
      inputs: ["docker-image", "gitops-git"]
      steps: [
        {
          name: "update-gitops-repo"
          image: "mesosphere/update-gitops-repo:1.2.0"
          workingDir: "/workspace/gitops-git"
          args: [
            "-git-revision=$(context.git.commit)",
            "-substitute=imageName=your-dockerhub-user/hello-world@$(inputs.resources.docker-image.digest)",
            "-scm-provider=github"
          ]
        }
      ]
    }
    ```

    </details>

    <details>
    <summary><b>GitLab</b></summary>

    ```cue
    task "deploy": {
      inputs: ["docker-image", "gitops-git"]
      steps: [
        {
          name: "update-gitops-repo"
          image: "mesosphere/update-gitops-repo:1.2.0"
          workingDir: "/workspace/gitops-git"
          args: [
            "-git-revision=$(context.git.commit)",
            "-substitute=imageName=your-dockerhub-user/hello-world@$(inputs.resources.docker-image.digest)",
            "-scm-provider=gitlab"
          ]
        }
      ]
    }
    ```

    </details>

    <details>
    <summary><b>Bitbucket Cloud</b></summary>

    ```cue
    task "deploy": {
      inputs: ["docker-image", "gitops-git"]
      steps: [
        {
          name: "update-gitops-repo"
          image: "mesosphere/update-gitops-repo:1.2.0"
          workingDir: "/workspace/gitops-git"
          args: [
            "-git-revision=$(context.git.commit)",
            "-substitute=imageName=your-dockerhub-user/hello-world@$(inputs.resources.docker-image.digest)",
            "-scm-provider=bitbucket-cloud"
          ]
        }
      ]
    }
    ```

    </details>

    <details>
    <summary><b>Bitbucket Server</b></summary>

    ```cue
    task "deploy": {
      inputs: ["docker-image", "gitops-git"]
      steps: [
        {
          name: "update-gitops-repo"
          image: "mesosphere/update-gitops-repo:1.2.0"
          workingDir: "/workspace/gitops-git"
          args: [
            "-git-revision=$(context.git.commit)",
            "-substitute=imageName=your-dockerhub-user/hello-world@$(inputs.resources.docker-image.digest)",
            "-scm-provider=bitbucket-server"
          ]
        }
      ]
    }
    ```

    </details>

1. Add a `deploy` task as an action to be taken when the `master` branch is modified:

    ```bash
    actions: [
      {
        tasks: ["build", "deploy"]
        on push branches: ["master"]
      },
      ...
    ]
    ```

1. Commit this change to a feature branch, push the branch, create a pull request, and merge it into `master` of your hello-world application's git repository.
1. After it is merged, a `master` build is triggered. Open your browser to
  `/dispatch/tekton/`, select the **PipelineRuns** tab, and notice that a new `master`
  build is running.

    When the master build completes, it will create a new pull request against the GitOps
    repository. Open the pull request from https://github.com/your-github-user/cicd-hello-world-gitops/pulls

1. Merge the pull request to `master`.
1. Open the Argo CD UI at `/dispatch/argo-cd`, and choose the `hello-world` application.

    You can now select `Refresh` in the action bar at the top of the page or wait 180s for Argo CD to automatically pick up the change to the GitOps repository and deploy those changes to the cluster.

### Workflow example

Now that you've configured CI to build your application and CD to deploy it, here is an example of the day-to-day workflow.

1. Modify the `main.go` file in your hello-world application's git repo. Edit the message in the last `fmt.Fprintf` at the very bottom of the file.
1. Commit the change to a feature branch, push it, and create a pull request.
1. After your pull request passes CI and has the necessary number of approvals, merge it to `master`.
1. This triggers another round of CI, which you can watch on the PipelineRuns page of the Tekton dashboard hosted at `/dispatch/tekton/`.
1. As the final step of that CI run, a new pull request is opened against the GitOps repository at https://github.com/your-github-user/cicd-hello-world-gitops
1. Review and merge that pull request.
1. Wait 180 seconds, or navigate to the Argo CD UI at `/dispatch/argo-cd`, then select the hello-world application and hit `Refresh`. This triggers deployment of the latest Docker image.
 1. Open the `/hello-world` URL relative to your cluster URL and notice that the page now shows your updated message.

# How to Set Up a GitOps Repository

First, we need to create a git repository for GitOps. Going forward, we omit "git" and refer to this repository as the "GitOps repository".

1. Log in to your account at [https://github.com](https://github.com).
1. Visit [https://github.com/mesosphere/cicd-hello-world-gitops](https://github.com/mesosphere/cicd-hello-world-gitops) and fork the repository to your own GitHub account. For this tutorial, we assume that the GitOps repository is **public**. Dispatch will deploy the Kubernetes manifests defined in this GitOps repository to your cluster.
1. You now have a GitOps repository at [https://github.com/your-github-user/cicd-hello-world-gitops](https://github.com/your-github-user/cicd-hello-world-gitops).

The GitOps repository at [https://github.com/your-github-user/cicd-hello-world-gitops](https://github.com/your-github-user/cicd-hello-world-gitops) now contains the Kubernetes manifests describing how to deploy the hello-world application on your cluster. We assume that the GitHub credentials used when you configured Dispatch grant write access to this new repository, since we will be updating the GitOps repository as the final step of the hello-world application's CI, as defined in its Dispatchfile.

The hello-world application sources can be found at [https://github.com/mesosphere/cicd-hello-world](https://github.com/mesosphere/cicd-hello-world) and were used in the [Dispatch Installation](../../../install/), [Setting up a repository to use Dispatch](../../ci_tutorials/repo-setup/), and [Pipeline Configuration Reference](../../../references/pipeline-config-ref/) examples elsewhere in the Dispatch documentation. If you have followed the [Dispatch Installation](../../../install/) and [Setting up a repository to use Dispatch](../../ci_tutorials/repo-setup/) tutorials, your local `cicd-hello-world` git repository will be up-to-date and ready to follow along.

For this tutorial, we focus on the Continuous Deployment part of CI/CD.

In this tutorial, the GitOps repository is public. If it was a private repository, you would need to create a new GitHub Personal Access Token that
grants READ access to the GitOps repository. You would then add that access token using the following command:

```sh
dispatch gitops creds add https://github.com/your-github-user/cicd-hello-world-gitops --username your-github-user --token $GITOPSTOKEN
```

Next, we need to add our GitOps repository to Dispatch so that it knows
to keep our cluster in sync with the Kubernetes manifests in the repository.

If you already have a service account, say `team-1`, that is configured with a
GitHub Personal Access Token that you want to use to administer webhooks on the
GitOps repository, you can reuse it as follows:

```sh
dispatch gitops app create hello-world --repositoy=https://github.com/your-github-user/cicd-hello-world-gitops --service-account team-1
```

If you want to register new credentials with Dispatch to manage webhooks on the
GitOps repository. Credentials are associated with a serviceaccount. You can create a serviceaccount and associate credentials with it as follows:

```sh
dispatch serviceaccount create team-1
dispatch login github --service-account team-1 --user $YOURGITHUBUSERNAME --token $YOURGITHUBTOKEN
dispatch gitops app create hello-world --repository=https://github.com/your-github-user/cicd-hello-world-gitops --service-account team-1
```

You can now open your browser and navigate to the Argo CD UI. The Argo CD UI is available at the `/dispatch/argo-cd` URL relative to your Kubernetes cluster's URL.

You can see that the hello-world application has been created. If you click on the hello-world application you can see a visualization of the various
Kubernetes resources related to the hello-world application: Ingress, Service, Deployment, ReplicaSet, and Pod. You can further click on any of the resources to view more information. You can see the Kubernetes manifest for each resource and, in the case of the hello-world Pod, you can also view the logs in real-time.

The hello-world application itself is reachable at the `/hello-world` URL relative to your cluster URL.

# How to Automate Image Tag Updates

Looking at the GitOps repository sources, we see two files:

* `application.yaml.tmpl` contains all the Kubernetes manifests that define how the hello-world application should be deployed and configured on the cluster. It contains a special `$({ .imageName })` string which is replaced with the image name and unique SHA256 digest of the Docker image to deploy.
* `application.yaml` is generated from `application.yaml.tmpl` during CI.

In Dispatch Alpha, the regenerate step is performed as part of the hello-world application's CI and is defined in its Dispatchfile. For subsequent releases, the CI and CD phases will not be coupled in this way: the application's Dispatchfile should relate to CI, only, and not be tightly coupled to CD (so that you may deploy the same application to multiple different clusters using different GitOps repositories for each cluster.)

Instead of deploying raw Kubernetes manifests as in this example, the GitOps repository may contain Helm charts, too. In that case, you will have a
`values.yaml` file specifying an image tag, and a `values.yaml.tmpl` where the image tag is replaced with the `$({ .imageName })` placeholder string. During CI, when the pull request is created against the GitOps repository, the `values.yaml.tmpl` file will be evaluated and the `$({ .imageName })` placeholder string will be replaced by the unique SHA256 digest of the new Docker image generated as part of the hello-world application's CI, and the resulting file contents will overwrite the `values.yaml` file.

The use of template files allows you to mark specific parts of your Kubernetes configuration files (for example, `values.yaml` or `application.yaml`) and have those parts dynamically replaced as part of a successful CI build, with the changes turned into pull requests against your GitOps repository.

# How to Open a PR Against GitOps Repository

We will now modify your application's Dispatchfile to open a pull request against the GitOps repository and update the Docker image digest. We will execute this task when commits are pushed to the `master` branch, or equivalently, when a PR is merged into the `master` branch.

1. First, we define the GitOps repository as a "resource" in the Dispatchfile. Add the following definition to the top of your Dispatchfile (replace `your-user` with your GitHub username):

```bash
resource "gitops-git": {
  type: "git"
  param url: "https://github.com/your-github-user/cicd-hello-world-gitops"
}
```

1. Add the following task to your hello-world application's Dispatchfile, using your actual DockerHub username:

```bash
task "deploy": {
  inputs: ["docker-image", "gitops-git"]
  steps: [
    {
      name: "update-gitops-repo"
      image: "mesosphere/update-gitops-repo:1.2.0"
      workingDir: "/workspace/gitops-git"
      args: [
        "-git-revision=$(context.git.commit)",
        "-substitute=imageName=your-dockerhub-user/hello-world@$(inputs.resources.docker-image.digest)"
      ]
    }
  ]
}
```

1. Next, in the `actions` section of your Dispatchfile, add the `deploy` task to the list of tasks to run when new commits are pushed to the `master` branch.

    Change this:

    ```bash
    actions: [
      {
        tasks: ["build"]
        on push branches: ["master"]
      },
      ...
    ]
    ```

    To this:

    ```bash
    actions: [
      {
        tasks: ["build", "deploy"]
        on push branches: ["master"]
      },
      ...
    ]
    ```

    If you are unsure exactly what changes to make, you can have a look at the diff here: [https://github.com/mesosphere/cicd-hello-world/compare/step_3...step_4](https://github.com/mesosphere/cicd-hello-world/compare/step_3...step_4)

    Make this change on a feature branch of your hello-world application git repository, not your hello-world-gitops repository.

1. Submit  your change as a pull request to your own hello-world git repository, and merge the pull request into the `master` branch. When the pull
request is merged to your `master` branch, Dispatch will perform the `build` and `deploy` tasks. The `build` task will build a new docker image and push it to DockerHub as `your-dockerhub-user/hello-world`. The `deploy` task will open a new pull request against your GitOps repository to update the Docker image digest in the `application.yaml` with the Docker image name and exact docker image digest of the new Docker image that was built as part of the `build` task.

1. After you've merged the pull request to your hello-world application's git repository, you can visit the `/dispatch/tekton/` URL relative to your cluster URL, choose the **PipelineRuns** tab, and notice that a `master` branch build has been triggered.

1. The final step of the PipelineRun is our new `deploy` task. After it completes, it will print the URL of the pull request against your GitOps repository. If you have Slack integration enabled for your GitOps repository, you will see a notification that a new pull request has been created.

## How to Deploy the Application after GitOps Repository is Updated

After you have reviewed the pull request against your GitOps repository, merge it to the `master` branch.

At this point, the GitOps repository has been modified. We expect Argo CD to pick up that there were changes (specifically, the Docker image digest has been updated). After it does, it will compare the configuration as defined in the GitOps repository with the configuration running in the cluster and notice that the cluster is Out Of Sync with the GitOps repository.

For Dispatch Alpha, the GitOps repository is automatically scanned for changes every 180 seconds. You can trigger a manual refresh using the Argo CD UI at `/dispatch/argo-cd` by clicking to the hello-world application and hitting Refresh in the action bar at the top of the page.

For Dispatch Beta we will use webhooks to trigger a refresh whenever the GitOps repository is updated.

You have now configured deployment of your hello-world application to your cluster using GitOps. You can test the pipeline by modifying the message
displayed on the `/hello-world` page.

1. Open the `main.go` file in the hello-world git repository and change the last `fmt.Fprintf` statement to print a message of your choice.
1. Commit your change to a new feature branch, create a pull request from your feature branch, and merge it to `master`.
1. After the `master` CI build succeeds, you can see a new pull request was get created against the GitOps repository.
1. Merge it, then trigger an Refresh in the Argo CD UI (or wait ~180s) to see Argo CD pick up the change and deploy it.

After deployment, you can visit the `/hello-world` URL relative to your cluster URL to see the new message displayed.

# How to Deploy to an External Cluster

By default, applications are deployed to the same cluster that Dispatch is installed on. However, you can deploy your application to an external cluster.

Add the external cluster to Dispatch. You must have the a kubernetes context for accessing the target cluster already configured. For more information on contexts, see [the official documentation](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/).

1. If you are using Konvoy, the current cluster's context will be available from when you initially ran `konvoy apply kubeconfig` after you created your cluster.
You can see what contexts are available to be added to Dispatch by running the following command:

    ```bash
    dispatch gitops cluster add --list-available
    ```

1. This will print a list of available Kubernetes contexts, with the current context marked with an asterisk (`*`). Take note of the cluster you would like to deploy to and copy the field under `NAME`.

1. To add that cluster to Dispatch, run the following:

    ```bash
    dispatch gitops cluster add your-cluster-auth@your-cluster
    ```

1. Replace `your-cluster-auth@your-cluster` with the value of the `NAME` field you copied above.

    Executing this command will cause Dispatch to create a new service account `argocd-manager` on that cluster. It will also create a `argocd-manager-role`
    ClusterRole and `argocd-manager-role-binding` ClusterRoleBinding to provide that role to the `argocd-manager`. This service account will be used to deploy,
    monitor and manage applications deployed from this Dispatch instance onto the cluster.

1. You can see the new cluster has been added to Dispatch by running:

    ```bash
    dispatch gitops cluster list
    ```

1. Take note of the `SERVER` field value corresponding to the new cluster. In order to deploy our application to the target cluster we specify the
`--dest-server` flag when creating our GitOps application.

    ```bash
    dispatch gitops app create hello-world-2 --repository=https://github.com/your-github-user/cicd-hello-world-gitops --service-account team-1 --dest-server https://your-target-cluster.com
    ```

1. Replace `your-user` with your GitHub user, and `https://your-target-cluster.com` with the value of the `SERVER` field taken from the previous command's output.
