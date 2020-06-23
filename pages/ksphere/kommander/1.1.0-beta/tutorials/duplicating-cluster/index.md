---
layout: layout.pug
navigationTitle: Duplicating a Production Cluster
title: Duplicating a Production Cluster
menuWeight: 1
excerpt: Create a second cluster in another region and duplicate all the addons and configuration
---

In this tutorial you are going to learn how to create a second production cluster (e.g. to have a fallback or to migrate to a different cloud provider) for your E-Commerce team.

## Previous Setup

We have already set up a project for this team's production clusters in a Development workspace, let's take a look at it.

![Creating an E-Commerce project](/ksphere/kommander/1.1.0-beta/img/tutorial-ecommerce-project.png)

This project configuration will ensure all of the E-Commerce team's clusters have matching configuration. Let's give the team admin access to the workspace.
We have defined the developer access control group beforehand from the [Identity Providers page](https://docs.d2iq.com/ksphere/kommander/1.1.0-beta/operations/identity-providers/#groups) at the global level. We will create a policy to bind the developers group to the default Workspace Admin Role, which will give all developers access.

In the Kommander UI, do the following:
1. Select **Development** in the workspace header drop-down. 
2. Select **Administration** > **Access Control**.
3. Select the policies tab.
4. For the developers group, click **Add or remove roles**.
5. Select the Workspace Admin Role role and click **Save**.

![Creating a policy](/ksphere/kommander/1.1.0-beta/img/tutorial-ecommerce-policy.png)

The E-Commerce backend our team will be using needs some environment variable. We will configure them through a config map in our project.

![Created ConfigMaps](/ksphere/kommander/1.1.0-beta/img/tutorial-ecommerce-configmaps.png)

The backend also needs access to our AWS S3 Bucket and to GitHub, so we create two secrets for this:

![Created Secrets](/ksphere/kommander/1.1.0-beta/img/tutorial-ecommerce-secrets.png)

## Getting a second production cluster

This project currently only has one cluster attached to it, now we want to create a second cluster.
To provision another cluster on AWS we first need to setup our infrastructure provider. To do this we need to visit Administration > Cloud Providers and click the Add button. We need to put our AWS credentials into the form and save the cloud provider.

In the Kommander UI, do the following:
1. Select **Development** in the workspace header drop-down. 
2. Select **Administration** > **Infrastructure Providers**.
3. Click **+ Add Infrastructure Provider** and select AWS as the type.
4. Enter AWS credentials in the form and click **Verify and Save**.

![Create Infrastructure Provider](/ksphere/kommander/1.1.0-beta/img/tutorial-ecommerce-infraprovider.png)

Once we did this we can go to the workspace clusters view, click the Add Cluster button and select Create Konvoy Cluster.

![Create Cluster](/ksphere/kommander/1.1.0-beta/img/tutorial-ecommerce-cluster.png)

It's important that we set the right labels for our cluster, but not to worry, you can still change them after the cluster is created. After the cluster is created, we can look at the **Clusters** tab in our project and see that it has been added since it has labels matching our ECommerce Production project.

![Project Clusters](/ksphere/kommander/1.1.0-beta/img/tutorial-ecommerce-projectclusters.png)

We can also download the kubeconfig file for this cluster and take a look at what we have created.
To do this we need to install `kubectl` on our machine and set the `KUBECONFIG` environment variable to an absolute path to our downloaded kubeconfig file. Some examples to check could be:

- `kubectl get secrets -n ecommerce-production`
- `kubectl get configmaps -n ecommerce-production`

Since the cluster was added to the project, the resources defined in that project are automatically federated to the cluster in the project namespace, so we are done creating a second production cluster.
