---
layout: layout.pug
navigationTitle: Install on a small environment
title: Install Konvoy on a small environment
menuWeight: 40
excerpt: Install Konvoy on a small environment
beta: false
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

Konvoy and Kommander can be installed and demoed on an environment having smaller memory, storage, and CPU requirements like a laptop. This topic describes methods for installing Konvoy and Kommander in these environments.

## Prerequisites

Before starting the small environment installation, verify the following:

* [Docker][install_docker] version 18.09.2 or later
* [kubectl][install_kubectl] v1.20.2 or later (for interacting with the running cluster)
* Docker is configured with the following minimum requirements for CPU, memory, and disk:
  * 5 CPUs
  * 12 Gi memory
  * 100 Gi of free disk space
* A `cluster.yaml` file.

<p class="message--note"><strong>NOTE: </strong>To create the <code>cluster.yaml</code> file, run the <code>konvoy init --provisioner docker --cluster-name konvoy-lite-konvoy</code> command. This command creates a <code>cluster.yaml</code> file as well as the necessary ssh keys.</p>

## Konvoy Installation

This version of the installation creates a minimal cluster with 2 worker nodes and 1 control plane node running on Docker. This is a simple Konvoy deployment without the logging stack or Kommander.

1. Edit your `cluster.yaml` file to match the following example:

   ```yaml
   kind: ClusterProvisioner
   apiVersion: konvoy.mesosphere.io/v1beta2
   metadata:
     name: konvoy-lite-konvoy
     creationTimestamp: "2021-03-02T06:01:24Z"
   spec:
     provider: docker
     docker:
       disablePortMapping: false
       controlPlaneMappedPortBase: 46000
       sshControlPlaneMappedPortBase: 22000
       sshWorkerMappedPortBase: 22010
     nodePools:
       - name: worker
         count: 2
         machine:
           imageName: mesosphere/konvoy-base-centos7:v1.7.0
       - name: control-plane
         controlPlane: true
         count: 1
         machine:
           imageName: mesosphere/konvoy-base-centos7:v1.7.0
     sshCredentials:
       user: root
       publicKeyFile: konvoy-lite-konvoy-ssh.pub
       privateKeyFile: konvoy-lite-konvoy-ssh.pem
     version: v1.7.0
   ---
   kind: ClusterConfiguration
   apiVersion: konvoy.mesosphere.io/v1beta2
   metadata:
     name: konvoy-lite-konvoy
     creationTimestamp: "2021-03-02T06:01:24Z"
   spec:
     imageRegistries:
       - server: "https://registry-1.docker.io"
         username: "your-dockerhub-username"
         password: "xxx-yourpassword-xxx"
     autoProvisioning:
       disabled: true
     kubernetes:
       version: 1.20.13
       controlPlane:
         controlPlaneEndpointOverride: 172.17.1.251:6443
         keepalived: {}
       networking:
         podSubnet: 10.254.0.0/16
         serviceSubnet: 10.255.0.0/16
         iptables:
           addDefaultRules: false
       cloudProvider:
         provider: none
       admissionPlugins:
         enabled:
           - AlwaysPullImages
           - NodeRestriction
       preflightChecks:
         errorsToIgnore:
           - SystemVerification
           - filecontent--proc-sys-net-bridge-bridge-nf-call-ip6tables
           - filecontent--proc-sys-net-bridge-bridge-nf-call-iptables
           - swap
       kubelet:
         cgroupRoot: /kubelet
     containerNetworking:
       calico:
         version: v3.17.1
         encapsulation: ipip
         mtu: 1480
     containerRuntime:
       containerd:
         version: 1.3.9
     osPackages:
       enableAdditionalRepositories: true
     nodePools:
       - name: worker
     addons:
       - configRepository: https://github.com/mesosphere/kubernetes-base-addons
         configVersion: stable-1.19-3.2.0
         addonsList:
           - name: ambassador # is currently in Experimental status. More information: https://docs.d2iq.com/dkp/konvoy/latest/version-policy/#experimental-status
             enabled: false
           - name: cert-manager
             enabled: true
           - name: dashboard
             enabled: true
             values: |-
               ---
               resources:
                 limits:
                   cpu: 250m
                   memory: 512Mi
                 requests:
                   cpu: 50m
                   memory: 128Mi
           - name: defaultstorageclass-protection
             enabled: true
           - name: dex
             enabled: true
             values: |
               ---
               resources:
                 limits:
                   cpu: 15m
                   memory: 30Mi
                 requests:
                   cpu: 5m
                   memory: 10Mi
               dex-controller:
                 controller:
                   manager:
                     resources:
                       limits:
                         cpu: 15m
                         memory: 80Mi
                       requests:
                         cpu: 5m
                         memory: 64Mi
           - name: dex-k8s-authenticator
             enabled: true
             values: |-
               ---
               resources:
                 limits:
                   cpu: 10m
                   memory: 30Mi
                 requests:
                   cpu: 5m
                   memory: 10Mi
           - name: elasticsearch
             enabled: false
             values: |-
               ---
               client:
                 replicas: 1
                 resources:
                   limits:
                     cpu: 250m
                     memory: 1800Mi
                   requests:
                     cpu: 100m
                     memory: 1024Mi
               master:
                 replicas: 2
                 resources:
                   limits:
                     cpu: 100m
                     memory: 1500Mi
                   requests:
                     cpu: 50m
                     memory: 1024Mi
               data:
                 replicas: 1
                 resources:
                   limits:
                     cpu: 800m
                     memory: 4196Mi
                   requests:
                     cpu: 500m
                     memory: 3048Mi
                 persistence:
                   size: 10Gi
           - name: elasticsearch-curator
             enabled: false
           - name: elasticsearchexporter
             enabled: false
           - name: external-dns
             enabled: false
           - name: flagger
             enabled: false
           - name: fluentbit
             enabled: false
             values: |-
               ---
               resources:
               limits:
                 cpu: 50m
                 memory: 300Mi
               requests:
                 cpu: 10m
                 memory: 50Mi
           - name: gatekeeper
             enabled: false
           - name: istio # is currently in Experimental status. More information: https://docs.d2iq.com/dkp/konvoy/latest/version-policy/#experimental-status
             enabled: false
           - name: jaeger # is currently in Experimental status. More information: https://docs.d2iq.com/dkp/konvoy/latest/version-policy/#experimental-status
             enabled: false
           - name: kiali # is currently in Experimental status. More information: https://docs.d2iq.com/dkp/konvoy/latest/version-policy/#experimental-status
             enabled: false
           - name: kibana
             enabled: false
             values: |-
               ---
               resources:
                 limits:
                   cpu: 500m
                   memory: 800Mi
                 requests:
                   cpu: 400m
                   memory: 400Mi
           - name: konvoyconfig
             enabled: true
           - name: kube-oidc-proxy
             enabled: true
           - name: localvolumeprovisioner
             enabled: true
           - name: metallb
             enabled: true
             values: |
               ---
               configInline:
                 address-pools:
                 - name: default
                   protocol: layer2
                   addresses:
                   - 172.17.1.200-172.17.1.250
           - name: nvidia
             enabled: false
           - name: opsportal
             enabled: true
             values: |-
               ---
               landing:
                 resources:
                   limits:
                     cpu: 20m
                     memory: 30Mi
                   requests:
                     cpu: 5m
                     memory: 10Mi
               kommander-ui:
                 resources:
                   limits:
                     cpu: 100m
                     memory: 200Mi
                   requests:
                     cpu: 30m
                     memory: 150Mi
           - name: prometheus
             enabled: true
             values: |
               ---
               prometheus-node-exporter:
                 resources:
                   limits:
                     cpu: 20m
                     memory: 30Mi
                   requests:
                     cpu: 10m
                     memory: 10Mi
               prometheus:
                 prometheusSpec:
                   storageSpec:
                     volumeClaimTemplate:
                       metadata:
                         name: db
                       spec:
                         accessModes: ["ReadWriteOnce"]
                         # 50Gi is the default size for the chart
                         resources:
                           requests:
                             storage: 5Gi
                   resources:
                     limits:
                       cpu: 500m
                       memory: 2192Mi
                     requests:
                       cpu: 100m
                       memory: 500Mi
               alertmanager:
                 alertmanagerSpec:
                   resources:
                     limits:
                       cpu: 20m
                       memory: 100Mi
                     requests:
                       cpu: 10m
                       memory: 20Mi
               grafana:
                 resources:
                   limits:
                     cpu: 150m
                     memory: 150Mi
                   requests:
                     cpu: 100m
                     memory: 100Mi
           - name: prometheusadapter
             enabled: true
             values: |
               ---
               resources:
                 limits:
                   cpu: 110m
                   memory: 385Mi
                 requests:
                   cpu: 90m
                   memory: 300Mi
           - name: reloader
             enabled: true
             values: |-
               ---
               reloader:
                 deployment:
                   resources:
                     limits:
                       cpu: 15m
                       memory: 100Mi
                     requests:
                       cpu: 10m
                       memory: 64Mi
           - name: traefik
             enabled: true
             values: |-
               ---
               replicas: 1
               resources:
                 limits:
                   cpu: 170m
                   memory: 100Mi
                 requests:
                   cpu: 10m
                   memory: 64Mi
           - name: traefik-forward-auth
             enabled: true
             values: |-
               ---
               resources:
                 requests:
                   cpu: 10m
                   memory: 32Mi
                   ephemeral-storage: 200Mi
           - name: velero
             enabled: true
             values: |-
               ---
               minio:
                 persistence:
                   size: 2Gi
                 resources:
                   limits:
                     memory: 280Mi
                     cpu: 100m
                   requests:
                     cpu: 20m
                     memory: 60Mi
     version: v1.7.0
   ```

