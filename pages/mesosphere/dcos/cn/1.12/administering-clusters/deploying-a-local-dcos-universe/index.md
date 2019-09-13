---
layout: layout.pug
navigationTitle: 部署本地 Universe
title: 部署本地 Universe
menuWeight: 1000
excerpt: 在本地 Universe 数据中心安装和运行 DC/OS 服务
enterprise: false
---


您可以通过本地 [Universe](https://github.com/mesosphere/universe)在数据中心（无互联网访问）上安装和运行 DC/OS 服务。

您可以部署包含所有已认证包的本地 Universe（最简单），或包含所选包的本地 Universe（高级）。

**前提条件：**

- [已安装 DC/OS CLI](/mesosphere/dcos/cn/1.12/cli/install/)。

- 登录到 DC/OS CLI。在 DC/OS Enterprise 上，您必须以具有 `dcos:superuser` 权限的用户登录。

<p class="message--note"><strong>注意：</strong>由于 Universe tarball 大小超过 2 GB，将其下载到您的本地驱动器，并将其上传到每个管理节点可能需要一些时间。</p>

<p class="message--note"><strong>注意：</strong>不支持在 MacOS 上创建本地Universe。</p>

# <a name="certified"></a>Certified Universe 包

本节介绍如何部署包含 Certified Universe 包的本地 Universe。

1. 从终端提示符中，使用以下命令将本地 Universe 及其服务定义下载到您的本地驱动器。

    ```bash
    curl -v https://s3.amazonaws.com/downloads.mesosphere.io/universe/public/local-universe.tar.gz -o local-universe.tar.gz
    curl -v https://raw.githubusercontent.com/mesosphere/universe/version-3.x/docker/local-universe/dcos-local-universe-http.service -o dcos-local-universe-http.service
    curl -v https://raw.githubusercontent.com/mesosphere/universe/version-3.x/docker/local-universe/dcos-local-universe-registry.service -o dcos-local-universe-registry.service
    ```

1. 使用[安全副本](https://linux.die.net/man/1/scp)将 Universe 和注册表文件传输到管理节点，在发出以下命令之前将 `<master-IP>` 替换为主服务器的公共 IP 地址。（您可以在 DC/OS Web 界面的左上角找到管理节点的公用 IP 地址。）

    ```bash
    scp local-universe.tar.gz core@<master-IP>:~
    scp dcos-local-universe-http.service core@<master-IP>:~
    scp dcos-local-universe-registry.service core@<master-IP>:~
    ```

1. 使用以下命令 [SSH](/mesosphere/dcos/cn/1.12/administering-clusters/sshcluster/) 至管理节点。将 `<master-IP>` 替换为先前命令中使用的 IP 地址。

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

1. 将 Universe 加载到本地 Docker 实例中。这可能需要一些时间才能完成。

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

## 配置多个管理节点

如果只有一个管理节点，请跳至下面的**将本地 Universe 连接到管理节点**。如果您有多个管理节点，请继续执行以下程序。

1. 使用以下命令发现所有管理节点的私用 IP 地址。识别现在从列表中通过 SSH 所进入的管理节点的私用 IP 地址。它将与在您的提示中 `core@ip-` 之后显示的路径匹配，其中连字符变为句号。

    ```
    host master.mesos
    ```

2. 使用 [安全副本](https://linux.die.net/man/1/scp) 将 Universe 和注册表文件传输到其他管理节点之一。将 `<master-IP>` 替换为另一个管理节点的 IP 地址。

    ```bash
    scp local-universe.tar.gz core@<master-IP>:~
    scp /etc/systemd/system/dcos-local-universe-registry.service core@<master-IP>:~
    scp /etc/systemd/system/dcos-local-universe-http.service core@<master-IP>:~
    ```

3. [SSH](/mesosphere/dcos/cn/1.12/administering-clusters/sshcluster/) 至收到这些复制文件的管理节点中

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

7. 将 Universe 加载到本地 Docker 实例中。这可能需要一些时间才能完成。

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

重复本部分操作，直到对所有管理节点完成这一程序。然后继续执行下面的将本地 Universe 连接到管理节点的步骤。

## 将本地 Universe 连接到管理节点

1. 通过键入 `exit` 或打开新终端提示关闭 SSH 会话。如果有多个管理节点，您可能必须退出多个 SSH 会话。

1. （可选）使用以下命令删除群集对默认 Universe 的引用。如果要将默认 Universe 保留在适当位置，只需将本地 Universe 添加为附加资源库，跳至下一步。您还可以从 DC/OS Web 界面中的 **设置** > **包资源库** 中删除对默认 Universe 资源库的指向。

    ```bash
    dcos package repo remove Universe
    ```


1. 使用以下命令添加对您已添加到每个管理节点的本地 Universe 的索引。

    ```bash
    dcos package repo add local-universe http://master.mesos:8082/repo
    ```
    
1. [SSH 至您的代理节点之一。](/mesosphere/dcos/cn/1.12/administering-clusters/sshcluster/)

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
  
1. 通过键入 `exit` 或打开新终端提示关闭 SSH 会话。在每个代理节点上重复步骤 28-30。
1. 要验证操作成功，登录 DC/OS Web 界面，单击 **目录** 选项卡。您会看到已认证包列表。安装其中一个包。

### 常见问题

* **我无法安装 CLI 子命令**

 包托管于 `master.mesos:8082`。如果您无法从您的 DC/OS CLI 安装解析或连接到 `master.mesos:8082`，您无法安装 CLI 子命令。如果您可以在管理节点上连接到端口 8082，将其中一个管理节点的 IP 添加到 `/etc/hosts`。

* **镜像破损**

 所有 Universe 组件都托管在您的群集中，包括镜像。组件由 `master.mesos:8082`提供。如果您已经连接到该 IP，您可以将其添加到 `/etc/hosts` 并让镜像工作。

* **我没有看到我在找的包**

 默认情况下，仅捆绑已认证的包。如果您想获得其他包，请参阅下一节中的说明。

# <a name="build"></a>选定的包

**先决条件：** [Git](https://git-scm.com/)。在 Unix/Linux 上，查看这些 <a href="https://git-scm.com/book/en/v2/Getting-Started-Installing-Git" target="_blank">安装说明</a>。

要部署包含您自己的包集合的本地 Universe，必须构建自定义本地 Universe Docker 镜像。

1. 克隆 Universe 资源库：

    ```bash
    git clone https://github.com/mesosphere/universe.git --branch version-3.x
    ```

2. 构建 `universe-base` 镜像：

    ```bash
    cd universe/docker/local-universe/
    sudo make base
    ```

3. 构建 `mesosphere/universe` Docker 镜像并将其压缩至 `local-universe.tar.gz`
文件。使用 `DCOS_PACKAGE_INCLUDE` 变量指定逗号分隔的包名和版本列表。要最大程度地减少容器尺寸和下载时间，您可以仅选择所需的内容。如果您不使用 `DCOS_PACKAGE_INCLUDE` 变量，所有 Certified Universe 包都会包括在内。要查看哪些包已获得认证，单击 DC/OS Web 界面中的 **目录** 选项卡。

    ```bash
    sudo make DCOS_VERSION=1.12 DCOS_PACKAGE_INCLUDE="cassandra:1.0.25-3.0.10,marathon:1.4.2" local-universe
    ```

4. 执行[Certified Universe包]（＃已认证）中描述的所有步骤。

