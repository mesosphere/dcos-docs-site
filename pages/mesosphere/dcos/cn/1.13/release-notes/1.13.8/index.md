---
layout: layout.pug
navigationTitle: 1.13.8 版本注释
title: 1.13.8 版本注释
menuWeight: 2
excerpt: DC/OS 1.13.8 版本的注释，包括开源归属和版本策略。
---
DC/OS&trade; 1.13.8 于 2020 年 3 月 19 日发布。

<p class="message--warning"><strong>警告：</strong>DC/OS 1.13.8 版本在其网络堆栈中存在一个严重错误。我们建议您不要下载或升级至 1.13.8 版本。相反，请<a href="https://docs.d2iq.com/mesosphere/dcos/1.13/release-notes/1.13.9/">在此</a>下载并升级至 1.13.9 版本。</p>
  
[button color="light" href="https://downloads.dcos.io/dcos/stable/1.13.8/dcos_generate_config.sh"]下载 DC/OS 开源[/button]

[button color="purple" href="https://downloads.mesosphere.com/dcos-enterprise/stable/1.13.8/dcos_generate_config.ee.sh"]下载 DC/OS Enterprise* [/button]

注册 DC/OS Enterprise 客户可以从 [支持网站]访问 DC/OS Enterprise 配置文件。(https://support.mesosphere.com/s/downloads). 对于新客户，请在尝试下载和安装 DC/OS Enterprise 版本之前，先联系销售代表或发送邮件至 <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a>

# 发布摘要
DC/OS 是一种分布式操作系统，使您可以在本地、云或混合群集环境中管理资源、应用程序部署、数据服务、网络和安全。

# DC/OS 

## 组件

DC/OS 1.13.8 包括以下组件版本：

- Apache&reg; Mesos&reg; 1.8.2-dev

### DC/OS 已修复和改进的问题

- 修复了在极少数情况下，用户将群集从 DC/OS 1.11 升级到 DC/OS 1.13 之后，无法再启动使用 UCR 容器化工具的任务的问题。(D2IQ-64507, COPS-5868)

- DC/OS 不再增加 `journald` 日志记录的速率限制。规模测试表明，增加限制可能会使 `journald` 过载，并对其他组件造成压力。每 30 秒 10000 条消息的默认值似乎可以出色地区分繁忙的组件和过度冗余的组件。(D2IQ-53763, COPS-5830)

- 修复了拉入 UCR 的镜像对 nvcr.io 不起作用的问题（缺少 'service'/'scope' 参数）。(D2IQ-63303, COPS-5804)

- 修复了在 DC/OS 升级之后，代理上的任务所使用的执行器资源被错误地计入配额的问题。(D2IQ-62519, COPS-5725)  

- DC/OS Admin Router 现在允许大型的文件包（最大为 32GB）被上传至包注册表。(D2IQ-61233, COPS-5615)

- 修改了运行前检查，以使用文件系统挂载名称，而不是文件系统设备名称。(D2IQ-59406)

- 修复了代理将任务标记为“完成”后立即将其标记为“失败”的问题 (D2IQ-62454，COPS-4995)

## Marathon

## 组件

DC/OS 1.13.8 包括以下 Marathon&trade; 组件：version:

- Marathon 1.8.239

### Marathon 已修复和改进的问题

- 从 plaintext /v2/tasks 端点的输出中移除了非主机可访问的容器端点。(MARATHON-8721, COPS-5791)

- 改进了排除逻辑，使其和不可访问、非活动的端点一样及时地进行评估。(MARATHON-8719, COPS-5617)
