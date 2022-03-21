---
layout: layout.pug
navigationTitle: Air-Gapped Bundles
title: Air-Gapped Bundles
menuWeight: 10
excerpt: Download and install air-gapped bundles when provisioning in an air-gapped environment.
beta: false
enterprise: false
---

## Review the air-gapped bundle contents

The air-gapped bundle contains the necessary OS dependencies and images required to set up a DKP Essential installation in an air-gapped environment. The download and installation of these bundles is agnostic to a specific environment, and is compatible with any of the environments listed in the table below:

| Operating System      | Kernel                      | Air-Gapped     |
|-----------------------|-----------------------------|----------------|
| [CentOS 7.9][centos7] | 3.10.0-1160.el7.x86_64      | Yes            |
| [RHEL 7.9][rhel_7_9]  | 3.10.0-1160.el7.x86_64      | Yes            |

The air-gapped bundle includes the following packages and tooling:

- Command line tooling
- Konvoy air-gapped bundle,
- Kommander air-gapped bundle,
- Konvoy Image Builder
- CentOS/RHEL 7.9 dependencies
- Setup script
- Cluster initialization script
- Docker registry image

## Download and expand  the air-gapped bundle


1.  Define an environment variable for the Kubernetes version that corresponds with Konvoy release you are installing. You can find the correct Kubernetes version by checking the release notes for the release you are installing.

    ```bash
    export VERSION=1.21.6
    ```

1.  Download the air-gapped bundle files.

    ```bash
    curl -O downloads.d2iq.com/dkp/v2.1.1/dkp_airgapped_bundle_v2.1.1_linux_amd64.tar.gz
    curl -O downloads.d2iq.com/konvoy/airgapped/pip-packages.tar.gz
    ```
1.  Transfer the Air-gapped bundle to the Bootstrap host.

    ```bash
	scp dkp_airgapped_bundle_v2.1.1_linux_amd64.tar.gz <user>@<bastion_host>:~/
	```
1.  Login to the Bastion host using the same credentials used in the previous step.

	```bash
	ssh <user>@<bastion_host>
	```

1.  Expand the air-gapped bundle artifact.

    ```sh
    tar -xvf dkp_airgapped_bundle_v2.1.1_linux_amd64.tar.gz
    ```
1.  Move into the created directory.

    ```sh
    cd dkp-v2.1.1
    ```
## Prepare the bootstrap node and environment

Run the setup command in order to load the bootstrap:
  * Install Docker engine
  * Load and create local registry
  * Update Docker daemon configuration with registry reference
  * Seed local registry
  * Load bootstrap image required for DKP CLI

1.  Run setup.

    ```sh
    sudo ./setup
    ```
<p class="message--note"><strong>NOTE: </strong>This setup process will take around fifteen minutes.</p></strong>

1.  Once setup has completed, refresh your group membership.

    ```bash
    // Logout
    exit

    // Login
    ssh user@x.x.x.x
 Logout:  
 ```bash
 exit
 ```
 Login:
 ```bash
 ssh user@x.x.x.x
 ```
 ```

1.  Verify the contents of the expanded air-gapped bundle.

	```bash
	rpm -qa
	```
