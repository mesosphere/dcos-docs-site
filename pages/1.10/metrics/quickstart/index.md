---
layout: layout.pug
navigationTitle:  Quick Start
title: Quick Start
menuWeight: 0
excerpt:
---


Use this guide to get started with the DC/OS metrics component. The metrics component is natively integrated with DC/OS and no additional setup is required.

**Prerequisites:** 

- You must have the [DC/OS CLI installed](/1.10/cli/install/) and be logged in as a superuser via the `dcos auth login` command.
  
1.  Optional: Deploy a sample Marathon app for use in this quick start guide. If you already have tasks running on DC/OS, you can skip this setup step.

    1.  Create the following Marathon app definition and save as `test-metrics.json`. 
        
        ```json
        {
          "id": "/test-metrics",
          "cmd": "/opt/mesosphere/bin/statsd-emitter",
          "cpus": 0.001,
          "instances": 1,
          "mem": 128
        }
        ```
    
    1.  Deploy the app with this CLI command:
        
        ```bash
        dcos marathon app add test-metrics.json
        ```

1.   To get the Mesos ID of the node that is running your app, run `dcos task` followed by `dcos node`. For example:
    
    1.  Running `dcos task` shows that host `10.0.0.193` is running the Marathon task `test-metrics.93fffc0c-fddf-11e6-9080-f60c51db292b`.
    
        ```bash
        dcos task
        NAME          HOST        USER  STATE  ID                                                  
        test-metrics  10.0.0.193  root    R    test-metrics.93fffc0c-fddf-11e6-9080-f60c51db292b  
        ```
    
    1.  Running `dcos node` shows that host `10.0.0.193` has the Mesos ID `7749eada-4974-44f3-aad9-42e2fc6aedaf-S1`.
    
        ```bash
        dcos node
         HOSTNAME       IP                         ID                    
        10.0.0.193  10.0.0.193  7749eada-4974-44f3-aad9-42e2fc6aedaf-S1  
        ```

1.  View metrics. 

    -   **<a name="container-metrics"></a>Container metrics for a specific task**
        
        For an overview of the resource consumption for a specific container, run this command:
    
        ```bash
        dcos task metrics summary <task-id>
        ```

        The output should resemble:
        
        ```bash
        CPU           MEM              DISK
        0.17 (1.35%)  0.01GiB (6.46%)  0.00GiB (0.00%)
        ```
    
    -   **<a name="task-metrics"></a>All metrics for a specific task**
 
        To get a detailed list of all metrics related to a task, run this command:
      
        ```bash
        dcos task metrics details <task-id>
        ```
        The output is a combination of container resource utilization and metrics transmitted by the workload. For example:
    
        ```bash
        NAME                                                   VALUE
        cpus.limit                                             0.10
        cpus.system.time                                       0.07
        cpus.throttled.time                                    34.75
        cpus.user.time                                         0.18
        disk.limit                                             0.00GiB
        disk.used                                              0.00GiB
        mem.limit                                              0.16GiB
        mem.rss                                                0.01GiB
        mem.swap                                               0.00GiB
        mem.total                                              0.01GiB
        statsd_tester.time.uptime                              4469331
        ```

        The CPU, disk, and memory statistics come from container data supplied by Mesos. The statsd_tester.time.uptime
        statistic comes from the application itself. 
   
    -   **<a name="host-metrics"></a>Host level metrics**

        As with task data, host-level metrics are available as a summary or a detailed table. To view host-level
        metrics, run this command:

        ```bash
        dcos node metrics details <mesos-id>
        ```
        
        The output will contain statistics about the available resources on the node and their utilization. For example:
        
        ```bash
        NAME                       VALUE      TAGS
        cpu.cores                  4
        cpu.idle                   99.56%
        cpu.system                 0.09%
        cpu.total                  0.34%
        cpu.user                   0.25%
        cpu.wait                   0.01%
        filesystem.capacity.free   134.75GiB  path: /
        filesystem.capacity.total  143.02GiB  path: /
        filesystem.capacity.used   2.33GiB    path: /
        filesystem.inode.free      38425263   path: /
        filesystem.inode.total     38504832   path: /
        filesystem.inode.used      79569      path: /
        load.15min                 0
        load.1min                  0
        load.5min                  0
        memory.buffers             0.08GiB
        memory.cached              2.41GiB
        memory.free                12.63GiB
        memory.total               15.67GiB
        process.count              175
        swap.free                  0.00GiB
        swap.total                 0.00GiB
        swap.used                  0.00GiB
        system.uptime              28627
        ```

    -   **<a name="script-metrics"></a>Programmatic use of metrics**

        All dcos-cli metrics commands may be run with the `--json` for use in scripts. For example:

        ```bash
        dcos node metrics summary <mesos-id> --json
        ```

        The output will show all the same data, but in JSON format, for convenient parsing:

        ```json
        [
          {
            "name": "cpu.total",
            "timestamp": "2018-04-09T23:46:16.834008315Z",
            "value": 0.32,
            "unit": "percent"
          },
          {
            "name": "memory.total",
            "timestamp": "2018-04-09T23:46:16.834650407Z",
            "value": 16830304256,
            "unit": "bytes"
          },
          {
            "name": "memory.free",
            "timestamp": "2018-04-09T23:46:16.834650407Z",
            "value": 13553008640,
            "unit": "bytes"
          },
          {
            "name": "filesystem.capacity.total",
            "timestamp": "2018-04-09T23:46:16.834373702Z",
            "value": 153567944704,
            "tags": {
              "path": "/"
            },
            "unit": "bytes"
          },
          {
            "name": "filesystem.capacity.used",
            "timestamp": "2018-04-09T23:46:16.834373702Z",
            "value": 2498990080,
            "tags": {
              "path": "/"
            },
            "unit": "bytes"
          }
        ]
        ```
