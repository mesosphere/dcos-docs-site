---
layout: layout.pug
navigationTitle: 参考
title: Marathon-LB 参考
menuWeight: 4
excerpt: Marathon-LB 参考
enterprise: false
---


## HAProxy 配置

Marathon-LB 为 HAProxy 自动生成配置，然后根据需要重新加载 HAProxy。Marathon-LB 根据 Marathon API 提供的应用程序数据生成 HAProxy 配置。它还可以订阅 [Marathon 事件总线][10]，以实时更新。应用程序启动、停止、重定位或有任何健康状态变化时，Marathon-LB 将自动重新生成 HAProxy 配置并重新加载 HAProxy。


| 组件 | 主机：端口/URI/ |
|---------------------------|--------------------------------------------|
| 统计信息 | `<public-node>:9090/haproxy?stats` |
| 统计信息 CSV | `<public-node>:9090/haproxy?stats;csv` |
| 运行状况检查 | `<public-node>:9090/_haproxy_health_check` |
| 配置文件视图 | `<public-node>:9090/_haproxy_getconfig` |
| 获取 vHost 到后端映射 | `<public-node>:9090/_haproxy_getvhostmap` |
| 获取应用 ID 到后端映射 | `<public-node>:9090/_haproxy_getappmap` |
| 重新加载配置 | `<public-node>:9090/_mlb_signal/hup*` |

## 模板

Marathon-LB 具有用于指定自定义 HAProxy 配置参数的制模功能。模板可以在全局范围内设置（适用于所有应用），或使用标签按各个应用来设置。让我们来展示如何指定自己的全局模板。以下是我们将使用的模板：

### 全局模板

<p class="messages--note"><strong>注意：</strong> 模板的 HAPROXY_HEAD 部分在 Marathon-LB 版本 1.12 中已更改：`daemon` 被删除并且 `stats socket /var/run/haproxy/socket expose-fd listeners` 已添加到全局部分。在升级到 1.12 版之前，确保已对您的自定义 HAPROXY_HEAD 进行了这些更改。</p>

要指定全局模板：

1. 在您的本地机器上在 `templates` 目录中创建名为 `HAPROXY_HEAD` 的文件，内容如下：

 
        global
          log /dev/log local0
          log /dev/log local1 notice
          maxconn 4096
          tune.ssl.default-dh-param 2048
          stats socket /var/run/haproxy/socket expose-fd listeners
          server-state-file global
          server-state-base /var/state/haproxy/
        defaults
          log global
          retries 3
          maxconn 3000
          timeout connect 5s
          timeout client 30s
          timeout server 30s
          option redispatch
        listen stats
          bind 0.0.0.0:9090
          balance mode http
          stats enable monitor-uri /_haproxy_health_check


在以上代码中，以下项目已从默认值更改：`maxconn`、 `timeout client` 和 `timeout server`。

<p class="message--note"><strong>注意：</strong> 当前全部默认 HAPROXY_HEAD 可在此处找到：<a href="https://github.com/mesosphere/marathon-lb/blob/master/Longhelp.md#haproxy_head">https://github.com/mesosphere/marathon-lb/blob/master/Longhelp.md#haproxy_head</a>。</p>

2. Tar 或 zip 该文件。[这里是一个用于执行此操作的方便脚本][1]。

使用您创建的文件（`templates.tgz` 如果使用此脚本），并使其可从 HTTP 服务器获取。如果您想使用此样例，使用此 URI：<https://downloads.mesosphere.com/marathon/marathon-lb/templates.tgz>

3. 通过将以下 JSON 保存在名为 `options.json` 的文件中，增加 Marathon-LB 配置：


        {
          "marathon-lb": {
            "template-url":"https://downloads.mesosphere.com/marathon/marathon-lb/templates.tgz"
          }
        }

4. 启动新的 Marathon-LB：
```
 dcos package install --options=options.json marathon-lb
```
您定制的 Marathon-LB HAProxy 实例现在将使用新模板运行。[可在此处找到可用模板的完整列表][2]。

