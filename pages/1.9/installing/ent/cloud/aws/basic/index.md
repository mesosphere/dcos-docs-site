---
layout: layout.pug
title: Running DC/OS on AWS EC2 Basic
menuWeight: 100
excerpt:

enterprise: true
---

You can create a DC/OS cluster for Amazon Web Services (AWS) by using the DC/OS templates on AWS CloudFormation.

These instructions provide a basic AWS CloudFormation template that creates a DC/OS cluster that is suitable for demonstrations and POCs. This is the fastest way to get started with the DC/OS templates for AWS CloudFormation.

For a complete set of DC/OS configuration options, see the [Advanced AWS Install Guide](/1.9/installing/ent/cloud/aws/advanced/).

**Important:** Upgrades are not supported with this installation method.

# System requirements

## Hardware

An AWS EC2 <a href="https://aws.amazon.com/ec2/pricing/" target="_blank">m3.xlarge</a> instance.  Selecting smaller-sized VMs is not recommended, and selecting fewer VMs will likely cause certain resource-intensive services, such as distributed datastores, to not work properly.

*   You have the option of 1 or 3 Mesos master nodes.
*   5 [private](/1.9/overview/concepts/#private-agent-node) Mesos agent nodes is the default.
*   1 [public](/1.9/overview/concepts/#public-agent-node) Mesos agent node is the default.

## Software

- DC/OS Enterprise AWS templates. Contact your sales representative or <a href="mailto:sales@mesosphere.com">sales@mesosphere.com</a> to obtain these files.
- An AWS account.
- An AWS EC2 key pair for the same region as your cluster. Key pairs cannot be shared across regions. The AWS key pair uses public-key cryptography to provide secure login to your AWS cluster. For more information about creating an AWS EC2 key pair, see the <a href="http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html#having-ec2-create-your-key-pair" target="_blank">documentation</a>.
- SSH installed and configured. This is required for accessing nodes in the DC/OS cluster.

# Create DC/OS cluster stack

1.  Launch <a href="https://console.aws.amazon.com/cloudformation/home" target="_blank">AWS CloudFormation</a>.

1.  Click **Create Stack**.

1.  On the **Select Template** page, in the Choose a template field, click the **Specify an Amazon S3 template URL** radio button and paste in the template URL you received from sales. 

  **Important:** Do not click the **View/Edit template in Designer** link and edit the template. The DC/OS template is configured for running DC/OS. If you modify the template you might be unable to run certain packages on your DC/OS cluster.

    ![Launch stack](/1.9/img/dcos-aws-step2b.png)
    
2.  Click **Next**.

3.  On the **Specify Details** page, specify a cluster name (`Stack name`), key pair (`KeyName`), public agent (`PublicSlaveInstanceCount`), private agent (`SlaveInstanceCount`), and click **Next**. Depending on the DC/OS services that you install, you might need to change the number of agent nodes after cluster creation. For more information, see [Scaling the DC/OS cluster in AWS][1].

    ![Create stack](/1.9/img/dcos-aws-step2c-ee.png)

4.  On the **Options** page, accept the defaults and click **Next**.

    **Tip:** In the Advanced section you can choose whether to rollback on failure. By default this option is set to **Yes**.

5.  On the **Review** page, check the acknowledgement box and then click **Create**.

    **Tip:** If the **Create New Stack** page is shown, either AWS is still processing your request or you’re looking at a different region. Navigate to the correct region and refresh the page to see your stack.


# Monitor cluster stack launch

In <a href="https://console.aws.amazon.com/cloudformation/home" target="_blank">AWS CloudFormation</a> you should see:

*   The cluster stack spins up over a period of 10 to 15 minutes.
*   The status changes from CREATE_IN_PROGRESS to CREATE_COMPLETE.

**Troubleshooting:** A ROLLBACK_COMPLETE status means the deployment has failed. See the **Events** tab for useful information about failures.

# <a name="launchdcos"></a>Open and log into the DC/OS GUI

1.  In AWS CloudFormation, check the box next to your stack.

1.  Click the **Outputs** tab and copy the Mesos Master hostname.

    ![Monitor stack creation](/1.9/img/dcos-stack.png)

1.  Paste the hostname into your browser to open the DC/OS web interface. The interface runs on the standard HTTP port 80, so you do not need to specify a port number after the hostname.  Your browser may show a warning that your connection is not secure. This is because DC/OS uses self-signed certificates. You can ignore this error and click to proceed to the login screen.

    ![DC/OS GUI auth](/1.9/img/dc-os-gui-login-ee.png)

1.  Enter the username and password of the superuser account. The default username is `bootstrapuser` and default password is `deleteme`. Click **LOG IN**.

# Install the DC/OS CLI

You must install the [DC/OS Command-Line Interface (CLI)][2] to administer your DCOS cluster.

1.  Click the dropdown menu on the upper-left of the DC/OS GUI and select **Install CLI**.

1.  Copy the code snippet and run in a terminal. Provide the sudo password, accept the fingerprint of the cluster certificate, and provide the superuser name and password to authenticate the CLI. 

[1]: /1.9/administering-clusters/managing-aws/
[2]: /1.9/cli/install/
[10]: /1.9/security/
