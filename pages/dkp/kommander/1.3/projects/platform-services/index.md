---
layout: layout.pug
beta: false
navigationTitle: Project Platform Services
title: Project Platform Services
menuWeight: 1
excerpt: Project Platform Services are services that you want to be deployed on all the Kubernetes clusters associated with the Project, in the corresponding namespace.
---

Kommander can also deploy services from a catalog of current cloud native services with the push of a button. This helps organizations quickly deploy services to multiple clusters. Governance-based access to data services ensures roles and responsibilities are maintained. Some of these services are Certified services, which means that you can subscribe to support for them from Kommander.

![Project Catalog](/dkp/kommander/1.3/img/project-catalog.png)

Kommander can be extended with the AddonRepository resource that point to git repositories containing application platform services. For example, the kubeaddons-enterprise repo contains platform services such as Jenkins and Kafka with specific settings for each service. Platform services can be composed using either Helm V2 charts or KUDO operators.

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

To deploy a platform service:

1. Select **Workspace** > **Project**
2. Select **View Catalog** to browse the available platform services from your configured repositories.
3. Select your desired platform service.
4. Select the version you'd like to deploy from the version drop-down, and then select Deploy.

For all platform services, you must provide a display name and an ID. The ID will be automatically generated based on what is entered for the display name, unless or until you edit the ID directly. The ID must be compliant with [Kubernetes DNS subdomain name validation rules](https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-subdomain-names).

Optionally, you can customize the [Helm Chart Values](/dkp/kommander/1.3/projects/platform-services/helm-based) or [KUDO Parameters](/dkp/kommander/1.3/projects/platform-services/kudo-based) of a service before deploying it.

Custom Platform Services can be created using [Kubernetes FederatedAddon](/dkp/kommander/1.3/projects/platform-services/helm-based)

After a platform service is deployed in a project, the service is installed to all clusters in that project.
