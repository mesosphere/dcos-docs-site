---
layout: layout.pug
navigationTitle: Duplicating a Production Cluster
title: Duplicating a Production Cluster
menuWeight: 1
excerpt: Create a second cluster in another region and duplicate all the addons and configuration
---

In this tutorial you are going to learn how to create a second production cluster (e.g. to have a fallback or to migrate to a different cloud provider) for your E-Commerce team.

## Previous Setup

We have already set up a project for the production clusters of this team, let's take a look at it.

![Creating an E-Commerce project](/ksphere/kommander/img/tutorial-ecommerce-project.png)

This project configuration will match every production cluster of our E-Commerce team; Let's give them admin access to the cluster.
For this we need an admin role, which we will define as the permission to do everything on the cluster:

![Creating a role](/ksphere/kommander/img/tutorial-ecommerce-role.png)

We can now attach the role to a policy for this cluster and give all developers access. We defined the developer group under Administration > Access Control > Group before.

![Creating a policy](/ksphere/kommander/img/tutorial-ecommerce-policy.png)

The E-Commerce backend our team will be using needs some environment variables, we will configure them through a config map.

![Created ConfigMaps](/ksphere/kommander/img/tutorial-ecommerce-config-maps.png)

The backend also needs access to our AWS S3 Bucket and to GitHub, so we create two secrets for this:

![Created Secrets](/ksphere/kommander/img/tutorial-ecommerce-secrets.png)

## Getting a second production cluster

This project currently only has one cluster attached to it, now we want to create a second cluster.
To provision another cluster on AWS we first need to setup our cloud provider. To do this we need to visit Administration > Cloud Providers and click the Add button. We need to put our AWS credentials into the form and save the cloud provider.

![Create Cloud Provider](/ksphere/kommander/img/tutorial-ecommerce-create-cloud-provider.png)

Once we did this we can go to the clusters view, click the Add Cluster button and select Create Konvoy Cluster.

![Create Cluster](/ksphere/kommander/img/tutorial-ecommerce-create-cluster.png)

It's important that we set the right labels for our cluster, but not to worry, you can still change them after the cluster is created.
After the cluster is created we can download the kubeconfig file for this cluster and take a look at what we have created.
To do this we need to install `kubectl` on our machine and set the `KUBECONFIG` environment variable to an absolute path to our downloaded kubeconfig file.

As the cluster has labels matching our E-Commerce Production Project the resources defined there are automatically provisioned to the cluster, so we are done creating a second prodiction cluster.

![Created Secrets](/ksphere/kommander/img/tutorial-ecommerce-target-secret.png)
![Created Config Map](/ksphere/kommander/img/tutorial-ecommerce-target-configmap.png)
![Created Role](/ksphere/kommander/img/tutorial-ecommerce-target-role.png)
