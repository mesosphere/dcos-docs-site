---
layout: layout.pug
navigationTitle: Enforce policies using Gatekeeper
title: Enforce policies using Gatekeeper
menuWeight: 24
excerpt: Learn how to enforce policies using Gatekeeper
beta: false
enterprise: false
---

<!-- markdownlint-disable MD024 -->

[Gatekeeper][gatekeeper] is the policy controller for Kubernetes, allowing organizations to enforce configurable policies using the [Open Policy Agent][opa], a policy engine for Cloud Native environments hosted by CNCF as a graduated-level project.

This tutorial describes how to use Gatekeeper to enforce policies by rejecting non-compliant resources. Specifically, this tutorial describes two constraints as a way to use Gatekeeper as an alternative to [Pod Security Policies][psp]:

- [Prevent the running of privileged pods](#prevent-privileged-pods)
- [Prevent mounting host path volumes](#prevent-host-path-volumes)

## Before you begin
Before starting this tutorial, verify the following:

- You must have access to a Linux, macOS, or Windows computer with a supported operating system version.

- You must have a properly deployed and running cluster. For information about deploying Kubernetes with default settings on different types of infrastructures, see the [Choose Infrastructure][choose-infrastructure] topic.

- If you install Kommander with a custom configuration, make sure you enabled Gatekeeper.

## Use Gatekeeper

Gatekeeper uses the [OPA Constraint Framework][opa-constraints] to describe and enforce policy. Before you can define a constraint, you must first define a `ConstraintTemplate`, which describes both the [`Rego`][opa-rego] (a powerful query language) that enforces the constraint and the schema of the constraint. The schema of the constraint allows an admin to fine-tune the behavior of a constraint, much like arguments to a function.

The Gatekeeper repository includes a [library of policies][gatekeeper-library] to replace Pod Security Policies which you will use in the following tutorials.

### Prevent privileged pods

#### Define the ConstraintTemplate

Create the privileged pod policy constraint template `k8spspprivilegedcontainer` by running the following command:

```bash
kubectl apply -f https://raw.githubusercontent.com/open-policy-agent/gatekeeper-library/master/library/pod-security-policy/privileged-containers/template.yaml
```

#### Define the Constraint

Constraints are then used to inform Gatekeeper that the admin wants to enforce a ConstraintTemplate, and how.

Create the privileged pod policy constraint `psp-privileged-container` by running the following command:

```bash
kubectl apply -f https://raw.githubusercontent.com/open-policy-agent/gatekeeper-library/master/library/pod-security-policy/privileged-containers/samples/psp-privileged-container/constraint.yaml
```

#### Test that the constraint is enforced

Create a privileged pod by running the following command:

```bash
kubectl apply -f https://raw.githubusercontent.com/open-policy-agent/gatekeeper-library/master/library/pod-security-policy/privileged-containers/samples/psp-privileged-container/example_disallowed.yaml
```

You should see the following output:

```bash
Error from server ([denied by psp-privileged-container] Privileged container is not allowed: nginx, securityContext: {"privileged": true}): error when creating "https://raw.githubusercontent.com/open-policy-agent/gatekeeper-library/master/library/pod-security-policy/privileged-containers/samples/psp-privileged-container/example_disallowed.yaml": admission webhook "validation.gatekeeper.sh" denied the request: [denied by psp-privileged-container] Privileged container is not allowed: nginx, securityContext: {"privileged": true}
```

### Prevent host path volumes

#### Define the ConstraintTemplate

Create the host path volume policy constraint template `k8spsphostfilesystem` by running the following command:

```bash
kubectl apply -f https://raw.githubusercontent.com/open-policy-agent/gatekeeper-library/master/library/pod-security-policy/host-filesystem/template.yaml
```

#### Define the Constraint

Constraints are then used to inform Gatekeeper that the admin wants to enforce a ConstraintTemplate, and how.

Create the host path volume policy constraint `psp-host-filesystem` by running the following command to only allow `/foo` to be mounted as a host path volume:

```bash
cat <<EOF | kubectl apply -f -
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sPSPHostFilesystem
metadata:
  name: psp-host-filesystem
spec:
  match:
    kinds:
      - apiGroups: [""]
        kinds: ["Pod"]
  parameters:
    allowedHostPaths:
    - readOnly: true
      pathPrefix: "/foo"
EOF
```

#### Test that the constraint is enforced

Create a privileged pod by running the following command:

```bash
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: nginx-host-filesystem
  labels:
    app: nginx-host-filesystem
spec:
  containers:
  - name: nginx
    image: nginx
    volumeMounts:
    - mountPath: /cache
      name: cache-volume
      readOnly: true
  volumes:
  - name: cache-volume
    hostPath:
      path: /tmp # directory location on host
EOF
```

You should see the following output:

```bash
Error from server ([denied by psp-host-filesystem] HostPath volume {"hostPath": {"path": "/tmp", "type": ""}, "name": "cache-volume"} is not allowed, pod: nginx-host-filesystem. Allowed path: [{"readOnly": true, "pathPrefix": "/foo"}]): error when creating "STDIN": admission webhook "validation.gatekeeper.sh" denied the request: [denied by psp-host-filesystem] HostPath volume {"hostPath": {"path": "/tmp", "type": ""}, "name": "cache-volume"} is not allowed, pod: nginx-host-filesystem. Allowed path: [{"readOnly": true, "pathPrefix": "/foo"}]
```

#### Test that the constraint allows the allowed host paths

Create a pod that mounts an allowed host path by running the following command:

```bash
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: nginx-host-filesystem
  labels:
    app: nginx-host-filesystem
spec:
  containers:
  - name: nginx
    image: nginx
    volumeMounts:
    - mountPath: /cache
      name: cache-volume
      readOnly: true
  volumes:
  - name: cache-volume
    hostPath:
      path: /foo # directory location on host
EOF
```

You should see the following output:

```bash
pod/nginx-host-filesystem created
```

[gatekeeper]:https://github.com/open-policy-agent/gatekeeper
[gatekeeper-library]:https://github.com/open-policy-agent/gatekeeper-library/tree/master/library/pod-security-policy
[opa]:https://github.com/open-policy-agent/opa
[opa-constraints]:https://github.com/open-policy-agent/frameworks/tree/master/constraint
[opa-rego]:https://www.openpolicyagent.org/docs/latest/policy-language/
[psp]:https://kubernetes.io/docs/concepts/policy/pod-security-policy/
[choose-infrastructure]: /dkp/konvoy/2.2/choose-infrastructure/
