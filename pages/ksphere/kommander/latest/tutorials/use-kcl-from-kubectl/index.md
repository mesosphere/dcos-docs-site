---
layout: layout.pug
navigationTitle: Using Kommander Cluster Lifecycle API via kubectl
title: Using Kommander Cluster Lifecycle API via kubectl
excerpt: Basic Kommander Cluster Lifecycle API (KCL) operations with kubectl
---

In this tutorial we're going to:

- create a Workspaces
- provision a cluster in the Workspace
- create a Project in the Workspace having the cluster in it.
- create a custom role in the project

## Prerequisites

You need to have `kubectl` connected to your Kommander Management cluster using the Token flow.

Make sure KCL pods are running.

```
$ kubectl -n kommander get pods

NAME                                                       READY   STATUS      RESTARTS   AGE
kcl-cm-7c6c9cbcc6-vszfs                                    2/2     Running     0          75m
kcl-tfcb-9c88c7bc9-mxfjp                                   1/1     Running     0          75m
kcl-utility-apiserver-7ffcc5b4bf-jzd69                     1/1     Running     0          75m
kcl-webhook-87f7b8d45-vqcm5                                1/1     Running     0          75m
kubefed-admission-webhook-7575b6b474-hvctv                 1/1     Running     0          75m
kubefed-controller-manager-76bcdf6dc4-lp9xr                1/1     Running     0          75m
kubefed-controller-manager-76bcdf6dc4-zhm54                1/1     Running     0          75m
```

## Viewing KCL Logs

```
kubectl -n kommander logs -l control-plane=kcl-cm -c controller-manager
```

### Viewing KCL Webhook Logs

```
kubectl -n kommander logs -l control-plane=kcl-webhook
```

## Working with the Workspaces

Learn more about [Workspaces][kommander_workspaces] in Kommander.

### Show the list of the Workspaces

```
$ kubectl get workspaces

NAME                     DISPLAY NAME             WORKSPACE NAMESPACE            AGE
default-workspace        Default Workspace        default-workspace-4clss        77m
```

### Creating a new Workspace

```
cat - << EOF | kubectl apply -f -
apiVersion: workspaces.kommander.mesosphere.io/v1alpha1
kind: Workspace
metadata:
  name: workspacetest
EOF
```

List workspaces again to get the Workspace namespace. We are going to need it further.

```
$ kubectl get workspaces

NAME                     DISPLAY NAME             WORKSPACE NAMESPACE            AGE
default-workspace        Default Workspace        default-workspace-4clss        95m
workspacetest                                     workspacetest-r69q2            77s
```

## Creating a cluster in the Workspace

### Creating an AWS Cloud Provider

In this tutorial we are going to be using AWS Provider. Althouhg you can use any other supported [infrastructure provider][infrastructure_provider].

<p class="message--note"><strong>NOTE: </strong>Assuming you logged in with aws-cli
</p>

```
BASE64_ARGS="-w 0"
if [ "$(uname)" == "Darwin" ]; then
  BASE64_ARGS=
fi

CREDENTIALS=$( base64 ${BASE64_ARGS} ~/.aws/credentials )
PROFILE=$(echo -n "${AWS_PROFILE}" | base64 ${BASE64_ARGS} )

cat - << EOF | kubectl apply -f -
---
apiVersion: v1
kind: Secret
metadata:
  name: aws-credentials
  namespace: workspacetest-r69q2
data:
  credentials: ${CREDENTIALS}
  profile: ${PROFILE}
type: kommander.mesosphere.io/aws-credentials
---
apiVersion: kommander.mesosphere.io/v1beta1
kind: CloudProviderAccount
metadata:
  name: aws-credentials
  namespace: workspacetest-r69q2
  annotations:
    kommander.mesosphere.io/display-name: My AWS Credentials
spec:
  provider: aws
  credentialsRef:
    name: aws-credentials
EOF
```

### Creating a cluster

To create a cluster via KCL means we ecreate a KonvoyCluster CRD in the Workspace namespace.

```
cat - << EOF | kubectl apply -f -
apiVersion: kommander.mesosphere.io/v1beta1
kind: KonvoyCluster
metadata:
  name: sample-kubernetes-tutorial
  namespace: workspacetest-r69q2
spec:
  cluster:
    kubernetes:
      version: 1.16.4
  provisioner:
    provider: aws
  cloudProviderAccountRef:
    name: aws-credentials
EOF
```

You can check the KCL controller manager logs to verify cluster creation

```
kubectl -n kommander logs -l control-plane=kcl-cm -c controller-manager
```

To provision a cluster KCL uses Kubernetes Jobs

```
kubectl get jobs -n workspacetest-r69q2
```

To access logs of the job we need to check its pod

