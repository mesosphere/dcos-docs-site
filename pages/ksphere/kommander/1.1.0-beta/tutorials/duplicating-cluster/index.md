---
layout: layout.pug
navigationTitle: Duplicating a Production Cluster
title: Duplicating a Production Cluster
menuWeight: 1
excerpt: Create a second cluster in another region and duplicate all the addons and configuration
---

In this tutorial you are going to learn how to create a second production cluster (e.g. to have a fallback or to migrate to a different cloud provider) for your E-Commerce team.

## Previous Setup

You have already set up a project for this team's production clusters in a Development workspace, let's take a look at it.

![Creating an E-Commerce project](/ksphere/kommander/1.1/img/tutorial-ecommerce-project.png)

This project configuration will ensure all of the E-Commerce team's clusters have matching configuration. Let's give the team admin access to the workspace.
You have defined the developer access control group beforehand from the [Identity Providers page](https://docs.d2iq.com/ksphere/kommander/1.1/operations/identity-providers/#groups) at the global level. You will create a policy to bind the developers group to the default Workspace Admin Role, which will give all developers access.

In the Kommander UI, do the following:
1. Select **Development** in the workspace header drop-down. 
2. Select **Administration** > **Access Control**.
3. Select the policies tab.
4. For the developers group, select **Add or remove roles**.
5. Select the Workspace Admin Role role and select **Save**.

![Creating a policy](/ksphere/kommander/1.1/img/tutorial-ecommerce-policy.png)

The E-Commerce backend your team will be using needs environment variables. Configure them through a config map in your project.

![Created ConfigMaps](/ksphere/kommander/1.1/img/tutorial-ecommerce-configmaps.png)

The backend also needs access to your AWS S3 Bucket and to GitHub, so create two secrets for this:

![Created Secrets](/ksphere/kommander/1.1/img/tutorial-ecommerce-secrets.png)

## Getting a second production cluster

This project currently only has one cluster attached to it, now you should create a second cluster.
To provision another cluster on AWS, first setup an infrastructure provider. To do this go to **Administration > Cloud Providers** and select **Add**. Then, add your AWS credentials into the form and save the cloud provider.

In the Kommander UI, do the following:
1. Select **Development** in the workspace header drop-down. 
2. Select **Administration** > **Infrastructure Providers**.
3. Select **+ Add Infrastructure Provider** and select AWS as the type.
4. Enter AWS credentials in the form and select **Verify and Save**.

![Create Infrastructure Provider](/ksphere/kommander/1.1/img/tutorial-ecommerce-infraprovider.png)

Then go to the workspace clusters view, select **Add Cluster** > **Create Konvoy Cluster**.

![Create Cluster](/ksphere/kommander/1.1/img/tutorial-ecommerce-cluster.png)

It's important that to set the right labels for the cluster, but not to worry, you can still change them after the cluster is created. After the cluster is created, look at the **Clusters** tab in the project and see that it has been added since it has labels matching the ECommerce Production project.

![Project Clusters](/ksphere/kommander/1.1/img/tutorial-ecommerce-projectclusters.png)

You can also download the kubeconfig file for this cluster and take a look at what was created.
To do this, install `kubectl` on your machine and set the `KUBECONFIG` environment variable to an absolute path to the downloaded kubeconfig file. Some examples to check could be:

- `kubectl get secrets -n ecommerce-production`
- `kubectl get configmaps -n ecommerce-production`

Since the cluster was added to the project, the resources defined in that project are automatically federated to the cluster in the project namespace, so you are done creating a second production cluster.
