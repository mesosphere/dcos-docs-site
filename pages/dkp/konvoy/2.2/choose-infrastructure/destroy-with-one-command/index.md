---
layout: layout.pug
navigationTitle: Delete Konvoy Cluster with One Command
title: Delete a Konvoy Cluster with One Command
menuWeight: 55
excerpt: Deleete a Konvoy cluster with a single command
enterprise: false
beta: false
---

You can use a single command line entry to delete a Kubernetes cluster on any of the platforms supported by DKP. Deleting a cluster means removing the cluster, all of its nodes, and all of the platform applications that were deployed on it as part of its creation. Use this command with extreme care, as it is not reversible!

<p class="message--note"><strong>NOTE: </strong>You need to delete the attachment for any clusters attached in Kommander before running the `delete` command.</p>

The basic DKP `delete` command structure is:

```bash
dkp delete cluster --cluster-name=clustername --self-managed --kubeconfig=cluster_name.conf
```

When you use the `--self-managed` flag, the prerequisite components and resources are moved from the self-managed cluster before deleting. When you omit this flag, which is the default value - false, the resources are assumed to be installed in a management cluster. The default value is false, or no flag.

This command performs the following actions:

-   Creates a local bootstrap cluster

-   Moves controllers to it

-   Deletes the management cluster

-   Deletes the local bootstrap cluster
