---
layout: layout.pug
navigationTitle: 发行说明
title: Marathon-LB 发行说明
menuWeight: 0
excerpt: Marathon-LB 发行说明 v1.12.0
---

# v1.12.0

## 值得注意的变化：

- 更新至 HAProxy 1.8.4
- 将重新加载机制更改为不使用 iptables hack，而是使用 HAProxy 1.8 特性

Shortlist：

```
$ git shortlog v1.11.3..HEAD
      Check for MESOS_TCP (#509)
      Add long backend proxypass path test (#499)
      Fix bug in config validation and reduce marathon calls (#563)
      Add missing parameter to regenerate_config call (#573)
      Merge beta features into master (bump to HAProxy 1.8.4) (#569)
      Fixed broken links (#568)
      Fix build status link (#548)
      Use multiple keyservers for gpg verify of tini during Docker build (#549)
      Work around python3 > dh-python > dkpg-dev > make dependency (#564)
      Https frontend grouping by vhost (#524)
      Fix ordering of acls that include paths when using haproxy map with https (#447)
      Adding MLB Integration Tests to CI (#570)
```

## 已知问题

* 现有自定义 `HAPROXY_HEAD` 模板将导致 v1.12.0 不能正常启动。请在您自定义的`HAPROXY_HEAD` 的全局部分删除 `daemon` 并添加 `stats socket /var/run/haproxy/socket expose-fd listeners` 以解决该问题。如需更多信息，请点击此处：[https://docs.mesosphere.com/services/marathon-lb/advanced/#global-template](https://docs.mesosphere.com/services/marathon-lb/advanced/#global-template)

# 先前版本

请访问 [https://github.com/mesosphere/marathon-lb/releases](https://github.com/mesosphere/marathon-lb/releases) 查看 v1.12.0 之前的发行说明。
