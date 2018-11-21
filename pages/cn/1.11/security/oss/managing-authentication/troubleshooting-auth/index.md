---
layout: layout.pug
navigationTitle: 排除身份认证故障
menuWeight: 23
excerpt: 排除 DC/OS 开源部署中的身份认证问题
title: 排除身份认证故障
---
## 广告拦截器和 DC/OS UI

在测试期间，我们发现在某些广告拦截器（如 HTTP Switchboard 或 Privacy Badger）处于活动状态时加载 DC/OS UI 登录页面时出现问题。其他广告拦截器（如 uBlock Origin）是可以被确定是可以使用的。

## 调试 

要调试身份认证问题，请使用以下命令检查 Admin Router 和管理节点上的`dcos-oauth`日志。

```bash
sudo journalctl -u dcos-adminrouter.service
sudo journalctl -u dcos-oauth.service
```

