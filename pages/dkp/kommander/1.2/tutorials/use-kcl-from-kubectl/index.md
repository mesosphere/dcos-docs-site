---
layout: layout.pug
beta: false
navigationTitle: Using Kommander Cluster Lifecycle API via kubectl
title: Using Kommander Cluster Lifecycle API via kubectl
menuWeight: 15
excerpt: Basic Kommander Cluster Lifecycle API (KCL) operations with kubectl
---

This tutorial covers the following topics:

- Creating workspaces.
- Provisioning a cluster in the workspace.
- Creating a project in a workspace having a cluster.
- Creating create a custom role in a project.

## Prerequisites

You must have `kubectl` connected to your Kommander Management cluster using the Token flow.

Ensure KCL pods are running.

```
kubectl -n kommander get pods

NAME                                                              READY   STATUS    RESTARTS   AGE
kommander-federation-authorizedlister-5556c8b658-djxn4            1/1     Running   0          5m35s
kommander-federation-cm-798d697c54-2wh95                          2/2     Running   0          5m36s
kommander-federation-utility-apiserver-657d58485d-m2zdm           1/1     Running   0          5m37s
kommander-federation-webhook-b7698b4f5-7wgkb                      1/1     Running   0          5m36s
kommander-kubeaddons-grafana-9c688768-6tmsh                       2/2     Running   0          5m36s
kommander-kubeaddons-karma-8df6cfdb6-qvgfq                        1/1     Running   0          5m34s
kommander-kubeaddons-kommander-ui-5b7949cf46-5mcjr                1/1     Running   0          5m35s
kommander-kubeaddons-kubeaddons-catalog-6654f856df-6kqcw          1/1     Running   0          5m35s
kommander-kubeaddons-thanos-query-7bfbfdbb55-zzphn                1/1     Running   0          5m37s
kommander-kubecost-cost-analyzer-699d885674-sfh7q                 3/3     Running   0          5m36s
kommander-kubecost-prometheus-alertmanager-84bd78c66d-hc9xg       2/2     Running   0          5m36s
kommander-kubecost-prometheus-kube-state-metrics-84dcd64c7psm96   1/1     Running   0          5m35s
kommander-kubecost-prometheus-server-b9f8b889d-smkl5              3/3     Running   0          5m36s
kommander-kubecost-thanos-query-7bc4c7c65c-wz5z9                  1/1     Running   0          5m36s
kommander-licensing-cm-6c554cf8b9-wjnjc                           2/2     Running   0          5m36s
kommander-licensing-webhook-754d985dfd-d56f4                      1/1     Running   0          5m36s
kubefed-admission-webhook-58b7648f77-rld5z                        1/1     Running   0          5m31s
kubefed-controller-manager-6bc8cbd6d7-79tww                       1/1     Running   0          5m31s
kubefed-controller-manager-6bc8cbd6d7-wt9bk                       1/1     Running   0          4m44s
```

## Viewing KCL Logs

```
kubectl -n kommander logs -l control-plane=kommander-federation-cm -c controller-manager
```

### Viewing KCL Webhook Logs

```
kubectl -n kommander logs -l control-plane=kommander-federation-webhook
```

## Working with the Workspaces

Learn more about [Workspaces][kommander_workspaces] in Kommander.

### Show the list of the Workspaces

```
kubectl get workspaces

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
kubectl get workspaces

NAME                     DISPLAY NAME             WORKSPACE NAMESPACE            AGE
default-workspace        Default Workspace        default-workspace-4clss        95m
workspacetest                                     workspacetest-r69q2            77s
```

Save the namespace of the workspace in a variable so we can reuse it later:

```
export WORKSPACE_NS=$(kubectl get workspaces workspacetest -ojsonpath='{.status.namespaceRef.name}')
```

## Creating a cluster in the Workspace

### Creating an AWS Cloud Provider

In this tutorial we are using AWS Provider, but you can use any other supported [infrastructure provider][infrastructure_provider].

<p class="message--note"><strong>NOTE: </strong>Assuming you logged in with aws-cli
</p>
To create a cluster you must setup the secret with the AWS credentials and a CloudProviderAccount.

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
  namespace: $WORKSPACE_NS
data:
  credentials: ${CREDENTIALS}
  profile: ${PROFILE}
type: kommander.mesosphere.io/aws-credentials
---
apiVersion: kommander.mesosphere.io/v1beta1
kind: CloudProviderAccount
metadata:
  name: aws-credentials
  namespace: $WORKSPACE_NS
  annotations:
    kommander.mesosphere.io/display-name: My AWS Credentials
spec:
  provider: aws
  credentialsRef:
    name: aws-credentials
