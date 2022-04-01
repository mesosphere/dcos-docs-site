---
layout: layout.pug
navigationTitle: Insights setup and configuration
title: Insights setup and configuration
excerpt: Enable DKP Insights in managmenet and attached/managed clusters
menuWeight: 20
beta: false
enterprise: false
techPreview: true
---

DKP Insights is installed by default on your Management Cluster, and then you need to manually enable the DKP Insights Engine in order to begin viewing insight items for your environment.

## Enable the DKP Insights engine

To enable DKP Insights:

1.  Apply yaml on your management cluster from the CLI:

   ```bash
   export WORKSPACE_NAMESPACE=kommander

   kubectl apply -f - <<EOF
   apiVersion: source.toolkit.fluxcd.io/v1beta1
   kind: GitRepository
   metadata:
    name: insights-catalog-applications
    namespace: ${WORKSPACE_NAMESPACE}
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

   This provides all attached clusters the ability to enable the Insights Engine, and DKP Insights icon appears under Applications.

1. Enable the DKP Insights engine on each attached or managed cluster from the DKP UI by selecting: Cluster -> Applications -> Options Menu -> Enable -> Deploy with defaults.

## Upgrade Insights engine

<add process/command if relevent or delete this section if not>
