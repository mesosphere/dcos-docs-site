---
layout: layout.pug
navigationTitle: Pool metadata
title: Pool metadata
menuWeight: 83
excerpt: Reference information for Edge-LB pool metadata when integrating with cloud provider load balancers
enterprise: true
---

# Metadata

Edge-LB exposes certain information about its individual pool servers through the `/service/edgelb/pools/v2/<pool-name>/metadata` endpoint. 

The following example illustrates pool metadata in JSON format:

```json
{
  "aws": {
    "elbs": []
  },
  "frontends": [
    {
      "endpoints": [
        {
          "port": 1026,
          "private": [
            "10.0.6.38"
          ],
          "public": [
            "35.164.164.23"
          ]
        },
        {
          "port": 1028,
          "private": [
            "10.0.6.38"
          ],
          "public": [
            "35.164.164.23"
          ]
        }
      ],
      "name": "web"
    }
  ],
  "name": "app-pool",
  "stats": [
    {
      "port": 1025,
      "private": [
        "10.0.6.38"
      ],
      "public": [
        "35.164.164.23"
      ]
    },
    {
      "port": 1027,
      "private": [
        "10.0.6.38"
      ],
      "public": [
        "35.164.164.23"
      ]
    }
  ]
}
```

where

- `name` is a pool name.
- `frontends` is an array of entries with information on how to reach load balancer instances for a given pool frontend:
  - `name` is a frontend name.
  - `endpoints` is an array of entries consisting of IP addresses and port numbers:
    - `private` is an array of private IP addresses.
    - `public` is an array of public IP addresses.
    - `port` is a port number a particular pool server listens on for incoming connections.
- `stats` is an array of entries witn information on how to reach load balancer `haproxy` API. The format is the same as the one of `frontends.endpoints`.

Alternatively, metadata can be retrieved using DC/OS CLI by running `dcos edgelb endpoints <pool-name> --json`.

For further details on what `aws` might look like, see [Integrating with cloud providers](../../concepts/cloud-connector/).
