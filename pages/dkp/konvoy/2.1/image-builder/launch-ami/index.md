---
layout: layout.pug
navigationTitle: Launch AMIs
title: Launch AMIs
excerpt: Launch custom AMIs and custom AMI lookup
beta: true
enterprise: false
menuWeight: 65
---

Follow these steps to launch your AMIs.

## Launch a Konvoy cluster with a custom AMI

To use the built `ami` with Konvoy, specify it with the `--ami` flag when calling cluster create.

```sh
dkp create cluster aws --cluster-name=$(whoami)-aws-cluster --ami ami-0123456789
```

## Launch a Konvoy cluster with custom AMI lookup

By default `konvoy-image` will name the AMI in such a way that `dkp` can discover the latest AMI for a base OS and Kubernetes version. To create a cluster that will use the latest AMI, specify the `--ami-format`, `--ami-base-os` and `--ami-owner` flags:

```sh
dkp create cluster aws --cluster-name=$(whoami)-aws-cluster --ami-format "konvoy-ami-{{.BaseOS}}-?{{.K8sVersion}}-*" --ami-base-os centos-7 --ami-owner 123456789012
```

## Related information

For information on related topics or procedures, refer to the following:

- [Creating GPU enabled on-premises configurations](../../choose_infrastructure/aws/gpu)

<!--- ## Air Gapped

TBD (for air gapped a larger set of `extra_images` are required.) -->
