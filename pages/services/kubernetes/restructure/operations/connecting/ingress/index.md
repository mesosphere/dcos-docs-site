---
layout: layout.pug
navigationTitle: Connecting to Kubernetes Services
title: Connecting to Kubernetes Services
menuWeight: 7
excerpt: Creating an Ingress controller to connect to services on your Kubernetes cluster
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes-cluster -->

# Running an Ingress controller

An Ingress is a collection of rules that allow inbound connections to reach the cluster services.
In order to expose HTTP/S (L7) apps to the outside world - at least outside the DC/OS cluster - one can rely on [Kubernetes `Ingress`](https://kubernetes.io/docs/concepts/services-networking/ingress) resources.
However, simply creating the resource will have no effect. An Ingress controller is needed to satisfy an Ingress.

This package does not install or provide support for any specific Ingress controller, including [the ones listed below](#ingress-controllers). However, it does enable you to install any of your choosing.

In future iterations of DC/OS Kubernetes, we will provide an Ingress controller that integrates with DC/OS.

## Requirements

- The DC/OS cluster needs at least one available public DC/OS agent on which to run a public Kubernetes node.
- The abovementioned DC/OS agent(s) must have no running workloads that reserve and/or bind to ports `80` or `443`.
- The Kubernetes cluster must have at least one public Kubernetes node.

With respect to the second bullet item, it is worth noting that port reservations in DC/OS work on an honor-system basis. This means that there may be workloads running on a public DC/OS agent that actually **bind** to ports `80` and/or `443` without actually **reserving** them. The reverse is also true - for example, DC/OS Kubernetes will **reserve** ports `80` and `443` on all public DC/OS agents where public Kubernetes nodes are deployed so that they can be used for ingress, but won't actually **bind** to them.

Based on your availability needs, it is advised to have multiple public Kubernetes nodes.
In order to specify the number of public Kubernetes nodes, you must set the value of the `kubernetes.public_node_count` option, accordingly:

```json
{
  "kubernetes": {
    "public_node_count": <number of desired Kubernetes nodes>
  }
}
```

<p class="message--important"><strong>IMPORTANT: </STRONG>Make sure to set a value that is less than or equal to the number of public DC/OS agents available. Failing to set this number properly may result in an incomplete Kubernetes cluster install. </p>

<a id="ingress-controllers">

## Some Ingress controllers

Below are listed a few open-source Ingress controllers:

- [Traefik](https://docs.traefik.io/user-guide/kubernetes/)
- [NGINX](https://github.com/kubernetes/ingress-nginx)
- [HAProxy](https://github.com/appscode/voyager)
- [Envoy](https://github.com/heptio/contour)
- [Istio](https://istio.io/docs/tasks/traffic-management/ingress.html)
- [AWS ALB Ingress Controller](https://github.com/coreos/alb-ingress-controller)
- [Google Cloud GLBC](https://github.com/kubernetes/ingress-gce)

Again, this package does not install or provide support for any specific Ingress controller.

It is your responsibility to follow the respective official documentation, and report any issues to the controller authors.

## Using the Traefik Ingress controller

### Installing the Ingress controller

<p class="message--warning"><strong>WARNING: </strong>Mesosphere does not guarantee that these instructions will work for all configurations. For more information, please read <a href="https://docs.traefik.io/user-guide/kubernetes/">the official documentation for Traefik Kubernetes integration</a>.</p>

We will start by deploying the Traefik Ingress controller:

```shell
cat <<EOF | kubectl create -f -
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: traefik-ingress-controller
rules:
  - apiGroups:
      - ""
    resources:
      - services
      - endpoints
      - secrets
    verbs:
      - get
      - list
      - watch
  - apiGroups:
      - extensions
    resources:
      - ingresses
    verbs:
      - get
      - list
      - watch
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: traefik-ingress-controller
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: traefik-ingress-controller
subjects:
- kind: ServiceAccount
  name: traefik-ingress-controller
  namespace: kube-system
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: traefik-ingress-controller
  namespace: kube-system
---
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: traefik-ingress-controller
  namespace: kube-system
  labels:
    k8s-app: traefik-ingress-lb
spec:
  selector:
    matchLabels:
      k8s-app: traefik-ingress-lb
      name: traefik-ingress-lb
  template:
    metadata:
      labels:
        k8s-app: traefik-ingress-lb
        name: traefik-ingress-lb
    spec:
      serviceAccountName: traefik-ingress-controller
      terminationGracePeriodSeconds: 60
      containers:
      - image: traefik:v1.7.2
        name: traefik-ingress-lb
        ports:
        - name: http
          containerPort: 80
          hostPort: 80
        - name: admin
          containerPort: 8080
          hostPort: 8080
        securityContext:
          capabilities:
            drop:
            - ALL
            add:
            - NET_BIND_SERVICE
        args:
        - --api
        - --kubernetes
        - --logLevel=INFO
      nodeSelector:
        kubernetes.dcos.io/node-type: public
      tolerations:
      - key: "node-type.kubernetes.dcos.io/public"
        operator: "Exists"
        effect: "NoSchedule"
EOF
```

Kubernetes will take care of setting up Traefik Ingress controller accordingly:

- Bind each Traefik pod port `TCP 80` port to the agent's network - This is the most straightforward way to expose Traefik, since DC/OS firewall allows incoming traffic on public DC/OS agents' port `TCP 80`. However, you are responsible for making sure that no other application is binding port `TCP 80` port on all public DC/OS agents where public Kubernetes nodes are scheduled onto, risking unpredictable failure.
- Make use of the Kubernetes [`nodeSelector` predicate](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#nodeselector) to force Traefik pods to be scheduled onto public Kubernetes nodes alone.
- Make use of the `node-type.kubernetes.dcos.io/public` [node taint](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/) so that the Traefik pods can actually be scheduled onto the public Kubernetes nodes.

Assuming the Kubernetes cluster has two (2) public nodes, there should be two (2) instances of Traefik running:

```shell
$ kubectl -n kube-system get pods | grep traefik
traefik-ingress-controller-rqgbq                                              1/1       Running   0          7m
traefik-ingress-controller-z8rdb                                              1/1       Running   0          7m
```

### Accessing an Ingress resource

Assuming the Kubernetes cluster only has one (1) single public Kubernetes node on public DC/OS agent `pa`, with public IP `pa-ip`, the Ingress controller will be made accessible at `http://<pa-ip>`.
There's no need to specify the port since the `http://` scheme already translates to `TCP 80`, and the `https://` scheme translates to `TCP 443`.

We will now deploy an application and expose it through an Ingress.

In this example, we will be exposing a simple HTTP server that responds to `GET /` requests with an `Hello from Kubernetes!` message:

```shell
cat <<EOF | kubectl create -f -
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-world
  labels:
    app: hello-world
spec:
  replicas: 2
  selector:
    matchLabels:
      app: hello-world
  template:
    metadata:
      labels:
        app: hello-world
    spec:
      containers:
      - name: echo-server
        image: hashicorp/http-echo
        args:
        - -listen=:80
        - -text="Hello from Kubernetes!"
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: hello-world
spec:
  selector:
    app: hello-world
  ports:
    - port: 80
      targetPort: 80
---
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  annotations:
    kubernetes.io/ingress.class: traefik
  name: hello-world
spec:
  rules:
  - http:
      paths:
      - path: /
        backend:
          serviceName: hello-world
          servicePort: 80
EOF
```

Notice the `kubernetes.io/ingress.class` annotation — that is how you specify the Ingress controller that will be responsible for satisfying an Ingress.
This annotation may be optional.

Once you have created this resource, open a browser and navigate to:

```
http://<pa-ip>
```

The visible result should be  the `Hello from Kubernetes!` message, meaning that the Ingress has been successfully satisfied by Traefik.
