---
layout: layout.pug
excerpt:
title: Install DC/OS Locally
navigationTitle: Local
menuWeight: 2
oss: true
---

Two tools automate the local installation of DC/OS for development and testing:

- [DC/OS Vagrant](https://github.com/dcos/dcos-vagrant/) - DC/OS on virtual nodes using Vagrant and VirtualBox
- [DC/OS Docker](https://github.com/dcos/dcos-docker/) - DC/OS on containerized nodes using Docker

There are several reasons why you might choose one over the other:

- DC/OS Vagrant works on Windows, Mac, or Linux, while DC/OS Docker requires Mac or Linux.
- DC/OS Docker is substantially faster to deploy (~5 minutes vs ~15 minutes).
- DC/OS Vagrant more accurately simulates a real cluster by designating resources allocated to each node, while DC/OS Docker allows over-subscription of you machine resources.
- DC/OS Docker is more stable across releases, because it only requires Docker, rather than both Vagrant and VirtualBox.
