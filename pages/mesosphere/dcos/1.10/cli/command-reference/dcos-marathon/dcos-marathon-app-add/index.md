---
layout: layout.pug
navigationTitle:  dcos marathon app add
title: dcos marathon app add
menuWeight: 1
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


# Description
Add an application.

# Usage

```bash
dcos marathon app add <app-resource> [OPTION]
```

# Options

None.

# Positional arguments

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `<app-resource>`   |             |  Path to a file or HTTP(S) URL that contains the app's JSON definition. If omitted, the definition is read from stdin. For a detailed description, see the [documentation](/mesosphere/dcos/1.10/deploying-services/marathon-api/). |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/mesosphere/dcos/1.10/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |

# Examples

## Deploy a simple app

In this example, a simple app is deployed to DC/OS Marathon.

1.  Create an app definition file named `my-app.json` with these contents.

    ```json
    {
        "id": "/my-app",
        "networks": [
            { "mode": "container/bridge" }
        ],
        "container": {
            "type": "DOCKER",
            "docker": { "image": "group/image" }
        },
        "portMappings": [
            { "hostPort": 80, "containerPort": 80, "protocol": "tcp"}
        ],
        "instances": 1,
        "cpus": 0.1,
        "mem": 64
    }
    ```

1.  Add your app to Marathon:

    ```bash
    dcos marathon app add <my-app.json>
    ```

    If this is added successfully, there is no output.

1.  Verify that the app is added with this command:

    ```bash
    dcos marathon app list
    ```

    The output should look like this:

    ```bash
     ID     MEM  CPUS  TASKS  HEALTH  DEPLOYMENT  CONTAINER  CMD
    /myApp   64  0.1    0/1    ---      scale       DOCKER   None
    ```
