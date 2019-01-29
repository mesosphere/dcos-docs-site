---
layout: layout.pug
title: Basic 
navigationTitle: Basic
menuWeight: 5
excerpt: Creating a DC/OS cluster using DC/OS templates
---

You can create a DC/OS cluster for Amazon Web Services (AWS) by using the DC/OS templates on AWS CloudFormation.

The basic templates provide:
- Limited customization options
- Fastest deployment and minimal setup required
- Great for simple production deployments, demos, and testing

These instructions provide a basic AWS CloudFormation template that creates a DC/OS cluster that is suitable for demonstrations and POCs. This is the fastest way to get started with the DC/OS templates for AWS CloudFormation.

For a complete set of DC/OS configuration options, see the [Advanced AWS Install Guide](/1.11/installing/evaluation/aws/aws-advanced/).

<table class=“table” bgcolor=#858585>
<tr> 
  <td align=justify style=color:white><strong>Important:</strong> Upgrades are not supported with this installation method.</td> 
</tr> 
</table>

# System requirements

## Hardware

An AWS EC2 <a href="https://aws.amazon.com/ec2/pricing/" target="_blank">m3.xlarge</a> instance.  Selecting smaller-sized VMs is not recommended, and selecting fewer VMs will likely cause certain resource-intensive services, such as distributed datastores, to not work properly.

