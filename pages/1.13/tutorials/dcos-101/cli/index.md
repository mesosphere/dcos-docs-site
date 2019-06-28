---
layout: layout.pug
excerpt: Install the command-line interface to perform your day-to-day tasks (part 2)
title: Install the command-line interface
navigationTitle: Install the command-line interface
menuWeight: 2
---
The DC/OS command-line interface (CLI) provides a convenient way for you to perform your administrative tasks, retrieve information about components and operations, and monitor cluster status and activity. 

Although you can perform many of the same tasks interactively using the DC/OS web-based console or programmatically using calls to the DC/OS application programming interface (API), most cluster operators use command-line programs interactively or in scripts to manage most of their common cluster operations and cluster-related activity.

# Before you begin
Before starting this tutorial, you should verify the following:
- You must be able to access a properly-configured DC/OS cluster with at least at least one master node and three agent nodes from the computer hosting the CLI.
- You must have an account with administrative privileges for the local operating system.
- You must be able to open a command-line shell on the computer hosting the CLI.
- You must be able to run the client URL (`cURL`) program on the computer hosting the CLI.
- You must disable any security or antivirus software before you start the installation (Windows only).

# Learning objectives
By completing this tutorial, you will learn:
- How to download the DC/OS command-line interface (CLI) from the DC/OS web-based administrative console.
- How to install DC/OS command-line interface (CLI) directly from the package repository
- How to connect to a cluster from a terminal shell on your local computer using the DC/OS CLI. 
- How to perform common administrative tasks using CLI commands.

# Install the DC/OS CLI
1. Open a terminal shell on the computer where you want to install the DC/OS command-line interface (CLI).

1. Open a web browser and navigate to the URL for the DC/OS web-based administrative console. 

1. Click the cluster name menu located in the top-right corner of the DC/OS web-based console.

    ![open cluster popup](/1.13/img/tutorial-cluster-menu.png)

1. From the cluster name menu , select **Install CLI**.

1. Click the appropriate operating system tab for the computer where you want to install the CLI.

1. Follow the instructions displayed on the tab for your operating system.

    For example, for Linux or macOS, copy the code snippet displayed in the Install CLI dialog box and paste it into the terminal shell to download the CLI package to the local computer.

1. Type the password for an administrative account on the local host computer.

1. Type the user name and password for the cluster administrative account.

    The default administrative user name for the cluster is `bootstrapuser`. The default password for the account is `deleteme`.

1. Verify you can connect to the cluster from the command line by running the following command:

    ```bash
    dcos cluster list
    ```

    If the cluster is available and the CLI installation completed successfully, the command returns basic information about the cluster similar to the following:

    ```bash
    NAME                        ID                    STATUS    VERSION                                       URL                                       
    *  lgunn-sidebet  351c8aa0-880e-459a-9483-cd6a4ab4391e  AVAILABLE  1.13.0   http://lgunn-sid-elasticl-1lqsarfasaw88-301095172.us-west-2.elb.amazonaws.com
    ``` 
1. Close the Install CLI dialog box in the DC/OS web-based administrative console.

# Verify login credentials
You can verify an account is authorized to connect to the cluster by running the following command:

```bash
dcos auth login
```

Initially, only the default cluster administrative account is authorized to connect to the cluster. As you authorize other users to access the cluster and replace the default cluster administrative account and password, you can verify their access to the cluster by running the `dcos auth login` command.

# Verify services running on the cluster
After you install the DC/OS CLI, there are many commands available for you to check the status of the cluster and perform routine administrative tasks.

For example, you can check the list of running services byt running the following command:

```bash
dcos service
```

If you have just completed the previous tutorial and have not yet installed any additional services, this command returns information similar to the following:

```
NAME          HOST    ACTIVE  TASKS  CPU  MEM  DISK  ID                                         
marathon   10.0.4.82   True     0    0.0  0.0  0.0   ec31ddcf-1e31-4556-9f3b-9a56e172b6ef-0001  
metronome  10.0.4.82   True     0    0.0  0.0  0.0   ec31ddcf-1e31-4556-9f3b-9a56e172b6ef-0000  
```

These services are installed and started as part of the initial DC/OS installation:
- The `marathon` service is a fundamental component of the DC/OS cluster and provides initialization services for the DC/OS core.
- The `metronome` service provides basic scheduling and job management similar to the `cron` program for the DC/OS cluster.

As you deploy additional services, you can use the `dcos service` command to verify the status of those services.

# Checking the status of connected nodes
You can use the DC/OS command-line interface to check the status of connected nodes and to return log information. As a starting point for exploring your DC/OS cluster, you might want to run the `dcos node list` command. 

