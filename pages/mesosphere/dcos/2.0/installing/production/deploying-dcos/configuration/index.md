---
layout: layout.pug
navigationTitle:  Configuration
title: Configuration
menuWeight: 5
excerpt: Configuring your DC/OS parameters using a YAML file
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---


The DC/OS configuration parameters are specified in YAML format in a `config.yaml` file. This file is stored on your [bootstrap node](/mesosphere/dcos/2.0/installing/production/system-requirements/#bootstrap-node) and is used during DC/OS installation to generate a customized DC/OS build.

<p class="message--important"><strong>IMPORTANT: </strong>If you want to modify the configuration file after installation, you must follow the <a href="/mesosphere/dcos/2.0/installing/production/upgrading/">DC/OS upgrade process</a>.</p>

# Format

## Key-value pairs
The config.yaml file is formatted as a list of key-value pairs.

For example:

```yaml
bootstrap_url: file:///opt/dcos_install_tmp
```

## Config blocks and lists
A config block is a group of configuration settings. It consists of the following:

- A key followed by a colon, for example: `agent_list:`. The key of the config block must be on its own line, with no leading space.
- A list of values formatted by using a single dash (`-`) followed by a space; or an indented set of one or more key-value pairs. The indentation for each key-value pair must be exactly two spaces. Do not use tabs.
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

Partial-line comments, such as `agent_list # this is my agent list`,  are not allowed. They will be treated as part of the value of the setting. To be treated as a comment, the hash sign must be the first non-space character on the line.

For example:

```yaml
master_list:
- <master-private-ip-1>
# here is a comment
- <master-private-ip-2>
- <master-private-ip-3>
```

## Dependencies
Some parameters are dependent on others. These dependent parameters are ignored unless all dependencies are specified. These dependencies are shown in the documentation by nesting within the parent. For example, `master_list` is required only if you specify ` master_discovery: static.`

# Basic settings

| Parameter                              | Description                                                                                                                                               |
|----------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| [agent_list](/mesosphere/dcos/2.0/installing/production/advanced-configuration/configuration-reference/#agent-list)      | This parameter specifies a YAML nested list (`-`) of IPv4 addresses to your [private agent](/mesosphere/dcos/2.0/overview/concepts/#private-agent-node) host names.                  |
| [bootstrap_url](/mesosphere/dcos/2.0/installing/production/advanced-configuration/configuration-reference/#bootstrap-url)                          | This required parameter specifies the URL path for the DC/OS installer to store the customized DC/OS build files.                                         |
| [cluster_name](/mesosphere/dcos/2.0/installing/production/advanced-configuration/configuration-reference/#cluster-name)                           | This parameter specifies the name of your cluster.    |
| [exhibitor_storage_backend](/mesosphere/dcos/2.0/installing/production/advanced-configuration/configuration-reference/#exhibitor-storage-backend)         | This parameter specifies the type of storage backend to use for Exhibitor.          |
| [master_discovery](/mesosphere/dcos/2.0/installing/production/advanced-configuration/configuration-reference/#master-discovery-required)                          | This required parameter specifies the Mesos master discovery method.         |
| [public_agent_list](/mesosphere/dcos/2.0/installing/production/advanced-configuration/configuration-reference/#public-agent-list)       | This parameter specifies a YAML nested list (-) of IPv4 addresses to your [public agent](/mesosphere/dcos/2.0/overview/concepts/#public-agent-node) host names.    |
| [resolvers](/mesosphere/dcos/2.0/installing/production/advanced-configuration/configuration-reference/#resolvers)       | This required parameter specifies a block of YAML nested list (`-`) of DNS resolvers for your DC/OS cluster nodes.   |
| [security](/mesosphere/dcos/2.0/installing/production/advanced-configuration/configuration-reference/#security-enterprise)                           | [enterprise type="inline" size="small" /] This parameter specifies the security mode: `permissive` or `strict`.  |
| [ssh_port](/mesosphere/dcos/2.0/installing/production/advanced-configuration/configuration-reference/#ssh-port)                           | This parameter specifies the port to SSH to, for example 22.          |
| [ssh_user](/mesosphere/dcos/2.0/installing/production/advanced-configuration/configuration-reference/#ssh-user)                           | This parameter specifies the SSH username, for example `centos`.     |
| [superuser_password_hash](/mesosphere/dcos/2.0/installing/production/advanced-configuration/configuration-reference/#superuser-password-hash-required-enterprise)            | [enterprise type="inline" size="small" /] This required parameter specifies the hashed superuser password.      |
| [superuser_username](/mesosphere/dcos/2.0/installing/production/advanced-configuration/configuration-reference/#superuser-username-required-enterprise)               | [enterprise type="inline" size="small" /] This required parameter specifies the user name of the superuser.    |
| [use_proxy](/mesosphere/dcos/2.0/installing/production/advanced-configuration/configuration-reference/#use-proxy)        | This parameter specifies whether to enable the DC/OS proxy.     |


# Advanced settings

See the [configuration reference](/mesosphere/dcos/2.0/installing/production/advanced-configuration/configuration-reference/#configuration-parameters) and [examples](/mesosphere/dcos/2.0/installing/production/deploying-dcos/configuration/examples/).

# Configure DC/OS for Proxy

By default, the DC/OS [{{ model.packageRepo }}](https://github.com/mesosphere/universe) repository is hosted on the internet. If your DC/OS cluster is behind a corporate proxy, you must specify your proxy configuration in the [configuration file](/mesosphere/dcos/2.0/installing/production/advanced-configuration/configuration-reference/#use-proxy) file before installation. This will enable your cluster to connect to the {{ model.packageRepo }} packages.

<p class="message--note"><strong>NOTE: </strong>You should also configure an HTTP proxy for <a href="https://docs.docker.com/engine/admin/systemd/#/http-proxy">Docker</a>.</p>
