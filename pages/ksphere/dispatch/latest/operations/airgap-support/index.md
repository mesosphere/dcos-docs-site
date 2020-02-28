---
layout: layout.pug
navigationTitle:  Airgap Support
title: Dispatch In Airgapped Clusters
menuWeight: 30
beta: false
excerpt: Using Dispatch in Airgapped clusters
---

Dispatch is supported in airgapped deployments of Konvoy. See [Konvoy's install documentation](https://docs.d2iq.com/ksphere/konvoy/latest/install/install-airgapped/) for instructions on setting up an airgapped deployment.

# Limitations

If a `Task` created in a pipeline specifies `args` but not `command`, then the Tekton controller will attempt to fetch the image specified in the `Task`'s `Step` from the registry. As the Tekton controller is not able to read the containerd mirrors file (and does not support containerd mirrors, even if it could), it does not respect the mirrors configured in contanierd.

To workaround this, ensure that all `Task` `Steps` specify the `command` and not only `args`.

Good example:

```bash
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

```bash
tasks:
  test:
    steps:
    - name: test
      image: alpine/git
      args:
      - pull
```
