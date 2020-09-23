---
layout: layout.pug
navigationTitle: 1.13.5 版本注释
title: 1.13.5 版本注释
menuWeight: 10
excerpt: DC/OS 1.13.5 版本的注释，包括开源归属和版本策略。
---
DC/OS 1.13.5 于 2019 年 10 月 2 日发布。

[button color="light" href="https://downloads.dcos.io/dcos/stable/1.13.5/dcos_generate_config.sh"]下载 DC/OS 开源[/button]

[button color="purple" href="https://downloads.mesosphere.com/dcos-enterprise/stable/1.13.5/dcos_generate_config.ee.sh"]下载 DC/OS Enterprise* [/button]

注册 DC/OS Enterprise 客户可以从 [支持网站]访问 DC/OS Enterprise 配置文件。(https://support.mesosphere.com/s/downloads). 对于新客户，请在尝试下载和安装 DC/OS Enterprise 版本之前，先联系销售代表或发送邮件至 <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a>


# 发布版摘要
DC/OS 是一种分布式操作系统，使您可以在本地、云或混合群集环境中管理资源、应用程序部署、数据服务、网络和安全。

- 更新到 Mesos [1.8.2-dev](https://github.com/apache/mesos/blob/adc958f553c3728aab5529de56b0ddc30c0f9b68/CHANGELOG)

- 更新到 Marathon 1.8.227。


# DC/OS 1.13.5 中已修复和改进的问题
<!-- The issues that have been fixed and improved in DC/OS 1.13.5 are grouped by feature, functional area, or component.  -->
- Marathon：修复了若 Mesos 尝试创建预留时发生故障，服务可能会卡住的漏洞。(MARATHON-8693) 
- [enterprise]更新了 `dcos-backup` ，以支持通过 Admin Router 访问 Exhibitor。当 [Exhibitor 双向 TLS 认证](/mesosphere/dcos/1.13/security/ent/tls-ssl/exhibitor/) 被启用时就需要。(DCOS-57704)[/enterprise]
- Metronome：安装后配置现在可添加到 `/var/lib/dcos/metronome/environment`。(DCOS_OSS-5509)
- Mesos 覆盖网络：添加了用于从“状态”移除代理的 HTTP 端点。(DCOS_OSS-5536, COPS-5281)
- Admin Router：通过忽略具有错误指定 `DCOS_SERVICE_PORT_INDEX` 值的 Marathon 应用程序，提高了服务路由的稳健性。(COPS-5147, DCOS_OSS-5491)
- 在 DC/OS 版本 1.13.4 中，严格的卷名称验证不够宽松；该问题已经解决。(MARATHON-8697, MARATHON-8681, COPS-5219)
- Mesos：修复了 Docker/命令执行器在两个终端任务状态更新之间的竞争条件。(COPS-4995, MESOS-9887)


## 诊断
- [enterprise]减少了诊断捆绑包中的存储日志量。(DCOS-58314)[/enterprise]
- 诊断捆绑包：添加了性能得到改进的 REST API。(DCOS_OSS-5098)
- 诊断捆绑包：修复了即使在作业完成后，捆绑包创建作业的持续时间依旧显示增加的漏洞。(DCOS_OSS-5494)



