---
layout: layout.pug
navigationTitle:  Air gap support
title: Dispatch in air gapped clusters
menuWeight: 10
beta: false
excerpt: Using Dispatch in air gapped clusters
---

Dispatch is supported in air gapped deployments of Konvoy. See [Konvoy's install documentation](/dkp/konvoy/latest/install/install-airgapped/) for instructions on setting up an air gapped deployment.

# Limitations

If a `Task` created in a pipeline specifies `args` but not `command`, then the Tekton controller will attempt to fetch the image specified in the `Task`'s `Step` from the registry. As the Tekton controller is not able to read the containerd mirrors file (and does not support containerd mirrors, even if it could), it does not respect the mirrors configured in contanierd.

To workaround this, ensure that all `Task` `Steps` specify the `command` and not only `args`.

Good example:

```
tasks:
  test:
    steps:
    - name: test
      image: alpine/git
      command:
      - git
      - pull
```

Bad example:

```
tasks:
  test:
    steps:
    - name: test
      image: alpine/git
      args:
      - pull
```
