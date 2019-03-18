---
layout: layout.pug
navigationTitle:  Quick Start
title: Quick Start
menuWeight: 0
excerpt: Launching a pod from the CLI or web interface
enterprise: false
---


### Prerequisites
- DC/OS [installed](/1.13/installing/)
- DC/OS CLI [installed](/1.13/cli/install/)

# Launching a pod from the DC/OS CLI

1.  Create a JSON application definition with contents similar to this example. In this example, we will call the file `simple-pod.json`. <!-- Validated. JSH 9/30/16 -->

    ```json
    {
        "id": "/simplepod",
        "scaling": { "kind": "fixed", "instances": 1 },
        "containers": [
            {
                "name": "sleep1",
                "exec": { "command": { "shell": "sleep 1000" } },
                "resources": { "cpus": 0.1, "mem": 32 }
            }
        ],
        "networks": [ {"mode": "host"} ]
    }
    ```

    <p class="message--note"><strong>NOTE: </strong>The pod ID (the <code>id</code> parameter in the pod specification above) is used for all interaction with the pod once it is created.</p>

1.  Launch the pod on DC/OS with the following DC/OS CLI command:

    ```bash
    dcos marathon pod add simple-pod.json
    ```

1. Verify the status of your pod.

    ```
    dcos marathon pod show simplepod
    ```

# Launching a pod from the DC/OS web interface

You can also launch a pod from the [**Services**](/1.13/gui/) tab of the DC/OS web interface. Select **Services -> Services -> RUN A SERVICE -> Multi-container (Pod)**, then toggle to JSON mode and paste in the application definition supplied above.

If you already have other services running, go to **Services -> Services**, then click the **+** on the upper right hand side.

After you launch your pod, you’ll see your new pod on the **Services** tab of the DC/OS web interface. Click the pod to see information about the status of the containers in your pod.

![Pods UI](/1.13/img/pods-service-dashboard.png)

Figure 1. Services > Pods
