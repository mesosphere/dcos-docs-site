---
layout: layout.pug
navigationTitle: Uninstall Kaptain
title: Uninstall Kaptain
menuWeight: 80
excerpt: Uninstall Kaptain
beta: false
enterprise: false
---

## Uninstall Kaptain

-   Use the following commands to uninstall Kaptain.

    ```bash
    kubectl kudo uninstall --instance kaptain --namespace kubeflow --wait
    kubectl delete operatorversions.kudo.dev kubeflow-1.4.0-1.3.0 --namespace kubeflow
    kubectl delete operators.kudo.dev kubeflow --namespace kubeflow
    ```
