# Installation of jenkins

Jenkins can be installaed in multiple ways:

1. Using the kommander catalog addon (Recommended way)
2. From upstream helm repo

### Installation from Kommander Catalog Addons

##### Prerequisites

- Running Konvoy cluster attached to a Kommander instance.

1. Go to the kommander UI and attach the konvoy cluster(s) in which you desire to install jenkins.
2. Create a project with labels matching this cluster(s) if it doesn't already exist
3. Go to Projects > Select your Project > View Catalog > Click on Jenkins > Deploy (after making any necessary changes to the config if needed)

Your jenkins instance should come up shortly.

### Installation of jenkins from upstream helm chart in to a konvoy cluster

Create ServiceAccount, Role and Rolebinding. Change the permissions as necessary.

```bash
$ cat <<EOF | kubectl create -f -
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: jenkins
  namespace: jenkins
---
kind: Role
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: jenkins
  namespace: jenkins
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["create","delete","get","list","patch","update","watch"]
- apiGroups: [""]
  resources: ["pods/exec"]
  verbs: ["create","delete","get","list","patch","update","watch"]
- apiGroups: [""]
  resources: ["pods/log"]
  verbs: ["get","list","watch"]
- apiGroups: [""]
  resources: ["secrets"]
  verbs: ["get"]
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: RoleBinding
metadata:
  name: jenkins
  namespace: jenkins
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: jenkins
subjects:
- kind: ServiceAccount
  name: jenkins
EOF
```

Create a `values.yaml` that can be used to install the jenkins from upstream helm repo.

```yaml
master:
  useSecurity: false
  installPlugins: ["prometheus:2.0.6","kubernetes:1.18.2"]
  csrf:
    defaultCrumbIssuer:
      enabled: false
      proxyCompatability: false
  prometheus:
    enabled: true
    serviceMonitorNamespace: "kubeaddons"
    serviceMonitorAdditionalLabels:
      app: jenkins
      release: prometheus-kubeaddons
  serviceType: "ClusterIP"
  jenkinsUriPrefix: "/jenkins"
  ingress:
    enabled: true
    path: /jenkins
    annotations:
       kubernetes.io/ingress.class: traefik
```

Install helm chart with the service credentials and `values.yaml` created above.

```bash
$ helm install \
    --namespace jenkins \
    --name jenkins \
    -f values.yaml \
    --set master.jenkinsUriPrefix=/jenkins \
    --set master.ingress.path=/jenkins \
    --set serviceAccount.create=false \
    --set serviceAccount.name=jenkins \
    --set serviceAccountAgent.name=jenkins \
    stable/jenkins
```
