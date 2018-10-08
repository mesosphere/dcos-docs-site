---
layout: layout.pug
excerpt: Installing and customizing Marathon-LB on DC/OS Open Source
title: Installing and Customizing on DC/OS Open Source
menuWeight: 1
---


**Prerequisites:**

- DC/OS [installed](/1.10/installing/oss/)
- DC/OS CLI [installed](/1.10/cli/install/)

# Default installation

From the DC/OS CLI, enter this command:

    ```bash
    dcos package install marathon-lb
    ```

**Tip:** You can also install from the DC/OS [GUI](/1.10/gui/).


# Custom installation

1.  From the DC/OS CLI, view the available Marathon-LB config options:

    ```bash
    dcos package describe --config marathon-lb
    ```

    The output should look similar to this:

    ```json
    {
      "$schema": "http://json-schema.org/schema#",
      "properties": {
        "marathon-lb": {
          "properties": {
            "auto-assign-service-ports": {
              "default": false,
              "description": "Auto assign service ports for tasks which use IP-per-task. See https://githu
    b.com/mesosphere/marathon-lb#mesos-with-ip-per-task-support for details.",
              "type": "boolean"
            },
            "bind-http-https": {
              "default": true,
              "description": "Reserve ports 80 and 443 for the LB. Use this if you intend to use virtual h
    osts.",
              "type": "boolean"
            },
    ...
    ```

1.  Create a JSON configuration file with your customizations. You can choose an arbitrary name, but you might want to choose a pattern like `marathon-lb-config.json`. For example, to change the CPU shares to 3 and memory allocation to 2048:

    ```json
    {
      "marathon-lb": {
        "instances": 3.0, "mem": 2048.0
       }
    }
    ```

1.  From the DC/OS CLI, install Marathon-LB with your custom options file specified.

    ```bash
    dcos package install --options=<filename>.json marathon-lb
    ```

## Next steps

- [Tutorial - Deploying a Load Balanced App with Marathon-LB](/services/marathon-lb/marathon-lb-basic-tutorial/)
- [Tutorial - Using Marathon-LB for Internal and External Load Balancing](/services/marathon-lb/marathon-lb-advanced-tutorial/)
- See the advanced Marathon-LB [documentation](/services/marathon-lb/advanced/).
