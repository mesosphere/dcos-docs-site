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

| Name                      | Minimum Resources Suggested    | Minimum Persistent Storage Required |
| ------------------------- | ------------------------------ | ----------------------------------- |
| centralized-grafana       | cpu: 200m<br />memory: 100Mi   |                                     |
| centralized-kubecost      | cpu: 1200m<br />memory: 4151Mi | # of PVs: 1<br />PV sizes: 32Gi     |
| chartmuseum               |                                | # of PVs: 1<br />PV sizes: 2Gi      |
| dex                       | cpu: 100m<br />memory: 50Mi    |                                     |
| dex-k8s-authenticator     | cpu: 100m<br />memory: 128Mi   |                                     |
| gitea                     | cpu: 500m<br />memory: 512Mi   | # of PVs: 2<br />PV sizes: 10Gi     |
| karma                     |                                |                                     |
| kommander-flux            | cpu: 4000m<br />memory: 4Gi    |                                     |
| kubefed                   | cpu: 300m<br />memory: 192Mi   |                                     |
| thanos                    |                                |                                     |
| traefik-forward-auth-mgmt | cpu: 100m<br />memory: 128Mi   |                                     |
