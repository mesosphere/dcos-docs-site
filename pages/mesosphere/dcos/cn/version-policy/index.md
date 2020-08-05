---
layout: layout.pug
navigationTitle:  版本政策
title: 版本政策
menuWeight: 5
excerpt: DC/OS 版本生命周期和兼容性矩阵
render: mustache
model: /mesosphere/dcos/data.yml
---

版本策略页面已于 2019 年 10 月 21 日更新。

# Mesosphere DC/OS 版本生命周期和兼容性矩阵

此页面向 Mesosphere 客户、合作伙伴、用户和 Mesosphere DC/OS 的操作人员说明对发布版本中的更改所指定的软件产品进行的修改或增强。发布版本提供对所有已发布 API 的向后兼容。本文件中概述的指南适用于 DC/OS 版本以及其目录包。

## DC/OS 版本生命周期

Mesosphere 测试具有特定组件和操作系统的 DC/OS Enterprise，如 [DC/OS 版本兼容性矩阵](#version-compatibility-matrix) 中所涵盖。此测试在 [DC/OS 平台互操作性矩阵](#dcos-platform-version-compatibility-matrix) 中提供。<a href="https://mesosphere.com/mesosphere-support-terms/">Mesosphere 服务支持条款</a>中定义了根据许可和支持协议为客户提供的支持服务。

### 版本控制定义

- **主要版本** (**X**.y.z) 是用于提供主要和次要功能以及对现有功能进行改进或优化的版本。它们包含了在早期主要、次要和维护版本中所做的所有适用的错误修复。
- **次要版本** (x.**Y**.z) 是用于提供次要功能、对现有功能进行改进或优化以及错误修复的版本。它们包含了在早期次要和维护版本中所做的所有适用的错误修复。
- **维护版本** (x.y.**Z**) 是用于提供错误修复的版本，这些错误修复对许多客户有很大的影响，并且他们无法等待下一个主要或次要版本。它们包含了在之前的维护版本中所做的所有适用的错误修复。
- **“寿命终止 (EOL)”** 版本不再受 Mesosphere 支持，强烈建议升级到之后的版本。

### 版本生命周期

Mesosphere 将根据 <a href="https://mesosphere.com/mesosphere-support-terms/">Mesosphere 服务支持条款</a>（针对特定版本的 Mesosphere DC/OS）中概述的当前协议为客户提供支持服务。虽然 Mesosphere DC/OS 版本兼容性矩阵中概述了这些版本，但它们遵循一个特定的模型，以确定支持哪些版本。该模型遵循 N-2（针对主要和次要版本）和 N-4（针对维护版本）规格。因此，Mesosphere 应为这些 DC/OS 版本提供支持服务：当前版本、N 版本或之后最多两个次要版本。<br> 

 主要和次要版本的示例如下：

* **主要版本**：提供新的 DC/OS 主要版本 2.0.0 后，将不支持先前 (N-1) 主要版本的 (N-2) 次要版本之前的维护版本。主要版本也包括在次要版本的计数中。<br> 

因此，在 2.0.0 版本（其中 1.13.4 和 1.12.5 可用）发布时：
   - 将支持次要版本 1.13.2（1.13.4 和 - 2），而旧版本 (1.13.1) 不再受支持。
   - 将支持次要版本 1.12.3（1.12.5 和 - 2），而旧版本 (1.12.2) 不再受支持。

* **次要版本**：提供新的 DC/OS 次要版本 1.11.0 后，将不再支持 1.8.0 以及 1.8.0 之前的次要版本，因为 (N-2) 包含 1.11 (N)、1.10 (N-1) 和 1.9 (N-2)。
* **维护版本**：提供 DC/OS 维护版本 1.10.5 后，将不再支持 1.10.0 以及 1.10.0 之前的维护版本，因为 (N-4) 包含 1.10.5 (N)、1.10.4 (N-1)、1.10.3 (N-2)、1.10.2 (N-3) 和 1.10.1 (N-4)。<br> 

## DC/OS 平台版本兼容性矩阵

DC/OS 将在经过测试的平台组件和操作环境下运行。平台组件和操作环境的支持矩阵列表如下：

##### [CentOS 支持矩阵](#CentOS-support-matrix)
##### [RHEL 支持矩阵](#RHEL-support-matrix)
##### [Oracle Linux 支持矩阵](#Oracle-support-matrix)
##### [Ubuntu 支持矩阵](#Ubuntu-support-matrix)

在非支持的平台组件上运行 DC/OS 的客户应升级到受支持的组件。为清楚起见，Mesosphere 仅根据书面协议为付费客户提供支持服务。Mesosphere 文件中的术语“受支持”是指指定的软件组件是否已经过兼容性测试。

### <a name="CentOS-support-matrix"></a>CentOS 支持矩阵
<table class="table">
    <tr>
    <th><strong>平台组件</strong></th>
    <th><strong>DC/OS 2.0 最新稳定版</strong></th>
    <th><strong>DC/OS 1.13 最新稳定版</strong></th>
    <th><strong>DC/OS 1.12 最新稳定版</strong></th>
    </tr>
    <tr>
        <td>CentOS 8.0</td>
        <td><p style="text-align: center;">Docker CE 18.09.1</p></td>
        <td><p style="text-align: center;">Docker CE 18.09.1</p></td>
        <td><p style="text-align: center;">Docker CE 18.09.1</p></td>
    </tr>
    <tr>
        <td>CentOS 7.7</td>
        <td><p style="text-align: center;">Docker CE 19.03.5<br> Docker CE 18.09.9</p></td>
        <td><p style="text-align: center;">Docker CE 19.03.5<br> Docker CE 18.09.9</p></td>
        <td><p style="text-align: center;">Docker CE 19.03.5<br> Docker CE 18.09.9</p></td>
    </tr>
    <tr>
        <td>CentOS 7.6</td>
        <td><p style="text-align: center;">Docker CE 19.03.5<br> Docker CE 18.09.9</p></td>
        <td><p style="text-align: center;">Docker CE 19.03.5<br> Docker CE 18.09.9</p></td>
        <td><p style="text-align: center;">Docker CE 19.03.5<br> Docker CE 18.09.9</p></td>
    </tr>
</table>

### <a name="RHEL-support-matrix"></a>RHEL 支持矩阵
<table class="table">
    <tr>
    <th><strong>平台组件</strong></th>
    <th><strong>DC/OS 2.0 最新稳定版</strong></th>
    <th><strong>DC/OS 1.13 最新稳定版</strong></th>
    <th><strong>DC/OS 1.12 最新稳定版</strong></th>
    </tr>
    <tr>
        <td>RHEL 8.0</td>
        <td><p style="text-align: center;">Docker CE 18.09.1</p></td>
        <td><p style="text-align: center;">Docker CE 18.09.1</p></td>
        <td><p style="text-align: center;">Docker CE 18.09.1</p></td>
    </tr>
    <tr>
        <td>RHEL 7.7</td>
        <td><p style="text-align: center;">Docker CE 19.03.5<br> Docker CE 18.09.9</p></td>
        <td><p style="text-align: center;">Docker CE 19.03.5<br> Docker CE 18.09.9</p></td>
        <td><p style="text-align: center;">Docker CE 19.03.5<br> Docker CE 18.09.9</p></td>
    </tr>
    <tr>
        <td>RHEL 7.6</td>
        <td><p style="text-align: center;">Docker CE 19.03.5<br> Docker CE 18.09.9</p></td>
        <td><p style="text-align: center;">Docker CE 19.03.5<br> Docker CE 18.09.9</p></td>
        <td><p style="text-align: center;">Docker CE 19.03.5<br> Docker CE 18.09.9</p></td>
    </tr>
</table>

### <a name="Ubuntu-support-matrix"></a>Ubuntu 支持矩阵
<table class="table">
    <tr>
    <th><strong>平台组件</strong></th>
    <th><strong>DC/OS 2.0 最新稳定版</strong></th>
    <th><strong>DC/OS 1.13 最新稳定版</strong></th>
    <th><strong>DC/OS 1.12 最新稳定版</strong></th>
    </tr>
    <tr>
        <td>Ubuntu 18.04.3 LTS</td>
        <td><p style="text-align: center;">Docker CE 19.03.5<br> Docker CE 18.09.9</p></td>
        <td><p style="text-align: center;">Docker CE 19.03.5<br> Docker CE 18.09.9</p></td>
        <td><p style="text-align: center;">Docker CE 19.03.5<br> Docker CE 18.09.9</p></td>
    </tr>
    <tr>
        <td>Ubuntu 16.04.6 LTS</td>
        <td><p style="text-align: center;">Docker CE 19.03.5<br> Docker CE 18.09.9</p></td>
        <td><p style="text-align: center;">Docker CE 19.03.5<br> Docker CE 18.09.9</p></td>
        <td><p style="text-align: center;">Docker CE 19.03.5<br> Docker CE 18.09.9</p></td>
    </tr>
</table>

### <a name="Oracle-support-matrix"></a>Oracle 支持矩阵
<table class="table">
    <tr>
    <th><strong>平台组件</strong></th>
    <th><strong>DC/OS 1.13 最新稳定版</strong></th>
    <th><strong>DC/OS 1.12 最新稳定版</strong></th>
    </tr>
    <tr>
        <td>Oracle Linux 7.6 </td>
        <td><p style="text-align: center;">Docker CE 18.09.2<br> Docker EE 18.09.2</p></td>
        <td><p style="text-align: center;">Docker CE 18.09.2<br> Docker EE 18.09.2</p></td>
    </tr>
    <tr>
        <td>Oracle Linux 7.5 </td>
        <td><p style="text-align: center;">Docker CE 18.09.2<br> Docker EE 18.09.2</p></td>
        <td><p style="text-align: center;">Docker CE 18.09.2<br> Docker EE 18.09.2</p></td>
    </tr>
    <tr>
        <td>Oracle Linux 7.4 </td>
        <td><p style="text-align: center;">Docker CE 18.09.2<br> Docker EE 18.09.2</p></td>
        <td><p style="text-align: center;">Docker CE 18.09.2<br> Docker EE 18.09.2</p></td>
    </tr>
</table>

### <a name="CoreOS-support-matrix"></a>CoreOS 支持矩阵
注意：从 DC/OS 2.0 开始，我们已停止对 CoreOS 的支持，并且不再将其视为合格的操作系统。该图表显示最终合格版 CoreOS 的最终合格版 DC/OS。
<table class="table">
    <tr>
    <th><strong>平台组件</strong></th>
    <th><strong>DC/OS 1.13 最新稳定版</strong></th>
    <th><strong>DC/OS 1.12 最新稳定版</strong></th>
    </tr>
    <tr>
        <td>CoreOS 2079.3.0</td>
        <td><p style="text-align: center;">Docker CE 18.06.3</p></td>
        <td><p style="text-align: center;">Docker CE 18.06.3</p></td>
    </tr>
    <tr>
        <td>CoreOS 2023.5.0</td>
        <td><p style="text-align: center;">Docker CE 18.06.1</p></td>
        <td><p style="text-align: center;">Docker CE 18.06.1</p></td>
    </tr>
    <tr>
        <td>CoreOS 2023.4.0</td>
        <td><p style="text-align: center;">Docker CE 18.06.1</p></td>
        <td><p style="text-align: center;">Docker CE 18.06.1</p></td>
    </tr>
</table>

## Web 浏览器和 CLI 矩阵
使用以下图例表查看已在其上测试过 DC/OS 的操作环境的支持/不支持服务。

### Web 浏览器和 CLI 支持矩阵的图例
|显示图标 | 服务       |
|------------ |-------------- |
| ⚫ | 支持 |
|             | 不支持 |


### Web 浏览器支持矩阵
<table class="table">
    <tr>
    <th><strong>Web 浏览器</strong></th>
    <th><strong>DC/OS 2.0 最新稳定版</strong></th>
    <th><strong>DC/OS 1.13 最新稳定版</strong></th>
    <th><strong>DC/OS 1.12 最新稳定版</strong></th>
    </tr>
    <tr>
        <td>Chrome</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
    </tr>
    <tr>
        <td>Firefox</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
    </tr>
</table>

### CLI 支持矩阵
<table class="table">
    <tr>
    <th><strong>CLI</strong></th>
    <th><strong>DC/OS 2.0 最新稳定版</strong></th>
    <th><strong>DC/OS 1.13 最新稳定版</strong></th>
    <th><strong>DC/OS 1.12 最新稳定版</strong></th>
    <th><strong>DC/OS 1.11 最新稳定版</strong></th>
    </tr>
    <tr>
        <td>DC/OS CLI 0.6.x</td>
        <td></td>
        <td></td>
        <td></td>
        <td><p style="text-align: center;">⚫</p></td>
    </tr>
    <tr>
        <td>DC/OS CLI 0.7.x</td>
        <td></td>
        <td></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td></td>
    </tr>
    <tr>
        <td>DC/OS CLI 0.8.x</td>
        <td></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>DC/OS CLI 1.x</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td></td>
    </tr>
</table>

<p class="message--note"><strong>注意：</strong>CoreOS 1800.7.0 需要 DC/OS 1.11.6 或更高版本。</p>

## CentOS/RHEL 7.X 的客户咨询
<p class="message--important"><strong>重要信息：</strong>Docker 最近在 17.06+ 版本中启用了 <code>kmem</code> 会计功能。在 RHEL 或 CentOS 7.x 下运行时，客户可能会发现整个系统的不稳定性。现象包括任务无限期地卡住以及在系统日志中出现与内核相关的错误消息。RedHat 的分叉 Linux 内核中的 <code>kmem</code> 会计功能不完整，可能会导致内核死锁或内核内存泄漏。有关漏洞和缓解措施说明的更多具体详情，参见<a href="https://mesosphere-community.force.com/s/article/Critical-Issue-KMEM-MSPH-2018-0006">此处</a>。</p>

<p class="message--note"><strong>注意：</strong>由于 kmem 漏洞，<strong>在使用 DC/OS 1.12 或更高版本以及 CentOS/RHEL 7.5 时，Mesosphere 仅支持 CentOS/RHEL 7.X 的 DC/OS 上的 KuberNetes</strong>。</a></p>

## 版本兼容性矩阵

Mesosphere 维护并认证 DC/OS 的多个包。

### 基础技术

Mesosphere 不提供基础技术（例如，Jenkins）的支持服务。基础技术版本在包编号中表示为第二个版本（例如，1.2.3-**4.5.6**）。


### 已认证包的命名

标记为“已认证”的服务，其与 DC/OS 的互操作性，已由 Mesosphere 进行过测试，但 Mesosphere 不承担任何保证，也不作任何承诺，包括有关服务的运营或生产就绪情况的保证。可以从 Mesosphere 或服务创建者处获得对集成的支持。以下矩阵列出了经认证的包、在哪个版本的 DC/OS 上对包进行了测试以及哪些包在我们技术支持组织的最大努力范围内等当前状态。

命名如下：

⚫ 该组合已经过测试，与特定版本的 DC/OS 相兼容。
- 该包在我们技术支持组织的范围内。
- 该包可用于修复错误。

◒ 该组合之前已经过测试，与特定版本的 DC/OS 相兼容。
- 该组合不在我们技术支持组织的范围内。
- 此组合不能用于修复错误。

◯ 该包组合未经过测试。
- 该组合不在我们技术支持组织的范围内。
- 此组合不能用于修复错误。

## 已认证包和 DC/OS 版本
<table class="table">
    <tr>
        <th><strong>以下版本的 DC/OS 包</strong></th>
        <th><p style="text-align: center;"><strong>DC/OS 1.13</strong></p></th>
        <th><p style="text-align: center;"><strong>DC/OS 1.12</strong></p></th>
        <th><p style="text-align: center;"><strong>DC/OS 1.11</strong></p></th>
    </tr>
    <tr>
        <td>Cassandra 2.4.x-3.0.16</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
    </tr>
    <tr>
        <td>Cassandra 2.9.x-3.11.6（推荐）</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
    </tr>
    <tr>
        <td>Confluent-Kafka 2.5.x-4.1.2</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
    </tr>
    <tr>
        <td>Confluent-Kafka 2.9.x-5.4.0（推荐）</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
    </tr>
    <tr>
        <td>Confluent-Zookeeper 2.5.x-4.1.3e</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
    </tr>
    <tr>
        <td>Confluent-Zookeeper 2.7.x-5.1.2e（推荐）</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
    </tr>
        <tr>
        <td>²Datastax-DSE 2.4.x-5.1.10</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
    </tr>
    <tr>
        <td>²Datastax-DSE 3.2.x-6.7.7（推荐）</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
    </tr>
        <td>²Datastax-Ops 2.4.x-6.1.9</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
    </tr>
    <tr>
        <td>²Datastax-OPS 3.2.x-6.7.7（推荐）</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
     <tr>
        <td>Edge-LB 1.2</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
    </tr>
    <tr>
        <td>EDGE-LB 1.3（推荐）</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
    </tr>
    <tr>
        <td>Elastic 2.7.x-6.8.1</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
    </tr>
    <tr>
        <td>Elastic 3.1.2-7.6.0（推荐）</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
    </tr>
    <tr>
        <td>HDFS 2.5.x-2.6.0-cdh5.11.0 </td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
    </tr>
    <tr>
        <td>HDFS 2.8.x-3.2.1（推荐）</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
    </tr>
    <tr>
        <td>Jenkins 3.5.x-2.107.2</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
    </tr>
    <tr>
        <td>Jenkins 3.5.x-2.150.1（推荐）</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
    </tr>
    <tr>
        <td>Kafka 2.4.x-1.1.1</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
    </tr>
    <tr>
        <td>Kafka 2.9.x-2.4.0（推荐）</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
    </tr>
    <tr>
        <td>Kafka-Zookeeper 2.6.x-3.4.14</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
    </tr>
    <!-- Where is Kafka-ZooKeeper 2.4.x? -->
    <tr>
        <td>Kafka-Zookeeper 2.7.x-3.4.14（推荐）</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
    </tr>
    <tr>
        <td>Kibana 2.7.x-6.8.1（推荐）</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
    </tr>
    <tr>
        <td>Kubernetes 2.1.x-1.12.y</td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
    <tr>
        <td>Kubernetes 2.2.x-1.13.y </td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
    <tr>
        <td>Kubernetes 2.2.x-1.14.y（推荐）</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
    <tr>
        <td>Kubernetes 群集 2.2.x-1.13.y </td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
    <tr>
        <td>Kubernetes 群集 2.3.x-1.14.y（推荐）</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
    <tr>
        <td>Marathon-LB 1.12.x</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
    </tr>
    <tr>
        <td>Marathon-LB 1.13.x（推荐）</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
    </tr>
    <tr>
        <td>MoM (Marathon on Marathon) 1.6.x</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
    </tr>
    <tr>
        <td>MoM (Marathon on Marathon) 1.7.x</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
    </tr>
    <tr>
        <td>MoM (Marathon on Marathon) 1.8.x（推荐）</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
    </tr>
    <tr>
        <td>Spark 2.6.x-2.3.2</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
    </tr>
    <tr>
        <td>Spark 2.9.x-2.4.3（推荐）</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
    </tr>
    <tr>
        <td>Spark History 2.6.x-2.3.2</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
    </tr>
    <tr>
        <td>Spark History 2.9.x-2.4.3（推荐）</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
    </tr>
</table>

### Beta 包的命名
标记为“Beta”的服务未准备好投入生产。

命名如下：

◯ - 该包组合未经过测试。
- 该组合不在我们技术支持组织的范围内。
- 此组合不能用于修复错误。

B - 该包组合为 *beta*。
- Beta 包不在我们技术支持组织的范围内。
- Beta 包的迭代非常快速，不能用于修复错误。

## Beta 包和 DC/OS 版本
<table class="table">
    <tr>
        <th><strong>以下版本的 DC/OS 包</strong></th>
        <th><p style="text-align: center;"><strong>DC/OS 1.13</strong></p></th>
        <th><p style="text-align: center;"><strong>DC/OS 1.12</strong></p></th>
        <th><p style="text-align: center;"><strong>DC/OS 1.11</strong></p></th>
    </tr>
    <tr>
        <td>Beta DC/OS 存储服务 0.4.0</td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">B</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
    <tr>
        <td>¹Beta DC/OS 存储服务 0.5.3 </td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">B</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
    <tr>
        <td>Beta DC/OS 存储服务 0.6.0（推荐）</td>
        <td><p style="text-align: center;">B</p></td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
    <tr>
        <td>Beta Mesosphere Jupyter 服务 1.3.x - 0.35.4（推荐）</td>
        <td><p style="text-align: center;">B</p></td>
        <td><p style="text-align: center;">B</p></td>
        <td><p style="text-align: center;">B</p></td>
    </tr>
</table>

### 脚注

- ¹ Beta DC/OS 存储服务 0.5.1 需要 DC/OS 1.12.1 或更高版本。
- ² 包仅由 Datastax Corporation 维护和支持。
