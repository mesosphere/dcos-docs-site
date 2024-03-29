---
layout: layout.pug
navigationTitle: Delete Konvoy Cluster with One Command
title: Delete a Konvoy Cluster with One Command
menuWeight: 55
excerpt: Delete a Konvoy cluster with a single command
enterprise: false
beta: false
---

You can use a single command line entry to delete a Kubernetes cluster on any of the platforms supported by DKP. Deleting a cluster means removing the cluster, all of its nodes, and all of the platform applications that were deployed on it as part of its creation. Use this command with extreme care, as it is not reversible!

<p class="message--note"><strong>NOTE: </strong>You need to delete the attachment for any clusters attached in Kommander before running the <code>delete</code> command.</p>

Set the environment variable to be used throughout this documentation:

```bash
export CLUSTER_NAME=cluster-example
```

The basic DKP `delete` command structure is:

```bash
dkp delete cluster --cluster-name=${CLUSTER_NAME} --self-managed --kubeconfig=${CLUSTER_NAME}.conf
```

When you use the `--self-managed` flag, the prerequisite components and resources are moved from the self-managed cluster before deleting. When you omit this flag (the default value is false) the resources are assumed to be installed in a management cluster. The default value is false, or no flag.

This command performs the following actions:

-   Creates a local bootstrap cluster

-   Moves controllers to it

-   Deletes the management cluster

-   Deletes the local bootstrap cluster
