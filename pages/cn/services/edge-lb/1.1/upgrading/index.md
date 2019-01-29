---
layout: layout.pug
navigationTitle: 升级池
title: 升级池 Edge-LB
menuWeight: 25
excerpt: 升级 Edge-LB 安装
enterprise: false
---

按照此程序执行 Edge-LB 升级。

1. 卸载 `apiserver`。

    ```bash
    dcos package uninstall edgelb --yes
    ```

1. 删除旧包软件库。

    ```bash
    dcos package repo remove edgelb-aws
    dcos package repo remove edgelb-pool-aws
    ```

1. 添加新的包软件库。

    ```bash
    dcos package repo add --index=0 edgelb-aws \
      https://<AWS S3 bucket>/stub-universe-edgelb.json
    dcos package repo add --index=0 edgelb-pool-aws \
      https://<AWS S3 bucket>/stub-universe-edgelb-pool.json
    ```

1. 安装新的 `apiserver`。使用在安装上一版本时创建的服务帐户；参阅 [Edge-LB 安装指南](/cn/services/edge-lb/1.1/installing/)，以了解更多信息。

    ```bash
    tee edgelb-options.json <<EOF
    {
      "service": {
        "secretName": "dcos-edgelb/edge-lb-secret",
        "principal": "edge-lb-principal",
        "mesosProtocol": "https"
      }
    }
    EOF
    dcos package install --options=edgelb-options.json edgelb
    ```

EdGelB 还需要指定以下选项。它们的值取决于其正在运行的集群的安全模式：

* `service.mesosProtocol`: `"https"` 针对宽容和严格安全模式， `"http"`（默认）针对禁用安全模式
* `service.mesosAuthNZ`: `true`（默认）针对宽容和严格安全模式， `false`针对禁用安全模式 参数从 v1.1 版本开始可用。


升级每个池。

```bash
dcos edgelb update <pool-file>
```
