---
layout: layout.pug
navigationTitle:  Configuration parameters
title: Configuration parameters
menuWeight: 6
excerpt:

enterprise: true
---















These configuration parameters are specified in [YAML][1] format in your config.yaml file. During DC/OS installation the configuration file is used to generate a customized DC/OS build.

# Cluster Setup

### agent_list

This parameter specifies a YAML nested list (`-`) of IPv4 addresses to your agent host names.

### bootstrap_url

This required parameter specifies the URI path for the DC/OS installer to store the customized DC/OS build files. If you are using the automated DC/OS installer, you should specify `bootstrap_url: http://<bootstrap_ip>:<your_port>` unless you have moved the installer assets. By default the automated DC/OS installer places the build files in `file:///opt/dcos_install_tmp`.

### cluster_name

This parameter specifies the name of your cluster.

### exhibitor_storage_backend

This parameter specifies the type of storage backend to use for Exhibitor. You can use internal DC/OS storage (`static`) or specify an external storage system (`zookeeper`, `aws_s3`, `azure`, and `shared_filesystem`) for configuring and orchestrating Zookeeper with Exhibitor on the master nodes. Exhibitor automatically configures your Zookeeper installation on the master nodes during your DC/OS installation.

*   `exhibitor_storage_backend: static` This option specifies that the Exhibitor storage backend is managed internally within your cluster. This is the default value.
*   `exhibitor_storage_backend: zookeeper` This option specifies a ZooKeeper instance for shared storage. If you use a ZooKeeper instance to bootstrap Exhibitor, this ZooKeeper instance must be separate from your DC/OS cluster. You must have at least 3 ZooKeeper instances running at all times for high availability. If you specify `zookeeper`, you must also specify these parameters.
    *   **exhibitor_zk_hosts** This parameter specifies a comma-separated list (`<ZK_IP>:<ZK_PORT>, <ZK_IP>:<ZK_PORT>, <ZK_IP:ZK_PORT>`) of one or more ZooKeeper node IP and port addresses to use for configuring the internal Exhibitor instances. Exhibitor uses this ZooKeeper cluster to orchestrate it's configuration. Multiple ZooKeeper instances are recommended for failover in production environments.
    *   **exhibitor_zk_path** This parameter specifies the filepath that Exhibitor uses to store data.

*   `exhibitor_storage_backend: aws_s3` This option specifies an Amazon Simple Storage Service (S3) bucket for shared storage. If you specify `aws_s3`, you must also specify these parameters.

    *   **aws_access_key_id** This parameter specifies AWS key ID.
    *   **aws_region** This parameter specifies AWS region for your S3 bucket.
    *   **aws_secret_access_key** This parameter specifies AWS secret access key.
    *   **exhibitor_explicit_keys** This parameter specifies whether you are using AWS API keys to grant Exhibitor access to S3.
        *   `exhibitor_explicit_keys: 'true'` If you're using AWS API keys to manually grant Exhibitor access.
        *   `exhibitor_explicit_keys: 'false'` If you're using AWS Identity and Access Management (IAM) to grant Exhibitor access to S3.
    *   **s3_bucket** This parameter specifies name of your S3 bucket.
    *   **s3_prefix** This parameter specifies S3 prefix to be used within your S3 bucket to be used by Exhibitor.

    **Tip:** AWS EC2 Classic is not supported.

*   `exhibitor_storage_backend: azure`
  This option specifies an Azure Storage Account for shared storage. The data will be stored under the container named `dcos-exhibitor`. If you specify `azure`, you must also specify these parameters:
    *  **exhibitor_azure_account_name**
       This parameter specifies the Azure Storage Account Name.
    *  **exhibitor_azure_account_key**
       This parameter specifies a secret key to access the Azure Storage Account.
    *  **exhibitor_azure_prefix**
       This parameter specifies the blob prefix to be used within your Storage Account to be used by Exhibitor.

*   `exhibitor_storage_backend: shared_filesystem` This option specifies a Network File System (NFS) mount for shared storage. If you specify `shared_filesystem`, you must also specify this parameter:

    *   **exhibitor_fs_config_dir** This parameter specifies the absolute path to the folder that Exhibitor uses to coordinate its configuration. This should be a directory inside of a Network File System (NFS) mount. For example, if every master has `/fserv` mounted via NFS, set as `exhibitor_fs_config_dir: /fserv/dcos-exhibitor`.

        **Important:** With `shared_filesystem`, all masters must must have the NFS volume mounted and `exhibitor_fs_config_dir` must be inside of it. If any of your servers are missing the mount, the DC/OS cluster will not start.

### <a name="master"></a>master_discovery

This required parameter specifies the Mesos master discovery method. The available options are `static` or `master_http_loadbalancer`.

*   `master_discovery: static` This option specifies that Mesos agents are used to discover the masters by giving each agent a static list of master IPs. The masters must not change IP addresses, and if a master is replaced, the new master must take the old master's IP address. If you specify `static`, you must also specify this parameter:

    *   **master_list** This required parameter specifies a list of your static master IP addresses as a YAML nested series (`-`).

