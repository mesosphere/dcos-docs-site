---
layout: layout.pug
navigationTitle:  Configuring Services
title: Configuring Services
menuWeight: 2
excerpt: Using the DC/OS CLI to configure services
render: mustache
model: /mesosphere/dcos/2.0/data.yml
enterprise: false
---

This topic describes how to use the CLI to configure services. You can also customize services by using the [**Services**](/mesosphere/dcos/2.0/gui/services/) tab in the DC/OS UI.

1. View the available configuration options for the service with the [`dcos package describe --config <package-name>`](/mesosphere/dcos/2.0/cli/command-reference/dcos-package/dcos-package-describe/) command.

    ```bash
    dcos package describe --config marathon
    ```

    The output should look like:

    ```json
    {
    ...
      "service": {
        "additionalProperties": false,
        "description": "Marathon app configuration properties.",
        "properties": {
          "cpus": {
            "default": 2,
            "description": "CPU shares to allocate to each Marathon instance.",
            "minimum": 0,
            "type": "number"
          },
          ...
          "instances": {
            "default": 1,
            "description": "Number of Marathon instances to run.",
            "minimum": 0,
            "type": "integer"
          },
          "mem": {
            "default": 1536,
            "description": "Memory (MB) to allocate to each Marathon instance.",
            "minimum": 512,
            "type": "number"
          }
        },
        ...
      }
    }
    ```

1.  Create a JSON configuration file. You can choose any name, but you might want to choose a pattern like `<package-name>-config.json`. For example, `marathon-config.json`.

    ```bash
    nano marathon-config.json
    ```

1.  Use the `properties` objects to build your JSON options file. For example, to change the number of Marathon CPU shares to 3 and memory allocation to 2048:

    ```json
    {
      "service": {
        "cpus": 3.0, "mem": 2048.0
       }
    }
    ```

1.  From the DC/OS CLI, install the DC/OS service with the custom options file specified:

    ```bash
    dcos package install --options=marathon-config.json marathon
    ```

For more information, see the [dcos package](/mesosphere/dcos/2.0/cli/command-reference/dcos-package/) command reference documentation.
