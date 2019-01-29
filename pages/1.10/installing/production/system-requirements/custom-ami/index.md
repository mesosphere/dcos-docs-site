---
layout: layout.pug
navigationTitle: Custom AMI
title: Installing using a Custom AMI
menuWeight: 20
excerpt: Using AWS machine images to launch DC/OS
beta: true
---

You can use customized [AWS Machine Images (AMI)](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html) based on CentOS 7, CoreOS, and RHEL to launch DC/OS with the advanced templates.

- A custom AMI can be used to integrate DC/OS installation with your own in-house configuration management tools.
- A custom AMI can be used if you want kernel or driver customization.

To get started, build a custom AMI and then install DC/OS using the advanced templates.

# Build a custom AMI
This is the recommended method for building your own AMI. 

## Build DC/OS cloud_images AMI

1.  Use the DC/OS [cloud_images](https://github.com/dcos/dcos/tree/master/cloud_images) scripts as a template. These scripts build a CentOS7 AMI with all of the DC/OS prerequisites installed.

    Verify that you can build and deploy an AMI using these scripts as-is, without modification. An AMI must be deployed to every region where a cluster will be launched. The DC/OS Packer build script [create_dcos_ami.sh](https://github.com/dcos/dcos/blob/master/cloud_images/centos7/create_dcos_ami.sh) can deploy the AMI to multiple regions by setting the environment variable `DEPLOY_REGIONS` before running the script.

1.  Launch the DC/OS advanced template using the AWS CloudFormation web console and specify the DC/OS cloud_images AMI. Verify that the cluster launched successfully. For more information, see the [documentation](/1.10/installing/evaluation/aws/aws-advanced/).

## Modify the DC/OS cloud_images AMI 

After you have successfully built and deployed the unmodified DC/OS cloud_images AMI using the AWS CloudFormation web console:

1.  Modify the DC/OS [cloud_images](https://github.com/dcos/dcos/tree/master/cloud_images) AMI scripts with your own AMI customizations. Your AMI must satisfy all of the DC/OS AMI prerequisites as shown in the template.

1.  Launch the DC/OS advanced templates using the AWS CloudFormation web console and specify your customized AMI. Verify that DC/OS starts as expected and that services can be launched on the DC/OS cluster.

1.  Complete your installation by following [these instructions](1.10/installing/evaluation/aws/aws-advanced/).

## Troubleshooting

- Familiarize yourself with the DC/OS service startup [process](/1.10/overview/architecture/boot-sequence/).
- See the installation troubleshooting [documentation](/1.10/installing/troubleshooting/). To troubleshoot you must have [SSH access](/1.10/administering-clusters/sshcluster/) to all of the cluster nodes.
- The [DC/OS Slack](https://support.mesosphere.com) community is another a good place to get help.
