---
layout: layout.pug
navigationTitle: Add-on errors and failures
title: Add-on errors and failures
menuWeight: 3
excerpt: Troubleshoot and address add-on errors and failures
enterprise: false
---

Occasionally, you might see errors or failures as the add-ons you are deploying are enabled when you run the `konvoy up` command.
In most cases, these errors indicate that one or more add-ons did not deploy properly but do not specify the reason for the deployment failure.

The topics in this section cover some of the basic troubleshooting steps you can take to debug failures with add-ons.

## Check the status of add-on deployment

When add-ons are deployed at the end of `konvoy up` or `konvoy deploy` command execution, the Konvoy command-line program emit statuses for each add-on that is deployed showing whether they succeeded or failed:

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

The above shows an add-on deployment where no issues encountered, however alternatively you could see something like:

```text
traefik                                                                [ERROR]
```

If possible `konvoy` will emit information about the failure directly in this output underneath the error, which can be helpful for diagnosing the root cause and making the changes necessary to accomodate before running `konvoy deploy` again.

Some add-ons (such as `traefik`) are deployed using [helm](https://helm.sh).
It may be helpful to start troubleshooting with:

```bash
helm list
```

as this will provide a status output for all helm releases.

It can also be helpful to check the deployments or pods for any given add-on.

For instance: if you had a problem with Traefik as seen above, the first step could be to inspect the traefik deployment:

```bash
$ kubectl -n kubeadd-ons get deployment traefik-kubeadd-ons
NAME                 READY   UP-TO-DATE   AVAILABLE   AGE
traefik-kubeadd-ons   0/2     0            0           10m
```

This indicates a problem with deploying the pods, which you can investigate by looking through the deployment information:

```bash
kubectl -n kubeadd-ons describe deployment traefik-kubeadd-ons
```

The events and information there may point you to the cause of the problem, or if the pod simply failed, you can view the available traefik pods:

```bash
kubectl -n kube-system get pods | grep traefik
```

Collect the pod name (e.g. `traefik-kubeadd-ons-<id>`) here and then investigate further by pulling the logs for each pod:

```bash
kubectl -n kubeadd-ons logs traefik-kubeadd-ons-<id>
```

**NOTE**: It can be the case that only `[ERROR]` is received with no information about the failure.
In this case, report an issue through the regular channels.
