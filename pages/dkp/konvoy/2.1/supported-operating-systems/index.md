---
layout: layout.pug
navigationTitle: Supported Operating Systems
title: Supported Operating Systems
menuWeight: 30
excerpt: Supported operating systems for Konvoy
beta: false
enterprise: false
---

Konvoy supports the following base Operating Systems.

<p class="message--note"><strong>NOTE: </strong>Some features may not be fully supported in certain versions of these operating systems.</p>

## CentOS

| OS Release | Kernel Version | FIPS Support | Notes |
|------------|----------------| :----------: | ----- |
| [CentOS 7.7][centos7] | 3.10.0-1062.12.1.el7.x86_64 | **☑** | |
| [CentOS 7.8][centos7] | 3.10.0-1127.el7.x86_64      | **☑** | |
| [CentOS 7.9][centos7] | 3.10.0-1160.el7.x86_64      | **☑** | |
| [CentOS 8.2][centos8] | 4.18.0-193.6.3.el8_2.x86_64 | **☑** | |

## RHEL

| OS Release | Kernel Version | FIPS Support | Notes |
|------------|----------------| :----------: | ----- |
| [RHEL_7.7][rhel_7_7] | 3.10.0-1062.12.1.el7.x86_64 | **☑** | |
| [RHEL_7.8][rhel_7_8] | 3.10.0-1127.8.2.el7.x86_64  | **☑** | |
| [RHEL 7.9][rhel_7_9] | 3.10.0-1160.el7.x86_64      | **☑** | |
| [RHEL 8.2][rhel_8_2] | 4.18.0-193.6.3.el8_2.x86_64 | **☑** | |

## Ubuntu

| OS Release | Kernel Version | Notes |
|------------|----------------| ----- |
| [Ubuntu 18.04 (Bionic Beaver)][ubuntu_18] | |
| [Ubuntu 20.04 (Focal Fossa)][ubuntu_20] | |

<!--
## Debian

| OS Release | Kernel Version | Notes |
|------------|----------------| ----- |
| [Debian 9 (stretch)][debian_9] | 4.9.0-9 | |
| [Debian 10 (buster)][debian_10] | 4.19.67-2 | |
-->

## SUSE Linux Enterprise Server

| OS Release | FIPS Support | Notes |
|------------| :----------: | ----- |
| [15][sles_15] | **☐** | |

## Flatcar

| OS Release | Version | FIPS Support | Notes |
|------------|-------- | :----------: | ----- |
| [Flatcar][flatcar] | 2905.2.1 | **☐** | GPU workloads are not currently supported |

<!---
## Supported OSes by Platform
| OS Release | Kernel Version | AWS | Azure | GCP | Air-gapped | On-prem | Bare metal  | FIPS Support | GPU Support | Notes |
|-------------------|-----------------------| :----: | :----: |:----: |:----: |:----: |:----: |:----: |:----: |----- |
| [CentOS 7.7][centos7] | 3.10.0-1062.12.1.el7.x86_64 | ☑ | ☑ | ☑ | ☑ | | ☑ | ☑ | ☑ | |
| [CentOS 7.8][centos7] | 3.10.0-1127.el7.x86_64      | ☑ | ☑ | ☑ | ☑ | | ☑ | ☑ | ☑ | |
| [CentOS 7.9][centos7] | 3.10.0-1160.el7.x86_64      | ☑ | ☑ | ☑ | ☑ | | ☑ | ☑ | ☑ | |
| [CentOS 8.2][centos8] | 4.18.0-193.6.3.el8_2.x86_64 | ☑ | ☑ | ☑ | ☑ | | ☑ | ☑ | ☑ | |
| [Flatcar]    | 2905.2.1                             | ☑ | ☑ | ☑ | ☑ | ☑ (VMWare)| ☑ |   |   | GPU workloads are not currently supported |
| [RHEL_7.7][rhel_7_7] | 3.10.0-1062.12.1.el7.x86_64  | ☑ | ☑ | ☑ | ☑ | | ☑ | ☑ | ☑ | |
| [RHEL_7.8][rhel_7_8] | 3.10.0-1127.8.2.el7.x86_64   | ☑ | ☑ | ☑ | ☑ | | ☑ | ☑ | ☑ | |
| [RHEL 7.9][rhel_7_9] | 3.10.0-1160.el7.x86_64       | ☑ | ☑ | ☑ | ☑ | | ☑ | ☑ | ☑ | |
| [RHEL 8.2][rhel_8_2] | 4.18.0-193.6.3.el8_2.x86_64  | ☑ | ☑ | ☑ | ☑ | | ☑ | ☑ | ☑ | |
| [SLES 15][sles_15]    | SUSE Linux Enterprise Server 15-SP1 | ☑ | ☑ | ☑ | ☑ | ☑ | ☑ | ☑ | ☑ | |
| [Ubuntu 18.04 (Bionic Beaver)][ubuntu_18]           | ☑ | ☑ | ☑ |N/A| | ☑ | | ☑ | |
| [Ubuntu 20.04(Focal Fossa)][ubuntu_20]             |   | ☑ | ☑ | ☑ |N/A| | ☑ | | ☑ | |
--->

[centos7]: https://wiki.centos.org/action/show/Manuals/ReleaseNotes/CentOS7.2003
[centos8]: https://wiki.centos.org/action/show/Manuals/ReleaseNotes/CentOS8.2004
<!--- [debian_9]: https://www.debian.org/releases/stretch/releasenotes
[debian_10]: https://www.debian.org/releases/buster/releasenotes --->
[flatcar]: https://www.flatcar-linux.org/releases/#stable-release
[rhel_7_7]: https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/7.7_release_notes/index
[rhel_7_8]: https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/7.8_release_notes/index
[rhel_7_9]: https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/7.9_release_notes/index
[rhel_8_2]: https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/8.2_release_notes/index
[ubuntu_18]: https://wiki.ubuntu.com/BionicBeaver/ReleaseNotes
[ubuntu_20]: https://wiki.ubuntu.com/FocalFossa/ReleaseNotes
