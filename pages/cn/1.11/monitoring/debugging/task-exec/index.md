---
layout: layout.pug
navigationTitle: 使用 dcos task exec
title: 使用 dcos task exec
menuWeight: 20
excerpt: 在任务容器内使用 dcos task exec 命令
beta: true
enterprise: false
---

<!-- The source repo for this topic is https://github.com/dcos/dcos-docs-site -->


`dcos task exec` 命令允许您在任务的容器内执行任意命令，并将其输出返回到本地终端，以了解有关某个特定任务如何表现的更多信息。它提供了非常类似于 [`docker exec`](https://docs.docker.com/engine/reference/commandline/exec/) 体验，不需要 SSH 密钥。

要使用调试功能，必须使用 Mesos 容器运行时或通用容器运行时来启动服务或作业。调试不能用于用 Docker 运行时启动的容器。如需更多信息，请参阅 [使用 Mesos 容器化工具](/cn/1.11/deploying-services/containerizers/)。

您可以在下列模式下执行此命令。

- `dcos task exec <task-id> <command>`（无标记）：将 STDOUT 和 STDERR 作为原始字节从远程终端传输到本地终端。

- `dcos task exec --tty <task-id> <command>`：将 STDOUT 和 STDERR 从远程终端传输到本地终端，但不作为原始字节。相反，此选项将本地终端置于原始模式，分配远程伪终端 (PTY)，并通过远程 PTY 来传输 STDOUT 和 STDERR。

- `dcos task exec --interactive <task-id> <command>` 将 STDOUT 和 STDERR 从远程终端传输到本地终端，并将 STDIN 从本地终端传输到远程命令。

- `dcos task exec --interactive --tty <task-id> <command>`：将 STDOUT 和 STDERR 从远程终端传输到本地终端，并将 STDIN 从本地终端传输到远程终端。此外，还将本地终端置于原始模式，分配远程伪终端 (PTY)，并通过远程 PTY 传输 STDOUT、STDERR 和 STDIN。此模式提供最大功能。

有关 `dcos task exec` 命令的更多信息，请参阅 [CLI 参考部分](/cn/1.11/cli/command-reference/dcos-task/dcos-task-exec/)。

### 提示
- 为方便查看，我们已经包含了上述完整标记的文本，但每一个都可以缩短。不是输入 `--interactive`，您只需输入 `-i`。同样，不是输入 `--tty`，您只需输入 `-t`。
- 如果您的模式传输原始字节，您将无法启动 `vim` 等类似程序，因为这些程序需要使用控制字符。

# 快速入门

使用本指南开始使用 `dcos task exec` 调试命令。

**先决条件：**

- 使用 [DC/OS 通用容器运行时] 启动的容器(/1.11/deploying-services/containerizers/)

# 使用在容器内运行的命令传送输出

您可以使用 `dcos task exec` 命令在容器内运行命令。此例中，启动了一个长期运行的 Marathon 应用程序，然后使用 `dcos task exec` 命令获取运行此应用程序的节点的主机名。

1. 创建 Marathon 应用定义，并使用以下内容为其命名 `my-app.json`：

    ```bash
    {
       "id": "/my-app",
       "cmd": "sleep 100000000",
       "cpus": 1,
       "instances": 1
     }
    ```

1. 在 DC/OS 上部署服务：

    ```bash
    dcos marathon app add my-app.json
    ```

1. 使用此 CLI 命令获取作业的任务 ID：

    ```bash
    dcos task
    ```

 输出应与此类似：

    ```bash
    NAME        HOST        USER  STATE  ID                                               
    my-app      10.0.1.106  root    R    <task_id>
    ```

1. 运行此命令以显示运行应用程序的容器的主机名，其中 `<task-ID>` 是您的任务 ID。

    ```bash
    dcos task exec <task_id> hostname
    ```

 输出应与此类似：

    ```bash
    ip-10-0-1-105.us-west-2.compute.internal
    ```

有关 `dcos task exec` 命令的更多信息，请参阅 [CLI 参考部分](/cn/1.11/cli/command-reference/dcos-task/dcos-task-exec/)。

# 在任务容器内运行交互命令
您可以使用 `dcos task exec` 命令，在集群中的机器上运行交互命令。此例中，`dcos task exec` 命令用来将简单脚本从本地计算机复制到节点上的任务容器。然后使用 `dcos task exec` 命令对脚本进行管理。

1. 创建 Marathon 应用定义，并使用以下内容为其命名 `my-interactive-app.json`：

    ```bash
    {
       "id": "/my-interactive-app",
       "cmd": "sleep 100000000",
       "cpus": 1,
       "instances": 1
    }
    ```

1. 在 DC/OS 上部署应用程序：

    ```bash
    dcos marathon app add my-interactive-app.json
    ```

1. 使用此 CLI 命令获取应用程序的任务 ID：

    ```bash
    dcos task
    ```

 输出应与此类似：

    ```bash
    NAME                HOST        USER  STATE  ID                                               
    my-interactive-app  10.0.1.106  root    R    <task_id>
    ```

1. 用以下内容编写名为 `hello-world.sh` 的脚本：

    ```bash
    echo "Hello World"
    ```

1. 将脚本上传到任务容器：

    ```bash
    cat hello-world.sh | dcos task exec -i <task_id> bash -c "cat > hello-world.sh"
    ```

1. 提供文件可执行权限：

    ```bash
    dcos task exec <task_id> chmod a+x hello-world.sh
    ```
1. 在容器内运行脚本：

    ```bash
    dcos task exec <task_id> ./hello-world.sh
    ```

 输出应与此类似：

    ```bash
    Hello World
    ```

# 启动长期运行的交互式 Bash 会话

此例中，长期运行的 [作业](/cn/1.11/deploying-jobs/) 通过使用 `dcos job run` 命令来启动，`dcos task exec` 命令用于在该作业的容器内启动交互式 Bash shell。

1. 使用 DC/OS CLI 部署和运行作业：

 1. 创建以下应用定义并另存为 `my-job.json`。这将指定运行 `10000000` 秒的休眠作业。

        ```bash
        {
          "id": "my-job",
          "labels": {},
          "run": {
            "artifacts": [],
            "cmd": "sleep 100000000",
            "cpus": 0.01,
            "disk": 0,
            "env": {},
            "maxLaunchDelay": 3600,
            "mem": 32,
            "placement": {
              "constraints": []
            },
            "restart": {
              "policy": "NEVER"
            },
            "volumes": []
          }
        }
        ```

 1. 使用此 CLI 命令部署该作业：

        ```bash
        dcos job add my-job.json
        ```

 1. 验证作业是否已成功部署：

        ```bash
        dcos job list
        ```

 输出应类似于：

        ```bash
        ID      DESCRIPTION  STATUS       LAST SUCCESFUL RUN        
        my-job               Unscheduled         None
        ```

 1. 运行作业：

        ```bash
        dcos job run my-job
        ```

1. 使用此 CLI 命令获取作业的任务 ID：

    ```bash
    dcos task
    ```

 输出应与此类似：

    ```bash
    NAME                          HOST       USER  STATE  ID                                                                       
    20161209183121nz2F5.my-job    10.0.2.53  root    R    <task_id>
    ```

1. 使用规定的任务 ID (`<task_id>`) 在容器内启动一个进程，并将 TTY 附加到此进程。这将启动交互式 Bash 会话。

    ```bash
    dcos task exec --interactive --tty <task_id> bash
    ```

 您现在应该是位于运行交互式 Bash 会话 的容器内部。

    ```bash
    root@ip-10-0-2-53 / #
    ```

1. 从交互式 Bash 会话运行一个命令。例如 `ls` 命令：

    ```bash
    root@ip-10-0-1-104 / # ls
    bin   dev  home  lib64	     media  opt   root	sbin  sys  usr
    boot  etc  lib	 lost+found  mnt    proc  run	srv   tmp  var
    ```
 
### 提示 
您可以将简化缩写 `-i` 用于 `--interactive` 或将 `-t` 用于 `--tty`。此外，只有 `<task_id>` are required. For example, if your task ID is `exec-test_20161214195` and there are no other task IDs that begin with the letter `e`, this is valid command syntax: `dcos task exec -i -t e bash` 的起始唯一性字符。如需更多信息，请参阅 CLI 命令 [参考](/cn/1.11/cli/command-reference/)。
