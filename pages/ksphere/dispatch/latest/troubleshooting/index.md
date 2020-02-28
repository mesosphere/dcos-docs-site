---
layout: layout.pug
navigationTitle:  Troubleshooting
title: Troubleshooting
menuWeight: 90
beta: false
excerpt: Diagnose problems with your Dispatch deployment
---
This section will show you how to diagnose issues with your Dispatch deployment, generate diagnostic bundles, and resolve problems.

# Viewing component logs

There are a couple of ways you can check the logs for your components.

## Tekton pipelines controller

```bash
dispatch debug pipelines-controller
```

## Dispatch event sink

```bash
dispatch debug event-sink
```

# View Dispatch logs in Kibana

For information on viewing logs in Kibana, see the [Logging](../logging/) section.