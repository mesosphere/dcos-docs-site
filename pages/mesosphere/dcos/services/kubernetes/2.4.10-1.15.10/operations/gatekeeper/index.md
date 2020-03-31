---
layout: layout.pug
navigationTitle: Enforce policies using Gatekeeper
title: Enforce policies using Gatekeeper
menuWeight: 24
excerpt: Learn how to enforce policies using Gatekeeper
enterprise: false
---

<!-- markdownlint-disable MD030 -->

[Gatekeeper][gatekeeper] is the policy controller for Kubernetes, allowing organizations to enforce configurable policies using the [Open Policy Agent][opa]. Open Policy Agend is a policy engine for Cloud Native environments hosted by CNCF as an incubation-level project.

This topic describes how to use Gatekeeper to enforce policies by rejecting non-compliant resources. Specifically, this topic describes two constraints as a way to show how to use Gatekeeper as an alternative to [Pod Security Policies][psp]:

- [Prevent running privileged pods](#prevent-privileged-pods)
- [Prevent mounting host path volumes](#prevent-host-path-volumes)

## Deploy Gatekeeper

See the [Gatekeeper installation instructions][installation-instructions] for details.

### Check RBAC Permission

Ensure you have cluster admin permissions:

```bash
kubectl create clusterrolebinding cluster-admin-binding \
    --clusterrole cluster-admin \
    --user <YOUR USER NAME>
```

### Deploy a Release Using a Prebuilt Image

To deploy a released version of Gatekeeper in your cluster with a prebuilt image, run the following command:

```
kubectl apply -f https://raw.githubusercontent.com/open-policy-agent/gatekeeper/master/deploy/gatekeeper.yaml
```

## Use Gatekeeper

Gatekeeper uses the [OPA Constraint Framework][opa-constraints] to describe and enforce a policy. Before you can define a constraint, you must first define a `ConstraintTemplate`. A `ConstraintTemplate` describes both the [`Rego`][opa-rego] (a powerful query language) that enforces the constraint and the schema of the constraint. The constraint schema allows an admin to fine-tune the behavior of a constraint, much like arguments to a function.

The Gatekeeper repository includes a [library of policies][gatekeeper-psp] to replace Pod Security Policies which we will use in the following steps.

### Prevent Privileged Pods

#### Define the ConstraintTemplate

Create the privileged pod policy constraint template `k8spspprivilegedcontainer` by running the following command:

```bash
kubectl apply -f https://raw.githubusercontent.com/open-policy-agent/gatekeeper/master/library/pod-security-policy/privileged-containers/template.yaml
```

#### Define the Constraint

Constraints are then used to inform Gatekeeper that the admin wants a ConstraintTemplate to be enforced, and how.

Create the privileged pod policy constraint `psp-privileged-container` by running the following command:

```bash
kubectl apply -f https://raw.githubusercontent.com/open-policy-agent/gatekeeper/master/library/pod-security-policy/privileged-containers/constraint.yaml
```

#### Test That the Constraint is Enforced

Create a privileged pod by running the following command:

```bash
kubectl apply -f https://raw.githubusercontent.com/open-policy-agent/gatekeeper/master/library/pod-security-policy/privileged-containers/example.yaml
```

You should see the following output:

```bash
Error from server ([denied by psp-privileged-container] Privileged container is not allowed: nginx, securityContext: {"privileged": true}): error when creating "https://raw.githubusercontent.com/open-policy-agent/gatekeeper/master/library/pod-security-policy/privileged-containers/example.yaml": admission webhook "validation.gatekeeper.sh" denied the request: [denied by psp-privileged-container] Privileged container is not allowed: nginx, securityContext: {"privileged": true}
```

### Prevent Host Path Volumes

#### Define the ConstraintTemplate

Create the host path volume policy constraint template `k8spsphostfilesystem` by running the following command:

```bash
kubectl apply -f https://raw.githubusercontent.com/open-policy-agent/gatekeeper/master/library/pod-security-policy/host-filesystem/template.yaml
```

#### Define the Constraint

Constraints are then used to inform Gatekeeper that the admin wants a ConstraintTemplate to be enforced, and how.

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

#### Test That the Constraint is Enforced

Create a pod that mounts a disallowed host path by running the following command:

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

#### Test That the Constraint Allows 'Allowed Host Paths'

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
[gatekeeper-psp]:https://github.com/open-policy-agent/gatekeeper/tree/master/library/pod-security-policy
[opa]:https://github.com/open-policy-agent/opa
[opa-constraints]:https://github.com/open-policy-agent/frameworks/tree/master/constraint
[opa-rego]:https://www.openpolicyagent.org/docs/v0.13.4/how-do-i-write-policies/
[psp]:https://kubernetes.io/docs/concepts/policy/pod-security-policy/
[certmanager]:https://github.com/jetstack/cert-manager
[certmanager-install]:https://docs.cert-manager.io/en/latest/getting-started/install/kubernetes.html#installing-with-helm
[quickstart]:../../quick-start/
[installation-instructions]:https://github.com/open-policy-agent/gatekeeper#installation-instructions
