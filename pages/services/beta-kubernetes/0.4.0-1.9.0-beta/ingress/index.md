---
layout: layout.pug
navigationTitle:  External Ingress
title: External Ingress
menuWeight: 25
excerpt:
enterprise: false
---

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

To see a working example, use the `kubectl create` command below to deploy Traefik on the public node,
which routes to a set of pods.

If you use the public IP of the public agent, you will see a result similar to this:

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
# Service
apiVersion: v1
kind: Service
metadata:
  name: traefik-ingress-service
spec:
  selector:
    k8s-app: traefik-ingress-lb
  ports:
    - protocol: TCP
      port: 80
      name: web
    - protocol: TCP
      port: 8080
      name: admin
  clusterIP: None
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
to make sure the Ingress controller runs on a DC/OS public agent:

```yaml
      nodeSelector:
        kubernetes.dcos.io/node-type: public
      tolerations:
      - key: "node-type.kubernetes.dcos.io/public"
        operator: "Equal"
        value: "true"
        effect: "NoSchedule"
```

Also, in the deployment example above we set `replicas: 1` but if you want more instances of the
controller to guarante high-availability, you also need to make sure no Ingress controller replica
will be scheduled to the same Kubernetes node where another replica is running already.

The Traefik container(s) act as public load-balancer(s) and will run on any public agents in your
cluster. As such, they are responsible for receiving external requests to your applications. Therefore
you must ensure the appropriate ports are not bound already and not blocked by any existing firewall.
