---
layout: layout.pug
navigationTitle: Install air-gapped
title: Install Kaptain on an air-gapped cluster
menuWeight: 10
excerpt: Install Kaptain on an air-gapped cluster
beta: false
enterprise: false
---

## Air-Gapped Installation

**IMPORTANT** the air-gapped installation is still in beta, so the process may change in the future.

Kaptain supports installation on an air-gapped (a.k.a. offline or private) Konvoy cluster.
Before installing Kaptan, please follow the [Konvoy Air-Gapped Installation Guide](https://docs.d2iq.com/ksphere/konvoy/1.5/install/install-airgapped/)
to set up the air-gapped Konvoy cluster. The cluster admin is responsible for configuring the
Konvoy `cluster.yaml` correctly and ensuring container images have been pre-loaded to the private
registry before spinning up the cluster.

The installation steps for Kaptain on an air-gapped cluster are as follows:

* Download `kaptain_air_gapped.tar.gz` that will contain the required artifacts to perform an air-gapped installation.

* Unpack `kaptain_air_gapped.tar.gz` and copy the following files and folders into the Konvoy working directory (`<konvoy_artifacts_dir>`):
    * `<kaptain_artifacts_dir>/images.json` to `<konvoy_artifacts_dir>/extras/images/kaptain/`
    * `<kaptain_artifacts_dir>/images/*` to `<konvoy_artifacts_dir>/extras/images/kaptain/`
    * `<kaptain_artifacts_dir>/kubeaddons-kaptain` `<konvoy_artifacts_dir>/`

* Add Kaptain addon repository to `cluster.yaml` and update other addon repositories to use Kaptain's Docker
 image which includes both base addons and Kaptain specific addons:
	```yaml
    - configRepository: /opt/konvoy/artifacts/kubeaddons-kaptain
      configVersion: testing-1.18-0.6.1
      addonRepository:
        image: mesosphere/kubeflow-dev:kaptain-addons-testing-1.18-0.6.1
      addonsList:
        - name: knative
          enabled: true
        - name: kubeflow-nfs
          enabled: true
    - configRepository: /opt/konvoy/artifacts/kubernetes-base-addons
      configVersion: stable-1.18-3.0.0
      addonRepository:
        image: mesosphere/kubeflow-dev:kaptain-addons-testing-1.18-0.6.1
     addonsList:
    ......
	```
* Load, re-tag, and push all images to the private registry by using the konvoy CLI:
    ```bash
    konvoy config images seed
    ```

* Spin up the Konvoy cluster:
    ```bash
    konvoy up
    ```

* When the Konvoy cluster is ready, install Kaptain according to the [manual](../konvoy/).

Below is an example of a `cluster.yaml` for an air-gapped installation:
```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta2
metadata:
  name: kaptain-air-gapped
  creationTimestamp: "2020-10-21T17:11:26Z"
spec:
  provider: aws
  aws:
    region: us-west-2
    vpc:
      overrideDefaultRouteTable: true
      enableInternetGateway: true
      enableVPCEndpoints: true
    availabilityZones:
      - us-west-2c
    elb:
      internal: true
      apiServerPort: 6443
    tags:
      owner: centos
  nodePools:
    - name: worker
      count: 7
      machine:
        rootVolumeSize: 80
        rootVolumeType: gp2
        imagefsVolumeEnabled: true
        imagefsVolumeSize: 160
        imagefsVolumeType: gp2
        imagefsVolumeDevice: xvdb
        type: m5.2xlarge
    - name: control-plane
      controlPlane: true
      count: 3
      machine:
        rootVolumeSize: 80
        rootVolumeType: io1
        rootVolumeIOPS: 1000
        imagefsVolumeEnabled: true
        imagefsVolumeSize: 160
        imagefsVolumeType: gp2
        imagefsVolumeDevice: xvdb
        type: m5.xlarge
    - name: bastion
      bastion: true
      count: 1
      machine:
        rootVolumeType: gp2
        imagefsVolumeEnabled: false
        type: m5.large
  sshCredentials:
    user: centos
    publicKeyFile: konvoy_airgapped-ssh.pub
    privateKeyFile: konvoy_airgapped-ssh.pem
  version: v1.6.0
---
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta2
metadata:
  name: kaptain-air-gapped
  creationTimestamp: "2020-10-21T17:11:26Z"
spec:
  kubernetes:
    version: 1.18.10
    networking:
      podSubnet: 192.168.0.0/16
      serviceSubnet: 10.0.0.0/18
      iptables:
        addDefaultRules: false
    cloudProvider:
      provider: aws
    admissionPlugins:
      enabled:
        - AlwaysPullImages
        - NodeRestriction
  containerNetworking:
    calico:
      version: v3.16.4
      encapsulation: ipip
      mtu: 1480
  containerRuntime:
    containerd:
      version: 1.3.7
  imageRegistries:
    - server: https://private-registry:5000
      username: admin
      password: password
      default: true
  osPackages:
    enableAdditionalRepositories: false
  autoProvisioning:
    config:
      clusterAutoscaler:
        chartRepo: http://konvoy-addons-chart-repo.kubeaddons.svc:8879
      konvoy:
        imageRepository: private-registry:5000/mesosphere/konvoy
      kubeaddonsRepository:
        versionMap:
          1.18.10: stable-1.18-3.0.0
        versionStrategy: mapped-kubernetes-version
      webhook:
        extraArgs:
          konvoy.docker-registry-insecure-skip-tls-verify: true
          konvoy.docker-registry-password: password
          konvoy.docker-registry-url: https://private-registry:5000
          konvoy.docker-registry-username: admin
  nodePools:
    - name: worker
  addons:
    - configRepository: /opt/konvoy/artifacts/kubeaddons-kaptain
      configVersion: testing-1.18-0.6.1
      addonRepository:
        image: mesosphere/kubeflow-dev:kaptain-addons-testing-1.18-0.6.1
      addonsList:
        - name: knative
          enabled: true
        - name: kubeflow-nfs
          enabled: true
    - configRepository: /opt/konvoy/artifacts/kubernetes-base-addons
      configVersion: stable-1.18-3.0.0
      addonRepository:
        image: mesosphere/kubeflow-dev:kaptain-addons-testing-1.18-0.6.1
      addonsList:
        - name: awsebscsiprovisioner
          enabled: true
        - name: awsebsprovisioner
          enabled: false
          values: |
            storageclass:
              isDefault: false
        - name: cert-manager
          enabled: true
        - name: dashboard
          enabled: true
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
        - name: flagger
          enabled: false
        - name: fluentbit
          enabled: false
        - name: gatekeeper
          enabled: true
        - name: velero
          enabled: true
          values: |-
            minioBackendConfiguration:
              service:
                annotations:
                  "service.beta.kubernetes.io/aws-load-balancer-internal": "true"
        - name: istio
          enabled: true
          values: |-
            gateways:
              istio-ingressgateway:
                serviceAnnotations:
                  "service.beta.kubernetes.io/aws-load-balancer-internal": "true"
        - name: traefik
          enabled: true
          values: |-
            service:
              annotations:
                "service.beta.kubernetes.io/aws-load-balancer-internal": "true"
        - name: kibana
          enabled: false
        - name: konvoyconfig
          enabled: true
        - name: kube-oidc-proxy
          enabled: true
        - name: localvolumeprovisioner
          enabled: false
          values: |
            # Multiple storage classes can be defined here. This allows to, e.g.,
            # distinguish between different disk types.
            # For each entry a storage class '$name' and
            # a host folder '/mnt/$dirName' will be created. Volumes mounted to this
            # folder are made available in the storage class.
            storageclasses:
              - name: localvolumeprovisioner
                dirName: disks
                isDefault: false
                reclaimPolicy: Delete
                volumeBindingMode: WaitForFirstConsumer
        - name: nvidia
          enabled: false
        - name: opsportal
          enabled: true
        - name: prometheus
          enabled: true
        - name: prometheusadapter
          enabled: true
        - name: reloader
          enabled: true
        - name: traefik
          enabled: true
        - name: traefik-forward-auth
          enabled: true
          values: |
            traefikForwardAuth:
              allowedUser:
                valueFrom:
                  secretKeyRef: null
        - name: velero
          enabled: true
  version: v1.6.0
```