*   You have the option of one or three Mesos master nodes.
*   The default is five [private](/1.11/overview/concepts/#private-agent-node) Mesos agent nodes.
*   The default is one [public](/1.11/overview/concepts/#public-agent-node) Mesos agent node. By default, ports are closed and health checks are configured for Marathon-LB. Ports 80 and 443 are configured for the AWS Elastic Load Balancer.

## Software

- DC/OS AWS templates:
  * Contact your sales representative or <a href="mailto:sales@mesosphere.com">sales@mesosphere.com</a> to obtain these files. [enterprise type="inline" size="small" /]
  * The most recent DC/OS open source AWS templates can be downloaded from [downloads.dcos.io](https://downloads.dcos.io/dcos/stable/aws.html), and older versions can be downloaded from [dcos.io/releases](https://dcos.io/releases/). [oss type="inline" size="small" /]

- An AWS account.
- An AWS EC2 key pair for the same region as your cluster. Key pairs cannot be shared across regions. The AWS key pair uses public-key cryptography to provide a secure login to your AWS cluster. For more information about creating an AWS EC2 key pair, see the <a href="http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html#having-ec2-create-your-key-pair" target="_blank">documentation</a>.
- SSH installed and configured. This is required to access nodes in the DC/OS cluster.


# Create DC/OS cluster stack 

[enterprise]
## Enterprise users 
[/enterprise]

1.  Launch <a href="https://console.aws.amazon.com/cloudformation/home" target="_blank">AWS CloudFormation</a>.

2.  Click **Create Stack**.

3.  On the **Select Template** page, in the **Choose a template** field, click the **Specify an Amazon S3 template URL** radio button and paste in the template URL you received from Sales.

<table class=“table” bgcolor=#ffd000>
<tr> 
  <td align=justify style=color:black><strong>Warning:</strong> Do not click the <strong>View/Edit template in Designer</strong> link and edit the template. The DC/OS template is configured for running DC/OS. If you modify the template you might be unable to run certain packages on your DC/OS cluster.</td> 
</tr> 
</table>

   ![Launch stack](/1.11/img/dcos-aws-step2b.png)

   Figure 1. Launch stack

4.  Click **Next**.

5.  On the **Specify Details** page, specify a cluster name (`Stack name`), key pair (`KeyName`), public agent (`PublicSlaveInstanceCount`), and private agent (`SlaveInstanceCount`). Click **Next**. Depending on the DC/OS services that you install, you might need to change the number of agent nodes after cluster creation. For more information, see [Scaling the DC/OS cluster in AWS][1]. 

6. Skip the Open Source users section and go to Step 6. 

![Create stack](/1.11/img/dcos-aws-step2c-ee.png)

Figure 2. Create stack

[oss]
## Open Source users 
[/oss]

1.  Launch the <a href="https://downloads.dcos.io/dcos/EarlyAccess/aws.html" target="_blank">DC/OS template</a> on CloudFormation and select the region and number of masters (one or three). You must have a key pair for your selected region.

2.  On the **Select Template** page, accept the defaults and click **Next**.

   ![Launch stack](/1.11/img/dcos-aws-step2b.png)

   Figure 3. Launch stack

3.  On the **Specify Details** page, specify a cluster name (`Stack name`), key pair (`KeyName`), whether to enable OAuth authentication (`OAuthEnabled`), number of public agent nodes (`PublicSlaveInstanceCount`), number of private agent nodes (`SlaveInstanceCount`), and click **Next**. 

<table class=“table” bgcolor=#ffd000>
<tr> 
  <td align=justify style=color:black><strong>Warning:</strong> Do not click the <strong>View/Edit template in Designer</strong> link and edit the template. The DC/OS template is configured for running DC/OS. If you modify the template you might be unable to run certain packages on your DC/OS cluster.</td> 
</tr> 
</table>


4. Go to Step 6 in the "All users" section.

![Create stack](/1.11/img/dcos-aws-step2c.png)

Figure 4. Create stack

## All users
6.  On the **Options** page, accept the defaults and click **Next**. In the Advanced section you can choose whether to rollback on failure. By default this option is set to **Yes**.

7.  On the **Review** page, check the acknowledgement box and then click **Create**. If the **Create New Stack** page is shown, either AWS is still processing your request or you’re looking at a different region. Navigate to the correct region and refresh the page to see your stack.

# Monitor cluster stack launch

In <a href="https://console.aws.amazon.com/cloudformation/home" target="_blank">AWS CloudFormation</a> you should see the following:

*   The cluster stack spins up over a period of 10 to 15 minutes.
*   The status changes from CREATE_IN_PROGRESS to CREATE_COMPLETE.

**Troubleshooting:** A ROLLBACK_COMPLETE status means the deployment has failed. See the **Events** tab for useful information about failures.
<table class=“table” bgcolor=#858585>
<tr> 
  <td align=justify style=color:white><strong>Important:</strong> A ROLLBACK_COMPLETE status means the deployment has failed. See the <strong>Events</strong> tab for useful information about failures.</td> 
</tr> 
</table>

# <a name="launchdcos"></a>Open and log into the DC/OS GUI

1.  In AWS CloudFormation, check the box next to your stack.

2.  Click the **Outputs** tab and copy the Mesos Master hostname.

   ![Monitor stack creation](/1.11/img/dcos-stack.png)

   Figure 5. Monitor stack creation

3.  Paste the hostname into your browser to open the DC/OS web interface. The interface runs on the standard HTTP port 80, so you do not need to specify a port number after the hostname.  Your browser may show a warning that your connection is not secure. This is because DC/OS uses self-signed certificates. You can ignore this error and click to proceed to the login screen.

   ![DC/OS GUI auth](/1.11/img/dc-os-gui-login-ee.png)

   Figure 6. DC/OS web interface login screen

   **Note:** You might need to resize your window to see this tab. You can find your DC/OS hostname any time from the [AWS CloudFormation Management](https://signin.aws.amazon.com/signin?redirect_uri=https%3A%2F%2Fconsole.aws.amazon.com%2Fcloudformation%2Fhome%3Fstate%3DhashArgs%2523%26isauthcode%3Dtrue&client_id=arn%3Aaws%3Aiam%3A%3A015428540659%3Auser%2Fcloudformation&forceMobileApp=0) page.

4.  Enter the username and password of the superuser account. The default username is `bootstrapuser` and default password is `deleteme`. Click **LOG IN**. [enterprise type="inline" size="small" /]

# Install the DC/OS CLI

You must install the [DC/OS Command-Line Interface (CLI)][2] to administer your DCOS cluster.

1.  Click the drop-down menu on the upper-left corner of the DC/OS GUI and select **Install CLI**.

2.  Copy the code snippet and run in a terminal. Provide the sudo password, accept the fingerprint of the cluster certificate, and provide the superuser name and password to authenticate the CLI.

# Next steps

- [Add users to your cluster][3]
- [Scaling considerations][4]

 [1]: /1.11/administering-clusters/managing-aws/
 [2]: /1.11/cli/install/
 [3]: /1.11/security/ent/users-groups/
 [4]: https://aws.amazon.com/autoscaling/
