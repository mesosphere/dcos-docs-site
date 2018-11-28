---
layout: layout.pug
title: 使用 DC/OS 隧道
navigationTitle: 使用 DC/OS 隧道
menuWeight: 10
excerpt: 使用 DC/OS 隧道通过代理和 VPN 访问您的集群

enterprise: false
---

<table class="table" bgcolor="#FAFAFA"> <tr> <td style="border-left: thin solid; border-top: thin solid; border-bottom: thin solid;border-right: thin solid;"><b>重要信息：</b>DC/OS 隧道适用于开发、调试和测试。请勿在生产中使用 DC/OS 隧道。Mesosphere 不支持 Ubuntu 作为 DC/OS 的操作系统，即便是使用 Microsoft Azure 时。</td> </tr> </table>

在 DC/OS 上开发服务时，您可能会发现通过 SOCKS 代理、HTTP 代理或 VPN，有助于在本地机器访问集群。例如，您可以在自己的开发环境中工作，并立即针对您的 DC/OS 集群进行测试。

# SOCKS
DC/OS 隧道可以通过 SSH 运行 SOCKS 代理到集群。SOCKS 代理适合任何协议，但客户端必须配置为使用默认在端口 1080 上运行的代理。

# HTTP

HTTP 代理可采用两种模式运行：透明和标准。

