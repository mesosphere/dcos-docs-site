---
layout: layout.pug
excerpt:
title: Custom Installation
navigationTitle: Custom Installation
menuWeight: 5
---

You can install DC/OS on bare metal, virtual machines and every cloud. With the custom installers, you have the flexibility to configure each installation of DC/OS exactly how you like it.


# CLI

For those who'd like a little bit more opportunity to configure things, the CLI installer is a great choice. It can take care of installing all the system requirements, just like the GUI installer. The advantage is that you're able to pick more options as to exactly how your cluster is configured. An example of this would be the storage Exhibitor uses to bootstrap.

- [CLI DC/OS Installation Guide][1]

# Advanced

When you're ready to integrate DC/OS with your configuration management tools or create an image to roll out datacenter wide, the advanced installer is for you. This method provides you with all the flexibility you need to pick the actual installation process, every configuration option available and a simple way to consistently add agents to the cluster on a regular basis.

- [Advanced DC/OS Installation Guide][2]


[1]: cli/
[2]: advanced/
