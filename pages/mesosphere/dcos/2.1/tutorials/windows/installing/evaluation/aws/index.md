---
layout: layout.pug
excerpt: Guide for installation of DC/OS Mixed OS cluster on AWS
title: DC/OS on AWS using the Universal Installer
navigationTitle: AWS
menuWeight: 0
model: /mesosphere/dcos/2.1/data.yml
render: mustache
---

# Install DC/OS for Windows on Amazon Web Services

After you have prepared your environment for installation, you are ready to start the installation process.

- Start a command-line interface such as bash, sh or WSL/WSL2.
- Change the working directory to the place where you saved your **main.tf** file and execute the Terraform commands:
```terraform init```
```terraform apply```
- After terraform completes, it will generate some final output that should resemble this example:
masters_dns_name = demo-ee-27nov.us-east-1.elb.amazonaws.com
windows_passwords = [
	Zk=4voo5jwZg&GDFHHJDSRZi*R%KGVhfSs
]
The new cluster will be available at https://demo-ee-27nov.us-east-1.elb.amazonaws.com
- The format for a Windows node host name is:
hostname_format  = "%[3]s-winagent%[1]d-%[2]s"

where:
[1] is the count index. The first Windows node in the cluster has count.index = 1, second - (count.index + 1), and so on.
[2] is a predefined AWS region name, for example, "us-east-1", or "us-west-1".
[3] is the cluster name

For the cluster mentioned above, the Host name of the first Windows node is:
*demo-ee-27nov-winagent1-us-east-1*

## Troubleshooting

For instructions on how to log on to the Windows node for investigation or troubleshooting issues, see the topic, [Connecting your Windows Instance](https://docs.aws.amazon.com/AWSEC2/latest/WindowsGuide/connecting_to_windows_instance.html), in the Amazon Web Services help. 

In case of an error, find the cause of the error, fix it and then run ```terraform apply``` again. For example, you can reach the quota of SSL/TLS certificates for account and get something like: error: LimitExceeded: Cannot exceed quota for ServerCertificatesPerAccount: 20)


## Removing unneeded clusters

If you do not need the cluster anymore, you can run ```terraform destroy``` to delete all resources.