---
layout: layout.pug
navigationTitle: 多个群集
title: 多个群集
menuWeight: 3
excerpt: 使用 DC/OS 管理多个群集
enterprise: true
---

组织通常部署和管理多个 DC/OS 群集。使用多个群集是用来隔离（例如，测试与生产）、顺应地理分布等等情境。DC/OS 多群集操作可让操作员和用户轻松管理和访问多个 DC/OS 群集。

DC/OS 有两种管理多个群集的操作：

- **[群集连接](/1.11/administering-clusters/multiple-clusters/cluster-connections/)** - 这些操作允许您设置连接、身份验证并附加到群集以允许从 CLI 访问群集。
- **[群集链接](/1.11/administering-clusters/multiple-clusters/cluster-links/)** - 这些操作允许您创建和删除群集之间的链接。您向群集进行了身份认证之后，您就可以在 CLI 中无缝连接到已链接的群集，而无需重复连接和认证步骤。在 UI 中，如果群集共享 [SSO 提供程序](/1.11/security/ent/sso/)，您可以在已链接的集群之间轻松切换。
