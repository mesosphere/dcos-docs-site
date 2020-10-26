---
layout: layout.pug
navigationTitle:  Configure Canary Deployments
title: Canary deployments
menuWeight: 40
beta: false
excerpt: How to configure canary deployment for your application
---

# Canary deployment

In this tutorial we will extend our hello-world application to use canary deployment.

Canary deployment is a deployment strategy where a new version of an application (called the canary) is deployed alongside the existing version (called the primary). The Canary deployment is subjected to tests that check various metrics to determine application health. As the tests pass, more and more traffic is routed to the Canary, until finally the Canary is promoted to be the new primary, and the old primary is scaled down and terminated.

This tutorial leverages [Flagger](https://docs.flagger.app/) to manage canary deployment.

## Prerequisites

### hello-world application

This tutorial assumes that you followed the [Setting up a Repository in Dispatch](../../ci_tutorials/repo-setup/), and the [GitOps Based Deployments](../rolling-deployment/) tutorials and now have an application configured for CI and CD using GitOps.

### Istio

Flagger integrates with various service meshes: Istio, Linkerd, App Mesh, etc. For this tutorial we use Istio as our service mesh.

If you are running on Konvoy you can enable the `istio` kubeaddon in your `cluster.yaml` file. If you are running on a different Kubernetes distribution and installed Istio yourself, or you are using Flagger with a different service mesh, you must modify the configuration and steps in this tutorial. In general the steps should be quite similar, but there will be many differences in
the details.

To enable the `istio` kubeaddon, modify the Addon list in your `cluster.yaml` file as follows:

```yaml
- name: istio
  enabled: true
```

You can then deploy the `istio` kubeaddon by running `konvoy up`.

### Flagger

If you are running on Konvoy you can enable the `flagger` kubeaddon in your `cluster.yaml` file. If you are running on a different Kubernetes distribution and installed Flagger yourself, you must modify some of the configuration below, but the changes should be minimal.

You must have the `istio` kubeaddon enabled in addition to the `flagger` kubeaddon. Modify the addon list in your `cluster.yaml` file as follows:

```yaml
- name: flagger
  enabled: true
- name: istio
  enabled: true
```

You can then deploy the `flagger` and `istio` kubeaddons by running `konvoy up`.

### Label the target namespace

In order for your application networking to be managed by Istio, you must apply the following labels to the namespace in which your application will be deployed:

* `istio-injection: enabled` enables service mesh sidecar injection into all pods created in the namespace.
* `ca.istio.io/override: "true"` enables mutual TLS (mTLS) between pods in the namespace.

Assuming you are deploying your applications into the `default` namespace, you can add these labels to it by running:

```bash
kubectl label ns default istio-injection=enabled
kubectl label ns default ca.istio.io/override="true"
```

## Configuring Canary deployment

Currently, the hello-world application's GitOps repository contains the following manifests:

* **hello-world Deployment**: specifies that one or more replicas of a specific docker image should be running on the cluster.
* **hello-world Service**: specifies which ports are exposed by the application.
* **hello-world Ingress**: specifies how traffic from outside the cluster is routed to the hello-world Service.

We will make various changes in the process of switching our application to Flagger and Istio.

### Create a horizontal pod autoscaler (HPA)

To allow Flagger to scale the number of pods running the old and new versions of our application, we create a horizontal pod autoscaler (HPA) to control the number of replicas in our Deployment.

Add an HPA by adding the following manifest to your GitOps repository:

```yaml
apiVersion: autoscaling/v1
kind: HorizontalPodAutoscaler
metadata:
  name: hello-world
  namespace: default
spec:
  maxReplicas: 4
  minReplicas: 2
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: hello-world
  targetCPUUtilizationPercentage: 99
```

You can save this manifest as a new file called `hpa.yaml`.

Next, we must remove the `replicas:` property from our Deployment as the number of replicas is now controlled by the HPA.

Remove the `replicas: 5` line from your Deployment in your `application.yaml.tmpl` and `application.yaml` files.

Add the new `hpa.yaml` to your GitOps repository and commit it, along with your changes to the `application.yaml.tmpl` and `application.yaml` files, then push those changes to GitHub.

### Create an Istio Gateway

We must inform Istio that our application is accepting traffic. We do that by creating a Gateway object.

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: public-gateway
  namespace: istio-system
spec:
  selector:
    istio: ingressgateway
  servers:
  - hosts:
    - '*'
    port:
      name: http
      number: 80
      protocol: HTTP
```

Add this manifest as `gateway.yaml` to your GitOps repository.

The Istio ingress gateway is allocated its own external-facing load balancer (ELB), a fully-qualified domain name at which it can be reached. The new Gateway resource we added configures Istio to send all HTTP traffic to our application by specifying `hosts: ['*']`. Istio supports advanced customization (such as TLS, hostname-based routing, etc.) but doing so falls outside the scope of this document.

Add the new `gateway.yaml` file to your GitOps repository, commit it, then push the changes to GitHub.

### Create the Canary resource

Flagger performs progressive delivery and traffic routing between the new Canary deployment and the existing primary deployment as configured by the Flagger Canary resource. The Canary resource spec has a couple of important sections (See [the Flagger documentation](https://docs.flagger.app/how-it-works#canary-deployment)):

* `autoscalerRef` declares an HPA to use for scaling the primary and Canary deployments.

* `service` is used to create an Istio  VirtualService  that is used to control traffic routing between the primary and Canary deployments.

* `targetRef` is used to describe  the Deployment that this Canary manages.

* `canaryAnalysis` describes how the Canary deployment should be performed: how the Canary's health is checked, how much and how quickly traffic should be shifted from the primary to the Canary, whether to await final approval from a human before promoting a Canary, etc.

Add the following Canary resource to your GitOps repository:

```yaml
apiVersion: flagger.app/v1alpha3
kind: Canary
metadata:
  name: hello-world
  namespace: default
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: hello-world
  autoscalerRef:
    apiVersion: autoscaling/v2beta1
    kind: HorizontalPodAutoscaler
    name: hello-world
  service:
    gateways:
    - public-gateway.istio-system.svc.cluster.local
    hosts:
    - '*'
    port: 80
    retries:
      attempts: 3
      perTryTimeout: 1s
      retryOn: gateway-error,connect-failure,refused-stream
    targetPort: 8080
    trafficPolicy:
      tls:
        mode: ISTIO_MUTUAL
  progressDeadlineSeconds: 60
  canaryAnalysis:
    interval: 1m
    maxWeight: 50
    metrics:
    - interval: 1m
      name: request-success-rate
      threshold: 99
    - interval: 30s
      name: request-duration
      threshold: 500
    stepWeight: 10
    threshold: 5
    webhooks:
    - metadata:
        cmd: hey -z 1m -q 10 -c 2 http://hello-world-canary.default:80/
      name: load-test
      timeout: 5s
      url: http://flagger-loadtester.kubeaddons-flagger/
```

Save that as a file called `canary.yaml`.

There's a lot here, let's unpack it one section at a time.

```yaml
apiVersion: flagger.app/v1alpha3
kind: Canary
metadata:
  name: hello-world
  namespace: default
...
```

That's simple enough, we are creating a Flagger  Canary  resource called "hello-world" in the "default" namespace.

```yaml
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: hello-world
...
...
```

The `targetRef` specifies which Deployment to monitor for changes so that a canary deployment can be triggered. Here we specify our "hello-world" Deployment.

```yaml
  autoscalerRef:
    apiVersion: autoscaling/v2beta1
    kind: HorizontalPodAutoscaler
    name: hello-world
...
```

The `autoscalerRef` specifies which HPA to use to scale the primary Deployment. Here we specify that it should use the new `hello-world` HPA that we created above. Flagger will automatically create a second HPA called `hello-world-canary` to manage scaling of the Canary.

```yaml
  service:
    gateways:
    - public-gateway.istio-system.svc.cluster.local
    hosts:
    - '*'
    port: 80
    retries:
      attempts: 3
      perTryTimeout: 1s
      retryOn: gateway-error,connect-failure,refused-stream
    targetPort: 8080
    trafficPolicy:
      tls:
        mode: ISTIO_MUTUAL
...
```

The `service` section is used to create an Istio  VirtualService  resource. Going from the top, we specify that the  VirtualService  should accept traffic as directed by the `public-gateway` Gateway resource that we created earlier.

The  VirtualService  accepts all traffic arriving at port 80, regardless of what the destination host is.

If requests to our application fail, retry them up to 3 times with a 1 second timeout per request. Retry on gateway errors, connection failures, or connection refused errors.

Forward all requests arriving at port 80 to port 8080 of our application.

Finally, enable mutual TLS between components. Istio on Konvoy enables mutual TLS between endpoints in the service mesh.

```yaml
  canaryAnalysis:
    interval: 1m
    maxWeight: 50
    metrics:
    - interval: 1m
      name: request-success-rate
      threshold: 99
    - interval: 30s
      name: request-duration
      threshold: 500
    stepWeight: 10
    threshold: 5
    webhooks:
    - metadata:
        cmd: hey -z 1m -q 10 -c 2 http://hello-world-canary.default:80/
      name: load-test
      timeout: 5s
      url: http://flagger-loadtester.kubeaddons-flagger/
...
```

The `canaryAnalysis` section is used to configure Flagger's canary deployment behaviour.

* `interval: 1m` the interval at which the Canary deployment should proceed to between steps.
* `maxWeight: 50` the percentage of traffic whereafter the canary deployment, if it still passes its tests, is promoted to primary.
* `metrics`: various metrics that must succeed at every step for the Canary to progress to the next step.
* `stepWeight`: the percentage of traffic that is routed from the primary to the Canary at every step.
* `threshold:` maximum number of failed metric checks before the Canary is rolled back.
* `webhooks`: describes tests that must be performed at every step. In this case, we send a request to the Flagger loadtester tool that instructs it to send artificial traffic to our Canary deployment. This generates metrics which are then used in our `metrics` section to determine application health.

This  Canary  is a simple example. Have a look at the [Flagger documentation](https://docs.flagger.app/usage/progressive-delivery) for more information on how to configure a Canary release.

Now that our application's traffic is managed by Istio, we no longer need the  hello-world Service  and  hello-world Ingress  resources. Remove them from your `application.yaml` and `application.yaml.tmpl`.

Add the new `canary.yaml` file, along with the modifications to your `application.yaml.tmpl` and `application.yaml` files, to your GitOps repository. Commit these changes then push them to GitHub.

Delete the  hello-world Service  and  hello-world Ingress  as follows:

```bash
kubectl delete service hello-world
kubectl delete ingress hello-world
```

## Viewing the application

You can wait for the changes to finish deploying by watching the hello-world application in the ArgoCD UI. Once the deployment settles down, we can open up our application UI.

Before switching to Istio, the hello-world application was reachable at the main cluster URL, at the "/hello-world" endpoint.

Now that we have switched to serving our application using Istio, our application is no longer available at that URL. Instead, it is reachable at the Istio ingressgateway's own ELB.

You can find the hostname at which Istio listens by running:

```bash
kubectl -n istio-system get svc istio-ingressgateway
```

Copy the `EXTERNAL-IP` field and open it in your browser; you should see your application's web page displayed.

## Performing a Canary deployment

Now that the  Canary  is configured, we are ready to trigger a Canary deployment of our application.

We trigger a new Canary by modifying our `hello-world` Deployment. We do so by following the normal Dispatch CI/CD workflow for the repository.

Follow these steps:

1. Modify the `main.go` file in your hello-world application's git repo. Edit the   message in the last `fmt.Fprintf` at the very bottom of the file.
1. Commit the change to a feature branch, push it, and create a pull request.
1. After your pull request passes CI and has the necessary number of approvals, merge it to `master`.
1. This triggers another round of CI, which you can watch on the PipelineRuns page of the Tekton dashboard hosted at `/dispatch/tekton/`.
1. As the final step of that CI run, a new pull request is opened against the GitOps repository at [https://github.com/your-user/cicd-hello-world-gitops](https://github.com/your-user/cicd-hello-world-gitops).
1. Review and merge that pull request.
1. Navigate to the Argo CD UI at `/dispatch/argo-cd`, then click the hello-world application and hit `Refresh`. This triggers deployment of the latest Docker image.

If you watch the `hello-world` Deployment you'll notice that the image has been updated. This will trigger Flagger to scale up a pods for the Canary deployment. You can follow the progress from the Events tab of the `hello-world` Canary in
the ArgoCD UI, as well as by watching the Flagger logs as follows:

```bash
kubectl -n kubeaddons-flagger logs -l app.kubernetes.io/name=flagger -c flagger
```

You'll see that after a few seconds Flagger detects that the `hello-world` Deployment was modified, and begins to deploy a new version of the application.

It will scale up the new version, point the Flagger loadtester at the Canary pods, measure traffic to those pods for request success rate and duration, and increase the proportion of traffic routed to the Canary by 10% every minute.

Finally, after 5 minutes traffic reaches 50% and the Canary is promoted to primary. The old pods are then terminated.

The ArgoCD UI is a great place to observe these changes as they occur. If you watch the `hello-world` VirtualService, you will notice that every minute the traffic weights are updated as more traffic is routed from the primary to the canary.

You can also watch the Istio Canary dashboard in Grafana. The dashboard shows all Canary deployments throughout all namespaces.
