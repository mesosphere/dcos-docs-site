---
layout: layout.pug
navigationTitle: dcos job history
title: dcos job history
menuWeight: 1
excerpt: 显示作业运行历史记录

enterprise: false
---


# 说明
`dcos job history` 命令让您查看您的作业运行历史记录。

# 使用

```bash
dcos job history <job-id> [OPTION]
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| | `--json` | 显示以 JSON 为格式的列表。 |
| | `--show-failures` | 显示故障表和历史记录统计信息。 |

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<job-id>`   |   指定作业ID.  您可以使用以下命令查看作业ID `dcos job list` 命令。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
|  [dcos job](/cn/1.11/cli/command-reference/dcos-job/)  | 在 DC/OS 中部署和管理作业。|

# 示例

## 查看作业历史

此示例显示了作业历史记录。

1. 列出作业并找到 ID：

    ```bash
    dcos job list
    ```

   输出如下：

      ```bash
      ID                DESCRIPTION                      STATUS       LAST SUCCESFUL RUN  
      my-job            A job that sleeps                Unscheduled         N/A          
      my-scheduled-job  A job that sleeps on a schedule  Unscheduled         N/A
      ```

1. 查看 `my-scheduled-job` 的作业历史记录：

    ```bash
    dcos job history my-scheduled-job
    ```

   输出如下：

   ```bash
   'my-scheduled-job'  Successful runs: 1 Last Success: 2017-02-17T23:18:33.842+0000
   ID                             STARTED                       FINISHED            
   20170217231831HkXNK  2017-02-17T23:18:31.651+0000  2017-02-17T23:18:33.843+0000
   ```

 <p class="message--note"><strong>注意: </strong> 请务必指定 <tt>--json</tt> 选项以查看 JSON 应用定义（例如， <tt>dcos job history my-scheduled-job</tt>）。</p>
