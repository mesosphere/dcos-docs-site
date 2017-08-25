---
layout: layout.pug
title: Configuration parameters
menuWeight: 0
excerpt: ""
enterprise: 'yes'
featureMaturity: ""
navigationTitle:  Configuration parameters
---




These configuration parameters are specified in [YAML][1] format in your config.yaml file. During DC/OS installation the configuration file is used to generate a customized DC/OS build. <!-- A config.yaml template file is available [here][2]. -->

# Cluster Setup

### [config-yaml-agent-list]

### [config-yaml-bootstrap-url]

### [config-yaml-cluster-name]

### [config-yaml-exhibitor-storage-backend]

*   [config-yaml-zookeeper] 
    *   [config-yaml-exhibitor-zk-hosts]
    *   [config-yaml-exhibitor-zk-path]
*   [config-yaml-aws-s3]
*   [config-yaml-shared-filesystem]

### [config-yaml-master-discovery]

*   [config-yaml-static] 
    *   [config-yaml-master-list]
*   [config-yaml-vrrp] 
    *   [config-yaml-keepalived-router-id]
    *   [config-yaml-keepalived-interface]
    *   [config-yaml-keepalived-pass]
    *   [config-yaml-keepalived-virtual-ipaddress]
    *   [config-yaml-num-masters]

# Security and Authentication

### [config-yaml-ssh-key-path]

### [config-yaml-ssh-port]

### [config-yaml-ssh-user]

### [config-yaml-superuser-password-hash]

### [config-yaml-superuser-username]

# Networking

### [config-yaml-dns-search]

### [config-yaml-resolvers]

# Performance and Tuning

### [config-yaml-docker-remove-delay]

### [config-yaml-gc-delay]

### [config-yaml-log-directory]

### [config-yaml-process-timeout]

### [config-yaml-roles]

*   [config-yaml-slave-public]
*   [config-yaml-master]
*   [config-yaml-slave]

### [config-yaml-weights]

# <a name="examples1"></a>Example Configurations

#### DC/OS cluster with 3 masters, an Exhibitor/Zookeeper backed by Zookeeper, and static master list specified.

navigationTitle:  Configuration parameters
    ---
    agent_list:
    - <agent-private-ip-1>
    - <agent-private-ip-2>
    - <agent-private-ip-3>
    - <agent-private-ip-4>
    - <agent-private-ip-5>
    bootstrap_url: 'file:///opt/dcos_install_tmp'
    cluster_name: '<cluster-name>'
    exhibitor_storage_backend: zookeeper
    exhibitor_zk_hosts: <host1>:<port1>
    exhibitor_zk_path: /dcos
    log_directory: /genconf/logs
    master_discovery: static 
    master_list:
    - <master-private-ip-1>
    - <master-private-ip-2>
    - <master-private-ip-3>
    process_timeout: 120
    resolvers:
    - <dns-resolver-1>
    - <dns-resolver-2>
    ssh_key_path: /genconf/ssh-key
    ssh_port: '<port-number>'
    ssh_user: <username>
    

#### <a name="shared"></a>DC/OS cluster with 3 masters, an Exhibitor/Zookeeper shared filesystem storage backend, Internal DNS

navigationTitle:  Configuration parameters
    ---
    agent_list:
    - <agent-private-ip-1>
    - <agent-private-ip-2>
    - <agent-private-ip-3>
    - <agent-private-ip-4>
    - <agent-private-ip-5>
    bootstrap_url: file:///tmp/dcos
    cluster_name: fs-example
    exhibitor_fs_config_dir: /shared-mount
    exhibitor_storage_backend: shared_filesystem
    log_directory: /genconf/logs
    master_discovery: static
    master_list:
    - <master-private-ip-1>
    - <master-private-ip-2>
    - <master-private-ip-3>
    process_timeout: 120
    resolvers:
    - 0.10.5.1
    - 10.10.6.1
    roles: slave_public
    ssh_key_path: /genconf/ssh-key
    ssh_port: '<port-number>'
    ssh_user: <username>
    weights: slave_public=1
    

#### <a name="aws"></a>DC/OS Cluster with 3 masters, an Exhibitor/Zookeeper backed by an AWS S3 bucket, AWS DNS, and a public agent node

navigationTitle:  Configuration parameters
    ---
    agent_list:
    - <agent-private-ip-1>
    - <agent-private-ip-2>
    - <agent-private-ip-3>
    - <agent-private-ip-4>
    - <agent-private-ip-5>
    aws_access_key_id: AKIAIOSFODNN7EXAMPLE
    aws_region: us-west-2
    aws_secret_access_key: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
    bootstrap_url: file:///tmp/dcos
    cluster_name: s3-example
    exhibitor_storage_backend: aws_s3
    exhibitor_explicit_keys: 'true'
    log_directory: /genconf/logs
    master_discovery: static
    master_list:
    - <master-private-ip-1>
    - <master-private-ip-2>
    - <master-private-ip-3>
    process_timeout: 120
    resolvers: 
    - 169.254.169.253
    roles: slave_public
    s3_bucket: mybucket
    s3_prefix: s3-example
    ssh_key_path: /genconf/ssh-key
    ssh_port: '<port-number>'
    ssh_user: <username>
    weights: slave_public=1
    

#### <a name="zk"></a>DC/OS cluster with 3 masters, an Exhibitor/Zookeeper backed by Zookeeper, VRRP master discovery, public agent node, and Google DNS

navigationTitle:  Configuration parameters
    ---
    agent_list:
    - <agent-private-ip-1>
    - <agent-private-ip-2>
    - <agent-private-ip-3>
    - <agent-private-ip-4>
    - <agent-private-ip-5>
    bootstrap_url: file:///tmp/dcos
    cluster_name: zk-example
    exhibitor_storage_backend: zookeeper
    exhibitor_zk_hosts: 10.10.10.1:2181
    exhibitor_zk_path: /zk-example
    keepalived_interface: eth1
    keepalived_pass: $MY_STRONG_PASSWORD
    keepalived_router_id: 51
    keepalived_virtual_ipaddress: 67.34.242.55
    log_directory: /genconf/logs
    master_discovery: vrrp
    num_masters: 3
    process_timeout: 120
    resolvers: 
    - 8.8.4.4
    - 8.8.8.8
    roles: slave_public
    ssh_key_path: /genconf/ssh-key
    ssh_port: '<port-number>'
    ssh_user: <username>
    weights: slave_public=1

 [1]: https://en.wikipedia.org/wiki/YAML