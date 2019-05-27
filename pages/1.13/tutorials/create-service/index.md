---
layout: layout.pug
navigationTitle: Creating and running a service
title: Creating and running a service
menuWeight: 1
excerpt: Illustrates how to create and deploy single command or an image using containers
enterprise: false
---
This tutorial shows how to create and deploy a simple one-command service and a containerized service using the DC/OS web-based administrative console or by running command-line programs.

# Before you begin
Before starting this tutorial, you should verify the following:
- You must be able to access a properly-configured and running [DC/OS cluster](../start-here/).
- You must have an account with administrative privileges for the cluster.
- You must have the [DC/OS command-line interface](../cli/) installed.

# Learning objectives
- [A DC/OS cluster]

# Create a single command service
You can create and deploy a simple single-command service using the DC/OS web-based administrative console or by running command-line programs.

## Using the DC/OS web-based console
1. Open a web browser and navigate to the URL for the DC/OS web-based administrative console. 

1. Click **Services**, then click **Run a Service**.

1. Click **Single Container**.

1. Type a name for your service in the **Service ID** field.

    For example, type `single-cmd-service` for the service identifier.

    You can use the default values for the number of instances, CPUs, and memory and leave the **Container Image** field blank.

1. For the **Command** field, enter `sleep 10`.

1. Click **More Settings**, then select **Universal Container Runtime (UCR)** to use the native DC/OS container runtime.

    The **Universal Container Runtime (UCR)** supports Docker files, multiple containers (pods), and using GPU resources. If you select this option, you can optionally specify a Docker container image.

    You should only select the **Docker Engine** option if you need Docker-specific features. If you select this option, you must specify a Docker container image in the **Container Image** field.
     
    For more information about Universal Container Runtime and working with Docker containers and images, see [Using Containerizers](/1.13/deploying-services/containerizers/).

1. Click **Review & Run**, then click **Run Service**.

    ![Create and run a single-command service](/1.13/img/tutorial-single-cmd-create-ui.png)

1. Click the name of your service in the **Services** view to see it running and monitor its health.

    ![Check the running service in the DC/OS console](/1.13/img/tutorial-run-cmd-service.png)

## Using the DC/OS CLI
You can also create and run single-command services using the DC/OS CLI.
1. Open a terminal shell on the computer where you have access to the DC/OS command-line interface (CLI).

1. Open a new file in a text editor to create a JSON file called `single-cmd-app-cli.json`.

1. Copy and paste the following sample content into the `single-cmd-app-cli.json` file:

    ```json
    {
      "id": "/single-cmd-app-cli",
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

1.  Start the single-command service by running the following command:

    ```bash
    dcos marathon app add single-cmd-app-cli.json
    ```

1.  Verify the single-command service has been successfully deployed by running the following command:

    ```bash
    dcos marathon app list
    ```

    The command returns information similar to the following about the services you have deployed.

    ```
    ID                   MEM  CPUS  TASKS  HEALTH  DEPLOYMENT  WAITING  CONTAINER  CMD                    
    /single-cmd-app-cli  128   1     0/1    N/A       ---      False       N/A     sleep 10               
    /single-cmd-service  128  0.1    0/1    N/A       ---      False      MESOS    sleep 10 && echo Done  
    ```

    As this sample output illustrates, you can verify that both the single-command service you created using the DC/OS web-based console and the one you deployed using a JSON file and CLI commands are running. You can also view both services by clicking **Services** in the DC/OS web-based console.

# Containerized service

## DC/OS web interface

Create and run a containerized service from the DC/OS web interface:

1.  Go to the `hello-dcos` page of the [Mesosphere Docker Hub repository](https://hub.docker.com/r/mesosphere/hello-dcos/tags/) and note down the latest image tag.
1.  Click the **Services** tab of the DC/OS web interface, then click the **RUN A SERVICE**.
1.  Click **Single Container** and enter a name for your service in the **SERVICE ID** field.
1.  Click the **Container Settings** tab and enter the following in the **CONTAINER IMAGE** field: `mesosphere/hello-dcos:<image-tag>`. Replace `<image-tag>` with the tag you copied in step 1.

    ![Containerized service in the DC/OS UI](/1.13/img/deploy-container-ui.png)

    Figure 3. Containerized service in the web interface

1.  Click **REVIEW & RUN** and **RUN SERVICE**.
1.  In the **Services** tab, click the name of your service, then choose one of the task instances. Click **Logs**, then toggle to the **STDERR** and **STDOUT** to see the output of the service.

    ![Running containerized service in the DC/OS UI](/1.13/img/container-running-ui.png)

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
