---
layout: layout.pug
navigationTitle: 1.13.1 的发行说明
title: 1.13.1 的发行说明
menuWeight: 10
excerpt: DC/OS 1.13.1 版本注释，包括开源属性和版本策略。
渲染：胡须
模型：/mesosphere/dcos/1.13/data.yml
---
DC/OS 1.13.1 于 2019 年 5 月 31 日发布。

[button color="light" href="https://downloads.dcos.io/dcos/stable/1.13.1/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="http://downloads.mesosphere.com/dcos-enterprise/stable/1.13.1/dcos_generate_config.ee.sh"]下载 DC/OS Enterprise* [/button]

注册 DC/OS Enterprise 客户可以从 <a href="https://support.mesosphere.com/s/downloads">[支持网站]</a> 访问 DC/OS Enterprise 配置文件。对于新客户，请在尝试下载和安装 DC/OS Enterprise 版本之前，先联系销售代表或发送邮件至 <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a>。

# 发布版摘要
DC/OS 是一种分布式操作系统，使您可以在本地、云或混合群集环境中管理资源、应用程序部署、数据服务、网络和安全。

本版本提供了可解决报告问题的改进和修复，整合对之前版本的变更，并保持对 DC/OS 生态系统的兼容和支持。

如果您正从之前的版本进行升级，Mesosphere 强烈建议您安装 **DC/OS 1.13.1**，以最大程度地减少运行群集的中断。有关此升级建议的更多信息，请参见 [Marathon 产品咨询](https://support.mesosphere.com/s/article/Known-Issue-Marathon-MSPH-2019-0004)。

如果已经在生产环境中部署了 DC/OS，您还应查看[已知问题和限制](#已知问题)，以了解特定场景的任何潜在运行变更是否适用您的环境。

# 新特性和功能
DC/OS 1.13 包括新特性和功能，以改进安装和部署体验，简化群集管理，提高操作的生产率和效率，并提供额外监控、警报、日志记录和报告，以更好地了解群集活动。

## 新功能的亮点
本版本的一些亮点包括：
- 统一服务账户和身份验证体系结构
- 群集操作的监控和度量标准
- 对利用图形处理单元 (GPU) 提供加速处理的工作负载的扩展支持
- 通用安装程序和升级过程的改进
- 命令行程序的新功能和选项
- 监控群集性能的新仪表板选项
- Mesosphere Kubernetes 引擎 (MKE) 与 Edge-LB 负载均衡之间更紧密集成

DC/OS 1.13 中引入的特性和功能按功能区域或组件分组，并包含可查看其他文档的链接（若适用）。

## 统一服务账户和身份验证体系结构
DC/OS Enterprise 身份和访问管理服务 (IAM) 的核心已经开源并添加到 DC/OS，从而替换 DC/OS OpenAuth (`dcos-oauth`)。此架构更改包括将 CockroachDB 添加作为群集高可用性数据库，以用于身份和访问管理。

通过此项更改，DC/OS 现在还支持统一服务账户。服务账户允许个别程序和应用程序用自己的身份与 DC/OS 群集交互。服务账户登录成功时将产生身份验证证明 - DC/OS 认证令牌。通过管理节点 Admin Router 访问 DC/OS 服务和组件需要有效的 DC/OS 认证令牌。

此更改还使 DC/OS Enterprise 和 DC/OS Open Source 之间的认证架构保持一致。现在，对于 DC/OS Enterprise 和 DC/OS 开源而言，用于服务帐户管理和服务身份验证的 HTTP API 是相同的。对于 DC/OS Enterprise 和 DC/OS Open Source 群集，DC/OS 认证令牌是 RS256 类型的 JSON Web 令牌 (JWT)。在咨询 IAM 服务 JSON Web 密钥集 (JWKS) 端点后，可以通过系统中的任何组件验证 JWT 认证令牌。

## 群集操作的监控和度量标准
此版本扩展了 DC/OS 群集监控功能以及您可以收集和报告 DC/OS 组件的度量标准。监控和度量标准的增强功能让您可以通过 DC/OS 本身以及作为 Prometheus、Grafana 和其他服务的输入，更好地了解群集操作、活动和性能。

### 监控服务
- DC/OS 监控服务 (`dcos-monitoring`) 可配置成使用 DC/OS 存储服务 (DSS) 卷来存储时间序列数据。<!--(DCOS-47725)-->

    使用此版本，您可以将 DC/OS 监控服务收集的信息 (`dcos-monitoring`) 存储在 DC/OS 存储服务提供的基于配置文件的存储中。使用 DC/OS 存储服务存储 Prometheus 查询和 Grafana 仪表板中使用的监控数据，您可以改善 Prometheus 和 Grafana 监控组件的性能和可靠性。

    安装 DC/OS 监控服务时，您可以选择您想存储 Prometheus 时间序列数据库的文件系统的卷大小和卷配置文件 (`tsdb`)。通过指定 DC/OS 存储服务管理的卷，您可以充分利用 DSS 为您收集的数据带来的耐用性、性能和灵活性。

    有关使用 DC/OS 监控服务的更多信息，请参见 [DC/OS 监控服务](/mesosphere/dcos/services/beta-dcos-monitoring/)。有关使用 DC/OS 存储服务的更多信息，请参见 [DC/OS 存储服务](/mesosphere/dcos/services/storage/latest/)。

- DC/OS 监控服务让您能够导入安排的警报规则。<!--(DCOS-47666)-->

    使用此版本，部署 DC/OS 监控服务让您能够从 [Github 存储库] 导入 Mesosphere 提供的 Prometheus 警报规则(https://github.com/dcos/prometheus-alert-rules)。这些预定义的警报规则让您能够创建有关 DC/OS 群集状态的有意义的警报，包括成功或失败的操作和节点活动。

    Prometheus 警报规则作为 DC/OS 监控服务的一部分自动包含在内。可用于监控的每个 DC/OS 组件或框架都应具有包含所有警报规则的单个规则文件。这些警报规则使用 `rule_files` 配置参数被传输给 Prometheus，并配置成指定以下严重级别之一：
    - **警告** 警报识别需要通知但无需立即采取行动的问题。例如，识别为警告的警报可能会向管理员发送电子邮件通知，但不需要立即响应。
    - **关键** 警报识别需要立即予以关注的问题。例如，关键警报可能会触发寻呼机通知，指示需要立即采取行动。

- 监控服务自动为 DC/OS 创建一系列 Prometheus 驱动的精选 Grafana 仪表板。<!--(DCOS-44740)-->

    如果您部署 DC/OS 监控，则可以利用 Mesosphere 提供的基于 Grafana 的仪表板。通过安装和配置 `dcos-monitoring` 服务，您可以自动创建仪表板，它可以让您快速地可视化`dcos-monitoring` 包从 DC/OS 群集和 DC/OS 托管的应用程序收集的度量标准。有关使用 Grafana 仪表板的更多信息，请参阅 [仪表板资料库](https://github.com/dcos/grafana-dashboards)。

### 度量标准
DC/OS 度量标准通过 Telegraf 服务收集和管理。Telegraf 提供基于代理的服务，在 DC/OS 群集中的每个管理节点和代理节点上运行。默认情况下，Telegraf 从同一节点上运行的所有进程收集度量标准，收集的信息经过处理之后被发送到中央度量标准数据库。

使用此版本，您可以使用 Telegraf 收集和转发以下其他 DC/OS 群集组件的信息：
- CockroachDB
- ZooKeeper
- Exhibitor
- Marathon
- Metronome

您还可以收集有关 Telegraf 进程本身运行和性能的信息。此信息与其他度量标准一同存储，可用于使用 DC/OS 监控服务或第三方监控服务进行报告。有关 Telegraf 插件的信息以及 Telegraf 收集的关于其自身性能的度量标准，请参阅 [内部输入插件] 文档(https://github.com/influxdata/telegraf/tree/master/plugins/inputs/internal)。

- 默认情况下，将启用 Mesos 输入插件收集的新卷和网络度量标准。<!--(DCOS-47722, DCOS-47719)-->

    度量标准收集服务，`dcos-telegraf` 现在可以收集 Mesos卷和网络信息的其他度量标准。关于您可以收集和报告的 Mesos 度量标准的完整列表，请查看最新的 [度量标准列表](http://mesos.apache.org/documentation/latest/monitoring/)。

    在 DC/OS 中 1.13，`dcos-telegraf` 默认为自动收集 Mesos 度量标准。之前，您需要通过更新代理配置或通过将 `config.yaml` 文件中的 `enable_mesos_input_plugin` 参数设置为 `true` 来手动启用度量标准插件。使用此版本，不再需要手动启用此功能。相反，此参数的默认值现在设置为 true。如果您想要禁用 Mesos 度量标准的自动收集，您可以将 `config.yaml` 文件中的 `enable_mesos_input_plugin` 参数设为 false。

- 收集和报告可跟踪 DC/OS Telegraf 插件健康状态和性能的度量标准。<!--(DCOS-39012)-->

    DC/OS 度量标准通过 Telegraf 服务收集和管理。Telegraf 提供基于代理的服务，在 DC/OS 群集中的每个管理节点和代理节点上运行。默认情况下，Telegraf 从同一节点上运行的所有进程收集度量标准，收集的信息经过处理之后被发送到中央度量标准数据库。

    使用此版本，`dcos-telegraf` 程序收集并转发有关 Telegraf 进程本身运行和性能的信息。此信息与其他度量标准一同存储，可用于使用 DC/OS 监控服务或第三方监控服务进行报告。有关 Telegraf 插件的信息以及 Telegraf 收集的关于其自身性能的度量标准，请参阅 [内部输入插件] 文档(https://github.com/influxdata/telegraf/tree/master/plugins/inputs/internal)。

- 使用 Prometheus 格式揭示任务相关度量标准。

    您可以从以 Prometheus 格式在 Mesos 上运行的任务来揭示度量标准。当属于某个任务的端口配置被适当标记时，该端口上的度量标准端点将在任务的生命周期内定期轮询，收集的度量标准被添加到 Telegraf 管道。

    有关如何配置任务的详细说明，以便可以 Prometheus 格式收集其度量标准，请参见[Prometheus 输入插件](https://github.com/dcos/telegraf/tree/1.9.4-dcos/plugins/inputs/prometheus#mesos-service-discovery)。


- 将 UDP 活动的内部度量标准添加到 Telegraf `statsd` 输入插件。<!--DCOS_OSS-4759-->

    您可以收集和报告由于完整队列而丢失的传入消息数量的度量标准。此信息由 Telegraf 提供 `statsd` 输入插件提供，度量标准为 `internal_statsd_dropped_messages`。

- 为 DC/OS 代理节点和管理节点添加进程级度量标准。<!--DCOS-50778-->

    您可以收集和报告代理节点和管理节点进程的进程级度量标准。此信息由 Telegraf `procstat` 输入插件提供。此插件使用 `procstat_cpu_usage` 和 `procstat_memory_rss` 度量标准返回关于 CPU 和内存使用情况的信息。

- 为在 DC/OS 管理节点上运行的 Admin Router 实例添加度量标准。<!--DCOS_OSS-4562-->

    您可以使用 NGINX 虚拟主机度量标准收集和报告 DC/OS Admin Router 的度量标准。此信息由 Telegraf 和 NGINX 输入插件提供，默认情况下处于启用状态。您可以使用每个 DC/OS 管理节点上的 `/nginx/status` 端点来查看 NGINX 实例度量标准。

- 将故障域分域和区域信息添加到度量标准。<!--DCOS-16570-->

- 通过 Fluent Bit 启用标准化日志收集和转发。<!--(DCOS-43412)-->

    应用程序和 DC/OS 群集组件日志现在已聚合，这允许您配置对第三方日志存储、搜索和报告服务的转发。之前，转发记录的信息需要在群集节点上安装第三方代理或聚合器服务才能执行此任务。随着引入对 Fluent Bit（一种云本地的多平台日志处理器和转发器）的支持，您现在可以利用易于配置的插件对日志收集、搜索和报告服务执行日志筛选和转发。

    有关如何配置日志记录以与 Fluent Bit 集成，请参见 [日志记录](/mesosphere/dcos/1.13/monitoring/logging/)。

有关收集度量标准和配置度量标准插件的更多信息，请参阅以下主题：
- [度量标准插件架构](/mesosphere/dcos/1.13/metrics/architecture/)
- [Mesos 度量标准](/mesosphere/dcos/1.13/metrics/mesos/)
- [配置参考](/mesosphere/dcos/1.13/installing/production/advanced-configuration/configuration-reference/)

## 命令行界面
- 通过 DC/OS CLI 识别公共代理节点的面向公众的 IP 地址。<!--(DCOS-44697)-->

    使用此版本，您可以通过运行 `dcos node list` 命令来检索群集中节点面向公众的 IP 地址。有关检索公共 IP 地址的新命令的详细信息，请参见 [DCOS 节点](/mesosphere/dcos/1.13/cli/command-reference/dcos-node/) 命令参考。

    如果 DC/OS 部署在**公共云提供程序**上，例如 AWS、Google Cloud 或 Azure，您可以使用 DC/OS 基于 Web 的控制台、命令行界面或 DC/OS 群集节点 API 调用来查找公共代理 IP 地址。如果 DC/OS 安装在内部网络（本地）或专用云上，节点通常不具有独立的公共和专用 IP 地址。对于内部网络或专用云上的节点，公共 IP 地址通常与 DNS 命名空间中为服务器定义的 IP 地址相同。

- 自动安装 DC/OS Enterprise 命令行界面 (CLI)。<!--(DCOS-39775)-->

    如果您已部署 DC/OS Enterprise 群集，那么在安装基本 CLI 包时，您现在可以自动安装 DC/OS Enterprise CLI。之前，只有在成功安装基本 DC/OS CLI 后，才能手动安装 DC/OS Enterprise CLI。

    有关安装命令行界面 (CLI) 和 CLI 插件的更多信息，请参见 [安装 CLI](/mesosphere/dcos/1.13/cli/install) 和 [安装 DC/OS Enterprise CLI](/mesosphere/dcos/1.13/cli/enterprise-cli/)。

- 使用 Tab 键支持基本自动完成。<!--(DCOS-39774)-->

    现在，您可以使用 TAB 键在输入 DC/OS 命令时实现自动完成。自动完成功通过尝试预测您要输入的命令或子命令的其余部分，能让您更快地在 shell 终端中执行命令。如果建议的文本与您预期的命令匹配，您可以按 TAB 键接受建议并执行命令。

    有关在使用命令行界面 (CLI) 和 CLI 插件时使用自动完成功能的更多信息，请参见 [为 CLI 启用自动完成](/mesosphere/dcos/1.13/cli/autocompletion/)。

- 为 `dcos cluster attach` 和 `dcos cluster remove` 命令启用群集名称的动态自动完成。<!--(DCOS-47214)-->

    现在，您可以使用 TAB 键在运行 `dcos cluster attach` 或 `dcos cluster remove` 命令时实现潜在群集名称的自动完成。

    有关在使用命令行界面 (CLI) 和 CLI 插件时使用自动完成功能的更多信息，请参见 [为 CLI 启用自动完成](/mesosphere/dcos/1.13/cli/autocompletion/)。

- 使用 HomeBrew 为 macOS 添加 CLI 支持。<!--(DCOS-47562)-->

    Homebrew 是一个软件包管理程序，可用于为运行 macOS 或 Linux 操作系统的计算机安装和配置包。使用此版本，您可以使用 Mac OSX `homebrew` 实用程序安装 DC/OS 命令行界面 (CLI) 包。之前，您需要直接从 DC/OS 群集下载所有 DC/OS CLI 插件。通过添加对 Homebrew 包管理人员、操作人员和开发人员的支持，可以使用 `brew` 命令来保持其 CLI 包处于最新状态。例如，您可以通过运行以下命令来安装核心 CLI 包：

    ```bash
    brew install dcos-cli
    ```

    有关安装和使用 Homebrew 的更多信息，请查看 [Homebrew 网站](https://brew.sh/) 或 [Github 存储库](https://github.com/Homebrew/brew)。

## 数据服务
- 为 Edge-LB 池包添加唯一版本号。<!--(DCOS-40527)-->

    您可以运行一个命令来返回已安装的 Edge-LB 池包的版本号。使用通过 `edgelb version` 命令返回的版本号，您可以验证 Edge-LB 池和 Edge-LB API 服务器版本是否匹配。Edge-LB API 服务器和 Edge-LB API 池版本号应始终匹配。例如，如果已安装版本 v1.3.0 的 Edge-LB 池包，则 API 服务器版本也应为 v1.3.0。

- 启用 Edge-LB 池实例，以按比例放大或缩小。<!--(DCOS-28440)-->

    如果您不需要所有已配置的池实例，您可以将 Edge-LB 池实例的数量从较高数量减少到较低数量。要按比例缩小，只需更新 Edge-LB 池配置文件中的 `count` 变量，以反映所需的 Edge-LB 池实例数量。

## UI
- 启用 DC/OS UI 的独立升级。<!--(DCOS-47632)-->

    现在，您可以安装和更新 DC/OS UI 而无需升级 DC/OS 群集。此功能使得可以将 DC/OS 的新更新发布到 DC/OS 目录，并且也可以作为 `.dcos` 文件提供给本地客户。能够在不升级 DC/OS 群集的情况下安装和更新 DC/OS UI 的能力让您能够轻松获取 DC/OS UI 中可用的最新修复和功能，而不影响群集操作。现在，您还可以回滚更新，让您能够在必要时使用最初随 DC/OS 版本发送的 DC/OS UI 版本。

- 为服务提供准确的状态信息。<!--(DCOS-43460)-->

    现在，DC/OS 1.13 UI 在每个基于 SDK 的数据服务的详细信息分节含有新的选项卡。此新选项卡可清楚指明在生命周期内基于 SDK 的服务的状态和进度，包括安装和升级活动。在“详细信息”选项卡上，您可以看到有关当前正在运行或刚刚完成的具体操作计划的信息。您还可以查看每个任务的执行情况，以便能轻松跟踪已部署的计划的进度。

    有关查看服务和操作计划的最新状态的更多信息，请查看 [服务](/mesosphere/dcos/1.13/gui/services/) 文档。

- 识别 DC/OS UI 中公共代理节点面向公众的 IP 地址。<!--(DCOS-49987)-->

    使用此版本，您可以在 DC/OS UI 中查看代理节点面向公众的 IP 地址。之前，检索某个节点的公共 IP 地址需要写入一个自定义查询。有关在 DC/OS UI 中查看公共 IP 地址的更多信息，请参见 [查找公共 IP 地址](/mesosphere/dcos/1.13/administering-clusters/locate-public-agent/)。

    如果 DC/OS 部署在**公共云提供程序**上，例如 AWS、Google Cloud 或 Azure，您可以使用 DC/OS 基于 Web 的控制台、命令行界面或 DC/OS 群集节点 API 调用来查找公共代理 IP 地址。如果 DC/OS 安装在内部网络（本地）或专用云上，节点通常不具有独立的公共和专用 IP 地址。对于内部网络或专用云上的节点，公共 IP 地址通常与 DNS 命名空间中为服务器定义的 IP 地址相同。

- 添加国际化和本地化支持（I18N 和 L10N - 中文）。<!--(DCOS-39557)-->

    Mesosphere DC/OS 1.13 UI 现已翻译成现代标准汉语。现在，讲现代标准汉语的客户和用户可以轻松地切换 UI 中显示的语言，并能够以英语或中文与 DC/OS 操作和功能交互。DC/OS 文档也已翻译成中文，以支持这些客户。如果客户需求充足，可以提供额外的语言支持。

    有关更改显示语言的信息，请参见 [UI](/mesosphere/dcos/1.13/gui/) 文档。

##  安装
- 使用通用安装工具启用多区域支持。<!--(DCOS-45727)-->

    多区域部署可实现 DC/OS 群集的更高可用性，对多个区域的支持对希望维持正常运行时间而不易受区域中断影响的客户而言至关重要。如需更多信息，请参阅 [多区域部署] 文档(/mesosphere/dcos/1.13/installing/evaluation/aws/aws-remote-region/)。

- 支持通用安装工具上的动态管理节点。<!--(DCOS-45725)-->

    动态管理节点让您能够创建、销毁和恢复管理节点。使用此功能，您可以使用 Universal 安装工具来缩减或扩大 DC/OS 群集，不仅是能从目前受支持的代理节点，还能从管理节点——如果您认为必须这么做。如需更多信息，请参阅 [可更换的管理节点](/mesosphere/dcos/1.13/installing/evaluation/aws/aws-replaceable-masters/) 文档。


- 通过 Ansible 启用 Universal 安装工具和本地 DC/OS 生命周期管理。<!--(DCOS-45724)-->

    DC/OS Ansible (`dcos-ansible`) 组件是 Ansible 开源调配、配置管理和部署工具的 Mesosphere 提供版，让您能够使用支持的 Ansible 角色在选择的基础架构上安装和升级 DC/OS Open Source 和 DC/OS Enterprise 群集。如需更多信息，请参阅 [Ansible] 的文档(/mesosphere/dcos/1.13/installing/production/dcos-ansible/)。

## 作业管理和调度
- 通过增加对以下各项的支持，增强 DC/OS 作业处理能力：
    - 在 DC/OS UI 中创建新作业或使用新的 DC/OS 配置选项 `metronome_gpu_scheduling_behavior` 创建新作业时的图形处理单元 (GPU)。
    - 通用容器运行时 (UCR) 容器中运行的作业。
    - 基于文件的密钥。
    - 混合云部署。
    - `IS` 约束操作符以及 `@region` 和 `@zone` 属性。

- 当代理处于空闲状态时，提供启用或禁用邀约抑制的选项。

- 收集 DC/OS 上的“root”Metronome 进程的度量标准，以获得更好的可观测性。

- 为作业管理添加 HTTP 和正常运行时间度量标准。

- 将 `--gpu_scheduling_behavior` 配置选项的默认值设置为 `restricted`，以防止在作业定义未明确请求 GPU 支持时在已启用 GPU 的代理节点上启动作业。

<!--For more information about using these new features, see []().-->

## Marathon
- 启用安全计算 (seccomp) 和 UCR 容器的默认 seccomp 配置文件，以防止安全漏洞。

- 使用通用 DC/OS（基于 Mesos）检查替换基于 Marathon 的运行状况和准备情况检查。

- 收集 DC/OS 上的“root”Marathon 框架的度量标准，以获得更好的可观测性。

- 在 DC/OS 代理停用时自动替换实例。

- 将 `--gpu_scheduling_behavior` 配置选项的默认值设置为 `restricted`，以防止任务在应用程序或 Pod 定义未明确请求 GPU 支持时在已启用 GPU 的代理节点上启动。

- 对 Marathon 发起的运行状况检查实施全局限制，以获得更好的可量测性。

- 在代理处于空闲状态时禁用邀约，以获得更好的可量测性。

- 关闭缓慢事件消费者上的连接，以防止过度缓冲并减少对 Marathon 的负载。

## Mesos 平台和容器化
- 更新通用容器运行时 (UCR) 以支持 Docker 注册表清单规格 v2_schema2 镜像。<!--(DCOS-43871)-->

    现在，DC/OS 通用容器运行时 (UCR) 完全支持使用 Docker v2_schema2 规格格式化的Docker 镜像。DC/OS 通用容器运行时 (UCR) 还继续支持使用 v2_schema1 格式的 Docker 镜像。

    如需更多信息，请参见 [通用容器运行时](/mesosphere/dcos/1.13/deploying-services/containerizers/ucr/)。

- 增加通信心跳以提高恢复能力。

    DC/OS 群集现在包括执行器和代理通信信道心跳，以确保平台恢复能力，即使 `IPFilter` 已随 `conntrack` 启用，这通常会每五天导致一次连接超时。

- 通过第 4 层负载均衡支持任务零停机。

    DC/OS 群集运行状况检查现在提供任务就绪情况信息。此信息可实现服务扩展时的负载均衡零停机时间。使用此功能，在容器运行状况检查返回“就绪”状态前，负载均衡流量不会重定向到容器。

- 为使用图形处理单元 (GPU) 资源并基于 NVIDIA 容器运行时的应用程序添加 CUDA 10 图像处理支持。<!--(COPS-4504)-->

    CUDA 提供了一个并行计算平台，让您能够使用 GPU 资源进行通用处理。CUDA 平台使用 C 和 C ++ 等常用编程语言，提供对 GPU 虚拟指令集的直接访问。NVIDIA 容器运行时是一种容器运行时，支持 CUDA 图像处理，并且兼容开放容器计划 (OCI) 规范。

    使用此版本，DC/OS 增加了对 CUDA、NVIDIA 容器运行时容器以及使用 GPU 资源的应用程序的支持，让您能够为 GPU 加速的工作负载构建和部署容器。

## 网络
- 添加新网络 API 端点，以检索公共代理节点的 IP 地址。<!--(DCOS-28127)-->

    此版本引入了一个新的 API 端点，用于访问群集中节点面向公众的 IP 地址。有关检索和查看公共 IP 地址的更多信息，请参见 [查找公共 IP 地址](/mesosphere/dcos/1.13/administering-clusters/locate-public-agent/)。

    如果 DC/OS 部署在公共云提供程序上，例如 AWS、Google Cloud 或 Azure，您可以使用 DC/OS 基于 Web 的控制台、命令行界面或 DC/OS 群集节点 API 调用来查找公共代理 IP 地址。如果 DC/OS 安装在内部网络（本地）或专用云上，节点通常不具有独立的公共和专用 IP 地址。对于内部网络或专用云上的节点，公共 IP 地址通常与 DNS 命名空间中为服务器定义的 IP 地址相同。

## 安全
- 扩展 DC/OS 认证架构，以运用于 DC/OS Open Source (OSS) 和 DC/OS Enterprise 群集。<!--(DCOS-28672)-->

    现在，您可以创建统一的服务账户，这些账户可以在 DC/OS OSS 和 DC/OS Enterprise 群集中使用。通过扩展可用于所有 DC/OS 群集的服务账户的支持，您可以选择安装、配置和管理其他包，包括在以 `strict` 模式运行 DC/OS Enterprise DC/OS 时需要服务账户的包。

    有关认证和管理账户的更多信息，请参见 [安全](/mesosphere/dcos/1.13/security) 和 [用户账户管理](/mesosphere/dcos/1.13/security/oss/user-account-management/)。

- 支持安全计算模式 (seccomp) 配置文件。<!--(DCOS-28442, DCOS-49134)-->

    安全计算模式(`seccomp`) 是 Linux 内核提供的一项功能。您可以使用安全计算模式来限制应用程序或 pod 容器中允许的操作。如果使用的操作系统支持通用容器运行时 (UCR) 容器，则可以使用其默认配置文件来启用安全计算模式。

    使用 DC/OS，您可以使用 `seccomp` 配件文件来默认拒绝对特定系统调用的访问。配置文件定义了默认操作以及覆盖特定系统调用该默认操作的规则。

    如果需要使用最少权限的原则来获取对容器和操作的访问，那么使用安全计算模式配置文件是一个重要选项。

    有关安全计算模式和默认安全计算配置文件的更多信息，请参见 [安全计算配置文件](/mesosphere/dcos/1.13/security/oss/secure-compute-profiles/)。

## 存储
- 更新 Beta Rex-Ray 以支持 NVMe EBS 卷。<!--(DCOS-50047)-->

    Rex-Ray 是一款容器存储编排引擎，能实现云本地工作负载的持久性。使用 Rex-Ray，您可以通过命令行界面 (CLI) 管理本地 Docker 卷驱动程序操作。

    Amazon 弹性块存储 (Amazon EBS) 为 Amazon 弹性云 (EC2) 实例提供数据块级存储卷。Amazon EBS 卷可附加到在同一 Amazon 可用性区托管的任何运行的 EC2 实例，以提供独立于部署实例的持久存储。EBS 存储卷可以使用 NVMe（非易失性愉速存储器）作为主机控制器接口和存储协议来公开。NVMe 设备让您能够加快通过计算机连接网关在节点和固态硬盘 (SSD) 之间进行的数据传输。

    使用此版本，DC/OS 更新了 REX-Ray，以支持在 Amazon 实例上运行 DC/OS 群集时支持 NVMe 存储。但是，为了与 NVMe 设备配合使用，您必须提供自己的 `udev` 规则和 `nvme-cli` 包。有关使用 REX-Ray 的更多信息，请参见 [REX-Ray](https://rexray.io/) 网站和 [Github 存储库](https://github.com/rexray)。

- 提供一个驱动程序，可为 Mesosphere Kubernetes 引擎 (MKE) 启用 AWS 弹性块存储 (EBS) 卷。<!--(DCOS-44789)-->

    您可以使用 AWS EBS 容器存储接口 (CSI) 驱动程序管理 Mesosphere Kubernetes 引擎 (MKE) 的存储卷。此驱动程序让 MKE 用户能够部署在 AWS 云实例上的 DC/OS 群集中运行的有状态应用程序。

- 更新对容器存储接口 (CSI) 规范的支持。<!--DCOS-51279,DCOS-50136, DCOS-47222-->

    使用此版本，DC/OS 支持容器存储接口 (CSI) API 版本 1 (v1) 规范。您可以部署与容器存储接口 (CSI) API 兼容的插件 v0 或 v1 规范，以通过本地存储资源提供程序创建持久卷。DC/OS 自动检测您部署的插件支持的 CSI 版本。

# 此版本中已修复的问题
在 DC/OS 1.13.1 中修复的问题按特性、作用区域或组件分组。大多数更改说明都在括号中包含一个或多个问题跟踪标识符，以供参考。

### Admin Router
- 更改可通过 Admin Router 上传到服务的最大大小 (COPS-4651, DCOS-20269, DCOS-52768)。

    此版本中，允许包上传的最大大小从 1GB 增加到 16GB。此更改允许您将更大的包上传到注册表服务，而不会出现上传连接超时。

 - 提供某些 UI 资源时，支持 `gzip` 数据压缩 (DCOS-5978, DCOS-40441)。

<!--### Command-line interface (CLI) --> 

### 诊断和日志记录
- 增加配置参数，以控制收集日志文件和创建诊断捆绑包的超时时间 (DCOS_OSS-5097, DCOS-41821)。

    应用超时，使您可以在创建整合式诊断捆绑包以进行故障排除和分析时，限制可读取 `systemd` 日志条目的时间长度。您可以设置以下配置参数以控制超时时间：
    - `command-exec-timeout`：指定执行 `docker ps` 等命令所允许的最大秒数。默认值为 120 秒。
    - `diagnostics-job-timeout`：指定完成单个诊断捆绑包创建作业所允许的最大小时数。默认值为 12 小时。
    - `diagnostics-url-timeout`：指定单个 HTTP 请求允许的最大分钟数。默认值为 2 分钟。

### UI
- 更新 DC/OS UI 包，以确保其正确识别版本之间已发生变化的任务名称，并显示在升级之前运行的任务的正确任务状态 (COPS-4920，DCOS-54498)。

    在应用此修复之前，查看服务的 **任务** 选项卡时，升级前开始的任务可能会显示“无数据”。

### 安装
- 修复在使用 `noexec` 选项安装 `/tmp` 目录时导致某些 DC/OS 组件崩溃的问题 (DCOS-53077)。

- 更正运行 `dcos_generate_config.sh` 或 `dcos_generate_config.ee.sh` 脚本以及 `--validate-config` 选项时的返回输出，从而不会显示有关缺少已弃用配置设置（例如，`ssh_user` 和 `ssh_key_path`）的警告或错误消息 (COPS-4282，DCOS_OSS-4613，DCOS_OSS-5152）。

- 如果是在未被修改的状态下使用，则修复生成 `command not found` 错误的示例 `fault-domain-detect` 脚本中缺少的 echo 命令行 (DCOS-51792)。

<!--### Job management and scheduling --> 

### Marathon
- 改进对返回“TASK_UNKNOWN”状态的任务的处理 (COPS-4883, COPS-4913, MARATHON-8624)。

    在大多数情况下，当存在以下明确的协调请求时，会出现“TASK_UNKNOWN”状态：
    - 注册代理上的未识别任务
    - 未注册或不可访问代理上的任务请求

    在进行此修复之前，任何返回 `TASK_UNKNOWN` （作为一个 Mesos 任务状态）的应用程序实例都可能导致 DC/OS API 因以下错误而运行失败：

    “TASK_UNKNOWN 是一个未知的 Mesos 任务状态”
    
    此版本中，TASK_UNKNOWN 状态由其他 DC/OS 组件识别。此状态不会再引起运行故障或错误消息，因此无需删除任务并以新的唯一 ID 重启一个新的任务。

- 修复在使用持久卷扩展 Marathon 应用程序时出现的问题 (COPS-4892，DCOS_OSS-5212，DCOS-54468）。

    使用持久卷在先前的 DC/OS 版本中启动的任务，无法在 DC/OS 1.13.0 中重新启动。此问题影响了响应任务故障的重新启动以及通过重启之前暂停的任务来扩展应用程序。
  
    此版本中的修复，确保使用持久卷的任何 Marathon 任务可以暂停或失败，并可以重新使用其永久卷重启。

- 修改卷配置文件的支持，以便在需要配置文件时， Marathon 应用程序只匹配带有配置文件的磁盘资源 (DCOS_OSS-5211)。

    在这之前，如果您是将 Marathon 应用程序配置为“使用磁盘资源”，但未指定磁盘配置文件，那么 Marathon 会匹配任何磁盘资源。在此版本中，如果与其匹配的服务不需要具有该配置文件的磁盘，则 Marathon 将不使用具有配置文件的磁盘资源。

- 为 InstancEtrackerActor (MARATHON-8623) 中的无效状态命令异常提供更好的处理。

- 防止取消部署时出现罕见但良性的非检查空指针异常 (MARATHON-8616)。

### 度量标准
- 使框架名称能够在度量标记中正确解码 (DCOS_OSS-5039)。

    Mesos 管理节点通过使用框架名称的百分比编码 (%20)，允许框架名称中存在空格。此版本更新了 Telegraf 插件，使其能够解码框架名称并使用正确的标签导出度量。

# 网络
- 添加轮询调度 DNS 支持，以便 DNS 请求不总是以同一顺序返回地址 (A) 记录 (DCOS_OSS-5118)。

- 在 DNS 响应中的地址（A 或 AAAA）记录之前返回规范名称（CNAME）记录 (DCOS_OSS-5108)。

    对于大多数 DNS 客户端，返回记录的顺序不受影响。但是，有一些 DNS 客户端需要在 A 记录前列出 CNAME 记录。此更改解决了具有此要求的 DNS 客户端的问题。

### 安全
- 修复系统重新启动后 `dcos-iam-ldap-sync` 服务未能正确启动的问题 (COPS-4455，COPS-4814，DCOS-48107，DCOS-53420）。

    在此版本中，DC/OS 身份和访问管理 LDAP 同步 `systemd` 单元不再依赖于在加载配置时可用的 /opt/mesosphere 目录。

- 更新 DC/OS 身份和访问管理 bouncer 服务，使您能够使用任何正确配置的 Web 代理访问外部站点 (DCOS_OSS-5167)。

### 第三方更新和兼容性
- 更新 `urllib3` 至版本 1.24.2，解决在 [CVE-2019-11324](https://nvd.nist.gov/vuln/detail/CVE-2019-11324) 中使用 CA 证书时为 Python 识别的安全漏洞 (DCOS-52210)。

    此漏洞仍处于分析中。但是，在 Python 库中检测到一个问题，其中，在某些情况下，所需的 CA 证书集与 CA 证书的 OS 存储不同。可以利用该问题在验证应该失败的情况下允许成功的 SSL 连接。

- 将 DC/OS 身份和访问管理 (IAM) CockroachDB 组件更新至版本 2.0.7 (DCOS-38395)。

# 已知问题和限制
本部分介绍了不一定影响所有客户，但可能需要更改环境以解决特定情况的所有已知问题或限制。这些问题按特性、作用区域或组件分组。适用时，问题说明会在括号中包括一个或多个跟踪标识符，以供参考。
<!-- -->

### 分离作业配置详细信息
在本版本中，作业和作业调度以两个单独的步骤进行创建。因为该更改，您必须在不同部分的 JSON 编辑器中构建作业定义，类似于：

- 作业：指定作业标识符和作业配置详细信息的 JSON 定义。
- 调度：指定作业调度详细信息的 JSON 定义。

为作业创建 JSON 的两步法与之前的版本不同，其可以一步创建作业和调度。在之前版本中，作业可能会在其 JSON 配置中嵌入其调度。有关修改现有 JSON 配置的信息，请参见 [使用单独的 JSON 文件进行作业调度](/mesosphere/dcos/1.13/release-notes/1.13.0/#Known_issues_and_limitations)。

### 升级后的认证令牌
- 在 DC/OS 版本从 1.12.x 升级到 1.13.x 之前，由 DC/OS Open Authentication (`dcos-oauth`) 生成的认证令牌在升级期间变为无效。要生成用于访问 DC/OS 1.13.x 的新认证令牌，在完成升级后，使用有效凭据进行登录。

### 升级 Marathon 编排
- 您只能从 Marathon 1.6.x 或 1.7.x 升级至 Marathon 1.8。要从更早版本的 Marathon 进行升级，您必须首先升级至 Marathon 1.6.x 或 1.7.x。

### Marathon 应用程序名称限制
- 您不应在应用程序名称中使用受限关键字。

    您不应给应用程序添加以重启、任务或版本结尾的名称（标识符）。例如，应用程序名称 `/restart` 和 `/foo/restart` 是无效的，并且当您尝试发出 GET /v2/apps 请求时会产生错误。如果您的现有应用程序带有任何受限名称，尝试任何操作（删除除外）都将导致错误。在升级 Marathon 之前，应确保应用程序名称符合验证规则。

### 已弃用或已停用功能
- 在 DC/OS 1.13 中，DC/OS 历史服务已转变为已停用状态。历史服务计划在 DC/OS 1.14 中停用。您可以在 [Mesosphere DC/OS 功能成熟度生命周期]中找到每个功能成熟度状态的定义(/mesosphere/dcos/1.13/overview/feature-maturity/)。<!--DCOS-50304, DCOS-51996-->

- 之前用于安装 DC/OS 群集组件的一些配置参数不再有效。以下 `dcos_generate_config.sh` 命令行选项已被弃用和停用：
    * `--set-superuser-password`
    * `--offline`
    * `--cli-telemetry-disabled`
    * `--validate-config`
    * `--preflight`
    * `--install-prereqs`
    * `--deploy`
    * `--postflight`

    如果您尝试使用不再有效的选项，安装脚本会显示警告消息。您还可以通过运行 `dcos_generate_config.sh` 脚本以及 `--help` 选项来识别已被弃用的选项。针对不再使用的选项，`--help` 选项的输出显示 [已弃用]。

    这些选项将在 DC/OS 1.14 中删除。如果您有使用任何已弃用选项的脚本或程序，您应该更新它们。<!--(DCOS-48069, DCOS-50263, DCOS-51311, DCOS-51312, DCOS-51174)-->

- CLI 命令 `dcos node` 替换为新命令 `dcos node list`。<!--DCOS-51803-->

    安装此版本后，运行 `dcos node` 命令会自动重定向到 `dcos node list` 命令的输出。`dcos node list` 命令提供类似于 `dcos node` 命令输出内容的信息，还包括表示每个节点的公用 IP 地址的附加列。

    如果您有使用 `dcos node` 命令的输出的脚本或程序，那么您需测试 `dcos node list` 命令所提供的输出，然后根据需要更新您的脚本或程序。

- 基于 Marathon 的 HTTP、HTTPS、TCP 和准备就绪检查不再受支持。<!--DCOS-42564-->

    从 DC/OS 1.9 开始，基于 Marathon 的 HTTP、HTTPS 和 TCP 运行状况检查已被弃用。该版本中，基于 Marathon 的准备就绪检查也已经被弃用。

    如果您还未这么操作，那么您应该迁移服务，以使用 Mesos 运行状况和常规检查，而不是基于 Marathon 的检查。作为该迁移的一部分，您应该记住，您只能指定一个基于 Mesos 的运行状况检查和一个基于 Mesos 的常规检查。

- App 容器 (`appc`) 镜像的 Marathon 支持在 1.13 中已停用。<!--DCOS-42564-->

    自 2016 年以来，AppC 镜像没有得到积极的开发。AppC 镜像的支持将在 DC/OS 1.14 中删除。

- 将 `gpu_scheduling_behavior` 配置选项设置为 `undefined` 已不再受支持。<!--DCOS-42564-->

    此版本中，`gpu_scheduling_behavior` 配置选项的默认值为 `restricted`。值 `undefined` 已停用。该值将在 DC/OS 1.14 中删除。

    如果您有脚本或程序是将 `gpu_scheduling_behavior` 配置选项设置为 `undefined`，您应该根据需要进行更新。

- Marathon 不再支持 `api_heavy_events` 设置。<!--DCOS-42564-->

    此版本中，`/v2/events` 唯一允许的响应格式为 `light`（根据之前公布的弃用计划）。如果您尝试以指定的 `--deprecated_features=api_heavy_events` 设置启动 Marathon，则启动操作会因出错而失败。

- Marathon 不再支持基于 Kamon 的度量标准和相关的命令行参数。<!--DCOS-42564-->

    以下与过时的报告工具相关的命令行参数已被删除：
    * `--reporter_graphite`
    * `--reporter_datadog`
    * `--metrics_averaging_window`

    如果您指定其中任何一个 flag，Marathon 都将无法启动。

- 不再支持从备用 Marathon 实例中代理服务器发送事件 (SSE)。<!--DCOS-42564-->

    DC/OS 不再允许备用 Marathon 实例从 Marathon leader 代理 `/v2/events`。在这之前，可以使用 `proxy_events` flag 来强制 Marathon 代理 `/v2/events` 的响应。此备用重定向功能和相关 flag 在 1.13 中不再有效。

- Marathon 不再支持 `save_tasks_to_launch_timeout` 设置。<!--DCOS-42564-->

    `save_tasks_to_launch_timeout` 选项在 Marathon 1.5 中已被弃用，自此，在 Marathon 运行中使用该选项不会有任何效果。如果您指定 `save_tasks_to_launch_timeout` 设置，Marathon 将无法启动。

# 更新后的组件更改列表
要访问 DC/OS 分布中包含的组件的特定变更跟踪日志，请点击以下链接：
- Apache Mesos 1.8.0 [变更记录](https://github.com/apache/mesos/blob/f5770dcf322bd8a88e6c88041364a4089d92be90/CHANGELOG)。
- Marathon 1.8.x [变更日志](https://github.com/mesosphere/marathon/blob/1590825ea77c838a767bfcdb0fbe5b93cddce1c3/changelog.md)。
- Metronome 0.6.18 [变更记录](https://github.com/dcos/metronome/blob/90557686a08d97ef6bb7e55ac9c3a48d72e2a53d/changelog.md)。
- DC/OS 1.13.1 [变更日志](https://github.com/dcos/dcos/blob/1.13.1/CHANGES.md)。
<!--
- REX-Ray 0.11.4 [版本信息](https://github.com/rexray/rexray/releases/tag/v0.11.4)。
- Telegraf 1.9.x [变更日志](https://github.com/influxdata/telegraf/blob/release-1.9/CHANGELOG.md)。
- Erlang/OTP 21.3 [版本信息](http://erlang.org/download/otp_src_21.3.readme)。
- Java 8 [版本信息](https://java.com/en/download/faq/release_changes.xml)。-->

# 先前版本
要查看与先前版本的不同，请点击以下链接：
- [发布版本 1.10.11](/mesosphere/dcos/1.10/release-notes/1.10.11/) - 2019 年 2 月 12 日。
- [发布版本 1.11.10](/mesosphere/dcos/1.11/release-notes/1.11.10/) - 2019 年 2 月 12 日。
- [发布版本 1.12.3](/mesosphere/dcos/1.12/release-notes/1.12.3/) - 2019 年 3 月 14 日。
- [发布版本 1.13.0](/mesosphere/dcos/1.13/release-notes/1.13.0/) - 2019 年 5 月 8 日。
