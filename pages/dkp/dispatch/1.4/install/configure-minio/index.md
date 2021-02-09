---
layout: layout.pug
navigationTitle: Configure MinIO
title: Configure MinIO
menuWeight: 45
beta: false
excerpt: Configure and Customize MinIO on Dispatch
---
# MinIO
Dispatch uses MinIO internally to store temporary files during the build process, it can be customized for your environment depending on your requirements for Dispatch such as scale or durability.

## Scaling

Dispatch is configured to use MinIO as the default S3 compatible storage. MinIO can run in standalone or distributed mode. Dispatch supports installing MinIO in distributed mode for production environments.

By default, Dispatch runs MinIO in Standalone mode. To set the MinIO HA values during install time via command line:

```bash
dispatch init --set minio.mode=distributed --set minio.replicas=6
```

Note that the replicas count should be a multiple of 2 (minimum value of 4) as [described here in detail](https://docs.min.io/docs/distributed-minio-quickstart-guide.html).

To run it in the standalone mode (default behavior):

```bash
dispatch init --set minio.mode=standalone
```

Note that `replicas` is only relevant when running MinIO storage in distributed mode. Above values can be passed either via `values.yaml` file to `dispatch init` command or in the `values` field of the Dispatch Addon if using a Konvoy cluster accordingly.
