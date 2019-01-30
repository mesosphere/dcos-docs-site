---
layout: layout.pug
navigationTitle:  Deploying Marathon Apps with Jenkins
title: Deploying Marathon Apps with Jenkins
menuWeight: 4
excerpt: Tutorial - Deploying applications on Marathon using Jenkins for DC/OS

enterprise: false
---


#include /include/tutorial-disclaimer.tmpl

This tutorial shows how to deploy applications on [Marathon][1] using Jenkins for DC/OS. This tutorial will walk you through creating a new Jenkins job, publishing a Docker container on source code changes, and deploying those changes to Marathon based on the [application definition][3] contained in the project’s `marathon.json` file.

**Prerequisite:**
This tutorial assumes that you have a working Jenkins installation and permission to launch applications on Marathon. Jenkins for DC/OS must be installed as described on the [Jenkins Quickstart](/services/jenkins/quickstart/) page.



# The Example Project

The project used in this tutorial is taken from the [cd-demo][4] repository and runs a Jekyll website inside a Docker container. The required files for this tutorial are `Dockerfile`, `conf/cd-demo-appn.json`, and the `site` directory. Copy those items to a new project and push to a new Git repository on the host of your choice. This tutorial uses [Docker Hub][6] to store the created image and requires account information to perform this task.

## Accessing Jenkins for DC/OS

Jenkins for DC/OS can be accessed through the Dashboard or Services navigation menu’s within the [DC/OS web interface](/gui/).

Click the “Jenkins” service and then "Open Service" to access the Jenkins web interface.

![dcos-velocity-jenkins-ui.png](/img/dcos-velocity-jenkins-ui.png)

Figure 1. Jenkins web interface

## Adding Docker Hub Credentials

Jenkins stores account credentials within its Credential Store, which allows jobs to use credentials in a secure manner. From the main Jenkins page, click **Credentials** from the left-hand menu. From there, select **System** (also from the left-hand menu) and finally the *Global credentials* (unrestricted) link presented in the main viewing area. The left-hand menu should now have an **Add Credentials** option.

Click **Add Credentials** to create a new credential for Docker Hub. The **Kind** drop-down menu should have the "Username with password" option selected. Fill out the rest of the information to match your Docker Hub account.

![dcos-velocity-jenkins-creds-new.png](/img/dcos-velocity-jenkins-creds-new.png)

Figure 2. Add Jenkins credentials

# The Job

We will create a new Jenkins job that performs several operations with Docker Hub and then either update or create a Marathon application.

Create a new **Freestyle** job with a name that includes only lowercase letters and hyphens. This name will be used later in the Docker image name and possibly as the Marathon application ID.

![dcos-jenkins-new-freestyle.png](/img/dcos-jenkins-new-freestyle.png)

Figure 3. Freestyle project

## SCM/Git

From the **Example Project** section above, fill in the Git repository URL with the newly created Git repository. This must be accessible to Jenkins and may require adding credentials to the Jenkins instance.

![dcos-jenkins-repourl.png](/img/dcos-jenkins-repourl.png)

Figure 4. Source Code Management credentials

## Build Triggers

Select the **Poll SCM** build trigger with a schedule of: `*/5 * * * *`. This will check the Git repository every five minutes for changes.

# Build Steps

The Jenkins job performs these actions:

1. Build a new Docker image.
1. Push the new image to Docker Hub.

These steps can be performed by a single build step using the **Docker Build and Publish** plugin, which is already included and ready for use. From the **Add build step** drop-down list, select the **Docker Build and Publish** option.

![dcos-velocity-jenkins-build-docker.png](/img/dcos-velocity-jenkins-build-docker.png)

Figure 5. Docker "Add build step" options

Fill in the following fields:

* **Repository Name** with your Docker Hub username and `/${JOB_NAME}` as the suffix ("myusername/${JOB_NAME}")
* **Tag** with `${GIT_COMMIT}`
* **Registry credentials** to the credentials for Docker Hub created above

![dcos-velocity-jenkins-build-docker-config.png](/img/dcos-velocity-jenkins-build-docker-config.png)

Figure 6. Docker Build and Publish screen

# Marathon Deployment

Add a Marathon Deployment post-build action by selecting the **Marathon Deployment** option from the **Add post-build action** drop-down.

![dcos-jenkins-plugin-popup.png](/img/dcos-jenkins-plugin-popup.png)

Figure 6. Marathon Deployment menu

Fill in the following fields:

* **Marathon URL** can be accessed within DC/OS using the URL `http://leader.mesos/service/marathon`
* **Application Definition** with the relative path to the marathon application file (`conf/cd-demo-app.json`)
* **Docker Image** with the image created above (`myusername/${JOB_NAME}:${GIT_COMMIT}`)

![dcos-velocity-marathon-config.png](/img/dcos-velocity-marathon-config.png)

Figure 7. Post-Build Actions screen

## How It Works

The Marathon Deployment post-build action reads the application definition file, by default `marathon.json`, contained within the project’s Git repository. This is a JSON file and must contain a valid [Marathon application definition][3].

The configurable fields in the post-build action will overwrite the content of matching fields from the file. For example, setting the "Application Id" will replace the `id` field in the file. In the configuration above, "Docker Image" is configured and will overwrite the `image` field contained within the [docker field][5].

The final JSON payload is sent to the configured Marathon instance and the application is updated or created.

# Save

Save the job configuration.

# Build It

Click **Build Now** and let the job build.

![dcos-jenkins-build-now.png](/img/dcos-jenkins-build-now.png)

Figure 8. Build the job

# Deployment

Upon a successful run in Jenkins, the application will begin deployment on DC/OS. You can visit the DC/OS web interface to monitor progress.

When the **Status** has changed to **Running**, the deployment is complete and you can visit the website.

## Visit Your Site

Visit port `80` on the public DC/OS agent to display a Jekyll website.

![dcos-jekyll-site1.png](/img/dcos-jekyll-site1.png)

Figure 9. Jekyll demo

## Adding a New Post

The content in the `_posts` directory generates a Jekyll website. For this example project, that directory is `site/_posts`. Copy an existing post and create a new one with a more recent date in the filename. I added a post entitled "An Update".

Commit the new post to Git. Shortly after the new commit lands on the master branch, Jenkins will see the change and redeploy to Marathon.

![dcos-jekyll-updated.png](/img/dcos-jekyll-updated.png)

 [1]: https://mesosphere.github.io/marathon/
 [3]: https://mesosphere.github.io/marathon/docs/application-basics.html
 [4]: https://github.com/mesosphere/cd-demo
 [5]: https://mesosphere.github.io/marathon/docs/native-docker.html
 [6]: https://hub.docker.com/
