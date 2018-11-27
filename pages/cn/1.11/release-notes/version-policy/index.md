---
layout: layout.pug
navigationTitle: 版本控制和发布政策
title: 版本控制和发布政策
menuWeight: 110
excerpt: 了解 DC/OS 版本控制和发布
---
Mesosphere DC/OS 版本号的格式为：<code>&lt;发布&gt;.&lt;版本&gt;.&lt;次要&gt;</code>. 

# 发布编号

## 发布

对同一软件产品的修改或增强，以 <code>R</code> 发布编号的变更来表示。<code>R</code> 发布可能包括新变更和重大变更。<code>R</code> 发布不包括 Mesosphere 以不同名称销售的独立或不同产品，即使此类产品与相关软件产品兼容。

## 版本

对同一软件产品的修改或增强，以 <code>V</code> 发布编号的变更来表示。<code>V</code> 发布版本将继续提供对所有已发布 API 的向后兼容。

## 次要

对同一软件产品的漏洞修复和新增强，以补丁发布编号的变更来表示。例如，版本 5.6.3 意指 <code>R</code> 为 5，<code>V</code> 为 6，<code>M</code> 为 3。

# Mesosphere 软件寿命终止政策

Mesosphere 将支持当前发布版本（发布版 N）和前两个特性（主要或次要发布）发布（发布版 N-1 和 N-2）的产品发布。在发布版 N-1 时，Mesosphere 将宣布发布版 N-2 的寿命终止 (EOL) 日期。当发布版 N 可普遍提供时，Mesosphere 将宣布发布版 N-2 的 EOL。

这是一个假设示例，可帮助您了解哪个版本是受支持的版本。

<ol>
<li>2020 年 5 月 - 发布产品 X v1.0。</li>
<li>2020 年 8 月 - 发布产品 X v1.1，宣布 v1.0 EOL 日期。</li>
<li>2020 年 11 月 - 发布产品 X v1.2，v1.0 的寿命终止，宣布 v1.1 EOL 日期。</li>
</ol>

# DC/OS 版本和 Mesos 互操作性矩阵

所有版本的 DC/OS 都捆绑有兼容的 Mesos 版本，其发布编号在适当的 DC/OS 发布版本发布说明中指出。

# DC/OS 版本和服务调度程序互操作性矩阵

所有 Mesosphere 驱动的服务框架及其附带的基线技术都将进行测试，以便与当前 DC/OS 和之前的 DC/OS 版本兼容操作。同样，DC/OS 的每个发布版都支持服务调度程序利用的当前可用 (GA) 软件及其上一版本。如果 DC/OS 发布版本支持较老版本的服务调度程序，则较老版本的服务调度程序可能不支持较新版本 DC/OS 提供的所有功能。

例如，如果我们有以下三项技术：DC/OS、Framework 和 Apache Kafka。

![版本政策框架](/1.10/img/version-policy-1.png)

图 1. 版本政策框架

我们在上述情形下的互操作性保证如下：

<table>
<thead>
<tr>
  <th><strong>DC/OS 发布版</strong></th>
  <th><strong>当前 DC/OS 发布版 N</strong></th>
</tr>
</thead>
<tbody>
<tr>
  <td>框架和基线技术（例如 Apache Kafka）</td>
  <td>当前框架版本 (M +Apache Kafka K) 和 (M-1+Apache Kafka K-1)</td>
</tr>
</tbody>
</table>

# Mesosphere 版本控制和升级政策

![版本政策框架](/1.10/img/version-policy-2.png)

图 1. 版本政策框架
