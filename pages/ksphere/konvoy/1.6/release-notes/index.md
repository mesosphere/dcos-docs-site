---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
menuWeight: 0
excerpt: View release-specific information for Konvoy
beta: true
enterprise: false
---

<!-- markdownlint-disable MD034 -->

## Release Notes

[button color="purple" href="https://support.d2iq.com/s/entitlement-based-product-downloads"]Download Konvoy[/button]

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. For new customers, contact your sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download Konvoy.</p>

### Version v1.6.0-rc.2 - Released 9 October 2020

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.16.x |
|**Maximum** | 1.18.x |
|**Default** | 1.18.9 |

#### Improvements

- CLI: New check to validate system times on the nodes in the cluster are within 30 seconds.
- GCP: The kube-apiserver load balancer timeouts were increased to improve stability: timeout 1s->3s, check interval 1s -> 2s, healthy threashold 2->3, unhealthy treshold 2->3.

#### Addons improvements

- Kommander: Fix a race condition that would prevent the addon from being installed due to unbound PVCs.

#### Bug fixes

- CLI: Don't include internal `controlplane` and `bastion` when generating a sample `inventory.yaml` file.

#### Component version changes

- Kommander `v1.2.0-rc.1`
- kubernetes-base-addons `testing-2.5.0-3`

### Version v1.6.0-rc.1 - Released 2 October 2020

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.16.x |
|**Maximum** | 1.18.x |
|**Default** | 1.18.9 |

#### Improvements

- CLI: Add RHEL and CentOS 8.2 to supported platforms.
- API: Add ability to override the OS distribution discovered by Ansible by setting `os.assumeOperatingSystemDistribution` in the `cluster.yaml`.
- API: New field `spec.kubernetes.kube-reserved` to define the resources to reserve on all of the kubelets in the cluster.
- Airgapped: The release now also includes the artifacts for darwin.
- Ansible: When installing Containerd `v1.2.13` use the same `d2iq` RPM repo that is already being used for `v1.3.x`. This repo provides packages with `nokmem` accounting flag. (COPS-6465)
- Diagnose: Collect loaded kernel modules.
- Diagnose: Collect PCI devices data.
- Diagnose: Collect Containerd configuration.
- Diagnose: Collect Nvidia container runtime configuration.
- Diagnose: Collect the kubeadm cert expiration data.

#### Addons improvements

- Kubeaddons: The kubeaddons-controller no longer installs Tiller.

#### Bug fixes

- CLI: Fix a bug `unable to create context store: $HOME is not defined` caused by a recent Docker change by passing the environment variables from the host when running the Konvoy container.
- Ansible: Fix multiple `[WARNING]` messages that were being during execution.
- AWS: The provisioner will now wait 5 minutes instead of 2 minutes for the Gateway Route to be created and avoid timeout issues.
- Addons: Fix an issue where cert-manager and fluenbit prevented upgrades from previous versions of Konvoy.

#### Component version changes

- Kubernetes `v1.18.9`
- Containerd `v1.3.7`
- Calico `v3.16.1`
- Kommander `testing-1.18-1.2.0-rc.1`
- kubernetes-base-addons `testing-1.18-2.5.0`

### Version v1.6.0-beta.1 - Released 15 September 2020

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.16.x |
|**Maximum** | 1.17.x |
|**Default** | 1.17.11 |

#### Disclaimer

<p class="message--important"><strong>IMPORTANT: </strong>Upgrading from any previous version of Konvoy is not supported.</p>

<p class="message--important"><strong>IMPORTANT: </strong>Dispatch is not supported with this version.</p>

#### Improvements

- CLI: Improve the reliability when interacting with docker with `konvoy config images`, by adding retries where needed.
- Ansible: Increase the number of retries checking kubelet during the kubernetes deployment workflow.
- Ansible: During failures to run `kubeadm init` during kubernetes deployment and upgrade workflows errors will no longer occur during the rescue tasks for failures to cleanup the bootstrap_token, as this is an innocuous failure.

#### Addons improvements

- Kommander: Add support for attaching airgapped Kubernetes clusters.

#### Bug fixes

- Terraform: Fix an issue preventing AWS ELBs from being tagged according to their corresponding Service annotations. (COPS-6482)
- Airgapped: Set `disable_gpg_check: yes` when installing Nvidia RPM packages, to avoid GPG failures. This is already the behavior when installing the packages from the Nvidia repo. (COPS-6474)
- Airgapped: Import Nvidia GPG key during when installing local packages. (COPS-6474)
- Diagnose: Fixed possible exception when running `konvoy diagnose`.

#### Component version changes

- Kubernetes `v1.17.11`
- Kubeaddons `v0.19.3`
- Kommander `testing-1.17-1.2.0-beta.1`
- Autoprovisioning `v0.4.5`
- kubernetes-base-addons `testing-1.17-2.4.0`
- Ansible `v2.9.13.0`
- Mitogen `a60c6c14a2473c895162a1b58a81bad0e63d1718`
- Helm `v3.3.1`

### Version v1.6.0-beta.0 - Released 27 August 2020

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.16.x |
|**Maximum** | 1.17.x |
|**Default** | 1.17.11 |

#### Disclaimer

<p class="message--important"><strong>IMPORTANT: </strong>-Upgrading from any previous version of Konvoy is not supported.</p>

#### Improvements

- AWS: Update the default AWS AMIs to CentoOS 7.8.
- AWS: Use the CA bundle when `AWS_CA_BUNDLE` is set.
- Azure: Default worker VM Type changed to `Standard_D8s_v3`.
- Azure: Deletion of disk resources during Azure cluster destruction is now faster.
- CLI: Add support for providing a custom CA certificate for a docker registry.
- CLI: Allow installing with Containerd version `v1.3.7` or greater, in addition to the existing versions. (COPS-6315)
- CLI: Add Helm repository support when deploying addons.
- CLI: Add Helm v3 support when deploying addons.
- CLI: Add support for deploying RHEL 7.8.
- CLI: If available, pass `ClusterConfiguration` values when running `konvoy run playbook`.
- CLI: If present, automatically copy `extras/cloud-provider/cloud.conf` file to the remote machines and use the user provided configuration where needed in the Kubernetes cluster.
- CLI: New flag `--clean-local-volumes` that will automatically clean the data in the default Konvoy local volumes location `/mnt/disks/*/`.
- CLI: New command `konvoy destroy local-volumes` to clean the data in the default Konvoy local volumes location `/mnt/disks/*/`.
- CLI: Retry API requests during upgrades to prevent connection flakes causing an upgrade failure.
- CLI: Return correct pod status for upgrade safety checks.
- CLI: Provisioning cloud infrastructre now retries 1 time before giving up.
- CLI: Provisioning cloud infrastructure can now tear down newly created nodes during the provisioning stage when they are not healthy.
- CLI: If available, use host CA bundle when running `konvoy` on Linux. Set `KONVOY_DISABLE_HOST_CA=true` to go back to previous behavior of using the CA in the `konvoy` container.
- CLI: Remove support for Kubernetes 1.15.
- Ansible: The etcd metrics deployment task will now retry a total of 6 possible times and a total of 1 minute of delay time to provide extra settling time for the GCP cloud environment.
- Airgapped: Automatically import required GPG keys when installing local RPM packages.
- Diagnose: Collect the logs of previous restarted pods when running `konvoy diagnose`.
- Diagnose: `konvoy diagnose` now collects status from Helm 3 releases too (not just Helm 2).

#### Bug fixes

- AWS: Automatically determine the required setting for `skip_metadata_api_check` even when not explicitly set.
- GCP: Improve provisioning stability by using a deterministic imagefs block device name.
- CLI: Fix a bug during upgrades where certain pods deployed by konvoy, prevented nodes from being upgraded.
- Ansible: Rebuild Containerd RPM packages with `nokmem` accounting flag. (COPS-6465)
- Ansible: Fix a bug that prevents Containerd from starting when multiple `imageRegistries` are defined.
- Ansible: Fix a bug where installing on an onprem cluster would fail when configuring the chrony service.
- Ansible: Properly recover clusters when the first control-plane node is replaced. (COPS-6198)
- Autoscaling: Add support for basic authentication with `registry:2` Docker registry. (COPS-6370)
- Airgapped: Fix a bug where an air-gapped upgrade fails due to the missing `kubernetes-cni` package, when installing `kubeadm`.
- Airgapped: Include additional RPMs required for the Kubelet to install. (COPS-6345)
- Diagnose: Properly collect logs from `dispatch` and `istio-system` namespaces. (COPS-6294)

#### Component version changes

- Kubernetes `v1.17.11`
- Kommander `testing-1.17-1.2.0-beta.0`
- Autoprovisioning `v0.3.3`
- kubernetes-base-addons `testing-1.17-2.3.0`
- Calico `v3.13.5`
- Ansible `v2.7.18.0`
- Go `1.14.7`
- Helm `v3.3.0`
- Docker `v19.03.12`
- Terraform AWS plugin to `v2.70.x`

### Version v1.5.2 - Released 26 August 2020

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.15.4 |
|**Maximum** | 1.17.x |
|**Default** | 1.17.11 |

#### Improvements

- Ansible: When installing Containerd `v1.2.13` use the same `d2iq` RPM repo that is already being used for `v1.3.x`. This repo provides packages with `nokmem` accounting flag. (COPS-6465)
- CLI: If available, pass `ClusterConfiguration` values when running `konvoy run playbook`.

#### Bug fixes

- Ansible: Rebuild Containerd RPM packages with `nokmem` accounting flag. (COPS-6465)
- Autoscaling: Add support for basic authentication with `registry:2` Docker registry. (COPS-6370)
- Airgapped: Include additional RPMs required for the Kubelet to install. (COPS-6345)

#### Component version changes

- Kubernetes `v1.17.11`
- Kommander `stable-1.17-1.1.2`
- Containerd `v1.3.7`
- Autoprovisioning `v0.3.3`
- kubernetes-base-addons `stable-1.17-2.2.0`

### Version v1.5.1 - Released 12 August 2020

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.15.4 |
|**Maximum** | 1.17.x |
|**Default** | 1.17.11 |

#### Improvements

- Azure: Default worker VM Type changed to `Standard_D8s_v3`.
- AWS: Add ability to use the CA bundle when `AWS_CA_BUNDLE` environment variable is set.
- CLI: If available, use host CA bundle when running `konvoy` on Linux. Set `KONVOY_DISABLE_HOST_CA=true` to go back to previous behavior of using the CA in the `konvoy` container.
- CLI: Allow installing with Containerd version `v1.3.7` or greater, in addition to the existing versions. (COPS-6315)
- CLI: If present, automatically copy `extras/cloud-provider/cloud.conf` file to the remote machines and use the user provided configuration where needed in the Kubernetes cluster.
- CLI: Pull the cluster state from remote if available before running `konvoy` commands, removing the need to run `konvoy pull` in most cases.
- Diagnose: Collect the logs of previous restarted pods when running `konvoy diagnose`.
- Diagnose: Collect helm3 releases in addition to helm2 releases.

#### Bug fixes

- CLI: Fix a bug during upgrades where certain pods deployed by konvoy, prevented nodes from being upgraded.
- Ansible: Fix a bug that prevents Containerd from starting when multiple `imageRegistries` are defined.
- Ansible: Properly recover clusters when the first control-plane node is replaced. (COPS-6198)
- Ansible: Fix unique hostname preflight task failure. (COPS-6409, COPS-6428)
- AWS: Automatically determine the required setting for `skip_metadata_api_check` even when not explicitly set.
- GCP: Improve provisioning stability by using a deterministic imagefs block device name.
- Diagnose: Properly collect logs from `dispatch` and `istio-system` namespaces. (COPS-6294)

