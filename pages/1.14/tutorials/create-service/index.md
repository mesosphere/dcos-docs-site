---
layout: layout.pug
navigationTitle:  Creating and Running a Service
title: Tutorial - Creating and Running a Service
menuWeight: 1
excerpt: Creating and deploying a service and a containerized service

enterprise: false
---

#include /include/tutorial-disclaimer.tmpl


This tutorial shows how to create and deploy a simple one-command service and a containerized service using both the DC/OS web interface and the CLI.

### Prerequisites
- [A DC/OS cluster](/1.14/installing/)

# One-command service

## DC/OS web interface

Create and run a simple service from the DC/OS web interface:

1. Click the **Services** tab of the DC/OS web interface, then click **RUN A SERVICE**.
1. Click **Single Container**.

   1. In the **SERVICE ID** field, enter a name for your service.
   1. In the **COMMAND** field, enter `sleep 10`.
   1. Click **MORE SETTINGS** and choose your container runtime.

      -  **DOCKER ENGINE** Use this option if you require specific features of the Docker package. If you select this option, you must specify a Docker container image in the **CONTAINER IMAGE** field.
      -  **UNIVERSAL CONTAINER RUNTIME (UCR)**  Universal Container Runtime (UCR) using native Mesos engine. Supports Docker file format, multiple containers (pods), and GPU resources. If you select this option, you can optionally specify a Docker container image in the **CONTAINER IMAGE** field.

      For more information, see [Using Containerizers](/1.14/deploying-services/containerizers/).

1. Click **REVIEW & RUN** and **RUN SERVICE**.

    ![Create a service in the DC/OS UI](/1.14/img/deploy-svs-ui.png)

    Figure 1. Create a service in the web interface

1. Click the name of your service in the **Services** view to see it running and monitor health.

    ![Running service in the DC/OS UI](/1.14/img/GUI-Services-Running_Services_View-1_12.png)

    Figure 2. Viewing a running service in the web interface

## DC/OS CLI

Create and run a simple service from the DC/OS CLI:

1.  Create a JSON file called `my-app-cli.json` with the following contents:

    ```json
    {
      "id": "/my-app-cli",
      "cmd": "sleep 10",
      "instances": 1,
      "cpus": 1,
      "mem": 128,
      "portDefinitions": [
        {
          "protocol": "tcp",
          "port": 10000
        }
      ],
      "requirePorts": false
    }
    ```

1.  Run the service with the following command.

    ```bash
    dcos marathon app add my-app-cli.json
    ```

1.  Run the following command to verify that your service is running:

    ```bash
    dcos marathon app list
    ```

    You can also click the name of your service in the **Services** view of the DC/OS web interface to see it running and monitor health.

# Containerized service

## DC/OS web interface

Create and run a containerized service from the DC/OS web interface:

1.  Go to the `hello-dcos` page of the [Mesosphere Docker Hub repository](https://hub.docker.com/r/mesosphere/hello-dcos/tags/) and note down the latest image tag.
1.  Click the **Services** tab of the DC/OS web interface, then click the **RUN A SERVICE**.
1.  Click **Single Container** and enter a name for your service in the **SERVICE ID** field.
1.  Click the **Container Settings** tab and enter the following in the **CONTAINER IMAGE** field: `mesosphere/hello-dcos:<image-tag>`. Replace `<image-tag>` with the tag you copied in step 1.

    ![Containerized service in the DC/OS UI](/1.14/img/deploy-container-ui.png)

    Figure 3. Containerized service in the web interface

1.  Click **REVIEW & RUN** and **RUN SERVICE**.
1.  In the **Services** tab, click the name of your service, then choose one of the task instances. Click **Logs**, then toggle to the **STDERR** and **STDOUT** to see the output of the service.

    ![Running containerized service in the DC/OS UI](/1.14/img/container-running-ui.png)

    Figure 4. Viewing a containerized service in the web interface

## DC/OS CLI

Create and run a containerized service from the CLI:


1.  Go to the `hello-dcos` page of the [Mesosphere Docker Hub repository](https://hub.docker.com/r/mesosphere/hello-dcos/tags/) and note down the latest image tag.
1.  Create a JSON file called `hello-dcos-cli.json` with the following contents. Replace `<image-tag>` in the `docker:image` field with the tag you copied in step 1.

    ```json
    {
      "id": "/hello-dcos-cli",
      "instances": 1,
      "cpus": 1,
      "mem": 128,
      "container": {
        "type": "DOCKER",
        "docker": {
          "image": "mesosphere/hello-dcos:<image-tag>",
          "forcePullImage": false,
          "privileged": false
        }
      },
      "acceptedResourceRoles": ["slave_public"],
      "portDefinitions": [
        {
          "protocol": "tcp",
          "port": 10001
        }
      ],
      "requirePorts": false
    }
    ```

1.  Run the service with the following command.

    ```bash
    dcos marathon app add hello-dcos-cli.json
    ```

1.  Run the following command to verify that your service is running:

    ```bash
    dcos marathon app list
    ```

1. In the **Services** tab of the DC/OS web interface, click the name of your service, then choose one of the task instances.
1. Click **Logs**, then toggle to the **OUTPUT (STDOUT)** view to see the output of the service.
