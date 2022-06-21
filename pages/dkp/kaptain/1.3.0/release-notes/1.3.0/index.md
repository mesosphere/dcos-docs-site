---
layout: layout.pug
navigationTitle:  Release Notes for Kaptain 1.3.0
title: Release Notes for Kaptain 1.3.0
menuWeight: 5
beta: false
excerpt: View release-specific information for Kaptain
---

**D2iQ&reg; Kaptain&reg; version 1.3 was released on January 19, 2022.**

To get started with Kaptain, [download](../../download) and [install](../../install) the latest version of Kaptain.

# Release Summary
This release provides new features and capabilities that improve user experience, resolves reported issues, and maintains compatibility and support for upgraded packages. This release supports Kubeflow 1.4 and a new version of the Kaptain SDK, 1.0.0. For more information on SDK 1.0.0, see [SDK release notes](../../sdk/1.0.x/release-notes).

## New features and capabilities

### Garbage Collection

Kaptain 1.3 supports automatic cleanup of completed and idling workloads. This prevents new workflows or versioned deployments from encountering a lack of resources and unnecessary pressure on controllers. Users will not reach namespace quotas, often set by administrators, as quickly. 
Garbage collection allows users to configure cleanup of Kubeflow Pipeline runs and culling for Jupyter notebooks. Resources are automatically cleaned up when a cell execution is interrupted. Also, using the SDK, users can see how certain resources were created (for example, by a user or by the SDK).
For information on what resources are created during each phase of the model development lifecycle and how to use garbage collection, see [SDK](../../sdk/1.0.x/) and [SDK Troubleshooting](../../sdk/1.0.x/troubleshooting/).
For examples of garbage collection for Katib experiments, see the [Hyperparameter Tutorial](../../tutorials/katib/).

### Support for model building/deploying using non-deep learning frameworks

With Kaptain SDK version 1.0.0, users can build and deploy models using frameworks even if they are not supported in Kaptain. The SDK API is made more generic by using Kubernetes Jobs.
For an example using scikit-learn, see [Quickstart Tutorial](../../tutorials/sdk/quick-start/)

### Models page

Kaptain version 1.3 has a new 'Models' page for managing model servers.

### Kaptain support on DKP 2.1

Kaptain 1.3 is supported on version 2.1 of DKP, D2iQ's enterprise Kubernetes platform, in both non-air-gapped and air-gapped environments. For more information on DKP, view Konvoy and Kommander documentation on [docs.d2iq.com](https://docs.d2iq.com/).
In DKP 2.1, Kaptain's dependencies are managed through Kommander, the centralized management plane of DKP which handles application deployments.

## Fixes and Improvements

* Fixed Kaptain redirectUrl is missing the hostname (COPS-7138)

* Fixed the issue with a notebook that does not mount notebook volume on the correct mount point (COPS-7064)

* Document how to use `requirements.txt` to add additional python dependencies to notebooks

  We updated the tutorial to show how to install custom Python packages to model images (COPS-7045)
 
* Fixed installation instructions for DKP 2 (COPS-7061)

* Installation and Upgrade Improvements

  The Kaptain installation and upgrade time has been shortened in 1.3.

* Docker images improvements

  Kaptain 1.3 optimizes custom Docker images by minimizing image size where possible.

## Software updates

* Kubeflow 1.4.0
* Argo Workflows 3.1.6
* Katib 0.12.0
* KFServing 0.6.1
* Percona Kubernetes Operator 1.10.0
* Kubeflow Pipelines 1.7.0
* Training Operator 1.3.0
* Tensorflow 2.5.0
* CUDA 11.2
* MXNet 1.9

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
    kubectl delete secrets kubeflow-gateway-certs -n kubeflow --force
    ```

1.  Obtain the CA from one of the other recreated certs:

    ```bash
    kubectl get secret kommander-traefik-certificate -n kommander -o jsonpath='{.data.ca\.crt}' > ca.crt
    ```

1.  Use this CA and apply it to the Istio CA:

    ```bash
    kubectl delete secret kubeflow-oidc-ca-bundle -n kubeflow --force
    kubectl -n kubeflow create secret generic kubeflow-oidc-ca-bundle --from-file=oidcCABundle\.crt=ca.crt
    ```

Running this command reloads the pod automatically. Wait a few minutes until you attempt to log in to DKP and Kaptain again. 

Test by logging into both and launch a new notebook in Jupyter.
