---
layout: layout.pug
navigationTitle: 功能成熟度
title: 功能成熟度
menuWeight: 10

excerpt: 了解 Mesosphere 的功能成熟度生命周期

enterprise: false
---


# <a name="lifecycle"></a>Mesosphere DC/OS 功能成熟度生命周期

Mesosphere DC/OS 功能将通过多阶段生命周期发展。此生命周期可用来确定某个特定功能是否以及何时用于部署的各个阶段。部署阶段包括但不限于开发、测试、评估或生产。为了确定是否应使用某项功能，应该根据下文所述的成熟度状态，认真审视使用该功能的后果。

功能可以包括应用程序、服务、框架、属于 Mesosphere DC/OS 或其目录一部分的组件或软件包。Mesosphere DC/OS 功能的五个成熟度状态在下文阐述，从左到右进行，从 Beta 开始并以“已停用”结束。

![五个成熟度状态](/cn/1.11/img/five_maturity_states.png)

图 1. 功能成熟度生命周期

<a name="beta"></a>
## Beta

标记为 Beta 的功能面向的是希望尽早接触特定功能的消费者。通常，这些功能主要用于评估和非生产测试目的或向 Mesosphere 提供反馈。

1. Beta 功能可用于客户或最终用户测试和提前验证功能和功能。
2. Beta 功能可能会出于任何原因而随时更改、中止或弃用。
3. Beta 功能仍在演变，可能包含漏洞、错误、缺陷，或者可能需要进一步增强。Beta 功能可能无法最终确定其能力或 API。
4. Beta 功能可能会有降低的或不同的安全性、合规性和隐私承诺。
5. Beta 功能可能会有降低的性能、可扩展性或能力承诺。
6. 不保证 Beta 功能能从 Beta 升级到 GA。
7. 关于 Beta 功能的反馈可根据测试、使用和经验，通过电子邮件、Slack 渠道或社区论坛等非标准渠道提供。

**注意**：对 Mesosphere DC/OS Enterprise 的 Beta 版本或功能的任何使用均受 [评估条款] 的约束(https://mesosphere.com/mesosphere-support-terms/)，所有其他条款均排除在外。

<a name="general_availability"></a>
## 一般可用性

建议使用所有消费者都可使用的(GA) 功能。在成熟度生命周期状态下的功能应被考虑用于任何客户部署状态，包括生产。

1. GA 功能可供客户测试、评估、应用程序开发和生产使用。
2. 可继续增强 GA 功能，并解决漏洞或缺陷。
3. API 修改将接受版本控制（V1、V2 等）。
4. 对于 DC/OS Enterprise 的客户，反馈和支持应通过 Mesosphere 服务支持条款中概述的方法进行。
5. 对于 DC/OS Open Source 的客户，反馈应通过社区渠道进行。
6. GA 功能修改或成熟度生命周期变更可见 [版本注释] (/1.11/release-notes/)。

<a name="deprecated"></a>
## 已弃用

已弃用的功能是指 Mesosphere 不再为其提供增强的功能。状态变化可能由于（但不限于）被较新/不同的功能所取代、行业转变或由于缺乏客户兴趣所致。这可能包括 Mesosphere DC/OS 的应用程序、框架、服务或组件，或者应用程序、框架、服务或组件的部件或访问方法（例如 API、CLI 命令）的版本。为使用较新的功能，应考虑迁移应用程序或 DC/OS 集群。

1. 不要期望对功能进行增强。
2. 可以根据各种因素（包括但不限于严重度、优先级，或者是否已被替代功能所解决），继续解决漏洞。

<a name="retired"></a>
## 已退役

已退役的功能是指已到达 Mesosphere DC/OS 中成熟度生命周期末尾的功能，但仍是产品的一部分。强烈建议使用退役功能的客户迁移并离开该退役功能，转而使用 GA 功能，因为 GA 是该功能仍然存在的 Mesosphere DC/OS 生命周期中的最后一个状态。

1. 不要期望对功能进行增强。
2. 不要期望漏洞或缺陷可以修复。

<a name="decommissioned"></a>
## 已停用

当前版本 DC/OS 中不再有用的已停用功能。该功能自那时起已从当前和未来版本的 DC/OS 中移除。

<a name="prior-lifecycle-stages"></a>
## 先前生命周期阶段

在 1.10 之前，GA 功能被称为稳定功能，Beta 功能被称为实验或预览功能。

<a name="not_a_warranty"></a>
## 不是产品保证

上述内容**不**构成产品保证。Mesosphere 对软件不承担任何明示或暗示的保证，并特此放弃软件包含的功能会满足用户的要求或者软件的运行不会被中断或无错误的任何保证。
