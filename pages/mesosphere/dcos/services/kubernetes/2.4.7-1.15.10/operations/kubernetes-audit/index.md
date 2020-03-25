---
layout: layout.pug
navigationTitle: Kubernetes Auditing
title: Kubernetes Auditing
menuWeight: 5
excerpt: Configuring Kubernetes Auditing
enterprise: true
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes-cluster -->

## Auditing

Kubernetes auditing provides a security-relevant chronological set of records. These document the sequence of activities that have affected the system by users, administrators or other components of the system.

The Kubernetes API server performs the auditing. Each request on each stage of its execution generates an event. The event is then pre-processed according to a certain policy and written to a backend. The policy determines what’s recorded and the backends persist the records. The supported backend implementation for DC/OS Kubernetes is log files.

### Performance

Currently, this feature has performance implications for the Kubernetes API server in the form of increased CPU and memory usage. This should be nominal for a small number of sinks.

## Configuring

Below is an example audit policy:

```yaml
apiVersion: audit.k8s.io/v1 # This is required.
kind: Policy
# Don't generate audit events for all requests in RequestReceived stage.
omitStages:
  - "RequestReceived"
rules:
  # Log pod changes at RequestResponse level
  - level: RequestResponse
    resources:
    - group: ""
      # Resource "pods" doesn't match requests to any subresource of pods,
      # which is consistent with the RBAC policy.
      resources: ["pods"]
  # Log "pods/log", "pods/status" at Metadata level
  - level: Metadata
    resources:
    - group: ""
      resources: ["pods/log", "pods/status"]

  # Don't log requests to a configmap called "controller-leader"
  - level: None
    resources:
    - group: ""
      resources: ["configmaps"]
      resourceNames: ["controller-leader"]

  # Don't log watch requests by the "system:kube-proxy" on endpoints or services
  - level: None
    users: ["system:kube-proxy"]
    verbs: ["watch"]
    resources:
    - group: "" # core API group
      resources: ["endpoints", "services"]

  # Don't log authenticated requests to certain non-resource URL paths.
  - level: None
    userGroups: ["system:authenticated"]
    nonResourceURLs:
    - "/api*" # Wildcard matching.
    - "/version"

  # Log the request body of configmap changes in kube-system.
  - level: Request
    resources:
    - group: "" # core API group
      resources: ["configmaps"]
    # This rule only applies to resources in the "kube-system" namespace.
    # The empty string "" can be used to select non-namespaced resources.
    namespaces: ["kube-system"]

  # Log configmap and secret changes in all other namespaces at the Metadata level.
  - level: Metadata
    resources:
    - group: "" # core API group
      resources: ["secrets", "configmaps"]

  # Log all other resources in core and extensions at the Request level.
  - level: Request
    resources:
    - group: "" # core API group
    - group: "extensions" # Version of group should NOT be included.

  # A catch-all rule to log all other requests at the Metadata level.
  - level: Metadata
    # Long-running requests like watches that fall under this rule will not
    # generate an audit event in RequestReceived.
    omitStages:
      - "RequestReceived"
```

1. Create a file with the above content and name it, for example, `kubernetes-cluster-audit-policy.yaml`.

1. To setup a policy for your cluster you need to create a DC/OS secret. In this example, we'll create a secret named `kubernetes-cluster/audit-policy` using the file created in the above step.

```shell
$ dcos security secrets create -f kubernetes-cluster-audit-policy.yaml kubernetes-cluster/audit-policy
```

<p class="message--important"><strong>IMPORTANT: </strong>The service account for the Kubernetes cluster requires permissions to read the secret containing the audit policy.</p>

1. To enable Kubernetes cluster auditing you need to set `.kubernetes.audit.policy` with the name of the DC/OS secret where the policy is stored.

```json
{
    "kubernetes": {
        "audit": {
            "policy": "kubernetes-cluster/audit-policy"
        }
    }
}
```

1. Optional: you can also configure the following Kubernetes API server auditing command line flags:

```shell
--audit-log-maxage defines the maximum number of days to retain old audit log files
--audit-log-maxbackup defines the maximum number of audit log files to retain
--audit-log-maxsize defines the maximum size in megabytes of the audit log file before it
gets rotated
```

The default values are:

```json
{
    "kubernetes": {
        "audit": {
            "log_maxage": 30,
            "log_maxbackup": 10,
            "log_maxsize": 100
        }
    }
}
```
