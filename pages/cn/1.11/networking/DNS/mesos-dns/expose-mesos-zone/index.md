---
layout: layout.pug
navigationTitle: 揭示外界 Mesos 区域
title: 揭示外界 Mesos 区域
menuWeight: 300
excerpt: 揭示 DC/OS 之外的 Mesos 区域

enterprise: false
---

<!-- The source repo for this topic is https://github.com/dcos/dcos-docs-site -->


有时您希望在 DC/OS 之外拥有可使用 DC/OS 集群之内 DNS 记录的服务。但是，DC/OS 用来揭示记录的 `.mesos` 域名不支持此操作。要启用此功能，您可以在集群之前放置一个 BIND 服务器。

每个 DC/OS 集群都有唯一的加密标识符。标识符的 zbase32 编码版本可在 UI 中于**概述**下找到。

此例中，使用了加密集群 ID `yor6tqhiag39y6cjkdd4w9uzo45qhku6ra8hl7hpr6d9ukjaz3jo`。


1. 在集群之前安装一个 BIND 服务器。

1. 为 DC/OS 管理节点创建一个与此类似的转发条目。

    ```
    zone "yor6tqhiag39y6cjkdd4w9uzo45qhku6ra8hl7hpr6d9ukjaz3jo.dcos.directory" {
            type forward;
            forward only;
            forwarders { 10.0.4.173; };  // <Master-IP-1;Master-IP-2;Master-IP-3>
    };
    ```

1. 将管理节点 IP (`<Master-IP>`) 替换为您自己管理节点 IP 的分号分隔列表。

1. 用您自己的加密集群 ID 替换示例加密集群 ID。



## 创建一个区域
现在，您可以创建您希望以此为别名的区域。您也可以跳过此步骤并 [使用现有区域](#existing)。

1. 在 `named.conf` 文件中创新一个区域条目。此例中，使用了 `contoso.com`：

    ```
    zone "contoso.com" {
            type master;
            file "/etc/bind/db.contoso.com";
    };
    ```

1. 填充区域文件：

    ```
    $TTL    604800
    @       IN      SOA     localhost. root.localhost. (
                                  1         ; Serial
                                  1         ; Refresh
                                  1         ; Retry
                                  1         ; Expire
                                  1 )       ; Negative Cache TTL
    ;
    @       IN      NS      localhost.
    @       IN      DNAME   mesos.yor6tqhiag39y6cjkdd4w9uzo45qhku6ra8hl7hpr6d9ukjaz3jo.dcos.directory.
    ```

## <a name="existing"></a>使用现有区域

- 要使用现有区域，请添加 DNAME 记录：

    ```
    @       IN      DNAME   mesos.yor6tqhiag39y6cjkdd4w9uzo45qhku6ra8hl7hpr6d9ukjaz3jo.dcos.directory.
    ```

 `@` 给区域的最高级取别名，例如 `contoso.com`。

- 要给高级域取别名，请在 DNAME 记录中指定该值。此例中，`foo` 的别名为 `foo.contoso.com`：

    ```
    foo       IN      DNAME   mesos.yor6tqhiag39y6cjkdd4w9uzo45qhku6ra8hl7hpr6d9ukjaz3jo.dcos.directory.
    ```
