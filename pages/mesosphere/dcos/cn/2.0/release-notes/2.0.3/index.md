---
layout: layout.pug
navigationTitle: 2.0.3 版本注释
title: 2.0.3 版本注释
menuWeight: 0
excerpt: DC/OS 2.0.3 版本的注释，包括开源归属和版本策略。
---
DC/OS&trade; 2.0.3 于 2020 年 4 月 9 日发布。

<p class="message--warning"><strong>警告：</strong>DC/OS 2.0.3 版本在 Metronome 中存在升级后现有作业会丢失的严重错误。有关详细信息，请参阅 <a href="https://support.d2iq.com/s/article/Known-Issue-Critical-Metronome-Issue-in-DC-OS-2-0-3-D2IQ-2020-0004">产品咨询</a>。我们建议您不要下载、安装或升级至 2.0.3 版本。相反，请<a href="/mesosphere/dcos/2.0/release-notes/2.0.2/">在此</a>下载并升级至 2.0.2 版本。</p>

[button color="light" href="https://downloads.dcos.io/dcos/stable/2.0.3/dcos_generate_config.sh"]下载 DC/OS 开源[/button]

[button color="purple" href="https://downloads.mesosphere.com/dcos-enterprise/stable/2.0.3/dcos_generate_config.ee.sh"]下载 DC/OS Enterprise* [/button]

注册 DC/OS Enterprise 客户可以从 [支持网站]访问 DC/OS Enterprise 配置文件。(https://support.mesosphere.com/s/downloads). 对于新客户，请在尝试下载和安装 DC/OS Enterprise 版本之前，先联系销售代表或发送邮件至 <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a>

# 发布摘要
DC/OS 是一种分布式操作系统，使您可以在本地、云或混合群集环境中管理资源、应用程序部署、数据服务、网络和安全。

# DC/OS 

## 组件

DC/OS 2.0.3 包括以下组件版本：

- Apache&reg; Mesos&reg; 1.9.1-dev
- OpenSSL 1.1.1d	

### DC/OS 已修复和改进的问题

- 修复了拉入 UCR 的镜像对 nvcr.io 不起作用的问题（缺少 ‘service’/‘scope’ 参数）。(COPS-5804)
- 修复了在 DC/OS 升级之后，代理上的任务所使用的执行器资源被错误地计入配额的问题。(COPS-5725)
- DC/OS Admin Router 现在允许大型的文件包（最大为 32GB）被上传至包注册表。(D2IQ-61233, COPS-5615)
- 修复了在极少数情况下，用户升级群集之后，无法再启动使用 UCR 容器化工具的任务的问题。(D2IQ-64507, COPS-5868)
- 修复了代理将任务标记为“完成”后立即将其标记为“失败”的问题 (D2IQ-62454，COPS-4995)

## Marathon

## 组件

DC/OS 2.0.3 包括以下 Marathon&trade; 组件：version:

- Marathon 1.9.136
- Metronome 0.6.41

### Marathon 已修复和改进的问题

- 改进了排除逻辑，使其和不可访问、非活动的端点一样及时地进行评估。(COPS-5617)
- Marathon 1.5 中的 `/v2/tasks` 明文输出以不可用的方式返回容器网络端点。(MARATHON-8721)
- 在部署过程中解析丢失的 Docker 镜像时，Marathon 启动了太多任务。(DCOS_OSS-5679)
- Marathon 会忽略处于 `TASK_UNKOWN` 状态的任务的 Pod 状态报告。(MARATHON-8710)
- Marathon 在终止和扩展操作时，会检查不相关应用程序的授权；该问题已解决。(MARATHON-8731)

### Metronome 已修复和改进的问题

 - 在某些情况下，对于有些输入，项目 ID 的 regex 验证效率不高。Regex 已得到优化。(MARATHON-8730)
