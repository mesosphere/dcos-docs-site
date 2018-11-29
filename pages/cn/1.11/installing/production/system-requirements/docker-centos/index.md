---
layout: layout.pug
navigationTitle: CentOS/RHEL 的 Docker 
title: 在 CentOS/RHEL 上安装 Docker 
menuWeight: 5
excerpt: 在 CentOS/RHEL 上安装 Docker CE 的要求、建议和程序
---

# 要求和建议

本说明涵盖在 CentOS/RHEL 上的安装 Docker CE 的步骤。在 CentOS/RHEL 上安装 Docker 之前，请先查看通用的 [在 DC/OS 上运行 Docker 的要求和建议](/cn/1.11/installing/production/system-requirements/#docker)。

* OverlayFS 现在是 Docker CE 中的默认值。无需另行指定或配置覆盖驱动程序。OverlayFS 避免已知问题 `devicemapper` 在 `loop-lvm` 模式下发生，并在必要时允许容器使用 docker-in-docker。

* 本说明专门针对 CentOS/RHEL 7.4。CentOS/RHEL 7 的其他版本也可适用，但可能需要对命令稍作修改。

* 必须采用 `ftype=1` 选项将节点存储格式化为 XFS。对于 CentOS/RHEL 7.2，仅 XFS 目前支持用作下层文件系统。[参见 RHEL 发行说明](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/7/html/7.2_Release_Notes/technology-preview-file_systems.html)。

* 如需更多通用 Docker 要求，请参阅 [系统要求： Docker ](/cn/1.11/installing/production/system-requirements/#docker)。


**注意：** 在现代版本的 Centos 和 RHEL 中， `ftype=1` 是默认值。`xfs_info` 应用程序可用于验证 `ftype=1`。

  ```bash
  mkfs -t xfs -n ftype=1 /dev/sdc1
  ```

# 安装 

遵循 Docker  [CenTos 专用安装说明](https://docs.docker.com/install/linux/docker-ce/centos/)。

### RHEL 专用要求

必须注册订阅管理器，才能启用其他存储库。

1. 在订阅管理器中订阅 RHEL 系统，并添加存储库

    ```bash
    sudo subscription-manager register --username <RHEL-SUBSCRIPTION-USERNAME> --password ******** --auto-attach

    sudo subscription-manager repos --enable=rhel-7-server-rpms
    sudo subscription-manager repos --enable=rhel-7-server-extras-rpms
    sudo subscription-manager repos --enable=rhel-7-server-optional-rpms
    ```

### 示例：在 CentOS/RedHat 上安装带有 OverlayFS 的 Docker 

以下说明演示如何在 CentOS 7 上使用带有 OverlayFS 的 Docker 。

1. 为覆盖存储库配置操作系统：

    ```bash
    sudo echo 'overlay' >> /etc/modules-load.d/overlay.conf
    sudo modprobe overlay
    ```

1. 运行 `yum` 更新：

    ```bash
    sudo yum update --exclude=docker-engine,docker-engine-selinux,centos-release* --assumeyes --tolerant
    ```

1. 卸载旧版本的 Docker（若有）：

    ```bash
    sudo yum remove docker \
                  docker-common \
                  docker-selinux \
                  docker-engine
    ```

1. 设置 Docker CE 存储库：

    ```bash
    sudo yum-config-manager \
        --add-repo \
        https://download.docker.com/linux/centos/docker-ce.repo
    ```

1. 显示 Docker CE 版本。

    ```bash
    sudo yum list docker-ce --showduplicates | sort -r
    ```

以下说明假设您已安装最新版本。

6. 安装 Docker CE：

    ```bash
    sudo yum install docker-ce
    ```

1. 启动 Docker：

    ```bash
    sudo systemctl start docker
    sudo systemctl enable docker
    ```

1. 采用 `hello-world` 应用程序测试 Docker ：

    ```bash
    sudo docker run hello-world
    ```

1. 验证 Docker 是否使用覆盖驱动程序：

    ```bash
    sudo docker info | grep Storage
    ```

要继续设置 DC/OS，请参阅 [安装文档](/cn/1.11/installing/production/deploying-dcos/installation/)。


