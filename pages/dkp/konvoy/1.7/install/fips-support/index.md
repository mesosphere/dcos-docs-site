---
layout: layout.pug
navigationTitle: FIPS 140-2 Compliance
title: FIPS 140-2 Compliance
excerpt: Provision a Cluster in FIPS-140 Operating Mode
beta: false
enterprise: false
menuWeight: 15
---

Developed by a working group of government and industry operators and vendors, the Federal Information Processing Standard, or FIPS, FIPS-140 defines security requirements for cryptographic modules. The standard provides for a wide spectrum of data sensitivity and transaction values and a diversity of application environment security situations. The standard specifies four security levels for each of 11 requirement areas, each successive level offering an increased security.

NIST introduced FIPS 140-2 validation by accredited third party laboratories as a formal and rigorous process to assist in protecting digitally-stored information that is sensitive, but does not fall under Federal security classifications.

## FIPS Support in Konvoy

D2iQ Konvoy 1.7 introduces support for provisioning a FIPS enabled Kubernetes control plane. To achieve this, core Kubernetes components have been compiled using a version of Go (goboring) which was modified to use a FIPS certified [cryptographic module](https://csrc.nist.gov/CSRC/media/projects/cryptographic-module-validation-program/documents/security-policies/140sp3702.pdf) for all cryptographic functions. The components covered in this release are:

- kubeadm
- kubelet
- runc
- containerd
- kube-apiserver
- kube-controller-manager
- kube-proxy
- kube-scheduler
- etcd

## Infrastructure Requirements for FIPS-140-2 Mode

To ensure proper operations in FIPS mode, be sure that your environment meets these requirements.
### Supported Operating Systems

| OS                       |  Version |
|--------------------------|----------|
| Red Hat Enterprise Linux / CentOS | 7        |
| Red Hat Enterprise Linux / CentOS | 8        |

Before provisioning Konvoy, ensure that your OS or OS Images have been [prepared for operating in FIPS mode](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/security_guide/chap-federal_standards_and_regulations).

## Deploying a Cluster in FIPS-140-2 Mode

<p class="message--note"><strong>NOTE: </strong>You can only deploy a cluster in FIPS-140 mode at cluster inception. You cannot upgrade a cluster deployed in standard mode to FIPS mode. The reason for this is that standard cluster bootstrapping uses a number of cryptographic functions that are not FIPS-certified, which taints cluster compliance.</p>

To launch a cluster in FIPS-140-2 mode, use the `--mode fips` argument. For example:

```bash
konvoy init --mode fips
```

This command creates a `cluster.yaml` file with all necessary modifications required to provision a cluster in FIPS mode. After the file is generated, you can provision the cluster as normal using `konvoy up`, `provision`, `deploy`.

You may also combine these steps with `up --mode fips` or `provision --mode fips` if you are performing a default install in FIPS mode.

## Konvoy FIPS Verification Tool

FIPS-140 requires verification of the integrity of the cryptographic module at runtime, and by the operator on-demand at any time. Go programs compiled with `goboring` embed the cryptographic module inside the binary program package as a system object file. In this scenario, a copy of the cryptographic module exists for every FIPS-140 compliant binary we produce. To validate the integrity of the module, we calculate a 4096-bit RSA signature at build time for each binary. These signatures are stored in a manifest file which is signed and sealed within the Konvoy runtime.

For an operator to perform manual verification, we have provided the `konvoy check fips` command. When run, the command produces output similar to this:

```text
...
Host: 172.17.0.7 ===================================================================

/usr/bin/kubeadm [file] Signature Validated                            [OK]
/usr/bin/kubelet [file] Signature Validated                            [OK]
/usr/bin/containerd [file] Signature Validated                         [OK]
/usr/bin/runc [file] Signature Validated                               [OK]
kube-apiserver [image] Signature Validated                             [OK]
kube-controller-manager [image] Signature Validated                    [OK]
kube-proxy [image] Signature Validated                                 [OK]
kube-scheduler [image] Signature Validated                             [OK]
etcd [image] Signature Validated                                       [OK]

Service: kube-apiserver [localhost:6443]
Preferred Cipher: TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
Supported Ciphers:

                TLS_RSA_WITH_AES_128_GCM_SHA256

                TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256

                TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384

                TLS_RSA_WITH_AES_256_GCM_SHA384

Service: etcd [localhost:2379]
Preferred Cipher: TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
Supported Ciphers:

                TLS_RSA_WITH_AES_128_GCM_SHA256

                TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256

                TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384

                TLS_RSA_WITH_AES_256_GCM_SHA384


D2IQ cryptographic module integrity verification was successful

The above components are confirmed to be using the D2iQ BoringCrypto
Cryptographic Security Module. This module has been validated for FIPS 140-2
Level 1 by an accredited third party laboratory as mandated by the NIST CMVP.
The security policy and certificate for this module can be viewed at the
following URL:

https://csrc.nist.gov/projects/cryptographic-module-validation-program/certificate/3702

```

The command returns `0` when the whole cluster passes verification. If the cluster fails, the command returns `1`. Running this command on a cluster not running in FIPS-140 mode always returns `1`.

## Performance Impacts of running in FIPS-140 Mode

Goboring relies on CGO's foreign function interface in order to call C language functions exposed by the cryptographic module. Each call into the C library starts with a base overhead of 200ns. One [benchmark](https://github.com/golang/go/issues/21525) finds that the time to encrypt a single AES-128 block increased from 13ns to 209ns over the internal golang implementation. Our FIPS module's preferred mode is (TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384). The aggregate impact on stable control plane seems to be an increase of around ~10% CPU utilization over default operation. Workloads which do not directly interact with the control plane are not affected.
