---
layout: layout.pug
navigationTitle: Understanding the Standard Configuration
title: Understanding the Standard Configuration
menuWeight: 10
excerpt: Understanding the standard configuration as part of planning and preparing for your major version upgrade
beta: true
enterprise: false
---

When using Konvoy to provision clusters, you run the `konvoy init` command to generate a standard `cluster.yaml` file. The unmodified output of this command is called a standard configuration and looks like this:

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta2
metadata:
  name: konvoy-migration
  creationTimestamp: "2021-11-16T23:12:50Z"
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
      owner: konvoy
  nodePools:
    - name: worker
      count: 4
      machine:
        imageID: ami-0686851c4e7b1a8e1
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
        imageID: ami-0686851c4e7b1a8e1
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
        imageID: ami-0686851c4e7b1a8e1
        rootVolumeSize: 10
        rootVolumeType: gp2
        imagefsVolumeEnabled: false
        type: m5.large
  sshCredentials:
    user: centos
    publicKeyFile: konvoy-migration-ssh.pub
    privateKeyFile: konvoy-migration-ssh.pem
  version: v1.8.3
---
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta2
metadata:
  name: konvoy-migration
  creationTimestamp: "2021-11-16T23:12:50Z"
spec:
  kubernetes:
    version: 1.20.11
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
      version: v3.17.3
      encapsulation: ipip
      mtu: 1480
  containerRuntime:
    containerd:
      version: 1.4.7
  osPackages:
    enableAdditionalRepositories: true
  nodePools:
    - name: worker
  addons:
    - configRepository: https://github.com/mesosphere/kubernetes-base-addons
      configVersion: stable-1.20-4.2.0
      addonsList:
        - name: ambassador # is currently in Experimental status. More information: https://docs.d2iq.com/dkp/konvoy/latest/version-policy/#experimental-status
          enabled: false
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
          enabled: true
        - name: elasticsearch-curator
          enabled: true
        - name: elasticsearchexporter
          enabled: true
        - name: external-dns
          enabled: false
        - name: flagger
          enabled: false
        - name: fluentbit
          enabled: true
        - name: gatekeeper
          enabled: true
        - name: istio # is currently in Experimental status. More information: https://docs.d2iq.com/dkp/konvoy/latest/version-policy/#experimental-status
          enabled: false
        - name: jaeger # is currently in Experimental status. More information: https://docs.d2iq.com/dkp/konvoy/latest/version-policy/#experimental-status
          enabled: false
        - name: kiali # is currently in Experimental status. More information: https://docs.d2iq.com/dkp/konvoy/latest/version-policy/#experimental-status
          enabled: false
        - name: kibana
          enabled: true
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
    - configRepository: https://github.com/mesosphere/kubeaddons-dispatch
      configVersion: stable-1.20-1.4.5
      addonsList:
        - name: dispatch
          enabled: false
    - configRepository: https://github.com/mesosphere/kubeaddons-kommander
      configVersion: stable-1.20-1.4.2
      addonsList:
        - name: kommander
          enabled: false
  version: v1.8.3
```

<p class="message--note"><strong>NOTE: The Kommander addon must be disabled to support the migration of Konvoy.</strong></p>


Every environment is a "custom" environment to some degree. The most common customizations to the standard configuration include:

-   Custom hostname

-   Custom Certificate Authorities (CAs)

-   Automatic certificate management

The major version upgrade supports some of the Addons that are disabled by default, (set to `enabled: false` in the `cluster.yaml` file).

Helm values determine the configuration of individual enabled Addons. Konvoy 1.x documentation describes several scenarios in which you will need to edit the Addon values to achieve a custom configuration. For Kommander 2.1, the equivalent custom configurations usually are achievable, but the corresponding modifications of values are often slightly different from 1.x. The Kommander CLI provides automated major version upgrade only for a limited subset of such custom value modifications.

If your cluster configuration differs from the sample above, you may want to contact Support for advice prior to beginning your upgrade.
