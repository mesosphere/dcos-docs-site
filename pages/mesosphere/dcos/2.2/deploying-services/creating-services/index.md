---
layout: layout.pug
navigationTitle:  Creating Services
title: Creating Services
menuWeight: 1
excerpt: Defining a DC/OS service using Marathon
render: mustache
beta: false
model: /mesosphere/dcos/2.2/data.yml
enterprise: false
---


A Marathon application typically represents a long-running service that has many instances running on multiple hosts. An application instance is called a **task**. The **application definition** describes everything needed to start and maintain the tasks. A Marathon application definition creates a DC/OS **service**.

# Inline shell script
You can deploy a simple program in an inline shell script. Let's start with a simple example: a service that prints `Hello Marathon` to `stdout` and then sleeps for five seconds, in an endless loop.

1. Use the following JSON application definition to describe the application. Create a file with the name of your choice.

    ```json
    {
        "id": "basic-0",
        "cmd": "while [ true ] ; do echo 'Hello Marathon' ; sleep 5 ; done",
        "cpus": 0.1,
        "mem": 10.0,
        "instances": 1
    }
    ```

    In the above example, `cmd` is the command that gets executed. Its value is wrapped by the underlying Mesos executor via `/bin/sh -c ${cmd}`.

1. Use the [DC/OS CLI](/mesosphere/dcos/2.2/cli/) to add the service to DC/OS.

    ```bash
    dcos marathon app add <your-service-name>.json
    ```

When you define and launch a service, Marathon hands over execution to Mesos. Mesos creates a sandbox directory for each task. The sandbox directory is a directory on each agent node that acts as an execution environment and contains relevant log files. The `stderr` and `stdout` streams are also written to the sandbox directory.

## CPU/Memory Requests and Limits

Any application will require CPU and memory to execute. As you can see above, the `cpus` and `mem` fields can be used to specify the amount of these resources required by the application. These quantities are known as the CPU and memory "requests", and the app is guaranteed to have access to at least these amounts. In addition, DC/OS has the concept of CPU and memory "limits" which allow you to specify the maximum amount of the resource that the app may consume. The resource limit must be equal to or greater than the request; in addition, the limit may be given the value of "unlimited", meaning the app's use of that resource is not constrained at all. The app below has a CPU limit of 2.0 CPUs and an infinite memory limit:

    ```json
    {
        "id": "basic-0",
        "cmd": "while [ true ] ; do echo 'Hello Marathon' ; sleep 5 ; done",
        "cpus": 1.0,
        "mem": 256.0,
        "resourceLimits": { "cpus": 2.0, "mem": "unlimited" },
        "instances": 1
    }
    ```

