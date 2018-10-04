---
layout: layout.pug
navigationTitle:  Configuration parameters
title: Configuration parameters
menuWeight: 600
excerpt: Understanding DC/OS configuration parameters

enterprise: true
---

These configuration parameters are specified in [YAML][1] format in your config.yaml file. During DC/OS installation the configuration file is used to generate a customized DC/OS build.


# Cluster Setup

### agent_list

This parameter specifies a YAML nested list (`-`) of IPv4 addresses to your [private agent](/1.8/overview/concepts/#private-agent-node) host names.

### <a name="aws_template_storage_bucket"></a>aws_template_storage_bucket

This parameter specifies the name of your S3 bucket. For example:

```json
aws_template_storage_bucket: dcos-aws-advanced
```

For more information, see [Generating Custom AWS CF Templates](/1.8/administration/installing/ent/cloud/aws/advanced/).

### aws_template_storage_bucket_path

This parameter specifies the S3 bucket storage path. For example:

```json
aws_template_storage_bucket_path: templates/dcos
```

For more information, see [Generating Custom AWS CF Templates](/1.8/administration/installing/ent/cloud/aws/advanced/).

### aws_template_upload

This parameter specifies whether to automatically upload the customized advanced templates to your S3 bucket. If you specify `true`, you must also specify these parameters:

*  **aws_template_storage_access_key_id** This parameters specifies the AWS [Access Key ID](http://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSGettingStartedGuide/AWSCredentials.html). For example:

   ```json
   aws_template_storage_access_key_id: AKIAIOSFODNN7EXAMPLE
   ```

*  **aws_template_storage_secret_access_key** This parameter specifies the AWS [Secret Access Key](http://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSGettingStartedGuide/AWSCredentials.html). For example:

   ```json
   aws_template_storage_secret_access_key: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
   ```

For more information, see [Generating Custom AWS CF Templates](/1.8/administration/installing/ent/cloud/aws/advanced/).

### bootstrap_url

This required parameter specifies the URI path for the DC/OS installer to store the customized DC/OS build files. If you are using the automated DC/OS installer, you should specify `bootstrap_url: http://<bootstrap_ip>:<your_port>` unless you have moved the installer assets. By default the automated DC/OS installer places the build files in `file:///opt/dcos_install_tmp`.

### cluster_name

This parameter specifies the name of your cluster.

### exhibitor_storage_backend

This parameter specifies the type of storage backend to use for Exhibitor. You can use internal DC/OS storage (`static`) or specify an external storage system (`zookeeper`, `azure`, and `aws_s3`) for configuring and orchestrating ZooKeeper with Exhibitor on the master nodes. Exhibitor automatically configures your ZooKeeper installation on the master nodes during your DC/OS installation.

*   `exhibitor_storage_backend: static` This option specifies that the Exhibitor storage backend is managed internally within your cluster.
*   `exhibitor_storage_backend: zookeeper` This option specifies a ZooKeeper instance for shared storage. If you use a ZooKeeper instance to bootstrap Exhibitor, this ZooKeeper instance must be separate from your DC/OS cluster. You must have at least 3 ZooKeeper instances running at all times for high availability. If you specify `zookeeper`, you must also specify these parameters.
    *   **exhibitor_zk_hosts** This parameter specifies a comma-separated list (`<ZK_IP>:<ZK_PORT>, <ZK_IP>:<ZK_PORT>, <ZK_IP:ZK_PORT>`) of one or more ZooKeeper node IP and port addresses to use for configuring the internal Exhibitor instances. Exhibitor uses this ZooKeeper cluster to orchestrate it's configuration. Multiple ZooKeeper instances are recommended for failover in production environments.
    *   **exhibitor_zk_path** This parameter specifies the filepath that Exhibitor uses to store data.

*   `exhibitor_storage_backend: aws_s3` This option specifies an Amazon Simple Storage Service (S3) bucket for shared storage. If you specify `aws_s3`, you must also specify these parameters.

    *   **aws_access_key_id** This parameter specifies AWS key ID.
    *   **aws_region** This parameter specifies AWS region for your S3 bucket.
    *   **aws_secret_access_key** This parameter specifies AWS secret access key.
    *   **exhibitor_explicit_keys** This parameter specifies whether you are using AWS API keys to grant Exhibitor access to S3.
        *   `exhibitor_explicit_keys: 'true'` If you're using AWS API keys to manually grant Exhibitor access.
        *   `exhibitor_explicit_keys: 'false'` If you're using AWS Identity and Access Management (IAM) to grant Exhibitor access to s3.
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

### <a name="master"></a>master_discovery

This required parameter specifies the Mesos master discovery method. The available options are `static` or `master_http_loadbalancer`.

*   `master_discovery: static` This option specifies that Mesos agents are used to discover the masters by giving each agent a static list of master IPs. The masters must not change IP addresses, and if a master is replaced, the new master must take the old master's IP address. If you specify `static`, you must also specify this parameter:

    *   **master_list** This required parameter specifies a list of your static master IP addresses as a YAML nested series (`-`).

*   `master_discovery: master_http_loadbalancer` This option specifies that the set of masters has an HTTP load balancer in front of them. The agent nodes will know the address of the load balancer. They use the load balancer to access Exhibitor on the masters to get the full list of master IPs. If you specify `master_http_load_balancer`, you must also specify these parameters:

    *   **exhibitor_address** This required parameter specifies the location (preferably an IP address) of the load balancer in front of the masters. The load balancer must accept traffic on ports 80, 443, 2181, 5050, 8080, 8181. The traffic must also be forwarded to the same ports on the master. For example, Mesos port 5050 on the load balancer should forward to port 5050 on the master. The load balancer should forward any new connections via round robin, and should avoid machines that do not respond to requests on Mesos port 5050 to ensure the master is up.

    *   **num_masters** This parameter specifies the number of Mesos masters in your DC/OS cluster. If `master_discovery: static`, do not use the `num_masters` parameter.

*Note*: On platforms like AWS where internal IPs are allocated dynamically, you should not use a static master list. If a master instance were to terminate for any reason, it could lead to cluster instability.

### <a name="public-agent"></a>public_agent_list
This parameter specifies a YAML nested list (`-`) of IPv4 addresses to your [public agent](/1.8/overview/concepts/#public-agent-node) host names.

### <a name="rexray-config"></a>rexray_config
This parameter specifies the <a href="https://rexray.readthedocs.org/en/v0.3.2/user-guide/config/" target="_blank">REX-Ray</a> configuration method for enabling external persistent volumes in Marathon. REX-Ray is a storage orchestration engine. The following is an example configuration.

    rexray_config:
      rexray:
        loglevel: info
        modules:
          default-admin:
            host: tcp://127.0.0.1:61003
        storageDrivers:
        - ec2
        volume:
          unmount:
            ignoreusedcount: true

See the external persistent volumes [documentation](/1.8/usage/storage/external-storage/) for information on how to create your configuration.

# <a name="security-authentication"></a>Security and Authentication

### auth_cookie_secure_flag

This parameter specifies whether to allow web browsers to send the DC/OS authentication cookie through a non-HTTPS connection. Because the DC/OS authentication cookie allows access to the DC/OS cluster, it should be sent over an encrypted connection to prevent man-in-the-middle attacks.

*   `auth_cookie_secure_flag: false` (default) Browsers will send the DC/OS authentication cookie through either an unencrypted HTTP connection or an encrypted HTTPS connection.

*   `auth_cookie_secure_flag: true` The authentication cookie set by DC/OS will contain the [`Secure` flag](https://www.owasp.org/index.php/SecureFlag), which instructs the browser to not send the cookie over unencrypted HTTP connections. This could cause authentication to fail under the following circumstances.

    - If the security mode is `disabled`.
    - If the security mode is `permissive`, the URL specifies HTTP, and the URL includes a path (e.g., http://cluster-url.com/path/).
    - There are proxies in between the browser and DC/OS.

### bouncer_expiration_auth_token_days

This parameter sets the auth token time-to-live (TTL) for Identity and Access Management. You must specify the value in Python float syntax wrapped in a YAML string. By default the token expires after 5 days. For example, to set the token lifetime to half a day:

```json
bouncer_expiration_auth_token_days: '0.5'
```

### customer_key

This parameter specifies the DC/OS Enterprise customer key. Customer keys are delivered via email to the Authorized Support Contact.

This key is a 128-bit hyphen-delimited hexadecimal identifier used to distinguish an individual cluster. The customer key serves as the Universally Unique Identifier (UUID) for a given installation.

Customer keys look like this:

```
ab1c23de-45f6-7g8h-9012-i345j6k7lm8n
```

### <a name="security"></a>security

This parameter specifies your desired security mode. `security: permissive` is the default value. The following table provides a high-level view of what changes per setting.

*  `security: disabled`

    <table class="table" STYLE="margin-bottom: 25px;">
      <tr>
        <th>
          Encryption
        </th>
        <th>
          Service accounts for in-cluster services
        </th>
        <th>
          Marathon and Metronome permissions
        </th>
        <th>
          Mesos master/agent permissions
        </th>
        <th>
          Linux user
        </th>
      </tr>
      <tr>
        <td>
          Disabled*
        </td>
        <td>
          Ignored
        </td>
        <td>
          Ignored
        </td>
        <td>
          Ignored
        </td>
        <td>
          <code>root</code>
        </td>
      </tr>
    </table>

    \* *HTTPS requests from outside of the cluster will be rejected because the Admin Router does not have a valid certificate.*

-   `security: permissive`

    <table class="table">
      <tr>
        <th>
          Encryption
        </th>
        <th>
          Service accounts for in-cluster services
        </th>
        <th>
          Marathon and Metronome permissions
        </th>
        <th>
          Mesos master/agent permissions
        </th>
        <th>
          Linux user
        </th>
      </tr>
      <tr>
        <td>
          Optional
        </td>
        <td>
          Optional
        </td>
        <td>
          Enforced
        </td>
        <td>
          Ignored
        </td>
        <td>
          <code>root</code>
        </td>
      </tr>
    </table>

-   `security: strict`

    <table class="table">
      <tr>
        <th>
          Encryption
        </th>
        <th>
          Service accounts for in-cluster services
        </th>
        <th>
          Marathon and Metronome permissions
        </th>
        <th>
          Mesos master/agent permissions
        </th>
        <th>
          Linux user
        </th>
      </tr>
      <tr>
        <td>
          Required
        </td>
        <td>
          Required
        </td>
        <td>
          Enforced
        </td>
        <td>
          Enforced
        </td>
        <td>
          <code>nobody</code>
        </td>
      </tr>
    </table>

**Important:** In `security: strict` mode, only the Cassandra, HDFS, Kafka, non-native Marathon, Marathon-LB, and Spark user services can be deployed and they require special configuration.

For more information see the [example](#secure-cluster). For a detailed discussion of the ramifications of each setting, see the following sections.

- [TLS/SSL encryption](/1.8/administration/tls-ssl/ent/)
- [Service Authentication](/1.8/administration/id-and-access-mgt/ent/service-auth/)
- [User service permissions](/1.8/administration/id-and-access-mgt/ent/permissions/user-service-perms/)
- [Mesos master and agent permissions](/1.8/administration/id-and-access-mgt/ent/permissions/master-agent-perms/)
- [Configuring Linux users](/1.8/administration/id-and-access-mgt/ent/users-groups/config-linux-user/)

**Tip:** You can determine which security mode your cluster is using by [SSHing](/1.8/administration/access-node/sshcluster/) to your master and viewing the contents of `/opt/mesosphere/etc/bootstrap-config.json`.

### ssh_key_path

This parameter specifies the path the installer uses to log into the target nodes. By default this is set to `/genconf/ssh_key`. This parameter should not be changed because `/genconf` is local to the container that is running the installer, and is a mounted volume.

### ssh_port

This parameter specifies the port to SSH to, for example `22`.

### ssh_user

This parameter specifies the SSH username, for example `centos`.

### superuser_password_hash

This required parameter specifies the hashed superuser password. This first superuser account is used to provide a method of logging into DC/OS, at which point additional administrative accounts can be added. The `superuser_password_hash` is generated by using the installer `--hash-password` flag. For more information, see [Identity and Access Management](/1.8/administration/id-and-access-mgt/ent/).

### superuser_username

This required parameter specifies the Admin username. This account uses the `superuser_password_hash`. For more information, see [Identity and Access Management](/1.8/administration/id-and-access-mgt/ent/).

### <a name="telemetry-enabled"></a>telemetry_enabled

This parameter specifies whether to enable sharing of anonymous data for your cluster.

*   `telemetry_enabled: 'true'` Enable anonymous data sharing. This is the default value.
*   `telemetry_enabled: 'false'` Disable anonymous data sharing.

If you’ve already installed your cluster and would like to disable this in-place, you can go through an [upgrade](/1.8/administration/upgrading/) with the same parameter set.

### zk_super_credentials

This parameter specifies the ZooKeeper superuser credentials. This protects access to Mesos, DC/OS Marathon, Identity and Access Management, Package service, and other cluster metadata. It is recommended that you specify a non-default value. For more information about ZooKeeper passwords, see the [documentation](https://zookeeper.apache.org/doc/current/zookeeperProgrammers.html#sc_ZooKeeperAccessControl).

For more information see the [example](#secure-cluster).

### zk_master_credentials

This parameter specifies the ZooKeeper master credentials. This protects access to Mesos, DC/OS Marathon, Identity and Access Management, Package service, and other cluster metadata. It is recommended that you specify a non-default value. For more information about ZooKeeper passwords, see the [documentation](https://zookeeper.apache.org/doc/current/zookeeperProgrammers.html#sc_ZooKeeperAccessControl).

For more information see the [example](#secure-cluster).

### zk_agent_credentials

This parameter specifies the ZooKeeper agent credentials. This protects access to Mesos, DC/OS Marathon, Identity and Access Management, Package service, and other cluster metadata. It is recommended that you specify a non-default value. For more information about ZooKeeper passwords, see the [documentation](https://zookeeper.apache.org/doc/current/zookeeperProgrammers.html#sc_ZooKeeperAccessControl).

For more information see the [example](#secure-cluster).

# Networking

### <a name="dcos-overlay-enable"></a>dcos_overlay_enable

This parameter specifies whether to enable DC/OS virtual networks.

**Important:** Virtual networks require Docker 1.11. If you are using Docker 1.10 or earlier, you must specify `dcos_overlay_enable: 'false'`. For more information, see the [system requirements](/1.8/administration/installing/ent/custom/system-requirements/).

*  `dcos_overlay_enable: 'false'` Do not enable the DC/OS virtual network.
*  `dcos_overlay_enable: 'true'` Enable the DC/OS virtual network. This is the default value. When the virtual network is enabled you can also specify the following parameters:

    *  `dcos_overlay_config_attempts` This parameter specifies how many failed configuration attempts are allowed before the overlay configuration modules stop trying to configure a virtual network.

        __Tip:__ The failures might be related to a malfunctioning Docker daemon.

    *  `dcos_overlay_mtu` This parameter specifies the maximum transmission unit (MTU) of the Virtual Ethernet (vEth) on the containers that are launched on the overlay.

    *  `dcos_overlay_network` This group of parameters define a virtual network for DC/OS.  The default configuration of DC/OS provides a virtual network named `dcos` whose YAML configuration is as follows:

        ```
        dcos_overlay_network:
            vtep_subnet: 44.128.0.0/20
            vtep_mac_oui: 70:B3:D5:00:00:00
            overlays:
              - name: dcos
                subnet: 9.0.0.0/8
                prefix: 26
        ```

        *  `vtep_subnet` This parameter specifies a dedicated address space that is used for the VxLAN backend for the virtual network. This address space should not be routeable from outside the agents or master.
        *  `vtep_mac_oui` This parameter specifies the MAC address of the interface connecting to it in the public node.

            **Important:** The last 3 bytes must be `00`.
        *  __overlays__
            *  `name` This parameter specifies the canonical name (see [limitations](/1.8/administration/virtual-networks/) for constraints on naming virtual networks).
            *  `subnet` This parameter specifies the subnet that is allocated to the virtual network.
            *  `prefix` This parameter specifies the size of the subnet that is allocated to each agent and thus defines the number of agents on which the overlay can run. The size of the subnet is carved from the overlay subnet.

 For more information see the [example](#overlay) and [documentation](/1.8/administration/virtual-networks/).

### <a name="dns-search"></a>dns_search

This parameter specifies a space-separated list of domains that are tried when an unqualified domain is entered (e.g. domain searches that do not contain ‘.’). The Linux implementation of `/etc/resolv.conf` restricts the maximum number of domains to 6 and the maximum number of characters the setting can have to 256. For more information, see [man /etc/resolv.conf][2].

A `search` line with the specified contents is added to the `/etc/resolv.conf` file of every cluster host. `search` can do the same things as `domain` and is more extensible because multiple domains can be specified.

In this example, `example.com` has public website `www.example.com` and all of the hosts in the datacenter have fully qualified domain names that end with `dc1.example.com`. One of the hosts in your datacenter has the hostname `foo.dc1.example.com`. If `dns_search` is set to ‘dc1.example.com example.com’, then every DC/OS host which does a name lookup of foo will get the A record for `foo.dc1.example.com`. If a machine looks up `www`, first `www.dc1.example.com` would be checked, but it does not exist, so the search would try the next domain, lookup `www.example.com`, find an A record, and then return it.

    dns_search: dc1.example.com dc1.example.com example.com dc1.example.com dc2.example.com example.com

### master_dns_bindall

This parameter specifies whether the master DNS port is open. An open master DNS port listens publicly on the masters. If you are upgrading, set this parameter to `true`.

*  `'master_dns_bindall': 'true'` The master DNS port is open. This is the default value.
*  `'master_dns_bindall': 'false'` The master DNS port is closed.


### <a name="resolvers"></a>resolvers

This required parameter specifies a YAML nested list (`-`) of DNS resolvers for your DC/OS cluster nodes. You can specify a maximum of 3 resolvers. Set this parameter to the most authoritative nameservers that you have. If you want to resolve internal hostnames, set it to a nameserver that can resolve them. If you have no internal hostnames to resolve, you can set this to a public nameserver like Google or AWS. In the example file above, the <a href="https://developers.google.com/speed/public-dns/docs/using" target="_blank">Google Public DNS IP addresses (IPv4)</a> are specified (`8.8.8.8` and `8.8.4.4`).

**Caution:** If you set the `resolvers` parameter incorrectly, you will permanently damage your configuration and have to reinstall DC/OS.

### <a name="use-proxy"></a>use_proxy

This parameter specifies whether to enable the DC/OS proxy.

*  `use_proxy: 'false'` Do not configure DC/OS [components](/1.8/overview/components/) to use a custom proxy. This is the default value.
*  `use_proxy: 'true'` Configure DC/OS [components](/1.8/overview/components/) to use a custom proxy. If you specify `use_proxy: 'true'`, you can also specify these parameters:
    **Important:** The specified proxies must be resolvable from the provided list of [resolvers](#resolvers).
    *  `http_proxy: http://<user>:<pass>@<proxy_host>:<http_proxy_port>` This parameter specifies the HTTP proxy.
    *  `https_proxy: https://<user>:<pass>@<proxy_host>:<https_proxy_port>` This parameter specifies the HTTPS proxy.
    *  `no_proxy: - .<(sub)domain>` This parameter specifies YAML nested list (-) of addresses to exclude from the proxy.

For more information, see the [examples](#http-proxy).

**Important:** You should also configure an HTTP proxy for [Docker](https://docs.docker.com/engine/admin/systemd/#/http-proxy).

# Performance and Tuning

### <a name="docker-remove"></a>docker_remove_delay

The amount of time to wait before removing docker containers (i.e., `docker rm`) after Mesos regards the container as TERMINATED (e.g., 3days, 2weeks, etc). This only applies for the Docker Containerizer. It is recommended that you accept the default value 1 hour.

### <a name="dcos-audit-logging"></a>dcos_audit_logging

This parameter specifies whether security decisions (authentication, authorization) are logged for Mesos, Marathon, and Jobs.

* `'dcos_audit_logging': 'true'` Mesos, Marathon, and Jobs are logged. This is the default value.
* `'dcos_audit_logging': 'false'` Mesos, Marathon, and Jobs are not logged.

### <a name="gc-delay"></a>gc_delay

This parameter specifies the maximum amount of time to wait before cleaning up the executor directories. It is recommended that you accept the default value of 2 days.

### <a name="log_directory"></a>log_directory

This parameter specifies the path to the installer host logs from the SSH processes. By default this is set to `/genconf/logs`. In most cases this should not be changed because `/genconf` is local to the container that is running the installer, and is a mounted volume.

### <a name="process_timeout"></a>process_timeout

This parameter specifies the allowable amount of time, in seconds, for an action to begin after the process forks. This parameter is not the complete process time. The default value is 120 seconds.

**Tip:** If have a slower network environment, consider changing to `process_timeout: 600`.

# <a name="examples1"></a>Example Configurations

#### DC/OS cluster with three masters, five private agents, security mode specified, and Exhibitor/ZooKeeper managed internally.

```yaml
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
# Choose your security mode: permissive, strict, or disabled
security: <security-mode>
superuser_password_hash: <hashed-password> # Generated above
superuser_username: <username> # This can be whatever you like
ssh_key_path: /genconf/ssh-key
ssh_port: '<port-number>'
ssh_user: <username>
```

#### <a name="aws"></a>DC/OS cluster with three masters, an Exhibitor/ZooKeeper backed by an AWS S3 bucket, AWS DNS, five private agents, security mode specified, and one public agent node

```yaml
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
# Choose your security mode: permissive, strict, or disabled
security: <security-mode>
superuser_password_hash: <hashed-password> # Generated above
superuser_username: <username> # This can be whatever you like
s3_bucket: mybucket
s3_prefix: s3-example
ssh_key_path: /genconf/ssh-key
ssh_port: '<port-number>'
ssh_user: <username>
```

#### <a name="zk"></a>DC/OS cluster with three masters, an Exhibitor/ZooKeeper backed by ZooKeeper, master_http_loadbalancer master discovery, one public agent node, 5 private agents, security mode specified, and Google DNS

```yaml
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
public_agent_list:
- <public-agent-private-ip>
process_timeout: 120
resolvers:
- 8.8.4.4
- 8.8.8.8
# Choose your security mode: permissive, strict, or disabled
security: <security-mode>
superuser_password_hash: <hashed-password> # Generated above
superuser_username: <username> # This can be whatever you like
ssh_key_path: /genconf/ssh-key
ssh_port: '<port-number>'
ssh_user: <username>
```

#### <a name="overlay"></a>DC/OS cluster with three masters, an Exhibitor/ZooKeeper managed internally, two DC/OS virtual networks, two private agents, security mode specified, and Google DNS

```yaml
    agent_list:
    - <agent-private-ip-1>
    - <agent-private-ip-2>
    - <agent-private-ip-3>
    # Use this bootstrap_url value unless you have moved the DC/OS installer assets.
    bootstrap_url: http://<bootstrap_ip>:<your_port>
    cluster_name: <cluster-name>
    customer_key: <customer-key>
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
    # Choose your security mode: permissive, strict, or disabled
    security: <security-mode>  
    superuser_password_hash: <hashed-password> # Generated above
    superuser_username: <username> # This can be whatever you like  
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

#### <a name="http-proxy"></a>DC/OS cluster with three masters, an Exhibitor/ZooKeeper managed internally, a custom HTTP proxy, two private agents, security mode specified, and Google DNS

```yaml
    agent_list:
    - <agent-private-ip-1>
    - <agent-private-ip-2>
    - <agent-private-ip-3>
    # Use this bootstrap_url value unless you have moved the DC/OS installer assets.
    bootstrap_url: http://<bootstrap_ip>:<your_port>
    cluster_name: <cluster-name>
    customer_key: <customer-key>
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
    # Choose your security mode: permissive, strict, or disabled
    security: <security-mode>    
    superuser_password_hash: <hashed-password> # Generated above
    superuser_username: <username> # This can be whatever you like
    ssh_port: 22
    ssh_user: centos
    use_proxy: 'true'
    http_proxy: http://<user>:<pass>@<proxy_host>:<http_proxy_port>
    https_proxy: https://<user>:<pass>@<proxy_host>:<https_proxy_port>
    no_proxy:
    - 'foo.bar.com'         
    - '.baz.com'
```

#### <a name="secure-cluster"></a>DC/OS cluster with three masters, two private agents, one public agent, security mode specified, an Exhibitor/ZooKeeper managed internally, and Google DNS

```yaml
    agent_list:
    - <agent-private-ip-1>
    - <agent-private-ip-2>
    - <agent-private-ip-3>
    # Use this bootstrap_url value unless you have moved the DC/OS installer assets.
    bootstrap_url: http://<bootstrap_ip>:<your_port>
    cluster_name: <cluster-name>
    customer_key: <customer-key>
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
    # Choose your security mode: permissive, strict, or disabled
    security: <security-mode>
    superuser_password_hash: <hashed-password> # Generated above
    superuser_username: <username> # This can be whatever you like
    ssh_port: 22
    ssh_user: centos
    zk_super_credentials: <userid>:<password>
    zk_master_credentials: <userid>:<password>
    zk_agent_credentials: <userid>:<password>
```

 [1]: https://en.wikipedia.org/wiki/YAML
 [2]: http://man7.org/linux/man-pages/man5/resolv.conf.5.html
