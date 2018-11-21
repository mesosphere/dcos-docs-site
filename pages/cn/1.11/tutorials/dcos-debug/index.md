---
layout: layout.pug
navigationTitle: 调试 DC/OS 上的应用程序
title: 教程 - 调试 DC/OS 上的应用程序
excerpt: 调试分布式系统中的应用程序部署问题
menuWeight: 55
---

<!-- i. Support Disclaimer -->

<table class="table" bgcolor="#FAFAFA"> <tr> <td style="border-left: thin solid; border-top: thin solid; border-bottom: thin solid;border-right: thin solid;"><b>重要信息：</b>Mesosphere 不支持本教程、相关脚本或命令，它们不提供任何形式的保证。本教程的目的是为了演示功能，因此不适合在生产环境中使用。在您的环境中使用类似的解决方案之前，您必须进行调整、验证和测试。</td> </tr> </table>

<!-- ii. Intro/Set Expectations for this Tutorial -->

本教程仅旨在提供在 DC/OS 上部署期间和之后调试应用程序的自上而下的简介。它不应被视为在 DC/OS 上进行调试的详尽资源，而是一个起点。

调试分布式系统中的应用程序部署问题通常是一项具有挑战性的任务。DC/OS 提供多种用于调试的工具，可能很难选择适用于您特定情况的工具。为了完成本教程，您应掌握 DC/OS 的应用知识。但是，如果需要，还有许多其他[教程可以让您运行和使用DC/OS](/cn/1.11/tutorials/)。

请记住，使用分布式系统时，很可能出现故障。许多组件必须配置为准确的规格，以便按预期一起运行。这在安装和初始配置期间需要具备详细的准备和意识。幸运的是，这也意味着通过在应用程序架构的一般设计中格外小心，可以防止出现许多错误：

- [设计应用程序以实现可调试性](https://schd.ws/hosted_files/mesosconeu17/a6/MesosCon%20EU%202017%20University%20Slides.pdf)
- [遵循部署的最佳实践](https://mesosphere.com/blog/improving-your-deployments/)
- [设置监控和警报，以便尽早解决问题](https://docs.mesosphere.com/1.10/cli/command-reference/dcos-node/dcos-node-diagnostics/)

我们将首先了解在 DC/OS 上部署应用程序时可能遇到的[一些潜在问题](/cn/1.11/tutorials/dcos-debug/problems/)。接下来，我们将了解用于调试的[标准工具集](/cn/1.11/tutorials/dcos-debug/tools/)。然后，在介绍[使用这些工具的一般策略](/cn/1.11/tutorials/dcos-debug/gen-strat/)后，我们用两个[具体实例](/cn/1.11/tutorials/dcos-debug/scenarios/)来说明策略在实践中的作用。我们鼓励您首先尝试自己调试这些挑战，但我们也提供了调试这些挑战的详细指导。在 [dcos-debugging github 存储库](https://github.com/dcos-labs/dcos-debugging/tree/master/1.10/) 中还有更多这样的方案。此外，请随时为此存储库提供您自己的调试方案。
