---
layout: layout.pug
navigationTitle:  替换管理节点
title: 替换管理节点
menuWeight: 800
excerpt: 替换现有 DC/OS 群集中的管理节点
enterprise: true
render: mustache
model: /mesosphere/dcos/2.1/data.yml
---
您可以替换现有 DC/OS 群集中的管理节点。但是，请记住，一次只能替换一个管理节点。以下步骤概述了如何替换 DC/OS 群集的管理节点。


# 替换管理节点：
1. [备份 ZooKeeper](/mesosphere/dcos/cn/2.1/administering-clusters/backup-and-restore/backup-restore-cli/#zookeeper)。

1. 通过在管理节点上运行类似于以下内容的命令，将 DC/OS 身份和访问管理 CockroachDB&reg; 数据库备份到文件：

    ```bash
    dcos-shell iam-database-backup > ~/iam-backup.sql
    ```

    有关备份 DC/OS 身份和访问管理 CockroachDB 数据库的更多信息，请参阅 [如何备份 IAM 数据库？](/mesosphere/dcos/cn/2.1/installing/installation-faq/#iam-backup)

1. 备份 /var/lib/dcos/exhibitor-tls-artifacts（如果存在）。

    ```bash
    tar czf exhibitor-tls-artifacts.tar.gz /var/lib/dcos/exhibitor-tls-artifacts
    ```
1. 关闭您想替换的管理节点。

1. 添加新管理节点以替换在上一步中下线的管理节点。

    **静态管理节点发现**

    如果您在 `config.yaml` 文件 (`master_discovery: static`):) 中配置了 **静态管理节点发现**：
    - 验证新服务器是否具有与旧管理节点相同的内部 IP 地址。
    - 验证旧服务器是否完全无法从群集访问。
    - 将 exhibitor-tls-artifacts.tar.gz 复制到新管理节点。
        ```bash
        scp exhibitor-tls-artifacts.tar.gz root@<new-master-host>:/root
        ```
    - 提取管理节点上的存档
        ```bash
        tar xzf /root/exhibitor-tls-artifacts.tar.gz -C /
        ```
    - 按正常方式安装新的管理节点。
    
    **动态管理节点发现**

    如果您在 `config.yaml` 文件 (`master_discovery: master_http_loadbalancer`):) 中配置了 **动态管理节点发现**：
    - 按正常方式安装新的管理节点。

1. 检查新管理节点是否正常。

    <p class="message--important"><strong>重要信息：</strong>此步骤为必需的。确保确认新管理节点已成功加入群集，然后再替换任何其他管理节点或执行任何其他管理任务。</p>
    
    要验证管理节点替换是否已成功完成，请按照 [升级管理节点 中所述的步骤来验证升级](/mesosphere/dcos/cn/2.1/installing/production/upgrading/#dcos-masters).
