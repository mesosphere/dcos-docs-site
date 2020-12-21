---
layout: layout.pug
navigationTitle:  Prerequisites
title: Prerequisites
menuWeight: 10
beta: false
excerpt: Supported operating systems, packages, and hardware configurations
---
The following sections describe the operating systems, software packages and hardware configurations required to run Dispatch.

# Supported operating systems 

Prerequisites for installation on Konvoy

If you will be installing Dispatch on Konvoy, be aware that Konvoy supports only the following operating systems:

## CentOS

| OS Release | Kernel Version |
|------------|----------------|
| [CentOS 7.6][centos_7_6] | 3.10.0-957 |

## RHEL

| OS Release | Kernel Version |
|------------|----------------|
| [RHEL 7.6][rhel_7_6] | 3.10.0-957 |

## Ubuntu

| OS Release | Kernel Version |
|------------|----------------|
| [Ubuntu 16.04 (xenial)][ubuntu_16] | 4.4.0-1087 |

## Debian

| OS Release | Kernel Version |
|------------|----------------|
| [Debian 9 (stretch)][debian_9] | 4.9.0-9 |
| [Debian 10 (buster)][debian_10] | 4.19.67-2 |

[centos_7_6]: https://wiki.centos.org/Manuals/ReleaseNotes/CentOS7.1810
[rhel_7_6]: https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/7.6_release_notes/index
[ubuntu_16]: https://wiki.ubuntu.com/XenialXerus/ReleaseNotes
[debian_9]: https://www.debian.org/releases/stretch/releasenotes
[debian_10]: https://www.debian.org/releases/buster/releasenotes

# Supported software packages

These are the software package versions that Dispatch supports.    


## On Konvoy

If you will be installing Dispatch on Konvoy, be aware that Konvoy supports only the following versions of our supported software:

| Package | Version | Description |
|-----|-----|-----|
| [Kubernetes](https://kubernetes.io/) |   | Container orchestration manager  |
| [Prometheus](https://prometheus.io/) |   |  An open-source monitoring system  |
| [Traefik](https://docs.traefik.io/) |    |Open source edge router  |
| [Helm](https://helm.sh/) |  3 | Package manager for Kubernetes |

For more details, see the [Konvoy documentation](/dkp/konvoy/).

# Supported hardware configurations

Dispatch requires the following resources to be available in the cluster:
- CPU: 4 cores
- Mem: 4GiB RAM
- Disk: 50GiB of persistent disk
Dispatch is tested and known to work with Konvoy v1.4.0, with m5.2xlarge AWS EC2 instances.

Additional resources may be required depending on the size, complexity and number of pipelines that are being processed by Dispatch.
