---
layout: layout.pug
navigationTitle: 发行说明
title: Edge-LB 发行说明
menuWeight: 0
excerpt: Edge-LB 1.1 的发行说明 v1.1.0
enterprise: false
---

这些是 Edge-LB 1.1 的发布说明。

# v1.1.0

2018 年 8 月 9 日发布。

## 值得注意的变化：

- 将池服务器使用的 HAProxy 从 1.7.6 更新为 1.8.12。请检查 [HAProxy CHANGELOG](http://git.haproxy.org/?p=haproxy-1.8.git;a=blob;f=CHANGELOG;hb=8a200c71bd0848752b71a1aed5727563962b3a1a)，以了解详情。
- 池服务器重载不再被永久连接阻止。
- 池服务器代码的稳定性、可调试性和可靠性得到改进。
- 池容器的大小降至 100MB ~ 250MB
- 转换为在池服务器上运行的 HAProxy 中的 Master/Worker 模式。如果使用自定义配置模板，则必须进行更新。即：
 - 模板不得指定 `daemon` 选项
 - 模板必须在 `stats socket` 选项中指定 `expose-fd listeners` 参数 
- Edge-LB 现在使用来自 DC/OS SDK `edgelb-pool` CLI 子命令的默认 CLI 包。相比 `edge-lb` 本地包，他们不支持 `version` 子命令。
- 提供 `mesosAuthNZ` 包安装选项，设置为 `false` 允许 Edge-LB 以 `disabled` 安全模式在 DC/OS 1.10 集群中运行 。

Shortlist：

```
$ git shortlog v1.0.3..HEAD
      sdk: Update SDK buildchain to 0.42.1
      sdk: replace stub cli for edgelb-pool with a default one
      sdk: Use SDK version in build.gradle from the env, localize it to `framework/` dir
      Bump pip requirements
      Force rebuilding of all the deps while checking if cli binary has changed
      Permit specifying custom linker flags to build_go_exe.sh
      Move dcos-commons tooling into git subrepo
      Extra debugging in ci-setup.sh script
      Add pytest cache to gitignore
      Makefile and Dockerfile should not be sent as context during lbmgr cont. build
      Update haproxy to 1.8.12
      Be more verbose with logging in order to boost debugging
      Use instance with more IOPS when running integration tests
      Do not wait for haproxy to finish reloading/for long-running connections
      Disable gosec linter
      Permit for disabling of Mesos Authorization via package-install option
```

## 已知限制

* Edge-LB 当前不支持 DC/OS 1.10 中的 `Strict` 安全模式， 但支持 DC/OS 1.11 中的 `Strict` 安全模式。
* Edge-LB 当前不支持自助配置；所有配置都必须集中处理。

## 已知问题

* 用户界面中出现的卸载 Edge-LB 的步骤不正确。遵循 [Edge-LB 卸载文档 中的步骤](/cn/services/edge-lb/1.1/uninstalling/)。
* 在 CenTos/RHEL 7.2 节点上运行的 Edge-LB（`/var/lib/mesos` 通过 ext4 进行格式化）可能存在连接问题。
* 如果池配置了无效的约束，那么该池将不会被正确创建，且不会尊重池的删除。必须手动删除。
