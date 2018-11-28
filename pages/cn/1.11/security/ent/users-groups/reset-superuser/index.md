---
layout: layout.pug
navigationTitle: 重置超级用户
title: 重置超级用户
menuWeight: 30
excerpt: 使用 DC/OS 重置超级用户脚本重置现有用户或创建新用户

enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

您可使用 DC/OS 重置超级用户脚本重置现有用户或创建新用户。如果超级用户帐户被锁定或无效，这将非常有用。

**先决条件：**您必须具有 DC/OS 集群的 SSH 访问权限。

1. [SSH](/cn/1.11/administering-clusters/sshcluster/) 到主节点，使用您选择的方法。

 例如：

    ```bash
    dcos node ssh --master-proxy --leader
    ```

1. 导航至 `/opt/mesosphere/active/bouncer/bouncer/bin/` 并运行 `reset-superuser` 脚本，用户名 (`<username>`) 。

    ```bash
    sudo /opt/mesosphere/bin/dcos-shell /opt/mesosphere/active/bouncer/bouncer/bin/reset-superuser <username>
    ```

1. 输入用户的新密码，然后按照提示完成步骤。

    ```bash
    Type superuser password:
    Retype superuser password:
    ```

 对于现有用户，输出应当类似：

    ```bash
    170518-22:11:11.630 INFO: Attempt to create user with uid `<username>`.
    170518-22:11:12.111 INFO: User already exists.
    170518-22:11:12.111 INFO: Update password for user with uid `<username>`.
    170518-22:11:12.597 INFO: Password updated.
    170518-22:11:12.597 INFO: Attempt to create ACL with rid `dcos:superuser`.
    170518-22:11:12.668 INFO: ACL already exists.
    170518-22:11:12.668 INFO: Attempt to create group with gid `superusers`.
    170518-22:11:12.735 INFO: Group already exists.
    170518-22:11:12.735 INFO: Attempt to assign superuser privileges to the superusers group.
    170518-22:11:12.803 INFO: Permission is already set.
    170518-22:11:12.803 INFO: Attempt to put uid `<username>` into the superusers group.
    170518-22:11:12.877 INFO: User added to group.
    170518-22:11:12.877 INFO: Done.
    ```
