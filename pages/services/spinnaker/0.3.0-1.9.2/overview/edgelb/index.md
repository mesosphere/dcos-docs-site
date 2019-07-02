---
layout: layout.pug
navigationTitle: Edge-LB
excerpt: Using Edge-LB with server groups
title: Edge-LB
menuWeight: 8
model: /services/spinnaker/data.yml
render: mustache
---

Edge-LB is the load balancer that comes with DC/OS Enterprise. See the DC/OS Enterprise documentation on [how to install Edge-LB](/services/edge-lb/1.3/installing/).

1. Create a `config.yaml` file with the following Edge-LB configuration. This configuration works with the [rolling blue-green](/services/spinnaker/0.3.0-1.9.2/quick-start-guide/pipelines/#creating-a-rolling-blue-green-pipeline) sample.

```yaml
---
pools:
  - name: myapp-prod-pool
    count: 1
    haproxy:
      frontends:
        - bindPort: 80
          protocol: HTTP
          linkBackend:
            defaultBackend: myapp-prod
      backends:
        - name: myapp-prod
          protocol: HTTP
          balance: roundrobin
          servers:
            - type: AGENT_IP
              framework:
                value: marathon
              task:
                value: "^myapp-prod-v[0-9]+\\.my-dcos-account$"
                match: REGEX
              port:
                name: web
```
2. Launch the configuration with the following command:

```bash
dcos edgelb config config.yaml
```

Edge-LB will round-robin over the instances in the server groups of the `myapp-prod` cluster.
