---
layout: layout.pug
navigationTitle: External Ingress
title: External Ingress
menuWeight: 90
excerpt:
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


## Running an ingress controller

If you want to expose HTTP/S (L7) apps to the outside world - at least outside
the DC/OS cluster - you should create a
[Kubernetes `Ingress`](https://kubernetes.io/docs/concepts/services-networking/ingress)
resource. However, in order for the Ingress resource to work, the Kubernetes
cluster must have a _custom ingress controller_ running. This package does not
install such a controller by default, but gives you the freedom of choice to
install an ingress controller by default.

You need at least one DC/OS public agent where the custom ingress controller can
run. Before installing the Kubernetes package, make sure you have enough public
agents to meet your availabilty needs, and set the value of the
`kubernetes.public_node_count` package option accordingly:

```
{
  (...)
  "kubernetes": {
    (...)
    "public_node_count": 3
    (...)
  }
  (...)
}
(...)
```

Please make sure to set a value of `kubernetes.public_node_count` that is less
than or equal to the number of public agents in your cluster. If you set a
higher value the framework will fail to install.

### Open-source ingress controllers

There are a few open-source, cloud-agnostic ingress controllers you can choose
from:

* [Traefik](https://docs.traefik.io/user-guide/kubernetes/)
* [NGINX](https://github.com/kubernetes/ingress-nginx)
* [HAProxy](https://github.com/appscode/voyager)
* [Envoy](https://github.com/heptio/contour)
* [Istio](https://istio.io/docs/tasks/traffic-management/ingress.html)

If you are running on AWS and want to integrate with
[Amazon ELB](https://aws.amazon.com/documentation/elastic-load-balancing/) the
following project may be an option:

* [ALB Ingress Controller](https://github.com/coreos/alb-ingress-controller)

#### Example: using the Traefik ingress controller

We will now walk you through the steps necessary to publicly expose a service
running in the Kubernetes cluster using Traefik as the custom ingress
controller. The first step should be to deploy the ingress controller itself:

```yaml
---
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1beta1
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
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1beta1
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
kind: Deployment
apiVersion: apps/v1
metadata:
  name: traefik-ingress-controller
  namespace: kube-system
  labels:
    k8s-app: traefik-ingress-controller
spec:
  replicas: 1
  selector:
    matchLabels:
      k8s-app: traefik-ingress-controller
  template:
    metadata:
      labels:
        k8s-app: traefik-ingress-controller
        name: traefik-ingress-controller
    spec:
      serviceAccountName: traefik-ingress-controller
      terminationGracePeriodSeconds: 60
      containers:
      - image: traefik:v1.6.4-alpine
        name: traefik-ingress-controller
        args:
        - --api
        - --kubernetes
        - --logLevel=INFO
# NOTE: What follows are necessary additions to
# https://docs.traefik.io/user-guide/kubernetes
# Please check below for a detailed explanation
        ports:
        - containerPort: 80
          hostPort: 80
          name: http
          protocol: TCP
        - containerPort: 8080
          name: admin
          protocol: TCP
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: k8s-app
                operator: In
                values:
                - traefik-ingress-lb
            topologyKey: "kubernetes.io/hostname"
      nodeSelector:
        kubernetes.dcos.io/node-type: public
      tolerations:
      - key: "node-type.kubernetes.dcos.io/public"
        operator: "Exists"
        effect: "NoSchedule"
```

Creating these resources will cause Traefik to be deployed as an ingress
controller in your cluster. We have made some additions to the
[official manifests](https://docs.traefik.io/user-guide/kubernetes) so that the
deployment works as expected:

* Bind each pod's `:80` port to the host's `:80` port. This is the easiest way
  to expose the ingress controller on the public node as DC/OS already opens up
  the `:80` port on public agents. However, when using `hostPort` you are
  responsible for making sure that no other application (either
  in-cluster or even outside DC/OS) is using the `:80` port on every public
  agent. Kubernetes won't be able to schedule pods on a particular agent if the
  port is already being used.
* Make use of pod anti-affinity to ensure that pods are spread among available
  public agents in order to ensure high-availability. This is somewhat redundant
  when using `hostPort` as described above, but it may be useful when exposing
  the controller using a different method (see below).
* Make use of the `nodeSelector` constraint to force pods to be scheduled on
  public nodes only.
* Make use of the `node-type.kubernetes.dcos.io/public` node taint so that the
  pods can actually run on the public nodes.

Assuming you have a single public agent with IP `<public-agent-ip>` in your
cluster the ingress controller will be made accessible at
`http://<public-agent-ip>`. If you have `N` public agents we recommend that
you set `.spec.replicas` equal to `N` in the example above. Just like in the
scenario when there is a single public agent, the ingress controller will be
made accessible in every agent's `:80` port.

As mentioned above, using `hostPort` has the disadvantage of making the
deployment susceptible to port collision. If you want to play on the safe side
you can delete the `.spec.spec.ports` field in the deployment above and use a
`NodePort`-type `Service` to expose the ingress controller instead:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: traefik-ingress-controller
  namespace: kube-system
spec:
  selector:
    k8s-app: traefik-ingress-controller
  ports:
    - port: 80
      name: http
  type: NodePort
```

Creating the `Service` object above will cause the Kubernetes master to allocate
a port from a flag-configured range (`:30000` to `:32767`), and each node will
proxy that port into the ingress controller. The resulting port will be reported
in the `Service`’s `spec.ports[0].nodePort` field. If you want to use a specific
port number you may add a `nodePort` field to `.spec.ports[0]` manually. In any
case, take note of the resulting `nodePort` using

```shell
$ kubectl -n kube-system describe svc traefik-ingress-controller | grep NodePort
Type:                     NodePort
NodePort:                 http  <node-port>/TCP
```

and make sure to setup firewall rules so that the `:<node-port>` port in every
public agent can be reached from `0.0.0.0/0`—or, alternatively, from a
restricted set of well-known IPs or ranges which must have access to the
services you will be exposing via ingress. For example, if you are running
Kubernetes on AWS you may use the following command to set these firewall rules
up:

```shell
$ aws ec2 authorize-security-group-ingress \
    --group-id "<security-group-id>" \
    --protocol tcp \
    --port "30000-32767" \
    --cidr "0.0.0.0/0" \
    --region "<region>"
```

When running the command above you must replace `<security-group-id>` with the
ID of the security group that governs access to the public agents in your DC/OS
cluster, and `<region>` with the region where your cluster is deployed. Please
note, however, that this rule may be too permissive. You are strongly encouraged
to setup the most restrictive set of firewall rules that works in your scenario.

Once the firewall rules are in place you will be ready to deploy an application
and expose it to the Internet. In this example we will be exposing a simple HTTP
server that responds to `GET /` requests with an "Hello world!" message. Create
the following objects using `kubectl`:

```yaml
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
```

Now, create an `Ingress` object that will expose the `hello-world` service:

```yaml
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
```

Notice the `kubernetes.io/ingress.class` annotation — that is how you specify
the ingress controller that will be responsible for satisfying this ingress.
Once you have created this resource, open a browser and navigate to

```
http://<public-agent-ip>/
```

or

```
http://<public-agent-ip>:<node-port>/
```

depending on the option you chose above (`hostPort` vs `nodePort`). You should
be able to see the `Hello from Kubernetes!` message, meaning that the ingress
has been successfully created and Traefik is exposing your service to the
Internet. If you cannot see the message make sure you have setup the adequate
firewall rules as described above.
