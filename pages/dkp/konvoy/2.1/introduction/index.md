---
layout: layout.pug
navigationTitle: Introduction
title: Introducing Konvoy
excerpt: Deploy Kubernetes with Konvoy
beta: false
menuWeight: 20
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

Konvoy, combined with Kommander, makes up the D2iQ Kubernetes Platform (DKP) which provides an out-of-the-box production-ready ecosystem with a complement of best-in-class applications to provide all the essential tools needed for day two operations.

Konvoy is the Kubernetes installer component of DKP that uses industry standard tools to produce a certified Kubernetes cluster under many cloud providers as well as on premises.

[Kommander][kommander] provides a command center and applications for all your cloud native management needs in public Information as a Service (IaaS), on-premises, and edge environments.
Kommander provides a multi-tenant experience to secure, and configure Kubernetes clusters and cloud native workloads.
Additionally, Kommander enables teams to unlock federation and cost management, across multiple clusters.

# Features and functionality

- Industry standard

  Konvoy combines standard tools, developed by the Kubernetes community, to install [CNCF][cncf]-certified, high-availability Kubernetes on public clouds or internal on-prem networks.

- Infrastructure provisioning

  Konvoy provisions the cluster infrastructure using the [Cluster-API][cluster-api] standard community developed tooling.

- Core applications for networking and storage production-readiness

    Konvoy installs and enables a default set of core applications to provide the most common features required to run the Kubernetes cluster in production, including the following:

  - Calico (Network overlay)
  - Container Storage Interface (CSI) drivers and configuration required for the specific infrastructure (default)

# Benefits

Konvoy offers the following key benefits:

- Provides a simple and flexible platform to build applications.
- Combines multiple industry standard tools into one convenient command to work with all your infrastructure needs.
- Reduces the time, expertise, cost, and resources required to build and deploy Kubernetes.

[cluster-api]: https://cluster-api.sigs.k8s.io
[cncf]: https://www.cncf.io
[kommander]: https://docs.d2iq.com/dkp/kommander/
