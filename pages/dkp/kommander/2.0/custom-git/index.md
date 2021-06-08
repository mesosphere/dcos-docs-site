---
layout: layout.pug
navigationTitle: Custom git repositories
title: Custom git repositories
menuWeight: 9
excerpt: How to deploy a new GitRepository to drive custom GitOps
---

Use the Kommander components to deploy custom third-party applications from Git repositories. While Kommander is still in beta most of the steps outlined here make use of the underlying components. In future versions you will be able to use the Kommander API to better manage this goal.

## Accessing attached clusters

To access a cluster attached to Kommander using kubectl, you save the cluster's kubeconfig from Kommander. The following example commands save the kubeconfig from the cluster cluster1 in the workspace example-workspace:

```sh
# get the workspace's namespace
NS=$(kubectl get workspace "example-workspace" -o jsonpath='{.status.namespaceRef.name})

# using the namespace fetch the target cluster's secret holding the kubeconfig
SECRET=$(kubectl get komm -n "${NS}" "cluster1" -o jsonpath='{.spec.kubeconfigRef.name}')

# now save the kubeconfig
kubectl -n "${NS}" get secret "${SECRET}" -o go-template='{{.data.kubeconfig | base64decode}}' > cluster1-kubeconfig
```

## Consuming public git repositories on a cluster

In order connect Flux to a Git repository for GitOps, create a GitRepository and a Kustomization object on a cluster and make sure to adapt the URL to your needs:

```sh
k apply -f - <<EOF
apiVersion: source.toolkit.fluxcd.io/v1beta1
kind: GitRepository
metadata:
  name: local
spec:
  interval: 1m0s
  ref:
    branch: main
  timeout: 20s
  url: https://github.com/example-org/example-repo
EOF
```

Now that Flux is aware of the Git repository, use it to create resources from a specified path in the Git repository:

```sh
k apply -f - <<EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: c1
spec:
  interval: 1m0s
  path: ./clusters/c1
  sourceRef:
    kind: GitRepository
    name: local
EOF
```

Now Flux picks up all resources pointed to by the /clusters/c1/ directory in the Git repository and creates them on the cluster.

Find further information on the various fields of the GitRepository and Kustomization resources as well as additional ways to configure Flux, for example to access private git repositories, in the [Flux Documentation][flux_docs].

[flux_docs]: https://fluxcd.io/docs
