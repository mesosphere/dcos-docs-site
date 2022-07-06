---
layout: layout.pug
navigationTitle: Validate FIPS in cluster
title: Validate FIPS in cluster
excerpt: Validate FIPS operations in your cluster
beta: false
enterprise: false
menuWeight: 30
---

You can use the FIPS validation tool to verify that specific components and services are FIPS-compliant by checking the signatures of the files against a signed signature file, and by checking that services are using the certified algorithms.

## Download Signature Files

You need to download an appropriate, signed signature file before you run validation. Use the links in the table that follows to obtain a valid file:

|EL version | Kubernetes version | Manifest URL                                    |
|-----------|--------------------|-------------------------------------------------|
| 7         | v1.22.8            | [v1.22.8 EL 7 Manifest][1.22.8-fips-manifest-7] |
| 8         | v1.22.8            | [v1.22.8 EL 8 Manifest][1.22.8-fips-manifest-8] |

## Run FIPS validation

To validate that specific components and services are FIPS-compliant, run the command:

```bash
dkp check cluster fips --signature-file=manifest.asc --signature-configmap=signatures --output-configmap=output
```

The full command usage and flags include:

```bash
dkp check cluster fips [flags]
```

Flags:

```sh
-h, --help                     help for fips
  -n, --namespace string         If present, the namespace scope for this CLI request. (default "default")
  --output-configmap string      ConfigMap with fips signature data to verify. [required]
  --signature-configmap string   ConfigMap with fips signature data to verify. [required]
  --signature-file string        File containing fips signature data.
```

### Validation command example

Upon successful completion, the command's output displays details about the deployment in JSON format. If validation fails, the command returns a non-zero status.

For example, to validate FIPS-mode operation with the signature file, `manifest-rhel8.json.asc`, you would run the following command:

```bash
dkp check cluster fips \
 --signature-file manifest-rhel8.json.asc \
 --signature-configmap prod-rhel8-fips-signatures \
 --output-configmap prod-rhel8-fips-validation
```

## Run FIPS validation with existing ConfigMap

If you already have a signature ConfigMap, you can omit the `signature-file` flag, as in the following sample command:

```bash
dkp check cluster fips \
 --signature-configmap prod-rhel8-fips-signatures \
 --output-configmap prod-rhel8-fips-validation
```

In this case, the validation tool checks the cluster using the existing signature data and returns deployment details in JSON format.

[1.22.8-fips-manifest-7]: https://downloads.d2iq.com/dkp/fips/v1.22.8/manifest-rhel7.json.asc
[1.22.8-fips-manifest-8]: https://downloads.d2iq.com/dkp/fips/v1.22.8/manifest-rhel8.json.asc
