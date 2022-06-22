---
layout: layout.pug
navigationTitle: Release Notes for Kaptain 2.0.0
title: Release Notes for Kaptain 2.0.0
menuWeight: 5
beta: false
excerpt: View release-specific information for Kaptain
---

**D2iQ&reg; Kaptain&reg; version 2.0.0 was released on April 26, 2022.**

To get started with Kaptain, [download](../../download) and [install](../../install) the latest version of Kaptain.

# Release Summary

D2iQ is announcing Kaptain 2.0 which includes several user experience features, additional platforms supported, and resolves reported issues. This continues our tradition of customer-led development making Kaptain even easier to deploy, supporting more platforms, and incorporating the latest innovations from the open source community in the hot AI/ML marketplace. Kaptain 2.0 supports Kubeflow 1.5 and a new version of the Kaptain SDK, 1.0.1. For more information on SDK 1.0.1, see [SDK release notes](../../sdk/1.0.x/release-notes).

## New features and capabilities

### Added Kaptain as DKP Catalog application

Starting with Kaptain 2.0, it can be easily installed via the DKP workspace catalog in both single and multi-cluster experiences. Kaptain 2.0 is supported on DKP 2.1.2 and later.

### Support for Amazon EKS, Azure AKS and DKP multi-cluster

Kaptain 2.0 can be deployed on attached clusters running on Amazon AWS EKS and Microsoft Azure AKS.  This extends D2iQ’s openness to support Kubernetes platforms beyond DKP with Kaptain.

### Helm based deployment

Kaptain 2.0 now uses helm based deployment which makes it easier to integrate into DKP and other platforms.

### Support for Kubernetes 1.22 and Kubeflow 1.5

Kaptain 2.0 comes with Kubeflow 1.5, which includes expanded user control over mounted volumes, increased visibility into idle notebooks, UI improvements, and improvements to hyperparameter tuning. Kaptain 2.0 also supports Kubernetes 1.22 which contains upstream improvements such as security enhancements.

### Bundle size reduction

Kaptain 2.0 drastically reduces the bundle sizes improving download times, especially for the CPU and GPU bundle:

- Base installation: 31.8 GB (down from 33.2 GB)
- CPU bundle: 12.4 GB (down from 34.3 GB)
- GPU bundle: 17.2 GB (down from 84.7 GB)

## Fixes and Improvements

* Moved from KFServing to KServe
* Fixed the cudatoolkit version regression (COPS-7219)
* Bumped PyTorch to 1.11.0 and CUDA to 11.4 to support modern multi-instance GPUs, such as Nvidia A100 (COPS-7211)

## Software updates

- Kubeflow 1.5.0
- Argo Workflows 3.2.3
- Katib 0.13.0
- KServe 0.7.0
- Percona Kubernetes Operator 1.10.0
- Kubeflow Pipelines 1.8.1
- Training Operator 1.4.0
- Tensorflow 2.8.0
- PyTorch 1.11.0
- CUDA 11.4
- MXNet 1.9
- Horovod 0.24.2

## Known issues

### cert-manager workaround for Kaptain

Some Kommander versions do not properly handle certificate renewal for the Cluster CA and certificates that are created for Kommander applications, which also affects Kaptain. While the effects can vary, the most common failure is the inability to launch Kaptain notebooks in Jupyter.

#### Regenerate the secrets in DKP

A permanent fix for the issue requires upgrading to Kommander 2.2.1 or higher. If you are running other versions of DKP, refer to the cert-manager expiration workaround documentation for DKP [2.1.0](../../../../kommander/2.1/release-notes/2.1.0#cert-manager-expiration-workaround), [2.1.1](../../../../kommander/2.1/release-notes/2.1.1#cert-manager-expiration-workaround) or [2.1.2](../../../../kommander/2.1/release-notes/2.1.2#cert-manager-expiration-workaround) to run a docker container that extends the validity of the Cluster CA to 10 years and fixes the certificate reload issue.

Once this is done, you can fix the issue on Kaptain’s side.

#### Regain access to Kaptain

This gives you back the capability of launching notebooks in Jupyter:

1.  Kaptain has one certificate that you have to delete to force a refresh, and one that you can update manually for Istio:

    ```bash
    kubectl delete secrets kubeflow-gateway-certs -n kaptain-ingress --force
    ```

1.  Obtain the CA from one of the other recreated certs:

    ```bash
    kubectl get secret kommander-traefik-certificate -n kommander -o jsonpath='{.data.ca\.crt}' > ca.crt
    ```

1.  Use this CA and apply it to the Istio CA:

    ```bash
    kubectl delete secret kubeflow-oidc-ca-bundle -n kaptain-ingress --force
    kubectl -n kaptain-ingress create secret generic kubeflow-oidc-ca-bundle --from-file=oidcCABundle\.crt=ca.crt
    ```

Running this command reloads the pod automatically. Wait a few minutes until you attempt to log in to DKP and Kaptain again.

Test by logging into both and launch a new notebook in Jupyter.
