---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
menuWeight: 0
excerpt: View release-specific information for Konvoy
enterprise: false
---

## Release Notes

### Version 1.2.4 - Released 5 November 2019

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.15.4 |
|**Maximum** | 1.15.x |
|**Default** | 1.15.5 |

#### Improvements

-   \[BETA\] New CLI commands and `cluster.yaml` options to support [air-gapped installations](https://docs.d2iq.com/ksphere/konvoy/latest/install/install-airgapped/).
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

- kubeadd-configs `v1.15.5-1`

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
|**Minimum** | 1.15.5 |
|**Maximum** | 1.15.x |
|**Default** | 1.15.5 |

#### Improvements

- Added a new flag `--addons-config-repository` to commands `konvoy init`, `konvoy up` and `konvoy provision` to be able specify a local clone for [kubeaddons-configs](https://github.com/mesosphere/kubeaddons-configs). Documentation can be found [here](https://docs.d2iq.com/ksphere/konvoy/latest/install/install-onprem/#specifying-a-local-kubeaddons-configs-repo).

#### Addons improvements

- Support specifying a different git repo when fetching [kubeaddons-configs](https://github.com/mesosphere/kubeaddons-configs).

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
|**Minimum** | 1.15.5 |
|**Maximum** | 1.15.x |
|**Default** | 1.15.5 |

#### Improvements

- Provide a new option `vpc.internetGatewayDisabled` to disable creating an Internet Gateway on AWS. Documentation can be found [here](https://docs.d2iq.com/ksphere/konvoy/latest/install/install-aws/advanced-provisioning/#vpc).

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
|**Minimum** | 1.15.0 |
|**Maximum** | 1.15.x |
|**Default** | 1.15.5 |

#### Disclaimer

**You must modify your `cluster.yaml` with these changes when upgrading from a previous version:**

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1alpha1
spec:
  kubernetes:
    version: 1.15.5
  addons:
    configVersion: stable-1.15.5-1
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
- Kubernetes `v1.15.5`

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
|**Default** | 1.15.5 |

#### Disclaimer

**This versions contains a bug where it will fail when retrying an installation, upgrading or addding additional nodes, it is strongly recommended to use a newer version.**

The marker file on the nodes was being set with incorrect permissions and a change in the Konvoy wrapper surfaced this error, the user inside the Konvoy not being able to read the file.

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

- Validate the minmum docker version and that it is running on the host before using it in Konvoy.
- Use `--mount` instead of `-v` to mount volumes into the Konvoy container, required for eventual Windows support.
- New `konvoy diagnose` flags `--logs-all-namespaces` and `--logs-namespaces=[kubeaddons,kube-system]` to provide a better control of what Kubernetes pod logs to collect.
- New `konvoy image list|upgrade` commands to be able to automatically list and download future release of the Konvoy image. Download the Konvoy wrapper will no longer be required(unless you require wrapper specific changes) to be able to use new versions of Konvoy.
- Ability to disabled the installation of new OS package repositories. Useful for when your hosts already have the required package repositories configured.

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

- Asnible Mitogen `0.2.8`
- Helm `v2.14.3`

#### Known issues and limitations

Known issues and limitations don’t necessarily affect all customers, but might require changes to your environment to address specific scenarios.
The issues are grouped by feature, functional area, or component.
Where applicable, issue descriptions include one or more issue tracking identifiers enclosed in parenthesis for reference.

-   This versions contains a bug where it will fail when retrying an installation, upgrading or addding additional nodes, it is strongly recommended to use a newer version.

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
|**Default** | 1.15.5 |

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
|**Default** | 1.15.5 |

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
-   Provides an on-premise pre-flight check to ensure deployment readiness.
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
