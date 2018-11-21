---
layout: layout.pug
navigationTitle: 快速启动
title: 日志记录快速入门
menuWeight: 0
excerpt: DC/OS 日志记录快速入门
beta: true
enterprise: false
---

使用本指南开始使用 DC/OS 日志记录。此处使用的许多命令在 [CLI 命令参考] 中有更全面的描述(/1.11/cli/command-reference/dcos-task/)。

**前提条件：**

- 您必须 [安装了] DC/OS 和 DC/OS CLI(/1.11/installing/)。
- 您必须以超级用户身份登录，或者已被授予对日志记录的用户访问权限。如需更多信息，请参阅 [访问系统和组件日志](/cn/1.11/monitoring/logging/access-component-logs/) 和 [访问任务日志](/cn/1.11/monitoring/logging/access-task-logs/)。

# 部署一个示例应用程序
部署一个示例 Marathon 应用程序供在本快速入门指南中使用。

1. 创建以下 Marathon 应用定义并另存为 `test-log.json`。

    ```json
    {
      "id": "/test-log",
      "cmd": "while true;do echo stdout;echo stderr >&2;sleep 1;done",
      "cpus": 0.001,
      "instances": 1,
      "mem": 128
    }
    ```

1. 使用此 CLI 命令部署该应用程序：

    ```bash
    dcos marathon app add test-log.json
    ```

1. 验证应用程序是否已成功部署，并记下任务 ID：

    ```bash
    dcos task test-log
    ```

 输出应类似于：

    ```bash
    NAME      HOST        USER  STATE  ID
    test-log  10.0.1.105  root    R    test-log.e69c4b2f-c255-11e6-a451-aa711cbcaa78
    ```

# 查看 Mesos 和 DC/OS 日志

您可以通过 DC/OS CLI `dcos task log` 命令来本地访问 Mesos `stderr` 和 `stdout` 日志。此例中，启动了一个任务，并访问 `stderr` 和 Mesos `stdout` 日志。

1. 运行此命令以查看 `stdout` 日志，其中 `<task_id>` 为任务 ID：

    ```bash
    dcos task log <task_id>
    ```

 输出应类似于：

    ```bash
    Thu Dec 15 00:49:10 2016 ip-10-0-1-177.us-west-2.compute.internal Command Executor (Task: test-log.2fc56009-c25d-11e6-81b2-9a5d88789ccd) (Command: sh -c 'while true;d...') [7131] stdout
    Thu Dec 15 00:49:11 2016 ip-10-0-1-177.us-west-2.compute.internal Command Executor (Task: test-log.2fc56009-c25d-11e6-81b2-9a5d88789ccd) (Command: sh -c 'while true;d...') [7131] stdout
    ```
1. 运行此命令以追踪日志，其中 `<task_id>` 为任务 ID：

    ```bash
    dcos task log --follow <task_id>
    ```

 这将创建一个与此类似的日志流：

    ```bash
    Wed Dec 14 16:50:12 2016 ip-10-0-1-177.us-west-2.compute.internal Command Executor (Task: test-log.2fc56009-c25d-11e6-81b2-9a5d88789ccd) (Command: sh -c 'while true;d...') [7131]: stdout
    Wed Dec 14 16:50:13 2016 ip-10-0-1-177.us-west-2.compute.internal Command Executor (Task: test-log.2fc56009-c25d-11e6-81b2-9a5d88789ccd) (Command: sh -c 'while true;d...') [7131]: stdout
    ```

1. 运行此命令以获取最后 5 个日志条目：

    ```bash
    dcos task log <task_id> --lines=5
    ```

 输出应类似于：

    ```bash
    Thu Dec 15 00:51:27 2016 ip-10-0-1-177.us-west-2.compute.internal Command Executor (Task: test-log.2fc56009-c25d-11e6-81b2-9a5d88789ccd) (Command: sh -c 'while true;d...') [7131] stdout
    Thu Dec 15 00:51:28 2016 ip-10-0-1-177.us-west-2.compute.internal Command Executor (Task: test-log.2fc56009-c25d-11e6-81b2-9a5d88789ccd) (Command: sh -c 'while true;d...') [7131] stdout
    Thu Dec 15 00:51:29 2016 ip-10-0-1-177.us-west-2.compute.internal Command Executor (Task: test-log.2fc56009-c25d-11e6-81b2-9a5d88789ccd) (Command: sh -c 'while true;d...') [7131] stdout
    Thu Dec 15 00:51:30 2016 ip-10-0-1-177.us-west-2.compute.internal Command Executor (Task: test-log.2fc56009-c25d-11e6-81b2-9a5d88789ccd) (Command: sh -c 'while true;d...') [7131] stdout
    Thu Dec 15 00:51:31 2016 ip-10-0-1-177.us-west-2.compute.internal Command Executor (Task: test-log.2fc56009-c25d-11e6-81b2-9a5d88789ccd) (Command: sh -c 'while true;d...') [7131] stdout
    ```

# 查看 Mesos 任务和系统日志

您可以使用 `dcos node log` 命令，查看任务或主机系统的日志。关于这些命令的更多信息可在 [CLI 命令参考] (/1.11/cli/command-reference/dcos-node/) 部分找到。

