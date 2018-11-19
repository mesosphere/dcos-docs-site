---
layout: layout.pug
excerpt: 运行时自定义 Spark
navigationTitle: 运行时更改
title: 运行时配置更改
menuWeight: 70
featureMaturity:
model: /cn/services/spark/data.yml
render: mustache
---

适当时候，您可以在其启动并运行时，自定义 DC/OS {{ model.techName }}。

1. 转到 DC/OS Web 界面。

2. 单击 **服务** 选项卡，然后选择 {{ model.techShortName }} 服务。

![Spark 仪表板](/services/img/spark-dashboard.png)

图 1. 服务 > {{ model.techShortName }} 服务

3. 选择要更新的 {{ model.techShortName }} 框架的名称。

![Spark 框架详情](/services/img/spark-framework-details.png)

图 2. {{ model.techShortName }} 详情

4. 在右上方选择 **编辑**。

5. 在显示的屏幕中，将任何字段更新为其所需值。您可以从左侧菜单中配置 **服务**、**安全**或 **HDFS** 设置。

![Spark 配置屏幕](/services/img/spark-config-properties.png)

图 3. {{ model.techShortName }} 配置屏幕

6. 单击 **查看和运行**按钮以应用任何更改并干净地重新加载 {{ model.techShortName }}。

![查看按钮](/services/img/review-and-run-button.png)

图 4. “查看和运行”按钮

