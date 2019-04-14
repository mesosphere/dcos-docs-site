---
layout: layout.pug
navigationTitle:  dcos node list
title: dcos node list
menuWeight: 6
excerpt: Displaying DC/OS node information
enterprise: false
---

# Description

The `dcos node list-` command displays a list of DC/OS master and agent nodes with identifying information, including:
- Hostname
- IP address
- Public IP address
- Unique identifier
- Node type
- Cluster region
- Availability zone      

You can use this command to look up the public agent IP address if DC/OS is deployed on a public cloud provider such as AWS, Google Cloud, or Azure. If DC/OS is installed on an internal network (on-premise) or on a private cloud, nodes do not typically have separate public and private IP addresses. For nodes on an internal network or private cloud, the public IP address is most often the same as the IP address defined for the server in the DNS namespace.

# Usage

```bash
dcos node list [OPTION]
```

# Options

| Name, shorthand |  Description |
|---------|-------------|
| `--field dcos node`   |  Specifies the name of one or more additional fields you want to include in the output of the dcos node command. You can include this option multiple times to add multiple fields. |
| `--help, h`   |   Displays usage. |
| `--info`   |  Displays a short description of this subcommand. |
| `--json`   |    Displays JSON-formatted data. |
| `--version`   |  Displays version information. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos node](/1.13/cli/command-reference/dcos-node/) | View DC/OS node information. |

# Example
To following example illustrates how you can use this command to find the public-facing IP address for nodes in a small cluster:
```bash
dcos node list

dcos node list 
    HOSTNAME         IP      PUBLIC IP(S)                     ID                          TYPE           REGION           ZONE       
  10.0.2.148     10.0.2.148                 69e4f34a-e5c4-4271-85b5-b6609056bcde-S1  agent            aws/us-west-2  aws/us-west-2a  
  10.0.4.118     10.0.4.118  52.34.156.169  69e4f34a-e5c4-4271-85b5-b6609056bcde-S0  agent (public)   aws/us-west-2  aws/us-west-2a  
  master.mesos.  10.0.7.51   54.202.215.97  69e4f34a-e5c4-4271-85b5-b6609056bcde     master (leader)  aws/us-west-2  aws/us-west-2a  
```

The following example illustrates adding port information to the output for the command:
```bash
dcos node list --field port

    HOSTNAME         IP      PUBLIC IP(S)                     ID                          TYPE           REGION           ZONE       PORT  
  10.0.2.148     10.0.2.148                 69e4f34a-e5c4-4271-85b5-b6609056bcde-S1  agent            aws/us-west-2  aws/us-west-2a  5051  
  10.0.4.118     10.0.4.118  52.34.156.169  69e4f34a-e5c4-4271-85b5-b6609056bcde-S0  agent (public)   aws/us-west-2  aws/us-west-2a  5051  
  master.mesos.  10.0.7.51   54.202.215.97  69e4f34a-e5c4-4271-85b5-b6609056bcde     master (leader)  aws/us-west-2  aws/us-west-2a        
```
