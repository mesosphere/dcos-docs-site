---
layout: layout.pug
navigationTitle: Release Notes for Kaptain 2.1.0
title: Release Notes for Kaptain 2.1.0
menuWeight: 5
beta: false
excerpt: View release-specific information for Kaptain
---

**D2iQ&reg; Kaptain&reg; version 2.1.0 was released on April 26, 2022.**

To get started with Kaptain, [download](../../download) and [install](../../install) the latest version of Kaptain.

# Release Summary

D2iQ is announcing Kaptain 2.1 which includes several user experience features, additional platforms supported, and resolves reported issues. This continues our tradition of customer-led development making Kaptain even easier to deploy, supporting more platforms, and incorporating the latest innovations from the open source community in the hot AI/ML marketplace. Kaptain 2.1 supports Kubeflow 1.5 and a new version of the Kaptain SDK, 1.0.1. For more information on SDK 1.0.1, see [SDK release notes](../../sdk/1.0.x/release-notes).

## New features and capabilities

### Restrict access to Kaptain by establishing a list of allowed groups

You can authenticate and enable users and user groups to access Kaptain by linking your Kaptain's Dex instance to an [identity provider][ident] of your choice. From this release on, you have the option of adding or removing groups (that are established in your identity provider) to the `AllowList` to further restrict access to your Kaptain instance.

## Fixes and Improvements

* 

## Software updates

- 

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

[ident]: ../../user-management/identity-providers/
