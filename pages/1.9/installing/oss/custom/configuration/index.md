---
layout: layout.pug
navigationTitle:  Configuration
excerpt:
title: Configuration
menuWeight: 600
---

The DC/OS configuration parameters are specified in YAML format in a config.yaml file. This file is stored on your [bootstrap node](/1.9/installing/oss/custom/system-requirements/#bootstrap-node) and is used during DC/OS installation to generate a customized DC/OS build.

# Format

## Key-value pairs
The config.yaml file is formatted as a list of key-value pairs. For example:

```yaml
bootstrap_url: http://<bootstrap_ip>:<your_port>
```

## Config blocks and lists
A config block is a group of settings. It consists of:

- A key followed by a colon (e.g. `agent_list:`). The key of the config block must be on its own line, with no leading space.
- A list of values formatted by using single dash (`-`) followed by a space; or an indented set of one or more key-value pairs. The indentation for each key-value pair must be exactly two spaces. Do not use tabs.
- Any number of empty lines or comment lines.

When a new config block appears in the file, the former config block is closed and the new one begins. A config block must only occur once in the file. For example:

```yaml
master_list:
- <master-private-ip-1>
- <master-private-ip-2>
- <master-private-ip-3>
```

## Comments
Comment lines start with a hash symbol (`#`). They can be indented with any amount of leading space.

Partial-line comments (e.g. `agent_list # this is my agent list`) are not allowed. They will be treated as part of the value of the setting. To be treated as a comment, the hash sign must be the first non-space character on the line. For example:

```yaml
master_list:
- <master-private-ip-1>
# here is a comment
- <master-private-ip-2>
- <master-private-ip-3>
```

## Dependencies
Some parameters are dependent on others. These dependent parameters are ignored unless all dependencies are specified. These dependencies are shown in the documentation by nesting within the parent. For example, `master_list` is required only if you specify ` master_discovery: static`.

# Basic settings

| Parameter                              | Description                                                                                                                                               |
|----------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| [agent_list](/1.9/installing/oss/custom/configuration/configuration-parameters/#agent-list)      | This parameter specifies a YAML nested list (`-`) of IPv4 addresses to your [private agent](/1.9/overview/concepts/#private-agent-node) host names.                  |
| [bootstrap_url](/1.9/installing/oss/custom/configuration/configuration-parameters/#bootstrap-url)                          | This required parameter specifies the URI path for the DC/OS installer to store the customized DC/OS build files.                                         |
| [cluster_name](/1.9/installing/oss/custom/configuration/configuration-parameters/#cluster-name)                           | This parameter specifies the name of your cluster.    |
| [customer_key](/1.9/installing/oss/custom/configuration/configuration-parameters/#customer-key-enterprise)                  | [enterprise type="inline" size="small" /] This parameter specifies the DC/OS Enterprise customer key.   |
| [exhibitor_storage_backend](/1.9/installing/oss/custom/configuration/configuration-parameters/#exhibitor-storage-backend)         | This parameter specifies the type of storage backend to use for Exhibitor.          |
| [master_discovery](/1.9/installing/oss/custom/configuration/configuration-parameters/#master-discovery)                          | This required parameter specifies the Mesos master discovery method.         |
| [public_agent_list](/1.9/installing/oss/custom/configuration/configuration-parameters/#public-agent-list)       | This parameter specifies a YAML nested list (-) of IPv4 addresses to your [public agent](/1.9/overview/concepts/#public-agent-node) host names.    |
| [resolvers](/1.9/installing/oss/custom/configuration/configuration-parameters/#resolvers)       | This required parameter specifies a block of YAML nested list (`-`) of DNS resolvers for your DC/OS cluster nodes.   |
| [security](/1.9/installing/oss/custom/configuration/configuration-parameters/#security-enterprise)                           | [enterprise type="inline" size="small" /] This parameter specifies the security mode: disabled, permissive, strict.  |
| [ssh_port](/1.9/installing/oss/custom/configuration/configuration-parameters/#ssh-port)                           | This parameter specifies the port to SSH to, for example 22.          |
| [ssh_user](/1.9/installing/oss/custom/configuration/configuration-parameters/#ssh-user)                           | This parameter specifies the SSH username, for example `centos`.     |
| [superuser_password_hash](/1.9/installing/oss/custom/configuration/configuration-parameters/#superuser-password-hash-enterprise)            | [enterprise type="inline" size="small" /] This required parameter specifies the hashed superuser password.      |
| [superuser_username](/1.9/installing/oss/custom/configuration/configuration-parameters/#superuser-username-enterprise)               | [enterprise type="inline" size="small" /] This required parameter specifies the user name of the superuser.    |
| [use_proxy](/1.9/installing/oss/custom/configuration/configuration-parameters/#use-proxy)        | This parameter specifies whether to enable the DC/OS proxy.     |


# Advanced settings

See the [configuration reference](/1.9/installing/oss/custom/configuration/configuration-parameters/) and [examples](/1.9/installing/oss/custom/configuration/examples/).
