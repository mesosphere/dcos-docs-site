---
layout: layout.pug
navigationTitle: Addon errors and failures
title: Addon errors and failures
menuWeight: 3
excerpt: Troubleshoot and address addon errors and failures
enterprise: false
---

Occasionally, you might see errors or failures as the addons you are deploying are enabled when you run the `konvoy up` command.
In most cases, these errors indicate that one or more addons did not deploy properly but do not specify the reason for the deployment failure.

The topics in this section cover some of the basic troubleshooting steps you can take to debug failures with addons.

## Check the status of addon deployment

When addons are deployed at the end of `konvoy up` or `konvoy deploy` command execution, the konvoy command-line program emit statuses for each addon that is deployed showing whether they succeeded or failed:

```bash
STAGE [Deploying Addons]
opsportal                                                              [OK]
helm                                                                   [OK]
awsebscsiprovisioner                                                   [OK]
dashboard                                                              [OK]
fluentbit                                                              [OK]
velero                                                                 [OK]
traefik                                                                [OK]
prometheus                                                             [OK]
elasticsearch                                                          [OK]
kibana                                                                 [OK]
elasticsearchexporter                                                  [OK]
prometheusadapter                                                      [OK]
```

The above shows an addon deployment where no issues encountered, however alternatively you could see something like:

```text
traefik                                                                [ERROR]
```

If possible `konvoy` will emit information about the failure directly in this output underneath the error, which can be helpful for diagnosing the root cause and making the changes necessary to accomodate before running `konvoy deploy` again.

Some addons (such as `traefik`) are deployed using [helm](https://helm.sh).
It may be helpful to start troubleshooting with:

```bash
helm list
```

as this will provide a status output for all helm releases.

It can also be helpful to check the deployments or pods for any given addon.

For instance: if you had a problem with Traefik as seen above, the first step could be to inspect the traefik deployment:

```bash
$ kubectl -n kubeaddons get deployment traefik-kubeaddons
NAME                 READY   UP-TO-DATE   AVAILABLE   AGE
traefik-kubeaddons   0/2     0            0           10m
```

This indicates a problem with deploying the pods, which you can investigate by looking through the deployment information:

```bash
kubectl -n kubeaddons describe deployment traefik-kubeaddons
```

The events and information there may point you to the cause of the problem, or if the pod simply failed, you can view the available traefik pods:

```bash
kubectl -n kube-system get pods | grep traefik
```

Collect the pod name (e.g. `traefik-kubeaddons-<id>`) here and then investigate further by pulling the logs for each pod:

```bash
kubectl -n kubeaddons logs traefik-kubeaddons-<id>
```

**NOTE**: It can be the case that only `[ERROR]` is received with no information about the failure.
In this case, report an issue through the regular channels.
