---
layout: layout.pug
navigationTitle:  Examples
title: Examples
menuWeight: 5
excerpt: Common example configurations for DC/OS Enterprise
---

This page provides several common example configurations. Except where explicitly indicated, the configuration parameters apply to both [DC/OS Open Source](https://dcos.io/) and [DC/OS Enterprise](https://mesosphere.com/product/). These comments are used in this sample `config.yaml` to indicate DC/OS product type.

- `# DC/OS Open Source only` - Applies to DC/OS only. [oss type="inline" size="small" /]
- `# DC/OS Enterprise only` - Applies to DC/OS Enterprise only. [enterprise type="inline" size="small" /]

# All parameters
This sample `config.yaml` file includes all of the available configuration parameters for DC/OS.

```yaml
agent_list:
- <agent-private-ip-1>
- <agent-private-ip-2>
- <agent-private-ip-3>
# DC/OS Enterprise only
auth_cookie_secure_flag: `<true|false>`
bootstrap_url: <path-to-installer>
# DC/OS Enterprise only
bouncer_expiration_auth_token_days: `<time>`
cluster_docker_credentials:
  auths:
    '<path-to-credentials>':
      auth: <username>
      email: <email>
  cluster_docker_credentials_dcos_owned: <true|false>
    cluster_docker_credentials_write_to_etc: <true|false>
cluster_docker_credentials_enabled: <true|false>
cluster_docker_registry_url: <url>
cluster_name: '<cluster-name>'
cosmos_config:
staged_package_storage_uri: <temp-path-to-files>
package_storage_uri: <permanent-path-to-files>
# DC/OS Enterprise only
ca_certificate_path: <path-to-certificate>
ca_certificate_key_path: <path-to-private-key>
ca_certificate_chain_path: <path-to-certificate-chain>
custom_checks:
  cluster_checks:
    custom-check-1:
      description: Foobar cluster service is healthy
      cmd:
        - echo
        - hello
      timeout: 1s
  node_checks:
    checks:
      custom-check-2:
        description: Foobar node service is healthy
        cmd:
          - echo
          - hello
        timeout: 1s
        roles:
          - agent
    poststart:
      - custom-check-2
dcos_overlay_enable: `<true|false>`
dcos_overlay_config_attempts: <num-failed-attempts>
dcos_overlay_mtu: <mtu>
dcos_overlay_network:
  vtep_subnet: <address>
  vtep_mac_oui: <mac-address>
  overlays:
    - name: <name>
      subnet: <address>
      prefix: <size>
dns_search: <domain1 domain2 domain3>
docker_remove_delay: <num>hrs
enable_docker_gc: `<true|false>`
exhibitor_storage_backend: static
exhibitor_storage_backend: zookeeper
exhibitor_zk_hosts: `<list-of-ip-port>`
exhibitor_zk_path: <filepath-to-data>
exhibitor_storage_backend: aws_s3
aws_access_key_id: <key-id>
aws_region: <bucket-region>
aws_secret_access_key: <secret-access-key>
exhibitor_explicit_keys: <true|false>
s3_bucket: <s3-bucket>
s3_prefix: <s3-prefix>
exhibitor_storage_backend: azure
exhibitor_azure_account_name: <storage-account-name>
exhibitor_azure_account_key: <storage-account-key>
exhibitor_azure_prefix: <blob-prefix>
gc_delay: <num>days
log_directory: `<path-to-install-logs>`
master_discovery: static
master_list:
- <master-private-ip-1>
- <master-private-ip-2>
- <master-private-ip-3>
master_discovery: master_http_loadbalancer
exhibitor_address: <loadbalancer-ip>
master_dns_bindall: `<true|false>`
num_masters: <num-of-masters>
# DC/OS Open Source only
oauth_enabled: `<true|false>`
public_agent_list:
- <agent-private-ip>
platform: <platform>
process_timeout: <num-seconds>
rexray_config:
    rexray:
      loglevel:
      service:
    libstorage:
      integration:
        volume:
          operations:
            unmount:
              ignoreusedcount:
      server:
        tasks:
          logTimeout: 5m
# DC/OS Enterprise only
security: <security-mode>
# DC/OS Enterprise only
superuser_username: <username>
ssh_key_path: <path-to-ssh-key>
ssh_port: '<port-number>'
ssh_user: <username>
# DC/OS Enterprise only
superuser_password_hash: <hashed-password>
# DC/OS Enterprise only
superuser_username: <username>
telemetry_enabled: `<true|false>`
use_proxy: `<true|false>`
http_proxy: http://<proxy_host>:<http_proxy_port>
https_proxy: https://<proxy_host>:<https_proxy_port>
no_proxy:
- '<blocked.address1.com>'
- '<blocked.address2.com>'
# DC/OS Enterprise only
zk_super_credentials: 'super:<long, random string>'
zk_master_credentials: 'dcos-master:<long, random string>'
zk_agent_credentials: 'dcos-agent:<long, random string>'
```


# <a name="examples1"></a>Example Configurations
DC/OS cluster with three masters, five private agents, and Exhibitor/ZooKeeper managed internally:

```yaml
---
agent_list:
- <agent-private-ip-1>
- <agent-private-ip-2>
- <agent-private-ip-3>
- <agent-private-ip-4>
- <agent-private-ip-5>
bootstrap_url: 'file:///opt/dcos_install_tmp'
cluster_name: '<cluster-name>'
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
```

## <a name="aws"></a>AWS
DC/OS cluster with three masters, an Exhibitor/ZooKeeper backed by an AWS S3 bucket, five private agents, and one public agent node:

```yaml
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
- <dns-resolver-1>
- <dns-resolver-2>
s3_bucket: mybucket
s3_prefix: s3-example
ssh_key_path: /genconf/ssh-key
ssh_port: '<port-number>'
ssh_user: <username>
```

## <a name="zk"></a>ZooKeeper
DC/OS cluster with three masters, an Exhibitor/ZooKeeper backed by ZooKeeper, masters that have an HTTP load balancer in front of them, one public agent node, five private agents, and Google DNS:

```yaml
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
exhibitor_zk_hosts: 10.0.0.1:2181, 10.0.0.2:2181, 10.0.0.3:2181
exhibitor_zk_path: /zk-example
log_directory: /genconf/logs
master_discovery: master_http_loadbalancer
num_masters: 3
public_agent_list:
- <public-agent-private-ip>
exhibitor_address: 67.34.242.55
process_timeout: 120
resolvers:
- <dns-resolver-1>
- <dns-resolver-2>
ssh_key_path: /genconf/ssh-key
ssh_port: '<port-number>'
ssh_user: <username>
```

## <a name="overlay"></a>Overlay
DC/OS cluster with three masters, an Exhibitor/ZooKeeper managed internally, two DC/OS virtual networks, two private agents, and Google DNS:

```yaml
agent_list:
- <agent-private-ip-1>
- <agent-private-ip-2>
# Use this bootstrap_url value unless you have moved the DC/OS installer assets.
bootstrap_url: file:///opt/dcos_install_tmp
cluster_name: <cluster-name>
master_discovery: static
master_list:
- <master-private-ip-1>
- <master-private-ip-2>
- <master-private-ip-3>
resolvers:
# You probably do not want to use these values since they point to public DNS servers.
# Instead, use values that are more specific to your particular infrastructure.
- 8.8.4.4
- 8.8.8.8
ssh_port: 22
ssh_user: centos
dcos_overlay_enable: true
dcos_overlay_mtu: 9001
dcos_overlay_config_attempts: 6
dcos_overlay_network:
  vtep_subnet: 44.128.0.0/20
  vtep_mac_oui: 70:B3:D5:00:00:00
  overlays:
    - name: dcos
      subnet: 9.0.0.0/8
      prefix: 26
    - name: dcos-1
      subnet: 192.168.0.0/16
      prefix: 24
```

## <a name="http-proxy"></a>HTTP Proxy
DC/OS cluster with three masters, an Exhibitor/ZooKeeper managed internally, a custom HTTP proxy, two private agents, and Google DNS:

```yaml
agent_list:
- <agent-private-ip-1>
- <agent-private-ip-2>
# Use this bootstrap_url value unless you have moved the DC/OS installer assets.
bootstrap_url: file:///opt/dcos_install_tmp
cluster_name: <cluster-name>
master_discovery: static
master_list:
- <master-private-ip-1>
- <master-private-ip-2>
- <master-private-ip-3>
resolvers:
# You probably do not want to use these values since they point to public DNS servers.
# Instead use values that are more specific to your particular infrastructure.
- 8.8.4.4
- 8.8.8.8
ssh_port: 22
ssh_user: centos
use_proxy: 'true'
http_proxy: http://<user>:<pass>@<proxy_host>:<http_proxy_port>
https_proxy: https://<user>:<pass>@<proxy_host>:<https_proxy_port>
no_proxy:
- 'foo.bar.com'
- '.baz.com'
```

## <a name="docker-credentials"></a>Docker Credentials
DC/OS cluster with three masters, an Exhibitor/ZooKeeper managed internally, custom Docker credentials, two private agents, and Google DNS:

```yaml
agent_list:
- <agent-private-ip-1>
- <agent-private-ip-2>
# Use this bootstrap_url value unless you have moved the DC/OS installer assets.
bootstrap_url: file:///opt/dcos_install_tmp
cluster_docker_credentials:
  auths:
    'https://registry.example.com/v1/':
      auth: foo
      email: user@example.com
cluster_docker_credentials_enabled: true
cluster_docker_credentials_dcos_owned: true
cluster_docker_registry_url: https://registry.example.com
cluster_name: <cluster-name>
master_discovery: static
master_list:
- <master-private-ip-1>
- <master-private-ip-2>
- <master-private-ip-3>
resolvers:
# You probably do not want to use these values since they point to public DNS servers.
# Instead use values that are more specific to your particular infrastructure.
- 8.8.4.4
- 8.8.8.8
ssh_port: 22
ssh_user: centos
```

## <a name="cosmos-config"></a>Cosmos Configuration
DC/OS cluster with one master, an Exhibitor/ZooKeeper managed internally, three private agents, Google DNS, and DC/OS Package Manager (Cosmos) configured with persistent storage:

```yaml
agent_list:
- <agent-private-ip-1>
- <agent-private-ip-2>
- <agent-private-ip-3>
# Use this bootstrap_url value unless you have moved the DC/OS installer assets.
bootstrap_url: file:///opt/dcos_install_tmp
cluster_name: <cluster-name>
master_discovery: static
master_list:
- <master-private-ip-1>
resolvers:
# You probably do not want to use these values since they point to public DNS servers.
# Instead use values that are more specific to your particular infrastructure.
- 8.8.4.4
- 8.8.8.8
ssh_port: 22
ssh_user: centos
cosmos_config:
  staged_package_storage_uri: file:///var/lib/dcos/cosmos/staged-packages
  package_storage_uri: file:///var/lib/dcos/cosmos/packages
```


## <a name="custom-checks"></a>Custom Checks
DC/OS cluster with one master, an Exhibitor/ZooKeeper managed internally, three private agents, Google DNS, and custom health checks defined for:

- A user Marathon instance (`user-marathon-on-marathon`)
- Local mounts on masters (`master-mounts`)
- Local mounts on agents (`agent-mounts`)

```yaml
agent_list:
- <agent-private-ip-1>
- <agent-private-ip-2>
- <agent-private-ip-3>
# Use this bootstrap_url value unless you have moved the DC/OS installer assets.
bootstrap_url: file:///opt/dcos_install_tmp
cluster_name: <cluster-name>
master_discovery: static
master_list:
- <master-private-ip-1>
resolvers:
# You probably do not want to use these values since they point to public DNS servers.
# Instead use values that are more specific to your particular infrastructure.
- 8.8.4.4
- 8.8.8.8
ssh_port: 22
ssh_user: centos
custom_checks:
  cluster_checks:
    user-marathon-on-marathon:
      description: The user Marathon-on-Marathon is healthy
      cmd:
        - "check_marathon"
        - "--location"
        - "user-marathon.marathon.mesos"
      timeout: 5s
  node_checks:
    checks:
      master-mounts:
        description: Local mounts on masters are present
        cmd:
          - “check_mounts”
          - "--role"
          - "master"
        roles:
          - master
        timeout: 5s
      agent-mounts:
        description: Local mounts on agents are present
        cmd:
          - “check_mounts”
          - "--role"
          - "agent"
        roles:
          - agent
        timeout: 5s
```
