---
layout: layout.pug
navigationTitle:  Uninstalling the CLI
title: Uninstalling the CLI
menuWeight: 4
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


You can uninstall the CLI with these commands.

1. Delete your DC/OS CLI installation directory.
1. Delete the hidden `.dcos` directory. This will delete the configuration files for your DC/OS services. By default, this directory is located in your home directory. For example, `/Users/<your username>/.dcos/` on macOS or `C:\Users\<your username>\.dcos` on Windows.
