---
navigationTitle: 1.13.6 版本注释
title: 1.13.6 版本注释
menuWeight: 5
excerpt: DC/OS 1.13.6 版本的注释，包括开源归属和版本策略。
---
DC/OS 1.13.6 于 2019 年 11 月 7 日发布。

[button color="light" href="https://downloads.dcos.io/dcos/stable/1.13.6/dcos_generate_config.sh"]下载 DC/OS 开源[/button]

[button color="purple" href="https://downloads.mesosphere.com/dcos-enterprise/stable/1.13.6/dcos_generate_config.ee.sh"]下载 DC/OS Enterprise* [/button]

注册 DC/OS Enterprise 客户可以从 [支持网站]访问 DC/OS Enterprise 配置文件。(https://support.mesosphere.com/s/downloads). 对于新客户，请在尝试下载和安装 DC/OS Enterprise 版本之前，先联系销售代表或发送邮件至 <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a>


# 发布版摘要
DC/OS 是一种分布式操作系统，使您可以在本地、云或混合群集环境中管理资源、应用程序部署、数据服务、网络和安全。

# DC/OS 1.13.6 中已修复和改进的问题
<!-- The issues that have been fixed and improved in DC/OS 1.13.6 are grouped by feature, functional area, or component.  -->
- 修复了升级至最新版 MacOS Catalina 后，DC/OS 证书被识别为无效的问题。(DCOS-60264, DCOS-60205, COPS-5417)
- 修复了若 UCR 容器要被销毁，而该容器处于配置状态时，我们需要等待调配器完成配置后才能开始销毁容器的问题。这可能会导致容器在销毁时被卡住，或者可能会导致从同一镜像创建的后续容器在配置状态下被卡住的更严重问题。通过支持销毁处于配置状态的容器来解决这一问题，以使从同一镜像创建的后续容器不会受影响。(COPS-5285, MESOS-9964)
- 修复了从任务的提取程序收到很长的错误消息后，Marathon 会陷入崩溃循环的问题。(COPS-5365)
- 改善了 pod 的诊断问题。(DCOS_OSS-5616)
- 修复了在已存在将“密码”与作为键的新索引相结合的密钥的情况下添加新密钥会产生错误的问题。(COPS-4928)
