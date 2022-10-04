---
layout: layout.pug
navigationTitle:  dkp check cluster fips
title:  dkp check cluster fips
menuWeight: 10
excerpt: Validate the components in your cluster are FIPS compliant
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp check cluster fips

Validate the components in your cluster are FIPS compliant

### Synopsis

The check cluster fips command is used to validate that specific components and services are FIPS
compliant by checking the signatures of the files against a signed signature file, and checking that services
are using the certified algorithms.

Examples:

    With a signature file named "manifest-rhel-84.json.asc" run:

	dkp check cluster fips \
		--signature-file manifest-rhel-84.json.asc \
		--signature-configmap prod-rhel-84-fips-signatures \
		--output-configmap prod-rhel-84-fips-validation

    If you already have a signature ConfigMap, you can omit the signature-file flag:

	dkp check cluster fips \
		--signature-configmap prod-rhel-84-fips-signatures \
		--output-configmap prod-rhel-84-fips-validation

    The validation will be re-checked against the existing signature data.


```
dkp check cluster fips [flags]
```

### Options

```
  -h, --help                         help for fips
      --kubeconfig string            Path to the kubeconfig file for the fips cluster. If unspecified, default discovery rules apply.
  -n, --namespace string             If present, the namespace scope for this CLI request. (default "default")
      --output-configmap string      ConfigMap with fips signature data to verify. [required]
      --signature-configmap string   ConfigMap with fips signature data to verify. [required]
      --signature-file string        File containing fips signature data.
      --timeout duration             The length of time to wait before giving up. Zero means wait forever (e.g. 1s, 2m, 3h). (default 10m0s)
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp check cluster](/dkp/kommander/2.3/cli/dkp/check/cluster/)	 - Check a cluster, one of [fips]

