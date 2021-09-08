---
layout: layout.pug
navigationTitle: Deploy applications using GitOps
title: Deploy applications using GitOps
menuWeight: 50
excerpt: How to deploy a new GitRepository to drive custom GitOps
beta: false
---

Kommander uses Flux to manage services deployed from an internal Git repository. You can also use that Flux instance to deploy custom third-party applications from other Git repositories. When a cluster is attached to Kommander, Kommander installs [Flux][flux_website] onto the attached cluster in the `kommander-flux` namespace. The steps outlined here use these installed Flux components directly.

## Access attached clusters

To access a cluster attached to Kommander using kubectl, save the cluster's kubeconfig from Kommander. The following example commands save the kubeconfig file from the cluster 'cluster1' to the workspace 'example-workspace':

```sh
# get the workspace's namespace
WORKSPACE_NAMESPACE=$(kubectl get workspace "example-workspace" -o jsonpath='{.status.namespaceRef.name})

# using the namespace fetch the target cluster's secret holding the kubeconfig
SECRET=$(kubectl get komm -n "${WORKSPACE_NAMESPACE}" "cluster1" -o jsonpath='{.spec.kubeconfigRef.name}')

# now save the kubeconfig
kubectl -n "${WORKSPACE_NAMESPACE}" get secret "${SECRET}" -o go-template='{{.data.kubeconfig | base64decode}}' > cluster1-kubeconfig
```

## Consume public Git repositories on a cluster

To connect Flux to a Git repository for GitOps, create a GitRepository and a Kustomization object on a cluster, then adapt the URL to your needs:

```sh
kubectl apply -f - <<EOF
apiVersion: source.toolkit.fluxcd.io/v1beta1
kind: GitRepository
metadata:
  name: example-repo
spec:
  interval: 1m0s
  ref:
    branch: main
  timeout: 20s
  url: https://github.com/<example-org>/<example-repo>
EOF
```

For more information on the GitRepository resource fields and how to make Flux aware of credentials required to access a private Git repository, see the [Flux documentation][flux_gitrepo]. Now that Flux is aware of the Git repository, use it to create resources from a specified path in the Git repository:

```sh
kubectl apply -f - <<EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: c1
spec:
  interval: 1m0s
  path: ./clusters/c1
  prune: true
  sourceRef:
    kind: GitRepository
    name: example-repo
EOF
```

Flux then picks up all resources from /clusters/c1/ directory in the Git repository and creates them on the cluster. For more information on Flux Kustomization, see the [Flux documentation][flux_kustomization].

```sh
kubectl get gitrepository example-repo
```

When this finishes, the status of both the GitRepository and the Kustomization signals a ready state. The repository's commit also displays the ready state:

```sh
NAME         URL                                                        READY   STATUS                                                              AGE
example-repo https://github.com/example-org/example-repo                True    Fetched revision: master/6c54bd1722604bd03d25dcac7a31c44ff4e03c6a   11m
```

The same goes for the Kustomization object:

```sh
kubectl get kustomization c1
```

The command generates the following output:

```sh
NAME   READY   STATUS                                                            AGE
c1     True    Applied revision: main/6c54bd1722604bd03d25dcac7a31c44ff4e03c6a   8s
```

The examples above create the GitRepository and Kustomization in the default namespace. You can create them in any namespace because Flux as installed by Kommander is configured to watch all namespaces.  Deployment of a sample application can be found [here][podinfo_app_deployment].

For more information on how to get started with Flux, see [getting started guide][flux_get_started].

## Troubleshoot

If you run into any issues using a 3rd-party repository, there are mainly 3 Flux pods to review logs:

```sh
$ kubectl -n kommander-flux logs -l app=source-controller
[...]
$ kubectl -n kommander-flux logs -l app=kustomize-controller
[...]
$ kubectl -n kommander-flux logs -l app=helm-controller
[...]
```

[flux_website]: https://fluxcd.io
[flux_gitrepo]: https://fluxcd.io/docs/components/source/gitrepositories/
[flux_kustomization]: https://fluxcd.io/docs/components/kustomize/kustomization/
[flux_docs]: https://fluxcd.io/docs
[flux_get_started]: https://fluxcd.io/docs/get-started/
[podinfo_app_deployment]: https://github.com/fluxcd/flux-get-started/blob/master/workloads/podinfo-dep.yaml
