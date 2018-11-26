---
layout: layout.pug
navigationTitle: 快速入门
excerpt: Spark 入门
title: 快速入门
menuWeight: 1
featureMaturity:
model: /cn/services/spark/data.yml
render: mustache
---

本《快速入门指南》将使您在几分钟内启动并运行 DC/OS {{ model.techName }} 服务。

**前提条件：**

- [安装 DC/OS 和 DC/OS CLI](/cn/1.11//installing/) ，每个代理有最低限度的 {{ model.install.nodeDescription }} 可用。
- 根据您的 [安全模式](/cn/1.11/security/)，{{ model.techShortName }} 需要服务认证才能访问 DC/OS。参见 [配置服务帐户](/cn/services/spark/2.3.1-2.2.1-2/security/#provisioning-a-service-account) 了解更多信息。

| 安全模式 | 服务帐户 |
|-----------|-----------|
| 已禁用 | 不可用 |
| 宽容 | 可选 |
| 严格 | **必填** |


# 安装

有关最低限度安装、多次安装和其他更复杂的任务的安装信息，请参阅[安装文档](/services/spark/2.3.1-2.2.1-2/install/)。
1. 安装 {{ model.techShortName }} 包。这可能需要几分钟。这将安装 DC/OS {{ model.techShortName }} 服务、{{ model.techShortName }} CLI、调度器和可选的 Spark History Server。参见 [Spark History Server](/services/spark/2.3.1-2.2.1-2/history-server/)安装历史服务器。

    ```bash
    dcos package install spark
    ```
    
 您的输出应该类似：
    
```bash
Installing Marathon app for package [spark] version [1.1.0-2.1.1]
Installing CLI subcommand for package [spark] version [1.1.0-2.1.1]
New command available: dcos spark
DC/OS Spark is being installed!

Documentation: https://docs.mesosphere.com/services/spark/
Issues: https://docs.mesosphere.com/support/
```

 您可以从 DC/OS GUI **服务** 选项卡查看您的 {{ model.techShortName }} 安装状态。
       
 ![验证 spark 安装](/services/img/spark-dashboard.png)

 图 1. 在 DC/OS Web 界面仪表盘中的 Spark
   
2. 输入 `dcos spark` 查看 {{ model.techShortName }} CLI 选项。
1. 使用此命令安装 {{ model.techShortName }} CLI：
     
```bash
dcos package install spark --cli
```
## 样本工作

1. 运行 DC/OS 的 SparkPi jar 样本。这会运行 {{ model.techShortName }} 计算 Pi 值的作业。您可以在 [此处查看示例源](https://downloads.mesosphere.com/spark/assets/spark-examples_2.11-2.0.1.jar)。

 1. 运行此命令：

```bash
dcos spark run --submit-args="--class org.apache.spark.examples.SparkPi https://downloads.mesosphere.com/spark/assets/spark-examples_2.11-2.0.1.jar 30"
```
        
 您的输出应该类似：
        
```bash
2017/08/24 15:42:07 Using docker image mesosphere/spark:2.0.0-2.2.0-1-hadoop-2.6 for drivers
2017/08/24 15:42:07 Pulling image mesosphere/spark:2.0.0-2.2.0-1-hadoop-2.6 for executors, by default. To bypass set spark.mesos.executor.docker.forcePullImage=false
2017/08/24 15:42:07 Setting DCOS_SPACE to /spark
Run job succeeded. Submission id: driver-20170824224209-0001
```       
3. 查看作业的标准输出：
    
```bash
dcos spark log driver-20170824224209-0001
```
        
 您的输出应该类似：
        
```bash
Pi is roughly 3.141853333333333
```
## Python SparkPi

1. 运行 Python SparkPi jar。这会运行 Python Spark 作业，该作业计算 Pi 的值。您可以在 [此处 查看示例源](https://downloads.mesosphere.com/spark/examples/pi.py)。

1. 运行此命令：
    
```bash
dcos spark run --submit-args="https://downloads.mesosphere.com/spark/examples/pi.py 30"
``` 
        
 您的输出应该类似：
        
```bash
2017/08/24 15:44:20 Parsing application as Python job
2017/08/24 15:44:23 Using docker image mesosphere/spark:2.0.0-2.2.0-1-hadoop-2.6 for drivers
2017/08/24 15:44:23 Pulling image mesosphere/spark:2.0.0-2.2.0-1-hadoop-2.6 for executors, by default. To bypass set spark.mesos.executor.docker.forcePullImage=false
2017/08/24 15:44:23 Setting DCOS_SPACE to /spark
Run job succeeded. Submission id: driver-20170824224423-0002
```
        
3. 查看作业的标准输出：
    
```bash
dcos task log --completed driver-20170616213917-0002
```
        
 您的输出应该类似：
        
```bash
Pi is roughly 3.142715
```
##  R 作业

1. 运行 R 作业。您可以在 [此处查看示例源](https://downloads.mesosphere.com/spark/examples/dataframe.R)。

1. 运行此命令：
    
```bash
dcos spark run --submit-args="https://downloads.mesosphere.com/spark/examples/dataframe.R"
```
        
 您的输出应该类似：
        
```bash
2017/08/24 15:45:21 Parsing application as R job
2017/08/24 15:45:23 Using docker image mesosphere/spark:2.0.0-2.2.0-1-hadoop-2.6 for drivers
2017/08/24 15:45:23 Pulling image mesosphere/spark:2.0.0-2.2.0-1-hadoop-2.6 for executors, by default. To bypass set spark.mesos.executor.docker.forcePullImage=false
2017/08/24 15:45:23 Setting DCOS_SPACE to /spark
Run job succeeded. Submission id: driver-20170824224524-0003
```
        
3. 查看作业的标准输出：
    
```bash
dcos spark log --lines_count=10 driver-20170824224524-0003
```
        
 您的输出应该类似：
        
```bash
In Filter(nzchar, unlist(strsplit(input, ",|\\s"))) :
bytecode version mismatch; using eval
root
|-- name: string (nullable = true)
|-- age: double (nullable = true)
root
|-- age: long (nullable = true)
|-- name: string (nullable = true)
name
1 Justin        
```

## 后续步骤

- 要查看作业状态，运行 `dcos spark webui` 命令，然后访问 Spark 集群调度器 UI： `http://<dcos-url>/service/spark/` 。
- 要查看日志，访问 Mesos UI：'http://<your-master-ip>/mesos`。
- 要查看关于您的 Spark 作业的详细信息，运行“dcos task log --completed <submissionId>”命令。
