---
layout: layout.pug
navigationTitle: Troubleshooting
title: Troubleshooting
menuWeight: 80
beta: false
excerpt: Diagnosing issues with your Dispatch deployment
---
This section will show you how to diagnose issues with your Dispatch deployment, generate diagnostic bundles, and resolve problems.

**Note:** If Dispatch is running on D2iQ Konvoy, prior to contacting support, a [Konvoy diagnostic bundle](https://docs.d2iq.com/dkp/konvoy/latest/troubleshooting/generate-diagnostic-bundle/) may be required to be collected. Additional Konvoy troubleshooting information can be found on the [Konvoy Troubleshooting](https://docs.d2iq.com/dkp/konvoy/latest/troubleshooting/) page.

For information on viewing logs in **Kibana**, refer to the [Dispatch Logging](../operations/logging/) documentation.

# Viewing component logs

There are a multiple ways you can check the logs for your components.

## Tekton pipelines controller

To view the logs of Tekton's pipeline controller perform the following command:

```bash
dispatch debug pipelines-controller
```

## Dispatch event sink

To inspect the logs and status of the event-sink which processes webhook events perform the following command:

```bash
dispatch debug event-sink
```

## Dispatch Repository Controller

To inspect the logs of the repository controller run the following command:

```bash
dispatch debug repository-controller
```

## FluxCD

To display the name, status, health, etc., of all applications in FluxCD.

```bash
kubectl get gitrepositories
```
