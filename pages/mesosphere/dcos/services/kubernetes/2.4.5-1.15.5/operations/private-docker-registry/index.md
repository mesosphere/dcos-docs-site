---
layout: layout.pug
navigationTitle: Use private Docker registry
title: Use private Docker registry
menuWeight: 79
excerpt: Use private Docker registry
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes-cluster -->

# Configure Kubernetes to use private Docker registry

After [configuring DC/OS to use a private Docker registry](/mesosphere/dcos/2.0/deploying-services/private-docker-registry/), create an `options.json` file, or edit an existing one and enable the `use_agent_docker_certs` setting.

  ```json
  {
    "service": {
      "use_agent_docker_certs": true
    }
  }
  ```
