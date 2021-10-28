---
layout: layout.pug
navigationTitle: Create a GitRepository
title: Create a GitRepository
menuWeight: 10
excerpt: Create a GitRepository in the Project namespace
---
Use the CLI to create the GitRepository resource and add a new repository to your Project, and then adapt the URL as necessary:

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

Ensure the status of the GitRepository signals a ready state:

```sh
kubectl get gitrepository example-repo
```

The repository commit also displays the ready state:

```sh
NAME         URL                                                        READY   STATUS                                                              AGE
example-repo https://github.com/example-org/example-repo                True    Fetched revision: master/6c54bd1722604bd03d25dcac7a31c44ff4e03c6a   11m
```

For more information on the GitRepository resource fields and how to make Flux aware of credentials required to access a private Git repository, see the [Flux documentation][flux_gitrepo].

## Troubleshoot

If you run into any issues adding the GitRepository, there are three primary Flux pods where you can review the logs:

```sh
$ kubectl -n kommander-flux logs -l app=source-controller
[...]
$ kubectl -n kommander-flux logs -l app=kustomize-controller
[...]
$ kubectl -n kommander-flux logs -l app=helm-controller
[...]
```

## Related Information

- [Flux][flux_website]
- [Flux docs][flux_docs]

[flux_gitrepo](https://fluxcd.io/docs/components/source/gitrepositories/)
[flux_website](https://fluxcd.io)
[flux_docs](https://fluxcd.io/docs)
