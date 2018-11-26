---
layout: layout.pug
navigationTitle: 教程 - 基本 Marathon-LB
title: 教程 - 使用 Marathon-LB 部署外部负载平衡应用
menuWeight: 5
excerpt: 教程 - 使用 Marathon-LB 来运行容器化 DC/OS 服务（服务一个网站）
enterprise: false
---

本教程向您展示如何使用 Marathon-LB 运行为网站提供服务的容器化 DC/OS 服务。具体地说，您将使用包含 NGINX（为`dcos.i`o 站点服务）的 Docker 镜像。在本教程中，Marathon-LB 用作边缘负载均衡器和服务发现机制。Marathon-LB 在面向公众的节点上运行，以路由 ingress 流量。

## 先决条件
- [DC/OS 集群](/1.10/installing/oss/) 至少有一个 [私有](/1.10/overview/concepts/#private-agent-node) 代理和一个 [公共](/1.10/overview/concepts/#public-agent-node) 代理。
- [DC/OS CLI](/1.10/cli/install/) 已安装。
- Marathon-LB [已安装](/services/marathon-lb/usage-ee/)。

## 在公共节点上配置和运行容器化服务

1. 从 [dcos 网站](https://github.com/dcos/dcos-website/blob/develop/dcos-website.json) GiThub 存储库复制 `dcos-website/dcos-website.json`。

1. 前往 [mesosphere/dcos-website](https://hub.docker.com/r/mesosphere/dcos-website/tags/) Docker Hub 存储库并复制最新的镜像标签。

 ![Mesosphere Docker Hub](/1.10/img/dockerhub.png)

 图 1. Mesosphere Docker 集线器

3. 用该标签更换 `<image-tag>` in the `docker:image` 字段。

1. 查找并记录 [您的公共代理节点](/1.10/administering-clusters/locate-public-agent/) IP 地址。

1. 在标签字段，添加 `HAPROXY_0_VHOST` 条目并将您的公共代理 IP 值分配给它。删除 IP 中前导 `http://` 和尾部 `/`。记得在上一字段后添加逗号。

完整的 JSON 服务定义文件应该类似：

  ```json
  {
    "id": "dcos-website",
    "container": {
      "type": "DOCKER",
      "portMappings": [
        { "hostPort": 0, "containerPort": 80, "servicePort": 10004 }
      ],
      "docker": {
        "image": "mesosphere/dcos-website:<image-tag>"
      }
    },
    "instances": 3,
    "cpus": 0.25,
    "mem": 100,
    "networks": [ { "mode": "container/bridge" } ],
    "healthChecks": [{
        "protocol": "HTTP",
        "path": "/",
        "portIndex": 0,
        "timeoutSeconds": 2,
        "gracePeriodSeconds": 15,
        "intervalSeconds": 3,
        "maxConsecutiveFailures": 2
    }],
    "labels":{
      "HAPROXY_DEPLOYMENT_GROUP":"dcos-website",
      "HAPROXY_DEPLOYMENT_ALT_PORT":"10005",
      "HAPROXY_GROUP":"external",
      "HAPROXY_0_REDIRECT_TO_HTTPS":"true",
      "HAPROXY_0_VHOST": "<public-agent-ip>"
    }
  }
  ```

6. 使用以下命令从 DC/OS CLI 运行服务：

  ```bash
  dcos marathon app add dcos-website.json
  ```

7. 转到 DC/OS Web 界面的 **服务** 选项卡，验证您的应用程序是否健康。

![健康服务](/1.10/img/healthy-dcos-website.png)

图 2. 健康检查

8. 转到您的公共代理查看网站运行。有关如何查找公共代理 IP 的信息，请参阅 [文档](/1.10/administering-clusters/locate-public-agent/)。
