---
layout: layout.pug
navigationTitle: 教程 - 使用 Marathon-LB 部署内部和外部负载平衡应用
title: 使用 Marathon-LB 部署内部和外部负载平衡应用
menuWeight: 6
excerpt: 教程 - Marathon-LB 作为内部和外部负载均衡器
enterprise: false
---

在本教程中，Marathon-LB 用作内部和外部负载均衡器。外部负载均衡器用于将外部 HTTP 流量路由到群集，内部负载均衡器用于内部服务发现和负载均衡。由于我们将在 AWS 上执行此操作，外部流量首先会冲击经过配置以公开我们的“公共”代理节点的外部负载均衡器。

## 先决条件

* 通过使用 AWS [云模板](/cn/1.11/installing/evaluation/cloud-installation/aws/) 安装 DC/OS，至少有 3 个 [私有](/cn/1.11/overview/concepts/#private-agent-node) 代理和 1 个 [公共](/cn/1.11/overview/concepts/#public-agent-node) 代理。
* DC/OS CLI [已安装][2]。
* Marathon-LB [已安装](/cn/services/marathon-lb/usage-ee/)。

## 使用 Marathon-LB 部署外部负载均衡器

验证 Marathon-LB 是否正常工作。查找 [公共节点] 的公用 IP(/1.10/administering-clusters/locate-public-agent/) 并导航至 `<public-agent-IP>:9090/haproxy?stats`。您将看到这样的统计报告页面：

 ![lb2](/cn/1.11/img/lb2.jpg)

图 1. HAProxy 统计报告

## 使用 Marathon-LB 部署内部负载均衡器
设置内部负载均衡器。为此，我们必须首先为 Marathon-LB 包指定一些配置选项。

1. 创建名为 `marathon-lb-internal.json` 并带有以下内容的文件：

    ```json
    {
      "marathon-lb":{
        "name":"marathon-lb-internal",
        "haproxy-group":"internal",
        "bind-http-https":false,
        "role":""
      }
    }
    ```

 在此选项文件中，我们正在更改应用实例的名称和 HAProxy 组的名称。选项文件还禁用端口 80 和 443 上的 HTTP 和 HTTPS 转发，因为不需要这一功能。

1. [安装](/cn/services/marathon-lb/usage-ee/) 内部 Marathon-LB 实例，并使用指定的自定义选项。

 现在有两个 Marathon-LB 负载均衡器：

 - 内部 (`marathon-lb-internal`）
 - 外部 (`marathon-lb`）

## 部署面向外部的 NGINX 应用

1. 在 DC/OS 上启动外部 NGINX 应用。

1. 将以下 JSON 复制到文件中，并将其命名为 `nginx-external.json`。

      ```json
      {
        "id": "nginx-external",
        "container": {
          "type": "DOCKER",
          "portMappings": [
            { "hostPort": 0, "containerPort": 80, "servicePort": 10000 }
          ],
          "docker": {
            "image": "nginx:latest",
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
          "HAPROXY_GROUP":"external"
        }
      }
      ```

应用程序定义包括 `"HAPROXY_GROUP":"external"` 标签，其指导 Marathon-LB 去公开该应用程序。已部署外部 Marathon-LB(`marathon-lb`)，其中 `--group` 参数设置为默认值 `external`。

1. 使用以下命令在 DC/OS 上部署外部 NGINX 应用：

    ```bash
    dcos marathon app add nginx-external.json
    ```

## 部署面向内部的 NGINX 应用

1. 在 DC/OS 上启动内部 NGINX 应用。

1. 将以下 JSON 复制到文件中，并将其命名为 `nginx-internal.json`。

      ```json
      {
        "id": "nginx-internal",
        "networks": [
          { "mode": "container/bridge" }
        ],
        "container": {
          "type": "DOCKER",
          "docker": {
            "image": "nginx:latest",
            "forcePullImage": true
          },
          "portMappings": [
            {
              "hostPort": 0,
              "containerPort": 80,
              "servicePort": 10001
            }
          ]
        },
        "instances": 1,
        "cpus": 0.1,
        "mem": 65,
        "healthChecks": [
          {
            "protocol": "HTTP",
            "path": "/",
            "portIndex": 0,
            "timeoutSeconds": 10,
            "gracePeriodSeconds": 10,
            "intervalSeconds": 2,
            "maxConsecutiveFailures": 10
          }
        ],
        "labels": {
          "HAPROXY_GROUP": "internal"
        }
      }
      ```

请注意，应用定义指定 `servicePort` 参数。此参数在 Marathon-LB 上公开此服务。默认情况下，端口 10000 到 10100 为 Marathon-LB 服务保留，所以您的服务端口应该从 10000 开始编号。

1. 使用以下命令在 DC/OS 上部署内部 NGINX 应用：

      ```bash
      dcos marathon app add nginx-internal.json
      ```

## 部署面向外部和内部的 NGINX 应用

1. 在 DC/OS 上启动 NGINX Anywhere 应用。

1. 将以下 JSON 复制到文件中，并将其命名为 `nginx-everywhere.json`。此实例将应用在内部和外部公开。

      ```json
      {
        "id": "nginx-everywhere",
        "networks": [
          { "mode": "container/bridge" }
        ],
        "container": {
          "type": "DOCKER",
          "docker": {
            "image": "nginx:latest",
            "forcePullImage":true
          },
          "portMappings": [
            { "hostPort": 0, "containerPort": 80, "servicePort": 10002 }
          ]
        },
        "instances": 1,
        "cpus": 0.1,
        "mem": 65,
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
          "HAPROXY_GROUP":"external,internal"
        }
      }
      ```

注意 `servicePort` 是唯一的，不与其他 NGINX 实例重叠。可以通过使用端口映射（如上面的示例）或使用 Marathon 应用定义中的 `ports` 参数定义服务端口。

1. 使用以下命令在 DC/OS 上部署 NGINX Anywhere 应用：

      ```bash
      dcos marathon app add nginx-everywhere.json
      ```

## 确认您的应用已部署并可从集群中访问

通过 [SShing][4] 在集群中的一个实例（如主实例）和 `curl` 端点中测试配置：

  ```bash
  # Access to external load balancer
  curl http://marathon-lb.marathon.mesos:10000/
  # Access to internal load balancer
  curl http://marathon-lb-internal.marathon.mesos:10001
  # Access to nginx app from external load balancer
  curl http://marathon-lb.marathon.mesos:10002/
  #Access to nginx app from internal load balancer
  curl http://marathon-lb-internal.marathon.mesos:10002/
  ```

 每个都应返回 NGINX“欢迎”页面：

 ![lb3](/cn/1.11/img/lb3.jpg)

 图 2. NGINX 的 HTML 版欢迎页面

## 虚拟主机

Marathon-LB 的一个重要特性是支持虚拟主机（`vhost`）。这允许您为多个主机 (FQDN) 路由 HTTP 流量并将请求路由到正确的端点。例如，您可以有两个不同的网络属性， `ilovesteak.com` 和 `steaknow.com`，其二者的 DNS 都指向同一端口上相同的 LB，且 HAProxy 将根据域名将流量路由到正确的端点。

要展示 `vhost` 特性：

1. 查找您的 [公共代理 IP](/cn/1.11/administering-clusters/locate-public-agent/)。

1. 修改外部 `nginx` 应用（`nginx-external.json`）以指向您的公共代理 DNS 名称。您可以使用 DC/OS CLI 或 GUI 修改应用。

**DC/OS CLI**

1. 添加 `HAPROXY_0_VHOST` 标签到本地 `nginx-external.json` 文件。在本示例中，公共 DNS 名称是 `brenden-j-publicsl-1ltlkzeh6b2g6-1145355943.us-west-2.elb.amazonaws.com`。

      ```json
      ...
        "labels":{
          "HAPROXY_GROUP":"external",
          "HAPROXY_0_VHOST":"brenden-j-publicsl-1ltlkzeh6b2g6-1145355943.us-west-2.elb.amazonaws.com"
        }
      }
        ```
 <p class="message--important"><strong>重要信息： </strong>在公共 DNS 名称中不要包括前导 `http://`末尾斜线（`/`）。</p>

2. 运行此命令，用您修改的本地副本替换部署的 `nginx-external.json`的内容：

      ```bash
      cat nginx-external.json | dcos marathon app update nginx-external
      ```

  您应该看到输出与此类似：

  ```bash
  Created deployment 5f3e06ff-e077-48ee-afc0-745f167bc105
  ```

3. 使用以下命令在 DC/OS 上部署修改的 NGINX 外部应用：

      ```bash
      dcos marathon app add nginx-external.json
      ```

**DC/OS GUI**

1. 导航到 **Services > Services > nginx-external**服务，单击最右边的垂直椭圆，然后选择 **编辑**。

1. 选择 **Environment > ADD LABEL**。

1. 对于 **KEY**，输入 `HAPROXY_0_VHOST` ；对于**VALUE**，指定您的公共代理 DNS 名称。

![更新应用](/cn/1.11/img/nginx-external-gui.png)

图 3. NGINX 外部服务

<p class="message--important"><strong>重要信息：</strong> 在公共 DNS 名称中不要包括前导 `http://`末尾斜线（`/`）。</p>

1. 选择 **查看和运行** 和 **运行服务**。

标签 `HAPROXY_0_VHOST` 指示 Marathon-LB 使用虚拟主机将 NGINX 在外部负载均衡器上公开。标签键中的 `0` 对应于 servicePort 索引，从 0 开始。如果您有多个 servicePort 定义，您将以 0、1、2 等进行累接。请注意，如果您 _确实_ 指定 vhost，您无需提供服务端口，因为 Marathon 将默认分配一个。

2. 在浏览器中导航至公共代理，您应该看到以下内容：

 ![lb6](/cn/1.11/img/lb6.jpg)

 图 4. NGINX 欢迎页

 [1]: /1.10/installing/
 [2]: /1.10/cli/install/
 [3]: /1.10/administering-clusters/locate-public-agent/
 [4]: /1.10/administering-clusters/sshcluster/
