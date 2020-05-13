---
layout: layout.pug
navigationTitle: 安全计算配置文件
title: 安全计算配置文件
menuWeight: 31
excerpt: 介绍如何配置 DC/OS 以使用 Linux 系统安全计算 (SECCOMP) 配置文件
render: mustache
model: /mesosphere/dcos/2.0/data.yml 
enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->
安全计算模式 (seccomp) 是一种 Linux 系统内核功能，用于限制正在运行的容器中的可用操作。seccomp() 系统调用对调用进程的 seccomp 状态起作用。您可以使用此功能来限制应用程序对底层系统的访问。

DC/OS 中的 seccomp 支持基于 Mesos 1.8，后者通过 UCR 容器化工具 [引入了配置 seccomp 的能力](http://mesos.apache.org/documentation/latest/isolators/linux-seccomp/)，为 DC/OS 上部署的服务提供更高的隔离度和安全性。DC/OS 内的默认 seccomp 配置文件可通过禁用 300 多个系统调用来为运行中的容器提供合理的默认值。

# 启用和禁用安全计算模式
默认情况下，DC/OS 安装时已启用安全计算模式。您可以通过使用 `mesos_seccomp_enabled=false` 安装 DC/OS 来选择不使用 seccomp。但是，在选择不使用之前，请记住，要使每个代理的安装与群集中的所有其他代理保持一致。只有高级用户才能进行偏离此策略的操作。

如果为 DC/OS 群集启用了 seccomp，则所有任务都将使用默认的 seccomp 配置文件在 seccomp 控制下启动，除非您明确配置任务以覆盖默认行为。

# 管理 seccomp 配置文件
DC/OS 使用 `/etc/dcos/mesos/seccomp/` 文件夹来管理 seccomp 配置文件，并提供一个名为“default.json”的默认配置文件，该默认配置文件定义了 [306 个受限制系统命令](https://github.com/dcos/dcos/blob/113b8abacfd6d517594f329b621aaf4641b535e7/gen/dcos-config.yaml#L532-L838)。

除默认配置文件外，还可以创建任意数量的其他配置文件。定义配置文件的文件名称被视为配置文件的名称。如果要将其他配置文件添加到一个代理，则务必在群集中的所有代理上共享相同的配置文件。

# 重新启动代理以使用 seccomp 配置文件
使用先前部署的代理在 DC/OS 系统群集上提供 seccomp 配置文件时，请牢记以下准则：
- 如果在新的或现有的 DC/OS 群集上启用 seccomp，必须重新启动代理进程，以使 seccomp 配置文件的配置生效。
- 如果要将代理从不带 seccomp 的 DC/OS 版本升级到带 seccomp 的 DC/OS 版本，必须重新启动该代理上的所有任务，以使其在 seccomp 配置文件下运行。
- 如果您选择将配置文件添加到已启用 seccomp 的 DC/OS 群集上的 seccomp 文件夹，则无需重新启动代理即可使用这些配置文件。

# 在 seccomp 下运行服务
在 DC/OS 上启用 seccomp 时，在 UCR 下运行的所有新创建的容器均在默认 seccomp 配置文件下启动。使用默认配置文件，不需要对服务配置进行任何更改。通过 Docker 容器化工具运行服务时，使用 seccomp 配置文件并不是配置选项。

可以使服务不选择在 seccomp 下运行。对于 Marathon 定义的服务，这可以通过在容器的 `LinuxInfo` 配置设置下定义 `seccomp` 对象中的 `unconfined=true` 来实现。例如：

```json
{
  "id": "/mesos-seccomp-app",
  "cmd": "sleep 1000",
  "cpus": 0.5,
  "mem": 32,
  "container": {
    "type": "MESOS",
    "linuxInfo": {
      "seccomp": {
        "unconfined": true
      }
    }
  }
}
```

通过使用 `unconfined` seccomp 设置来配置服务定义，容器将不会在 seccomp 下运行。这将允许容器执行默认 seccomp 配置文件所限制的任何 syscall。

也可以在默认设置以外的其他 seccomp 配置文件下运行服务定义。这可以通过在 seccomp 定义中为服务定义指定配置文件名称来实现。例如：

```json
{
  "id": "/mesos-seccomp-app",
  "cmd": "sleep 1000",
  "cpus": 0.5,
  "mem": 32,
  "container": {
    "type": "MESOS",
    "linuxInfo": {
      "seccomp": {
        "profileName": "relaxed.json",
        "unconfined" : false
      }
    }
  }
}
```

此服务定义要求它可能在其上启动的任何代理都具有一个名为 `relaxed.json` 的 seccomp 配置文件。当此容器在该代理上启动时，它将在 seccomp 控制下运行，并且在 `relaxed.json` 配置文件的配置中定义限制。此例中，服务不受 `default.json` seccomp 配置文件中定义的配置的限制。相反，该服务在自定义 `relaxed.json` 配置文件中定义的限制下运行。

# seccomp 下运行的结果
seccomp 是一种安全机制，可通过限制容器内部允许的 syscall 来减小对系统的攻击面。当容器在 seccomp 限制下运行时,如果尝试进行受限的调用，任务进程将失败。这由调度器的恢复机制来决定接下来将发生什么。例如，Marathon 将根据任务的失败重新调度任务，Metronome 将作业的运行记录为“失败”，但根据作业重试配置的设置，可能会或不会重新调度作业的运行。
