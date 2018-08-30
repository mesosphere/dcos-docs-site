---
layout: layout.pug
navigationTitle: Planning to Use Package Registry
title: Planning to Use Package Registry
menuWeight: 25
excerpt: How to Plan to Implement DC/OS Package Registry
beta: true
enterprise: true
---

# Storage

### Default

The default configuration of the DC/OS Package Registry persist the DC/OS Packages in a local persistent volume in the host filesystem. When using the default storage configuration you can only run one instance of the registry. The DC/OS Package Registry also supports storing DC/OS Packages in S3 which support deploying more than one instance of the registry.

### S3 Storage Option

To configure the DC/OS Package Registry to store DC/OS Packages in S3, you should provide the S3 endpoint, bucket name, access key, and secret key. For Amazon S3 please refer to Amazon S3 Regions & Endpoints for more details on possible endpoints.

#### Upload the S3 credential to the DC/OS Secret store

```bash
dcos security secrets create -f ~/.aws/credentials <registry-s3-credential-file>
```

For information on how to create an AWS Credential file, please see the [AWS CLI User Guide](https://docs.aws.amazon.com/cli/latest/userguide/cli-config-files.html).

#### Configure and Install DC/OS Package Registry

```bash
echo '{
  "registry": {
    "service-account-secret-path": "registry-private-key",
    "s3" : {
      "credential-secret-path" : "registry-s3-credential-file",
      "credential-profile-name" : "default",
      "bucket" : "my-bucket",
      "path" : "my-path-in-bucket",
      "endpoint" : "https://s3.us-east-1.amazonaws.com"
    },
    "service" : {
      "instances" : 2
    }
  }
}' > registry-options.json
```

The default configuration assumes that the secrets for the service account for the DC/OS Package Registry are stored in `registry-private-key` in the DC/OS Secret Store. If that is not the case please replace `registry-private-key` with the correct filename.

You must override the value for the properties "bucket", "path" and "endpoint" to match the S3 configuration.

The configuration above assumes that the AWS Credential files for the DC/OS Package Registry are stored in "registry-s3-credential-file" in the DC/OS Secret Store. If that is not the case please replace "registry-s3-credential-file" with the correct path.

### Docker Engine Integration

For the Docker daemon to be able to fetch images stored in the DC/OS Package Registry it needs to be configured to trust the DC/OS Package Registry. Please see the documentation provided by Docker for details. The name of the registry will be `<service-name>.marathon.l4lb.thisdcos.directory` where `<service-name>` is the name of the service used when installing the DC/OS Package Registry. By default the service name is `registry`. To configure the docker daemon in all of the DC/OS Agents (Public and Private) to trust the default configuration of the DC/OS Package Registry execute the following commands:

```bash
sudo mkdir -p /etc/docker/certs.d/registry.marathon.l4lb.thisdcos.directory
sudo cp /run/dcos/pki/CA/ca-bundle.crt /etc/docker/certs.d/registry.marathon.l4lb.thisdcos.directory/ca.crt
sudo systemctl restart docker
```

This configuration needs to be performed in all of the DC/OS Agents.
