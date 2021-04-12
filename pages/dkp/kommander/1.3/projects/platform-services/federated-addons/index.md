---
layout: layout.pug
beta: false
navigationTitle: Creating Federated Platform Services
title: Creating Federated Platform Services
menuWeight: 2
excerpt: Creating Federated Platform Services
---

Since a project Platform Service is simply a Kubernetes FederatedAddon, it can also be created using kubectl:

```bash
cat << EOF | kubectl create -f -
apiVersion: types.kubefed.io/v1beta1
kind: FederatedAddon
metadata:
  name: jenkins
  namespace: ${projectns}
spec:
  placement:
    clusterSelector: {}
  template:
    apiVersion: kubeaddons.mesosphere.io/v1beta1
    kind: Addon
    metadata:
      annotations:
        appversion.kubeaddons.mesosphere.io/jenkins: 1.9.4
        catalog.kubeaddons.mesosphere.io/addon-revision: 1.9.4-1
        catalog.kubeaddons.mesosphere.io/origin-repository: https://github.com/mesosphere/kubeaddons-enterprise
        catalog.kubeaddons.mesosphere.io/origin-repository-version: master
        values.chart.helm.kubeaddons.mesosphere.io/jenkins: https://raw.githubusercontent.com/jenkinsci/helm-charts/main/charts/jenkins/values.yaml
      labels:
        kubeaddons.mesosphere.io/name: jenkins
      name: jenkins
    spec:
      chartReference:
        chart: stable/jenkins
        values: |
          ---
          master:
            useSecurity: false
            installPlugins:
              - prometheus:2.0.6
              - kubernetes:1.18.2
              - workflow-job:2.33
              - workflow-aggregator:2.6
              - credentials-binding:1.19
              - git:3.11.0
            csrf:
              defaultCrumbIssuer:
                enabled: false
                proxyCompatability: false
            serviceType: "ClusterIP"
            jenkinsUriPrefix: "/jenkins"
            ingress:
              enabled: true
              path: /jenkins
              annotations:
                kubernetes.io/ingress.class: traefik
        version: 1.9.4
EOF
```

Ensure the projectns variable is set before executing the command. This variable is the project namespace (that is, the Kubernetes Namespace associated with the project) that was defined/created when the project itself was initially created.

After you run the following command on a Kubernetes cluster associated with the Project, a Kubernetes Addon Object appears in the corresponding namespace:

```bash
$ kubectl -n ${projectns} get addons.kubeaddons.mesosphere.io jenkins -o yaml
apiVersion: kubeaddons.mesosphere.io/v1beta1
kind: Addon
metadata:
  creationTimestamp: "2020-06-05T12:06:10Z"
  finalizers:
  - finalizer.kubeaddons.mesosphere.io
  generation: 1
  labels:
    kubeaddons.mesosphere.io/name: jenkins
    kubefed.io/managed: "true"
  name: jenkins
  namespace: project2-cmzh9-xwc2g
  resourceVersion: "18078"
  selfLink: /apis/kubeaddons.mesosphere.io/v1beta1/namespaces/project2-cmzh9-xwc2g/addons/jenkins
  uid: 60c869ad-b9b9-43fb-a78b-fcab2809e5bb
spec:
  chartReference:
    chart: stable/jenkins
    values: |
      ---
      master:
        useSecurity: false
        installPlugins:
          - prometheus:2.0.6
          - kubernetes:1.18.2
          - workflow-job:2.33
          - workflow-aggregator:2.6
          - credentials-binding:1.19
          - git:3.11.0
        csrf:
          defaultCrumbIssuer:
            enabled: false
            proxyCompatability: false
        serviceType: "ClusterIP"
        jenkinsUriPrefix: "/jenkins"
        ingress:
          enabled: true
          path: /jenkins
          annotations:
            kubernetes.io/ingress.class: traefik
    version: 1.9.4
  cloudProvider:
  - enabled: true
    name: aws
  - enabled: true
    name: azure
  - enabled: true
    name: docker
  - enabled: true
    name: none
  kubernetes:
    minSupportedVersion: v1.16.3
status:
  ready: false
  stage: deploying
```

The Konvoy Addon Controller is then responsible for deploying the application.