```bash
dcos node list
```

This command returns basic information about the connected agent and master nodes in your cluster. For example:

```bash
    HOSTNAME         IP      PUBLIC IP(S)                     ID                          TYPE           REGION           ZONE       
  10.0.2.246     10.0.2.246                 ec31ddcf-1e31-4556-9f3b-9a56e172b6ef-S1  agent            aws/us-west-2  aws/us-west-2a  
  10.0.5.193     10.0.5.193  52.24.8.165    ec31ddcf-1e31-4556-9f3b-9a56e172b6ef-S0  agent            aws/us-west-2  aws/us-west-2a  
  master.mesos.  10.0.4.82   34.220.80.239  ec31ddcf-1e31-4556-9f3b-9a56e172b6ef     master (leader)  aws/us-west-2  aws/us-west-2a  
  ```

You might also want to explore the logs for individual nodes. For example, you can retrieve detailed information about the current master node leader by running the command `dcos node log --leader`. 

This command returns the information recorded in log messages for the leading master. The messages logged provide information to this sample entry:

```bash
2019-05-27 18:47:51 UTCbouncer.sh [2847]: 10.0.4.82 [27/May/2019:18:47:51 +0000] "GET /acs/api/v1/internal/policyquery?rid=dcos:adminrouter:ops:mesos&uid=dcos_history_service&action=full HTTP/1.0" 200 22 "-" "Master Admin Router" (0.001926 s)
```

Similarly, you can retrieve detailed information about a specific node by running a command similar to the following:

```bash
dcos node log --mesos-id ec31ddcf-1e31-4556-9f3b-9a56e172b6ef-S1
``` 

In this example, `ec31ddcf-1e31-4556-9f3b-9a56e172b6ef-S1` is the agent identifier (ID). You can use the `dcos node list` command to look up the agent identifier, then retrieve log information for the agent. You can then use the information returned to trace agent activity, analyze operation, or troubleshoot potential issues.

# Getting usage information for CLI programs
To explore the types of information available through the DC/OS CLI options, enter the `dcos help` command. This help option summarizes the top-level of commands available. For example:
```
Usage:
  dcos [command]

Commands:
  auth
      Authenticate to DC/OS cluster
  backup
      Access DC/OS backup functionality
  cluster
      Manage your DC/OS clusters
  config
      Manage the DC/OS configuration file
  help
      Help about any command
  job
      Deploy and manage jobs in DC/OS
  license
      Manage your DC/OS licenses
  marathon
      Deploy and manage applications to DC/OS
  node
      View DC/OS node information
  package
      Install and manage DC/OS software packages
  plugin
      Manage CLI plugins
  security
      DC/OS security related commands
  service
      Manage DC/OS services
  task
      Manage DC/OS tasks

Options:
  --version
      Print version information
  -v, -vv
      Output verbosity (verbose or very verbose)
  -h, --help
      Show usage help
```

You can then use the `--help` option for individual commands to view usage information about a specific command. For example, you can run `dcos node --help` to see information about specific `dcos node` commands and arguments. For more information about working with the DC/OS command-line interface, see the [CLI documentation](/1.13/cli/).

# Next steps
Congratulations! You have successfully connected to your cluster using the DC/OS CLI, and started exploring some of the tasks and information available using the DC/OS command-line interface.

The next tutorials explore additional getting started tasks that you can perform using the DC/OS web-based administrative console or command-line interface:
- [Install your first service from the package repository](../first-package/)
- [Deploy your first sample application](../first-app/)
- [Discover deployed services](../service-discovery/)

# Related topics
You have already worked with several core components of the DC/OS architecture, including the Mesos kernel, Marathon, and Metronome. For more information about these DC/OS components and where they fit into the DC/OS platform or features and services, see the following topics in the main DC/OS [documentation](../../../overview/architecture/components/):
- [Marathon](../../../overview/architecture/components/#marathon) starts and monitors DC/OS applications and services.
- Apache [Mesos](../../../overview/architecture/components/#apache-mesos) is the kernel of DC/OS and responsible for low-level task maintenance.
- [Mesos DNS](../../../overview/architecture/components/#mesos-dns) provides service discovery within the cluster.
- [DC/OS Net](../../../overview/architecture/components/#dns-forwarder) provides networking services such as the DC/OS internal layer-4 load balancer.
- [Admin router](../../../overview/architecture/components/#admin-router) is an open source NGINX configuration that provides central authentication and proxy to DC/OS services.
- [Package repository](../../../overview/architecture/components/#package-management) is the package repository that holds the DC/OS services, such as Apache Spark or Apache Cassandra, that you can install on your cluster directly from the DC/OS web-based console or command line interface (CLI).
