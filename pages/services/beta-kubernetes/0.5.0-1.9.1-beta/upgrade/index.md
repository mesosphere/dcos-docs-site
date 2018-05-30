---
layout: layout.pug
navigationTitle:  Upgrade
title: Upgrade
menuWeight: 100
excerpt:

---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


Upgrades are now supported providing a cli command that enables to update the
package version and consequently the Kubernetes version of the deployed components. This update
engine deploys a new framework version with its respective changes for each Kubernetes component.
The engine does this one component at a time: the next component in the cluster is recreated
only when the new version of the previous component has been created and reports
a healthy status. By components, we mean the following unit blocks: etcd, api-server,
controller-manager, scheduler, proxy-kubelet sidecar and the mandatory-addons.

Note that during the upgrading, new tasks will be deployed such as the `kube-node-<POD_INDEX>-decommission`
and `kube-node-<POD_INDEX>-commision`. Theses two tasks will take care of draining and
decommissioning your kube nodes.

## Updating a cluster

To do so, you have to use a new cli command `update` which allows users to upgrade
their clusters. With this command, users can update the resource settings of the
cluster or change the Framework and Kubernetes version of the deployed components.

```
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

To upgrade the framework or the Kubernetes version of your cluster, a package
version is required. Likewise it is possible to change the resources settings
of the deployed components by specifying the options file flag. The current
implementation of updates supports to scale down/in the allocated resources or
the number of deployed components.

**IMPORTANT:** If you have a large cluster with many kube nodes. We recommend you
to adjust the value of `--ttl` flag. This flag sets a default maximum timeout to
`20 minutes` for the update process completion.

### Upgrade the Framework version

If we want to upgrade the framework version of the cluster, you simply need to run:

`$ dcos beta-kubernetes update --package-version=<NEW_VERSION>`


### Update the resource settings of the deployed components

To change the resources allocated to one of the deployed components, e.g the memory
limit of `kube-proxy`. You simply need to run the following command using
an options file e.g. `newOptions.json`.

```
$ dcos beta-kubernetes update --options=newOptions.json
```

The content of this file must follow the schema defined for the package installation options.
When the file `newOptions.json` contains:
```
{
	"kube-proxy": {
		"cpus": 0.2,
		"mem": 612
	}
}
```

Next we show the output of this command where the changes are highlighted with
the text `(CHANGED)`:

```
The components of the cluster will be upgraded accordingly to the changes in the
options file [newOptions.json]. This operation is long-running and has to run to completion.

Detected the following differences between service configurations (CHANGED, CURRENT):
   ==    {
   ==      "kube-proxy": {
(current)    "cpus": 0.1,
(changed)    "cpus": 0.2,
(current)    "mem": 512
(changed)    "mem": 612
   ==      }
   ==    }

Do you want to apply these CHANGES?, Please type (yes/no) and then press enter: y
Kubernetes service: [STARTED]
Framework components update: [COMPLETE]
Framework has been updated successfully!
```

### Upgrade the Kubernetes version

To upgrade the Kubernetes version of the components, you need to run the following command:

```
$ dcos beta-kubernetes update --kubernetes-version=v1.9.0-beta.1
```

As mentioned, you can also combine flags such as `options` and `kubernetes-version`.

```
$ dcos beta-kubernetes update --options=newOptions.json --kubernetes-version=v1.9.0-beta.1
```
