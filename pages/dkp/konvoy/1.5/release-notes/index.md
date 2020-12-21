---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
menuWeight: 0
excerpt: View release-specific information for Konvoy
enterprise: false
---

<!-- markdownlint-disable MD034 -->

## Release Notes

[button color="purple" href="https://support.d2iq.com/s/entitlement-based-product-downloads"]Download Konvoy[/button]

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. For new customers, contact your sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download Konvoy.</p>

### Important changes

Docker Hub announced an [update](https://www.docker.com/blog/scaling-docker-to-serve-millions-more-developers-network-egress/) to their image pull policies in August, 2020. The change results in the need to change cluster configurations to accommodate new account structures that enable image pull rate limiting.

Rate limiting happens on a per-pull basis regardless of whether the pulled image is owned by a paid user. This means D2iQ, as owner of most images used in Konvoy, does not have any influence as to whether your current address is rate-limited or not. Konvoy does not have a strict dependency on Docker Hub accounts or plans.

For more information on addressing this limit, refer to this [procedure](../operations/manage-docker-hub-rate-limits).

### Version v1.5.4 - Released 9 December 2020

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.15.4 |
|**Maximum** | 1.17.x |
|**Default** | 1.17.14 |

#### Improvements

- API: New field `spec.kubernetes.apiserver.targetRamMB` to set the cache memory size for the kube-apiserver.
- Ansible: Re-enable coredns caching to reduce unnecessary load on API server.

#### Addons improvements

- Update kubeaddons to fix how kubeaddons finds helm releases linked to the addon, this fixes a bug where kubeaddons would continuously upgrade the helm release, which would create configmaps and increase the load on the kube-apiserver.

#### Component version changes

- Kubernetes `v1.17.14`
- Containerd `1.3.9`
- Kubeaddons `v0.19.8`

### Version v1.5.3 - Released 18 November 2020

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.15.4 |
|**Maximum** | 1.17.x |
|**Default** | 1.17.12 |

#### Bug fixes

- AWS: Fixes an issue preventing AWS ELBs from being tagged according to their corresponding Service annotations. (COPS-6482)
- CLI: Don't include internal `controlplane` and `bastion` fields when generating a sample `inventory.yaml` file.
- Airgapped: Set `disable_gpg_check: yes` when installing Nvidia RPM packages, to avoid GPG failures. This is already the behavior when installing the packages from the Nvidia repo. (COPS-6474)
- Diagnostics: Fix a bug where Helm v3 releases were not being included from all namespaces.

#### Addons improvements

- Update kubeaddons to pull charts from `mesosphere.github.io/charts/` instead of the deprecated `kubernetes-charts.storage.googleapis.com/` repository.
- The tiller image is now `ghcr.io/helm/tiller:v2.7.0` instead of the deprecated gcr location.

#### Component version changes

- Kubernetes `v1.17.12`
- kubernetes-base-addons `stable-1.17-2.5.0`
- Kubeaddons `v0.19.7`

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

- CLI: Fix a bug during upgrades where certain pods deployed by konvoy prevented nodes from being upgraded.
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
    - Kommander [Release Notes](https://docs.d2iq.com/dkp/kommander/1.1/release-notes/)
    - Dispatch [Release Notes](https://docs.d2iq.com/dkp/dispatch/1.2/release-notes/)

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

### Additional resources

<!-- Add links to external documentation as needed -->

For information about installing and using Konvoy, see the [Konvoy documentation][konvoy-doc].

For information about working with native Kubernetes, see the [Kubernetes documentation][kubernetes-doc].

[prometheus-rules]: https://github.com/mesosphere/charts/tree/master/staging/prometheus-operator/templates/prometheus/rules
[konvoy-doc]:https://docs.d2iq.com/dkp/konvoy
[kubernetes-doc]:https://kubernetes.io/docs/home/
