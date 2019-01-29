---
layout: layout.pug
navigationTitle:  Local
title: Local
menuWeight: 3
excerpt:

enterprise: true
---





This installation method uses Vagrant to create a cluster of virtual machines on your local machine that can be used for demos, development, and testing with DC/OS.

## System requirements

### Hardware
Minimum 5 GB of memory to run DC/OS.

### Software
- [DC/OS Enterprise setup file](https://support.mesosphere.com/hc/en-us/articles/213198586-Mesosphere-Enterprise-DC-OS-Downloads). Contact your sales representative or <a href="mailto:sales@mesosphere.com">sales@mesosphere.com</a> for access to this file.
- DC/OS Vagrant. The installation and usage instructions are maintained in the [dcos-vagrant](https://github.com/dcos/dcos-vagrant/) GitHub repository. Follow the deploy instructions to set up your host machine correctly and to install DC/OS.

    - For the latest bug fixes, use the [master branch](https://github.com/dcos/dcos-vagrant/).
    - For increased stability, use the [latest official release](https://github.com/dcos/dcos-vagrant/releases/latest/).
    - For older releases on DC/OS, you may need to download an [older release of DC/OS Vagrant](https://github.com/dcos/dcos-vagrant/releases/).
