---
layout: layout.pug
navigationTitle: 同步
title: LDAP 同步 
menuWeight: 4
excerpt: LDAP 同步
enterprise: true
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->
# 背景

DC/OS Enterprise 支持 [通过 LDAP 进行基于目录的身份认证](/cn/1.12/security/ent/ldap/)。用户和用户组可以从外部目录导入 DC/OS IAM。查看[管理用户和组](/cn/1.12/security/ent/users-groups/)。

在较早版本的 DC/OS Enterprise 中，单击即可操作 LDAP 组导入和 LDAP 用户导入。如果用户已从外部目录中删除，则该用户将不会自动从 DC/OS IAM 中删除。同样，如果从目录导入“工程师”用户组，则必须将添加到该组的任何新用户明确添加到 DC/OS IAM。保持导入的用户和用户组在 DC/OS IAM 和目录之间同步对于大型组织的管理员来说是一项艰巨的任务。

在 DC/OS Enterprise v1.12 中，我们添加了自动 LDAP 同步功能。该功能默认处于启用状态，每 30 分钟运行一次。该功能旨在保持 IAM 用户、IAM 用户组以及它们之间的关系能够与外部目录同步。

**安全提示：** LDAP 同步功能会定期执行。有时您会修改外部目录，例如通过修改组成员身份或删除用户帐户来执行权限撤销。在某些情况下，这些更改必须在几秒钟内反映在 DC/OS IAM 中，而不是几分钟，因此不能选择等待下一个 LDAP 同步事件。对于这些情况，您必须对 DC/OS IAM 进行等效更改，而不是等待下一个 LDAP 同步事件。

# LDAP 同步程序
LDAP 同步仅适用于从外部目录导入的 IAM 用户和用户组。LDAP 同步的目的是让导入的用户和用户组镜像对应其在外部目录中的副本。

LDAP 同步程序从 IAM 收集用户集合、用户组和组成员资格详细信息，然后通过 LDAP 查询外部目录以查找相应的实体。接下来，它确定需要对 DC/OS IAM 执行哪些操作才能同步两个数据集。

程序的逻辑如下：
- 将从 IAM 中删除无法再在外部目录中找到的导入的 IAM 组。任何属于该组的用户都将独立保留 DC/OS IAM。
- 将从 IAM 中删除无法再在外部目录中找到的导入的 IAM 用户。
- 如果将用户“Alice”添加到外部目录中导入的“工程师”组，则将在 IAM 中创建新的“Alice”用户，并将其添加为现有“工程师”用户组的成员。如果先前已导入“Alice”用户，因此该用户已存在于 IAM 中，只需将其添加到“工程师”用户组即可。
- 如果用户“Alice”是导入的“工程师”组的成员，然后在外部目录中删除，则该用户将从 IAM 的“工程师”组中删除。未从 IAM 中删除用户。

**注意：** IAM 中的用户组与其在外部目录中的副本相关的策略都取决于他们的名称。因此，重命名外部目录中的用户组相当于删除该用户组并创建具有相同成员集合的新用户组。重命名外部目录中的用户组时要小心！

# 操作详情
LDAP 同步程序是由每个管理节点上的 DC/OS 组件执行的。它作为名为 `dcos-iam-ldap-sync.service` 的 systemd 服务运行，由 `dcos-iam-ldap-sync.timer` systemd 计时器装置定期触发。

该程序在与当前的 Mesos 首要节点对应的 DC/OS 管理节点上运行。如果该管理节点发生故障并由此触发 Mesos 领导人重新选举，则将在与新选中的 Mesos 首要节点相对应的管理节点上执行 LDAP 同步程序。

LDAP 同步的每次运行都将详细记录到 `systemd` 日志中。可以通过检查与 Mesos 首要节点对应的 DC/OS 管理节点上的记录来检查这些记录。

安装时可配置确切的时长。请参阅 [高级配置](/cn/1.12/installing/production/advanced-configuration/)下的 [配置参考](/cn/1.12/installing/production/advanced-configuration/configuration-reference/)。
