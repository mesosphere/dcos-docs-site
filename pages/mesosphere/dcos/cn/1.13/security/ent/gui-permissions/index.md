---
layout: layout.pug
navigationTitle:  授予访问 UI 的权限
title: 授予访问 UI 的权限
menuWeight: 10
excerpt: 授予访问 DC/OS UI 的权限
render: mustache
model：/mesosphere/dcos/1.13/data.yml
enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


[新用户](/mesosphere/dcos/1.13/security/ent/users-groups/) 默认没有权限，无法查看 [DC/OS UI](/mesosphere/dcos/1.13/gui/)。您必须授予用户和组访问 Web 界面每个屏幕的权限。

<p class="message--important"><stribg></strong>重要信息：只有 <a href="/mesosphere/dcos/1.13/security/ent/perms-reference/#superuser">超级用户</a> 可以查看“仪表盘、节点和 <strong>群集 -> 概述</strong>”选项卡。</p>
