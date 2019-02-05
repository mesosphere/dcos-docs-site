---
layout: layout.pug
navigationTitle: Running Jobs in Remote Regions
title: Running Jobs in Remote Regions
menuWeight: 3

enterprise: false
---

As described in [fault domain awareness and capacity extension for services](/1.13/deploying-services/fault-domain-awareness/), DC/OS supports fault domain awareness. If your cluster is configured over multiple regions or zones, it is possible to schedule your Metronome job to run in a remote region, or a specific zone.

# Local and remote regions

- The **local region** is the region running the Mesos master nodes.
- A **remote region** contains only Mesos agent nodes.

# Use

## Placement constraint guidelines

- If no region is specified in your job, jobs will be scheduled to run only in the local region. No job run will ever be scheduled for an agent outside of the local region unless you explicitly specify that they should be launched in a remote region.

- If you specify a region without a specific zone, jobs will run on any agent in the given region.

- If you specify both region and zone, jobs are run on any agent in the given region and zone, and not in any other region or zone.


## Examples

See "Installation" in [fault domain awareness and capacity extension for services](/1.13/deploying-services/fault-domain-awareness/) for instructions on how to configure a fault-domain aware cluster.

Suppose you have a Mesos cluster that spans 3 regions: `aws-us-east1`, `aws-us-east2`, and `local`. Each region has zones `a`,`b`,`c`,`d`.

### Run a job in a remote region and a specific zone

The following job uses [Metronome Constraints](../metronome-constraints/) to specify that a job should run in region `aws-us-east1`, zone `b`

```json
{
  "description": "Remote Sleeper",
  "id": "sleeper-remote",
  "run": {
    "cmd": "sleep 60",
    "cpus": 0.05,
    "mem": 32,
    "docker": {"image": "alpine"},
    "maxLaunchDelay": 3600,
    "placement": {
      "constraints": [
        {
          "attribute": "@region",
          "operator": "EQ",
          "value": "aws-us-east1"
        },
        {
          "attribute": "@zone",
          "operator": "EQ",
          "value": "b"
        },
      ]
    }
  }
}
```

