---
layout: layout.pug
navigationTitle: 查找公共代理 IP
title: 查找公共代理 IP
menuWeight: 3
excerpt: 查找公共代理 IP 地址
enterprise: false
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---
使用已声明的公共代理节点安装 DC/OS&trade; 后，您可以导航到公共代理节点的公用 IP 地址。您可以将代理面向公众的 IP 地址公开为网关，以访问在 DC/OS 群集中运行的服务。例如，如果要配置负载均衡以将入站请求分发到群集中的服务，请求通常通过公共 IP 地址前端路由到防火墙后隔离的适当服务实例后端。

# 开始之前
- 必须已安装 DC/OS，并且有至少一个管理节点和至少一个 [公共代理](/mesosphere/dcos/2.0/overview/concepts/#public-agent-node) 节点。
- 必须安装了最新版本的 DC/OS [CLI](/mesosphere/dcos/2.0/cli/)。
- 必须安装了 [secure shell (SSH)](/mesosphere/dcos/2.0/administering-clusters/sshcluster/) 并配置为允许远程会话访问群集节点。
- 如果想要格式化 API 调用的输出，则应该安装了 [jq](https://github.com/stedolan/jq/wiki/Installation) 或 [Python&reg;](https://www.python.org/)。
 如果您使用旧版本的 DC/OS 群集，则也可以使用 [jq](https://github.com/stedolan/jq/wiki/Installation) 或者其他程序查找公共代理 IP 地址。

<p class="message--note"><strong>注意：</strong>如果 DC/OS 部署在公共云提供程序上，例如 AWS&reg;、Google Cloud&reg; 或 Azure&reg;，您可以使用 DC/OS 基于 Web 的控制台、命令行界面或 DC/OS 群集节点 API 调用来查找公共代理 IP 地址。如果 DC/OS 安装在内部网络（本地）或专用云上，节点通常不具有独立的公共和专用 IP 地址。对于内部网络或专用云上的节点，公共 IP 地址通常与 DNS 命名空间中为服务器定义的 IP 地址相同。</p>

# 在 DC/OS 控制台中查看公共 IP 地址
您可以从 DC/OS 基于 Web 的管理控制台交互式地查看群集中节点的公共代理 IP 地址。

使用 DC/OS 基于 Web 的控制台查看公共 IP 地址：
1. 打开网页浏览器并使用管理用户名和密码登录。

1. 单击 **节点** 显示关于代理节点的信息。

1. 选中 **公共 IP** 列，确定要公开的代理节点面向公众的 IP 地址。

 例如：
    <p>
    <img src="/mesosphere/dcos/2.0/img/node-public-ip-address.png" alt="Viewing the public-facing IP address for cluster nodes">
    </p>

 大多数情况下，查找代理节点面向公众的 IP 地址就足够了。但是，如果需要，您还可以查找管理节点的公共 IP 地址。如果需要查找管理节点的公共 IP 地址，请使用 `dcos node list` [命令](#public-ip-cmd) 或 `net/v1/nodes` [API 调用](#public-ip-api)。

<a name="public-ip-cmd"></a>

# 从命令行列出公共 IP 地址
您可以使用 DC/OS 核心命令行界面 (CLI) 以交互式或编程方式列出群集中节点的公共代理 IP 地址。

要使用 DC/OS CLI 列出公共 IP 地址：
1. 打开 shell 终端。

1. 运行以下命令：
    ```bash
    dcos node list
    ```

1. 查看命令输出以找到指定为公共代理的节点面向公众的 IP 地址。

 例如，命令将返回类似于以下内容的节点信息：
    ```bash
    HOSTNAME         IP       PUBLIC IP(S)                     ID                           TYPE           REGION           ZONE       
    10.0.5.46      10.0.5.46   34.223.48.55    ecb5e39c-2d3e-4eea-8c07-af0c4e9e8443-S1  agent (public)    aws/us-west-2  aws/us-west-2d  
    10.0.1.112     10.0.1.112                  ecb5e39c-2d3e-4eea-8c07-af0c4e9e8443-S0  agent             aws/us-west-2  aws/us-west-2d  
    master.mesos.  10.0.6.157  34.222.201.246  ecb5e39c-2d3e-4eea-8c07-af0c4e9e8443     master (leader)   aws/us-west-2  aws/us-west-2d  
    master.mesos.  10.0.7.169  34.223.44.83    N/A                                      master (standby)  aws/us-west-2  N/A             
    master.mesos.  10.0.7.38   34.222.181.165  N/A                                      master (standby)  aws/us-west-2  N/A             
    ```

 从此输出中，您可以识别用于公共和专用代理节点以及管理节点的面向公众的特定 IP 地址。

 此例中，公共代理有一个公共 IP 地址：
 - 34.223.48.55
    
 管理节点有三个公共 IP 地址：
 - 34.222.201.246（领导者）
 - 34.223.44.83（备用）
 - 34.222.181.165（备用）

 没有可用于专用代理节点的面向公众的 IP 地址。

 在大多数情况下，您可以使用此命令验证每个节点的专用和公共 IP 地址。但是，您应该记住，如果 Edge-LB 池使用虚拟网络，则返回的公共和专用 IP 地址可能不准确。

<a name="public-ip-api"></a>

# 使用 API 调用查找公共 IP 地址
DC/OS 应用程序编程接口 (API) 提供了可通过 DC/OS 基于 Web 的管理控制台和命令行界面 (CLI) 访问的基础功能。因此，在大多数情况下，只有将 API 调用集成到自定义程序或自动化脚本中时才能直接使用 API。但是，如果需要，您可以直接通过调用 DC/OS 应用程序编程接口 (API) 进行联网来检索公共代理的公共 IP 地址。

要使用 DC/OS API 查找公共 IP 地址：
1. 识别在公共云实例上运行的 DC/OS 群集的 URL。

1. 使用以下 REST API `net/v1/nodes` 端点查找公共代理的公共 IP：

    ```bash
    <cluster-url>/net/v1/nodes
    ```

 例如，您可能会使用与以下类似的群集 URL 发出调用，以指定 DC/OS 群集运行所在的位置：

    ```bash
    http://luxi-sf7-elasticl-u70m3un6kcab-1100943753.us-west-2.elb.amazonaws.com/net/v1/nodes
    ```

1. 检查命令输出。

 如果您具有被授权访问群集并检索节点信息的用户帐户，则此 API 调用将以未经过滤的格式返回节点和 IP 信息。

## 从管理节点查找地址
如果您直接调用 API 端点，则可以使用管理节点的客户端 URL (`cURL`) 命令查找公共 IP 地址。例如，您可以使用以下 cURL 命令查找公共代理面向公众的 IP 地址：

```bash
curl -skSL -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/net/v1/nodes
```

此命令设置授权令牌，并使用 `dcos config show` 命令标识群集 URL，并返回类似于以下内容的原始输出：

```bash
[{"updated":"2019-01-07T22:22:22.171Z","public_ips":["34.212.37.79"],"private_ip":"10.0.6.210","hostname":"ip-10-0-6-210"},{"updated":"2019-01-07T22:22:22.119Z","public_ips":["52.25.254.97"],"private_ip":"10.0.6.181","hostname":"ip-10-0-6-181"},{"updated":"2019-01-07T22:21:09.585Z","public_ips":["54.218.23.75"],"private_ip":"10.0.6.148","hostname":"ip-10-0-6-148"},{"updated":"2019-01-07T22:22:28.582Z","public_ips":[],"private_ip":"10.0.1.139","hostname":"ip-10-0-1-139"},{"updated":"2019-01-07T22:22:28.649Z","public_ips":[],"private_ip":"10.0.0.138","hostname":"ip-10-0-0-138"}]
```

<!-您还可以直接在管理节点上执行 cURL 命令，以使用类似于以下内容的命令从中央位置查找公共代理的公共 IP 地址：

```bash
curl http://localhost:62080/v1/nodes
```

此命令输出显示在 DC/OS 群集上运行的同一公共代理的公共 IP 地址。例如：

    ```bash
    curl http://localhost:62080/v1/nodes
    [{"updated":"2019-01-07T22:22:22.171Z","public_ips":["34.212.37.79"],"private_ip":"10.0.6.210","hostname":"ip-10-0-6-210"},{"updated":"2019-01-07T22:22:22.119Z","public_ips":["52.25.254.97"],"private_ip":"10.0.6.181","hostname":"ip-10-0-6-181"},{"updated":"2019-01-07T22:21:09.585Z","public_ips":["54.218.23.75"],"private_ip":"10.0.6.148","hostname":"ip-10-0-6-148"},{"updated":"2019-01-07T22:22:28.582Z","public_ips":[],"private_ip":"10.0.1.139","hostname":"ip-10-0-1-139"},{"updated":"2019-01-07T22:22:28.649Z","public_ips":[],"private_ip":"10.0.0.138","hostname":"ip-10-0-0-138"}]
    ```

 在这两个示例中，有三个公共 IP 地址，每个公共代理节点有一个：
 - 34.212.37.79
 - 52.25.254.97
 - 54.218.23.75

 与之前的示例一样，没有用于专用节点的公共 IP 地址。
-->

## 格式化 API 输出
如果您安装了 `jq` 或 `python`，则可以使用更具可读性的 JSON 格式解析 API 输出以显示节点信息。例如，通过运行以下命令，您可以执行 API 调用并将输出传递到 `jq` 进行格式化：

```bash
curl -skSL -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/net/v1/nodes | jq
```

此命令为检索到的信息返回格式化的输出，类似于以下内容：

```json
[
  {
    "updated": "2019-01-07T22:22:22.171Z",
    "public_ips": [
      "34.212.37.79"
    ],
    "private_ip": "10.0.6.210",
    "hostname": "ip-10-0-6-210"
  },
  {
    "updated": "2019-01-07T22:22:22.119Z",
    "public_ips": [
      "52.25.254.97"
    ],
    "private_ip": "10.0.6.181",
    "hostname": "ip-10-0-6-181"
  },
  {
    "updated": "2019-01-07T22:21:09.585Z",
    "public_ips": [
      "54.218.23.75"
    ],
    "private_ip": "10.0.6.148",
    "hostname": "ip-10-0-6-148"
  },
  {
    "updated": "2019-01-07T22:22:28.582Z",
    "public_ips": [],
    "private_ip": "10.0.1.139",
    "hostname": "ip-10-0-1-139"
  },
  {
    "updated": "2019-01-07T22:22:28.649Z",
    "public_ips": [],
    "private_ip": "10.0.0.138",
    "hostname": "ip-10-0-0-138"
  }
]
```

在这些 API 示例中，公共代理和管理节点有三个公共 IP 地址：
- 34.212.37.79
- 52.25.254.97
- 54.218.23.75

如示例中所示，没有用于专用代理节点的公共 IP 地址。对于专用代理节点，API 调用将返回设置 (`"public_ips": []`) 的空值。

# 执行查询以返回公共 IP 地址
如果您正在使用旧版本的 DC/OS 群集，则可以通过在脚本中或在 shell 终端的命令行中执行 `jq` 查询来查找公共代理 IP 地址。以下示例脚本使用 `jq` 查询以在 DC/OS 群集上打开安全 shell (SSH) 会话，获取群集信息，然后查询 [ifconfig.co](https://ifconfig.co/) 以确定公共 IP 地址。

```bash
for id in $(dcos node --json | jq --raw-output '.[] | select(.attributes.public_ip == "true") | .id'); do dcos node ssh --option StrictHostKeyChecking=no --option LogLevel=quiet --master-proxy --mesos-id=$id "curl -s ifconfig.co" ; done 2>/dev/null
```

以下是返回公共 IP 地址 `52.39.29.79` 的示例：

```bash
for id in $(dcos node --json | jq --raw-output '.[] | select(.attributes.public_ip == "true") | .id'); do dcos node ssh --option StrictHostKeyChecking=no --option LogLevel=quiet --master-proxy --mesos-id=$id "curl -s ifconfig.co" ; done 2>/dev/null
52.39.29.79
```
