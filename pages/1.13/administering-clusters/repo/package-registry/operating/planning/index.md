---
layout: layout.pug
navigationTitle: Planning
title: Planning
menuWeight: 5
excerpt: Planning to use a DC/OS Package Registry
enterprise: true
---

# Storage

## Default

Given the default configuration of the DC/OS Package Registry, DC/OS Packages are stored in a local persistent volume in the host filesystem. When using this default storage configuration, you are [limited to one instance of the registry](/1.13/administering-clusters/repo/package-registry/#limitations). The DC/OS Package Registry also supports storing DC/OS Packages via S3 storage which support deploying more than one instance of the registry.

## S3 Storage Option

To configure a DC/OS Package Registry to store DC/OS Packages using S3 storage, you must provide the specific S3 endpoint, bucket name, access key, and secret key. When using Amazon S3, please refer to [Amazon S3 Regions & Endpoints](https://docs.aws.amazon.com/general/latest/gr/rande.html#s3_region) for more details on possible endpoints.

### Upload the S3 credential to the DC/OS Secret store

```bash
dcos security secrets create -f ~/.aws/credentials <registry-s3-credential-file>
```

For information on how to create an AWS Credential file, please see the [AWS CLI User Guide](https://docs.aws.amazon.com/cli/latest/userguide/cli-config-files.html).

### Configure and Install DC/OS Package Registry

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

The default configuration sets the secrets for the service account for the DC/OS Package Registry to be stored in `registry-private-key` in the DC/OS Secret Store. Moreover,   If that is not the case please replace `registry-private-key` with the correct filename.

<p class="message--note"><strong>NOTE: </strong>You must override the value for the properties <code>bucket</code>, <code>path</code> and <code>endpoint</code> to match the S3 configuration.</p>


## Docker Engine Integration

For the Docker daemon to be able to fetch images stored in DC/OS Package Registry, it must be configured to trust the DC/OS Package Registry. Docker provides [configuration documentation](https://docs.docker.com/engine/security/certificates/#understanding-the-configuration) to assist with this. The name of the registry will be `<service-name>.marathon.l4lb.thisdcos.directory` where `<service-name>` is the name of the service used when installing the DC/OS Package Registry. By default, the service name is `registry`.

To configure the Docker daemon in all of the DC/OS Agents (Public and Private) to trust the default configuration of the DC/OS Package Registry execute the following commands:

```bash
sudo mkdir -p /etc/docker/certs.d/registry.marathon.l4lb.thisdcos.:443
sudo cp /run/dcos/pki/CA/ca-bundle.crt /etc/docker/certs.d/registry.marathon.l4lb.thisdcos.directory:443/ca.crt
sudo systemctl restart docker
```

This configuration must be performed on all of the DC/OS Agents.