*   `master_discovery: master_http_loadbalancer` This option specifies that the set of masters has an HTTP load balancer in front of them. The agent nodes will know the address of the load balancer. They use the load balancer to access Exhibitor on the masters to get the full list of master IPs. If you specify `master_http_load_balancer`, you must also specify these parameters:

    *   **exhibitor_address** This required parameter specifies the location (preferably an IP address) of the load balancer in front of the masters. The load balancer must accept traffic on ports 8080, 5050, 80, and 443; and forward it to the same ports on the master (for example, 8080 on lb -> 8080 on one master, 5050 on lb -> 5050 on one master). The load balancer should forward any new connections via round robin, and should avoid machines that do not respond to requests on port 5050 to ensure the master is up.
    *   **num_masters** This parameter specifies the number of Mesos masters in your DC/OS cluster. If `master_discovery: static`, do not use the `num_masters` parameter.

*Note*: On platforms like AWS where internal IPs are allocated dynamically, you should not use a static master list. If a master instance were to terminate for any reason, it could lead to cluster instability.

### <a name="rexray-config"></a>rexray_config_method
This parameter specifies the <a href="https://rexray.readthedocs.org/en/v0.3.2/user-guide/config/" target="_blank">REX-Ray</a> configuration method for enabling external persistent volumes in Marathon. REX-Ray is a storage orchestration engine. For more information, see the external persistent volumes [documentation](/1.7/usage/storage/external-storage/).

- `rexray_config_method: empty` An empty REX-ray configuration. This is the default value.
- `aws` A REX-Ray configuration that is set up for AWS EC2 (EBS) and AWS Identity and Access Management (IAM).
- `rexray_config_method: file` Specify the path to a REX-Ray configuration file with `rexray_config_filename`.

    - `rexray_config_filename` The path of a REX-Ray configuration file. For example:

          rexray_config_filename: genconf/rexray.yaml

# Security and Authentication

### auth_cookie_secure_flag

This parameter specifies whether to allow web browsers to send the DC/OS authentication cookie through a non-HTTPS connection.

*   `auth_cookie_secure_flag: false` Send the DC/OS authentication cookie through non-HTTPS connections. If you are accessing the DC/OS cluster through an HTTP connection, this is the required setting. This is the default value.
*   `auth_cookie_secure_flag: true` Require an HTTPS connection to send the DC/OS authentication cookie. If you are accessing the DC/OS cluster through only HTTPS connections, this is the recommended setting.

### customer_key

This parameter specifies the DC/OS Enterprise customer key. Customer keys are delivered via email to the Authorized Support Contact.

This key is a 128-bit hyphen-delimited hexadecimal identifier used to distinguish an individual cluster. The customer key serves as the Universally Unique Identifier (UUID) for a given installation.

Customer keys look like this:

```
ab1c23de-45f6-7g8h-9012-i345j6k7lm8n
```

### ssh_key_path

This parameter specifies the path to the installer uses to log into the target nodes. By default this is set to `/genconf/ssh_key`. This parameter should not be changed because `/genconf` is local to the container that is running the installer, and is a mounted volume.

### ssh_port

This parameter specifies the port to SSH to, for example `22`.

### ssh_user

This parameter specifies the SSH username, for example `centos`.

### superuser_password_hash

This required parameter specifies the hashed superuser password. The `superuser_password_hash` is generated by using the installer `--hash-password` flag. For more information, see [Identity and Access Management](/1.7/administration/id-and-access-mgt/ent/).

### superuser_username

This required parameter specifies the Admin username. For more information, see [Identity and Access Management](/1.7/administration/id-and-access-mgt/ent/).

### telemetry_enabled

This parameter specifies whether to enable sharing of anonymous data for your cluster.

*   `telemetry_enabled: 'true'` Enable anonymous data sharing. This is the default value.
*   `telemetry_enabled: 'false'` Disable anonymous data sharing.

If you’ve already installed your cluster and would like to disable this in-place, you can go through an upgrade <!-- link? --> with the same parameter set.

# Networking

### <a name="dns-search"></a>dns_search

This parameter specifies a space-separated list of domains that are tried when an unqualified domain is entered (e.g. domain searches that do not contain ‘.’). The Linux implementation of `/etc/resolv.conf` restricts the maximum number of domains to 6 and the maximum number of characters the setting can have to 256. For more information, see [man /etc/resolv.conf][2].

A `search` line with the specified contents is added to the `/etc/resolv.conf` file of every cluster host. `search` can do the same things as `domain` and is more extensible because multiple domains can be specified.

In this example, `example.com` has public website `www.example.com` and all of the hosts in the datacenter have fully qualified domain names that end with `dc1.example.com`. One of the hosts in your datacenter has the hostname `foo.dc1.example.com`. If `dns_search` is set to ‘dc1.example.com example.com’, then every DC/OS host which does a name lookup of foo will get the A record for `foo.dc1.example.com`. If a machine looks up `www`, first `www.dc1.example.com` would be checked, but it does not exist, so the search would try the next domain, lookup `www.example.com`, find an A record, and then return it.

    dns_search: dc1.example.com dc1.example.com example.com dc1.example.com dc2.example.com example.com