1. Create your cluster using the following command:

   ```bash
   konvoy up --provisioner=docker [--cluster-name <YOUR_SPECIFIED_NAME>]
   ```

   This command creates Docker containers, each of which simulates a cluster host. It then installs the Kubernetes cluster in those Docker containers, and installs default addons to support the Kubernetes cluster.

## Kommander Installation

This cluster configuration deploys a default cluster in Docker (2 worker nodes and 1 control plane node) with the Kommander addon enabled and the logging stack disabled. For information on using Kommander, see this [documentation][kommander-docs].

1. Edit your `cluster.yaml` file to match the following example:

   ```yaml
   kind: ClusterProvisioner
   apiVersion: konvoy.mesosphere.io/v1beta2
   metadata:
     name: konvoy-docker-kommander
     creationTimestamp: "2021-03-01T22:04:41Z"
   spec:
     provider: docker
     docker:
       disablePortMapping: false
       controlPlaneMappedPortBase: 46000
       sshControlPlaneMappedPortBase: 22000
       sshWorkerMappedPortBase: 22010
     nodePools:
       - name: worker
         count: 2
         machine:
           imageName: mesosphere/konvoy-base-centos7:v1.7.0
       - name: control-plane
         controlPlane: true
         count: 1
         machine:
           imageName: mesosphere/konvoy-base-centos7:v1.7.0
     sshCredentials:
       user: root
       publicKeyFile: konvoy-docker-kommander-ssh.pub
       privateKeyFile: konvoy-docker-kommander-ssh.pem
     version: v1.7.0
   ---
   kind: ClusterConfiguration
   apiVersion: konvoy.mesosphere.io/v1beta2
   metadata:
     name: konvoy-docker-kommander
     creationTimestamp: "2021-03-01T22:04:41Z"
   spec:
     imageRegistries:
       - server: "https://registry-1.docker.io"
         username: "your-dockerhub-username"
         password: "xxx-yourpassword-xxx"
     kubernetes:
       version: 1.20.13
       controlPlane:
         controlPlaneEndpointOverride: 172.17.1.251:6443
         keepalived: {}
       networking:
         podSubnet: 10.254.0.0/16
         serviceSubnet: 10.255.0.0/16
         iptables:
           addDefaultRules: false
       cloudProvider:
         provider: none
       admissionPlugins:
         enabled:
           - AlwaysPullImages
           - NodeRestriction
       preflightChecks:
         errorsToIgnore:
           - SystemVerification
           - filecontent--proc-sys-net-bridge-bridge-nf-call-ip6tables
           - filecontent--proc-sys-net-bridge-bridge-nf-call-iptables
           - swap
       kubelet:
         cgroupRoot: /kubelet
     containerNetworking:
       calico:
         version: v3.17.1
         encapsulation: ipip
         mtu: 1480
     containerRuntime:
       containerd:
         version: 1.3.9
     osPackages:
       enableAdditionalRepositories: true
     nodePools:
       - name: worker
     addons:
       - configRepository: https://github.com/mesosphere/kubernetes-base-addons
         configVersion: stable-1.19-3.2.0
         addonsList:
           - name: ambassador # is currently in Experimental status. More information: https://docs.d2iq.com/dkp/konvoy/latest/version-policy/#experimental-status
             enabled: false
           - name: cert-manager
             enabled: true
           - name: dashboard
             enabled: false
           - name: defaultstorageclass-protection
             enabled: true
           - name: dex
             enabled: true
           - name: dex-k8s-authenticator
             enabled: true
           - name: elasticsearch
             enabled: false
           - name: elasticsearch-curator
             enabled: false
           - name: elasticsearchexporter
             enabled: false
           - name: external-dns
             enabled: false
           - name: flagger
             enabled: false
           - name: fluentbit
             enabled: false
           - name: gatekeeper
             enabled: true
           - name: istio # is currently in Experimental status. More information: https://docs.d2iq.com/dkp/konvoy/latest/version-policy/#experimental-status
             enabled: false
           - name: jaeger # is currently in Experimental status. More information: https://docs.d2iq.com/dkp/konvoy/latest/version-policy/#experimental-status
             enabled: false
           - name: kiali # is currently in Experimental status. More information: https://docs.d2iq.com/dkp/konvoy/latest/version-policy/#experimental-status
             enabled: false
           - name: kibana
             enabled: false
           - name: konvoyconfig
             enabled: true
           - name: kube-oidc-proxy
             enabled: true
           - name: localvolumeprovisioner
             enabled: true
           - name: metallb
             enabled: true
             values: |
               configInline:
                 address-pools:
                 - name: default
                   protocol: layer2
                   addresses:
                   - 172.17.1.200-172.17.1.250
           - name: nvidia
             enabled: false
           - name: opsportal
             enabled: true
           - name: prometheus
             enabled: false
           - name: prometheusadapter
             enabled: false
           - name: reloader
             enabled: true
           - name: traefik
             enabled: true
           - name: traefik-forward-auth
             enabled: true
       - configRepository: https://github.com/mesosphere/kubeaddons-dispatch
         configVersion: stable-1.19-1.4.0
         addonsList:
           - name: dispatch
             enabled: false
       - configRepository: https://github.com/mesosphere/kubeaddons-kommander
         configVersion: stable-1.19-1.3.0
         addonsList:
           - name: kommander
             enabled: true
             values: |
               kommander-federation:
                 utilityApiserver:
                   extraArgs:
                     docker-registry-url: "https://registry-1.docker.io"
                     docker-registry-username: your-dockerhub-username
                     docker-registry-password: xxx-yourpassword-xxx
     version: v1.7.0
   ```

1. Create your cluster using the following command:

   ```bash
   konvoy up --provisioner=docker [--cluster-name <YOUR_SPECIFIED_NAME>]
   ```

   This command creates Docker containers, each of which simulates a cluster host. It then installs the Kubernetes cluster in those Docker containers, and installs default addons to support the Kubernetes cluster.

[install_docker]: https://docs.docker.com/get-docker/
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[kommander-docs]: https://docs.d2iq.com/dkp/kommander/1.4/introducing-kommander/
