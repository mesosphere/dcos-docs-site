---
layout: layout.pug
navigationTitle: 使用 Nagios 监控
title: 使用 Nagios 监控
menuWeight: 0
excerpt: 使用 Nagios 监控 DC/OS 集群

enterprise: false
---


Nagios 是分布式主机的常用监控框架。本指南介绍如何使用 [NRPE] 通过 [Nagios Core 4x] (https://assets.nagios.com/downloads/nagioscore/docs/nagioscore/4/en/monitoring-linux.html) 监控 DC/OS 集群(https://assets.nagios.com/downloads/nagioscore/docs/nagioscore/4/en/addons.html#nrpe)。

## 安装
本指南假设您已安装且为集群配置了 Nagios。以下是流行配置管理套件的链接：

- 木偶模块：[thias/nagios](https://forge.puppet.com/thias/nagios)
- 厨师食谱：[schubergphilis/nagios](https://github.com/schubergphilis/nagios)
- 手动安装：[nagios.org/documentation](https://www.nagios.org/documentation/)

### 建议

1. 使用 SSL

 Nagios 的 NRPE 插件让您可以使用 SSL 来设置 server-daemon 接口。出于安全考虑，我们建议您这样做。

2. 轻量级检查

 最常见的 Nagios 实现错误是构建过度复杂的脚本，而这些脚本不会注意检查所需的资源。这可能会影响集群的性能。确保您的检查清洁，需要较少的资源开销，并充分利用其被催生的过程（例如，不将 `grep` 传输至 `awk`）。

3. 通过 DC/OS 运行 Nagios

 我们***不建议***通过 DC/OS 运行 Nagios。在您正在监控的集群上运行监控平台存在固有缺陷：如果集群出问题，监控平台也会出问题。

## 监控内容

在集群上安装 Nagios 并配置了 NRPE 插件后，您可以构建脚本以监控 DC/OS 的资源健康状况。

### `systemd` 装置

DC/OS 仅在 `systemd` 上运行。使用 Nagios 来跟踪装置很容易。您可以使用 NRPE 远程检查的一个流行脚本，如 [jonschipp/nagios-plugins/check_service.sh](https://github.com/jonschipp/nagios-plugins/blob/master/check_service.sh)，或者设计您自己的脚本。

虽然代理节点和管理节点的装置不同，但您可以很容易确定监控哪些装置而不对它们进行硬编码（因为它们易于更改或添加）。通过添加简单的包装器来修改 [jonschipp/nagios-plugins/check_service.sh](https://github.com/jonschipp/nagios-plugins/blob/master/check_service.sh)，以便仅监控 DC/OS 装置：

```bash
# cat dcos_unit_check.sh
#!/bin/bash
for unit in `ls /etc/systemd/system/dcos.target.wants`; do
  echo "Checking $unit"
  ./check_service.sh -s ${unit} > /dev/null 2>&1
  STATUS=$?
  if [ "${STATUS}" -ne 0 ]; then
    echo "Status for $unit is not 0, got $STATUS"
    exit $STATUS
  fi
done
```

如果组件服务（如 Admin Router）不健康，此脚本将引发故障：

```bash
ip-10-0-6-126 core # ./dcos_unit_check.sh
Checking dcos-adminrouter-reload.service
Status for dcos-adminrouter-reload.service is not 0, got 2
```

### Docker

通过 Nagios 监控 Docker 可能很棘手，因为有许多方面要照顾到。如果您的目的是检查服务是否可用且运行（例如，Docker 服务是否根据 `systemd` 在运行、启用且健康），我们建议使用 NRPE 脚本。

如果您打算监控容器内部的情况，我们建议您运行一项服务，如 [cAdvisor](https://github.com/google/cadvisor)。
