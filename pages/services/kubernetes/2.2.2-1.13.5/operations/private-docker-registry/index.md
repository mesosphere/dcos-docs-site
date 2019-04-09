---
layout: layout.pug
navigationTitle: Use private Docker registry
title: Use private Docker registry
menuWeight: 79
excerpt: Use private Docker registry
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes-cluster -->

# Deploying a Local Universe

See [Deploying a Local Universe](/1.12/administering-clusters/deploying-a-local-dcos-universe/) for more details on how to configure DC/OS to use a private Docker registry.

# Configure Kubernetes to use private Docker registry

After [configuring DC/OS to use a private Docker registry](/1.12/administering-clusters/deploying-a-local-dcos-universe/), create an `options.json` file, or edit an existing one and enable the `use_agent_docker_certs` setting.

  ```json
  {
    "service": {
      "use_agent_docker_certs": true
    }
  }
  ```
