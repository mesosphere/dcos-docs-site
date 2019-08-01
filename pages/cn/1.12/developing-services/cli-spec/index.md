---
layout: layout.pug
navigationTitle: CLI 规范
title: CLI 规范 
menuWeight: 3
excerpt: 使用命令行界面

enterprise: false
---
本文档适用于创建新 DC/OS CLI 子命令的开发人员。另请参阅 [Universe 入门指南][1]。

[DC/OS 命令行界面 (CLI)](/mesosphere/dcos/cn/1.12/cli/) 是管理群集节点、安装和管理包、检查群集状态，以及管理服务和任务的实用程序。DC/OS CLI 开放且可扩展：任何人都可以创建新子命令，可供最终用户安装。例如，[Spark DC/OS 服务] [2] 提供了兼容 Spark 的 CLI 扩展。安装后，您可以键入以下命令以提交 Spark 作业并查询其状态：
```
 dcos spark [<flags>] <command>
```


# DC/OS CLI 发现子命令的方式

运行 `dcos` 命令时，它会在当前 shell 的 PATH 中搜索 `~/.dcos/clusters/<cluster_id>/subcommands/<package_name>/env/bin` 目录中名称前缀为 `dcos-` 的可执行文件。

## 安装 CLI 子命令

如需安装 CLI 子命令，请运行：

```bash
dcos package install <package>
```

或
```bash
 dcos package install <package> --cli
```

DC/OS 服务和 CLI 子命令同样采用 [打包格式和资料库][11] 。

<p class="message--important"><strong>重要信息：</strong>CLI 模块<a href="/1.12/administering-clusters/multiple-clusters/">特定于群集</a>，并存储在 <code>〜/ .dcos / clusters /“cluster_id”/subcommands</code> 中。必须为每个群集安装 CLI 模块。例如，如果连接到群集 1 并安装 Spark 模块，则连接到也运行 Spark 的群集 2。在安装该群集的模块之前，Spark CLI 命令不可用。</p>

## 创建 DC/OS CLI 子命令

### 要求

*适用于 Mac、Linux 和 Windows 的可执行文件

### 标准标记
必须为每个DC/OS CLI 子命令分配一组如下标准标记：

```
--info
--help
-h
```

#### --info
`--info` 标记显示一行简短描述，描述了子命令的功能。该内容在用户运行 `dcos help` 时显示。


##### Spark CLI 的示例：

```
dcos spark --info
Spark DC/OS CLI Module
```

运行没有参数的 `dcos` 命令时，就会为每条子命令返回该信息：

```
dcos | grep spark
      spark        Spark DC/OS CLI Module
```

#### --help 和 -h
`--help` 和 `-h` 标记均显示子命令的详细使用情况。

Marathon CLI 示例：

```
dcos marathon --help
Description:
    Deploy and manage applications to DC/OS.
...
```

### 子命令命名规范
DC/OS CLI 子命令命名规范为：

 dcos <subcommand> <resource> <verb>

`resource` 通常是名词 ，`verb` 是资源支持的操作。例如在以下命令中， `resource` 是 `app` ，而操作是 `add`：

 dcos marathon app add

### 子命令记录
环境变量 `DCOS_LOG_LEVEL` 设置为用户在命令行中设置的日志级别。

[Python 的日志记录][7] 中描述了日志记录级别：调试、信息、警告、错误和关键。

### 打包 CLI 子命令

要使您的子命令可供最终用户使用：

1. 将包条目添加到 Mesosphere Universe 存储库。参见规范的 [Universe 说明书][9]。

    包条目必须包含名为 [resource.json][10] 的文件，其中包含可执行子命令的链接。

    运行 `dcos package install <package> --cli` 时：

1. 从存储库中检索 <package> 的包条目。
1. `resource.json` 文件被解析为查找 CLI 资源。
1. 用户平台的可执行文件已下载。

### DC/OS CLI 模块

[DC/OS CLI 模块][8] 具有一套用于子命令开发人员的工具。


## 示例：Hello World 子命令

[Hello World 示例][3] 执行称为 `helloworld`的新子命令：
```bash
 dcos package install helloworld --cli
 dcos helloworld
```

[1]: https://github.com/mesosphere/universe/blob/version-3.x/docs/tutorial/GetStarted.md
[2]: https://github.com/mesosphere/spark-build
[3]: https://github.com/mesosphere/dcos-helloworld
[7]: https://docs.python.org/2/howto/logging.html#when-to-use-logging
[8]: https://github.com/dcos/dcos-cli
[9]: https://github.com/mesosphere/universe/blob/version-3.x/README.md
[10]: https://github.com/mesosphere/universe/blob/version-3.x/README.md#resourcejson
[11]: https://github.com/mesosphere/universe/blob/version-3.x/README.md
