---
layout: layout.pug
navigationTitle:  Local
title: Install DC/OS Locally
menuWeight: 2
excerpt: Automating local installation of DC/OS for development and testing
enterprise: true
---

Two tools automate the local installation of DC/OS for development and testing:

- [DC/OS Vagrant](https://github.com/dcos/dcos-vagrant/) - DC/OS on virtual nodes using Vagrant and VirtualBox
- [DC/OS Docker](https://github.com/dcos/dcos-docker/) - DC/OS on containerized nodes using Docker

There are several reasons why you might choose one over the other:

- DC/OS Vagrant works on Windows, Mac, or Linux, while DC/OS Docker requires Mac or Linux.
- DC/OS Docker is substantially faster to deploy (~5 minutes vs ~15 minutes).
- DC/OS Vagrant more accurately simulates a real cluster by designating resources allocated to each node, while DC/OS Docker allows over-subscription of you machine resources.
- DC/OS Docker is more stable across releases, because it only requires Docker, rather than both Vagrant and VirtualBox.

To use DC/OS Enterprise with either tool, contact your sales representative or <a href="mailto:sales@mesosphere.com">sales@mesosphere.com</a> to obtain this DC/OS Enterprise Installer.
