---
layout: layout.pug
navigationTitle: Wallarm
title: Wallarm
excerpt: Wallarm the Next Generation Web Applicaton Firewall
menuWeight: 150
category: Networking and Security
image: img/wallarm.png
---

Wallarm is a DevOps-friendly Web Application Firewall (WAF) uniquely suited to protect your cloud applications and APIs.

## quick start

### prerequisites

First things first you need to [signup](https://my.wallarm.com/signup) for a Wallarm account.

Next add the Wallarm helm chart repository.

```sh
helm repo add wallarm https://repo.wallarm.com/charts/stable
helm repo update
```

### install the Wallarm ingress controller (nginx + Wallarm WAF)

In the Wallarm cloud console [create a new node](https://my.wallarm.com/nodes) of type `cloud`, copy the nodes token since you will need that in the next step.

Install the ingress controller.

```sh
helm install wallarm/wallarm-ingress -n ingress-controller --set controller.wallarm.token=<CLOUD NODE TOKEN> --set controller.wallarm.enabled=true
```

Wallarm can be configured through `helm values`, here are the [options](https://github.com/wallarm/ingress-chart/tree/master/wallarm-ingress#configuration).

### create an ingress route

Create an Ingress rule that exposes the `http-echo-service`.

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

Next enable traffic analysis for the ingress.

```sh
kubectl annotate ingress nginx-ingress nginx.ingress.kubernetes.io/wallarm-mode=monitoring
kubectl annotate ingress nginx-ingress nginx.ingress.kubernetes.io/wallarm-instance=1
```

### delete the ingress controller

Delete the ingress controller.

```sh
helm delete --purge ingress-controller
```


## information

#### documentation

* [wallarm ingress controller](https://docs.wallarm.com/en/admin-en/installation-kubernetes-en.html)
* [wallarm ingress controller configuration options](https://github.com/wallarm/ingress-chart/tree/master/wallarm-ingress#configuration)
* [wallarm](https://docs.wallarm.com/en/)

#### release notes

* [v2.12](https://docs.wallarm.com/en/release-notes-en/relnotes-en_v2.12.html)
* [v2.10](https://docs.wallarm.com/en/release-notes-en/relnotes-en_v2.10.html)
* [v2.8](https://docs.wallarm.com/en/release-notes-en/relnotes-en_v2.8.html)

#### license

* [Terms of Service](https://wallarm.com/terms-of-services)

#### maintenance & support

* <support@wallarm.com>
