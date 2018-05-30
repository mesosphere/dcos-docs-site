---
layout: layout.pug
title: AWS Advanced Installation
navigationTitle: AWS Advanced Installation
menuWeight: 10
excerpt:
---
**AWS Advanced Installation** [enterprise type="inline" size="small" /]

The advanced AWS CloudFormation templates bring power and flexibility to creating and extending DC/OS clusters. With these templates you can choose from the complete set of DC/OS configuration options.

 - Instantiate a complete DC/OS cluster on an existing VPC/Subnet combination.
 - Extend and update existing DC/OS clusters by adding more [agent](/1.8/overview/concepts/#agent) nodes.

The templates are used together in conjunction to create a DC/OS cluster. The templates are driven by parameters that AWS CloudFormation uses to create each stack.  

**Warning:** Upgrades are not supported with this installation method.

## Prerequisites

### Hardware

An AWS EC2 <a href="https://aws.amazon.com/ec2/pricing/" target="_blank">m3.xlarge</a> instance. Selecting smaller-sized VMs is not recommended, and selecting fewer VMs will likely cause certain resource-intensive services, such as distributed datastores, to not work properly.

### Software

- The [DC/OS setup file](https://support.mesosphere.com/hc/en-us/articles/213198586-Mesosphere-Enterprise-DC-OS-Downloads). Contact your sales representative or <a href="mailto:sales@mesosphere.com">sales@mesosphere.com</a> for access to this file.
- An Amazon Web Services account with root [IAM](https://aws.amazon.com/iam/) privileges. Advanced privileges are required to install the advanced templates. Contact your AWS admin for more information.
- An AWS EC2 Key Pair for the same region as your cluster. Key pairs cannot be shared across regions. The AWS key pair uses public-key cryptography to provide secure login to your AWS cluster. For more information about creating an AWS EC2 Key Pair, see the <a href="http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html#having-ec2-create-your-key-pair" target="_blank">documentation</a>.
- AWS [Command Line Interface](https://aws.amazon.com/cli/).
- The CLI JSON processor [jq](https://github.com/stedolan/jq/wiki/Installation).
- A node that meets the bootstrap node [system requirements](/1.11/installing-upgrading/custom/system-requirements).
- An AWS S3 bucket with read-write access.
    - The S3 bucket must have a bucket policy that allows the launched AWS instances to download the files from the s3 bucket. Here is a sample policy that allows anyone to download:

      ```json
      {
        "Version":"2012-10-17",
        "Statement":[
          {
            "Sid":"AddPerm",
            "Effect":"Allow",
            "Principal": "*",
            "Action":["s3:GetObject"],
            "Resource":["arn:aws:s3:::<bucket_name>/<bucket_path>/*"]
          }
        ]
      }
      ```
      For more information about s3 bucket polices, see the [AWS Documentation](http://docs.aws.amazon.com/AmazonS3/latest/dev/example-bucket-policies.html).

# Create your templates

1.  Download the [DC/OS setup file](https://support.mesosphere.com/hc/en-us/articles/213198586-Mesosphere-Enterprise-DC-OS-Downloads) to your bootstrap node.
1.  Create a directory named `genconf` in the home directory of your node and navigate to it.

    ```bash
    mkdir -p genconf
    ```
1.  Create a configuration file in the `genconf` directory and save as `config.yaml`. This configuration file specifies your AWS credentials and the S3 location to store the generated artifacts. These are the required parameters:

    ```json
    aws_template_storage_bucket: <your-bucket>
    aws_template_storage_bucket_path: <path-to-directory>
    aws_template_upload: true
    aws_template_storage_access_key_id: <your-access-key-id>
    aws_template_storage_secret_access_key: <your-secret-access_key>
    cluster_name: <cluster-name>
    security: [permissive|strict|disabled]
    superuser_password_hash: <hashed-password>
    superuser_username: <username>
    zk_super_credentials: <userid>:<password>
    zk_master_credentials: <userid>:<password>
    zk_agent_credentials: <userid>:<password>
    ```

    For parameters descriptions and configuration examples, see the [documentation](/1.11/installing-upgrading/custom/configuration/configuration-parameters/).

1.  Run the DC/OS installer script with the AWS argument specified. This command creates and uploads a custom build of the DC/OS artifacts and templates to the specified S3 bucket.

    ```bash
    sudo bash dcos_generate_config.ee.sh --aws-cloudformation
    ```

     The root URL for this bucket location is printed at the end of this step. You should see a message like this:

    ```bash
    AWS CloudFormation templates now available at: https://<amazon-web-endpoint>/<path-to-directory>
    ```
1.  Go to [S3](https://console.aws.amazon.com/s3/home) and navigate to your S3 bucket shown above in `<path-to-directory>`.

    1.  Select **cloudformation** and then select the zen template for the number of desired masters. For example, select **el7-zen-1.json** for a single master configuration.
    1.  Right-click and select **Properties**, and then copy the AWS S3 template URL.
1.  Go to [CloudFormation](https://console.aws.amazon.com/cloudformation/home) and click **Create Stack**.
1.  On the **Select Template** page, specify the AWS S3 template URL path to your Zen template. For example:

    ```
    https://s3-us-west-2.amazonaws.com/user-aws/templates/config_id/14222z9104081387447be59e178438749d154w3g/cloudformation/ee.el7-zen-1.json
    ```

# Create your template dependencies

Use this script to create the template dependencies. These dependencies will be used as input to create your stack in CloudFormation.

1.  Save this script as `zen.sh`                                                                     

    ```bash
    #!/bin/bash
    export AWS_DEFAULT_OUTPUT="json"
    set -o errexit -o nounset -o pipefail

    if [ -z "${1:-}" ]
    then
      echo Usage: $(basename "$0") STACK_NAME
      exit 1
    fi

    STACK_NAME="$1"
    VPC_CIDR=10.0.0.0/16
    PRIVATE_SUBNET_CIDR=10.0.0.0/17
    PUBLIC_SUBNET_CIDR=10.0.128.0/20

    echo "Creating Zen Template Dependencies"

    vpc=$(aws ec2 create-vpc --cidr-block "$VPC_CIDR" --instance-tenancy default | jq -r .Vpc.VpcId)
    aws ec2 wait vpc-available --vpc-ids "$vpc"
    aws ec2 create-tags --resources "$vpc" --tags Key=Name,Value="$STACK_NAME"
    echo "VpcId: $vpc"

    ig=$(aws ec2 create-internet-gateway | jq -r .InternetGateway.InternetGatewayId)
    aws ec2 attach-internet-gateway --internet-gateway-id "$ig" --vpc-id "$vpc"
    aws ec2 create-tags --resources "$ig" --tags Key=Name,Value="$STACK_NAME"
    echo "InternetGatewayId: $ig"

    private_subnet=$(aws ec2 create-subnet --vpc-id "$vpc" --cidr-block "$PRIVATE_SUBNET_CIDR" | jq -r .Subnet.SubnetId)
    aws ec2 wait subnet-available --subnet-ids "$private_subnet"
    aws ec2 create-tags --resources "$private_subnet" --tags Key=Name,Value="${STACK_NAME}-private"
    echo "Private SubnetId: $private_subnet"

    public_subnet=$(aws ec2 create-subnet --vpc-id "$vpc" --cidr-block "$PUBLIC_SUBNET_CIDR" | jq -r .Subnet.SubnetId)
    aws ec2 wait subnet-available --subnet-ids "$public_subnet"
    aws ec2 create-tags --resources "$public_subnet" --tags Key=Name,Value="${STACK_NAME}-public"
    echo "Public SubnetId: $public_subnet"
    ```

1.  Run the `zen.sh` script with an optional tag value for your DC/OS stack specified (`STACK_NAME`), or use the default `dcos`. This value will be used to tag your DC/OS cluster in AWS.  

    ```bash
    bash ./zen.sh <STACK_NAME>
    ```

    The output should look like this:

    ```bash
    Creating Zen Template Dependencies
    VpcId: vpc-e0bd2c84
    InternetGatewayID: igw-38071a5d
    Private SubnetId: subnet-b32c82c5
    Public SubnetId: subnet-b02c55c4
    ```

    Use these dependency values as input to create your stack in CloudFormation in the next steps.

# <a name="launch"></a>Launch the templates on CloudFormation

1.  Go to [CloudFormation](https://console.aws.amazon.com/cloudformation/home) and click **Create Stack**.
1.  On the **Select Template** page, upload the [Zen](/1.11/installing-upgrading/cloud/aws/advanced/template-reference/#zen) template (e.g. `https://s3-us-west-2.amazonaws.com/dcos/templates/dcos/config_id/6a7451f6dec/cloudformation/ee.el7-zen-1.json`) from your workstation and click **Next**.
1.  On the **Specify Details** page, specify these values and and click **Next**.

    ![AWS UI](/1.11/img/aws-advanced-1.png)

    *  **Stack name** Specify the cluster name.
    *  **CustomAMI** Optional: Specify the AMI ID. For more information, see [Installing Using a Custom AMI](/1.11/installing-upgrading/cloud/aws/advanced/aws-ami/).
    *  **InternetGateway** Specify the `InternetGatewayID` output value from the `zen.sh` script. The Internet Gateway ID must be attached to the VPC. This Internet Gateway will be used by all nodes for outgoing internet access.
    *  **KeyName** Specify your AWS EC2 Key Pair.
    *  **MasterInstanceType** Specify the AWS EC2 instance type. The <a href="https://aws.amazon.com/ec2/pricing/" target="_blank">m3.xlarge</a> instance type is recommended.
    *  **PrivateAgentInstanceCount** Specify the number of private agents.
    *  **PrivateAgentInstanceType** Specify the AWS EC2 instance type for the private agent nodes. The <a href="https://aws.amazon.com/ec2/pricing/" target="_blank">m3.xlarge</a> instance type is recommended.
    *  **PrivateSubnet** Specify the `Private SubnetId` output value from the `zen.sh` script. This subnet ID will be used by all private agents.
    *  **PublicAgentInstanceCount** Specify the number of public agents.
    *  **PublicAgentInstanceType** Specify the AWS EC2 instance type for the public agent nodes. The <a href="https://aws.amazon.com/ec2/pricing/" target="_blank">m3.xlarge</a> instance type is recommended.
    *  **PublicSubnet** Specify the `Public SubnetId` output value from the `zen.sh` script. This subnet ID will be used by all public agents.
    *  **Vpc** Specify the `VpcId` output value from the `zen.sh` script. All nodes will be launched by using subnets and Internet Gateway under this VPC.

1.  On the **Options** page, accept the defaults and click **Next**.

    **Tip:** You can choose whether to rollback on failure. By default this option is set to **Yes**.

1.  On the **Review** page, check the acknowledgement box and then click **Create**.

    **Tip:** If the **Create New Stack** page is shown, either AWS is still processing your request or you’re looking at a different region. Navigate to the correct region and refresh the page to see your stack.

# Monitor the DC/OS cluster convergence process

In CloudFormation you should see:

*  The cluster stack spins up over a period of 15 to 20 minutes. You will have a stack created for each of these, where `<stack-name>` is the value you specified for **Stack name** and `<stack-id>` is an auto-generated ID.

   ![AWS UI](/1.11/img/aws-advanced-2.png)

   *  Zen template: `<stack-name>`
   *  Public agents: `<stack-name>-PublicAgentStack-<stack-id>`
   *  Private agents: `<stack-name>-PrivateAgentStack-<stack-id>`
   *  Masters: `<stack-name>-MasterStack-<stack-id>`
   *  Infrastructure: `<stack-name>-Infrastructure-<stack-id>`

* The status changes from `CREATE_IN_PROGRESS` to `CREATE_COMPLETE`.

**Troubleshooting:** A `ROLLBACK_COMPLETE` status means the deployment has failed. See the **Events** tab for useful information about failures.

# Launch DC/OS

Launch the DC/OS web interface by entering the master hostname:

1.  From the <a href="https://console.aws.amazon.com/cloudformation/home" target="_blank">AWS CloudFormation Management</a> page, click to check the box next to your stack.

1.  Click on the **Outputs** tab and copy/paste the Mesos Master hostname into your browser to open the DC/OS web interface. The interface runs on the standard HTTP port 80, so you do not need to specify a port number after the hostname.

    **Tip:** You might need to resize your window to see this tab. You can find your DC/OS hostname any time from the <a href="https://console.aws.amazon.com/cloudformation/home" target="_blank">AWS CloudFormation Management</a> page.

    ![Monitor stack creation](/1.11/img/dcos-aws-step3a.png)

1.  Click **Log In To DC/OS**.

    **Important:** After clicking **Log In To DC/OS**, your browser may show a warning that your connection is not secure. This is because DC/OS uses self-signed certificates. You can ignore this error and click to proceed.

    ![UI installer success](/1.11/img/gui-installer-success-ee.gif)

1.  Enter the username and password of the superuser account.

    **Tip:** The default username is `bootstrapuser` and default password is `deleteme`.

    ![alt text](/1.11/img/ui-installer-auth2.png)

    You are done!

    ![UI dashboard](/1.11/img/dashboard-ee.png)

# Next steps

Now that your advanced template DC/OS installation is up and running you can add more agent nodes.

### Add more agent nodes

You can add more agent nodes by creating a new stack by using the [advanced-priv-agent.json](/1.11/installing-upgrading/cloud/aws/advanced/template-reference/#private-agent) or [advanced-pub-agent.json](/1.11/installing-upgrading/cloud/aws/advanced/template-reference/#public-agent) templates. These templates create agents which are then attached to the `PrivateAgentStack` or `PublicAgentStack` as a part of an AutoScalingGroup.

Use the output values from the `zen.sh` script and your Master and Infra stacks. These new agent nodes will automatically be added to your DC/OS cluster.

Private agents:

*  **InternalMasterLoadBalancerDnsName** Specify the `InternalMasterLoadBalancerDnsName` value from your master stack (`<stack-name>-MasterStack-<stack-id>`). You can find this value in the **Outputs** tab.
*  **KeyName** Specify your AWS EC2 Key Pair.
*  **PrivateAgentInstanceCount** Specify the number of private agents.
*  **PrivateAgentInstanceType** Specify the AWS EC2 instance type for the private agent nodes. The <a href="https://aws.amazon.com/ec2/pricing/" target="_blank">m3.xlarge</a> instance type is recommended.
*  **PrivateAgentSecurityGroup** Specify the security group ID for private agents. This group should have limited external access. You can find this value in the **Outputs** tab of the Infrastructure stack (`<stack-name>-Infrastructure-<stack-id>`).
*  **PrivateSubnet** Specify the `Private SubnetId` output value from the `zen.sh` script. This subnet ID will be used by all private agents.

Public agents:

*  **InternalMasterLoadBalancerDnsName** Specify the `InternalMasterLoadBalancerDnsName` value from your master stack (`<stack-name>-MasterStack-<stack-id>`). You can find this value in the **Outputs** tab.
*  **KeyName** Specify your AWS EC2 Key Pair.
*  **PublicAgentInstanceCount** Specify the number of public agents.
*  **PublicAgentInstanceType** Specify the AWS EC2 instance type for the public agent nodes. The <a href="https://aws.amazon.com/ec2/pricing/" target="_blank">m3.xlarge</a> instance type is recommended.
*  **PublicAgentSecurityGroup** Specify the security group ID for public agents. This group should have limited external access. You can find this value in the **Outputs** tab of the Infrastructure stack (`<stack-name>-Infrastructure-<stack-id>`).
*  **PublicSubnet** Specify the `Public SubnetId` output value from the `zen.sh` script. This subnet ID will be used by all public agents.

For all of the advanced configuration options, see the template reference [documentation](/1.11/installing-upgrading/cloud/aws/advanced/template-reference/).


# Limitations

- Modified templates are not supported for upgrades.
- Adding agents and task isolation is not supported.
- You cannot expand master node size.
- You must be in flat network space (this is controlled by our infrastructure template). If you can't use our infrastructure template, you can hack our template at your own risk. We may change the infrastructure template and you will have to support these changes downstream.


# Template reference
For the complete advanced configuration options, see the template reference [documentation](/1.11/installing-upgrading/cloud/aws/advanced/template-reference/).

**AWS Advanced Installation** [open source type="inline" size="small" /]

With this installation method, you package the DC/OS distribution yourself and connect to every node manually to run the DC/OS installation commands. This installation method is recommended if you want to integrate with an existing system or if you don’t have SSH access to your cluster.

The advanced installer requires:

*   The bootstrap node must be network accessible from the cluster nodes.
*   The bootstrap node must have the HTTP(S) ports open from the cluster nodes.

The DC/OS installation creates these folders:

<table class="table">
  <tr>
    <th>Folder</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><code>/opt/mesosphere</code></td>
    <td>Contains all the DC/OS binaries, libraries, cluster configuration. Do not modify.</td>
  </tr>
  <tr>
    <td><code>/etc/systemd/system/dcos.target.wants</code></td>
    <td>Contains the systemd services which start the things that make up systemd. They must live outside of <code>/opt/mesosphere</code> because of systemd constraints.</td>
  </tr>
  <tr>
    <td><code>/etc/systemd/system/dcos.&lt;units&gt;</code></td>
    <td>Contains copies of the units in <code>/etc/systemd/system/dcos.target.wants</code>. They must be at the top folder as well as inside <code>dcos.target.wants</code>.</td>
  </tr>
  <tr>
    <td><code>/var/lib/dcos/exhibitor/zookeeper</code></td>
    <td>Contains the <a href="/1.11/overview/concepts/#mesos-exhibitor-zookeeper">ZooKeeper</a> data.</td>
  </tr>
  <tr>
    <td><code>/var/lib/docker</code></td>
    <td>Contains the Docker data. </td>
  </tr>
  <tr>
    <td><code>/var/lib/dcos</code></td>
    <td>Contains the DC/OS and Mesos Master data.</td>
  </tr>
  <tr>
    <td><code>/var/lib/mesos</code></td>
    <td>Contains the Mesos Agent data.</td>
  </tr>
</table>

**Important:** Changes to `/opt/mesosphere` are unsupported. They can lead to unpredictable behavior in DC/OS and prevent upgrades.

# Prerequisites
Your cluster must meet the software and hardware [requirements](/1.11/installing-upgrading/custom/system-requirements/).

## Configure your cluster

1.  Create a directory named `genconf` on your bootstrap node and navigate to it.

    ```bash
    mkdir -p genconf
    ```

1.  Create a configuration file and save as `genconf/config.yaml`.

    In this step you create a YAML configuration file that is customized for your environment. DC/OS uses this configuration file during installation to generate your cluster installation files.

    You can use this template to get started. This template specifies three Mesos masters, three ZooKeeper instances for Exhibitor storage, static master discovery list, internal storage backend for Exhibitor, a custom proxy, and Google DNS resolvers. If your servers are installed with a domain name in your `/etc/resolv.conf`, you should add `dns_search` to your `config.yaml` file. For parameters descriptions and configuration examples, see the [documentation][1].

    **Tips:**

    - If Google DNS is not available in your country, you can replace the Google DNS servers `8.8.8.8` and `8.8.4.4` with your local DNS servers.
    - If you specify `master_discovery: static`, you must also create a script to map internal IPs to public IPs on your bootstrap node (e.g., `/genconf/ip-detect-public`). This script is then referenced in `ip_detect_public_filename: <path-to-ip-script>`.

    ```yaml
    ---
    bootstrap_url: http://<bootstrap_ip>:<your_port>
    cluster_name: <cluster-name>
    exhibitor_storage_backend: static
    master_discovery: static
    ip_detect_public_filename: <path-to-ip-script>
    master_list:
    - <master-private-ip-1>
    - <master-private-ip-2>
    - <master-private-ip-3>
    resolvers:
    - 8.8.4.4
    - 8.8.8.8
    use_proxy: 'true'
    http_proxy: http://<proxy_host>:<http_proxy_port>
    https_proxy: https://<proxy_host>:<https_proxy_port>
    no_proxy:
    - 'foo.bar.com'
    - '.baz.com'
    ```

<a id="ip-detect-script"></a>
2.  Create an `ip-detect` script.

    In this step, an IP detect script is created. This script reports the IP address of each node across the cluster. Each node in a DC/OS cluster has a unique IP address that is used to communicate between nodes in the cluster. The IP detect script prints the unique IPv4 address of a node to STDOUT each time DC/OS is started on the node.

    **Important:**

    - The IP address of a node must not change after DC/OS is installed on the node. For example, the IP address should not change when a node is rebooted or if the DHCP lease is renewed. If the IP address of a node does change, the node must be [wiped and reinstalled](/1.11/installing-upgrading/custom/uninstall/).
    - The script must return the same IP address as specified in the `config.yaml`. For example, if the private master IP is specified as `10.2.30.4` in the `config.yaml`, your script should return this same value when run on the master.

    Create an IP detect script for your environment and save as `genconf/ip-detect`. This script must be `UTF-8` encoded and have a valid [shebang](https://en.wikipedia.org/wiki/Shebang_%28Unix%29) line. You can use the examples below.

    *   #### Use the AWS Metadata Server

        This method uses the AWS Metadata service to get the IP address:

        ```bash
        #!/bin/sh
        # Example ip-detect script using an external authority
        # Uses the AWS Metadata Service to get the node's internal
        # ipv4 address
        curl -fsSL http://169.254.169.254/latest/meta-data/local-ipv4
        ```

    *   #### Use the GCE Metadata Server

        This method uses the GCE Metadata Server to get the IP address:

        ```bash
        #!/bin/sh
        # Example ip-detect script using an external authority
        # Uses the GCE metadata server to get the node's internal
        # ipv4 address

        curl -fsSL -H "Metadata-Flavor: Google" http://169.254.169.254/computeMetadata/v1/instance/network-interfaces/0/ip
        ```

    *   #### Use the IP address of an existing interface

        This method discovers the IP address of a particular interface of the node.

        If you have multiple generations of hardware with different internals, the interface names can change between hosts. The IP detect script must account for the interface name changes. The example script could also be confused if you attach multiple IP addresses to a single interface, or do complex Linux networking, etc.

        ```bash
        #!/usr/bin/env bash
        set -o nounset -o errexit
        export PATH=/usr/sbin:/usr/bin:$PATH
        echo $(ip addr show eth0 | grep -Eo '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}' | head -1)
        ```

    *   #### Use the network route to the Mesos master

        This method uses the route to a Mesos master to find the source IP address to then communicate with that node.

        In this example, we assume that the Mesos master has an IP address of `172.28.128.3`. You can use any language for this script. Your Shebang line must be pointed at the correct environment for the language used and the output must be the correct IP address.

        ```bash
        #!/usr/bin/env bash
        set -o nounset -o errexit -o pipefail
        export PATH=/sbin:/usr/sbin:/bin:/usr/bin:$PATH
        MASTER_IP=$(dig +short master.mesos || true)
        MASTER_IP=${MASTER_IP:-172.28.128.3}
        INTERFACE_IP=$(ip r g ${MASTER_IP} | \
        awk -v master_ip=${MASTER_IP} '
        BEGIN { ec = 1 }
        {
          if($1 == master_ip) {
            print $7
            ec = 0
          } else if($1 == "local") {
            print $6
            ec = 0
          }
          if (ec == 0) exit;
        }
        END { exit ec }
        ')
        echo $INTERFACE_IP
        ```

# Install DC/OS

In this step you create a custom DC/OS build file on your bootstrap node and then install DC/OS onto your cluster. With this method you package the DC/OS distribution yourself and connect to every server manually and run the commands.

**Important:**
- Do not install DC/OS until you have these items working: ip-detect script, DNS, and NTP everywhere. For help with troubleshooting, see the [documentation](/1.11/installing-upgrading/troubleshooting/).
- If something goes wrong and you want to rerun your setup, use these cluster [cleanup instructions][8].

**Prerequisites**

*   A `genconf/config.yaml` file that is optimized for manual distribution of DC/OS across your nodes.
*   A `genconf/ip-detect` script that matches your environment.

To install DC/OS:

1.  Download the [DC/OS installer][4].

    ```bash
    curl -O https://downloads.dcos.io/dcos/stable/dcos_generate_config.sh
    ```

1.  From the bootstrap node, run the DC/OS installer shell script to generate a customized DC/OS build file. The setup script extracts a Docker container that uses the generic DC/OS install files to create customized DC/OS build files for your cluster. The build files are output to `./genconf/serve/`.

    **Tip:** You can view all of the automated command line installer options with the `dcos_generate_config.sh --help` flag.

    ```bash
    sudo bash dcos_generate_config.sh
    ```

    At this point your directory structure should resemble:

        ├── dcos-genconf.<HASH>.tar
        ├── dcos_generate_config.sh
        ├── genconf
        │   ├── config.yaml
        │   ├── ip-detect


    **Tip:** For the install script to work, you must have created `genconf/config.yaml` and `genconf/ip-detect`.

1.  <a name="nginx"></a>From your home directory, run this command to host the DC/OS install package through an NGINX Docker container. For `<your-port>`, specify the port value that is used in the `bootstrap_url`.

    ```bash
    sudo docker run -d -p <your-port>:80 -v $PWD/genconf/serve:/usr/share/nginx/html:ro nginx
    ```

1.  Run these commands on each of your master nodes in succession to install DC/OS using your custom build file.

    **Tip:** Although there is no actual harm to your cluster, DC/OS may issue error messages until all of your master nodes are configured.

    1.  SSH to your master nodes:

        ```bash
        ssh <master-ip>
        ```

    2.  Make a new directory and navigate to it:

        ```bash
        mkdir /tmp/dcos && cd /tmp/dcos
        ```

    3.  Download the DC/OS installer from the NGINX Docker container, where `<bootstrap-ip>` and `<your_port>` are specified in `bootstrap_url`:

        ```bash
        curl -O http://<bootstrap-ip>:<your_port>/dcos_install.sh
        ```

    4.  Run this command to install DC/OS on your master nodes:

        ```bash
        sudo bash dcos_install.sh master
        ```

1.  Run these commands on each of your agent nodes to install DC/OS using your custom build file.

    1.  SSH to your agent nodes:

        ```bash
        ssh <agent-ip>
        ```

    2.  Make a new directory and navigate to it:

        ```bash
        mkdir /tmp/dcos && cd /tmp/dcos
        ```

    3.  Download the DC/OS installer from the NGINX Docker container, where `<bootstrap-ip>` and `<your_port>` are specified in `bootstrap_url`:

        ```bash
        curl -O http://<bootstrap-ip>:<your_port>/dcos_install.sh
        ```

    4.  Run this command to install DC/OS on your agent nodes. You must designate your agent nodes as [public][6] or [private][7].

        *  Private agent nodes:

            ```bash
            sudo bash dcos_install.sh slave
            ```

        *  Public agent nodes:

           ```bash
           sudo bash dcos_install.sh slave_public
           ```

1.  Monitor Exhibitor and wait for it to converge at `http://<master-ip>:8181/exhibitor/v1/ui/index.html`.

    __Tip:__ If you encounter errors such as `Time is marked as bad`, `adjtimex`, or `Time not in sync` in journald, verify that Network Time Protocol (NTP) is enabled on all nodes. For more information, see the [system requirements](/1.11/installing-upgrading/custom/system-requirements/#port-and-protocol-configuration).

    ![alt text](/1.11/img/chef-zk-status.png)

    When the status icons are green, you can access the DC/OS web interface.

1.  Launch the DC/OS web interface at: `http://<master-node-public-ip>/`. If this doesn't work, take a look at the [troubleshooting docs][9]

    ![DC/OS dashboard](/1.11/img/dcos-gui.png)

### Next Steps

- [Add users to your cluster][10]
- [Install the DC/OS Command-Line Interface (CLI)][2]
- [Troubleshooting DC/OS installation][9]
- [Uninstalling DC/OS][8]

[1]: /1.11/installing-upgrading/custom/configuration/configuration-parameters/
[2]: /1.11/cli/install/
[4]: https://downloads.dcos.io/dcos/stable/dcos_generate_config.sh
[6]: /1.11/overview/concepts/#public-agent-node/
[7]: /1.11/overview/concepts/#private-agent-node/
[8]: /1.11/installing-upgrading/custom/uninstall/
[9]: /1.11/installing-upgrading/troubleshooting/
[10]: /1.11/security/ent/users-groups/