The output should read as follows:

	```sh
	amazon-ssm-agent.rpm				      libndp-1.2-9.el7.x86_64.rpm				 polkit-pkla-compat-0.1-4.el7.x86_64.rpm
	audit-2.8.5-4.el7.x86_64.rpm			      libnetfilter_conntrack-1.0.6-1.el7_3.x86_64.rpm		 python3-3.6.8-18.el7.x86_64.rpm
	audit-libs-python-2.8.5-4.el7.x86_64.rpm	      libnetfilter_cthelper-1.0.0-11.el7.x86_64.rpm		 python3-libs-3.6.8-18.el7.x86_64.rpm
	ca-certificates-2021.2.50-72.el7_9.noarch.rpm	      libnetfilter_cttimeout-1.0.0-7.el7.x86_64.rpm		 python3-pip-9.0.3-8.el7.noarch.rpm
	checkpolicy-2.5-8.el7.x86_64.rpm		      libnetfilter_queue-1.0.2-2.el7_2.x86_64.rpm		 python3-setuptools-39.2.0-10.el7.noarch.rpm
	chrony-3.4-1.el7.x86_64.rpm			      libnfnetlink-1.0.1-4.el7.x86_64.rpm			 python-backports-1.0-8.el7.x86_64.rpm
	conntrack-tools-1.4.4-7.el7.x86_64.rpm		      libnfsidmap-0.25-19.el7.x86_64.rpm			 python-backports-ssl_match_hostname-3.5.0.1-1.el7.noarch.rpm
	containerd.io-1.4.11-3.1.el7.x86_64.rpm		      libnl3-3.2.28-4.el7.x86_64.rpm				 python-chardet-2.2.1-3.el7.noarch.rpm
	container-selinux-2.119.2-1.911c772.el7_8.noarch.rpm  libpath_utils-0.2.1-32.el7.x86_64.rpm			 python-ipaddress-1.0.16-2.el7.noarch.rpm
	cri-tools-1.22.0-0.x86_64.rpm			      libpciaccess-0.14-1.el7.x86_64.rpm			 python-IPy-0.75-6.el7.noarch.rpm
	cronie-1.4.11-23.el7.x86_64.rpm			      libref_array-0.1.5-32.el7.x86_64.rpm			 python-kitchen-1.1.1-5.el7.noarch.rpm
	cronie-anacron-1.4.11-23.el7.x86_64.rpm		      libseccomp-2.3.1-4.el7.x86_64.rpm				 python-netifaces-0.10.4-3.el7.x86_64.rpm
	crontabs-1.11-6.20121102git.el7.noarch.rpm	      libselinux-python-2.5-15.el7.x86_64.rpm			 python-requests-2.6.0-10.el7.noarch.rpm
	curl-7.29.0-59.el7_9.1.x86_64.rpm		      libselinux-utils-2.5-15.el7.x86_64.rpm			 python-six-1.9.0-2.el7.noarch.rpm
	e2fsprogs-libs-1.42.9-19.el7.x86_64.rpm		      libsemanage-python-2.5-14.el7.x86_64.rpm			 python-urllib3-1.10.2-7.el7.noarch.rpm
	ebtables-2.0.10-16.el7.x86_64.rpm		      libsmartcols-2.23.2-65.el7_9.1.x86_64.rpm			 quota-4.01-19.el7.x86_64.rpm
	ethtool-4.8-10.el7.x86_64.rpm			      libtirpc-0.2.4-0.16.el7.x86_64.rpm			 quota-nls-4.01-19.el7.noarch.rpm
	fuse-2.9.2-11.el7.x86_64.rpm			      libtool-ltdl-2.4.2-22.el7_3.x86_64.rpm			 repodata
	fuse-libs-2.9.2-11.el7.x86_64.rpm		      libuuid-2.23.2-65.el7_9.1.x86_64.rpm			 rpcbind-0.2.0-49.el7.x86_64.rpm
	gssproxy-0.7.0-30.el7_9.x86_64.rpm		      libverto-libevent-0.2.5-4.el7.x86_64.rpm			 selinux-policy-3.13.1-268.el7_9.2.noarch.rpm
	hwdata-0.252-9.7.el7.x86_64.rpm			      libxml2-2.9.1-6.el7_9.6.x86_64.rpm			 selinux-policy-targeted-3.13.1-268.el7_9.2.noarch.rpm
	iproute-4.11.0-30.el7.x86_64.rpm		      libxml2-python-2.9.1-6.el7_9.6.x86_64.rpm			 setools-libs-3.3.8-4.el7.x86_64.rpm
	iptables-1.4.21-35.el7.x86_64.rpm		      libxslt-1.1.28-6.el7.x86_64.rpm				 socat-1.7.3.2-2.el7.x86_64.rpm
	keyutils-1.5.8-3.el7.x86_64.rpm			      lm_sensors-libs-3.4.0-8.20160601gitf9185e5.el7.x86_64.rpm  sysstat-10.1.5-19.el7.x86_64.rpm
	kubeadm-1.21.6-0.x86_64.rpm			      mozjs17-17.0.0-20.el7.x86_64.rpm				 systemd-219-78.el7_9.3.x86_64.rpm
	kubectl-1.21.6-0.x86_64.rpm			      NetworkManager-1.18.8-2.el7_9.x86_64.rpm			 systemd-libs-219-78.el7_9.3.x86_64.rpm
	kubelet-1.21.6-0.x86_64.rpm			      NetworkManager-libnm-1.18.8-2.el7_9.x86_64.rpm		 systemd-sysv-219-78.el7_9.3.x86_64.rpm
	kubernetes-cni-0.8.7-0.x86_64.rpm		      nfs-utils-1.3.0-0.68.el7.2.x86_64.rpm			 tcp_wrappers-7.6-77.el7.x86_64.rpm
	libbasicobjects-0.1.1-32.el7.x86_64.rpm		      nspr-4.32.0-1.el7_9.x86_64.rpm				 tcp_wrappers-libs-7.6-77.el7.x86_64.rpm
	libblkid-2.23.2-65.el7_9.1.x86_64.rpm		      nss-3.67.0-4.el7_9.x86_64.rpm				 tzdata-2021e-1.el7.noarch.rpm
	libcgroup-0.41-21.el7.x86_64.rpm		      nss-softokn-3.67.0-3.el7_9.x86_64.rpm			 util-linux-2.23.2-65.el7_9.1.x86_64.rpm
	libcollection-0.7.0-32.el7.x86_64.rpm		      nss-softokn-freebl-3.67.0-3.el7_9.x86_64.rpm		 which-2.20-7.el7.x86_64.rpm
	libcurl-7.29.0-59.el7_9.1.x86_64.rpm		      nss-tools-3.67.0-4.el7_9.x86_64.rpm			 wpa_supplicant-2.6-12.el7_9.2.x86_64.rpm
	libdrm-2.4.97-2.el7.x86_64.rpm			      nss-util-3.67.0-1.el7_9.x86_64.rpm			 xmlsec1-1.2.20-7.el7_4.x86_64.rpm
	libedit-3.0-12.20121213cvs.el7.x86_64.rpm	      open-vm-tools-11.0.5-3.el7_9.3.x86_64.rpm			 xmlsec1-openssl-1.2.20-7.el7_4.x86_64.rpm
	libevent-2.0.21-4.el7.x86_64.rpm		      pciutils-3.5.1-3.el7.x86_64.rpm				 yum-plugin-ovl-1.1.31-54.el7_8.noarch.rpm
	libini_config-1.3.1-32.el7.x86_64.rpm		      pciutils-libs-3.5.1-3.el7.x86_64.rpm			 yum-plugin-versionlock-1.1.31-54.el7_8.noarch.rpm
	libmnl-1.0.3-7.el7.x86_64.rpm			      policycoreutils-2.5-34.el7.x86_64.rpm			 yum-utils-1.1.31-54.el7_8.noarch.rpm
	libmount-2.23.2-65.el7_9.1.x86_64.rpm		      policycoreutils-python-2.5-34.el7.x86_64.rpm
	libmspack-0.5-0.8.alpha.el7.x86_64.rpm		      polkit-0.112-26.el7.x86_64.rpm
	```
 <p class="message--note"><strong>NOTE: </strong>The version numbers of the files included within the air-gapped bundle may be different than the versions listed above.</p>

