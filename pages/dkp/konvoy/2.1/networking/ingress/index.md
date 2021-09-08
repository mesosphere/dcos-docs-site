---
layout: layout.pug
navigationTitle: Ingress
title: Ingress
menuWeight: 8
excerpt: Traefik Ingress Controller
beta: false
enterprise: false
---

Kubernetes Ingress resources expose HTTP and HTTPS routes from outside the cluster to services within the cluster.
In Konvoy, the [Traefik][traefik] Ingress controller is installed by default and provides access to the operations portal.

An Ingress performs the following:

- Gives Services externally-reachable URLs
- Load balances traffic
- Terminates SSL/TLS sessions
- Offers name-based virtual hosting

An Ingress controller fulfills the Ingress with a load balancer.

An Ingress does not expose arbitrary ports or protocols.
Exposing services other than HTTP and HTTPS to the Internet typically uses a service of type `Service.Type=NodePort` or `Service.Type=LoadBalancer`.

A cluster can have multiple Ingress controllers.
D2iQ recommends adding your own Ingress controllers for your applications.
The Traefik Ingress controller that Konvoy installs for access to the operations portal can be replaced later if a different solution is a better fit.
Using your own Ingress controller in parallel for your own business requirements ensures that you are are not limited by any future changes in Konvoy.

## Traefik v1.7

Traefik is a modern HTTP reverse proxy and load balancer that deploys microservices with ease.
Konvoy currently installs Traefik v1.7 by default on every cluster.
Traefik creates a service of type `LoadBalancer`.
In the cloud, the cloud provider creates the appropriate load balancer.
In an on-premises deployment, by default, it uses MetalLB.

Traefik listens to the service registry/orchestrator API and automatically generates and updates the routes without any further configuration or intervention so that the microservices are connected to the outside world.
Further, Traefik supports a rich set of functionality such as Name-based routing, Path-based routing, Traffic splitting, etc.
Details of these functionalities can be viewed [here][traefik_fn].

Major features highlighted in the Traefik documentation:

- Continuously updates its configuration (No restarts!)
- Supports multiple load balancing algorithms
- Provides HTTPS to your microservices by leveraging Let's Encrypt (wildcard certificates support)
- Circuit breakers, retry
- A clean web UI
- Websocket, HTTP/2, GRPC ready
- Provides metrics (Rest, Prometheus, Datadog, StatsD, InfluxDB)
- Keeps access logs (JSON, CLF)
- Exposes a Rest API
- Packaged as a single binary file (made with go) and available as a docker image

## Related information

For information on related topics or procedures, refer to the following:

- [List of Ingress controllers](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/)
- [Traefik v1.7 docs](https://doc.traefik.io/traefik/v1.7/)
- [Tutorial: Configure Ingress for load balancing](../use-ingress-load-balancer)
- [Load Balancing](../load-balancing)

[traefik]: https://landscape.cncf.io/card-mode?category=service-proxy&grouping=category&selected=traefik
[traefik_fn]: https://doc.traefik.io/traefik/v1.7/user-guide/kubernetes/