#### Component version changes

- Kubernetes `v1.17.11`
- kubernetes-base-addons `stable-1.17-2.1.1`
- Kommander `stable-1.17-1.1.1`
- Calico `v3.13.5`
- Ansible `v2.7.18.0`
- Go `1.13.15`
- Docker `v19.03.12`

### Version v1.5.0 - Released 20 July 2020

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.15.4 |
|**Maximum** | 1.17.8 |
|**Default** | 1.17.8 |

#### Disclaimer

-   You must read the [documentation](../upgrade/upgrade-cli#upgrading-konvoy-from-v14x-to-v150) before attempting an upgrade.
-   See the changes for additional components:
    - Kubernetes Base Addons [Release Notes](kubernetes-base-addon)
    - Kommander [Release Notes](https://docs.d2iq.com/ksphere/kommander/1.1/release-notes/)
    - Dispatch [Release Notes](https://docs.d2iq.com/ksphere/dispatch/1.2/release-notes/)

#### Important Changes

-   Support for Kubernetes `v1.17.x`.
-   Support CentOS/RHEL `7.7`.
-   Support for cluster autoscaler in `AWS` and `Azure`.
    - You can now configure Konvoy to automatically scale machine instances based on workload requirements. For more information, read [Autoscaling](../autoscaling).
-   Upgrade improvements, including batch upgrade `--max-parallel-nodes` and nodepool specific upgrades `--target-node-pools`.
-   The `gcp` provisioner to create clusters in [Google Cloud Platform](https://cloud.google.com/) is now GA.

#### Improvements

-   CLI: New command `konvoy deploy auto-provisioning` to deploy only the auto-provisioning functionality.
-   CLI: New command `konvoy run playbook` to run custom Ansible playbooks using Kovnoy.
-   CLI: New flag `--skip-credentials-display` to skip displaying the admin credentials after the installation.
-   CLI: New flag `--without-addons` flag for `konvoy up`, `konvoy deploy` and `konvoy check` commands.
-   CLI: New flag `--with-checks` for `konvoy up` and `konvoy deploy` commands checks and confirms that the cluster is in a ready state before progressing to the next stages.
-   CLI: New flag `--max-parallel-nodes` when running `konvoy up`, `konvoy deploy` or `konvoy deploy kubernetes` to specify the number of nodes to upgrade in parallel. The value can be either an integer representing the number of nodes, or a percentage. Passing a value of `1` will upgrade the nodes serially.
-   CLI: New flag `--target-node-pools` flag for `konvoy up` and `konvoy deploy` commands to install or upgrade a subset of worker node pools.
-   CLI: New flag `--force` for `konvoy pull` command to fetch cluster information even if another provisioning process is running in the cluster.
-   CLI: New flag `--v` flag to set the verbosity level when running `konvoy` commands (default is `--v 5`). The `--verbose` flag is deprecated but still usable.
-   CLI: Add a warning about the potentially destructive nature of the `--without-draining` flag.
-   CLI: Add the conductor addon repo as a default repository in `cluster.yaml` and set it to `enabled: false`.
-   CLI: Add `ec2:ModifyVolume` and `ec2:DescribeVolumesModifications` to the default node role policy, to allow the CSI driver to resize volumes.
-   CLI: Use region STS endpoints by default to support running the autoscaling functionality when airgapped. To revert back to previous behavior, set the environment variable `AWS_STS_REGIONAL_ENDPOINTS=legacy` before running Konvoy.
-   CLI: Execute the Calico preflight checks in Go code to greatly improve the installation speed on large clusters.
-   CLI: When running `konvoy init` or `konvoy up`, the AWS AvailabilityZones are automatically determined from the region specified, either in the `AWS_REGION` environment variable, or the default `us-west-2`.
-   CLI: Allow symlinks in the `extras/provisioner` directory.
-   CLI: The `konvoy pull` command now creates the state directory if it does not exist.
-   CLI: The `--force-upgrade` flag now also applies to the control-plane nodes.
-   CLI: Properly validate CLI arguments for all of the commands to avoid running an incorrect command.
-   CLI: Now validates the calico version specified in `cluster.yaml` to be a valid version in the range: `>=3.13.0 <3.14.0`.
-   CLI: Diagnostics bundle now collects `df -H` output to help determine if there is disk pressure in the cluster. The bundle contains a `df.txt` file with the information gathered.
-   CLI: Konvoy exits with an error if an unsupported Kubernetes version upgrade is attempted.
-   CLI: Improve validation error for unknown `cluster.yaml` keys.
-   CLI: When running the `konvoy` command results in removal of a control-plane node, a new error is returned.
-   CLI: Print more logs for debugging when using `konvoy up --verbose`. This shows the output of `kubeadm token create --print-join-command`.
-   CLI: Add `AWS_SDK_LOAD_CONFIG` to the konvoy docker image, so `konvoy` can use the AWS ClI configuration.
-   CLI: Default Azure machine root volume, for the control plane, has been changed to `StandardSSD_LRS` to improve performance.
-   CLI: Improve the `konvoy config images` commands to skip trying to `load` or `pull` images when they are already available in local docker agent.
-   CLI: When running `konvoy up`, and upgrades are required but no `--upgrade` flag is passed, the user is presented with a confirmation prompt instead of failing.
-   CLI: Add `ps axfwwu` output to the diagnostics bundle.
-   CLI: New provisioner `gcp` to create clusters in [Google Cloud Platform](https://cloud.google.com/).
-   CLI: Diagnostics bundle now contains the output of `helm ls` and `helm status <release deployment>`.
-   CLI: New Konvoy image tag with `ubi8` base image is now available and can be used with `export KONVOY_VERSION=<version>-ubi8`.
-   CLI: Support deploying KUDO based addons on airgapped clusters.
-   API: Rename field `helmRepository` to `addonRepository`, `cluster.yaml` files generated by previous versions of Konvoy `v1.4.x` with `v1beta1` API will not be impacted.
-   API: New `cluster.yaml` option `spec.kubernetes.imageRepository` allows pulling control-plane images from an alternative repository instead of the default `k8s.gcr.io`.

    ```text
    kind: ClusterConfiguration
    apiVersion: konvoy.mesosphere.io/v1beta1
    spec:
      kubernetes:
        version: 1.16.9+d2iq.2
        imageRepository: docker.io/mesosphere
    ```

-   API: Decouple AWS public IP address association from bastion host and IGW creation in `v1beta2` API.
-   API: Invalid `nodePool` names now result in a validation error, instead of just printing a warning.
-   API: Validate that `spec.kubernetes.networking.podSubnet` and `spec.kubernetes.networking.serviceSubnet` are larger than `/24` to avoid `Calico` and `kube-controller-manager` failing during the installation.
-   API: Improve `spec.aws.vpc` validations for `aws` provisioner.
-   API: New `cluster.yaml` option `apiServerPort` for `aws` and `azure` provisioners, to specify the port to be used for the Kubernetes API server.
-   API: New field `autoProvisioning` that exposes auto-provisioning and autoscaler properties.
-   API: New cluster autoscaling feature for `aws` and `azure` provisioners. To enable, set the `autoscaling` field in your `cluster.yaml` similar to the below example:

    ```yaml
    kind: ClusterProvisioner
    apiVersion: konvoy.mesosphere.io/v1beta1
    spec:
      provider: aws
      nodePools:
      - name: autoscaled-workers
        count: 5
        autoscaling:
          minSize: 2
          maxSize: 10
    ```

    You will also use the new `konvoy pull` and `konvoy push` commands to upload the cluster state to the Kubernetes API, and sync your local `cluster.yaml` and terraform state from the Kubernetes API.
-   API: Nodes with an empty `node_pool` property, in the `inventory.yaml` file, are now automatically labeled `konvoy.mesosphere.com/node_pool=konvoy.mesosphere.com_control-plane`, for the control-plane nodes, and `konvoy.mesosphere.com/node_pool=konvoy.mesosphere.com_no-node-pool` for the worker nodes. All other nodes will continue to be labeled `konvoy.mesosphere.com/node_pool=<node_pool>`.
-   API: Support named worker pools in the `v1beta2` API. You can now delete a worker pool without affecting other node pools.
-   API: Remove the validation requiring the SSH key in the ssh-agent, when using bastion nodes. This is no longer required and the key may be used directly instead of specifying its location in the `cluster.yaml` flle.
-   API: Add validation for `control_plane_endpoint` to require a port number in the range of 1-65535 inclusive.
-   API: Set `imageID` in cluster.yaml for all provisioners instead of dynamically determining the image to use at runtime. This allows Konvoy to update the default imageID in the future without requiring users to modify the values in `cluster.yaml`.
-   API: New option `spec.kubernetes.networking.iptables.addDefaultRules` enables Konvoy to automatically setup iptables rules, required for the installation when the OS has strict iptables configuration.
-   Terraform: Enable users to specify terraform go template in the `extras/provisioner` directory.
-   Ansible: Use secure ports for kube-controller-manager and kube-scheduler `/healthz` endpoint.
-   Ansible: Use cloud-provider specific time sources for chrony.
-   Ansible: Automatically import required GPG keys when installing local RPM packages.
-   Ansible: Only run preflight checks on nodes that will be modified, greatly improving the installation of additional nodes or upgrade speeds on large clusters.
-   Ansible: The `autoscaler` chart is now deployed using Helm, allowing to override parameters using the `autoProvisioning` field in `cluster.yaml`.
-   Ansible: When containerd version >= 1.3.x is used, konvoy now downloads the containerd rpm/deb packages from repositories maintained by D2iQ.
-   Ansible: No longer assume `PATH` settings on the nodes. This caused issues in certain environments not being able execute some Ansible tasks.
-   Ansible: Configmaps are now encrypted at rest in etcd in all new clusters.
-   Ansible: New preflight check to validate if the `/var/lib/etcd` directory is empty.
-   Ansible: Only update yum cache when required to install RPM packages.
-   AWS: Change the default AWS AMI to `CentOS Linux 7 x86_64 HVM EBS ENA 2002_01`(CentOS 7.7).
-   Azure: Change the default Azure image to `OpenLogic:CentOS:7.7:7.7.2020042900`(CentOS 7.7).
-   Azure: Change the default Azure region for new clusters to `eastus2` to improve stability.
-   GCP: New option `spec.machine.gcp.associatePublicIPAddress` to decouple bastion host creation from associating public IP for nodes.
-   GCP: Support arbitrary number of control plane nodes. Previously, only 3 and 5 were supported.
-   GCP: Rename `gcp.network.create_internet_gateway_route` to `gcp.network.createInternetGatewayRoute`.

#### Bug fixes

- CLI: Fix a bug where an air-gapped upgrade fails due to the missing `kubernetes-cni` package, when installing `kubeadm`.
- Ansible: Fix an error in the preflight checks that prevented installing on Ubuntu 18 (bionic).
- CLI: Fix `konvoy completion` command containing extra carriage-return in line termination.
- CLI: Fix a bug where `konvoy reset` may fail when the Kubernetes apiserver is not responding.
- Fix a bug that caused `konvoy init` to fail with `already up-to-date`, when using local directories, as the addon git repos.
- Fix a bug where an empty `creationTimestamp` resulted in failure when trying to upgrade.
- Fix a bug where the `konvoy diagnose` command fails if it was run before the first control-plane node was setup.
- Fix a bug where the `kubelet` and `chrony` systemd services may not automatically start, after a machine reboot.
- Fix a bug where `konvoy config images seed` incorrectly tries to load or pull certain images, even when they are already present in the docker agent.
- Fix a bug where the `HTTP_PROXY` environment variable, set on the cluster hosts, could prevent successful installation.
- Fix a bug where running `konvoy reset` fails on Ubuntu, when removing Deb packages.
- Fix a bug where setting `spec.addons.helmRepository` and `spec.kubernetes.networking.httpProxy` prevents the addons from being installed.
- Import GPG keys before installing any RPM packages, which caused errors on any secured OS.
- Fix a bug where provisioning fails looking up the default AWS AMI in certain regions, even if `imageID` is set.
- Fix a bug where the addon controller namespace is reapplied every time Konvoy runs, removing any metadata that might have been set.
- Fix a bug with the airgapped artifact where `konvoy init` would fail with `Error: unexpected client error: reference not found`, requiring users to run `cd kubernetes-base-addons && git checkout master`.
- Fixed a bug that would fail to install on Ubuntu if containerd.io was not already installed.

#### Component version changes

- Kubernetes `v1.17.8`
- kubernetes-base-addons `stable-1.17-2.0.2`
- Autoprovisioning(YAKCL) `v0.1.7`
- Kommander `stable-1.17-1.1.0`
- Dispatch `stable-1.17-1.2.2`
- Conductor `stable-1.17-1.0.0`
- Calico `v3.13.4`
- Ansible `v2.7.17.0`
- Helm `v2.16.7`
- Go `1.13.13`
- Docker `v19.03.11`

#### Addon versions

-   awsebscsiprovisioner: 0.5.0-4
    - awsebscsiprovisioner: 0.5.0
-   awsebsprovisioner: 1.0.0-1
    - awsebsprovisioner: 1.0
-   azuredisk-csi-driver: 0.7.1-2
    - azuredisk-csi-driver: 0.7.1
-   azurediskprovisioner: 1.0.0-1
    - azurediskprovisioner: 1.0
-   cert-manager: 0.10.1-4
    - cert-manager: 0.10.1
-   conductor: 1.0.0-1
    - conductor: 1.0.0
-   dashboard: 2.0.3-3
    - dashboard: 2.0.3
-   defaultstorageclass-protection: 0.0.1-1
    - defaultstorageclass-protection: 0.0.1
-   dex: 2.22.0-6
    - dex: 2.22.0
-   dex-k8s-authenticator: 1.2.1-1
    - dex-k8s-authenticator: v1.2.1
-   dispatch: 1.2.2
    - dispatch: 1.2.2
    - tekton: 0.11.0
    - argo-cd: 1.4.2
-   elasticsearch: 6.8.2-5
    - elasticsearch: 6.8.2
-   elasticsearch-curator: 5.7.6-2
    - elasticsearch-curator: 5.7.6
-   elasticsearchexporter: 1.1.0-1
    - elasticsearchexporter: 1.1.0
-   external-dns: 0.5.18-1
    - external-dns: 0.5.18
-   flagger: 0.19.0
    - flagger: 0.19.0
-   fluentbit: 1.3.7-1
    - fluentbit: 1.3.7
-   gatekeeper: 3.0.4-1
    - gatekeeper: 3.0.4-beta.1
-   gcpdisk-csi-driver: 0.7.1-2
    - gcpdisk-csi-driver: 0.7.1
-   gcpdiskprovisioner: 1.0.0-2
    - gcpdiskprovisioner: 1.0
-   istio: 1.6.4-3
    - istio: 1.6.4
    - kiali: 1.18.0
    - jaeger: 1.16.0
-   kibana: 6.8.2-4
    - kibana: 6.8.2
-   kommander: 1.1.0-57
    - kommander: 1.1.0
    - thanos: 0.3.21
    - karma: 1.4.1
    - kommander-grafana: 6.6.0
-   konvoyconfig: 0.0.4-1
    - konvoyconfig: 0.0.4
-   kube-oidc-proxy: 0.1.1-3
    - kube-oidc-proxy: v0.1.1
-   localvolumeprovisioner: 1.0.0-1
    - localvolumeprovisioner: 1.0
-   metallb: 0.9.3-1
    - metallb: 0.9.3
-   nvidia: 0.2.0-5
    - nvidia: 0.2.0
-   opsportal: 1.1.0-12
    - opsportal: 1.1.0
-   prometheus: 0.38.1-12
    - prometheus: 2.19.2
    - grafana: 6.7.3
    - prometheus-operator: 0.38.1
    - alertmanager: 0.20.0
-   prometheusadapter: 0.5.0-1
    - prometheusadapter: 0.5.0
-   reloader: 0.0.60-1
    - reloader: v0.0.60
-   traefik: 1.7.24-22
    - traefik: 1.7.24
-   traefik-forward-auth: 1.0.4-7
-   velero: 1.0.1-5

### Version v1.4.5 - Released 26 June 2020

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.15.4 |
|**Maximum** | 1.16.12 |
|**Default** | 1.16.12 |

#### Improvements

- CLI: Update Calico version to address the [CVE](https://docs.projectcalico.org/archive/v3.13/release-notes/#v3134).

#### Bug fixes

- CLI: Fix `konvoy completion` command containing extra carriage-return in line termination.

#### Component version changes

- Kubernetes `v1.16.12`
- Keepalived `v2.0.20`
- Calico `v3.13.4`
- Go `v1.13.12`
- Docker `v19.03.11`

#### Disclaimer

-   Versions of Konvoy `v1.4.x` are not compatible and are not supported with [Kubernetes Base Addons](https://github.com/mesosphere/kubernetes-base-addons) `v2.x+` or [Kommander](https://d2iq.com/solutions/ksphere/kommander) `v1.1+`.
    If you need addons that fall outside of this support please upgrade to the latest release of Konvoy.

### Version v1.4.4 - Released 28 May 2020

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.15.4 |
|**Maximum** | 1.16.12 |
|**Default** | 1.16.9 |

#### Improvements

-   Change the default Azure region for new clusters to `eastus2` to improve stability.
-   New `cluster.yaml` option `spec.kubernetes.imageRepository` allows pulling control-plane images from an alternative repository instead of the default `k8s.gcr.io`.

    ```text
    kind: ClusterConfiguration
    apiVersion: konvoy.mesosphere.io/v1beta1
    spec:
      kubernetes:
        version: 1.16.9+d2iq.2
        imageRepository: docker.io/mesosphere
    ```

#### Disclaimer

-   Versions of Konvoy `v1.4.x` are not compatible and are not supported with [Kubernetes Base Addons](https://github.com/mesosphere/kubernetes-base-addons) `v2.x+` or [Kommander](https://d2iq.com/solutions/ksphere/kommander) `v1.1+`.
    If you need addons that fall outside of this support please upgrade to the latest release of Konvoy.

### Version v1.4.3 - Released 12 May 2020

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.15.4 |
|**Maximum** | 1.16.12 |
|**Default** | 1.16.9 |

#### Improvements

- Adds a warning about the potentially destructive nature of the `--without-draining` flag.
- New `cluster.yaml` validation `spec.containerRuntime.containerd`, that is, `1.2.6` or `1.2.13`.

#### Bug fixes

- Fix a bug where `HTTP_PROXY` environment variable set on the host may prevent from installing successfully.
- Fix a bug with the airgapped artifact where `konvoy init` would fail with `Error: unexpected client error: reference not found`, requiring users to run `cd kubernetes-base-addons && git checkout master`.
- Fix a bug where the `kubelet` and `chrony` Systemd services may not automatically start after a machine reboot.

#### Component version changes

- Kommander `v1.0.1`
- Kubernetes `v1.16.9`
- Containerd `1.2.13`
- Calico `v3.13.3`
- Ansible `v2.7.17.0`
- Go `v1.13.10`
- Docker `v19.03.8`

#### Disclaimer

-   Versions of Konvoy `v1.4.x` are not compatible and are not supported with [Kubernetes Base Addons](https://github.com/mesosphere/kubernetes-base-addons) `v2.x+` or [Kommander](https://d2iq.com/solutions/ksphere/kommander) `v1.1+`.
    If you need addons that fall outside of this support please upgrade to the latest release of Konvoy.

### Version v1.4.2 - Released 24 March 2020

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.15.4 |
|**Maximum** | 1.16.12 |
|**Default** | 1.16.8 |

#### Disclaimer

-   Versions of Konvoy `v1.4.x` are not compatible and are not supported with [Kubernetes Base Addons](https://github.com/mesosphere/kubernetes-base-addons) `v2.x+` or [Kommander](https://d2iq.com/solutions/ksphere/kommander) `v1.1+`.
    If you need addons that fall outside of this support please upgrade to the latest release of Konvoy.
-   The default value of `vpc.enableVPCEndpoints` was changed to `false` to prevent Konvoy unexpectedly modifying the endpoints in user provided VPCs.
    This value should already be present in your `cluster.yaml` file. Below is a partial `cluster.yaml` that contains the value you can add to retain the previous behavior of deploying VPC endpoints in your cluster.
    This resource should only be required where the networking configuration of the cluster does not allow for direct access to the AWS API.

    ```yaml
    kind: ClusterProvisioner
    apiVersion: konvoy.mesosphere.io/v1beta1
    metadata:
      name: konvoy
    spec:
      provider: aws
      aws:
        vpc:
          enableVPCEndpoints: true
    ```

#### Improvements

- Update default Kubernetes version to `v1.16.8` which fixes [CVE-2020-8552](https://github.com/kubernetes/kubernetes/issues/89378) found in a previous version.
- Update Calico to `v3.13.1` which fixes a [CVE-2019-11253](https://www.projectcalico.org/security-bulletins/#TTA-2019-003) found in a previous version.
- Update Ansible to `2.7.16.0` which fixes a CVE found in a previous version.
- Improve error output when addons can not be retrieved.
- Change the default value of `vpc.enableVPCEndpoints` to `false` to prevent Konvoy unexpectedly modifying the endpoints in user provided VPCs.
- Provide a new option `vpc.overrideDefaultRouteTable` to disabling Konvoy modifying the route table.

#### Bug fixes

- Fix a bug where provisioning would fail looking up the default AWS AMI in certain regions, even if `imageID` is set.
- In certain environments, the kubelet service can be in a started state, after the package is installed. Always stop that service to avoid `kubeadm` preflight errors.
- Properly set the `konvoy` version when writing out the marker file to remote hosts.

#### Component version changes

- Kubernetes `v1.16.8`
- Go `1.13.8`
- Calico `v3.13.1`
- Ansible `2.7.16`

### Version v1.4.1 - Released 04 March 2020

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.15.4 |
|**Maximum** | 1.16.12 |
|**Default** | 1.16.4 |

#### Improvements

- Update certain Ansible tasks to correctly reflect the changed status.

#### Bug fixes

- Fix a bug where the kubeaddons controller could not start when air-gapped.
- Fix a bug where certain addons were being installed even if set to `enabled: false`.
- Fixed a bug that would fail to install on Ubuntu if containerd.io was not already installed.

### Version v1.4.0 - Released 28 February 2020

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.15.4 |
|**Maximum** | 1.16.12 |
|**Default** | 1.16.4 |

#### Disclaimer

-   The generated release artifacts will now untar in `./konvoy_v1.4.0/konvoy` instead of `./linux/konvoy_v1.4.0/konvoy`.
-   The `nodePool.name` must be a valid Kubernetes label value in future release. This version of Konvoy prints a warning message if your nodePool names do not comply with the requirement.
-   The Kommander and Dispatch addons are now in their own repos.
-   Versions of Konvoy `v1.4.x` are not compatible and are not supported with [Kubernetes Base Addons](https://github.com/mesosphere/kubernetes-base-addons) `v2.x+` or [Kommander](https://d2iq.com/solutions/ksphere/kommander) `v1.1+`.
    If you need addons that fall outside of this support please upgrade to the latest release of Konvoy.

<p class="message--important"><strong>IMPORTANT: </strong>You must modify your <code>cluster.yaml</code> with these changes when upgrading from a previous version. You can also no longer use the <code>konvoy.mesosphere.io/v1alpha1</code> apiVersion in your <code>cluster.yaml</code> if you are also deploying Kommander or Dispatch. That API version did not support multiple addon repositories.</p>

Below is a partial `cluster.yaml` that contains the required changes.

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta1
spec:
  addons:
  - configRepository: https://github.com/mesosphere/kubernetes-base-addons
    configVersion: stable-1.16-1.2.0
    addonsList:
    - name: kommander
      enabled: false # remove the kommander addon or set "enabled: false"
    - name: dispatch
      enabled: false # remove the dispatch addon or set "enabled: false"
      ...
  - configRepository: https://github.com/mesosphere/kubeaddons-dispatch
    configVersion: stable-1.16-1.0.0
    addonsList:
    - name: dispatch # Dispatch is currently in Beta
      enabled: true
  - configRepository: https://github.com/mesosphere/kubeaddons-kommander
    configVersion: stable-1.16-1.0.0
    addonsList:
    - name: kommander
      enabled: true
```

#### Improvements

-   A preflight check fails if existing PVs (from a previous installation) are found.
-   Automatically label nodes with `konvoy.mesosphere.com/inventory_hostname` with the `node_pool` value set in `inventory.yaml` file.
-   Notarize the binaries produced for Darwin to be compatible with MacOS Catalina https://developer.apple.com/news/?id=12232019a.
-   Add `runc` version to diagnostic bundles generated by the diagnose subcommand.
-   Add `resolv.conf` to diagnostic bundles generated by the diagnose subcommand.
-   Add `etcdctl` diagnostic outputs to bundles generated by the diagnose subcommand.
-   Enable strict yaml parsing for `cluster.yaml`.
-   New flag `--without-draining` to skip draining nodes during upgrades.
-   Moved the Kommander and Dispatch addons to their own repos. Remove flags `--addons-config-repository` and `--addons-config-version` and instead added `--addons-repositories`.
-   New commands `konvoy drain`, `konvoy cordon` and `konvoy uncordon` that run the corresponding `kubectl` commands.
    - This functionality relies on the Kubernetes nodes having a label `konvoy.mesosphere.com/node_pool=_node_pool_` where `_node_pool_` corresponds to the `nodePool.name` defined in the `cluster.yaml` file.
    - Starting with this release, Konvoy automatically labels the nodes with the nodePool. You can run `konvoy deploy -y` to apply the labels prior to running these new commands.
-   New commands `konvoy get nodepools`, `konvoy create nodepool`, `konvoy scale nodepool` manage the `nodePool` entries in the `cluster.yaml` file. These commands do not change the infrastructure, you still need to run `konvoy up` to apply the changes.

#### Bug fixes

- Fix a bug where a failure with `konvoy down` and `konvoy reset` would prematurely delete files required on a retry.
- Fix a bug in `konvoy reset` that prevented Kubernetes system packages from being removed on Ubuntu 16.04.
- Fix a bug that causes `konvoy reset` to fail when running the command after the kubectl package is installed, but before `kubeadm` succeeds.
- Fix the URL that is printed for the ops-portal, after an install, when using a custom domain.
- Fix a bug where the cluster.yaml file was improperly parsed when there are `---` in addon values.
- Add Tekton utility images to the air-gapped release tar.

#### Addons improvements

-   Disable audit log collection in fluentd. It's been observed in production clusters that the audit log bloats the number of fields in an index. This causes resource limits to be filled and throttling to occur. We are disabling this collection pending further investigation. To maintain the previous behavior, set the values of the `fluentbit` addon as follows:

    ```yaml
          - name: fluentbit
            enabled: true
            values: |
              audit:
                enable: true
    ```

-   The Kommander and Dispatch addons are now in their own repos and were removed from the default kubernetes-base-addons repo.
-   Automatically deploy Kudo `v0.8.x` when the Kubeaddons controller is deployed.
-   New default addon `elasticsearch-curator` manages Elasticsearch indices and prevents them from filling up the disk.
-   RBAC authorization is now available for the Operations Portal addons. To maintain the previous behavior of all authenticated users having access to the Operations Portal addons, set the values of the `opsportal` addon as follows:

    ```yaml
          - name: opsportal
            enabled: true
            values: |
              opsportalRBAC:
                allowAllAuthenticated: true
    ```

    After this configuration is applied, external users must be granted access to Operations Portal resources explicitly. For information on creating policies see the [Portal Authorization](../access-authentication/rbac#portal-authorization) documentation.
-   Allow for using the default AWS AMI when installing GPU nodes.
-   In `dex-k8s-authenticator` allow scopes to be configured, and drop the `offline_access` scope as it is not used.
-   In `kube-oidc-proxy` enable token passthrough.
-   In `dex`:
    - Improve the LDAP connector validation in the Dex controller.
    - Fix an issue in the dex addon which disallowed adding local users.
    - Use the Dex controller v0.4.1, which includes support for OIDC group claims.
    - Upgrade Dex to v2.22.0, which supports groups claims for OIDC connectors.
-   Add logging to addon cleanup process so that addons are no longer silently deleted when disabled.

#### Component version changes

-   awsebscsiprovisioner: 0.4.0-1
    - awsebscsiprovisioner: 0.4.0
-   awsebsprovisioner: 1.0.0-1
    - awsebsprovisioner: 1.0
-   azuredisk-csi-driver: 0.5.1-1
    - azuredisk-csi-driver: 0.5.1
-   azurediskprovisioner: 1.0.0-1
    - azurediskprovisioner: 1.0
-   cert-manager: 0.10.1-2
    - cert-manager: 0.10.1
-   dashboard: 2.0.0-beta6
    - dashboard: 2.0.0-beta6
-   defaultstorageclass-protection: 0.0.1-1
    - defaultstorageclass-protection: 0.0.1
-   dex: 2.22.0-3
    - dex: 2.22.0
-   dex-k8s-authenticator: 1.1.1-3
    - dex-k8s-authenticator: v1.1.1
-   dispatch: 1.0.0-rc1
    - dispatch: 1.0.0-rc1
    - argo-cd: 1.4.2
-   elasticsearch: 6.8.2-1
    - elasticsearch: 6.8.2
-   elasticsearch-curator: 5.7.6-1
    - elasticsearch-curator: 5.7.6
-   elasticsearchexporter: 1.1.0-1
    - elasticsearchexporter: 1.1.0
-   external-dns: 0.5.18-1
    - external-dns: 0.5.18
-   flagger: 0.19.0
    - flagger: 0.19.0
-   fluentbit: 1.3.2-2
    - fluentbit: 1.3.2
-   gatekeeper: 3.0.4-1
    - gatekeeper: 3.0.4-beta.1
-   istio: 1.4.3-1
    - istio: 1.4.3
    - jaeger: 1.4.3
    - kiali: 1.4.3
-   kibana: 6.8.2-1
    - kibana: 6.8.2
-   kommander: 1.0.0-15
    - kommander: 1.0.0
    - kommander-grafana: 6.6.0
    - thanos: 0.3.9
    - karma: 1.4.0
-   konvoyconfig: 0.0.2-1
    - konvoyconfig: 0.0.2
-   kube-oidc-proxy: 0.1.1-2
    - kube-oidc-proxy: v0.1.1
-   localvolumeprovisioner: 1.0.0-1
    - localvolumeprovisioner: 1.0
-   metallb: 0.8.1-1
    - metallb: 0.8.1
-   nvidia: 0.2.0-3
    - nvidia: 0.2.0
-   opsportal: 1.0.0-10
    - opsportal: 1.0.0
-   prometheus: 0.34.0-4
    - prometheus-operator: 0.34.0
    - alertmanager: 0.19.0
    - grafana: 6.4.2
    - prometheus: 2.14.0
-   prometheusadapter: 0.5.0-1
    - prometheusadapter: 0.5.0
-   reloader: 0.0.49-1
    - dex: v0.0.49
-   traefik: 1.7.2-6
    - traefik: 1.7.12
-   traefik-forward-auth: 1.0.4-4
-   velero: 1.0.1-1

### Other Notable Changes

#### Component version changes

### Version v1.3.0 - Released 21 January 2020

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.15.4 |
|**Maximum** | 1.16.x |
|**Default** | 1.16.4 |

#### Disclaimer

**You must modify your `cluster.yaml` with these changes when upgrading from a previous version.**

Below is a partial `cluster.yaml` that contains the required changes.
Note that `apiVersion: konvoy.mesosphere.io/v1alpha1` has not been modified.

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1alpha1
spec:
  kubernetes:
    version: 1.16.4
  containerNetworking:
    calico:
      version: v3.10.1
  addons:
  - configRepository: https://github.com/mesosphere/kubernetes-base-addons
    configVersion: stable-1.16.4-2
    addonsList:
    ...
    - name: helm
      enabled: false # Must change to false or remove from the list
    - name: defaultstorageclass-protection
      enabled: true
    - name: external-dns
      enabled: true
      values: |
        aws:
          region:
        domainFilters: []
    - name: gatekeeper
      enabled: true
    - name: kube-oidc-proxy
      enabled: true
    - name: reloader
      enabled: true
```

Depending on the version you are upgrading from you may need to include additional addons. For the full list of addons refer to the [reference document](../reference/cluster-configuration/).

After modifying the `cluster.yaml` file, you can run `konvoy up --upgrade` to upgrade the Kubernetes and all of the addons.

#### Improvements

-   Add support for `azure` provisioner, refer to the [azure document](../install/install-azure/).
-   Add support for GPU(Nvidia) machines.
-   Add support for Debian 10 OS.
-   Change the default API version in `cluster.yaml` from `konvoy.mesosphere.io/v1alpha1` to `konvoy.mesosphere.io/v1beta1` and use the Kubernetes tooling to generate this API.
    - Refer to the [reference document](../reference/cluster-configuration/) for the updated options.
-   Change default machine sizes in AWS to `m5.2xlarge` for worker nodes and `m5.xlarge` for control-plane nodes. No action needed for users with existing clusters. This does not automatically modify the instance types, which would cause your cluster to be completely rebuilt.
-   Increase default worker count to 4 to accommodate additional addons.
-   Change default root disk type in AWS to `io1` for better etcd performance.
-   Change some field names in  `cluster.yaml` for better human readability. No action needed for users with existing clusters. The already generated `cluster.yaml` with `apiVersion: konvoy.mesosphere.io/v1alpha1` can still be used with this version of Konvoy. See below for the changed fields:

    Old `cluster.yaml`:

    ```yaml
    kind: ClusterProvisioner
    apiVersion: konvoy.mesosphere.io/v1alpha1
    spec:
      provider: aws
      aws:
        region: us-west-2
        vpc:
          internetGatewayDisabled: false
          vpcEndpointsDisabled: false
    ---
    kind: ClusterConfiguration
    apiVersion: konvoy.mesosphere.io/v1alpha1
    spec:
      packageRepository:
        defaultRepositoryInstallationDisabled: false
    ```

    New `cluster.yaml`:

    ```yaml
    kind: ClusterProvisioner
    apiVersion: konvoy.mesosphere.io/v1beta1
    spec:
      provider: aws
      aws:
        region: us-west-2
        vpc:
          enableInternetGateway: true
          enableVPCEndpoints: true
    ---
    kind: ClusterConfiguration
    apiVersion: konvoy.mesosphere.io/v1beta1
    spec:
      osPackages:
        enableAdditionalRepositories: true
    ```

-   Allow specifying the `cgroup-root` option for Kubelets, to better support running `konvoy` in a container.

    ```yaml
    kind: ClusterConfiguration
    apiVersion: konvoy.mesosphere.io/v1beta1
    spec:
      kubernetes:
        kubelet:
          cgroupRoot: "/kubelet"
    ```

-   Allow specifying multiple Addon repositories in `cluster.yaml`.

    ```yaml
    kind: ClusterConfiguration
    apiVersion: konvoy.mesosphere.io/v1beta1
    spec:
      addons:
      - configRepository: https://github.com/mesosphere/kubernetes-base-addons
        addonsList:
        - name: dashboard
          enabled: true
        ...
      - configRepository: https://github.com/myorg/myrepo
        addonsList:
        - name: myaddon
          enabled: true
    ```

-   Automatically deploy additional Kubernetes resources in `extras/kubernetes` from the working directory.
-   Add the default Centos7 AMI for `eu-north` region, allowing for automated provisioning in that region.
-   Add the ability to show infrastructure changes to be made with `konvoy provision --plan-only`.
-   Fix validation errors to be more human friendly.
-   New preflight check to validate all nodes have unique hostnames.
-   Automatically disable memory swap as it is not supported in Kubernetes.
-   Automatically disable the `firewalld` OS service as it is not supported in Kubernetes.
-   Add liveness check for Keepalived for automated recovery after failures.
-   Automatically deploy [Calico Typha](https://github.com/projectcalico/typha) on clusters with more than 50 nodes.
-   Add support for `vxlan` encapsulation and MTU customization in Calico networking.

    ```yaml
    spec:
      kubernetes:
        containerNetworking:
          calico:
            encapsulation: vxlan
            mtu: 1480
    ```

-   Allow deploying Calico Route Reflectors nodes. More details can be found in [networking](../networking/container-network-interface/calico-bgp-route-reflectors).
-   Add support for SSH proxy. More details can be found in [ssh-configuration](../install/ssh-configuration).
-   Minor improvements to Ansible scripts to make them more failure resilient.
-   Configure `chrony` on nodes for proper time synchronization across the cluster.
-   Improve the process of additional control-plane nodes joining the cluster where a race condition resulted in an error.
-   Simplify `konvoy image` command to no longer require user pass `--docker-registry-service` and `--docker-registry-auth-service-url` flags.
-   Archive inside of diagnostics bundles now has a prefix denoting whether the node is a worker or a master.
-   Collect etcd, kube-apiserver and keepalived logs on master hosts using crictl.
-   Update the list of namespaces to collect logs from for the diagnostics bundle that includes new addons.
-   Remove the `net-tools` package. It is no longer needed when collecting the diagnostics.

#### Bug fixes

- Fix a bug related to improper defaulting in `cluster.yaml`.
- Fix a bug where `kube-proxy` metrics could not be collected by binding the pod to `0.0.0.0` on the host.
- Fix a bug where it was not possible to pull a new Konvoy image when using an HTTP proxy.
- Make kernel modules persistent across a node restart.
- Properly handle OS signals when provisioning.
- Set package lock for containers.
- Fix a bug where installing OS packages on Debian would always timeout.
- Do not always force color output in Ansible which caused extra characters to be printed when running without a TTY.
- Fix a bug in `konvoy diagnose --log-all-namespaces` that was not fetching logs from any namespaces.

#### Addons improvements

-   The old addons [kubeaddons-configs repo](https://github.com/mesosphere/kubeaddons-configs) is deprecated and is replaced by [kubernetes-base-addons repo](https://github.com/mesosphere/kubernetes-base-addons).
    - **IMPORTANT** you must update the value of `configRepository` in your `cluster.yaml` before upgrading to the new addons.
-   The Kommander addon is now in Beta.
-   New Istio addon is now in Preview.
-   New Dispatch addon is now in Beta.
-   It is simpler to use custom certificates for Traefik by specifying the Secret name in the addons' `values` fields, instead of the raw certificate values.
-   Modify generated addon certificates to be supported on MacOS Catalina.
-   Fix an issue where addons with CRDs could fail when being upgraded.
-   Enable volume expansion feature for AWS CSI addon.
-   Upgrade all addons to support Kubernetes >v1.16.
-   Allow for passing custom certificate to Traefik.
-   Upgrade images that contained critical security issues.
-   Send Kubernetes audit logs to Kibana.
-   Update CPU and Memory requests and limits of multiple addons to better handle larger clusters.
-   Added impersonation and group claim support to traefik-forward-auth.
-   Enable impersonation support for Dashboard 2.0.
    - **IMPORTANT** When accessing the dashboard, with a user other than the operations user, the user must be granted permissions using the [RBAC API](../access-authentication/rbac)

#### Component version changes

- Kubernetes `v1.16.4`
- Calico `v3.10.1`
- Kubeaddons `v0.6.2`
- Helm `v2.16.1`
- AWS EBS CSI Provisioner `0.3.3`
- Cert Manager `0.1.5`
- Kubernetes Dashboard `2.0.0`
- Dex K8S Authenticator `1.1.12`
- Dex `1.6.13`
- Dispatch `v0.4.3`
- Elasticsearch `1.32.0`
- Elasticsearch Exporter `2.1.1`
- External DNS `2.9.4`
- Flagger `0.19.0`
- Fluentbit `2.8.4`
- Gatekeeper `0.3.3`
- Grafana `6.3.5`
- Istio `1.4.3`
- Karma `0.50`
- Kibana `3.2.5`
- Kommander `0.3.14`
- Konvoyconfig `0.0.2`
- Kube OIDC Proxy `0.1.7`
- Nvidia `0.2.0`
- Opsportal `0.1.28`
- Prometheus `v2.14.0`
- Prometheus Operator `0.34.0`
- Prometheus Adapter `0.5.0`
- Reloader `v0.0.49`
- Thanos `0.8.1`
- Traefik Forward Auth `0.2.11`
- Traefik `1.72.10`
- Velero `2.2.9`

#### Known issues and limitations

Known issues and limitations do not, necessarily, affect all customers, but may require changes to your environment to address specific scenarios.
The issues are grouped by feature, functional area, and component.

-   Docker provisioner reports potential issues if there are insufficient resources.

    If you attempt to deploy a cluster on a machine not having enough resources, you might see issues when the installation starts to deploy Addons.
    For example, if you see an error message like _could not check tiller installation_, the root cause is typically insufficient resources.

-   Dex should always be enabled.

    For this release of Konvoy, `dex`, `dex-k8s-authenticator`, and `traefik-forward-auth` are tightly coupled and must all be enabled.
    Disabling any of these addons prevents certain operations from working correctly.
    This tight coupling will be addressed in a future release.

-   The authentication token has no permissions.

    After logging in through an identity provider, regardless of the source (password, or otherwise), the identified user has no permissions assigned.
    To enable the authenticated user to perform administrative actions, you must [manually add role bindings](../access-authentication/rbac).

-   Upgrades might fail when `workers` is set to one.

    The upgrade command might fail when the cluster is configured with only one worker. To prevent the command from failing, add an additional worker for the upgrade.

N/A

### Version 1.2.6 - Released 2 December 2019

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.15.4 |
|**Maximum** | 1.15.x |
|**Default** | 1.15.5 |

#### Improvements
N/A

#### Addons improvements

N/A

#### Bug fixes

- Fix a bug where using a custom VPC ID with VPC Endpoints caused Terraform to fail.
- Fix a bug when installing an air-gapped cluster would fail if `localhost` does not resolve to `127.0.0.1` on the install machine.
- Fix a bug when installing an air-gapped would fail if the install machine also does not have access access to the upstream helm repos.

#### Component version changes

- Kubeaddons `v0.1.6`

#### Known issues and limitations

Known issues and limitations don’t necessarily affect all customers, but might require changes to your environment to address specific scenarios.
The issues are grouped by feature, functional area, or component.
Where applicable, issue descriptions include one or more issue tracking identifiers enclosed in parenthesis for reference.

-   The Deb packages provided were tested with Ubuntu 16.04 LTS - Xenial machines and may not work on other Debian distributions.

-   Docker provisioner reports potential issues if there are insufficient resources.

    If you deploy a cluster on a machine with insufficient resources, there can be issues when the installation starts to deploy Addons.
    Error messages similar to _could not check tiller installation_ are typically caused by insufficient resources.

-   Dex should always be enabled.

    For this Konvoy release, `dex`, `dex-k8s-auth`, and `traefik-auth` are tightly coupled and must all be enabled.
    Disabling any of these addons prevents certain operations from correctly working.
    This issue will be addressed in a future release.

-   The authentication token has no permissions.

    After logging on through an identity provider, regardless of the source (password or otherwise), the identified user has no permissions assigned.
    To enable an authenticated user to perform administrative actions, you must manually add role bindings.

-   Upgrades might fail when `workers` is set to one.

    The upgrade command might fail when the cluster is configured with only one worker. Add an additional worker, for the upgrade, to workaround this issue.

### Version 1.2.5 - Released 8 November 2019

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.15.4 |
|**Maximum** | 1.15.x |
|**Default** | 1.15.5 |

#### Improvements

- The command `konvoy config images save` now saves the tars with the `konvoy` binary and the `images.json` file in the `images/` directory.
- New command `konvoy config images load` loads docker image tars from a local `images/` directory.
- The command `konvoy config images seed` first checks for local docker image tars in the `images/` directory before trying to pull it from a remote repo.
- The air-gapped release tar now contains an `images/` directory with all required images.

#### Addons improvements

N/A

#### Bug fixes

- Fix a bug where air-gapped artifacts were not properly mounted in the Konvoy container, preventing the air-gapped installation on certain environments.
- Fix a bug where the Konvoy wrapper did not load the Konvoy image before trying to pull the image.
- Fix a bug preventing traefik-forward-auth from working with domain-based authentication.

#### Component version changes

N/A

#### Known issues and limitations

Known issues and limitations don’t necessarily affect all customers, but might require changes to your environment to address specific scenarios.
The issues are grouped by feature, functional area, or component.
Where applicable, issue descriptions include one or more issue tracking identifiers enclosed in parenthesis for reference.

-   The Deb packages provided were tested with Ubuntu 16.04 LTS - Xenial machines and may not work on other Debian distributions.

-   Docker provisioner reports potential issues if there are insufficient resources.

    If you deploy a cluster on a machine with insufficient resources, there can be issues when the installation starts to deploy Addons.
    Error messages similar to _could not check tiller installation_ are typically caused by insufficient resources.

-   Dex should always be enabled.

    For this Konvoy release, `dex`, `dex-k8s-auth`, and `traefik-auth` are tightly coupled and must all be enabled.
    Disabling any of these addons prevents certain operations from correctly working.
    This issue will be addressed in a future release.

-   The authentication token has no permissions.

    After logging on through an identity provider, regardless of the source (password or otherwise), the identified user has no permissions assigned.
    To enable an authenticated user to perform administrative actions, you must manually add role bindings.

-   Upgrades might fail when `workers` is set to one.

    The upgrade command might fail when the cluster is configured with only one worker. Add an additional worker, for the upgrade, to workaround this issue.

### Version 1.2.4 - Released 5 November 2019

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.15.4 |
|**Maximum** | 1.15.x |
|**Default** | 1.15.5 |

#### Improvements

-   \[BETA\] New CLI commands and `cluster.yaml` options to support [air-gapped installations](../install/install-airgapped/).
-   VPC Endpoints are now deployed by default to allow for the pods running in the cluster to connect to the AWS API without requiring the Internet.

    ```yaml
    kind: ClusterProvisioner
    apiVersion: konvoy.mesosphere.io/v1alpha1
    metadata:
      name: konvoy
    spec:
      provider: aws
      aws:
        vpc:
          vpcEndpointsDisabled: true
    ```

-   Only list stable releases when using the `konvoy image` command.
-   Define a default AMI to use for the `eu-north-1` region.
-   Support AMIs with other volumes already mounted, prior to this the installer assumed that the second volume it created would always be `nvme1n1`.

#### Addons improvements

- Remove the need for Internet access when starting Grafana and Kibana pods.

#### Bug fixes

- Fix a bug where node labels and taints were not being set after the initial deploy.
- Persist kernel modules across restarts.

#### Component version changes

- kubeadd-configs `v1.15.5-2`

#### Known issues and limitations

Known issues and limitations don’t necessarily affect all customers, but might require changes to your environment to address specific scenarios.
The issues are grouped by feature, functional area, or component.
Where applicable, issue descriptions include one or more issue tracking identifiers enclosed in parenthesis for reference.

-   The Deb packages provided were tested with Ubuntu 16.04 LTS - Xenial machines and may not work on other Debian distributions.

-   Docker provisioner reports potential issues if there are insufficient resources.

    If you attempt to deploy a cluster on a machine that does not have enough resources, you might see issues when the installation starts to deploy Addons.
    For example, if you see an error message similar to _could not check tiller installation_, the root cause is typically insufficient resources.

-   Dex should always be enabled.

    For this release of Konvoy, `dex`, `dex-k8s-auth`, and `traefik-auth` are tightly coupled and must all be enabled.
    Disabling any of these addons will prevent certain operations from working correctly.
    This tight coupling will be addressed in a future release.

-   The authentication token has no permissions.

    After logging in through an identity provider, regardless of the source (password, or otherwise), the identified user has no permissions assigned.
    To enable the authenticated user to perform administrative actions, you must manually add role bindings.

-   Upgrades might fail when `workers` is set to one.

    The upgrade command might fail when the cluster is configured with only one worker. To work around this issue, add an additional worker for the upgrade.

### Version 1.2.3 - Released 21 October 2019

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.15.4 |
|**Maximum** | 1.15.x |
|**Default** | 1.15.5 |

#### Improvements

- Set default Kubernetes version to `v1.15.5` that fixes [CVE-2019-11253](https://github.com/kubernetes/kubernetes/issues/83253).

#### Addons improvements

N/A

#### Bug fixes

- Fix a bug where the containerd version was not being set when installing the Debian package, the RPM package always correctly used the version from `cluster.yaml`.
- Fix a bug where setting `spec.containerRuntime.containerd.configData.data` in `cluster.yaml` failed.

#### Component version changes

- Kubernetes `v1.15.5`

#### Known issues and limitations

Known issues and limitations don’t necessarily affect all customers, but might require changes to your environment to address specific scenarios.
The issues are grouped by feature, functional area, or component.
Where applicable, issue descriptions include one or more issue tracking identifiers enclosed in parenthesis for reference.

-   Docker provisioner reports potential issues if there are insufficient resources.

    If you attempt to deploy a cluster on a machine that does not have enough resources, you might see issues when the installation starts to deploy Addons.
    For example, if you see an error message similar to _could not check tiller installation_, the root cause is typically insufficient resources.

-   Dex should always be enabled.

    For this release of Konvoy, `dex`, `dex-k8s-auth`, and `traefik-auth` are tightly coupled and must all be enabled.
    Disabling any of these addons will prevent certain operations from working correctly.
    This tight coupling will be addressed in a future release.

-   The authentication token has no permissions.

    After logging in through an identity provider, regardless of the source (password, or otherwise), the identified user has no permissions assigned.
    To enable the authenticated user to perform administrative actions, you must manually add role bindings.

-   Upgrades might fail when `workers` is set to one.

    The upgrade command might fail when the cluster is configured with only one worker. To work around this issue, add an additional worker for the upgrade.

### Version 1.2.2 - Released 11 October 2019

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.15.4 |
|**Maximum** | 1.15.x |
|**Default** | 1.15.4 |

#### Improvements

- Added a new flag `--addons-config-repository` to commands `konvoy init`, `konvoy up` and `konvoy provision` to be able to specify a local clone for [kubernetes-base-addons](https://github.com/mesosphere/kubernetes-base-addons). Documentation can be found [here](../install/install-onprem#specifying-local-addons-repositories).

#### Addons improvements

- Support specifying a different git repo when fetching [kubernetes-base-addons](https://github.com/mesosphere/kubernetes-base-addons).

#### Bug fixes

- Fix a bug where setting `vpc.internetGatewayDisabled` to `true` would result in an incorrectly generated `inventory.yaml` file.

#### Component version changes

- Kubeaddons `v0.1.5`

#### Known issues and limitations

Known issues and limitations don’t necessarily affect all customers, but might require changes to your environment to address specific scenarios.
The issues are grouped by feature, functional area, or component.
Where applicable, issue descriptions include one or more issue tracking identifiers enclosed in parenthesis for reference.

-   Docker provisioner reports potential issues if there are insufficient resources.

    If you attempt to deploy a cluster on a machine that does not have enough resources, you might see issues when the installation starts to deploy Addons.
    For example, if you see an error message similar to _could not check tiller installation_, the root cause is typically insufficient resources.

-   Dex should always be enabled.

    For this release of Konvoy, `dex`, `dex-k8s-auth`, and `traefik-auth` are tightly coupled and must all be enabled.
    Disabling any of these addons will prevent certain operations from working correctly.
    This tight coupling will be addressed in a future release.

-   The authentication token has no permissions.

    After logging in through an identity provider, regardless of the source (password, or otherwise), the identified user has no permissions assigned.
    To enable the authenticated user to perform administrative actions, you must manually add role bindings.

-   Upgrades might fail when `workers` is set to one.

    The upgrade command might fail when the cluster is configured with only one worker. To work around this issue, add an additional worker for the upgrade.

### Version 1.2.1 - Released 4 October 2019

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.15.4 |
|**Maximum** | 1.15.x |
|**Default** | 1.15.4 |

#### Improvements

- Provide a new option `vpc.internetGatewayDisabled` to disable creating an Internet Gateway on AWS. Documentation can be found [here](../install/install-aws/advanced-provisioning#vpc).

#### Addons improvements

- The `velero` addon now supports passing annotations to the minio `Service`, allowing you to create an internal ELB.

#### Bug fixes

N/A

#### Component version changes

N/A

#### Known issues and limitations

Known issues and limitations don’t necessarily affect all customers, but might require changes to your environment to address specific scenarios.
The issues are grouped by feature, functional area, or component.
Where applicable, issue descriptions include one or more issue tracking identifiers enclosed in parenthesis for reference.

-   Docker provisioner reports potential issues if there are insufficient resources.

    If you attempt to deploy a cluster on a machine that does not have enough resources, you might see issues when the installation starts to deploy Addons.
    For example, if you see an error message similar to _could not check tiller installation_, the root cause is typically insufficient resources.

-   Dex should always be enabled.

    For this release of Konvoy, `dex`, `dex-k8s-auth`, and `traefik-auth` are tightly coupled and must all be enabled.
    Disabling any of these addons will prevent certain operations from working correctly.
    This tight coupling will be addressed in a future release.

-   The authentication token has no permissions.

    After logging in through an identity provider, regardless of the source (password, or otherwise), the identified user has no permissions assigned.
    To enable the authenticated user to perform administrative actions, you must manually add role bindings.

-   Upgrades might fail when `workers` is set to one.

    The upgrade command might fail when the cluster is configured with only one worker. To work around this issue, add an additional worker for the upgrade.

### Version 1.2.0 - Released 30 September 2019

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.15.4 |
|**Maximum** | 1.15.x |
|**Default** | 1.15.4 |

#### Disclaimer

**You must modify your `cluster.yaml` with these changes when upgrading from a previous version:**

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1alpha1
spec:
  kubernetes:
    version: 1.15.4
  addons:
    configVersion: stable-1.15.4-1
    addonsList:
    - name: cert-manager
      enabled: true
    ...
```

You must also append the `cert-manager` addon to the list of addons.

#### Breaking changes

N/A

#### Improvements

- Use the Kubernetes [Downward API](https://kubernetes.io/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/) `status.podIP` value to set the IP for Calico to use. This will enable Konvoy to better support machines with multiple network interfaces, without the need for you to configure the Calico installation.
- The `konvoy diagnose` now puts cluster-level data into a separate tarball `cluster-data.tar.gz` so it is easily accessible.
- Set SSH `IdentitiesOnly=yes` when a private key is provided to avoid the max keys error `Too many authentication failures` in the ssh-agent.
- Set `oidc-groups-claim` in the `kube-apiserver` pod, allowing for the use of the user’s group in the claim.

#### Addons improvements

- Add support to the `awsebscsiprovisioner` addon to support HTTP_PROXY settings.
- New [cert-manager](https://github.com/jetstack/cert-manager) addon.

#### Bug fixes

N/A

#### Component version changes

- Calico `v3.8.2`
- Kubernetes `v1.15.4`

#### Known issues and limitations

Known issues and limitations do not necessarily affect all customers, but might require changes to your environment to address specific scenarios.
The issues are grouped by feature, functional area, or component.
Where applicable, issue descriptions include one or more issue tracking identifiers enclosed in parenthesis for reference.

-   Docker provisioner reports potential issues if there are insufficient resources.

    If you attempt to deploy a cluster on a machine that does not have enough resources, you might see issues when the installation starts to deploy addons.
    For example, if you see an error message similar to `could not check tiller installation`, the root cause is typically insufficient resources.

-   Dex should always be enabled.

    For this release of Konvoy, `dex`, `dex-k8s-auth`, and `traefik-auth` are tightly coupled and must all be enabled.
    Disabling any of these addons will prevent certain operations from working correctly.
    This tight coupling will be addressed in a future release.

-   The authentication token has no permissions.

    After logging in through an identity provider, regardless of the source (password, or otherwise), the identified user has no permissions assigned.
    To enable the authenticated user to perform administrative actions, you must manually add role bindings.

-   Upgrades might fail when `workers` is set to one.

    The upgrade command might fail when the cluster is configured with only one worker. To work around this issue, add an additional worker for the upgrade.

### Version 1.1.5 - Released 11 September 2019

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.15.0 |
|**Maximum** | 1.15.x |
|**Default** | 1.15.3 |

#### Breaking changes

N/A

#### Improvements

N/A

#### Addons improvements

- Relax the check comparing tiller and helm client version, allowing you to upgrade from any previous versions of Konvoy.

#### Bug fixes

- Fix a bug introduced in Konvoy `v1.1.4` preventing you from using it on an existing cluster setup with any previous version.

#### Component version changes

N/A

#### Known issues and limitations

Known issues and limitations don’t necessarily affect all customers, but might require changes to your environment to address specific scenarios.
The issues are grouped by feature, functional area, or component.
Where applicable, issue descriptions include one or more issue tracking identifiers enclosed in parenthesis for reference.

-   Docker provisioner reports potential issues if there are insufficient resources.

    If you attempt to deploy a cluster on a machine that does not have enough resources, you might see issues when the installation starts to deploy addons.
    For example, if you see an error message similar to _could not check tiller installation_, the root cause is typically insufficient resources.

-   Dex should always be enabled.

    For this release of Konvoy, `dex`, `dex-k8s-auth`, and `traefik-auth` are tightly coupled and must all be enabled.
    Disabling any of these addons will prevent certain operations from working correctly.
    This tight coupling will be addressed in a future release.

-   The authentication token has no permissions.

    After logging in through an identity provider, regardless of the source (password, or otherwise), the identified user has no permissions assigned.
    To enable the authenticated user to perform administrative actions, you must manually add role bindings.

-   Upgrades might fail when `workers` is set to one.

    The upgrade command might fail when the cluster is configured with only one worker. To work around this issue, add an additional worker for the upgrade.

### Version 1.1.4 - Released 10 September 2019

| Kubernetes support | Version |
| ------------------ | ------- |
|**Minimum** | 1.15.0 |
|**Maximum** | 1.15.x |
|**Default** | 1.15.4 |

#### Disclaimer

<p class="message--warning"><strong>WARNING: </strong>This version contains a bug where it will fail when retrying an installation, upgrading or adding additional nodes, it is strongly recommended to use a newer version.</p>

The marker file on the nodes was being set with incorrect permissions and a change in the Konvoy wrapper surfaced this error, meaning that the user inside the Konvoy could not read the file.

The error you might see will be something similar to:

```text
STAGE [Fetching Node Configuration]

PLAY [Fetch Node Configuration] *****************************************************************************************************************************************

TASK [fetch node configuration marker file] *****************************************************************************************************************************
fatal: [10.0.0.1]: FAILED! => {}

MSG:

error while accessing the file /tmp/201485401/10.0.0.1/etc/konvoy-marker.yaml, error was: [Errno 13] Permission denied: b'/tmp/201485401/10.0.0.1/etc/konvoy-marker.yaml'

fatal: [110.0.0.1]: FAILED! => {}
```

#### Breaking changes

N/A

#### Improvements

- Validate the minimum Docker version and that it is running on the host before using it in Konvoy.
- Use `--mount` instead of `-v` to mount volumes into the Konvoy container, required for eventual Windows support.
- New `konvoy diagnose` flags `--logs-all-namespaces` and `--logs-namespaces=[kubeaddons,kube-system]` to provide a better control of what Kubernetes pod logs to collect.
- New `konvoy image list|upgrade` commands to be able to automatically list and download future release of the Konvoy image. It will no longer be necessary to download the Konvoy wrapper (unless you require wrapper specific changes) to use new versions of Konvoy.
- Ability to disable the installation of new OS package repositories. Useful for when your hosts already have the required package repositories configured.

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1alpha1
spec:
 packageRepository:
   defaultRepositoryInstallationDisabled: true
```

- New preflight check to validate a node will be able to route traffic to Kubernetes service IPs.
- Remove the cluster SSH key from the host `ssh-agent` when running `konvoy down`, preventing errors caused by hitting a limit in the number of keys in the agent.

#### Addons improvements

- Log `minio-operator` logs to stdout so they show up when running `kubectl get logs`.

#### Bug fixes

- Fix a preflight check that prevented adding new worker nodes when keepalived is enabled.

#### Component version changes

- Ansible Mitogen `0.2.8`
- Helm `v2.14.3`

#### Known issues and limitations

Known issues and limitations don’t necessarily affect all customers, but might require changes to your environment to address specific scenarios.
The issues are grouped by feature, functional area, or component.
Where applicable, issue descriptions include one or more issue tracking identifiers enclosed in parenthesis for reference.

-   This versions contains a bug where it will fail when retrying an installation, upgrading or adding additional nodes, it is strongly recommended to use a newer version.

-   Docker provisioner reports potential issues if there are insufficient resources.

    If you attempt to deploy a cluster on a machine that does not have enough resources, you might see issues when the installation starts to deploy addons.
    For example, if you see an error message similar to _could not check tiller installation_, the root cause is typically insufficient resources.

-   Dex should always be enabled.

    For this release of Konvoy, `dex`, `dex-k8s-auth`, and `traefik-auth` are tightly coupled and must all be enabled.
    Disabling any of these addons will prevent certain operations from working correctly.
    This tight coupling will be addressed in a future release.

-   The authentication token has no permissions.

    After logging in through an identity provider, regardless of the source (password, or otherwise), the identified user has no permissions assigned.
    To enable the authenticated user to perform administrative actions, you must manually add role bindings.

-   Upgrades might fail when `workers` is set to one.

    The upgrade command might fail when the cluster is configured with only one worker. To work around this issue, add an additional worker for the upgrade.

### Version 1.1.3 - Released 28 August 2019

| Kubernetes support | Version |
| ------------------ | ------- |
|**Minimum** | 1.15.0 |
|**Maximum** | 1.15.x |
|**Default** | 1.15.4 |

#### Breaking changes

N/A

#### Improvements

- Ability to specify additional SubjectAlternativeNames for the `kube-apiserver` certificate:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1alpha1
metadata:
  name: konvoy
spec:
  kubernetes:
    controlPlane:
      certificate:
        subjectAlternativeNames:
        - mykonvoycluster
```

- Use default values in `cluster.yaml` for any missing fields.

#### Addons improvements

N/A

#### Bug fixes

- Fix a bug when using RHEL machines with `dex` enabled.

#### Component version changes

N/A

#### Known issues and limitations

Known issues and limitations don’t necessarily affect all customers, but might require changes to your environment to address specific scenarios.
The issues are grouped by feature, functional area, or component.
Where applicable, issue descriptions include one or more issue tracking identifiers enclosed in parenthesis for reference.

-   Docker provisioner reports potential issues if there are insufficient resources.

    If you attempt to deploy a cluster on a machine that does not have enough resources, you might see issues when the installation starts to deploy addons.
    For example, if you see an error message similar to _could not check tiller installation_, the root cause is typically insufficient resources.

-   Dex should always be enabled.

    For this release of Konvoy, `dex`, `dex-k8s-auth`, and `traefik-auth` are tightly coupled and must all be enabled.
    Disabling any of these addons will prevent certain operations from working correctly.
    This tight coupling will be addressed in a future release.

-   The authentication token has no permissions.

    After logging in through an identity provider, regardless of the source (password, or otherwise), the identified user has no permissions assigned.
    To enable the authenticated user to perform administrative actions, you must manually add role bindings.

-   Upgrades might fail when `workers` is set to one.

    The upgrade command might fail when the cluster is configured with only one worker. To work around this issue, add an additional worker for the upgrade.

### Version 1.1.2 - Released 27 August 2019

| Kubernetes support | Version |
| ------------------ | ------- |
|**Minimum** | 1.15.0 |
|**Maximum** | 1.15.x |
|**Default** | 1.15.4 |

#### Breaking changes

N/A

#### Improvements

- Validate control-plane count is odd.
- Fetch kube-apiserver audit logs during `diagnose`.
- Support running `konvoy` from a machine that is behind an HTTP proxy by passing `HTTP_PROXY`, `HTTPS_PROXY` and `NO_PROXY` environment variables to the binary.

#### Addons improvements

- Minor Grafana dashboard fixes.
- New Grafana dashboard for velero.
- Set resource limits and requests for prometheus-adapter.
- Use `minio/k8s-operator` image after a bug was fixed upstream.

#### Bug fixes

- Fix a bug where performing an upgrade would result in the OIDC tokens to become unauthorized resulting in the kube-apiservers not being able to reach the dex server.
- Run `yum clean all` during upgrades to better handle RPM repository cache.
- Fix a bug where running an install on RHEL nodes would fail preflight validation.

#### Component version changes

- Kubernetes `v1.15.3`
- prometheus-operator Helm chart `5.10.8`
- velero Helm chart `2.2.3`

#### Known issues and limitations

Known issues and limitations don’t necessarily affect all customers, but might require changes to your environment to address specific scenarios.
The issues are grouped by feature, functional area, or component.
Where applicable, issue descriptions include one or more issue tracking identifiers enclosed in parenthesis for reference.

-   Installation on RHEL machines will fail when `dex` is enabled.

-   Docker provisioner reports potential issues if there are insufficient resources.

    If you attempt to deploy a cluster on a machine that does not have enough resources, you might see issues when the installation starts to deploy addons.
    For example, if you see an error message similar to _could not check tiller installation_, the root cause is typically insufficient resources.

-   Dex should always be enabled.

    For this release of Konvoy, `dex`, `dex-k8s-auth`, and `traefik-auth` are tightly coupled and must all be enabled.
    Disabling any of these addons will prevent certain operations from working correctly.
    This tight coupling will be addressed in a future release.

-   The authentication token has no permissions.

    After logging in through an identity provider, regardless of the source (password, or otherwise), the identified user has no permissions assigned.
    To enable the authenticated user to perform administrative actions, you must manually add role bindings.

-   Upgrades might fail when `workers` is set to one.

    The upgrade command might fail when the cluster is configured with only one worker. To work around this issue, add an additional worker for the upgrade.

### Version 1.1.1 - Released 19 August 2019

| Kubernetes support | Version |
| ------------------ | ------- |
|**Minimum** | 1.15.0 |
|**Maximum** | 1.15.x |
|**Default** | 1.15.2 |

#### Breaking changes

N/A

#### Improvements

- Use `127.0.0.1` for keepalived health check to support machines where `localhost` is not resolvable.
- Add support for installing Kubernetes on Debian 9 and Ubuntu 16.04 machines.
- Diagnose: added a file with the cluster configuration to the bundle.
- [AWS] Ability to use a pre-provisioned VPC:

 ```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1alpha1
spec:
  provider: aws
  aws:
    vpc:
      ID: vpc-07539b3d5d9c37659
      routeTableID: rtb-0ebd9bb84d6580f74
      internetGatewayID: igw-06434d29768dc5329
 ```

- [AWS] Ability to create an `internal` kube-apiserver ELB:

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1alpha1
spec:
  provider: aws
  aws:
    elb:
      internal: false
```

- [AWS] Ability to use pre-provisioned subnets:

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1alpha1
spec:
  provider: aws
  aws:
    elb:
      subnetIDs:
      - subnet-0b292836d393e0ef1
      - subnet-069b43a8d8d99cb58
  nodePools:
   - name: worker
    count: 4
    machine:
      ...
      aws:
        subnetIDs:
        - subnet-0eda03055891def9f
        - subnet-03fe92e5915e97a72
  - name: control-plane
    controlPlane: true
    count: 3
    machine:
      ...
      aws:
        subnetIDs:
        - subnet-0a8f026743b3657ef
        - subnet-0a2e2c52f6e1003df
  - name: bastion
    bastion: true
    count: 2
    machine:
      ...
      aws:
        subnetIDs:
        - subnet-0b292836d393e0ef1
        - subnet-069b43a8d8d99cb58
```

- [AWS] Ability to use pre-provisioned IAM InstanceProfiles using either the name or the ARN:

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1alpha1
spec:
  provider: aws
  nodePools:
  - name: worker
    count: 4
    machine:
      ...
      aws:
        iam:
          instanceProfile:
            arn: "arn:aws:iam::273854932432:instance-profile/custom-ip-node"
  - name: control-plane
    controlPlane: true
    count: 3
    machine:
      ...
      aws:
        iam:
          instanceProfile:
            name: "custom-ip-control-plane"
```

#### Addons improvements

N/A

#### Bug fixes

- Fix a bug where OIDC settings for Dex were being removed during upgrades.
- Fix a bug where OS package repo cache was not cleaned during upgrades.
- Fix a bug with `konvoy diagnose` command not working with the `-o/--output` flags.
- Fix a bug where nodes would be upgraded even if it was not safe to do so.

#### Component version changes

- Go `1.12.9`

#### Known issues and limitations

Known issues and limitations don’t necessarily affect all customers, but might require changes to your environment to address specific scenarios.
The issues are grouped by feature, functional area, or component.
Where applicable, issue descriptions include one or more issue tracking identifiers enclosed in parenthesis for reference.

-   Installation on RHEL machines will fail preflight checks and there is no way to skip the checks.

-   Docker provisioner reports potential issues if there are insufficient resources.

    If you attempt to deploy a cluster on a machine that does not have enough resources, you might see issues when the installation starts to deploy addons.
    For example, if you see an error message similar to _could not check tiller installation_, the root cause is typically insufficient resources.

-   Dex should always be enabled.

    For this release of Konvoy, `dex`, `dex-k8s-auth`, and `traefik-auth` are tightly coupled and must all be enabled.
    Disabling any of these addons will prevent certain operations from working correctly.
    This tight coupling will be addressed in a future release.

-   The authentication token has no permissions.

    After logging in through an identity provider, regardless of the source (password, or otherwise), the identified user has no permissions assigned.
    To enable the authenticated user to perform administrative actions, you must manually add role bindings.

-   Upgrades might fail when `workers` is set to one.

    The upgrade command might fail when the cluster is configured with only one worker. To work around this issue, add an additional worker for the upgrade.

### Version 1.1.0 - Released 12 August 2019

| Kubernetes support | Version |
| ------------------ | ------- |
|**Minimum** | 1.15.0 |
|**Maximum** | 1.15.x |
|**Default** | 1.15.2 |

#### Breaking changes

This version expects a different structure for the `inventory.yaml` file, one change is when using the bastion node feature, and an additional `version:` var.

Previous versions:

```yaml
control-plane:
…
node:
…
all:
  vars:
    bastion_hosts: [ec2-18-237-7-198.us-west-2.compute.amazonaws.com, ec2-34-221-251-83.us-west-2.compute.amazonaws.com]
      bastion_user: "bastion"
      bastion_port: 2222
      ansible_user: "centos"
      ansible_port: 22
```

This version, expects `bastion` to be its own Ansible group:

```yaml
control-plane:
…
node:
…
bastion:
  hosts:
    10.0.131.50:
      ansible_host: ec2-18-237-7-198.us-west-2.compute.amazonaws.com
    10.0.127.36:
      ansible_host: ec2-34-221-251-83.us-west-2.compute.amazonaws.com
  vars:
    ansible_user: "bastion"
    ansible_port: 2222
all:
  vars:
    version: "v1beta1"
    ansible_user: "centos"
    ansible_port: 22
```

#### Improvements

- Lock the Kubernetes RPM packages (kubelet, kubeadm, kubectl, containerd.io), preventing them from being upgraded when running yum upgrade.
- [AWS] Force detach EBS volumes when deleting them, preventing possible errors when running `konvoy down`.
- Fix a well known [kmem issue](https://github.com/kubernetes/kubernetes/issues/61937) by using a custom built Kubelet with kmem accounting disabled.

#### Addons improvements

- Enabled the service monitor for Velero.
- Added dashboards for Calico and Velero.

#### Bug fixes

- [AWS] Fix a bug where the installer would fail provisioning when using bastion nodes in a multi AZ cluster.
- Support cluster nodes that do not yet have Python installed.

#### Component version changes

- Kubernetes `v1.15.2`

#### Known issues and limitations

Known issues and limitations don’t necessarily affect all customers, but might require changes to your environment to address specific scenarios.
The issues are grouped by feature, functional area, or component.
Where applicable, issue descriptions include one or more issue tracking identifiers enclosed in parenthesis for reference.

-   Installation on RHEL machines will fail preflight checks and there is no way to skip the checks.

-   Docker provisioner reports potential issues if there are insufficient resources.

    If you attempt to deploy a cluster on a machine that does not have enough resources, you might see issues when the installation starts to deploy addons.
    For example, if you see an error message similar to _could not check tiller installation_, the root cause is typically insufficient resources.

-   Dex should always be enabled.

    For this release of Konvoy, `dex`, `dex-k8s-auth`, and `traefik-auth` are tightly coupled and must all be enabled.
    Disabling any of these addons will prevent certain operations from working correctly.
    This tight coupling will be addressed in a future release.

-   The authentication token has no permissions.

    After logging in through an identity provider, regardless of the source (password, or otherwise), the identified user has no permissions assigned.
    To enable the authenticated user to perform administrative actions, you must manually add role bindings.

-   Upgrades might fail when `workers` is set to one.

    The upgrade command might fail when the cluster is configured with only one worker. To work around this issue, add an additional worker for the upgrade.

### Version 1.0.0 - Released 3 August 2019

| Kubernetes support | Version |
| ------------------ | ------- |
|**Minimum** | 1.15.0 |
|**Maximum** | 1.15.x |
|**Default** | 1.15.1 |

Konvoy is a complete, standalone distribution of Kubernetes that enables you to provision native Kubernetes clusters with a suite of
[Cloud Native Computing Foundation (CNCF)](https://www.cncf.io) and community tools.

This is the initial release.

#### What's new in this release

This release includes new features and capabilities for installation and deployment, networking, security, storage, and cluster administration.

Highlights for the features and capabilities introduced in this release are grouped by functional area.

##### Installation

-   Supports provisioning of Kubernetes using multiple infrastructure providers, including:
    - AWS
    - Docker
    - None (on-prem)
-   Installs Kubernetes using `kubeadm`.
-   Installs and configures `containerd` runtime.
-   Provides an on-premises pre-flight check to ensure deployment readiness.
-   Supports `bastion` host-based installation.
-   Supports HTTP proxy.
-   Supports the use of labels and taints for creating node pools.
-   Installs a default set of platform service components (addons) to support the following features:
    - Monitoring and alerting
    - Logging
    - Storage (CSI)
    - Networking
    - Identity broker
    - Dashboards

##### Networking

- Uses `keepalived` to maintain a highly-available control plane where an external load balancer is not available.
- Uses Calico CNI to provide pod-to-pod connectivity and network policy.
- Uses CoreDNS for service discovery.
- Allows the use of MetalLB for load balancing where an external load balancer is not available.
- Uses Traefik for layer-7 ingress.

##### Security

- Provides a federated OpenID Connect using `dex`.

##### Storage

- Provides the AWS EBS CSI provisioner for AWS installations.
- Provides the Static Local Volume Provisioner for on-prem installations.

##### Day 2 operations

-   Provides the following for monitoring:
    -   Prometheus
    -   Alert-manager
    -   Grafana
    -   Node exporter
    -   Kube-state-metrics
    -   Various service monitors
    -   Dashboards for kubernetes components, including:
        - Nodes
        - Pods
        - Kubelet
        - Scheduler
        - Kube-apiserver
        - StatefulSets
        - PersistentVolumes
    -   Dashboards for other services, including:
        - Traefik
        - Grafana
        - CoreDNS
        - Local volume provisioner
        - Etcd
        - Prometheus
        - Fluent Bit
        - Elasticsearch
        - Volume space usage
-   Provides pre-configured alerts ([see external link for list][prometheus-rules])
-   Provides the following for logging:
    - Elasticsearch
    - Fluent Bit
    - Kibana
-   Provides backup and restore services for the cluster state using Velero, including:
    - Scheduled automatic backups
    - Use of minio for S3 storage
-   Provides a method for upgrading Kubernetes and the associated addons.
-   Provides a method for deleting the cluster.
-   Provides troubleshooting tools, including
    - Pre-flight checks
    - Node checks
    - Kubernetes checks
    - addon checks
    - Diagnostics bundle generation

For more information about any of these features,see the [Konvoy documentation][konvoy-doc].

#### Known issues and limitations

Known issues and limitations don’t necessarily affect all customers, but might require changes to your environment to address specific scenarios.
The issues are grouped by feature, functional area, or component.
Where applicable, issue descriptions include one or more issue tracking identifiers enclosed in parenthesis for reference.

-   Installation on RHEL machines will fail preflight checks and there is no way to skip the checks.

-   Docker provisioner reports potential issues if there are insufficient resources.

    If you attempt to deploy a cluster on a machine that does not have enough resources, you might see issues when the installation starts to deploy addons.
    For example, if you see an error message similar to _could not check tiller installation_, the root cause is typically insufficient resources.

-   EL7-based distributions run out of memory.

    EL7-based distributions (CentOS 7, RHEL 7, and SLES 7) have a set of kernel bugs that leak memory when `kmem` accounting is enabled. Kubernetes `kubelet` enables `kmem` accounting.
    To address this issue, a separate distribution package (RPM) with `kmem` accounting disabled will be published in a hosted repository when available.

-   Dex should always be enabled.

    For this release of Konvoy, `dex`, `dex-k8s-auth`, and `traefik-auth` are tightly coupled and must all be enabled.
    Disabling any of these addons will prevent certain operations from working correctly.
    This tight coupling will be addressed in a future release.

-   The authentication token has no permissions.

    After logging in through an identity provider, regardless of the source (password, or otherwise), the identified user has no permissions assigned.
    To enable the authenticated user to perform administrative actions, you must manually add role bindings.

-   Upgrades might fail when `workers` is set to one.

    The upgrade command might fail when the cluster is configured with only one worker. To work around this issue, add an additional worker for the upgrade.

-   Kubernetes RPM packages might be upgraded unintentionally via yum.

    The Kubernetes RPM packages (kubelet, kubeadm, kubectl, containerd.io) are managed by Konvoy, and are not supposed to be upgraded when a user issues a `yum update`.
    Currently, these RPM packages are not excluded for update.
    To workaround that, the user needs to use the following command `yum update --exclude=kubelet*  --exclude=kubeadm* --exclude=kubctl* --exclude=containerd*` to update other system packages.
    One could also add `exclude=kubelet* kubeadm* kubctl* containerd*` to `/etc/yum.conf`.

<!--
### Previous releases
Add links to previous release notes
-->

### Additional resources

<!-- Add links to external documentation as needed -->

For information about installing and using Konvoy, see the [Konvoy documentation][konvoy-doc].

For information about working with native Kubernetes, see the [Kubernetes documentation][kubernetes-doc].

[prometheus-rules]: https://github.com/helm/charts/tree/master/stable/prometheus-operator/templates/prometheus/rules
[konvoy-doc]:https://docs.d2iq.com/ksphere/konvoy
[kubernetes-doc]:https://kubernetes.io/docs/home/
