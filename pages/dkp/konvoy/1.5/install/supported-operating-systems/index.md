---
layout: layout.pug
navigationTitle: Supported Operating Systems
title: Supported Operating Systems
menuWeight: 10
excerpt: Supported operating systems for Konvoy
enterprise: false
---

Konvoy supports the following base Operating Systems.

## CentOS

| OS Release | Kernel Version |
|------------|----------------|
| [CentOS 7.7][centos_7_7] | 3.10.0-1062.12.1.el7.x86_64 |
| [CentOS 7.8][centos_gcp] (Only on GCP) | 3.10.0-1127.8.2.el7.x86_6 |

## RHEL

| OS Release | Kernel Version |
|------------|----------------|
| [RHEL_7.7][rhel_7_7] | 3.10.0-1062.12.1.el7.x86_64 |

## Ubuntu

When installing Konvoy on Ubuntu, you will need to adjust your `cluster.yaml` file to point to the proper containerd version (the trailing `-1` is mandatory):

```yaml
kind: ClusterConfiguration
spec:
  containerRuntime:
    containerd:
      version: 1.3.7-1
```

| OS Release | Kernel Version |
|------------|----------------|
| [Ubuntu 16.04 (xenial)][ubuntu_16] | 4.4.0-1087 |
| [Ubuntu 18.04 (bionicbeaver)][ubuntu_18] | 5.0 |

## Debian

| OS Release | Kernel Version |
|------------|----------------|
| [Debian 9 (stretch)][debian_9] | 4.9.0-9 |
| [Debian 10 (buster)][debian_10] | 4.19.67-2 |

## SUSE Linux Enterprise Server

| OS Release |
|------------|
| [15][suse_15] |

[centos_7_7]: https://wiki.centos.org/action/show/Manuals/ReleaseNotes/CentOS7.2003
[centos_gcp]: https://console.cloud.google.com/marketplace/details/centos-cloud/centos-7
[rhel_7_7]: https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/7.7_release_notes/index
[ubuntu_16]: https://wiki.ubuntu.com/XenialXerus/ReleaseNotes
[ubuntu_18]: https://wiki.ubuntu.com/BionicBeaver/ReleaseNotes
[debian_9]: https://www.debian.org/releases/stretch/releasenotes
[debian_10]: https://www.debian.org/releases/buster/releasenotes
[suse_15]: https://documentation.suse.com/sles/15-SP1
