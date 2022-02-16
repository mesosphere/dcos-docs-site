---
layout: layout.pug
navigationTitle: Create a Git Repository
title: Create a Git Repository
menuWeight: 10
beta: false
excerpt: Create a Git Repository in the Workspace namespace
---

Use the CLI to create the GitRepository resource and add a new repository to your Workspace.

1.  Refer to [air-gapped environment setup instructions](../../../../../install/air-gapped/catalog), if you are running in air-gapped environment.

1.  Set the `WORKSPACE_NAMESPACE` environment variable to the name of your workspace's namespace:

    ```sh
    export WORKSPACE_NAMESPACE=<workspace_namespace>
    ```

1.  Adapt the URL of your Git repository.

    ```sh
    kubectl apply -f - <<EOF
    apiVersion: source.toolkit.fluxcd.io/v1beta1
    kind: GitRepository
    metadata:
      name: example-repo
      namespace: ${WORKSPACE_NAMESPACE}
    spec:
      interval: 1m0s
      ref:
        branch: <your-target-branch-name> # e.g., main
      timeout: 20s
      url: https://github.com/<example-org>/<example-repo>
    EOF
    ```

1.  Ensure the status of the `GitRepository` signals a ready state:

    ```sh
    kubectl get gitrepository example-repo -n ${WORKSPACE_NAMESPACE}
    ```

The repository commit also displays the ready state:

```sh
NAME         URL                                                        READY   STATUS                                                              AGE
example-repo https://github.com/example-org/example-repo                True    Fetched revision: master/6c54bd1722604bd03d25dcac7a31c44ff4e03c6a   11m
```

For more information on the GitRepository resource fields and how to make Flux aware of credentials required to access a private Git repository, see the [Flux documentation][flux_gitrepo].

## Troubleshoot

To troubleshoot issues with adding the GitRepository, review the following logs:

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

[flux_gitrepo]: https://fluxcd.io/docs/components/source/gitrepositories/
[flux_website]: https://fluxcd.io
[flux_docs]: https://fluxcd.io/docs