## 透明模式
在透明模式下，HTTP 代理在端口 80 上作为超级用户运行，不需要对应用程序进行修改。通过附加 `mydcos.directory` 域访问 URL。也可 [将 DNS SRV 记录作为 URL 使用](#srv)。HTTP 代理当前无法采用透明模式访问 HTTPS。

## 标准模式
虽然必须配置客户端才能在标准模式下使用 HTTP 代理，但是它没有透明模式受到的任何限制。与透明模式一样，您可以将 [DNS SRV](#srv) 记录作为 URL 使用。

<a name="srv"></a>
### SRV 记录
SRV DNS 记录是从名称到 IP/端口对的映射。DC/OS 创建 SRV 记录，采用的形式为 `_<port-name>._<service-name>._tcp.marathon.mesos`。HTTP 代理将这些记录作为 URL 披露。此功能可用于与 DC/OS 服务进行交流。

# VPN
DC/OS 隧道可让您从集群内完全访问 DNS、管理节点和代理。OpenVPN 需要根权限才能配置这些路由。

# DC/OS 隧道选项概述


<table class="table">
  <tr>
    <th>&nbsp;</th>
    <th>利</th>
    <th>弊</th>
  </tr>
  <tr>
    <th>SOCKS</th>
    <td>
    <ul>
        <li>指定端口</li>
        <li>所有协议</li>
    </ul>
    </td>
    <td>
        <ul>
            <li>需要应用程序配置</li>
        </ul>
        </td>
  </tr>
  <tr>
      <th>HTTP（透明）</th>
      <td>
      <ul>
          <li>SRV 作为 URL</li>
          <li>无应用程序配置</li>
      </ul>
      </td>
      <td>
          <ul>
              <li>无法指定端口（除非通过 SRV 指定）</li>
              <li>仅支持 HTTP</li>
              <li>作为超级用户运行</li>
          </ul>
          </td>
    </tr>
    <tr>
        <th>HTTP（标准）</th>
        <td>
        <ul>
            <li>SRV 作为 URL</li>
            <li>指定端口</li>
        </ul>
        </td>
        <td>
        <ul>
            <li>需要应用程序配置</li>
            <li>仅支持 HTTP/HTTPS</li>
        </ul>
        </td>
     </tr>
     <tr>
        <th>VPN</th>
        <td>
        <ul>
            <li>无应用程序配置</li>
            <li>完整和直接访问集群</li>
            <li>指定端口</li>
            <li>所有协议</li>
        </ul>
        </td>
        <td>
        <ul>
            <li>更多先决条件</li>
            <li>作为超级用户运行</li>
            <li><i>可能</i>需要手动重新配置 DNS</li>
            <li>相对权重</li>
        </ul>
        </td>
      </tr>

</table>

# 使用 DC/OS 隧道

## 先决条件
* 目前仅支持 Linux 和 macOS。
* [DC/OS CLI](/cn/1.11/cli/install/)。
* DC/OS 隧道包。运行 `dcos package install tunnel-cli --cli`。
* [SSH 访问](/cn/1.11/administering-clusters/sshcluster/) （仅限密钥认证）。
* [OpenVPN 客户端](https://openvpn.net/index.php/open-source/downloads.html) 用于 VPN 功能。

## 应用示例

所有示例都将参考此样本应用：
* 服务名称：`myapp`
* 组：`mygroup`
* 端口：`555`
 * 端口名称：`myport`

`myapp` 是一个 在端口 `555` 侦听的 Web 服务器。我们将使用 `curl`
作为客户端应用程序。所有成功的示例都将得到
`myapp` 提供的作为文本输出的 HTML。

## 使用 DC/OS 隧道运行 SOCKS 代理
1. 在 DC/OS CLI 中运行以下命令：

    ```
    dcos tunnel socks

    ## Example
    curl --proxy socks5h://127.0.0.1:1080 myapp-mygroup.marathon.agentip.dcos.thisdcos.directory:555
    ```

1. 配置应用程序以使用端口 1080 上的代理。

## 使用 DC/OS 隧道运行 HTTP 代理
### 透明模式

1. 在 DC/OS CLI 中运行以下命令：

    ```
    sudo dcos tunnel http

    ## Example
    curl _myport._myapp.mygroup._tcp.marathon.mesos.mydcos.directory

    ### Watch out!
    ## This won't work because you can't specify a port in transparent mode
    curl myapp-mygroup.marathon.agentip.dcos.thisdcos.directory.mydcos.directory:555
    ```

1. 在透明模式下，HTTP 代理通过端口转发开展工作。输入命令时，在域名末尾附加 `.mydcos.directory`。例如， `http://example.com/?query=hello` 变成 `http://example.com.mydcos.directory/?query=hello`。

 **注意：** 在透明模式下，无法在 URL 中指定端口。

### 标准模式
1. 如需不使用根权限，以标准模式运行 HTTP 代理，则请使用 `--port` 标记将代理配置为使用其他端口：

    ```
    dcos tunnel http --port 8000

    ## Example
    curl --proxy 127.0.0.1:8000 _myport._myapp.mygroup._tcp.marathon.mesos
    curl --proxy 127.0.0.1:8000 myapp-mygroup.marathon.agentip.dcos.thisdcos.directory:555
    ```

1. 配置应用程序，在上文指定的端口上使用代理。

### SRV 记录
HTTP 代理将 DC/OS SRV 记录作为 URL 披露，采用的形式为 `_<port-name>._<service-name>._tcp.marathon.mesos.mydcos.directory` (transparent mode) or `_<port-name>._<service-name>._tcp.marathon.mesos`（标准模式）。

#### 查找服务名称
Marathon 应用定义中的 `<service-name>` is the entry in the **ID** field of a service you create from the DC/OS web interface or the value of the `id` 字段。

#### 在 DC/OS Web 界面中添加指定端口
如需在 DC/OS Web 界面指定端口，请转到 **服务 > 服务** 选项卡，单击服务名称，然后单击 **编辑**。在 **网络** 选项卡上输入端口的名称。

#### 在 Marathon 应用定义中添加指定端口
或者，可以添加 `name` 到Marathon 应用定义的 `portMappings` 或 `portDefinitions` 字段。使用 `portMappings` 还是 `portDefinitions` 取决于您使用的是 `BRIDGE` 还是 `HOST` 网络。[详细了解 Marathon 的网络和端口](/cn/1.11/deploying-services/service-ports/)。

```json
"portMappings": [
    {
        "name": "<my-port-name>",
        "containerPort": 3000,
        "hostPort": 0,
        "servicePort": 10000,
        "labels": {
             "VIP_0": "1.1.1.1:30000"
        }
    }
]
```

```json
"portDefinitions": [
    {
      "name": "<my-port-name>",
      "protocol": "tcp",
      "port": 0,    
    }
  ]
```

## 使用 DC/OS 隧道运行 VPN
在 DC/OS CLI 中运行以下命令

```
sudo dcos tunnel vpn

## Example
curl myapp-mygroup.marathon.agentip.dcos.thisdcos.directory:555
```

VPN 客户端试图自动配置 DNS，但此功能不适用于 macOS。如需在 macOS 上使用 VPN 客户端，请按照 DC/OS 隧道的指示，[添加 DNS 服务器](https://support.apple.com/kb/PH18499?locale=en_US)。

使用 VPN 时，您通过虚拟的方式进入集群。可以直接访问
管理节点和代理节点：

```
ping master.mesos
ping slave.mesos
```

### macOS OpenVPN 客户端安装
* 如果使用 [homebrew](http://brew.sh/)，就要用以下方式安装：
    ```
    brew install openvpn
    ```
 然后在使用时：

 添加 `/usr/local/sbin` 到 `$PATH`，

 或添加如下标记 `--client=/usr/local/sbin/openvpn`：
    ```
    sudo dcos tunnel vpn --client=/usr/local/sbin/openvpn
    ```

* 另一个选项是安装 [TunnelBlick](https://tunnelblick.net/)
 （**不要运行**，安装它只是用于 `openvpn` 可执行文件）
 并添加如下标记 `--client=/Applications/Tunnelblick.app/Contents/Resources/openvpn/openvpn-*/openvpn`：
    ```
    sudo dcos tunnel vpn --client=/Applications/Tunnelblick.app/Contents/Resources/openvpn/openvpn-*/openvpn
    ```


### Linux OpenVPN 客户端安装
`openvpn` 应通过您的分发包管理器提供。

例如：
* Ubuntu：`apt-get update && apt-get install openvpn`
* ArchLinux：`pacman -S openvpn`


