---
layout: layout.pug
navigationTitle:  Uninstalling Edge-LB
title: Uninstalling Edge-LB
menuWeight: 20
excerpt: Uninstalling the Edge-LB package

enterprise: false
---


**警告：** 请勿使用 GUI 或 CLI（Marathon）创建或销毁由 Edge-LB 管理的服务。操作必须仅通过 Edge-LB CLI 执行。

1. 删除池将自动卸载受管理的负载均衡器。使用此命令删除每个池。

    ```bash
    dcos edgelb pool delete <name>
    ```

1. 卸载 Edge-LB API 服务器。

    ```bash
    dcos package uninstall edgelb
    ```

1. 删除 Universe 软件库。

    ```bash
    dcos package repo remove edgelb-aws
    dcos package repo remove edgelb-pool-aws
    ```
