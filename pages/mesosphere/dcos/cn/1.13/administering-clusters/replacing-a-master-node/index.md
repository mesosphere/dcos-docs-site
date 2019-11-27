---
layout: layout.pug
navigationTitle:  替换管理节点
title: 替换管理节点
menuWeight: 800
excerpt: 替换现有 DC/OS 群集中的管理节点
enterprise: true
render: mustache
model: /mesosphere/dcos/1.13/data.yml
---
您可以替换现有 DC/OS 群集中的管理节点。但是，请记住，一次只能替换一个管理节点。以下步骤总结了如何替换 DC/OS 群集的管理节点。

# 替换管理节点
1. 使用 Exhibitor、Guano 实用程序或自定义脚本备份 Zookeeper 状态信息。

    例如，如果您下载并提取 Guano 实用程序，您可以在管理节点上运行类似以下内容的命令：

    ```bash
    dcos-shell java -jar guano-0.1a.jar -u super -p secret -d / -o /tmp/mesos-zk-backup -s $ZKHOST:2181 && tar -zcvf zkstate.tar.gz /tmp/mesos-zk-backup/
    ```

    有关使用 Guano 实用程序备份 Zookeeper 的更多信息，请参阅 [如何使用 Guano 备份 Zookeeper？](/mesosphere/dcos/cn/1.13/installing/installation-faq/#zk-backup)

1. 通过在管理节点上运行类似于以下内容的命令，将 DC/OS 身份和访问管理 CockroachDB 数据库备份到文件中：

    ```bash
    dcos-shell iam-database-backup > ~/iam-backup.sql
    ```

    有关备份 DC/OS 身份和访问管理 CockroachDB 数据库的更多信息，请参阅 [如何备份 IAM 数据库？](/mesosphere/dcos/cn/1.13/installing/installation-faq/#iam-backup)

1. 关闭您想替换的管理节点。

1. 添加新管理节点以替换在上一步中下线的管理节点。

    **静态管理节点发现**

    如果您在 `config.yaml` 文件 (`master_discovery: static`) 中配置了 **静态管理节点发现**：
    - 验证新服务器是否具有与旧管理节点相同的内部 IP 地址。
    - 验证旧服务器是否完全无法从群集中访问。
    - 按正常方式安装新的管理节点。
    
    **动态管理节点发现**

    如果您在 `config.yaml` 文件 (`master_discovery: master_http_loadbalancer`) 中配置了 **动态管理节点发现**：
    - 按正常方式安装新的管理节点。

1. 检查新管理节点是否健康。

    <p class="message--important"><strong>重要信息：</strong>此步骤为必需的。先确保确认新管理节点已成功加入群集，然后再替换任何其他管理节点或执行任何其他管理任务。</p>
    
    要验证管理节点替换是否已成功完成，请按照 [升级管理节点 中所述的步骤来验证升级](/mesosphere/dcos/cn/1.13/installing/production/upgrading/)。
