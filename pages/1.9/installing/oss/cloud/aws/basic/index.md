---
layout: layout.pug
excerpt:
title: Running DC/OS on AWS EC2 Basic
navigationTitle: AWS EC2 Basic
menuWeight: 0
---

You can create a DC/OS cluster for Amazon Web Services (AWS) using the <a href="https://downloads.dcos.io/dcos/stable/1.9.6/aws.html" target="_blank">DC/OS templates for AWS CloudFormation</a>.

These instructions provide a basic AWS CloudFormation template that creates a DC/OS cluster that is suitable for demonstrations and POCs. This is the fastest way to get started with the DC/OS templates for AWS CloudFormation.

For a complete set of DC/OS configuration options, see the [Advanced AWS Install Guide](/1.9/installing/oss/cloud/aws/advanced/).

**Important:** Upgrades are not supported with this installation method.

# System requirements

## Hardware

An AWS EC2 <a href="https://aws.amazon.com/ec2/pricing/" target="_blank">m3.xlarge</a> instance.  Selecting smaller-sized VMs is not recommended, and selecting fewer VMs will likely cause certain resource-intensive services, such as distributed datastores, to not work properly.

*   You have the option of 1 or 3 Mesos master nodes.
*   5 [private](/1.9/overview/concepts/#private-agent-node) Mesos agent nodes is the template default.
*   1 [public](/1.9/overview/concepts/#public-agent-node) Mesos agent node is the template default. By default, ports are closed and health checks are configured for [Marathon-LB](/services/marathon-lb/1.12/). Ports 80 and 443 are configured for the AWS Elastic Load Balancer.

## Software

- An AWS account.
- SSH installed and configured. This is required for accessing nodes in the DC/OS cluster.

# Install DC/OS

Depending on the DC/OS services that you install, you might have to modify the DC/OS templates to suit your needs. For more information, see [Scaling the DC/OS cluster in AWS][1].

**Prerequisite:**
You must have an AWS EC2 key pair for the same region as your cluster. Key pairs cannot be shared across regions. The AWS key pair uses public-key cryptography to provide secure login to your AWS cluster. For more information about creating an AWS EC2 key pair, see the <a href="http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html#having-ec2-create-your-key-pair" target="_blank">documentation</a>.

1.  Launch the <a href="https://downloads.dcos.io/dcos/EarlyAccess/aws.html" target="_blank">DC/OS template</a> on CloudFormation and select the region and number of masters (1 or 3). You must have a key pair for your selected region.

2.  On the **Select Template** page, accept the defaults and click **Next**.

    ![Launch stack](/1.9/img/dcos-aws-step2b.png)

3.  On the **Specify Details** page, specify a cluster name (`Stack name`), key pair (`KeyName`), whether to enable OAuth authentication (`OAuthEnabled`), number of public agent nodes (`PublicSlaveInstanceCount`), number of private agent nodes (`SlaveInstanceCount`), and click **Next**.

    **Important:** The DC/OS template is configured for running DC/OS. If you modify the template you might be unable to run certain packages on your DC/OS cluster.

    ![Create stack](/1.9/img/dcos-aws-step2c.png)

4.  On the **Options** page, accept the defaults and click **Next**.

    **Tip:** You can choose whether to rollback on failure. By default this option is set to **Yes**.

5.  On the **Review** page, check the acknowledgement box and then click **Create**.

    **Tip:** If the **Create New Stack** page is shown, either AWS is still processing your request or you’re looking at a different region. Navigate to the correct region and refresh the page to see your stack.


# Monitor the DC/OS cluster convergence process

In <a href="https://console.aws.amazon.com/cloudformation/home" target="_blank">CloudFormation</a> you should see:

*   The cluster stack spins up over a period of 10 to 15 minutes.

*   The status changes from CREATE_IN_PROGRESS to CREATE_COMPLETE.

**Troubleshooting:** A ROLLBACK_COMPLETE status means the deployment has failed. See the **Events** tab for useful information about failures.

# <a name="launchdcos"></a>Launch DC/OS

Launch the DC/OS web interface by entering the Mesos Master hostname:

1.  From the <a href="https://console.aws.amazon.com/cloudformation/home" target="_blank">AWS CloudFormation Management</a> page, click to check the box next to your stack.

2.  Click on the **Outputs** tab and copy/paste the Mesos Master hostname into your browser to open the DC/OS web interface. The interface runs on the standard HTTP port 80, so you do not need to specify a port number after the hostname.

    **Tip:** You might need to resize your window to see this tab. You can find your DC/OS hostname any time from the <a href="https://console.aws.amazon.com/cloudformation/home" target="_blank">AWS CloudFormation Management</a> page.

    ![Monitor stack creation](/1.9/img/dcos-aws-step3a.png)

    ![DC/OS dashboard](/1.9/img/dcos-gui.png)

1.  Click the dropdown menu on the upper-left side to install the DC/OS [Command-Line Interface (CLI)][2]. You must install the CLI to administer your DC/OS cluster.

    ![install CLI](/1.9/img/install-cli-terminal.png)


# Next steps

- [Add users to your cluster][10]
- [Scaling considerations][4]

 [1]: /1.9/administering-clusters/managing-aws/
 [2]: /1.9/cli/install/
 [4]: https://aws.amazon.com/autoscaling/
 [10]: /1.9/security/ent/users-groups/
