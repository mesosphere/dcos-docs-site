---
layout: layout.pug
navigationTitle:  Advanced Configuration
title: Advanced Configuration
menuWeight: 15
model: /mesosphere/dcos/2.2/data.yml
render: mustache
excerpt: Configuring your DC/OS using advanced configuration methods
---

This page displays the topics for advanced configuration methods.

The DC/OS configuration parameters are specified in YAML format in a `config.yaml` file. This file is stored on your [bootstrap node](/mesosphere/dcos/{{ model.folder_version }}/installing/production/system-requirements/#bootstrap-node) and is used during DC/OS installation to generate a customized DC/OS build.

**Caution:** If you want to modify the configuration file after installation, you must follow the [DC/OS upgrade process](/mesosphere/dcos/{{ model.folder_version }}/installing/production/upgrading/).
