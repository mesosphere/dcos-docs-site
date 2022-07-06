---
layout: layout.pug
navigationTitle: FIPS 140-2 Compliance
title: FIPS 140-2 Compliance
excerpt: Understand FIPS-140 Operating Mode and Requirements
beta: false
enterprise: false
menuWeight: 150
---

Developed by a working group of government, industry operators, and vendors, the Federal Information Processing Standard (FIPS), FIPS-140 defines security requirements for cryptographic modules. The standard provides for a wide spectrum of data sensitivity, transaction values, and a diversity of application environment security situations. The standard specifies four security levels for each of eleven requirement areas. Each successive level offers increased security.

NIST introduced FIPS 140-2 validation, by accredited third party laboratories, as a formal, rigorous process to protect sensitive digitally-stored information not under Federal security classifications.

## FIPS support in Konvoy

Konvoy supports provisioning a FIPS-enabled Kubernetes control plane. Core Kubernetes components are compiled using a version of Go, called goboring, which uses a FIPS-certified [cryptographic module](https://csrc.nist.gov/CSRC/media/projects/cryptographic-module-validation-program/documents/security-policies/140sp3702.pdf) for all cryptographic functions.

Before provisioning Konvoy, you will need to follow your OS vendor's instructions to ensure that your OS, or OS images, are [prepared for operating in FIPS mode](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/security_guide/chap-federal_standards_and_regulations).

<p class="message--note"><strong>NOTE: </strong>You cannot apply FIPS-mode to an existing cluster, you must create a new cluster with FIPS enabled. Similarly, a FIPS-mode cluster must remain a FIPS-mode cluster; you cannot change the cluster's FIPS status after you create it.</p>

## Infrastructure requirements for FIPS-140-2 mode

To ensure proper operations in FIPS mode, be sure that your environment meets these requirements:

### Supported operating systems

Supported Operating Systems for FIPS mode are Red Hat Enterprise Linux and CentOS. See the [Supported Operating Systems](../supported-operating-systems) for details on the tested and supported versions.

## Deploying a Cluster in FIPS mode

In order to create a cluster in FIPS mode, we must inform the bootstrap controllers of the appropriate image repository and version tags of the official D2iQ FIPS builds of kubernetes.

### Supported FIPS builds

| Component  | Repository           | Version        |
|------------|----------------------|----------------|
| Kubernetes | docker.io/mesosphere | v1.23.7+fips.0 |
| etcd       | docker.io/mesosphere | v3.4.13+fips.0 |

When creating a cluster, use the following command line options:

- `--ami <fips enabled AMI created in the previous step>` (AWS only)
- `--kubernetes-version <version>+fips.<build>`
- `--etcd-version <version>+fips.<build>`
- `--kubernetes-image-repository docker.io/mesosphere`
- `--etcd-image-repository docker.io/mesosphere`

For example:

```bash
dkp create cluster aws --cluster-name myFipsCluster \
--ami=ami-03dcaa75d45aca36f \
--kubernetes-version=1.23.7+fips.0 \
--kubernetes-image-repository=docker.io/mesosphere \
--etcd-image-repository=docker.io/mesosphere \
--etcd-version=3.4.13+fips.0
```