```
$ kubectl get pods -n workspacetest-r69q2

NAME                               READY   STATUS    RESTARTS   AGE
sample-kubernetes-tutorial-z9hqw   1/1     Running   0          47s
```

Now when we know the pod name we can check the logs

```
kubectl -n workspacetest-r69q2 logs sample-kubernetes-tutorial-z9hqw -f
```

Waiting for the cluster to be provisioned

```
$ kubectl -n workspacetest-r69q2 get konvoycluster -w

NAME                         DISPLAY NAME   STATUS         PROVIDER   AGE
sample-kubernetes-tutorial                  Provisioning   aws        5m48s
```

The kubeconfig to access the new cluster is stored in a secret. Let's save it for later use

```
kubectl -n workspacetest-r69q2 get secret --field-selector type=kommander.mesosphere.io/kubeconfig -o=jsonpath="{.items[0].data.kubeconfig}" | base64 -d > sample-kubernetes-tutorial.kubeconfig
```

## Working with Projects

Learn more about [Projects][kommander_projects] in Kommander.

### Create a new Project

```
cat - << EOF | kubectl apply -f -
apiVersion: workspaces.kommander.mesosphere.io/v1alpha1
kind: Project
metadata:
  name: projecttest
  namespace: workspacetest-r69q2
spec:
  workspaceRef:
    name: workspacetest
  placement:
    clusters:
      - name: sample-kubernetes-tutorial
EOF
```

Get tthe Project data

```
$ kubectl get projects -A

NAMESPACE                   NAME              DISPLAY NAME      PROJECT NAMESPACE       AGE
workspacetest-r69q2         projecttest                         projecttest-5r55h       56s
```

Check the Project's namespace is federated to the target cluster

```
$ kubectl --kubeconfig sample-kubernetes-tutorial.kubeconfig get namespaces

NAME                    STATUS   AGE
***                     ***      ***
projecttest-5r55h       Active   12m
***                     ***      ***
```

Check default Project roles in the target cluster

```
$ kubectl --kubeconfig sample-kubernetes-tutorial.kubeconfig -n projecttest-5r55h get roles

NAME                           AGE
project-app-deployer-gl4d4     14m
project-auditor-xrvj8          14m
project-config-manager-fv5sz   14m
```

#### Create a custom Project Role

```
cat - << EOF | kubectl apply -f -
apiVersion: workspaces.kommander.mesosphere.io/v1alpha1
kind: ProjectRole
metadata:
  name: projectrole-podreader
  namespace: projecttest-5r55h
spec:
  rules:
    - apiGroups: [""] # "" indicates the core API group
      resources: ["pods"]
      verbs: ["get", "watch", "list"]
EOF
```

Check the role is properly federated to the target cluster

```
kubectl --kubeconfig sample-kubernetes-tutorial.kubeconfig -n projecttest-5r55h get roles -w

NAME                           AGE
***                            ***
projectrole-podreader-wbwzv    15s
```

Check the role's yaml

```
kubectl --kubeconfig sample-kubernetes-tutorial.kubeconfig -n projecttest-5r55h get roles projectrole-podreader-wbwzv -o yaml
```

#### Delete the role

```
cat - << EOF | kubectl delete -f -
apiVersion: workspaces.kommander.mesosphere.io/v1alpha1
kind: ProjectRole
metadata:
  name: projectrole-podreader
  namespace: projecttest-5r55h
spec:
  rules:
    - apiGroups: [""] # "" indicates the core API group
      resources: ["pods"]
      verbs: ["get", "watch", "list"]
EOF
```

#### Delete the Project

This can take a few minutes to delete all the resources in the target cluster.

```
cat - << EOF | kubectl delete -f -
apiVersion: workspaces.kommander.mesosphere.io/v1alpha1
kind: Project
metadata:
  name: projecttest
  namespace: workspacetest-r69q2
spec:
  workspaceRef:
    name: workspacetest
  placement:
    clusters:
      - name: sample-kubernetes-tutorial
EOF
```

Check the Projetc's namespace is deleted in the target cluster.

```
kubectl --kubeconfig sample-kubernetes-tutorial.kubeconfig get namespaces
```

## Delete the cluster

```
cat - << EOF | kubectl delete -f -
apiVersion: kommander.mesosphere.io/v1beta1
kind: KonvoyCluster
metadata:
  name: sample-kubernetes-tutorial
  namespace: workspacetest-r69q2
spec:
  cluster:
    kubernetes:
      version: 1.16.4
    provisioner:
      provider: aws
    cloudProviderAccountRef:
      name: aws-credentials
EOF
```

[infrastructure_provider]: /ksphere/kommander/latest/operations/cloud-providers
[kommander_projects]: /ksphere/kommander/latest/projects
[kommander_workspaces]: /ksphere/kommander/latest/workspaces
