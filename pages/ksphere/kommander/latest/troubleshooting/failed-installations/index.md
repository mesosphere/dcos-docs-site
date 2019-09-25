---
layout: layout.pug
navigationTitle: Installation failures
title: Installation failures
menuWeight: 2
excerpt: Troubleshoot and address installation and provisioning failures
enterprise: false
---

The topics in this section cover troubleshooting installation and provisioning failures for Kubernetes clusters, with an emphasis on issues that are specific to clusters deployed with `konvoy`.
For general [Kubernetes][0] troubleshooting tips, see the [Kubernetes troubleshooting documentation][1].

## Provisioning failures

On occasion, failures can occur during installation (for example, `konvoy up` or `konvoy deploy`).

The most common reason for provisioning failures is errors communicating with the API for the underlying *infrastructure provider*.
For example, if you are deploying on a public cloud using the Amazon Web Services (AWS) infrastructure, the most common reason for the deployment to fail is caused by error that occurs during a call to the AWS API.

Because Konvoy uses the `terraform` program for some steps in the cluster provisioning process, calls to the provisioning infrastructure that use the provider API are visible as [Terraform][2] errors.
If provisioning problems occur, one of the first steps you should take to troubleshoot the issue is to make the output for the `konvoy up` command more verbose by adding the `--verbose` command-line option. For example:

```bash
konvoy up --verbose
```

### Expired or invalid credentials

One of the most common reasons that provisioning fails is caused by using expired or invalid credentials for the cloud provider.
In most cases, you can identify this issue as the root cause of a provisioning failure if the `konvoy up` command displays the following error message:

```text
An error occurred (ExpiredToken) when calling the GetCallerIdentity operation: The security token included in the request is expired
Please refresh your AWS credentials; the AWS API could not be reached with your current credentials.
```

This error message indicates that the credentials in `~/.aws/credentials` and any provided `AWS_PROFILE` therein are expired and need to be renewed.

This issue is specific to security credentials for Amazon Web Services (AWS).
For more information about AWS security credentials or how to renew or replace invalid credentials, see the [AWS Temporary Credentials Documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html) and the [requirements documentation](../install-uninstall-upgrade/basics_aws.md#prerequisites).

### Hosts are unreachable after provisioning

You are most likely to encounter this issue if you are deploying large or extra-large clusters.
Typically, the root cause of the issue is Ansible attempting to interact with all of the nodes in rapid succession.
In this scenario, the cloud providers' networking configuration might be limiting the number of interactions allowed with so many host instances.
This networking limitation can cause Ansible to fail part-way through.
Generally, you can re-try the same command, and Ansible will attempt to pick up where it left off.

[0]:https://kubernetes.io
[1]:https://kubernetes.io/docs/tasks/debug-application-cluster/troubleshooting/
[2]:https://terraform.io
