---
layout: layout.pug
navigationTitle: Install
title: Install
featureMaturity:
excerpt: Install Konvoy with Kommander
category: K-Sphere
menuWeight: 5
---

### Introduction

Kommander is installed and deployed alongside the multicluster version of Konvoy. Kommander is distributed as a [Konvoy Addon](/ksphere/konvoy/latest/concepts/#platform-service-addons) but a manual installation can be completed by using Helm to install the [Kommander charts](https://github.com/mesosphere/charts/tree/master/stable/kommander):

Add the charts to Helm:

`helm repo add mesosphere-stable https://mesosphere.github.io/charts/stable`

You can then run `helm search mesosphere-stable` to see the available charts, including `mesosphere-stable/kommander`

### Cluster Resource Requirements

The minimum cluster size requirements for the Konvoy management cluster already account for the minimum requirements for Kommander. The specific request size for the Kommander pod is 256Mi and 0.1 CPU with a limit of 512Mi and 0.5 CPU.

### Obtaining Konvoy with Kommander

[Sign up to be notified](https://d2iq.com/solutions/ksphere/kommander#get-notified) about Kommander availability and then see the detailed instructions found at the [Konvoy installation guide](/ksphere/konvoy/latest/install/)

### Logging in with Username and Password

After you provision your first Konvoy cluster, your username, password, and a URL to Konvoy is displayed on the command-line. Once logged in to Konvoy, you should see a button labelled "Try Kommander Beta!" at the top of the page. If not, ensure you have installed the Konvoy release that includes Kommander.

![Try Kommander button](/ksphere/kommander/img/try-kommander-beta.png)

### Upgrading the Kommander Deployment

To upgrade to a specific version of Kommander, edit the Kommander deployment and change

`.spec.template.spec.containers[0].image` to a specific version such as `mesosphere/kommander:1.8`

Using the edit command:

`kubectl edit deployment opsportal-kubeaddons-kommander -nkubeaddons`

### Restarting the Kommander Pod

Scale the kommander deployment to 0:

```
kubectl scale --replicas=0 deployment/opsportal-kubeaddons-kommander -nkubeaddons
```

and then scale it back to 1:

```
kubectl scale --current-replicas=0 --replicas=1 deployment/opsportal-kubeaddons-kommander -nkubeaddons
```
