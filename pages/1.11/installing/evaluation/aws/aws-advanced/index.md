---
layout: layout.pug
title: Advanced DC/OS on AWS
excerpt: Configuring your DC/OS installation on AWS using the Universal Installer
navigationTitle: Advanced AWS 
menuWeight: 1
---

The Mesosphere Universal Installer supports a wide range of inputs/variables to add to your `main.tf` and enable you to customize your DC/OS cluster to your needs. These inputs/variables include everything from specifying the operating system (CentOS, CoreOS, RHEL) to setting the garbage collection time of your DC/OS cluster.

The Terraform-based Universal Installer is designed to be flexible with configuration. Below is an example of a custom `main.tf` that provisions a customized DC/OS 1.11.7 cluster on AWS.

```hcl
module "dcos" {
  source  = "dcos-terraform/dcos/aws"
  version = "~> 0.1"

  cluster_name = "mydcoscluster"
  ssh_public_key_file = "~/.ssh/id_rsa.pub"
  admin_ips = ["198.51.100.0/24"]

  dcos_version = "1.11.7"
  num_masters = "3"
  num_private_agents = "2"
  num_public_agents = "1"

  # availability_zones = ["<your_selected_region>a"]

  dcos_cluster_docker_credentials_enabled =  "true"
  dcos_cluster_docker_credentials_write_to_etc = "true"
  dcos_cluster_docker_credentials_dcos_owned = "false"
  dcos_cluster_docker_registry_url = "https://index.docker.io"
  dcos_use_proxy = "yes"
  dcos_http_proxy = "example.com"
  dcos_https_proxy = "example.com"
  dcos_no_proxy = <<EOF
  # YAML
   - "internal.net"
   - "169.254.169.254"
  EOF
  dcos_overlay_network = <<EOF
  # YAML
      vtep_subnet: 44.128.0.0/20
      vtep_mac_oui: 70:B3:D5:00:00:00
      overlays:
        - name: dcos
          subnet: 12.0.0.0/8
          prefix: 26
  EOF
  dcos_rexray_config = <<EOF
  # YAML
    rexray:
      loglevel: warn
      modules:
        default-admin:
          host: tcp://127.0.0.1:61003
      storageDrivers:
      - ec2
      volume:
        unmount:
          ignoreusedcount: true
  EOF
  dcos_cluster_docker_credentials = <<EOF
  # YAML
    auths:
      'https://index.docker.io/v1/':
        auth: Ze9ja2VyY3licmljSmVFOEJrcTY2eTV1WHhnSkVuVndjVEE=
  EOF

  # dcos_variant              = "ee"
  # dcos_license_key_contents = "${file("./license.txt")}"
  dcos_variant = "open"
}
```

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|:----:|:-----:|:-----:|
| admin_ips | List of CIDR admin IPs. | list | - | yes |
| availability_zones | Availability zones to be used. | list | `<list>` | no |
| aws_ami | AMI that will be used for the instances instead of Mesosphere provided AMIs. | string | `` | no |
| aws_key_name | Specify The AWS SSH key to use. We assume its already loaded in your SSH agent. Set `ssh_public_key` to none | string | `` | no |
| bootstrap_associate_public_ip_address | [BOOTSTRAP] Associate a public IP address with these instances. | string | `true` | no |
| bootstrap_aws_ami | [BOOTSTRAP] AMI to be used. | string | `` | no |
| bootstrap_instance_type | [BOOTSTRAP] Instance type. | string | `t2.medium` | no |
| bootstrap_os | [BOOTSTRAP] Operating system to use. Instead of using your own AMI you could use a provided OS. | string | `` | no |
| bootstrap_private_ip | Used for the private IP for the bootstrap URL. | string | `` | no |
| bootstrap_root_volume_size | [BOOTSTRAP] Root volume size in GB. | string | `80` | no |
| bootstrap_root_volume_type | [BOOTSTRAP] Root volume type. | string | `standard` | no |
| cluster_name | Name of the DC/OS cluster. | string | `dcos-example` | no |
| cluster_name_random_string | Add a random string to the cluster name. | string | `false` | no |
| custom_dcos_download_path | Insert location of DC/OS installer script. (optional) | string | `` | no |
| dcos_adminrouter_tls_1_0_enabled | Indicates whether to enable TLSv1 support in Admin Router. (optional) | string | `` | no |
| dcos_adminrouter_tls_1_1_enabled | Indicates whether to enable TLSv1.1 support in Admin Router. (optional) | string | `` | no |
| dcos_adminrouter_tls_1_2_enabled | Indicates whether to enable TLSv1.2 support in Admin Router. (optional) | string | `` | no |
| dcos_adminrouter_tls_cipher_suite | [Enterprise DC/OS] Indicates whether to allow web browsers to send the DC/OS authentication cookie through a non-HTTPS connection. (optional) | string | `` | no |
| dcos_agent_list | Used to list the agents in the config.yaml. (optional) | string | `` | no |
| dcos_audit_logging | [Enterprise DC/OS] Enabled security decisions are logged for Mesos, Marathon, and Jobs. (optional) | string | `` | no |
| dcos_auth_cookie_secure_flag | [Enterprise DC/OS] Allow web browsers to send the DC/OS authentication cookie through a non-HTTPS connection. (optional) | string | `` | no |
| dcos_aws_access_key_id | The AWS key ID for Exhibitor storage.  (optional but required with `dcos_exhibitor_address`) | string | `` | no |
| dcos_aws_region | The AWS region for Exhibitor storage. (optional but required with `dcos_exhibitor_address`) | string | `` | no |
| dcos_aws_secret_access_key | The AWS secret key for Exhibitor storage. (optional but required with `dcos_exhibitor_address`) | string | `` | no |
| dcos_aws_template_storage_access_key_id | The AWS key ID for CloudFormation template storage. (optional) | string | `` | no |
| dcos_aws_template_storage_bucket | The AWS CloudFormation bucket name. (optional) | string | `` | no |
| dcos_aws_template_storage_bucket_path | The AWS CloudFormation bucket path. (optional) | string | `` | no |
| dcos_aws_template_storage_region_name | The AWS CloudFormation region name. (optional) | string | `` | no |
| dcos_aws_template_storage_secret_access_key | The AWS secret key for the CloudFormation template. (optional) | string | `` | no |
| dcos_aws_template_upload | To automatically upload the customized advanced templates to your S3 bucket. (optional) | string | `` | no |
| dcos_bootstrap_port | Used to specify the port of the bootstrap URL. | string | `80` | no |
| dcos_bouncer_expiration_auth_token_days | [Enterprise DC/OS] Sets the auth token time-to-live (TTL) for Identity and Access Management. (optional) | string | `` | no |
| dcos_ca_certificate_chain_path | [Enterprise DC/OS] Path (relative to the $DCOS_INSTALL_DIR) to a file containing the complete CA certification chain required for end-entity certificate verification, in the OpenSSL PEM format. (optional) | string | `` | no |
| dcos_ca_certificate_key_path |  | string | `` | no |
| dcos_ca_certificate_path | [Enterprise DC/OS] Path (relative to the $DCOS_INSTALL_DIR) to a file containing a single X.509 CA certificate in the OpenSSL PEM format. (optional) | string | `` | no |
| dcos_check_time | Check if Network Time Protocol (NTP) is enabled during DC/OS startup. (optional) | string | `` | no |
| dcos_cluster_docker_credentials | The dictionary of Docker credentials to pass. (optional) | string | `` | no |
| dcos_cluster_docker_credentials_dcos_owned | Indicates whether to store the credentials file in `/opt/mesosphere` or `/etc/mesosphere/docker_credentials`. A sysadmin cannot edit `/opt/mesosphere` directly (optional) | string | `` | no |
| dcos_cluster_docker_credentials_enabled | Indicates whether to pass the Mesos `--docker_config` option to Mesos. (optional) | string | `` | no |
| dcos_cluster_docker_credentials_write_to_etc | Indicates whether to write a cluster credentials file. (optional) | string | `` | no |
| dcos_cluster_docker_registry_enabled |  | string | `` | no |
| dcos_cluster_docker_registry_url | The custom URL that Mesos uses to pull Docker images from. If set, it will configure the Mesos’ `--docker_registry` flag to the specified URL. (optional) | string | `` | no |
| dcos_cluster_name | Sets the DC/OS cluster name. | string | `` | no |
| dcos_config | Used to add any extra arguments in the `config.yaml` that are not specified here. (optional) | string | `` | no |
| dcos_custom_checks | Custom installation checks that are added to the default check configuration process. (optional) | string | `` | no |
| dcos_customer_key | [Enterprise DC/OS] Sets the customer key. (optional) | string | `` | no |
| dcos_dns_bind_ip_blacklist | A list of IP addresses that DC/OS DNS resolvers cannot bind to. (optional) | string | `` | no |
| dcos_dns_forward_zones | Allow to forward DNS to certain domain requests to specific server. The [following syntax](https://github.com/dcos/dcos-docs/blob/master/1.10/installing/custom/configuration/configuration-parameters.md#dns_forward_zones) must be used in combination with [Terraform string heredoc](https://www.terraform.io/docs/configuration/variables.html#strings). (optional) (:warning: DC/OS 1.10+) | string | `` | no |
| dcos_dns_search | A space-separated list of domains that are tried when an unqualified domain is entered. (optional) | string | `` | no |
| dcos_docker_remove_delay | The amount of time to wait before removing stale Docker images stored on the agent nodes and the Docker image generated by the installer. (optional) | string | `` | no |
| dcos_enable_docker_gc | Indicates whether to run the `docker-gc script`, a simple Docker container and image garbage collection script which runs once an hour to clean up stray Docker containers. (optional) | string | `` | no |
| dcos_enable_gpu_isolation | Indicates whether to enable GPU support in DC/OS. (optional) | string | `` | no |
| dcos_exhibitor_address | The address of the load balancer in front of the masters. (recommended) | string | `` | no |
| dcos_exhibitor_azure_account_key | The Azure account key for Exhibitor storage. (optional but required with `dcos_exhibitor_address`) | string | `` | no |
| dcos_exhibitor_azure_account_name | The Azure account name for Exhibitor storage. (optional but required with `dcos_exhibitor_address`) | string | `` | no |
| dcos_exhibitor_azure_prefix | The Azure account name for Exhibitor storage. (optional but required with `dcos_exhibitor_address`) | string | `` | no |
| dcos_exhibitor_explicit_keys | Set whether you are using AWS API keys to grant Exhibitor access to S3. (optional) | string | `` | no |
| dcos_exhibitor_storage_backend | Options are `aws_s3`, `azure`, or `zookeeper` (recommended) | string | `static` | no |
| dcos_exhibitor_zk_hosts | A comma-separated list of one or more ZooKeeper node IP and port addresses to use for configuring the internal Exhibitor instances. (Not recommended but required with `exhibitor_storage_backend` set to `zookeeper `. Use `aws_s3` or `azure` instead. Assumes external ZooKeeper is already online.) | string | `` | no |
| dcos_exhibitor_zk_path | The filepath that Exhibitor uses to store data (not recommended but required with exhibitor_storage_backend set to `zookeeper`. Use `aws_s3` or `azure` instead. Assumes external ZooKeeper is already online.) | string | `` | no |
| dcos_fault_domain_detect_contents | [Enterprise DC/OS] Fault domain script contents. Optional but required if no `fault-domain-detect` script present. | string | `` | no |
| dcos_fault_domain_enabled | [Enterprise DC/OS] Used to control if fault domain is enabled. | string | `` | no |
| dcos_gc_delay | The maximum amount of time to wait before cleaning up the executor directories (optional) | string | `` | no |
| dcos_gpus_are_scarce | Indicates whether to treat GPUs as a scarce resource in the cluster. (optional) | string | `` | no |
| dcos_http_proxy | The http proxy. (optional) | string | `` | no |
| dcos_https_proxy | The https proxy. (optional) | string | `` | no |
| dcos_install_mode | Specifies which type of command to execute. Options: `install` or `upgrade` | string | `install` | no |
| dcos_instance_os | Operating system to use. Instead of using your own AMI you could use a provided OS. | string | `centos_7.5` | no |
| dcos_ip_detect_contents | Allows DC/OS to detect your private address. Use this to pass this as an input to the module rather than a file in side your bootstrap node. (recommended) | string | `` | no |
| dcos_ip_detect_public_contents | Allows DC/OS to be aware of your publicly routeable address for ease of use (recommended) | string | `` | no |
| dcos_ip_detect_public_filename | Statically set your `detect-ip-public` path | string | `genconf/ip-detect-public` | no |
| dcos_l4lb_enable_ipv6 | A boolean that indicates if layer 4 load balancing is available for IPv6 networks. (optional) | string | `` | no |
| dcos_license_key_contents | [Enterprise DC/OS] Used to provide the license key of DC/OS for Enterprise Edition. Optional if `license.txt` is present on bootstrap node. | string | `` | no |
| dcos_log_directory | The path to the installer host logs from the SSH processes. (optional) | string | `` | no |
| dcos_master_discovery | The Mesos master discovery method. The available options are `static` or `master_http_loadbalancer`. (recommend the use of `master_http_loadbalancer`) | string | `static` | no |
| dcos_master_dns_bindall | Indicates whether the master DNS port is open. (optional) | string | `` | no |
| dcos_master_external_loadbalancer | [Enterprise DC/OS] Allows DC/OS to configure certs around the External Load Balancer name. If not used SSL verfication issues will arise. (recommended) | string | `` | no |
| dcos_master_list | Statically set your master nodes (not recommended but required with `exhibitor_storage_backend` set to `static`. Use `aws_s3` or `azure` instead, that way you can replace masters in the cloud.) | string | `` | no |
| dcos_mesos_container_log_sink | The log manager for containers (tasks). The options are to send logs to: 'journald', 'logrotate', 'journald+logrotate'. (optional) | string | `` | no |
| dcos_mesos_dns_set_truncate_bit | Indicates whether to set the truncate bit if the response is too large to fit in a single packet. (optional) | string | `` | no |
| dcos_mesos_max_completed_tasks_per_framework | The number of completed tasks for each framework that the Mesos master will retain in memory. (optional) | string | `` | no |
| dcos_no_proxy | A YAML nested list (-) of addresses to exclude from the proxy. (optional) | string | `` | no |
| dcos_num_masters | Set the number of master nodes (required with `exhibitor_storage_backend` set to `aws_s3`, `azure`, `zookeeper`) | string | `` | no |
| dcos_oauth_enabled | [DC/OS Open Source Only] Indicates whether to enable authentication for your cluster. (optional) | string | `` | no |
| dcos_overlay_config_attempts | Specifies how many failed configuration attempts are allowed before the overlay configuration modules stop trying to configure an virtual network. (optional) | string | `` | no |
| dcos_overlay_enable | Enable to disable overlay. (optional) | string | `` | no |
| dcos_overlay_mtu | The maximum transmission unit (MTU) of the Virtual Ethernet (vEth) on the containers that are launched on the overlay. (optional) | string | `` | no |
| dcos_overlay_network | This group of parameters define an virtual network for DC/OS. (optional) | string | `` | no |
| dcos_package_storage_uri | Where to permanently store DC/OS packages. The value must be a file URL. (optional) | string | `` | no |
| dcos_previous_version | DC/OS 1.9+ requires users to set this value to ensure users know the version. Terraform helps populate this value, but users can override it here. (recommended) | string | `` | no |
| dcos_previous_version_master_index | Used to track the index of master for quering the previous DC/OS version during upgrading. (optional) applicable: 1.9+ | string | `0` | no |
| dcos_process_timeout | The allowable amount of time, in seconds, for an action to begin after the process forks. (optional) | string | `` | no |
| dcos_public_agent_list | Statically set your public agents (not recommended) | string | `` | no |
| dcos_resolvers | A YAML nested list (-) of DNS resolvers for your DC/OS cluster nodes. (recommended) | string | `` | no |
| dcos_rexray_config | The REX-Ray configuration method for enabling external persistent volumes in Marathon. (optional) | string | `` | no |
| dcos_rexray_config_filename | The REX-Ray configuration filename for enabling external persistent volumes in Marathon. (optional) | string | `` | no |
| dcos_rexray_config_method | The REX-Ray configuration method for enabling external persistent volumes in Marathon.  (optional) | string | `` | no |
| dcos_s3_bucket | Name of the S3 bucket for the Exhibitor backend. (recommended but required with `dcos_exhibitor_address`) | string | `` | no |
| dcos_s3_prefix | Name of the S3 prefix for the Exhibitor backend. (recommended but required with `dcos_exhibitor_address`) | string | `` | no |
| dcos_security | [Enterprise DC/OS] Set the security level of DC/OS. Default is permissive. (recommended) | string | `` | no |
| dcos_skip_checks | Upgrade option: Used to skip all D/OS Checks that may block an upgrade if any DC/OS component is unhealthy. (optional) applicable: 1.10+ | string | `false` | no |
| dcos_staged_package_storage_uri | Where to temporarily store DC/OS packages while they are being added. (optional) | string | `` | no |
| dcos_superuser_password_hash | [Enterprise DC/OS] Set the superuser password hash. (recommended) | string | `` | no |
| dcos_superuser_username | [Enterprise DC/OS] Set the superuser username. (recommended) | string | `` | no |
| dcos_telemetry_enabled | Change the telemetry option. (optional) | string | `` | no |
| dcos_ucr_default_bridge_subnet | IPv4 subnet allocated to the mesos-bridge CNI network for UCR bridge-mode networking. (optional) | string | `` | no |
| dcos_use_proxy | To enable use of proxy for internal routing (optional) | string | `` | no |
| dcos_variant | Main variables. | string | `open` | no |
| dcos_version | Specifies which DC/OS version instruction to use. Options: `1.9.0`, `1.8.8`, etc. See [dcos_download_path](https://github.com/dcos/tf_dcos_core/blob/master/download-variables.tf) or [dcos_version](https://github.com/dcos/tf_dcos_core/tree/master/dcos-versions) tree for a full list. | string | `1.11.7` | no |
| dcos_zk_agent_credentials | [Enterprise DC/OS] Set the ZooKeeper agent credentials. (recommended) | string | `` | no |
| dcos_zk_master_credentials | [Enterprise DC/OS] Set the ZooKeeper master credentials. (recommended) | string | `` | no |
| dcos_zk_super_credentials | [Enterprise DC/OS] Set the ZooKeeper super credentials. (recommended) | string | `` | no |
| masters_associate_public_ip_address | [MASTERS] Associate a public IP address with these instances. | string | `true` | no |
| masters_aws_ami | [MASTERS] AMI to be used. | string | `` | no |
| masters_instance_type | [MASTERS] Instance type. | string | `m4.xlarge` | no |
| masters_os | [MASTERS] Operating system to use. Instead of using your own AMI you could use a provided OS. | string | `` | no |
| masters_root_volume_size | [MASTERS] Root volume size in GB. | string | `120` | no |
| num_masters | Specify the amount of masters. For redundancy you should have at least 3. | string | `3` | no |
| num_of_private_agents |  | string | `` | no |
| num_of_public_agents |  | string | `` | no |
| num_private_agents | Specify the amount of private agents. These agents will provide your main resources. | string | `2` | no |
| num_public_agents | Specify the amount of public agents. These agents will host marathon-lb and edgelb. | string | `1` | no |
| private_agents_associate_public_ip_address | [PRIVATE AGENTS] Associate a public IP address with there instances | string | `true` | no |
| private_agents_aws_ami | [PRIVATE AGENTS] AMI to be used. | string | `` | no |
| private_agents_instance_type | [PRIVATE AGENTS] Instance type. | string | `m4.xlarge` | no |
| private_agents_os | [PRIVATE AGENTS] Operating system to use. Instead of using your own AMI you could use a provided OS. | string | `` | no |
| private_agents_root_volume_size | [PRIVATE AGENTS] Root volume size in GB. | string | `120` | no |
| private_agents_root_volume_type | [PRIVATE AGENTS] Root volume type. | string | `gp2` | no |
| public_agents_additional_ports | List of additional ports allowed for public access on public agents. (80 and 443 open by default) | string | `<list>` | no |
| public_agents_associate_public_ip_address | [PUBLIC AGENTS] Associate a public IP address with these instances. | string | `true` | no |
| public_agents_aws_ami | [PUBLIC AGENTS] AMI to be used. | string | `` | no |
| public_agents_instance_type | [PUBLIC AGENTS] Instance type. | string | `m4.xlarge` | no |
| public_agents_os | [PUBLIC AGENTS] Operating system to use. Instead of using your own AMI you could use a provided OS. | string | `` | no |
| public_agents_root_volume_size | [PUBLIC AGENTS] Root volume size. | string | `120` | no |
| public_agents_root_volume_type | [PUBLIC AGENTS] Specify the root volume type. | string | `gp2` | no |
| ssh_public_key | SSH public key in authorized keys format (e.g. 'ssh-rsa ..') to be used with the instances. Make sure you added this key to your ssh-agent. | string | `` | no |
| ssh_public_key_file | Path to SSH public key. This is mandatory but can be set to an empty string if you want to use ssh_public_key with the key as string. | string | - | yes |
| tags | Add custom tags to all resources. | map | `<map>` | no |

## Outputs

| Name | Description |
|------|-------------|
| masters-ips | Master IP addresses. |
| masters-loadbalancer | This is the load balancer address to access the DC/OS UI. |
| public-agents-loadbalancer | This is the load balancer address to access the DC/OS public agents. |
