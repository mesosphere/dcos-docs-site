---
layout: layout.pug
navigationTitle:  Local
title: Local Installation
menuWeight: 5
excerpt:

---

Use the following two tools to automate the local installation of DC/OS for development and testing:

- [DC/OS Vagrant](https://github.com/dcos/dcos-vagrant/) - DC/OS on virtual nodes using Vagrant and VirtualBox
- [DC/OS Docker](https://github.com/dcos/dcos-docker/) - DC/OS on containerized nodes using Docker

 Few reasons to choose DC/OS Vagrant or DC/OS Docker are listed below:

- DC/OS Vagrant works on Windows, Mac, or Linux, while DC/OS Docker requires Mac or Linux.
- DC/OS Docker is substantially faster to deploy (~5 minutes vs ~15 minutes).
- DC/OS Vagrant more accurately simulates a real cluster by designating resources allocated to each node, while DC/OS Docker allows over-subscription of your machine resources.
- DC/OS Docker is more stable across releases, because it only requires Docker, rather than both Vagrant and VirtualBox.