1.  If running RHEL 7.9, copy the CentOS mirror GPG key to all of the nodes.

	```bash
	curl -O http://mirror.centos.org/centos/RPM-GPG-KEY-CentOS-7
	```

1. 	Move the GPG key to the Bastion node.

	```bash
	scp RPM-GPG-KEY-CentOS-7 <user>@<bastion_host>:~/
	```
1. 	Log in to the Bastion host using the same credentials from the previous step.

	```bash
	ssh <user>@<bastion_host>
	```

1. 	Then, copy the GPG key to all nodes.

	```bash
	scp RPM-GPG-KEY-CentOS-7 <user>@<node-1-3>:/tmp/RPM-GPG-KEY-CentOS-7
	```
1.	Refresh your group membership.

	```bash
	// Logout
	exit

	// Login
	ssh user@x.x.x.x
	```
	
After a successful login, move on to setting up Konvoy Image Builder.

### Create AMI

Use Konvoy Image Builder to create an Amazon Machine Image (AMI) based on the desired OS included in the air-gapped bundle.

1.  Unpack the Konvoy Image Builder within the air-gapped bundle.

    ```bash
    curl -OL https://github.com/mesosphere/konvoy-image-builder/releases/download/v1.5.0-rc.3/konvoy-image-bundle-v1.5.0-rc.3_linux_amd64.tar.gz

    tar -xvf konvoy-image-bundle-v1.5.0-rc.3_linux_amd64.tar.gz
    ```

