---
layout: layout.pug
navigationTitle: Upgrade
title: Upgrade
menuWeight: 50
excerpt:
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


## Before you start

Currently, updating the package may trigger an update of a subset or
all the components managed by this framework, depending on whether new versions
of these components or related ones are part of the new release.

Updating these components means the Kubernetes cluster may incur in some
downtime or, in the worst-case scenario, cease to function properly. And while
we are committed to make the user experience as robust and smooth as possible,
fact is there is no such thing as fail-proof software.

Before updating the package version, **proceed cautiously and always backup your data**.

In the future, we will be integrating the disaster-recovery functionality so
the user can easily revert to the previous known-to-work state.

### Updating package vs updating package options

When a new package is available, the user will have the option to update to
the new version. If the user hasn't updated the package in a while, it may be
that an update to the most recent package version is not allowed. If this is
the case, the user will be informed on how to proceed.

However, the user may simply want to update package options, for example, in
order to change the resources allocated to one type of Kubernetes component.
Do have in mind that package options updates may also mean the Kubernetes
cluster may incur in some downtime or, in the worst-case scenario, cease to
function properly.

Before updating package options, **proceed cautiously and always backup your data**.

## Updating

In order to update the package, the `dcos beta-kubernetes update` subcommand
is available.

```shell
$ dcos beta-kubernetes update -h
usage: dcos beta-kubernetes [<flags>] update [<flags>]

Flags:
  -h, --help                   Show context-sensitive help.
  -v, --verbose                Enable extra logging of requests/responses
      --force-insecure         Allow unverified TLS certificates when querying service
      --custom-auth-token=DCOS_AUTH_TOKEN
                               Custom auth token to use when querying service
      --custom-dcos-url=DCOS_URI/DCOS_URL
                               Custom cluster URL to use when querying service
      --custom-cert-path=DCOS_CA_PATH/DCOS_CERT_PATH
                               Custom TLS CA certificate file to use when querying service
      --name="kubernetes"      Name of the service instance to query
      --options=OPTIONS        Path to a JSON file that contains customized package installation options
      --package-version=PACKAGE-VERSION
                      				 The desired package version
      --ttl=1200s              Maximum time (in seconds) to wait for the update process completion
      --yes                    Skip asking for a confirmation to continue the update
```

**IMPORTANT:** If the user has a cluster with many Kubernetes nodes, we
recommend adjusting the `--ttl` value to a more generous number but we can't
calculate in advance what the value should be, given the amount of variables
involved, such as the DC/OS cluster resources available, CPU and internet speed,
etc.

### Updating the package version

Below is how the user starts the package version update:

```shell
dcos beta-kubernetes update --package-version=<NEW_VERSION>
```

### Updating the package options

This package exposes certain options that advanced users can use to adapt
the Kubernetes cluster to their need. For instance, the user may want to
increase the `kube-apiserver` count or the resources available to `kube-proxy`.
As an example, we will describe how to achieve the latter.

Assuming the user has installed the package with its default options, all
that's required is for the user to create a JSON file with the following
contents:

```json
{
  "kube_proxy": {
    "cpus": 0.5,
    "mem": 1024
  }
}
```

And, assuming the file is saved as `new_options.json`, run:

```shell
dcos beta-kubernetes update --options=new_options.json
```

Below is the expected output. Mind that the changes are highlighted with the
text `(CHANGED)`:

```
The components of the cluster will be upgraded accordingly to the changes in the
options file [new_options.json]. This operation is long-running and has to run to completion.

Detected the following differences between service configurations (CHANGED, CURRENT):
   ==    {
   ==      "kube_proxy": {
(current)    "cpus": 0.1,
(changed)    "cpus": 0.5,
(current)    "mem": 512
(changed)    "mem": 1024
   ==      }
   ==    }

Do you want to apply these CHANGES?, Please type (yes/no) and then press enter: y
Kubernetes service: [STARTED]
Framework components update: [COMPLETE]
Framework has been updated successfully!
```
