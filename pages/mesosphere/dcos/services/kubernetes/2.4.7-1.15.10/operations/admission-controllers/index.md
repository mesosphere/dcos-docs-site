---
layout: layout.pug
navigationTitle: Admission Controllers
title: Admission Controllers
menuWeight: 10
excerpt: Using Admission Controllers
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes-cluster -->

# Admission Controllers

An admission controller is a piece of code that intercepts requests to the Kubernetes API server before the persistence of the object, but after the request is authenticated and authorized. See the [Kubernetes Admission Controllers](https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers) for more detail.

DC/OS Kubernetes supports enabling the following admission controllers:

### [AlwaysPullImages](https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)

This admission controller modifies every new Pod to force the image pull policy to Always. This is useful in a multitenant cluster so that users can be assured that their private images can only be used by those who have the credentials to pull them. Without this admission controller, once an image has been pulled to a node, any pod from any user can use it simply by knowing the image’s name (assuming the Pod is scheduled onto the right node), without any authorization check against the image. When this admission controller is enabled, images are always pulled prior to starting containers, which means valid credentials are required.

To enable this admission controller you need to set `.kubernetes.admission_controllers.always_pull_images`.

```json
  {
    "kubernetes": {
      "admission_controllers": {
          "always_pull_images": true
      }
    }
  }
```

### [EventRateLimit](https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/#eventratelimit)

This admission controller mitigates the problem where the API server gets flooded by event requests.

Below is an example EventRateLimit configuration:

```
apiVersion: eventratelimit.admission.k8s.io/v1alpha1
kind: Configuration
limits:
- type: Namespace
  qps: 50
  burst: 100
  cacheSize: 2000
- type: User
  qps: 10
  burst: 50
```

For more details, please refer to the [Kubernetes design proposal](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/admission_control_event_rate_limit.md) of this feature.

To enable the `EventRateLimit` admission controller:

1. Create a file with the above content and name it, for example, `event_rate_limit_config.yaml`.

1. You need to create a DC/OS secret. In this example, we'll create a secret named `kubernetes-cluster/event-rate-limit` using the file created in the above step.

```shell
$ dcos security secrets create -f event_rate_limit_config.yaml kubernetes-cluster/event-rate-limit
```

<p class="message--important"><strong>IMPORTANT: </strong>The service account for the Kubernetes cluster requires permissions to read the secret containing the `EventRateLimit` configuration.</p>

1. You need to set `.kubernetes.admission_controllers.event_rate_limit` with the name of the DC/OS secret where the configuration is stored.

```json
{
    "kubernetes": {
        "admission_controllers": {
            "event_rate_limit": "kubernetes-cluster/event-rate-limit"
        }
    }
}
```