EOF
```

### Creating a cluster

To create a cluster using KCL means you create a KonvoyCluster CRD in the Workspace namespace. You must reference the CloudProviderAccount with the AWS credentials you created in the previous step.

```
cat - << EOF | kubectl apply -f -
apiVersion: kommander.mesosphere.io/v1beta1
kind: KonvoyCluster
metadata:
  name: sample-kubernetes-tutorial
  namespace: $WORKSPACE_NS
spec:
  cluster:
    kubernetes:
      version: 1.18.10
  provisioner:
    provider: aws
  cloudProviderAccountRef:
    name: aws-credentials
EOF
```

You can check the KCL controller manager logs to verify cluster provisioning started.

```
kubectl -n kommander logs -l control-plane=kommander-federation-cm -c controller-manager
```

To provision a cluster KCL uses Kubernetes Jobs.

```
kubectl get jobs -n $WORKSPACE_NS
```

To access logs of the job we must check its pod.

```
kubectl get pods -n $WORKSPACE_NS

NAME                               READY   STATUS    RESTARTS   AGE
sample-kubernetes-tutorial-z9hqw   1/1     Running   0          47s
```

When we know the pod name we can check the logs.

```
kubectl -n $WORKSPACE_NS logs sample-kubernetes-tutorial-z9hqw -f
```

Waiting for the cluster to be provisioned.

```
kubectl -n $WORKSPACE_NS get konvoycluster -w

NAME                         DISPLAY NAME   STATUS         PROVIDER   AGE
sample-kubernetes-tutorial                  Provisioning   aws        5m48s
```

The kubeconfig to access the new cluster is stored in a secret. Save that for later use.

```
kubectl -n $WORKSPACE_NS get secret --field-selector type=kommander.mesosphere.io/kubeconfig -o=jsonpath="{.items[0].data.kubeconfig}" | base64 -d > sample-kubernetes-tutorial.kubeconfig
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
  namespace: $WORKSPACE_NS
spec:
  workspaceRef:
    name: workspacetest
  placement:
    clusters:
      - name: sample-kubernetes-tutorial
EOF
```

Get the Project data.

```
kubectl get projects -A

NAMESPACE                   NAME              DISPLAY NAME      PROJECT NAMESPACE       AGE
workspacetest-r69q2         projecttest                         projecttest-5r55h       56s
```

Ensure the Project's namespace is federated to the target cluster.

```
kubectl --kubeconfig sample-kubernetes-tutorial.kubeconfig get namespaces

NAME                    STATUS   AGE
***                     ***      ***
projecttest-5r55h       Active   12m
***                     ***      ***
```

Save the project namespace in a variable for later use.

```
export PROJECT_NS=$(kubectl -n $WORKSPACE_NS get project projecttest -ojsonpath='{.status.namespaceRef.name}')
```

Check default Project roles in the target cluster.

```
kubectl --kubeconfig sample-kubernetes-tutorial.kubeconfig -n $PROJECT_NS get roles

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
  namespace: $PROJECT_NS
spec:
  rules:
    - apiGroups: [""] # "" indicates the core API group
      resources: ["pods"]
      verbs: ["get", "watch", "list"]
EOF
```

Ensure the role is properly federated to the target cluster.

```
kubectl --kubeconfig sample-kubernetes-tutorial.kubeconfig -n $PROJECT_NS get roles -w

NAME                           AGE
***                            ***
projectrole-podreader-wbwzv    15s
```

Check the project role's yaml.

```
kubectl --kubeconfig sample-kubernetes-tutorial.kubeconfig -n $PROJECT_NS get roles projectrole-podreader-wbwzv -o yaml
```

#### Delete the custom Project Role

```
kubectl -n $PROJECT_NS delete projectrole projectrole-podreader
```

#### Delete the Project

It may take a few minutes to delete all the resources in the target cluster.

```
cat - << EOF | kubectl delete -f -
apiVersion: workspaces.kommander.mesosphere.io/v1alpha1
kind: Project
metadata:
  name: projecttest
  namespace: $WORKSPACE_NS
spec:
  workspaceRef:
    name: workspacetest
  placement:
    clusters:
      - name: sample-kubernetes-tutorial
EOF
```

Ensure the Project's namespace is deleted in the target cluster.

```
kubectl --kubeconfig sample-kubernetes-tutorial.kubeconfig get namespaces
```

## Delete the cluster

```
kubectl -n $WORKSPACE_NS delete konvoycluster sample-kubernetes-tutorial
```

[infrastructure_provider]: /dkp/kommander/1.2/operations/infrastructure-providers
[kommander_projects]: /dkp/kommander/1.2/projects
[kommander_workspaces]: /dkp/kommander/1.2/workspaces
