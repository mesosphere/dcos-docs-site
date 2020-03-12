---
layout: layout.pug
navigationTitle: Edge-LB Command Line Interface (CLI)
title: Edge-LB Command Line Interface (CLI)
menuWeight: 82
excerpt: Provides usage and reference information for Edge-LB commands
enterprise: true
---

You can use the Edge-LB command-line interface (CLI) commands and subcommands to configure and manage your Edge-LB load balancer instances programmatically or from a shell terminal.

## Adding the Edge-LB command-line interface package
In most cases, you add the Edge-LB command-line interface (CLI) as part of your initial installation of the Edge-LB API server and Edge-LB pool packages when you are preparing to deploy Edge-LB load balancing. However, one of the key benefits of running containerized services is that they can be placed anywhere in the cluster.

Since you can deploy packages anywhere on the cluster, you might find that you need to install the Edge-LB command-line interface (CLI) on additional computers for other administrators. To simplify access to the Edge-LB command-line programs, you can install the CLI as a separate package by running the command:

```bash
dcos package install --cli edgelb --yes
```

After the CLI package is installed, you can use the Edge-LB commands to manage Edge-LB load balancer pools and load balancing activity.
