---
layout: layout.pug
navigationTitle: 配置
excerpt: 配置 HDFS
title: 配置
menuWeight: 20
model: /cn/services/hdfs/data.yml
render: mustache
---

#include /cn/services/include/configuration-install-with-options.tmpl
#include /cn/services/include/configuration-create-json-file.tmpl
#include /cn/services/include/configuration-service-settings.tmpl
#include /cn/services/include/configuration-regions.tmpl

## 节点配置

节点配置对象对应于 HDFS 集群中节点的配置。必须在安装过程中指定节点配置，其可以在配置更新过程中进行修改。所有属性（除了 `disk` 和 `disk_type`）都可在配置更新过程中修改。

### 内存配置备注

作为每个节点类型配置的一部分，可以指定分配给节点的内存量 (MB)。此值*必须*大于给定节点类型的指定最大堆大小。确保为 JVM 和其他开销所使用的额外内存分配足够的空间。一个良好的经验法则是分配堆大小两倍的内存（使用 `hdfs.hadoop_heapsize` 或 `<node type>.hadoop_<node type>node_opts`进行设置）。

### 磁盘类型备注

如已备注的，在初始安装之后，磁盘大小和类型规范无法修改。此外，还可以使用以下磁盘卷类型：

* `ROOT`：数据存储在代理工作目录的同一卷上，节点任务使用配置的磁盘空间量。
* `MOUNT`：数据将存储在连接到代理的专用、操作员格式化的卷上。专用的挂载卷具有性能优势，这些挂载卷上的磁盘错误将正确地报告给 HDFS。

## HDFS 文件系统配置

HDFS 文件系统网络配置、权限和压缩通过 `hdfs` JSON 对象配置。在安装时设置这些属性后，它们将无法被重新配置。

## 操作系统配置

为使 HDFS 正常运行，您必须对托管部署的操作系统执行几个重要的配置修改。HDFS 需要生产存储服务器典型的 OS 级配置设置。

<table class="table">

  <tr>
    <th>文件</th>
    <th>设置</th>
    <th>值</th>
    <th>原因</th>
  </tr>

   <tr>
    <td>/etc/sysctl.conf</td>
    <td>vm.swappness</td>
    <td>0</td>
    <td>如果 OS 置换出 HDFS 进程，它们可能无法响应 RPC 请求，导致集群将进程标记为关闭。这对于名称节点和日志节点尤为棘手。</td>
  </tr>

  <tr>
    <td>/etc/security/limits.conf</td>
    <td>nofile</td>
    <td>无限制</td>
    <td>如果此值太低，在 HDFS 集群上操作的作业可能因为过多开放的文件句柄而出故障。</td>
  </tr>

  <tr>
    <td>/etc/security/limits.conf<>/etc/security/limits.d/90-nproc.conf</td>
    <td>nproc</td>
    <td>32768</td>
    <td>HDFS 节点会产生大量线程，增加内核 nproc 计数。如果 nproc 未能正确设置，该节点将被终止。</td>
  </tr>

</table>
