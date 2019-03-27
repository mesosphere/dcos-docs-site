---
layout: layout.pug
navigationTitle:  Updating the Edge-LB pool configuration
title: Updating the Edge-LB pool configuration
menuWeight: 45
excerpt: Updating the Edge-LB pool configuration
enterprise: true
---

You can update the Edge-LB pool configuration to reflect changing requirements for a service without any service disruption. Making changes to an Edge-LB pool configuration does not affect any existing load-balancing operations in the cluster. You can also make changes to the pool configuration without editing the same .json file you have previously deployed. For example, you can expose and deploy a service using the `app-lb-1.json` pool configuration file, then update the Edge-LB pool configuration for that service by deploying different settings in a new `app-lb-2.json` pool configuration file. 

If you need to update pool configuration settings after deployment, you can choose to do either of the following:
- Update and maintain a single pool configuration file for a service to simplify pool management.
- Keep different pool configuration settings in separate files for a service to simplify how you respond to and adapt load balancing operations to address changing network traffic patterns or cluster requirements.

# To update a pool configuration
1. Open a text editor, then copy and paste the following sample Edge-LB pool configuration to create the `nginx-lb.json` file:

    ```json
    {
    "apiVersion": "V2",
    "name": "nginx-lb",
    "count": 1,
    "haproxy": {
        "frontends": [
        {
        "bindPort": 15002,
        "protocol": "HTTP",
        "linkBackend": {
            "defaultBackend": "nginx-backend"
        }
        }
    ],
        "backends": [
        {
        "name": "nginx-backend",
        "protocol": "HTTP",
        "services": [
            {
            "marathon": {
            "serviceID": "/nginx"
            },
            "endpoint": {
            "portName": "nginx-port"
            }
        }
        ]
        }
    ],
        "stats": {
        "bindPort": 0
        }
    }
    }
    ```

    This sample Edge-LB pool configuration file deploys one Edge-LB pool instance using the `"count": 1` setting.

1. Open the sample pool configuration file in a text editor by running a command similar to the following: 

    ```bash
    vi nginx-lb.json
    ```

1. Change the `count` pool instance variable to `3` to scale up the number of Edge-LB pool instances.

    ```json
    "count": 3
    ```

1. Update the Edge-LB pool by running the following command: 

    ```bash
    dcos edgelb update nginx-lb.json
    ```

1. Verify that the pool configuration was updated by running the following command:

    ```bash
    dcos edgelb status nginx-lb
    ```

1. Verify the endpoints that Edge-LB pools are deployed on the public agents by running the following command:

    ```bash
    dcos edgelb endpoints nginx-lb
    ```
