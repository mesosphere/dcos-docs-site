---
layout: layout.pug
navigationTitle: Supported Operating Systems
title: Supported Operating Systems
menuWeight: 10
excerpt: Supported operating systems for Konvoy
beta: false
enterprise: false
---

Konvoy supports the following base Operating Systems.

<p class="message--note"><strong>NOTE: </strong>Some features may not be fully supported in certain versions of these operating systems.</p>

## CentOS

| OS Release | Kernel Version | Notes |
|------------|----------------| ----- |
| [CentOS 7.7][centos7] | 3.10.0-1062.12.1.el7.x86_64 | |
| [CentOS 7.8][centos7] | 3.10.0-1127.el7.x86_64      | |
| [CentOS 7.9][centos7] | 3.10.0-1160.el7.x86_64      | |

## RHEL

| OS Release | Kernel Version | Notes |
|------------|----------------| ----- |
| [RHEL_7.7][rhel_7_7] | 3.10.0-1062.12.1.el7.x86_64 | |
| [RHEL_7.8][rhel_7_8] | 3.10.0-1127.8.2.el7.x86_64  | |
| [RHEL 7.9][rhel_7_9] | 3.10.0-1160.el7.x86_64      | |
| [RHEL 8.2][rhel_8_2] | 4.18.0-193.6.3.el8_2.x86_64 | GPU workloads are not currently supported |

## Ubuntu

When installing Konvoy on Ubuntu, you will need to adjust your `cluster.yaml` file to point to the proper containerd version (the trailing `-1` is mandatory):

```yaml
kind: ClusterConfiguration
spec:
  containerRuntime:
    containerd:
      version: 1.3.9-1
```

| OS Release | Kernel Version | Notes |
|------------|----------------| ----- |
| [Ubuntu 16.04 (xenial)][ubuntu_16] | 4.4.0-1087 | |
| [Ubuntu 18.04 (bionicbeaver)][ubuntu_18] | 5.0 | |

## Debian

| OS Release | Kernel Version | Notes |
|------------|----------------| ----- |
| [Debian 9 (stretch)][debian_9] | 4.9.0-9 | |
| [Debian 10 (buster)][debian_10] | 4.19.67-2 | |

## SUSE Linux Enterprise Server

| OS Release | Notes |
|------------| ----- |
| [15][suse_15] | GPU workloads are not currently supported |

## Overriding Discovered OS Distribution

By default Konvoy will [automatically discover the Operating System(OS) distribution][ansible_vars].
In certain situations your OS may be based on a supported OS, but Ansible may still report an unsupported `ansible_distribution`.

You can configure Konvoy to assume a different OS distribution. Valid values are `CentOS`, `RedHat`, `Ubuntu`, and `Debian`:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta2
spec:
  nodePools:
    - name: worker
      operatingSystem:
        assumeDistribution: CentOS
```

[ansible_vars]: https://docs.ansible.com/ansible/latest/user_guide/playbooks_variables.html
[centos7]: https://wiki.centos.org/action/show/Manuals/ReleaseNotes/CentOS7.2003
[rhel_7_7]: https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/7.7_release_notes/index
[rhel_7_8]: https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/7.8_release_notes/index
[rhel_7_9]: https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/7.9_release_notes/index
[rhel_8_2]: https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/8.2_release_notes/index
[ubuntu_16]: https://wiki.ubuntu.com/XenialXerus/ReleaseNotes
[ubuntu_18]: https://wiki.ubuntu.com/BionicBeaver/ReleaseNotes
[debian_9]: https://www.debian.org/releases/stretch/releasenotes
[debian_10]: https://www.debian.org/releases/buster/releasenotes
[suse_15]: https://documentation.suse.com/sles/15-SP1
