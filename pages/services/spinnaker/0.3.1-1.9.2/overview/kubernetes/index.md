---
layout: layout.pug
navigationTitle: Kubernetes
excerpt: Using the Kubernetes provider
title: Kubernetes
menuWeight: 9
model: /services/spinnaker/data.yml
render: mustache
---

# Clouddriver configuration

1. In order to target Kubernetes for container delivery you must activate the `Kubernetes configuration` in the `Clouddriver` section of the {{ model.techName }} service. To do this, change the value of `kubernetes.enabled` to `true`.

[<img src="/services/spinnaker/0.3.1-1.9.2/img/kube00.png" />](/mesosphere/dcos/services/spinnaker/0.3.1-1.9.2/img/kube00.png)

Figure 1. Clouddriver configuration screen

2. Also check `kubeconfig secret enabled`. 
3. Use `kubectl` to create the `kubeconfig` and store it in a DC/OS secret named `<{{ model.serviceName }}-service-name>/kubeconfig`.

## Create Server Group

If you have both the provider for DC/OS and Kubernetes enabled, then **Create Service Group** will prompt you to choose between the two.

[<img src="/services/spinnaker/0.3.1-1.9.2/img/kube01.png" />](/mesosphere/dcos/services/spinnaker/0.3.1-1.9.2/img/kube01.png)

Figure 2. Choose Kubernetes or DC/OS

The creation dialog for Kubernetes is straightforward; you simply specify your Kubernetes manifest. In our sample we deliver an `nginx` instance.

[<img src="/services/spinnaker/0.3.1-1.9.2/img/kube02.png" />](/mesosphere/dcos/services/spinnaker/0.3.1-1.9.2/img/kube02.png)

Figure 3. Selecting a manifest image

Since we can deliver to both DC/OS and Kubernetes, a {{ model.techName }} app can have both kinds of server groups.

[<img src="/services/spinnaker/0.3.1-1.9.2/img/kube03.png" />](/mesosphere/dcos/services/spinnaker/0.3.1-1.9.2/img/kube03.png)

Figure 4. DC/OS and Kubernetes accounts

For `pipelines`, there is a deploy stage that lets you specify the Kubernetes manifest as seen here.
