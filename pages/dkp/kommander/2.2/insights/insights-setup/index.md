---
layout: layout.pug
navigationTitle: Insights Setup and Configuration
title: Insights Setup and Configuration
excerpt: Enable DKP Insights Engine
menuWeight: 20
beta: false
enterprise: false
techPreview: true
---

DKP Insights Management is installed by default on your Mangement Cluster. 

DKP Insights Engine needs to be enabled manually on each Attached cluster to receive insight items on the Insight Dashboard.

## Enable the DKP Insights Engine


1. Add DKP Insights Engine Addon 

   Apply yaml to your Management cluster from the CLI

```bash
kubectl apply -f - <<EOF
apiVersion: source.toolkit.fluxcd.io/v1beta1
kind: GitRepository
metadata:
  name: insights-catalog-applications
  namespace: kommander
  labels:
    kommander.d2iq.io/gitapps-gitrepository-type: dkp
    kommander.d2iq.io/workspace-default-catalog-repository: "true"
spec:
  interval: 1m0s
  ref:
    branch: main
  timeout: 20s
  url: https://github.com/mesosphere/insights-catalog-applications
EOF
``` 
   This grants all Attached clusters the ability to enable the Insights Engine, and DKP Insights icon appears under Applications.

1. Enable the DKP Insights Engine on each Attached cluster from the DKP UI by selecting: Cluster -> Applications -> Options Menu -> Enable -> Deploy with defaults.
   
   **Note**: The option for *Enable Another Instance* is not supported in this Preview release.
   
