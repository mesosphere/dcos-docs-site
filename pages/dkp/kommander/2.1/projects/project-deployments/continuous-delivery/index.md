---
layout: layout.pug
beta: false
navigationTitle: Continuous Deployment
title: Continuous Deployment
menuWeight: 30
excerpt: Continuous Deployment
---

After installing Kommander and [configuring your project and its clusters](../../), navigate to the **Continuous Deployment (CD)** tab under your Project. Here you create a GitOps source which is a source code management (SCM) repository hosting the application definition. D2iQ recommends that you create a secret first then create a GitOps source accessed by the secret.

## Create a general Git repository for application definitions

To create a GitOps source, you first need to create a general Git repository to contain your application definitions and Flux resources. You can find more information about Flux and the supported [custom resources](https://fluxcd.io/docs/concepts/#reconciliation) in the [documentation](https://fluxcd.io/docs/concepts/).

Flux also offers some [suggestions](https://fluxcd.io/docs/guides/repository-structure/) about how to structure your Git repository for the best GitOps experience.

## Set up a secret for accessing GitOps

Create a secret that Kommander uses to deploy the contents of your GitOps repository:

<p class="message--note"><strong>NOTE: </strong>This dialog box creates a <code>types.kubefed.io/v1beta1, Kind=FederatedSecret</code> and this is not yet supported by DKP CLI. Use the GUI, as described above, to create a federated secret or create a <code>FederatedSecret</code> manifest and apply it to the project namespace. Learn more about <a href="../../project-secrets/">FederatedSecrets</a>.</p>

Kommander secrets (for CD) can be configured to support any of the following three authentication methods:

- HTTPS Authentication (described above)
- HTTPS self-signed certificates
- SSH Authentication

The following table describes the fields required for each authentication method:

| HTTP Auth  | HTTPS Auth (Self-signed) | SSH Auth     |
| -----------| ------------------------ | ------------ |
| username   | username                 | identity     |
| password   | password                 | identity.pub |
|            | caFile                   | known_hosts  |

<!-- Refer https://fluxcd.io/docs/components/source/gitrepositories/#spec-examples for flux examples (not everything in there is supported) -->

If you are using GitOps by using a GitHub repo as your source, you can create your secret with a [personal access token][github-token].
Then, in the DKP UI, in your project, create a Secret, with a key:value pair of `password`: `<your-token-created-on-github>`.
If you are using a GitHub personal access token, you do not need to have a key:value pair of `username`: `<your-github-username>`.

If you are using a secret with your GitHub username and your password, you will need one secret created in the DKP UI, with key:value pairs of `username`: `<your-github-username>` and `password`: `<your-github-username>`.
**Note:** if you have multi-factor authentication turned on in your GitHub account, using your GitHub username and password will not work.

<p class="message--important"><strong>NOTE: </strong>If you are using a public GitHub repository, you do not need to use a secret.</p>

## Create GitOps Source

After the secret is created, you can view it in the `Secrets` tab. Configure the GitOps source accessed by the secret.

<p class="message--important"><strong>NOTE: </strong>If using an SSH secret, the SCM repo URL needs to be an SSH address. It does not support SCP syntax. The URL format is <code>ssh://user@host:port/org/repository</code>.</p>

It takes a few moments for the GitOps Source to be reconciled and the manifests from the SCM repository at the given path to be federated to attached clusters. After the sync is complete, manifests from GitOps source are created in attached clusters.

After a GitOps Source is created, there are various commands that can be executed from the CLI to check the various stages of syncing the manifests.

On the management cluster, check your `GitopsRepository` to ensure that the `CD` manifests have been created successfully.

```bash
kubectl describe gitopsrepositories.dispatch.d2iq.io -n<PROJECT_NAMESPACE> gitopsdemo
```

```sh
Name:         gitopsdemo
Namespace:    <PROJECT_NAMESPACE>
...
Events:
  Type    Reason               Age    From                        Message
  ----    ------               ----   ----                        -------
  Normal  ManifestSyncSuccess  1m7s  GitopsRepositoryController  manifests synced to bootstrap repo
...
```

On the attached cluster, check for your `Kustomization` and `GitRepository` resources. The `status` field reflects the syncing of manifests:

```bash
kubectl get kustomizations.kustomize.toolkit.fluxcd.io -n<PROJECT_NAMESPACE> <GITOPS_SOURCE_NAME> -oyaml
```

```yaml
...
status:
  conditions:
  - reason: ReconciliationSucceeded
    status: "True"
    type: Ready
    ...
...
```

Similarly, with `GitRepository` resource:

```bash
kubectl get gitrepository.source.toolkit.fluxcd.io -n<PROJECT_NAMESPACE> <GITOPS_SOURCE_NAME> -oyaml
```

```yaml
...
status:
  conditions:
  - reason: GitOperationSucceed
    status: "True"
    type: Ready
    ...
...
```

If there are errors creating the manifests, those events are populated in the status field of the `GitopsRepository` resource on the management cluster and the `GitRepository` and `Kustomization` resources on the attached cluster(s).

## Suspend GitOps Source

There may be times when you need to suspend the auto-sync between the GitOps repository and the associated clusters. This _live debugging_ may be necessary to resolve an incident in the minimum amount of time without the overhead of pull request based workflows. Select **Suspend** to manually suspend the GitOps reconciliation.

This lets you use `kubectl`, `helm`, or another tool to resolve the issue. After the issue is resolved select **Resume** to sync the updated contents of the GitOps source to the associated clusters.

Similar to **Suspend/Resume**, you can use the **Delete** action to remove the GitOps source. Removing the GitOps source results in removal of all the manifests applied from the GitOps source.

You can have more than one GitOps Source in your Project to deploy manifests from various sources.

Kommander deployments are backed by FluxCD. Please refer to Flux [Source Controller](https://fluxcd.io/docs/components/source/) and [Kustomize controller](https://fluxcd.io/docs/components/kustomize/) docs for advanced configuration and more examples.

[github-token]: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
