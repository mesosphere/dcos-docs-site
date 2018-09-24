---
layout: layout.pug
navigationTitle: Kubernetes
excerpt: Using the Kubernetes provider
title: Kubernetes
menuWeight: 60
model: /services/spinnaker/data.yml
render: mustache
---

# Using the Kubernets Provider

## Clouddriver configuration

In order to target Kubernetes for container delivery you have to activate the `Kubernetes configuration` in the `Clouddriver` section of the spinnaker service.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/kube00.png" alt="Kubernetes"/>](/services/spinnaker/0.3.0-1.9.2/img/kube00.png)

Also check `kubeconfig secret enabled`. Use kubectl to create the kubeconfig and store it in a DC/OS secret named `<spinnaker-service-name>/kubeconfig`.

## Create Server Group

If you have both the provider for DC/OS and Kubernetes enabled, then `Create Service Group` will prompt you to choose between the two.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/kube01.png" alt="Kubernetes"/>](/services/spinnaker/0.3.0-1.9.2/img/kube01.png)

The creation dialog for Kubernetes is straight forward, you simply specify your `Kuberenetes manifest`. In our sample we deliver an nginx instance.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/kube02.png" alt="Kubernetes"/>](/services/spinnaker/0.3.0-1.9.2/img/kube02.png)

Since we can deliver to DC/OS and Kubernetes a spinnaker app can have both kinds of server groups.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/kube03.png" alt="Kubernetes"/>](/services/spinnaker/0.3.0-1.9.2/img/kube03.png)

For `pipelines` there is a deploy stage that lets you specify the Kubernetes manifest like we seen here.
