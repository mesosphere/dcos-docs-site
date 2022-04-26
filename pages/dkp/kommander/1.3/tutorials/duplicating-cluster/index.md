---
layout: layout.pug
beta: false
navigationTitle: Duplicate a Production Cluster
title: Duplicate a Production Cluster
menuWeight: 1
excerpt: Create a second cluster in another region and duplicate all the platform services and configuration
---

In this tutorial you will learn how to create a second production cluster for your E-Commerce team. For example: to have a fallback or to migrate to a different cloud provider.

## Before you begin

Ensure you have already set up a project for this team's production clusters in a Development workspace.

![Creating an E-Commerce project](/dkp/kommander/1.3/img/tutorial-ecommerce-project.png)

This project configuration ensures all E-Commerce team clusters have matching configurations. Next, give the team administrator access to the workspace.
You have defined the developer access control group beforehand from the [Identity Providers page](/dkp/kommander/1.3/operations/identity-providers/#groups) at the global level.

You will now create a policy to bind the developers group to the default Workspace Admin Role, which will give all developers access.

In the Kommander UI, do the following:

1. Select **Development** in the workspace header drop-down.
2. Select **Administration** > **Access Control**.
3. Select the **Policies** tab.
4. For the developers group, select **Add or remove roles**.
5. Select the Workspace Admin Role role and select **Save**.

![Creating a policy](/dkp/kommander/1.3/img/tutorial-ecommerce-policy.png)

The E-Commerce backend your team will be using needs environment variables. Configure them through a config map in your project.

![Created ConfigMaps](/dkp/kommander/1.3/img/tutorial-ecommerce-configmaps.png)

The backend also needs access to your AWS S3 Bucket and to GitHub, so create two secrets for this:

![Created Secrets](/dkp/kommander/1.3/img/tutorial-ecommerce-secrets.png)

## Create a second production cluster

This project has one cluster attached to it, now you should create a second cluster. To provision another cluster on AWS, first set up an infrastructure provider.

To do this go to **Administration > Infrastructure Providers** and select **Add**. Then, add your AWS credentials into the form and save the infrastructure provider.

In the Kommander UI, do the following:

1. Select **Development** in the workspace header drop-down.
2. Select **Administration** > **Infrastructure Providers**.
3. Select **+ Add Infrastructure Provider** and select AWS as the type.
4. Enter AWS credentials in the form and select **Verify and Save**.

![Create Infrastructure Provider](/dkp/kommander/1.3/img/tutorial-ecommerce-infraprovider.png)

Then go to the workspace clusters view, select **Add Cluster** > **Create Konvoy Cluster**.

![Create Cluster](/dkp/kommander/1.3/img/tutorial-ecommerce-cluster.png)

It is important to set the correct labels for the cluster, but you can still change them after creating the cluster from the **Clusters** tab in the project. You will see that it has been added since it has labels matching the ECommerce Production project.

![Project Clusters](/dkp/kommander/1.3/img/tutorial-ecommerce-projectclusters.png)

You can also download the kubeconfig file for this cluster see what was created. To do this, install `kubectl` on your machine and set the `KUBECONFIG` environment variable to an absolute path to the downloaded kubeconfig file.

For example, check:

- `kubectl get secrets -n ecommerce-production`
- `kubectl get configmaps -n ecommerce-production`

Since the cluster was added to the project, the resources defined in that project are automatically federated to the cluster in the project namespace, so you are done creating a second production cluster.
