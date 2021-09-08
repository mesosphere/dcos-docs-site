---
layout: layout.pug
navigationTitle: FIPS 140-2 Compliance
title: FIPS 140-2 Compliance
excerpt: Provision a Cluster in FIPS-140 Operating Mode
beta: false
enterprise: false
menuWeight: 150
---

Developed by a working group of government, industry operators, and vendors, the Federal Information Processing Standard (FIPS), FIPS-140 defines security requirements for cryptographic modules. The standard provides for a wide spectrum of data sensitivity, transaction values, and a diversity of application environment security situations. The standard specifies four security levels for each eleven requirement areas. Each successive level offers increased security.

NIST introduced FIPS 140-2 validation, by accredited third party laboratories, as a formal, rigorous process to protect sensitive digitally-stored information not under Federal security classifications.

## FIPS support in Konvoy

Konvoy supports provisioning a FIPS-enabled Kubernetes control plane. Core Kubernetes components are compiled using a version of Go (goboring) which is modified to use a FIPS certified [cryptographic module](https://csrc.nist.gov/CSRC/media/projects/cryptographic-module-validation-program/documents/security-policies/140sp3702.pdf) for all cryptographic functions.

## Infrastructure requirements for FIPS-140-2 mode

To ensure proper operations in FIPS mode, be sure that your environment meets these requirements.

### Supported operating systems

| OS                       |  Version |
|--------------------------|----------|
| Red Hat Enterprise Linux / CentOS | 7        |
| Red Hat Enterprise Linux / CentOS | 8        |

Before provisioning Konvoy, ensure that your OS or OS Images are [prepared for operating in FIPS mode](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/security_guide/chap-federal_standards_and_regulations).

## Creating FIPS-140 images

Konvoy image builder can produce images containing FIPS-140 compliant binaries. To do so, use the `fips.yaml` [override file](../image-builder/override-files/) provided with the konvoy-image bundle. For example:

```shell
konvoy-image build --overrides overrides/fips.yaml images/ami/centos-8.yaml
```

### Pre-provisioned infrastructure

If you are targeting [pre-provisioned infrastructure](../choose_infrastructure/pre-provisioned/), use konvoy-image builder to install the FIPS binaries for you. For example:

```shell
konvoy-image provision --overrides overrides/fips.yaml images/generic/centos-8.yaml
```

### Validating infrastructure

After deployment use the the `dkp-fips-tool` to validated your nodes are running D2IQs FIPS-140 compliant builds. To do so, download the following fips tool and appropriate signed manifest file to the nodes you wish to verify:

[dkp-fips-tool](https://kubernetes-fips.s3.us-east-2.amazonaws.com/tool/dkp-fips-tool)

The SHA-256 of the file can be found here:

[dkp-fips-tool.sha256](https://kubernetes-fips.s3.us-east-2.amazonaws.com/tool/dkp-fips-tool.sha256)

#### Manifests

|EL version | Kubernetes version | Manifest URL                |
|-----------|--------------------|-----------------------------|
| 7         | v1.21.3            | [EL 7 Manifest][fips-manifest-7] |
| 8         | v1.21.3            | [EL 8 Manifest][fips-manifest-8] |

## Running the FIPS tool

Once downloaded, run the tool with the following arguments

```bash
./dkp-fips-tool --json /path/to/manifest.asc
```

The command outputs details about the deployment in JSON format. If validation fails, the command  returns a non-zero status.

## Performance impacts of running in FIPS-140 mode

Goboring relies on CGO's foreign function interface in order to call C language functions exposed by the cryptographic module. Each call into the C library starts with a base overhead of 200ns. One [benchmark](https://github.com/golang/go/issues/21525) finds that the time to encrypt a single AES-128 block increased from 13ns to 209ns over the internal golang implementation. The preferred mode of our FIPS module is (TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384). The aggregate impact on stable control plane seems to be an increase of around ~10% CPU utilization over default operation. Workloads that do not directly interact with the control plane are not affected.

[fips-manifest-7]: https://kubernetes-fips.s3.us-east-2.amazonaws.com/tool/manifests/v1.21.3/manifest-rhel7.json.asc
[fips-manifest-8]: https://kubernetes-fips.s3.us-east-2.amazonaws.com/tool/manifests/v1.21.3/manifest-rhel8.json.asc
