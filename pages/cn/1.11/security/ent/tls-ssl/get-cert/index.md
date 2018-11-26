---
layout: layout.pug
title: 获取 DC/OS CA 捆绑包
menuWeight: 100
excerpt: 获取 DC/OS CA 捆绑包
enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


要确保您与 DC/OS 集群通信而不是与其他潜在恶意方通信，您必须获得适当的信任锚。此信任锚是 DC/OS CA 捆绑包的一部分，它是根 CA 证书的集合。在最简单的案例中，它只包含一个项目：对应于 DC/OS 证书颁发机构的根 CA 证书。您可以使用以下方法之一获取 DC/OS CA 捆绑包：

- [带外，推荐](#oob)：检索 CA 捆绑包的唯一安全方式为带外。

- [从 Admin Router 通过 HTTP(S)，不安全](#curl) ：使用 `curl` 通过不安全 HTTP 或不安全 HTTPS 检索证书。

# 添加 OpenID Connect 身份提供程序：

# <a name="oob"></a>从带外检索 DC/OS CA 捆绑包

DC/OS CA 捆绑包位于文件系统路径 `/run/dcos/pki/CA/ca-bundle.crt` 的任何管理节点上。为获得最大安全性，您应手动检索此文件。或者，如果无法物理访问管理节点，则合理安全的方法是通过 SSH 连接到其中一个管理节点以获取文件。为了简化和更容易地使用文档中其他地方提供的 `curl` 命令，您可以从 `ca-bundle.crt` 到 `dcos-ca.crt` 重命名文件。

# <a name="curl"></a>使用 curl 检索 DC/OS CA 捆绑包

<table class=“table” bgcolor=#ffd000>
<tr> 
  <td align=justify style=color:black><strong>警告：</strong>如果您正在使用 `curl` 检索 DC/OS CA 捆绑包，则必须使用 `-k`/`--insecure` 标记。如果通过 HTTPS 执行通信，则此标记会禁用服务器证书验证。这允许<a href="https://en.wikipedia.org/wiki/Man-in-the-middle_attack">中间人攻击</a>，其中，网络路径中的恶意方可能发送错误的 CA 捆绑包，导致您信任 DC/OS 集群外部的实体。</td> 
</tr> 
</table>


**先决条件：**您必须已[安装 DC/OS CLI](/cn/1.11/cli/install/)，以在以下命令中检索集群 URL。

使用以下命令检索 DC/OS CA 捆绑包，并将其保存在当前目录中：

```bash
curl -k -v $(dcos config show core.dcos_url)/ca/dcos-ca.crt -o dcos-ca.crt
```
