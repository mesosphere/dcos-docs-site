---
layout: layout.pug
navigationTitle:  External Ingress
title: External Ingress
menuWeight: 20
excerpt:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


## Running an Ingress controller

If you want to expose HTTP/S (L7) apps to the outside world - at least outside the DC/OS cluster -
you should create a [Kubernetes Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress)
resource.
However, in order for the Ingress resource to work, the Kubernetes cluster must have an Ingress
controller running.
By default, this package does not run such controller but we allow you to do it in one of two ways:

- Enable cloud-provider integration - at least public cloud-providers provide their own public
  load-balancing solution and an accompanying Ingress controller. For instance, the AWS cloud-provider
  includes an Ingress controller that manages ELB instances based on your Ingress resources.
- Run an Ingress controller of your choosing - you will need at least one DC/OS public agent
  where to run the Ingress controller.

### Running a custom Ingress controller

There are a few Open-Source Ingress controllers you can choose from:

- [NGINX](https://github.com/kubernetes/ingress-nginx)
- [HAProxy](https://github.com/appscode/voyager)
- [Traefik](https://docs.traefik.io/user-guide/kubernetes/)
- [Envoy](https://github.com/heptio/contour)
- [Istio](https://istio.io/docs/tasks/traffic-management/ingress.html)

To see a working example, use the `kubectl create` command below to deploy Traefik on the public node, which routes to a set of pods.  If you use the public IP of the public agent, you will see a result similar to this:

```
Hello from container: probe-lv29d
Local IP of container: 9.0.8.7
```

```yaml
cat <<EOF | kubectl create -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: probe
spec:
  selector:
    matchLabels:
      app: probe
  replicas: 3
  selector:
    matchLabels:
      app: probe
  template:
    metadata:
      labels:
        app: probe
    spec:
      containers:
      - name: probe
        image: smugcloud/probe
        ports:
        - containerPort: 9000
---
kind: Service
apiVersion: v1
metadata:
  name: probe
spec:
  selector:
    app: probe
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9000


---
# Service Account
apiVersion: v1
kind: ServiceAccount
metadata:
  name: traefik-ingress-controller
---
# Deployment
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: traefik-ingress-controller
  labels:
    k8s-app: traefik-ingress-lb
spec:
  replicas: 1
  selector:
    matchLabels:
      k8s-app: traefik-ingress-lb
  template:
    metadata:
      labels:
        k8s-app: traefik-ingress-lb
        name: traefik-ingress-lb
    spec:
      serviceAccountName: traefik-ingress-controller
      terminationGracePeriodSeconds: 60
      containers:
      - image: traefik
        name: traefik-ingress-lb
        ports:
        - name: web
          containerPort: 80
          hostPort: 80
        args:
        - --web
        - --kubernetes
      nodeSelector:
        kubernetes.dcos.io/node-type: public
      tolerations:
      - key: "node-type.kubernetes.dcos.io/public"
        operator: "Equal"
        value: "true"
        effect: "NoSchedule"
---
#Ingress
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: probe-ingress
spec:
  rules:
  - http:
      paths:
      - path: /
        backend:
          serviceName: probe
          servicePort: 80
EOF
```

The most important part is the Kubernetes node-selector and toleration we set in order
to make sure the Ingress controller runs on a public-agent:

```yaml
      nodeSelector:
        kubernetes.dcos.io/node-type: public
      tolerations:
      - key: "node-type.kubernetes.dcos.io/public"
        operator: "Equal"
        value: "true"
        effect: "NoSchedule"
```

The container receiving the external traffic can be deployed on any node; you should just ensure the appropriate ports are open on that host.  If you do not have a DC/OS public agent, be sure to update the `traefik-ingress-controller` nodeSelector to a node which does have a public IP you can use.
