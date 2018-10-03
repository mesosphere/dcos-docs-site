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

Updating these components means the Kubernetes cluster may experience some
downtime or, in the worst-case scenario, cease to function properly. And while
we are committed to make the user experience as robust and smooth as possible,
fact is there is no such thing as fail-proof software.

Before updating the package version, **proceed cautiously and always backup your data**.

In the future, we will be integrating the disaster-recovery functionality so
the user can easily revert to the previous functioning state.

### Updating package vs updating package options

When a new package is available, the user will have the option to update to
the new version. If the user hasn't updated the package in a while, it may be
that an update to the most recent package version is not allowed. If this is
the case, the user will be informed on how to proceed.

However, the user may simply want to update package options, for example, in
order to change the resources allocated to one type of Kubernetes component.
Do have in mind that package options updates may also mean the Kubernetes
cluster may experience some downtime or, in the worst-case scenario, cease to
function properly.

Before updating package options, **proceed cautiously and always backup your data**.

## Updating

In order to update the package, the `dcos kubernetes update` subcommand
is available.

```shell
$ dcos kubernetes update -h
usage: dcos kubernetes [<flags>] update [<flags>]

Flags:
  -h, --help               Show context-sensitive help.
  -v, --verbose            Enable extra logging of requests/responses
      --name="kubernetes"  Name of the service instance to query
      --options=OPTIONS    Path to a JSON file containing the target package options
      --package-version=PACKAGE-VERSION
                           The target package version
      --yes                Do not ask for confirmation before starting the update process
      --timeout=1200s      Maximum time to wait for the update process to complete

```

**IMPORTANT:** If the user has a cluster with many Kubernetes nodes, we
recommend adjusting the `--timeout` value to a more generous number but we can't
calculate in advance what the value should be, given the amount of variables
involved, such as the DC/OS cluster resources available, CPU and internet speed,
etc.

### Updating the package version

Below is how the user starts the package version update:

```shell
$ dcos kubernetes update --package-version=<NEW_VERSION>
About to start an update from version <CURRENT_VERSION> to <NEW_VERSION>

Updating these components means the Kubernetes cluster may experience some
downtime or, in the worst-case scenario, cease to function properly.
Before updating proceed cautiously and always backup your data.

This operation is long-running and has to run to completion.
Are you sure you want to continue? [yes/no] yes

2018/03/01 15:40:14 starting update process...
2018/03/01 15:40:15 waiting for update to finish...
2018/03/01 15:41:56 update complete!
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
$ dcos kubernetes update --options=new_options.json
```

Below is the expected output. Mind that the changes are highlighted with the
text `(CHANGED)`:

```shell
The following differences were detected between service configurations (CHANGED, CURRENT):
 ==  {
 ==  "kube_proxy": {
 -      "cpus": 0.1,
 +      "cpus": 0.5,
 -      "mem": 512,
 +      "mem": 1024,
 ==  }
 == }

The components of the cluster will be updated according to the changes in the
options file [new_options.json].

Updating these components means the Kubernetes cluster may experience some
downtime or, in the worst-case scenario, cease to function properly.
Before updating proceed cautiously and always backup your data.

This operation is long-running and has to run to completion.
Are you sure you want to continue? [yes/no] yes

2018/03/01 15:40:14 starting update process...
2018/03/01 15:40:15 waiting for update to finish...
2018/03/01 15:41:56 update complete!
```

#### Noteworthy package options

Some package options are special in the sense that they **must** only ever be
updated **once** after package installation, and only towards a specific target
value. These package options are

* `kubernetes.cloud_provider`: must only be updated if the initial value for the
  option is `""` and the target value is `"aws"`.
* `kubernetes.high_availability`: must only be updated if the initial value for
  the option is `false` and the target value is `true`.

Also, some package options **must not** be changed **at all** after the package
is installed for the first time. Those package options are:

* `etcd.data_disk`
* `etcd.disk_type`
* `etcd.wal_disk`
* `kubernetes.network_provider`
* `kubernetes.service_cidr`
* `service.name`

Please make sure you understand and respect these rules. Otherwise you may
render your cluster unusable and risk losing data.
