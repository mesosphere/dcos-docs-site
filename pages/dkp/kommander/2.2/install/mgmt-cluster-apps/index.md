---
layout: layout.pug
navigationTitle: Management cluster application requirements
title: Management cluster application requirements
menuWeight: 40
excerpt: Management cluster application minimum resources and storage requirements
beta: false
enterprise: true
---
This section only details requirements for management cluster-specific applications. For the list of all platform applications, see [Platform Application Configuration Requirements](../../workspaces/applications/platform-applications/platform-application-requirements/).

This table describes the workspace platform applications specific to the management cluster, minimum resource requirements, and minimum persistent storage requirements.

| Common Name       | Application Name          | Minimum Resources Suggested | Minimum Persistent Storage Required |
|-------------------|---------------------------|-----------------------------|-------------------------------------|
| Grafana           | centralized-grafana       | cpu: 200m memory: 100Mi     |                                     |
| Kubecost          | centralized-kubecost      | cpu: 1200m memory: 4151Mi   | # of PVs: 1 PV sizes: 32Gi          |
| Chartmuseum       | chartmuseum               |                             | # of PVs: 1 PV sizes: 2Gi           |
| Dex               | dex                       | cpu: 100m memory: 50Mi      |                                     |
| Dex Authenticator | dex-k8s-authenticator     | cpu: 100m memory: 128Mi     |                                     |
| Gitea             | gitea                     | cpu: 500m memory: 512Mi     | # of PVs: 2 PV sizes: 10Gi          |
| Karma             | karma                     |                             |                                     |
| Flux              | kommander-flux            | cpu: 4000m memory: 4Gi      |                                     |
| Kubefed           | kubefed                   | cpu: 300m memory: 192Mi     |                                     |
| Thanos            | thanos                    |                             |                                     |
| Traefik ForwardAuth | traefik-forward-auth-mgmt | cpu: 100m memory: 128Mi     |                                     |
