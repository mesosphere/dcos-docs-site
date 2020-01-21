---
layout: layout.pug
navigationTitle: Wallarm
title: Wallarm
excerpt: Wallarm Advaced Cloud-Native Web Applicaton Firewall
menuWeight: 150
category: Networking and Security
image: img/wallarm.png
---
# Wallarm

Wallarm is a DevOps-friendly Web Application Firewall (WAF) uniquely suited to protect your cloud applications and APIs. Wallarm installs natively in Kubernetes environment.

## Quick Start

### Prerequisites

1. [Sign up](https://my.wallarm.com/signup) for a Wallarm account.

1. Add the Wallarm helm chart repository.

    ```sh
    helm repo add wallarm https://repo.wallarm.com/charts/stable
    helm repo update
    ```

### Install The Wallarm Ingress Controller (nginx + Wallarm WAF)

1. In the Wallarm cloud console [create a new node](https://my.wallarm.com/nodes) of type `cloud`. 

1. Copy the nodes token, since you will need that in the next step.

1. Install the ingress controller.

    ```sh
    helm install wallarm/wallarm-ingress -n ingress-controller --set controller.wallarm.token=<CLOUD NODE TOKEN> --set controller.wallarm.enabled=true
    ```


Wallarm can be configured through `helm values`; you can find the [options](https://github.com/wallarm/ingress-chart/tree/master/wallarm-ingress#configuration) here.

### Create An Ingress Route

1. Create an ingress rule that exposes the `http-echo-service`.

    ```sh
    cat <<EOF | kubectl apply -f -
    apiVersion: extensions/v1beta1
    kind: Ingress
    metadata:
      name: nginx-ingress
      annotations:
        kubernetes.io/ingress.class: nginx  
    spec:
      rules:
        - http:
            paths:
              - path: /
                backend:
                  serviceName: http-echo-service
                  servicePort: 80

    ---
    apiVersion: v1
    kind: Service
    metadata:
      name: http-echo-service
    spec:
      ports:
        - port: 80
          targetPort: 5678
          name: web
      selector:
        app: http-echo

    ---
    apiVersion: v1
    kind: Pod
    metadata:
      name: http-echo
      labels:
        app: http-echo
    spec:
      containers:
        - name: http-echo
          image: hashicorp/http-echo
          args: ['-text="hello world"']
          ports:
            - containerPort: 5678
              name: web
    EOF
    ```

1. Enable traffic analysis for the ingress.

    ```sh
    kubectl annotate ingress nginx-ingress nginx.ingress.kubernetes.io/wallarm-mode=monitoring
    kubectl annotate ingress nginx-ingress nginx.ingress.kubernetes.io/wallarm-instance=1
    ```

### Delete The Ingress Controller

Delete the ingress controller.

```sh
helm delete --purge ingress-controller
```


## Documentation

* [Wallarm ingress controller](https://docs.wallarm.com/en/admin-en/installation-kubernetes-en.html)
* [Wallarm ingress controller configuration options](https://github.com/wallarm/ingress-chart/tree/master/wallarm-ingress#configuration)
* [Wallarm](https://docs.wallarm.com/en/)

### Release Notes

* [v2.12](https://docs.wallarm.com/en/release-notes-en/relnotes-en_v2.12.html)
* [v2.10](https://docs.wallarm.com/en/release-notes-en/relnotes-en_v2.10.html)
* [v2.8](https://docs.wallarm.com/en/release-notes-en/relnotes-en_v2.8.html)

### Licensing

* [Terms of Service](https://wallarm.com/terms-of-services)

### Maintenance & Support

* <support@wallarm.com>
