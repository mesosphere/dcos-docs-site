---
layout: layout.pug
navigationTitle:  Configuration Reference
title: Configuration Reference
menuWeight: 600
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


This topic provides configuration parameters available for [DC/OS](https://dcos.io/). For configuration parameters available for [DC/OS Enterprise](https://mesosphere.com/product/) please refer to [Configuration Reference for DC/OS Enterprise](/1.11/installing/ent/custom/configuration/configuration-parameters/).

# Cluster Setup

| Parameter                              | Description                                                                                                                                               |
|----------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| [agent_list](#agent-list)                                              | A YAML nested list (`-`) of IPv4 addresses to your [private agent](/1.11/overview/concepts/#private-agent-node) host names. |
| aws_template_storage_access_key_id         | The [access key ID](http://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys) of the account owning the AWS S3 bucket. |
| aws_template_storage_bucket                | The name of an S3 bucket to contain [customized advanced AWS templates](/1.11/installing/ent/cloud/aws/advanced/#create-your-templates). |
| aws_template_storage_bucket_path           | The path to a location within the S3 bucket to store template artifacts.
| aws_template_storage_region_name           | The region containing the S3 bucket.  |
| aws_template_storage_secret_access_key     | The [secret access key](http://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys) of the account owning the AWS S3 bucket. |
| aws_template_upload                        | Whether to upload the customized advanced AWS templates to an S3 bucket. |
| [bootstrap_url](#bootstrap-url)                                       | (Required) The URI path for the DC/OS installer to store the customized DC/OS build files. |
| [cluster_docker_credentials](#cluster-docker-credentials)             | The dictionary of Docker credentials to pass. |
| [cluster_docker_credentials_enabled](#cluster-docker-credentials-enabled)   |  Whether to pass the Mesos `--docker_config` option to Mesos. |
| [cluster_docker_registry_url](#cluster-docker-registry-url)           | The custom URL that Mesos uses to pull Docker images from. |
| [cluster_name](#cluster-name)                                         | The name of your cluster. |
| [cosmos_config](#cosmos-config)                                       | The dictionary of packaging configuration to pass to the [DC/OS Package Manager (Cosmos)](https://github.com/dcos/cosmos). |
| [custom_checks](#custom-checks)                                       | Custom installation checks that are added to the default check configuration process. |
| [exhibitor_storage_backend](#exhibitor-storage-backend)               | The type of storage backend to use for Exhibitor. |
| [enable_gpu_isolation](#enable-gpu-isolation)                         | Indicates whether to enable GPU support in DC/OS.  |
| [gpus_are_scarce](#gpus-are-scarce)                                   | Indicates whether to treat GPUs as a scarce resource in the cluster. |
| [ip_detect_public_filename](#ip-detect-public-filename)               | The IP detect file to use in your cluster.  |
| [master_discovery](#master-discovery)                                 | (Required) The Mesos master discovery method.         |
| [mesos_container_log_sink](#mesos-container-log-sink)                 | The log manager for containers (tasks). |
| [mesos_agent_work_dir](#mesos-agent-work-dir)                         | The location of the Mesos work directory on agent and public agent nodes. |
| [mesos_master_work_dir](#mesos-master-work-dir)                       | The location of the Mesos work directory on master nodes. |
| [platform](#platform)                                                 | The infrastructure platform. |
| [public_agent_list](#public-agent-list)                               | A YAML nested list (`-`) of IPv4 addresses to your [public agent](/1.11/overview/concepts/#public-agent-node) host names.  |
| [rexray_config](#rexray-config)                                       | The [REX-Ray](https://rexray.readthedocs.io/en/v0.9.0/user-guide/config/) configuration method for enabling external persistent volumes in Marathon. You cannot specify both `rexray_config` and `rexray_config_preset`.|
| [rexray_config_preset](#rexray-config-preset) | If you run DC/OS on AWS setting this parameter to `aws`, sets the `rexray_config` parameter to a sensible default REX-Ray configuration that is bundled with DC/OS itself. You cannot specify both `rexray_config` and `rexray_config_preset`. |

# Networking

| Parameter                    | Description                                                                                                                                                       |
|------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [dcos_overlay_enable](#dcos-overlay-enable)           | Block of parameters that specifies whether to enable DC/OS virtual networks. |
| [dns_bind_ip_blacklist](#dns-bind-ip-blacklist)       | A list of IP addresses that DC/OS DNS resolvers cannot bind to.|
| [dns_forward_zones](#dns-forward-zones)               | A nested list of DNS zones, IP addresses, and ports that configure custom forwarding behavior of DNS queries. A DNS zone is mapped to a set of DNS resolvers. |
| [dns_search](#dns-search)                             | A space-separated list of domains that are tried when an unqualified domain is entered.  |
| [master_dns_bindall](#master-dns-bindall)             | Indicates whether the master DNS port is open.  |
| [mesos_dns_set_truncate_bit](#mesos-dns-set-truncate-bit)   |  Indicates whether to set the truncate bit if the response is too large to fit in a single packet. |
| [resolvers](#resolvers)                               | A YAML nested list (`-`) of DNS resolvers for your DC/OS cluster nodes.|
| [use_proxy](#use-proxy)                               | Indicates whether to enable the DC/OS proxy. |
|[enable_ipv6](#enable-ipv6)                            | A boolean that indicates if IPv6 networking support is available in DC/OS. Default value is `true`. | 
| [dcos_l4lb_enable_ipv6](#dcos-l4lb-enable-ipv6)        | A boolean that indicates if layer 4 load-balancing is available for IPv6 networks. This takes affect only if `enable_ipv6` is set to `true`. Default value is `false`.|
|[dcos_ucr_default_bridge_subnet](#dcos-ucr-default-bridge-subnet) |IPv4 subnet allocated to the `mesos-bridge` CNI network for UCR bridge-mode networking. | 

# Performance and Tuning

| Parameter                    | Description                                                                                                                                                       |
|------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [docker_remove_delay](#docker-remove-delay) | The amount of time to wait before removing stale Docker images stored on the agent nodes and the Docker image generated by the installer. |
| [enable_docker_gc](#enable-docker-gc)     | Indicates whether to run the [docker-gc](https://github.com/spotify/docker-gc#excluding-images-from-garbage-collection) script, a simple Docker container and image garbage collection script, once every hour to clean up stray Docker containers. |
| [gc_delay](#gc-delay)                     | The maximum amount of time to wait before cleaning up the executor directories. |
| [log_directory](#log-directory)           | The path to the installer host logs from the SSH processes. |
| [mesos_max_completed_tasks_per_framework](#mesos-max-completed-tasks-per-framework)  | The number of completed tasks for each framework that the Mesos master will retain in memory. |
| [process_timeout](#process-timeout)       | The allowable amount of time, in seconds, for an action to begin after the process forks. |

# Security and Authentication

| Parameter                          | Description                                                                                                                                                |
|------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [oauth_enabled](#oauth-enabled-open-source)                                | [oss type="inline" size="small" /] Indicates whether to enable authentication for your cluster.  |
| [ssh_key_path](#ssh-key-path)                            | The path to the installer uses to log into the target nodes. |
| [ssh_port](#ssh-port)                                    | The port to SSH to, for example 22. |
| [ssh_user](#ssh-user)                                    | The SSH username, for example `centos`. |
| [telemetry_enabled](#telemetry-enabled)                  | Indicates whether to enable sharing of anonymous data for your cluster.  |

### agent_list
A YAML nested list (`-`) of IPv4 addresses to your [private agent](/1.11/overview/concepts/#private-agent-node) host names.

### bootstrap_url
(Required) The URI path for the DC/OS installer to store the customized DC/OS build files. If you are using the automated DC/OS installer, you should specify `bootstrap_url: file:///opt/dcos_install_tmp` unless you have moved the installer assets. By default the automated DC/OS installer places the build files in `file:///opt/dcos_install_tmp`.

### cluster_docker_credentials
The dictionary of Docker credentials to pass.

- If unset, a default empty credentials file is created at `/etc/mesosphere/docker_credentials` during DC/OS install. A sysadmin can change credentials as needed. A `systemctl restart dcos-mesos-slave` or `systemctl restart dcos-mesos-slave-public` is required for changes to take effect.
- You can also specify by using the `--docker_config` JSON [format](http://mesos.apache.org/documentation/latest/configuration/). You can write as YAML in the `config.yaml` file and it will automatically be mapped to the JSON format for you. This stores the Docker credentials in the same location as the DC/OS internal configuration (`/opt/mesosphere`). If you need to update or change the configuration, you will have to create a new DC/OS internal configuration.

**Note:**
- `cluster_docker_credentials` takes effect only when [`cluster_docker_credentials_enabled`](#cluster-docker-credentials-enabled) is set to `'true'`
- `cluster_docker_credentials` takes effect during an upgrade only when `cluster_docker_credentials_dcos_owned` is set to `'true'`.

You can use the following options to further configure the Docker credentials:

*  `cluster_docker_credentials_dcos_owned` Indicates whether to store the credentials file in `/opt/mesosphere` or `/etc/mesosphere/docker_credentials`. A sysadmin cannot edit `/opt/mesosphere` directly.
    *  `cluster_docker_credentials_dcos_owned: 'true'` The credentials file is stored in `/opt/mesosphere`.
        *  `cluster_docker_credentials_write_to_etc` Whether to write a cluster credentials file.
            *  `cluster_docker_credentials_write_to_etc: 'true'` Write a credentials file. This can be useful if overwriting your credentials file will cause problems (e.g., if it is part of a machine image or AMI). This is the default value.
            *  `cluster_docker_credentials_write_to_etc: 'false'` Do not write a credentials file.
    *  `cluster_docker_credentials_dcos_owned: 'false'` The credentials file is stored in `/etc/mesosphere/docker_credentials`.

For more information, see the [examples](/1.11/installing/ent/custom/configuration/examples/#docker-credentials).

### cluster_docker_credentials_enabled
Whether to pass the Mesos `--docker_config` option containing [`cluster_docker_credentials`](#cluster-docker-credentials) to Mesos.

*  `cluster_docker_credentials_enabled: 'true'` Pass the Mesos `--docker_config` option to Mesos. It will point to a file that contains the provided `cluster_docker_credentials` data.
*  `cluster_docker_credentials_enabled: 'false'` Do not pass the Mesos `--docker_config` option to Mesos.


### cluster_docker_registry_url
The custom URL that Mesos uses to pull Docker images from. If set, it will configure the Mesos' `--docker_registry` flag to the specified URL. This changes the default URL Mesos uses for pulling Docker images. By default `https://registry-1.docker.io` is used.

### cluster_name
The name of your cluster.

### cosmos_config
The dictionary of packaging configuration to pass to the [DC/OS package manager](https://github.com/dcos/cosmos). If set, the following options must also be specified.

* `package_storage_uri`
  Where to permanently store DC/OS packages. The value must be a file URL, for example, `file:///var/lib/dcos/cosmos/packages`.
* `staged_package_storage_uri`
   Where to temporarily store DC/OS packages while they are being added. The value must be a file URL, for example, `file:///var/lib/dcos/cosmos/staged-packages`.

### custom_checks
Custom installation checks that are added to the default check configuration process. The configuration is used by the [DC/OS Diagnostics component](/1.11/overview/architecture/components/#dcos-diagnostics) to perform installation and upgrade checks. These custom checks are run alongside the default pre and post-flight checks during installation and upgrade.

- `cluster_checks` - This group of parameters specifies the health checks across the DC/OS cluster.

    - `<check-name>` - The custom name of your health check.
    - `description` - Specify a description of the check.
    - `cmd` - Specify an array of health check command strings.
    - `timeout` - Specify how long to wait, in seconds, before assuming the check failed. A check that times out is assumed to have a status of `3 (UNKNOWN)`.

- `node_checks` - This group of parameters specifies node health checks.

    - `<check-name>` - The custom name of your health check.
    - `description` - Specify a description of the check.
    - `cmd` - Specify an array of health check command strings.
    - `timeout` - Specify how long to wait, in seconds, before assuming the check failed. A check that times out is assumed to have a status of `3 (UNKNOWN)`.

For more information on how these custom checks are used, see the [examples](/1.11/installing/ent/custom/configuration/examples/#custom-checks) and [Node and Cluster Health Check](/1.11/installing/ent/custom/node-cluster-health-check/) documentation.

### dcos_overlay_enable

Indicates whether to enable DC/OS virtual networks.

**Important:** Virtual networks require Docker version 1.11 or later. If you are using Docker 1.10 or earlier, you must specify `dcos_overlay_enable: 'false'`. For more information, see the [system requirements](/1.11/installing/ent/custom/system-requirements/).

*  `dcos_overlay_enable: 'false'` Do not enable the DC/OS virtual network.
*  `dcos_overlay_enable: 'true'` Enable the DC/OS virtual network. This is the default value. After the virtual network is enabled, you can also specify the following parameters:

    *  `dcos_overlay_config_attempts` Specifies how many failed configuration attempts are allowed before the overlay configuration modules stop trying to configure a virtual network.

        **Tip:** The failures might be related to a malfunctioning Docker daemon.

    *  `dcos_overlay_mtu` The maximum transmission unit (MTU) of the Virtual Ethernet (vEth) on the containers that are launched on the overlay.

    *  `dcos_overlay_network` This group of parameters defines a virtual network for DC/OS.  The default configuration of DC/OS provides a virtual network named `dcos` with this YAML configuration:

        ```yaml
        dcos_overlay_network:
            vtep_subnet: 44.128.0.0/20
            vtep_mac_oui: 70:B3:D5:00:00:00
            overlays:
              - name: dcos
                subnet: 9.0.0.0/8
                prefix: 26
        ```

        *  `vtep_subnet` A dedicated address space that is used for the VxLAN backend for the virtual network. This address space should not be routeable from outside the agents or master.
        *  `vtep_mac_oui` The MAC address of the interface connecting to the virtual network in the public node. **Important:** The last 3 bytes must be `00`.
        *  `overlays`
            *  `name` The canonical name (see [limitations](/1.11/networking/virtual-networks/) for constraints on naming virtual networks).
            *  `subnet` The subnet that is allocated to the virtual network.
            *  `prefix` The size of the subnet that is allocated to each agent and thus defines the number of agents on which the overlay can run. The size of the subnet is carved from the overlay subnet.

 For more information, see the [example](/1.11/installing/ent/custom/configuration/examples/#overlay) and [documentation](/1.11/networking/virtual-networks/).


### dns_bind_ip_blacklist
A list of IP addresses that DC/OS DNS resolvers cannot bind to.

### dns_forward_zones
A nested list of DNS zones, IP addresses, and ports that configure custom forwarding behavior of DNS queries. A DNS zone is mapped to a set of DNS resolvers.

A sample definition is as follows:

```yaml
dns_forward_zones:
a.contoso.com:
- "1.1.1.1:53"
- "2.2.2.2:53"
b.contoso.com:
- "3.3.3.3:53"
- "4.4.4.4:53"
```

In the above example, a DNS query to `myapp.a.contoso.com` will be directed to `1.1.1.1:53` or `2.2.2.2:53`. Likewise, a DNS query to `myapp.b.contoso.com` will be directed to `3.3.3.3:53` or `4.4.4.4:53`.

### dns_search
A space-separated list of domains that are tried when an unqualified domain is entered (e.g., domain searches that do not contain &#8216;.&#8217;). The Linux implementation of `/etc/resolv.conf` restricts the maximum number of domains to 6 and the maximum number of characters the setting can have to 256. For more information, see [man /etc/resolv.conf](http://man7.org/linux/man-pages/man5/resolv.conf.5.html).

A `search` line with the specified contents is added to the `/etc/resolv.conf` file of every cluster host. `search` can do the same things as `domain` and is more extensible because multiple domains can be specified.

In this example, `example.com` has public website `www.example.com` and all of the hosts in the datacenter have fully qualified domain names that end with `dc1.example.com`. One of the hosts in your datacenter has the hostname `foo.dc1.example.com`. If `dns_search` is set to &#8216;dc1.example.com example.com&#8217;, then every DC/OS host which does a name lookup of `foo` will get the A record for `foo.dc1.example.com`. If a machine looks up `www`, first `www.dc1.example.com` would be checked, but it does not exist, so the search would try the next domain, lookup `www.example.com`, find an A record, and then return it.

```yaml
dns_search: dc1.example.com dc1.example.com example.com dc1.example.com dc2.example.com example.com
```

### docker_remove_delay
The amount of time to wait before removing stale Docker images stored on the agent nodes and the Docker image generated by the installer. It is recommended that you accept the default value 1 hour.

### enable_docker_gc
Indicates whether to run the [docker-gc](https://github.com/spotify/docker-gc#excluding-images-from-garbage-collection) script, a simple Docker container and image garbage collection script, once every hour to clean up stray Docker containers. You can configure the runtime behavior by using the `/etc/` config. For more information, see the [documentation](https://github.com/spotify/docker-gc#excluding-images-from-garbage-collection)

*  `enable_docker_gc: 'true'` Run the docker-gc scripts once every hour. This is the default value for [cloud](/1.11/installing/ent/cloud/) template installations.
*  `enable_docker_gc: 'false'` Do not run the docker-gc scripts once every hour. This is the default value for [custom](/1.11/installing/ent/custom/) installations.

### exhibitor_storage_backend
The type of storage backend to use for Exhibitor. You can use internal DC/OS storage (`static`) or specify an external storage system (`zookeeper`, `aws_s3`, and `azure`) for configuring and orchestrating ZooKeeper with Exhibitor on the master nodes. Exhibitor automatically configures your ZooKeeper installation on the master nodes during your DC/OS installation.

*   `exhibitor_storage_backend: static`
    The Exhibitor storage backend is managed internally within your cluster.

    **Important:** If [master_discovery](#master-discovery) is set to `master_http_loadbalancer`, then exhibitor_storage_backend cannot be set to `static`.

*   `exhibitor_storage_backend: zookeeper`
    The ZooKeeper instance for shared storage. If you use a ZooKeeper instance to bootstrap Exhibitor, this ZooKeeper instance must be separate from your DC/OS cluster. You must have at least 3 ZooKeeper instances running at all times for high availability. If you specify `zookeeper`, you must also specify these parameters.
    *   `exhibitor_zk_hosts`
        A comma-separated list (`<ZK_IP>:<ZK_PORT>, <ZK_IP>:<ZK_PORT>, <ZK_IP:ZK_PORT>`) of one or more ZooKeeper node IP and port addresses to use for configuring the internal Exhibitor instances. Exhibitor uses this ZooKeeper cluster to orchestrate it's configuration. Multiple ZooKeeper instances are recommended for failover in production environments.
    *   `exhibitor_zk_path`
        The filepath that Exhibitor uses to store data.
*   `exhibitor_storage_backend: aws_s3`
    The Amazon Simple Storage Service (S3) bucket for shared storage. If you specify `aws_s3`, you must also specify these parameters:
    *  `aws_access_key_id`
       The AWS key ID.
    *  `aws_region`
       The AWS region for your S3 bucket.
    *  `aws_secret_access_key`
       The AWS secret access key.
    *  `exhibitor_explicit_keys`
       Indicates whether you are using AWS API keys to grant Exhibitor access to S3.
        *  `exhibitor_explicit_keys: 'true'`
           If you're  using AWS API keys to manually grant Exhibitor access.
        *  `exhibitor_explicit_keys: 'false'`
           If you're using AWS Identity and Access Management (IAM) to grant Exhibitor access to s3.
    *  `s3_bucket`
       The name of your S3 bucket.
    *  `s3_prefix`
       The S3 prefix to be used within your S3 bucket to be used by Exhibitor.

       **Tip:** AWS EC2 Classic is not supported.
*   `exhibitor_storage_backend: azure`
    An Azure Storage Account for shared storage. The data will be stored under the container named `dcos-exhibitor`. If you specify `azure`, you must also specify these parameters:
    *  `exhibitor_azure_account_name`
       The Azure Storage Account Name.
    *  `exhibitor_azure_account_key`
       The secret key to access the Azure Storage Account.
    *  `exhibitor_azure_prefix`
       The blob prefix to be used within your Storage Account to be used by Exhibitor.

### enable_gpu_isolation
Indicates whether to enable GPU support in DC/OS.

*  `enable_gpu_isolation: 'true'` Any GPUs that are installed in DC/OS will be automatically discovered and available as consumable resources for DC/OS tasks. This is the default value.
*  `enable_gpu_isolation: 'false'` GPUs are not available for use in the cluster.

For more information, see the [GPU documentation](/1.11/deploying-services/gpu/).

### gc_delay
The maximum amount of time to wait before cleaning up the executor directories. It is recommended that you accept the default value of 2 days.

### gpus_are_scarce
Indicates whether to treat [GPUs](/1.11/deploying-services/gpu/) as a scarce resource in the cluster.

*  `gpus_are_scarce: 'true'` Treat GPUs as a scarce resource. This reserves the GPUs exclusively for services that opt-in to consume GPUs via the [Mesos `GPU_RESOURCES` framework capability](http://mesos.apache.org/documentation/latest/gpu-support/). This is the default value.
*  `gpus_are_scarce: 'false'` Treat GPUs like any other resource. GPUs will be offered indiscriminately to all frameworks, regardless of whether they use the [Mesos `GPU_RESOURCES` framework capability](http://mesos.apache.org/documentation/latest/gpu-support/) or not.

### ip_detect_public_filename
The path to a file (`/genconf/ip-detect-public`) on your bootstrap node that contains a shell script to map internal IPs to a public IP. For example:

```bash
#!/bin/sh
set -o nounset -o errexit

curl -fsSL https://ipinfo.io/ip
```

### log_directory
The path to the installer host logs from the SSH processes. By default this is set to `/genconf/logs`. In most cases this should not be changed because `/genconf` is local to the container that is running the installer, and is a mounted volume.

### master_discovery
(Required) The Mesos master discovery method. The available options are `static` or `master_http_loadbalancer`.

*  `master_discovery: static`
   Specifies that Mesos agents are used to discover the masters by giving each agent a static list of master IPs. The masters must not change IP addresses, and if a master is replaced, the new master must take the old master's IP address. If you specify `static`, you must also specify this parameter:

    *  `master_list`
       A YAML nested list (`-`) of static master IP addresses.

*   `master_discovery: master_http_loadbalancer` The set of masters has an HTTP load balancer in front of them. The agent nodes will know the address of the load balancer. They use the load balancer to access Exhibitor on the masters to get the full list of master IPs. If you specify `master_http_load_balancer`, you must also specify these parameters:

    *  `exhibitor_address`
       (Required) The address (preferably an IP address) of the load balancer in front of the masters. If you need to replace your masters, this address becomes the static address that agents can use to find the new master. For DC/OS Enterprise, this address is included in [DC/OS certificates](/1.11/security/ent/tls-ssl/).

       The load balancer must accept traffic on ports 80, 443, 2181, 5050, 8080, 8181. The traffic must also be forwarded to the same ports on the master. For example, Mesos port 5050 on the load balancer should forward to port 5050 on the master. The master should forward any new connections via round robin, and should avoid machines that do not respond to requests on Mesos port 5050 to ensure the master is up.
    *  `num_masters`
       (Required) The number of Mesos masters in your DC/OS cluster. It cannot be changed later. The number of masters behind the load balancer must never be greater than this number, though it can be fewer during failures.

**Important:**

* If master_discovery is set to `master_http_loadbalancer`, then [exhibitor_storage_backend](#exhibitor-storage-backend) cannot be set to `static`.
* On platforms like AWS where internal IPs are allocated dynamically, you should not use a static master list. If a master instance were to terminate for any reason, it could lead to cluster instability.

### master_dns_bindall
Indicates whether the master DNS port is open. An open master DNS port listens publicly on the masters. If you are upgrading, set this parameter to `true`.

*  `master_dns_bindall: 'true'` The master DNS port is open. This is the default value.
*  `master_dns_bindall: 'false'` The master DNS port is closed.


### mesos_agent_work_dir

The location of the Mesos work directory on agent and public agent nodes. This defines the `work_dir` parameter for Mesos agents in the cluster. The default is `/var/lib/mesos/slave`. For details, see [Mesos documentation](https://mesos.apache.org/documentation/latest/configuration/agent/).

### mesos_container_log_sink

The log manager for containers (tasks). The options are:

* `'journald'` - send task logs only to journald.
* `'logrotate'` - send task logs only to the file system (i.e. a stdout/err file).
* `'journald+logrotate'` - Send logs to both journald and the file system.

The default is `logrotate`. Due to performance issues, `journald` is not recommended. For details, see [Logging API](/1.11/monitoring/logging/logging-api/#compatibility).

### mesos_dns_set_truncate_bit

Indicates whether Mesos-DNS sets the truncate bit if the response is too large to fit in a single packet.  

*  `mesos_dns_set_truncate_bit: 'true'`  Mesos-DNS sets the truncate bit if the response is too large to fit in a single packet and is truncated. This is the default behavior and is in compliance with RFC7766.
*  `mesos_dns_set_truncate_bit: 'false'`  Mesos-DNS does not set the truncate bit if the response is too large to fit in a single packet. If you know your applications crash when resolving truncated DNS responses over TCP, or for performance reasons you want to avoid receiving the complete set of DNS records in response to your DNS requests, you should set this option to `false` and note that the DNS responses you receive from Mesos-DNS may be missing entries that were silently discarded. This means that truncated DNS responses will appear complete even though they aren't and therefore won't trigger a retry over TCP. This behavior does not conform to RFC7766.

For more information regarding truncated DNS responses and retrying over TCP see [RFC7766 - DNS Transport over TCP - Implementation Requirements](https://tools.ietf.org/html/rfc7766).

### mesos_master_work_dir

The location of the Mesos work directory on master nodes. This defines the `work_dir` parameter for Mesos masters in the cluster. The default is `/var/lib/dcos/mesos/master`. For details, see [Mesos documentation](https://mesos.apache.org/documentation/latest/configuration/master/).

### mesos_max_completed_tasks_per_framework
The number of completed tasks for each framework that the Mesos master will retain in memory. In clusters with a large number of long-running frameworks, retaining too many completed tasks can cause memory issues on the master. If this parameter is not specified, the default Mesos value of 1000 is used.

[oss]
### oauth_enabled
[/oss]

Indicates whether to enable authentication for your cluster. <!-- DC/OS auth -->

- `oauth_enabled: true` Enable authentication for your cluster. This is the default value.
- `oauth_enabled: false` Disable authentication for your cluster.

If you’ve already installed your cluster and would like to disable this in-place, you can go through an upgrade with the same parameter set.

### platform
The infrastructure platform. The value is optional, free-form with no content validation, and used for telemetry only. Supply an appropriate value to help inform DC/OS platform prioritization decisions. Example values: `aws`, `azure`, `oneview`, `openstack`, `vsphere`, `vagrant-virtualbox`, `onprem` (default).

### process_timeout
The allowable amount of time, in seconds, for an action to begin after the process forks. This parameter is not the complete process time. The default value is 120 seconds.

**Tip:** For a slower network, consider changing to `process_timeout: 600`.

### public_agent_list
A YAML nested list (`-`) of IPv4 addresses to your [public agent](/1.11/overview/concepts/#public-agent-node) host names.

### resolvers
A YAML nested list (`-`) of DNS resolvers for your DC/OS cluster nodes. You can specify a maximum of 3 resolvers. Set this parameter to the most authoritative nameservers that you have.

-  If you want to resolve internal hostnames, set it to a nameserver that can resolve them.
-  If you do not have internal hostnames to resolve, you can set this to a public nameserver like Google or AWS. For example, you can specify the [Google Public DNS IP addresses (IPv4)](https://developers.google.com/speed/public-dns/docs/using):

    ```bash
    resolvers:
    - 8.8.4.4
    - 8.8.8.8
    ```
-  If you do not have a DNS infrastructure and do not have access to internet DNS servers, you can specify `resolvers: []`. By specifying this setting, all requests to non-`.mesos` will return an error. For more information, see the Mesos-DNS [documentation](/1.11/networking/mesos-dns/).

**Caution:** If you set the `resolvers` parameter incorrectly, you will permanently damage your configuration and have to reinstall DC/OS.

### rexray_config
The <a href="https://rexray.readthedocs.io/en/v0.9.0/user-guide/config/" target="_blank">REX-Ray</a> configuration for enabling external persistent volumes in Marathon. REX-Ray is a storage orchestration engine. The following is an example configuration.

    rexray_config:
        rexray: 
          loglevel: info 
          service: ebs
        libstorage:
          integration:
            volume:
              operations:
                unmount:
                  ignoreusedcount: true
          server:
            tasks:
              logTimeout: 5m

See the external persistent volumes [documentation](/1.11/storage/external-storage/) for information on how to create your configuration.

If the `rexray_config` parameter is provided, its contents are used verbatim for REX-Ray's configuration. This lets you define completely custom REX-Ray configurations which integrate with various [external storage providers]( https://rexray.readthedocs.io/en/v0.9.0/user-guide/storage-providers/). However, if you upgrade your cluster to a version that includes an updated version of REX-Ray, you must ensure that your `rexray_config` parameter is compatible with the newer version of REX-Ray.


### rexray_config_preset

If you are running your cluster on AWS, and want DC/OS to integrate with the Elastic Block Storage (EBS) without caring about the specific REX-Ray configuration, set the `rexray_config_preset` parameter to `aws`. This sets the `rexray_config` parameter to the default REX-Ray configuration bundled with DC/OS. This option also has the benefit of automatically upgrading your cluster's REX-Ray configuration when you upgrade to a newer version of DC/OS that contains an updated REX-Ray version.

### ssh_key_path
The path that the installer uses to log into the target nodes. By default this is set to `/genconf/ssh_key`. This parameter should not be changed because `/genconf` is local to the container that is running the installer, and is a mounted volume.

### ssh_port
The port to SSH to, for example `22`.

### ssh_user
The SSH username, for example `centos`.

### telemetry_enabled
Indicates whether to enable sharing of anonymous data for your cluster. <!-- DC/OS auth -->

- `telemetry_enabled: 'true'` Enable anonymous data sharing. This is the default value.
- `telemetry_enabled: 'false'` Disable anonymous data sharing.

If you’ve already installed your cluster and would like to disable this in-place, you can go through an [upgrade][3] with the same parameter set.

### use_proxy

Indicates whether to enable the DC/OS proxy.

*  `use_proxy: 'false'` Do not configure DC/OS [components](/1.11/overview/architecture/components/) to use a custom proxy. This is the default value.
*  `use_proxy: 'true'` Configure DC/OS [components](/1.11/overview/architecture/components/) to use a custom proxy. If you specify `use_proxy: 'true'`, you can also specify these parameters:
    **Important:** The specified proxies must be resolvable from the provided list of [resolvers](#resolvers).
    *  `http_proxy: http://<user>:<pass>@<proxy_host>:<http_proxy_port>` The HTTP proxy.
    *  `https_proxy: https://<user>:<pass>@<proxy_host>:<https_proxy_port>` The HTTPS proxy.
    *  `no_proxy`: A YAML nested list (`-`) of subdomains to exclude from forwarding to the `https_proxy`. If the address matches one of these strings, or the host is within the domain of one of these strings, http(s) requests to that node are not proxied. For example, the `no_proxy` list can be a list of internal IP addresses.

        **Important:** Wildcard characters (`*`) are not supported.

For more information, see the [examples](/1.11/installing/ent/custom/configuration/examples/#http-proxy).

**Important:** You should also configure an HTTP proxy for [Docker](https://docs.docker.com/engine/admin/systemd/#/http-proxy).

### enable_ipv6
* `enable_ipv6: 'true'`: Enables IPv6 networking in DC/OS. This is default value.
* `enable_ipv6: 'false'`: Disables IPv6 networking in DC/OS.

Currently IPv6 networks are supported only for Docker containers. Setting this flag to `true` will allow the following features to be enabled:
* Users can create IPv6 DC/OS overlay networks (`NOTE:` This will work only for Docker containers).
* Service discovery for IPv6 containers will be available.
* Layer-4 load-balancing will be available for IPv6 Docker containers if [dcos_l4lb_enable_ipv6](#dcos-l4lb-enable-ipv6) is set to `true`.

### dcos_l4lb_enable_ipv6
Indicates whether layer-4 load-balancing is available for IPv6 containers. 
*  `dcos_l4lb_enable_ipv6: 'false'` Disables [layer-4 load balancing](/1.11/networking/load-balancing-vips) for IPv6 containers. This is the default value.
*  `dcos_l4lb_enable_ipv6: 'true'` Enables layer-4 load balancing for IPv6 containers. `NOTE: Layer-4 load balancing for IPv6 containers should be turned on with caution.`[DCOS_OSS-2010](https://jira.mesosphere.com/browse/DCOS_OSS-2010)

### dcos_ucr_default_bridge_subnet
Takes an IPv4 subnet. The subnet is allocated to the bridge `ucr-br0` created by the `mesos-bridge` CNI network. The `mesos-bridge` CNI network represents the network that is used to launch UCR containers when bridge-mode networking is selected for UCR containers.

The bridge-mode networking for UCR is identical to bridge mode networking for Docker and hence `ucr-br0` plays the same role as `docker0` bridge for Docker bridge-mode networking.

The only constraint in selecting an IPv4 subnet for `dcos_ucr_default_bridge_subnet` is that the subnet should not be used on the network to which the agents are connected. In other words, this subnet should be routeable from only within an agent.
