---
layout: layout.pug
navigationTitle: Provision a customized cluster
title: Provision a customized cluster
menuWeight: 10
excerpt: Learn how to provision a customized Konvoy cluster
enterprise: false
---

In the [Quick start][quickstart], you provisioned a Konvoy cluster with default configuration settings.
Customizing the cluster is an **optional** task, but one of the most common tasks you perform when deploying in a production environment.

If you are configuring the Konvoy cluster for a production deployment, you can use this tutorial to learn the basic steps involved in provisioning a custom cluster.
However, provisioning a production cluster typically involves more planning and custom configuration than covered in this example.

This tutorial demonstrates how you can customize a few simple configuration settings for your Konvoy cluster, then provision the cluster using a public cloud infrastructure.
The steps are similar if you are provisioning the cluster using an internal network (on-prem) infrastructure.

To provision a customized cluster on Amazon Web Services (AWS):

1.  Generate the configuration files by running the following command:

    ```bash
    konvoy init --provisioner=aws
    ```

1.  Edit the provisioner configuration settings in the `cluster.yaml` cluster configuration file.

    You can edit the cluster configuration settings to suit your needs.
    For example, you can change the node count or add custom tags to all resources created by the installer by modifying
    the corresponding settings in the `cluster.yaml` file under the `ClusterProvisioner` section.

    The following example illustrates the `ClusterProvisioner` settings defined in the `cluster.yaml` cluster configuration file:

    ```yaml
    kind: ClusterProvisioner
    apiVersion: konvoy.mesosphere.io/v1alpha1
    metadata:
      name: konvoy
      creationTimestamp: "2019-05-31T18:00:01.482791-04:00"
    spec:
      provider: aws
      providerOptions:
        region: us-west-2
        availabilityZones:
        - us-west-2c
        tags:
          owner: hector
      nodePools:
      - name: node
        count: 4
        machine:
          rootVolumeSize: 80
          rootVolumeType: gp2
          imagefsVolumeEnabled: true
          imagefsVolumeType: gp2
          imagefsVolumeSize: 160
          type: t3.xlarge
      - name: control-plane
        controlPlane: true
        count: 3
        machine:
          rootVolumeSize: 80
          rootVolumeType: gp2
          imagefsVolumeEnabled: true
          imagefsVolumeType: gp2
          imagefsVolumeSize: 160
          type: t3.large
      sshCredentials:
        user: centos
        publicKeyFile: konvoy-ssh.pub
        privateKeyFile: konvoy-ssh.pem
      version: v0.0.15-10-g57dff48
    ```

    As illustrated in this example, you can modify the `nodePools` section to configure the nodes of your cluster by changing the `nodePools.count` from `4` to `5`
    or the node type by changing the `nodePools.machine.type` from `t3.xlarge` to `t3.large`.

    You can also modify the `tags` section to extend the lifetime of your cluster.
    This change might be useful, for example, if your AWS administrator has created a job to remove cloud resources based on AWS resource tags.
    For example:

    ```yaml
    ### needs both tags
    tags:
      owner: luxi
      expiration: 24h
    ```

    For more information about customizing provisioning settings, see [Cluster provisioning][provisioning].

1.  Edit the `ClusterConfiguration` section of `cluster.yaml` configuration file to change which addons you want to enable or disable.

    The following example illustrates the `ClusterConfiguration` settings defined in the `cluster.yaml` cluster configuration file:

    ```yaml
    kind: ClusterConfiguration
    apiVersion: konvoy.mesosphere.io/v1alpha1
    metadata:
      name: konvoy
      creationTimestamp: "2019-05-31T18:00:00.844964-04:00"
    spec:
      kubernetes:
        version: 1.15.3
        networking:
          podSubnet: 192.168.0.0/16
          serviceSubnet: 10.0.0.0/18
        cloudProvider:
          provider: aws
        podSecurityPolicy:
          enabled: false
      containerRuntime:
        containerd:
          version: 1.2.5
      addons:
        configVersion: v0.0.11
        addonList:
        - name: velero
          enabled: true
        - name: helm
          enabled: true
        - name: awsebsprovisioner
          enabled: false
        - name: awsebscsiprovisioner
          enabled: true
        - name: opsportal
          enabled: true
        - name: elasticsearch
          enabled: true
        - name: fluentbit
          enabled: true
        - name: kibana
          enabled: true
        - name: prometheus
          enabled: true
        - name: traefik
          enabled: true
        - name: dashboard
          enabled: true
      version: v0.0.15-10-g57dff48
    ```

    In this example, you can disable the `fluentbit` addon by changing the `enabled` from `true` to `false`.

    **NOTE:** The addons `helm` and `opsportal` are *required* and a cluster cannot be provisioned until they are enabled.

    For more information about customizing cluster configuration settings, see [Cluster configuration][clusterconfig].

1.  Provision the cluster with your customized settings by running the following command:

    ```bash
    konvoy up
    ```

The `konvoy up` command provisions the cluster similar to how it is provisioned using the default settings as described in [Provision and deploy the cluster and addons][defaultsettings].

However, customized provisioning creates a `cluster.tmp.yaml` file that contains the default values merged with any your user-provided overrides.
The `cluster.tmp.yaml` file is the file that Ansible uses during its execution.
You can delete this file after the cluster is created because it is regenerated every time you execute the `konvoy up` command.

[quickstart]:../../quick-start/
[provisioning]:../../reference/cluster-provisioner/
[clusterconfig]:../../reference/cluster-configuration/
[defaultsettings]:../../quick-start/#install-with-default-settings
