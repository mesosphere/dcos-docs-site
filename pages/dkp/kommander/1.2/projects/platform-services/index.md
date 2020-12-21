---
layout: layout.pug
beta: false
navigationTitle: Project Platform Services
title: Project Platform Services
menuWeight: 1
excerpt: Project Platform Services are services that you want to be deployed on all the Kubernetes clusters associated with the Project, in the corresponding namespace.
---

Kommander can also deploy services from a catalog of current cloud native services with the push of a button. This helps organizations quickly deploy services to multiple clusters. Governance-based access to data services ensures roles and responsibilities are maintained. Some of these services are Certified services, which means that you can subscribe to support for them from Kommander.

![Project Catalog](/dkp/kommander/1.2/img/project-catalog.png)

Kommander can be extended with the AddonRepository resource that point to git repositories containing application addons. For example, the kubeaddons-enterprise repo contains addons such as Jenkins and Kafka with specific settings for each service. Addons can be composed using either Helm V2 charts or KUDO operators.

Example AddonRepository resource to add a new repository to your catalog:

```bash
apiVersion: kubeaddons.mesosphere.io/v1beta1
kind: AddonRepository
metadata:
  name: kubeaddons-enterprise
  namespace: project-namespace
spec:
  priority: "20"
  ref: “stable-1.26”
  url: https://github.com/mesosphere/kubeaddons-enterprise
```

To deploy an addon:

1. Select **Workspace** > **Project**
2. Select **View Catalog** to browse the available addons from your configured repositories.
3. Select your desired addon.
4. Select the version you'd like to deploy from the version drop-down, and then select Deploy.

For all addons, you must provide a display name and an ID. The ID will be automatically generated based on what is entered for the display name, unless or until you edit the ID directly. The ID must be compliant with [Kubernetes DNS subdomain name validation rules](https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-subdomain-names).

Optionally, you can customize the helm chart values or KUDO parameters of a service before deploying it.

For Helm-based addons, specify the chart values in a YAML editor:

![Deploy Helm Platform Service](/dkp/kommander/1.2/img/project-catalog-deploy-helm.png)

For KUDO-based addons, fill out the form fields supported by that addon's parameters schema:

![Deploy KUDO Platform Service](/dkp/kommander/1.2/img/project-catalog-deploy-kudo.png)

After an addon is deployed in a project, the service is installed to all clusters in that project.

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

Ensure the projectns variable is set before executing the command. This variable is the project namespace (i.e. Kubernetes Namespace associated with the project) that was defined/created when the project itself was initially created.

Then, if you run the following command on a Kubernetes cluster associated with the Project, you’ll see a Kubernetes Addon Object, in the corresponding namespace:

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

After the addon is deployed, the addon may be upgraded to a newer version. The only versions shown are compatible with the clusters in that project.

![Project addon edit form](/dkp/kommander/1.2/img/project-catalog-addon-edit.png)