1. 运行此命令以查看领导 Mesos 管理节点日志：

    ```bash
    dcos node log --leader --lines 3
    ```

 输出应类似于：

    ```bash
    Thu Dec 15 00:29:28 2016 ip-10-0-6-165.us-west-2.compute.internal [10530] ip-10-0-6-165.us-west-2.compute.internal nginx: 10.0.6.72 - - [15/Dec/2016:00:29:28 +0000] "GET /service/marathon/v2/groups?_timestamp=1481761768409&embed=group.groups&embed=group.apps&embed=group.pods&embed=group.apps.deployments&embed=group.apps.counts&embed=group.apps.tasks&embed=group.apps.taskStats&embed=group.apps.lastTaskFailure HTTP/1.1" 200 1941 "http://joel-logg-elasticl-m6yuis5u674t-297942863.us-west-2.elb.amazonaws.com/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
    Thu Dec 15 00:29:29 2016 ip-10-0-6-165.us-west-2.compute.internal nginx [2929] 2016/12/15 00:29:29 [notice] 10530#0: *1136 [lua] auth.lua:131: validate_jwt_or_exit(): UID from valid JWT: `email@email.io`, client: 10.0.6.72, server: dcos.*, request: "GET /system/v1/logs/v1/range/?skip_prev=3 HTTP/1.1", host: "joel-logg-elasticl-m6yuis5u674t-297942863.us-west-2.elb.amazonaws.com"
    Thu Dec 15 00:29:29 2016 ip-10-0-6-165.us-west-2.compute.internal dcos-oauth [1505] time="2016-12-15T00:29:29Z" level=info msg="HTTP request received" method=GET uri="/acs/api/v1/users/youremail@email.io"
    ```

1. 运行此命令以查看 Mesos 代理节点 日志，其中节点 ID (`<node_id>`) 已指定：

    ```bash
    dcos node log --mesos-id=<node_id> --lines 3
    ```

 运行 `dcos task` 以确定哪个节点正在运行应用程序，然后运行 `dcos node` 以获取节点 ID。

 输出应类似于：

    ```bash
    Thu Dec 15 00:46:18 2016 ip-10-0-1-175.us-west-2.compute.internal mesos-agent [3284] I1215 00:46:18.794333  3315 http.cpp:288] HTTP GET for /slave(1)/state from 10.0.1.175:44661 with User-Agent='Mesos-State / Host: ip-10-0-1-175, Pid: 3023'
    Thu Dec 15 00:46:20 2016 ip-10-0-1-175.us-west-2.compute.internal mesos-agent [3284] I1215 00:46:20.800422  3319 http.cpp:288] HTTP GET for /slave(1)/state from 10.0.1.175:44661 with User-Agent='Mesos-State / Host: ip-10-0-1-175, Pid: 3023'
    Thu Dec 15 00:46:22 2016 ip-10-0-1-175.us-west-2.compute.internal spartan-env [2621] 00:46:22.575 [error] Lager event handler error_logger_lager_h exited with reason {'EXIT',{{badmatch,[<0.27147.0>,{info,{tcp_closed,#Port<0.9301>}},{wait_for_query,{state,#Port<0.9301>,{spartan_tcp_listener,{198,51,100,3}},ranch_tcp,<0.27148.0>}},exit,tcp_closed,state_functions,[{gen_statem,loop_event_result,9,[{file,"gen_statem.erl"},{line,978}]},{proc_lib,init_p_do_apply,3,[{file,"proc_lib.erl"},{line,247}]}]]},[{error_logger_lager_h,log_event,2,[{file,"/pkg/src/spartan/_build/default/lib/lager/src/error_logger_lager_h.erl"},{line,155}]},{gen_event,server_update,4,[{file,...},...]},...]}}
    ```

1. 运行这些命令以查看在领导者或代理节点上运行的组件的列表：

 - 领导者节点：

        ```bash
        dcos node list-components --leader
        ```

 输出应类似于：

        ```bash
        dcos-diagnostics.service
        dcos-adminrouter.service
        dcos-cosmos.service
        dcos-epmd.service
        dcos-exhibitor.service
        dcos-gen-resolvconf.service
        dcos-gen-resolvconf.timer
        dcos-history.service
        ...
        ```

 - 代理节点，其中您的节点 ID (`<mesos-id>`) 已指定：

       ```bash
       dcos node list-components --mesos-id=<mesos-id>
       ```

 输出应类似于：

       ```bash
       dcos-diagnostics.service
       dcos-diagnostics.socket
       dcos-adminrouter-agent.service
       dcos-docker-gc.service
       dcos-docker-gc.timer
       dcos-epmd.service
       dcos-gen-resolvconf.service
       ...
       ```

1. 运行此命令以查看 DC/OS 组件的领导管理节点组件日志。此例中，查询了 Marathon 组件日志：

    ```bash
    dcos node log --leader --component dcos-marathon.service
    ```

 输出应类似于：

    ```bash
    Thu Dec 15 00:34:08 2016 ip-10-0-6-165.us-west-2.compute.internal java [2541] [2016-12-15 00:34:08,121] INFO  Received status update for task test-log.2fc56009-c25d-11e6-81b2-9a5d88789ccd: TASK_RUNNING (Reconciliation: Latest task state) (mesosphere.marathon.MarathonScheduler$$EnhancerByGuice$$28056dde:Thread-296)
    Thu Dec 15 00:34:08 2016 ip-10-0-6-165.us-west-2.compute.internal java [2541] [2016-12-15 00:34:08,121] INFO  Received status update for task test-log.2fc56009-c25d-11e6-81b2-9a5d88789ccd: TASK_RUNNING (Reconciliation: Latest task state) (mesosphere.marathon.MarathonScheduler$$EnhancerByGuice$$28056dde:Thread-297)
    ...
    ```

