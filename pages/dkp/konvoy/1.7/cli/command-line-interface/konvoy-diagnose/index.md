---
layout: layout.pug
navigationTitle: konvoy diagnose
title: konvoy diagnose
menuWeight: 10
notes: Automatically generated, DO NOT EDIT
excerpt: Creates a diagnostics bundle of the cluster
---

## konvoy diagnose

Creates a diagnostics bundle of the cluster

### Synopsis

Creates a diagnostics bundle of the cluster in the form of a gzipped tar archive. Such a bundle contains a lot of information about the current state of the cluster, e.g. log files, networking parameters and pod status in order to be able to diagnose issues

```
konvoy diagnose [flags]
```

### Options

```
      --cluster-name string       name used to prefix the cluster and all the created resources (default "konvoy")
      --exclude-files strings     comma-separated list of regular expressions used to exclude matching files from the bundle (e.g. '--exclude-files=lsmod.txt,ps.txt')
  -h, --help                      help for diagnose
      --include-pod-log-dirs      include the directories with the pod logs allocated in the node
      --include-secrets           include the values of secrets, WARNING the secrets will be plaintext in the bundle
      --logs-all-namespaces       include logs from pods in all namespaces
      --logs-namespaces strings   include logs from pods in the given namespaces (default [cert-manager,dispatch,istio-system,knative-serving,kommander,kommander-system,konvoy,kube-node-lease,kube-public,kube-system,kubeaddons,kubeaddons-flagger,kubecost,kubeflow,kudo-system,tekton-pipelines,velero])
  -o, --output string             file name to use for storing the diagnostics bundle in
  -s, --since d                   Log files will be queried up to <since> in the past. Supports d and `h` for days and hours respectively (default "2d")
  -y, --yes                       run command without prompting
```

### SEE ALSO

* [konvoy](../)	 - Deploy and manage Kubernetes clusters