### master_dns_bindall

This parameter specifies whether the master DNS port is open. An open master DNS port listens publicly on the masters. If you are upgrading, set this parameter to `true`.

*  `'master_dns_bindall': 'true'` The master DNS port is open. This is the default value.
*  `'master_dns_bindall': 'false'` The master DNS port is closed.


### resolvers

This required parameter specifies a YAML nested list (`-`) of DNS resolvers for your DC/OS cluster nodes. You can specify a maximum of 3 resolvers. Set this parameter to the most authoritative nameservers that you have.

-  If you want to resolve internal hostnames, set it to a nameserver that can resolve them.
-  If you do not have internal hostnames to resolve, you can set this to a public nameserver like Google or AWS. For example, you can specify the [Google Public DNS IP addresses (IPv4)](https://developers.google.com/speed/public-dns/docs/using):

    ```bash
    resolvers:
    - 8.8.4.4
    - 8.8.8.8
    ```
-  If you do not have a DNS infrastructure and do not have access to internet DNS servers, you can specify `resolvers: []`. By specifying this setting, all requests to non-`.mesos` will return an error. For more information, see the Mesos-DNS [documentation](/1.7/usage/service-discovery/mesos-dns/).

**Caution:** If you set the `resolvers` parameter incorrectly, you will permanently damage your configuration and have to reinstall DC/OS.

# Performance and Tuning

### <a name="docker-remove"></a>docker_remove_delay

The amount of time to wait before removing docker containers (i.e., `docker rm`) after Mesos regards the container as TERMINATED (e.g., 3days, 2weeks, etc). This only applies for the Docker Containerizer. It is recommended that you accept the default value 1 hour.

### <a name="gc-delay"></a>gc_delay

This parameter specifies the maximum amount of time to wait before cleaning up the executor directories. It is recommended that you accept the default value of 2 days.

### <a name="log_directory"></a>log_directory

This parameter specifies the path to the installer host logs from the SSH processes. By default this is set to `/genconf/logs`. In most cases this should not be changed because `/genconf` is local to the container that is running the installer, and is a mounted volume.

### <a name="process_timeout"></a>process_timeout

This parameter specifies the allowable amount of time, in seconds, for an action to begin after the process forks. This parameter is not the complete process time. The default value is 120 seconds.

**Tip:** If have a slower network environment, consider changing to `process_timeout: 600`.

# <a name="examples1"></a>Example Configurations

#### DC/OS cluster with 3 masters, 5 agents, static master list specified.

    agent_list:
    - <agent-private-ip-1>
    - <agent-private-ip-2>
    - <agent-private-ip-3>
    - <agent-private-ip-4>
    - <agent-private-ip-5>
    bootstrap_url: 'file:///opt/dcos_install_tmp'
    customer_key: <customer-key>
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


#### <a name="shared"></a>DC/OS cluster with 3 masters, an Exhibitor/Zookeeper shared filesystem storage backend, Internal DNS

    agent_list:
    - <agent-private-ip-1>
    - <agent-private-ip-2>
    - <agent-private-ip-3>
    - <agent-private-ip-4>
    - <agent-private-ip-5>
    bootstrap_url: file:///tmp/dcos
    cluster_name: fs-example
    customer_key: <customer-key>
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
    - 10.10.5.1
    - 10.10.6.1
    ssh_key_path: /genconf/ssh-key
    ssh_port: '<port-number>'
    ssh_user: <username>


#### <a name="aws"></a>DC/OS Cluster with 3 masters, an Exhibitor/Zookeeper backed by an AWS S3 bucket, AWS DNS, and a public agent node

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
    customer_key: <customer-key>
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
    s3_bucket: mybucket
    s3_prefix: s3-example
    ssh_key_path: /genconf/ssh-key
    ssh_port: '<port-number>'
    ssh_user: <username>


#### <a name="zk"></a>DC/OS cluster with 3 masters, an Exhibitor/Zookeeper backed by Zookeeper, master_http_loadbalancer master discovery, public agent node, and Google DNS

    agent_list:
    - <agent-private-ip-1>
    - <agent-private-ip-2>
    - <agent-private-ip-3>
    - <agent-private-ip-4>
    - <agent-private-ip-5>
    bootstrap_url: file:///tmp/dcos
    cluster_name: zk-example
    customer_key: <customer-key>
    exhibitor_storage_backend: zookeeper
    exhibitor_zk_hosts: 10.0.0.1:2181, 10.0.0.2:2181, 10.0.0.3:2181
    exhibitor_zk_path: /zk-example
    log_directory: /genconf/logs
    master_discovery: master_http_loadbalancer
    num_masters: 3
    exhibitor_address: 67.34.242.55
    process_timeout: 120
    resolvers:
    - 8.8.4.4
    - 8.8.8.8
    ssh_key_path: /genconf/ssh-key
    ssh_port: '<port-number>'
    ssh_user: <username>

 [1]: https://en.wikipedia.org/wiki/YAML
 [2]: http://man7.org/linux/man-pages/man5/resolv.conf.5.html
