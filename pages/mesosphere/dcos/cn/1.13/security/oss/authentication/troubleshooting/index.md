---
layout: layout.pug
navigationTitle: 故障排除
title: 排除身份认证故障 
excerpt: 在 DC/OS 中排除身份验证问题
render: mustache
model：/mesosphere/dcos/1.13/data.yml
menuWeight: 50
---
# 广告拦截器和 DC/OS UI

在测试期间，我们发现在某些广告拦截器（如 HTTP Switchboard 或 Privacy Badger）处于活动状态时加载 DC/OS UI 登录页面时出现问题。其他广告拦截器（如 uBlock Origin）也可以使用。

# 排除身份验证问题

## Admin Router

Admin Router 是唯一验证 DC/OS 认证令牌的实体。
要排除身份验证问题，请使用以下命令检查管理节点上的 Admin Router。

```bash
sudo journalctl -u dcos-adminrouter.service
```
