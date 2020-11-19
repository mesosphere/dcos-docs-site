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

Kaptain supports installation on an air-gapped (a.k.a. offline or private) Konvoy cluster. Before installing Kaptain, please follow the [Konvoy Air-Gapped Installation Guide](https://docs.d2iq.com/ksphere/konvoy/1.5/install/install-airgapped/) to set up the air-gapped Konvoy cluster. The cluster admin is responsible for configuring the Konvoy `cluster.yaml` correctly and ensuring container images have been pre-loaded to the private registry before spinning up the cluster.

The installation steps for Kaptain on an air-gapped cluster are as follows:

* Get [`konvoy_air_gapped.tar.bz2`](https://docs.d2iq.com/ksphere/konvoy/1.5/install/install-airgapped/) that will contain the required artifacts to perform an air-gapped installation.

* Get the [Kaptain release artifacts](../../download/), which include Kaptain and the images files (`images-install.json` and `images-runtime.json`).

* Place the Konvoy add-ons Docker tar file in the images folder, re-tag it, and push it to a private registry. Regarding the private bootstrap Docker registry configuration, please see the corresponding [Konvoy docs](https://docs.d2iq.com/ksphere/konvoy/1.5/install/install-airgapped/#configure-the-image-registry) for more details.

* (Only for Konvoy 1.5.x. This step will not be needed in Konvoy 1.6.x) In the working directory of Konvoy, git clone `kubeaddons-kaptain`.
  ```bash
  git clone https://github.com/mesosphere/kubeaddons-kaptain
  ```

* Modify the Konvoy `cluster.yaml` to ensure a local Helm repository is used, ensuring all add-on repos' images are `mesosphere/konvoy-addons-chart-repo:kfa-1.5.2-stable-1.17-0.4.3`. For instance,
	```yaml
    - configRepository: /opt/konvoy/artifacts/kubeaddons-kaptain
      configVersion: stable-1.17-0.4.3
      addonRepository:
        image: mesosphere/konvoy-addons-chart-repo:kfa-1.5.2-stable-1.17-0.4.3
      addonsList:
      - name: kubeflow-nfs
        enabled: true
      - name: knative
        enabled: true
    - configRepository: /opt/konvoy/artifacts/kubernetes-base-addons
      configVersion: stable-1.17-2.0.2
      addonRepository:
        image: mesosphere/konvoy-addons-chart-repo:kfa-1.5.2-stable-1.17-0.4.3
      addonsList:
        ......
	```

* Modify the `images-runtime.json` list and remove any images not needed. We recommended this step, as the total size of each image for different deep learning frameworks is relatively large (~ 7GB).

* Merge the Kaptain installation and images files (`images-install.json` and `images-runtime.json`) with the default images.json from Konvoy. Then, load, re-tag, and push all images to the private registry by using the konvoy CLI:
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
  name: company-airgap-e620
  creationTimestamp: "2020-09-01T23:16:04Z"
spec:
  provider: aws
  aws:
    region: us-west-2
    vpc:
      overrideDefaultRouteTable: true
      enableInternetGateway: true
      enableVPCEndpoints: false
    availabilityZones:
      - us-west-2c
    elb:
      apiServerPort: 6443
    tags:
      owner: centos
  nodePools:
    - name: worker
      count: 4
      machine:
        imageID: ami-0bc06212a56393ee1
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
        imageID: ami-0bc06212a56393ee1
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
      count: 0
      machine:
        imageID: ami-0bc06212a56393ee1
        rootVolumeSize: 10
        rootVolumeType: gp2
        imagefsVolumeEnabled: false
        type: m5.large
  sshCredentials:
    user: centos
    publicKeyFile: company-airgap-e620-ssh.pub
    privateKeyFile: company-airgap-e620-ssh.pem
  version: v1.5.2
---
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta2
metadata:
  name: company-airgap-e620
  creationTimestamp: "2020-09-01T23:16:04Z"
spec:
  imageRegistries:
    - server: https://myregistry:443
      username: "admin"
      password: "password"
      default: true
  autoProvisioning:
    config:
      konvoy:
        imageRepository: myregistry:443/mesosphere/konvoy
      webhook:
        extraArgs:
          konvoy.docker-registry-url: https://myregistry:443
          konvoy.docker-registry-insecure-skip-tls-verify: true
          konvoy.docker-registry-username: "admin"
          konvoy.docker-registry-password: "password"
      clusterAutoscaler:
        chartRepo: http://konvoy-addons-chart-repo.kubeaddons.svc:8879
      kubeaddonsRepository:
        versionStrategy: mapped-kubernetes-version
        versionMap:
          1.17.8: testing-2.0.0-5
  kubernetes:
    version: 1.17.11
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
      version: v3.13.5
      encapsulation: ipip
      mtu: 1480
  containerRuntime:
    containerd:
      version: 1.3.7
  osPackages:
    enableAdditionalRepositories: false
  nodePools:
    - name: worker
  addons:
    - configRepository: /opt/konvoy/artifacts/kubeaddons-kaptain
      configVersion: stable-1.17-0.4.3
      addonRepository:
        image: mesosphere/konvoy-addons-chart-repo:kfa-1.5.2-stable-1.17-0.4.3
      addonsList:
      - name: kubeflow-nfs
        enabled: true
      - name: knative
        enabled: true
    - configRepository: /opt/konvoy/artifacts/kubeaddons-dispatch
      configVersion: stable-1.17-1.2.2
      addonRepository:
        image: mesosphere/konvoy-addons-chart-repo:kfa-1.5.2-stable-1.17-0.4.3
      addonsList:
        - name: dispatch
          enabled: false
    - configRepository: /opt/konvoy/artifacts/kubeaddons-kommander
      configVersion: stable-1.17-1.1.2
      addonRepository:
        image: mesosphere/konvoy-addons-chart-repo:kfa-1.5.2-stable-1.17-0.4.3
      addonsList:
        - name: kommander
          enabled: false
    - configRepository: /opt/konvoy/artifacts/kubernetes-base-addons
      configVersion: stable-1.17-2.2.0
      addonRepository:
        image: mesosphere/konvoy-addons-chart-repo:kfa-1.5.2-stable-1.17-0.4.3
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
        - name: external-dns
          enabled: true
          values: |
            aws:
              region:
            domainFilters: []
        - name: flagger
          enabled: false
        - name: fluentbit
          enabled: false
        - name: gatekeeper
          enabled: true
        - name: istio
          enabled: true
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
        - name: velero
          enabled: true
  version: v1.5.2
```