1.  Set the following overrides and AWS server regions.

    <p class="message--important"><strong>IMPORTANT: </strong>The following usernames and IDs are samples, enter your identification into the appropriate fields where applicable.</p>

    ```bash
    cat <EOF> overrides/custom.yaml
    packer:
      ssh_username: "maintuser"
      volume_size: "250"
      # Optional VPC ID
      # vpc_id: vpc-058da8b5f1fcb1369
      #Optional Subnet ID
      # subnet_id: subnet-052653ab52e5773f0

    EOF
    ```

    ```bash
    cat <EOF> overrides/images.yaml
    ---
    extra_images:
      - docker.io/mesosphere/cluster-api-aws-controller:v0.7.1-d2iq.0
      - docker.io/mesosphere/cluster-api-preprovisioned-controller:v0.4.0
      - gcr.io/kubebuilder/kube-rbac-proxy:v0.8.0
      - k8s.gcr.io/cluster-api/cluster-api-controller:v0.4.4
      - k8s.gcr.io/cluster-api/kubeadm-bootstrap-controller:v0.4.4
      - k8s.gcr.io/cluster-api/kubeadm-control-plane-controller:v0.4.4
      - mcr.microsoft.com/oss/azure/aad-pod-identity/nmi:v1.8.5
      - quay.io/jetstack/cert-manager-cainjector:v1.5.3
      - quay.io/jetstack/cert-manager-controller:v1.5.3
      - quay.io/jetstack/cert-manager-webhook:v1.5.3
      - us.gcr.io/k8s-artifacts-prod/cluster-api-azure/cluster-api-azure-controller:v0.5.3
      - docker.io/mesosphere/konvoy-image-builder:v1.5.0-rc.2
      - docker.io/plndr/kube-vip:v0.3.7
      - k8s.gcr.io/provider-aws/aws-ebs-csi-driver:v1.4.0
      - k8s.gcr.io/sig-storage/csi-attacher:v3.1.0
      - k8s.gcr.io/sig-storage/csi-node-driver-registrar:v2.1.0
      - k8s.gcr.io/sig-storage/csi-provisioner:v2.1.1
      - k8s.gcr.io/sig-storage/csi-resizer:v1.1.0
      - k8s.gcr.io/sig-storage/csi-snapshotter:v3.0.3
      - k8s.gcr.io/sig-storage/livenessprobe:v2.2.0
      - k8s.gcr.io/sig-storage/snapshot-controller:v4.2.0
      - mcr.microsoft.com/k8s/csi/azuredisk-csi:v1.8.0
      - mcr.microsoft.com/oss/kubernetes-csi/csi-attacher:v3.3.0
      - mcr.microsoft.com/oss/kubernetes-csi/csi-node-driver-registrar:v2.3.0
      - mcr.microsoft.com/oss/kubernetes-csi/csi-provisioner:v2.2.2
      - mcr.microsoft.com/oss/kubernetes-csi/csi-resizer:v1.3.0
      - mcr.microsoft.com/oss/kubernetes-csi/csi-snapshotter:v3.0.3
      - mcr.microsoft.com/oss/kubernetes-csi/livenessprobe:v2.4.0
      - quay.io/external_storage/local-volume-provisioner:v2.4.0
      - docker.io/calico/cni:v3.20.2
      - docker.io/calico/kube-controllers:v3.20.2
      - docker.io/calico/node:v3.20.2
      - docker.io/calico/pod2daemon-flexvol:v3.20.2
      - docker.io/calico/typha:v3.20.2
      - quay.io/tigera/operator:v1.20.4
      - docker.io/bitnami/kubectl:1.21.6
      - us.gcr.io/k8s-artifacts-prod/autoscaling/cluster-autoscaler:v1.21.0
      - k8s.gcr.io/nfd/node-feature-discovery:v0.8.2
      - nvcr.io/nvidia/gpu-feature-discovery:v0.4.1
      - docker.io/library/busybox:1
      - docker.io/mesosphere/pause-alpine:3.2
      - docker.io/mesosphere/dkp-diagnostics-node-collector:v0.3.3
    ```

    ```bash
    ./konvoy-image build --ami-regions us-west-1,us-east-1 --region us-east-1 --source-ami ami-092e75227e47facfc --overrides overrides/custom.yaml --overrides overrides/images.yaml images/ami/centos-7.yaml
    ```