### 单个应用模板

为单个应用创建模板，修改应用程序定义。在以下示例中，外部 NGINX 应用程序定义的默认模板（`nginx-external.json`）已修改为 *禁用* HTTP 保持活动。这是人工示例，有时候您可能需要覆盖单个应用程序的特定默认值。

```json
    {
      "id": "nginx-external",
      "container": {
        "type": "DOCKER",
        "portMappings": [
          { "hostPort": 0, "containerPort": 80, "servicePort": 10000 }
        ],
        "docker": {
          "image": "nginx:1.7.7",
          "forcePullImage":true
        }
      },
      "instances": 1,
      "cpus": 0.1,
      "mem": 65,
      "networks": [ { "mode": "container/bridge" } ],
      "healthChecks": [{
          "protocol": "HTTP",
          "path": "/",
          "portIndex": 0,
          "timeoutSeconds": 10,
          "gracePeriodSeconds": 10,
          "intervalSeconds": 2,
          "maxConsecutiveFailures": 10
      }],
      "labels":{
        "HAPROXY_GROUP":"external",
        "HAPROXY_0_BACKEND_HTTP_OPTIONS":"  option forwardfor\n  no option http-keep-alive\n      http-request set-header X-Forwarded-Port %[dst_port]\n  http-request add-header X-Forwarded-Proto https if { ssl_fc }\n"
      }
    }
```

您可能想要指定的其他选项包括启用 [粘滞选项][3]、[重定向到 HTTPS][4]或 [指定 vhost][5]。

```json
    "labels":{
      "HAPROXY_0_STICKY":true,
      "HAPROXY_0_REDIRECT_TO_HTTPS":true,
      "HAPROXY_0_VHOST":"nginx.mesosphere.com"
    }
```

## SSL 支持

Marathon-LB 支持 SSL，您可以为每个前端指定多个 SSL 证书。通过使用额外的`--ssl-certs` 命令行标记传递路径列表，由此可以包含其他 SSL 证书。您可以在应用程序定义中指定 `HAPROXY_SSL_CERT` 环境变量，将您自己的 SSL 证书注入到 Marathon-LB 配置中。

如果您未指定 SSL 证书，Marathon-LB 将在启动时生成自签名证书。如果使用多个 SSL 证书，您可以通过指定 `HAPROXY_{n}_SSL_CERT` 参数按照应用程序服务选择 SSL 证书，参数对应于指定的 SSL 证书的文件路径。例如，您可能有：

```json
    "labels":{
      "HAPROXY_0_VHOST":"nginx.mesosphere.com",
      "HAPROXY_0_SSL_CERT":"/etc/ssl/certs/nginx.mesosphere.com"
    }
```

SSL 证书必须预先加载到 Marathon-LB 容器 中，以便加载。您可以通过构建自己的 Marathon-LB 映像来实现，而不是使用 Mesosphere 提供的映像。

## 使用 HAProxy 度量标准

HAProxy 的统计报告可用于监控健康、性能，甚至制定调度安排决策。HAProxy 的数据包括计数器和 1 秒速率的各种度量标准。

为了说明如何使用度量标准，我们将使用它们创建[ Marathon 应用自动扩展的实施][6]。

对于给定应用，基于给定资源集，我们可以衡量其秒请求性能。如果应用为无状态并水平扩展，我们可以按比例扩展应用实例的数量，以对应 N 个间隔中每秒平均请求数。自动扩展脚本会轮询 HAProxy 统计端点，并根据传入请求自动扩展应用实例。

![image04](/1.10/img/image04.png)

图 1. 自动扩展 Marathon-LB

脚本获取当前 RPS（每秒请求数），并将该数字除以单个应用实例的目标 RPS 数。此分数的结果是所需应用实例的数量（或者说，该分数的上限是所需的实例数量）。

![image00](/1.10/img/image00.png)

要展示自动扩展，我们将使用 3 个单独的 Marathon 应用：