If no special configuration has been applied to the DC/OS cluster during installation, then tasks which do not set explicit CPU limits will have their limit implicitly set to the value of the CPU request. Changing the value of the [mesos_cgroups_enable_cfs](/mesosphere/dcos/2.2/installing/production/advanced-configuration/configuration-reference/#mesos_cgroups_enable_cfs) DC/OS installation parameter to `false` means that these implicit limits will not be set.

A task with a CPU limit higher than its request will automatically be scheduled on the CPU when there are free cycles available, with its CPU usage being throttled back to its CPU request when other processes have work to schedule as well. Tasks will never be scheduled on the CPU more than allowed by the value of their CPU limit. A task with a memory limit higher than its request will be able to consume memory greater than the request, but this does come with some danger of premature task termination. If memory on the agent becomes exhausted and memory must be reclaimed so that all tasks can have access to their entire memory requests, task processes which are consuming more memory than their request will be first in line to be OOM-killed in order to free up memory. When a task attempts to allocate more memory than its memory limit and nothing can be paged out in order to prevent this violation, the task will be OOM-killed immediately.

## Declaring Artifacts in Applications

To run any non-trivial application, you typically depend on a collection of artifacts: files or archives of files. To configure these artifacts, Marathon allows you to specify one or more URIs (uniform resource identifiers). URIs use the [Mesos fetcher](http://mesos.apache.org/documentation/latest/fetcher/) to do the legwork in terms of downloading (and potentially) extracting resources.

Example:

```json
{
    "id": "basic-1",
    "cmd": "`chmod u+x cool-script.sh && ./cool-script.sh`",
    "cpus": 0.1,
    "mem": 10.0,
    "instances": 1,
    "fetch": [ { "uri": "https://example.com/app/cool-script.sh" } ]
}
```

The example above downloads the resource `https://example.com/app/cool-script.sh` (via Mesos), makes it available in the service instance's Mesos sandbox, and then executes the contents of `cmd`. You can verify that it has been downloaded by visiting the DC/OS web interface and clicking on an instance of `basic-1`, then on the **Files** tab. You should find `cool-script.sh` there.

<p class="message--note"><strong>NOTE: </strong>The fetcher does not make dowloaded files executable by default. In the example above, <code>cmd</code> first makes the file executable.</p>

As already mentioned, Marathon also knows how to handle application resources that reside in archives. Currently, Marathon (via Mesos and before executing the `cmd`) first attempts to unpack/extract resources with the following file extensions:

* `.tgz`
* `.tar.gz`
* `.tbz2`
* `.tar.bz2`
* `.txz`
* `.tar.xz`
* `.zip`

The following example shows you how this looks in practice. Assume you have an application executable in a zip file at `https://example.com/app.zip`. This zip file contains the script `cool-script.sh` that you want to execute. Here's how:

```json
{
    "id": "basic-2",
    "cmd": "app/cool-script.sh",
    "cpus": 0.1,
    "mem": 10.0,
    "instances": 1,
    "fetch": [ { "uri": "https://example.com/app.zip" } ]
}
```

In contrast to the example `basic-1`, we now have a `cmd` with the value `app/cool-script.sh`. When the zip file gets downloaded and extracted, a directory `app` according to the file name `app.zip` is created and the content of the zip file is extracted into it.

You can specify more than one resource. For example, you could provide a Git repository and some resources from a CDN as follows:

```json
{
    "fetch": [
        { "uri": "https://git.example.com/repo-app.zip", "https://cdn.example.net/my-file.jpg"},
        { "uri": "https://cdn.example.net/my-other-file.css" }
    ]
}
```

A typical pattern in the development and deployment cycle is to have your automated build system place the app binary in a location that's downloadable via a URI. Marathon can download resources from a number of sources. Marathon supports the following [URI schemes](http://tools.ietf.org/html/rfc3986#section-3.1):

* `file:`
* `http:`
* `https:`
* `ftp:`
* `ftps:`
* `hdfs:`
* `s3:`
* `s3a:`
* `s3n:`


# REST API
You can deploy a simple Docker-based application with the REST API. With Marathon it is straightforward to run applications that use Docker images.

In the following example, you deploy a Docker app to DC/OS using the Marathon API. The Docker app is a Python-based web server that uses the [python:3](https://registry.hub.docker.com/_/python/) image. Inside the container, the web server runs on port `80` (the value of `containerPort`). `hostPort` is set to `0` so that Marathon assigns a random port on the Mesos agent, which is mapped to port 80 inside the container.

1. Choose whether to use the Universal Container Runtime (UCR) or Docker Engine runtime. See [Using Containerizers](/mesosphere/dcos/2.2/deploying-services/containerizers/).
   -  To use the Universal Container Runtime (UCR), paste the following JSON into a file named `basic-3-mesos.json`:

      ```json
      {
        "id": "basic-3-mesos",
        "cmd": "cd /;python3 -m http.server 80",
        "acceptedResourceRoles": ["slave_public"],
        "container": {
          "portMappings": [
            {
              "containerPort": 80,
              "hostPort": 0
            }
          ],
          "type": "MESOS",
          "docker": { "image": "python:3" }
        },
        "cpus": 0.5,
        "mem": 32,
        "networks": [ { "mode": "container/bridge" } ]
      }
      ```

    - To use the Docker Engine runtime, paste the following JSON into a file named `basic-3-docker.json`:

      ```json
      {
        "id": "basic-3-docker",
        "cmd": "cd /;python3 -m http.server 80",
        "acceptedResourceRoles": [ "slave_public" ],
        "container": {
          "portMappings": [
            {
              "containerPort": 80,
              "hostPort": 0
            }
          ],
          "type": "DOCKER",
          "docker": {
            "image": "python:3" },
            "parameters": [
              {
                "key": "log-driver",
                "value": "none"
              }
            ]
        },
        "cpus": 0.5,
        "instances": 1,
        "mem": 32,
        "networks": [ { "mode": "container/bridge" } ]
      }
      ```

1. Use the [Marathon API](/mesosphere/dcos/2.2/deploying-services/marathon-api/) to deploy the app `basic-3-docker`. Refer to [Authentication HTTP API Endpoint](/mesosphere/dcos/2.2/security/ent/iam-api/) to learn more about the API token required in the command below.

    ```sh
     curl -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -X POST <master-IP>/service/marathon/v2/apps -d @basic-3-docker.json -H "Content-type: application/json"
    ```

1. Go to the **Services** tab of the DC/OS GUI to view the running service.
1. Click `basic-3-docker` and then the task ID.
1. Scroll down to the **Marathon Task Configuration** section and note the PORTS property.

   ![container port](/mesosphere/dcos/2.2/img/container-port.png)

   Figure 1. Container port
   
1. Determine the [IP address of the public node](/mesosphere/dcos/2.2/administering-clusters/locate-public-agent/).
1. Navigate to `<public-node-IP>:<port>` to see the contents of the Docker container's root directory.
