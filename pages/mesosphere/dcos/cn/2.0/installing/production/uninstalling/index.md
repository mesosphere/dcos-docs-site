---
layout: layout.pug
title: 卸载 DC/OS
navigationTitle: 卸载
menuWeight: 30
excerpt: 移除 DC/OS
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---

{{ model.techName }} 提供从用于系统中移除 {{ model.techName }} 的卸载脚本。要从某个管理节点、代理节点或公共节点移除 {{ model.techName }}，必须将卸载脚本推送到您希望刷新 {{ model.techName }} 的节点，使其可执行，然后使用 Sudo 权限运行此脚本。

在运行脚本之前，应确保群集不再需要此代理节点。

- 如果节点是管理节点，在卸载之前，应确保群集中至少有 3 个其他管理节点正常运行。

- 如果节点是专用或公共代理节点，则确保所有任务都已在其他地方重新部署。确保没有包含群集中服务所需数据的持久卷。

# 卸载 {{ model.techName }}

1. 下载脚本。您可以 [在此处](http://downloads.mesosphere.com/dcos-uninstall/uninstall.sh) 下载脚本。
1. 使其可执行：

    ```bash
    chmod a+x dcos_uninstall.sh
    ```
    
1. 利用 `sudo` 权限运行：
    
    ```bash
    sudo ./dcos_uninstall.sh
    ```


## 此脚本能做什么
此脚本将从名为 $HOSTNAME 的计算机上卸载所有 {{ model.techName }} 二进制文件、库和日志文件。

它将留下 [卸载日志](/var/log/dcos.uninstall.log) 后留下，其中详细说明了从机器中移除的所有文件。

- 运行卸载脚本后，机器处于可以再次清洁安装 {{ model.techName }} 的状态。
- 此脚本用于从管理节点和代理节点移除 {{ model.techName }}，不应用于卸载 bootstrap 节点。

## 此脚本不能做什么

如果在代理节点上运行此脚本，您应该优雅地停止此节点上的任何活动的工作负载。即使工作负载在运行，此脚本也会继续卸载 {{ model.techName }}。但是，那些活动的工作负载不能优雅地退出。另外，由于文件锁定问题，卸载程序可能无法删除活动工作负载的任何本地临时存储。文件移除时出现的任何错误都会记录在卸载程序日志中。

- 此脚本不会以任何方式卸载或更改 Docker。
- 此脚本不会修改可能用于安装或配置 {{ model.techName }} 的任何补充服务或包，例如：NTP、yum、firewalld、nginx、resolv.conf 等。
- 此脚本在完成后不会强制重启。它要求用户执行重启。
