---
layout: layout.pug
navigationTitle: Cluster Configuration
title: Configure Cluster
menuWeight: 20
excerpt: Create a cluster configuration file and apply it to your environment.
beta: false
enterprise: false
---

## Create the cluster configuration file

1.  Update `cluster-aws.sh` with the existing infrastructure values.

    ```bash
    vi cluster-aws.sh
    ```

1.  Generate the cluster configuration file from the updated cluster.sh file.

    ```bash
    ./cluster.sh
    ```

    <p class="message--important"><strong>NOTE: </strong>An Amazon Linux 2-based AMI runs the <code>autotune</code> utility to set Linux kernel parameters optimal for the EC2 instance type. Kubernetes requires the <code>ipv4_forward</code> kernel parameter to be enabled, but the <code>autotune</code> utility disables it by default. To override the default, add the following to the <code>cluster-sbx.yaml</code>.</p>

    ```yaml
    kind: KubeadmControlPlane
    ...
        preKubeadmCommands:
        - systemctl daemon-reload
        - systemctl restart containerd
        - /run/kubeadm/konvoy-set-kube-proxy-configuration.sh
        - autotune override sysctl:net.ipv4.ip_forward:1
        - systemctl restart autotune
    ...
    kind: KubeadmConfigTemplate
          preKubeadmCommands:
          - systemctl daemon-reload
          - systemctl restart containerd
          - /run/kubeadm/konvoy-set-kube-proxy-configuration.sh
          - autotune override sysctl:net.ipv4.ip_forward:1
          - systemctl restart autotune
    ```

    <p class="message--important"><strong>NOTE: </strong>Update the AMI root volume size to match the new AMI generated with Konvoy Image Builder for both the control planes and default node pool.</p>

    ```yaml
    apiVersion: infrastructure.cluster.x-k8s.io/v1alpha4
    kind: AWSMachineTemplate
    metadata:
      name: cluster-sbx-control-plane
      namespace: default
    spec:
      template:
        spec:
          ami:
            id: ami-0d1ab6c50a5f30339
          cloudInit:
            insecureSkipSecretsManager: true
          iamInstanceProfile: ag-role.cluster-api-provider-aws.sigs.k8s.io
          imageLookupBaseOS: centos-7
          imageLookupFormat: capa-ami-{{.BaseOS}}-?{{.K8sVersion}}-*
          imageLookupOrg: "258751437250"
          instanceType: m5.xlarge
          rootVolume:
            size: 250
    ...
    apiVersion: infrastructure.cluster.x-k8s.io/v1alpha4
    kind: AWSMachineTemplate
    metadata:
      name: cluster-sbx-md-0
      namespace: default
    spec:
      template:
        spec:
          ami:
            id: ami-0d1ab6c50a5f30339
          cloudInit:
            insecureSkipSecretsManager: true
          iamInstanceProfile: ag-role.cluster-api-provider-aws.sigs.k8s.io
          imageLookupBaseOS: centos-7
          imageLookupFormat: capa-ami-{{.BaseOS}}-?{{.K8sVersion}}-*
          imageLookupOrg: "258751437250"
          instanceType: m5.2xlarge
          rootVolume:
            size: 250
    ...
    ```

1.  Apply the cluster configuration.

    ```bash
    kubectl apply -f cluster-sbx.yaml
    ```

1.  Monitor the Kubernetes cluster deployment.

    ```bash
    watch ./dkp describe cluster -c cluster-sbx
    ```

When ready, begin [configuring the control plane][clustercontrol].

[clustercontrol]: ../clustercontrol