Then, generate the cluster configuration file.

## Create the cluster configuration file

1.  Update `cluster-aws.sh` with the existing infrastructure values.

    ```bash
    vi cluster-aws.sh
    ```

1.  Generate the cluster configuration file from the updated cluster.sh file.

    ```bash
    ./cluster.sh
    ```

    <p class="message--note"><strong>NOTE: </strong>An Amazon Linux 2-based AMI runs the <code>autotune</code> utility to set Linux kernel parameters optimal for the EC2 instance type. Kubernetes requires the <code>ipv4_forward</code> kernel parameter to be enabled, but the <code>autotune</code> utility disables it by default. To override the default, add the following to the <code>cluster-sbx.yaml</code>.</p>

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

    <p class="message--note"><strong>NOTE: </strong>Update the AMI root volume size to match the new AMI generated with Konvoy Image Builder for both the control planes and default node pool.</p>

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
When ready, begin configuring the control plane.

## Configuring the cluster control plane
1.  Apply the cluster configuration.

    ```bash
    kubectl apply -f cluster-sbx.yaml
    ```

1.  Monitor the Kubernetes cluster deployment.

    ```bash
    watch ./dkp describe cluster -c cluster-sbx
    ```

## Add cluster controllers

1.  Get the kubeconfig file.

    ```bash
dkp get kubeconfig -c cluster-sbx > cluster-sbx.conf
    ```

1.  Verify the nodes are ‘Ready’.

    ```bash
    kubectl --kubeconfig cluster-sbx.conf get nodes
    ```

1.  Add the ClusterAPI controllers to the cluster

    ```bash
    ./dkp create bootstrap controllers --with-aws-bootstrap-credentials=false --kubeconfig cluster-sbx.conf
    ```

1.  When the workload cluster is ready, move the cluster lifecycle services to the workload cluster.

    ```bash
    ./dkp move --to-kubeconfig cluster-sbx.conf
    ```

1.  Wait for the cluster control-plane to be ready

    ```bash
    kubectl --kubeconfig cluster-sbx.conf wait --for=condition=ControlPlaneReady "clusters/cluster-sbx" --timeout=20m
	```
	
    Output
	```sh
    cluster.cluster.x-k8s.io/aws-example condition met
    ```
Then, generate the Kommander install values.

## Setting up Kommander via the air-gapped bundles


1. 	Generate the Kommander install values YAML file.

	```bash
	./kommander install --init > values.yaml
	```
