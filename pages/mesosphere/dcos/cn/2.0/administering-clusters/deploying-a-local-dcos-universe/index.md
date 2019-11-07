---
layout: layout.pug
navigationTitle:  部署本地目录
title: 部署本地目录
menuWeight: 1000
excerpt: 在本地目录数据中心安装和运行 DC/OS 服务
enterprise: false
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---

<p class="message--important"><strong></strong>重要信息：如果您是使用 DC/OS Enterprise，则使用 <tt>package-registry</tt> 无缝管理气隙环境中的包。本地 {{ model.packageRepo }} 支持已弃用。</p>

您可以通过使用本地 [{{ model.packageRepo }}](https://github.com/mesosphere/universe) 在数据中心（无互联网访问）安装和运行 DC/OS 服务。您可以部署包含所有已认证包（基础）的本地 {{ model.packageRepo }}，也可以部署包含选定包（高级）的本地 {{ model.packageRepo }}。

**前提条件：**

- [已安装 DC/OS CLI](/mesosphere/dcos/2.0/cli/install/)。

- 登录到 DC/OS CLI。在 DC/OS Enterprise 上，您必须以具有 `dcos:superuser` 权限的用户登录。
<p class="message--note"><strong>注意：</strong>由于 {{ model.packageRepo }} 压缩文件大小超过 2 GB，将其下载到您的本地驱动器，并将其上传到每个管理节点可能需要一些时间。</p>

# <a name="certified"></a>已认证 {{ model.packageRepo }} 包

本部分介绍如何部署包含已认证 {{ model.packageRepo }} 包的本地 {{ model.packageRepo }}。

1. 从终端提示符中，使用以下命令将本地 {{ model.packageRepo }} 及其服务定义下载到本地驱动器。

    ```bash
    curl -v https://downloads.mesosphere.com/universe/public/local-universe.tar.gz -o local-universe.tar.gz
    curl -v https://raw.githubusercontent.com/mesosphere/universe/version-3.x/docker/local-universe/dcos-local-universe-http.service -o dcos-local-universe-http.service
    curl -v https://raw.githubusercontent.com/mesosphere/universe/version-3.x/docker/local-universe/dcos-local-universe-registry.service -o dcos-local-universe-registry.service
    ```

1. 使用[安全副本](https://linux.die.net/man/1/scp) (scp) 将 {{ model.packageRepo }} 和注册表文件传输到管理节点，在发出以下命令之前将 `<master-IP>` 替换为管理节点的公共 IP 地址。（您可以在 DC/OS UI 的左上角找到管理节点的公共 IP 地址。）

    ```bash
    scp local-universe.tar.gz core@<master-IP>:~
    scp dcos-local-universe-http.service core@<master-IP>:~
    scp dcos-local-universe-registry.service core@<master-IP>:~
    ```

1. 使用以下命令 [SSH](/mesosphere/dcos/2.0/administering-clusters/sshcluster/) 至管理节点。将 `<master-IP>` 替换为先前命令中使用的 IP 地址。

    ```bash
    ssh -A core@<master-IP>
    ```

1. 确认文件已成功复制。

    ```
    ls
    ```

    您应该看到以下列出的文件。

    ```
    dcos-local-universe-http.service  
    dcos-local-universe-registry.service  
    local-universe.tar.gz
    ```

1. 将注册表文件移动到 `/etc/systemd/system/` 目录。

    ```
    sudo mv dcos-local-universe-registry.service /etc/systemd/system/
    sudo mv dcos-local-universe-http.service /etc/systemd/system/
    ```

1. 确认文件已成功复制到 `/etc/systemd/system/`。

    ```bash
    ls -la /etc/systemd/system/dcos-local-universe-*
    ```

1. 将 {{ model.packageRepo }} 载入本地 Docker 实例。这可能需要一些时间才能完成。

    ```bash
    docker load < local-universe.tar.gz
    ```

1. 重新启动 `systemd` 守护程序。

    ```bash
    sudo systemctl daemon-reload
    ```

1. 启用并启动 `dcos-local-universe-http` 和 `dcos-local-universe-registry` 服务。

    ```bash
    sudo systemctl enable dcos-local-universe-http
    sudo systemctl enable dcos-local-universe-registry
    sudo systemctl start dcos-local-universe-http
    sudo systemctl start dcos-local-universe-registry
    ```

1. 使用以下命令确认服务现已启动和运行。

    ```bash
    sudo systemctl status dcos-local-universe-http
    sudo systemctl status dcos-local-universe-registry
    ```

##配置多个管理节点

如果您只有一个管理节点，则跳转到下面[将本地 {{ model.packageRepo }} 链接到管理节点](#linking)。如果您有多个管理节点，请继续执行以下程序。

1. 使用以下命令发现所有管理节点的私有 IP 地址。识别现在从列表中通过 SSH 所进入的管理节点的私有 IP 地址。它将与在您的提示中 `core@ip-` 之后显示的路径匹配，其中连字符变为句号。

    ```
    host master.mesos
    ```

2. 使用[安全副本](https://linux.die.net/man/1/scp)将 {{ model.packageRepo }} 和注册表文件传输到其他管理节点之一。将 `<master-IP>` 替换为另一个管理节点的 IP 地址。

    ```bash
    scp local-universe.tar.gz core@<master-IP>:~
    scp /etc/systemd/system/dcos-local-universe-registry.service core@<master-IP>:~
    scp /etc/systemd/system/dcos-local-universe-http.service core@<master-IP>:~
    ```

3. [SSH](/mesosphere/dcos/2.0/administering-clusters/sshcluster/) 至收到这些复制文件的管理节点中

    ```bash
    ssh -A core@<master_IP>
    ```

4. 确认文件已成功复制。

    ```
    ls
    ```

    您应该看到以下列出的文件。

    ```
    dcos-local-universe-http.service  dcos-local-universe-registry.service  local-universe.tar.gz
    ```

5. 将注册表文件移动到 `/etc/systemd/system/` 目录。

    ```
    sudo mv dcos-local-universe-registry.service /etc/systemd/system/
    sudo mv dcos-local-universe-http.service /etc/systemd/system/
    ```

6. 确认文件已成功复制到 `/etc/systemd/system/`。

    ```bash
    ls -la /etc/systemd/system/dcos-local-universe-*
    ```

7. 将 {{ model.packageRepo }} 载入本地 Docker 实例。这可能需要一些时间才能完成。

    ```
    docker load < local-universe.tar.gz
    ```

8. 重新启动 Docker 守护程序。

    ```bash
    sudo systemctl daemon-reload
    ```

9. 启动 `dcos-local-universe-http` 和 `dcos-local-universe-registry` 服务。

    ```bash
    sudo systemctl start dcos-local-universe-http
    sudo systemctl start dcos-local-universe-registry
    ```

10. 确认服务现已启动和运行。

    ```bash
    sudo systemctl status dcos-local-universe-http
    sudo systemctl status dcos-local-universe-registry
    ```

重复本部分操作，直到对所有管理节点完成这一程序。然后继续执行下面将本地 {{ model.packageRepo }} 链接到管理节点部分。

<a name="linking"></a>

## 将本地 {{ model.packageRepo } 链接到管理节点

1. 通过键入 `exit` 或打开新的终端提示来关闭 SSH 会话。如果有多个管理节点，您可能必须退出多个 SSH 会话。

1. （可选）使用以下命令移除群集对默认 {{ model.packageRepo }} 的引用。如果要将默认的 {{ model.packageRepo } 留在适当位置，并且只将本地 {{ model.packageRepo }} 添加为附加资源库，请跳至下一步。您还可以从 DC/OS Web 界面中的 **设置** > **包资源库** 中移除对默认 {{ model.packageRepo }} 资源库的引用。

    ```bash
    dcos package repo remove {{ model.packageRepo }}
    ```


1. 使用以下命令添加对已添加到每个管理节点的本地 {{ model.packageRepo }} 的引用。

    ```bash
    dcos package repo add local-{{ model.packageRepo }} http://master.mesos:8082/repo
    ```
    
1. [SSH 至您的代理节点之一。](/mesosphere/dcos/2.0/administering-clusters/sshcluster/)

    ```bash
    dcos node ssh --master-proxy --mesos-id=<mesos-id>
    ```

1. 使用以下命令下载 DC/OS 证书副本到本地，并将其设置为可信任。

    ```bash
    sudo mkdir -p /etc/docker/certs.d/master.mesos:5000
    sudo curl -o /etc/docker/certs.d/master.mesos:5000/ca.crt http://master.mesos:8082/certs/domain.crt
    sudo systemctl restart docker
    ```

1. 配置 Apache Mesos 提取程序以信任下载的 Docker 证书。

   1. 复制证书：
   ```
   sudo cp /etc/docker/certs.d/master.mesos:5000/ca.crt /var/lib/dcos/pki/tls/certs/docker-registry-ca.crt
   ```
   1. 生成哈希：
   ```
   cd /var/lib/dcos/pki/tls/certs/
   openssl x509 -hash -noout -in docker-registry-ca.crt
   ```
   1. 创建软链接。您需要在公共代理创建 `/pki/tls/certs` 目录。
   ```
   sudo ln -s /var/lib/dcos/pki/tls/certs/docker-registry-ca.crt /var/lib/dcos/pki/tls/certs/<hash_number>.0
   ```
  
1. 通过键入 `exit` 或打开新的终端提示来关闭 SSH 会话。在每个代理节点上重复这些步骤。
1. 要验证是否成功，可登录 DC/OS Web 界面，单击 **{{ model.packageRepo }}** 选项卡。您会看到已认证包列表。安装其中一个包。

### 常见问题

* **我无法安装 CLI 子命令**

    包托管于 `master.mesos:8082`。如果您无法从您的 DC/OS CLI 安装解析或连接到 `master.mesos:8082`，您无法安装 CLI 子命令。如果您可以在管理节点上连接到端口 8082，将其中一个管理节点 IP 添加到 `/etc/hosts`。

* **镜像破损**

    所有 {{ model.packageRepo }} 组件都在您的群集中托管，包括镜像。组件由 `master.mesos:8082`提供。如果您已经连接到该 IP，您可以将其添加到 `/etc/hosts` 并让镜像工作。

* **我没有看到我在找的包**

    默认情况下，仅捆绑已认证的包。如果您想获得其他包，请参阅下一节中的说明。

# <a name="build"></a>选定的包

**先决条件：** [Git](https://git-scm.com/)。在 Unix/Linux 上，查看这些 <a href="https://git-scm.com/book/en/v2/Getting-Started-Installing-Git" target="_blank">安装说明</a>。

要部署包含一组您自己的包的本地 {{ model.packageRepo }}，必须构建一个自定义本地 {{ model.packageRepo }} Docker 镜像。

1. 克隆 {{ model.packageRepo }} 资源库：

    ```bash
    git clone https://github.com/mesosphere/universe.git --branch version-3.x
    ```

1. 构建 `universe-base` 镜像：

    ```bash
    cd universe/docker/local-universe/
    sudo make base
    ```

1. 构建 `mesosphere/universe` Docker 镜像并将其压缩至 `local-universe.tar.gz`
文件。使用 `DCOS_PACKAGE_INCLUDE`
变量指定逗号分隔的包名和版本列表。要最大程度地减少容器尺寸和下载时间，您可以仅选择所需的内容。如果您不使用 `DCOS_PACKAGE_INCLUDE` 变量，则所有已认证 {{ model.packageRepo }} 包都会
。要查看哪些包已获得认证，单击 DC/OS Web 界面中的
**目录** 选项卡。

    ```bash
    sudo make DCOS_VERSION=1.13 DCOS_PACKAGE_INCLUDE="cassandra:1.0.25-3.0.10,marathon:1.4.2" local-universe
    ```

1. 执行[已认证 {{ model.packageRepo }} 包](#certified) 中所述的所有步骤。

