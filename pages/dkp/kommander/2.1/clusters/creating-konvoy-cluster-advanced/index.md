---
layout: layout.pug
beta: false
navigationTitle: Advanced Creation of Konvoy Clusters
title: Advanced Creation of Konvoy Clusters
menuWeight: 35
excerpt: A guide for advanced creation of Konvoy clusters
---

## Advanced cluster creation

<p class="message--warning"><strong>WARNING: </strong>
This feature is for advanced users and users in unique environments only. We highly recommend using other documented methods to create clusters whenever possible.
</p>

### Generate cluster objects

Depending on your infrastructure, Konvoy can generate a set of cluster objects that can be customized for unusual use cases. Visit the [documentation for AWS](/dkp/konvoy/2.1/choose-infrastructure/aws/advanced/new/#create-a-new-aws-kubernetes-cluster) for an example on how to use the `--dry-run` and `--output` flags to create a set of cluster objects.

### Use the upload YAML form

From the **Add Cluster** menu, select the **Upload YAML to Create a Cluster** and provide advanced cluster details:

- **Workspace**: The workspace where this cluster belongs.
- **Cluster YAML**: Paste or upload your customized set of cluster objects into this field. Only valid YAML will be accepted.
- **Add Labels**: By default, your cluster has labels that reflect the infrastructure provider provisioning. For example, your AWS cluster may have a label for the data center region and `provider: aws`. Cluster labels are matched to the selectors created for [projects][projects]. Changing a cluster label may add or remove the cluster from projects.

Click **Create** to begin provisioning the Konvoy cluster. This step may take a few minutes, taking time for the cluster to be ready and fully deploy its components. The cluster will retry to join automatically and should resolve once it is fully provisioned.

[projects]: ../../projects/