1.	Override the defaults with the following values.

	```bash
	vi values.yaml
	```

	Kommander values:

	```bash
	// Diff
	kommander: null
	---
	kommander:
		values: |
		authorizedlister:
			image:
			tag: v2.1.1-amd64
		controller:
			containers:
			manager:
				image:
				tag: v2.1.1-amd64
		webhook:
			image:
			tag: v2.1.1-amd64
		fluxOperator:
			containers:
			manager:
				image:
				tag: v2.1.1-amd64
		kommander-licensing:
			controller:
			containers:
				manager:
				image:
					tag: v2.1.1-amd64
			webhook:
			image:
				tag: v2.1.1-amd64
		kubetools:
			image:
			tag: v2.1.1-amd64  
	```
	
	Traefik values:
	```bash
	// Diff
	traefik: null
	---
	traefik:
		values: |
		service:
			annotations:
			service.beta.kubernetes.io/aws-load-balancer-internal: "true"
	```
	
	App management image tag values:
	```bash
	// Diff
	appManagementImageTag: v2.1.1
	---
	appManagementImageTag: v2.1.1-amd64
	airgapped:
	enabled: true
	helmMirrorImageTag: v2.1.1-amd64
	```
	
1. 	Install all of the D2iQ addons.
	```bash
	./kommander --kubeconfig cluster-sbx.conf install --kommander-applications-repository kommander-applications-2.1.1 --installer-config values.yaml
	```
1. 	Wait for the installation to finish and for the applications to become ready.
	
	```bash
	kubectl --kubeconfig cluster-sbx.conf -n kommander wait --for condition=Released helmreleases --all --timeout 15m
	```
	Output:
	```sh
	helmrelease.helm.toolkit.fluxcd.io/centralized-grafana condition met
	helmrelease.helm.toolkit.fluxcd.io/dex condition met
	helmrelease.helm.toolkit.fluxcd.io/dex-k8s-authenticator condition met
	helmrelease.helm.toolkit.fluxcd.io/fluent-bit condition met
	helmrelease.helm.toolkit.fluxcd.io/gitea condition met
	helmrelease.helm.toolkit.fluxcd.io/grafana-logging condition met
	helmrelease.helm.toolkit.fluxcd.io/grafana-loki condition met
	helmrelease.helm.toolkit.fluxcd.io/karma condition met
	helmrelease.helm.toolkit.fluxcd.io/kommander condition met
	helmrelease.helm.toolkit.fluxcd.io/kommander-appmanagement condition met
	helmrelease.helm.toolkit.fluxcd.io/kube-prometheus-stack condition met
	helmrelease.helm.toolkit.fluxcd.io/kubecost condition met
	helmrelease.helm.toolkit.fluxcd.io/kubecost-thanos-traefik condition met
	helmrelease.helm.toolkit.fluxcd.io/kubefed condition met
	helmrelease.helm.toolkit.fluxcd.io/kubernetes-dashboard condition met
	helmrelease.helm.toolkit.fluxcd.io/kubetunnel condition met
	helmrelease.helm.toolkit.fluxcd.io/logging-operator condition met
	helmrelease.helm.toolkit.fluxcd.io/logging-operator-logging condition met
	helmrelease.helm.toolkit.fluxcd.io/minio-operator condition met
	helmrelease.helm.toolkit.fluxcd.io/prometheus-adapter condition met
	helmrelease.helm.toolkit.fluxcd.io/prometheus-thanos-traefik condition met
	helmrelease.helm.toolkit.fluxcd.io/reloader condition met
	helmrelease.helm.toolkit.fluxcd.io/thanos condition met
	helmrelease.helm.toolkit.fluxcd.io/traefik condition met
	helmrelease.helm.toolkit.fluxcd.io/traefik-forward-auth-mgmt condition met
	helmrelease.helm.toolkit.fluxcd.io/velero condition met
	```
Then, begin bootstrapping a cluster in the environment you installed into.

## Bootstrapping a cluster

* For bootstrapping an AWS cluster, refer to [Bootstrap in the AWS Air-Gapped instructions.][awsairgapped]
* For bootstrapping in a pre-provisioned environment, refer to [Bootstrap in the Pre-Provisioned instructions.][preprov]

[preprov]: [https://docs.d2iq.com/dkp/konvoy/2.1/choose-infrastructure/pre-provisioned/bootstrap/]
[awsairgapped]: [https://docs.d2iq.com/dkp/konvoy/2.1/choose-infrastructure/aws/air-gapped/bootstrap/]
[rhel_7_9]: https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/7.9_release_notes/index
[centos7]: https://wiki.centos.org/action/show/Manuals/ReleaseNotes/CentOS7.2003