* **marathon-lb-autoscale** - 该脚本通过 Marathon API 监控 HAProxy 和扩展应用。
* **nginx** - 我们的演示应用
* **siege** - 生成 HTTP 请求的工具

1. 开始先运行 `marathon-lb-autoscale`。JSON 应用定义 [可在此处找到][7]。保存该文件并在 Marathon 上启动它：

 
        dcos marathon app add https://gist.githubusercontent.com/brndnmtthws/2ca7e10b985b2ce9f8ee/raw/66cbcbe171afc95f8ef49b70034f2842bfdb0aca/marathon-lb-autoscale.json

The JSON app definition passes 2 important arguments to the tool: `--target-rps` tells marathon-lb-autoscale identifies the target RPS and `--apps` is a comma-separated list of the Marathon apps and service ports to monitor, concatenated with `_`. Each app could expose multiple service ports to the load balancer if configured to do so, and `marathon-lb-autoscale` will scale the app to meet the greatest common denominator for the number of required instances.

        "args":[
          "--marathon", "http://leader.mesos:8080",
          "--haproxy", "http://marathon-lb.marathon.mesos:9090",
          "--target-rps", "100",
          "--apps", "nginx_10000"
        ],


 <p class="message--note"><strong>注意：</strong> 如果您尚未运行外部 Marathon-LB 实例，使用`dcos package install Marathon-LB`启动它。</p>

2. 启动您的 NGINX 测试实例。JSON 应用定义 [可在此处找到][8]。保存文件，并按以下启动：
```
  dcos marathon app add https://gist.githubusercontent.com/brndnmtthws/84d0ab8ac057aaacba05/raw/d028fa9477d30b723b140065748e43f8fd974a84/nginx.json
```
3. 启动 `siege`，这是用于生成 HTTP 请求流量的工具。JSON 应用定义 [可在此处找到][9]。保存文件，并按以下启动：
```
 dcos marathon app add https://gist.githubusercontent.com/brndnmtthws/fe3fb0c13c19a96c362e/raw/32280a39e1a8a6fe2286d746b0c07329fedcb722/siege.json
```
 现在，如果您检查 HAProxy 状态页，您应该看到冲击 NGINX 实例的请求：

 ![image02](/1.10/img/image02-800x508.png)

 图 2. HAProxy 状态页

 在“会话率”部分，您可以看到 NGINX 前端每秒约有 54 个请求。

4. 扩展 `siege` 应用，这样我们生成大量的 HTTP 请求：
```
 dcos marathon app update /siege instances=15
```
 几分钟后，您将看到 NGINX 应用已自动扩展以服务增加的流量。

5. 有关 `marathon-lb-autoscale` 参数使用。尝试更改间隔、样例数量和其他值，直到达到所需效果。默认值相当保守，可能会也可能不会符合您的预期。我们建议您在目标 RPS 中包含 50% 的安全因素。例如，如果您估量您的应用程序能够满足在 1500 RPS 下的 SLAs （1 CUP 和 1GiB 内存），您可能希望将目标 RPS 设置为 1000。

 [1]: https://gist.github.com/brndnmtthws/c5c613d9e90d2df771f9
 [2]: https://github.com/mesosphere/marathon-lb#templates
 [3]: https://cbonte.github.io/haproxy-dconv/configuration-1.5.html#5.2-cookie
 [4]: https://cbonte.github.io/haproxy-dconv/configuration-1.5.html#4.2-redirect%20scheme
 [5]: https://cbonte.github.io/haproxy-dconv/configuration-1.5.html#7.2
 [6]: https://github.com/mesosphere/marathon-lb-autoscale
 [7]: https://gist.github.com/brndnmtthws/2ca7e10b985b2ce9f8ee
 [8]: https://gist.github.com/brndnmtthws/84d0ab8ac057aaacba05
 [9]: https://gist.github.com/brndnmtthws/fe3fb0c13c19a96c362e
 [10]: https://mesosphere.github.io/marathon/docs/event-bus.html
