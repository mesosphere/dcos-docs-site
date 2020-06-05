---
layout: layout.pug
navigationTitle: Addon Catalog
title: Addon Catalog
beta: true
menuWeight: 8
excerpt: Deploy applications to your Kommander Projects
---

Kommander can also deploy services from a catalog of current cloud native services with the push of a button. This helps organizations quickly deploy services to multiple clusters. Governance-based access to data services ensures roles and responsibilities are maintained.

Kommander can be extended with the `AddonRepository` resource that point to git repositories containing application addons. For example, the `kubeaddons-enterprise` repo contains addons such as Jenkins and Kafka with specific settings for each cloud provider. Addons can be composed using either Helm V2 charts or KUDO operators.

Example `AddonRepository` resource to add a new repository to your catalog:

```yaml
apiVersion: kubeaddons.mesosphere.io/v1beta1
kind: AddonRepository
metadata:
  name: kubeaddons-enterprise
  namespace: project-namespace
spec:
  priority: "20"
  ref: “stable-1.16”
  url: https://github.com/mesosphere/kubeaddons-enterprise
```

To deploy an addon, select a Project from your Workspace and select the **View Catalog** button to browse the available addons from your configured repositories. Select your desired addon, select the version you'd like to deploy in the version dropdown, and then click **Deploy**.

For all addons, you must provide a display name and an ID. The ID will be automatically generated based on what is entered for the display name, unless or until you edit the ID directly. The ID must be compliant with [Kubernetes DNS subdomain name validation rules](https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-subdomain-names).

Optionally, you can customize the helm chart values or KUDO parameters of a service before deploying it.

For Helm-based addons, specify the chart values in a YAML editor:

![Deploy Helm Platform Service](/ksphere/kommander/1.1.0-beta/img/project-catalog-deploy-helm.png)

For KUDO-based addons, fill out the form fields supported by that addon's parameters schema:

![Deploy KUDO Platform Service](/ksphere/kommander/1.1.0-beta/img/project-catalog-deploy-kudo.png)

After an addon is deployed in a project, the service is installed to all clusters in that project.
