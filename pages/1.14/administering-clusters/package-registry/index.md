---
layout: layout.pug
navigationTitle: Package Registry
title: Package Registry
menuWeight: 50
excerpt: Using the web interface or CLI to manage your package repositories
enterprise: true
render: mustache
model: /1.14/data.yml
---

<!-- The source repo for this topic is https://github.com/dcos/dcos-docs-site -->

DC/OS comes pre-configured with the [Mesosphere {{ model.packageRepo }}](https://github.com/mesosphere/universe) package repository as the provider of DC/OS packages. However this assumes Internet access, which is not always possible. For air-gapped environments, DC/OS Enterprise offers a package registry for a flexible and seamless management of your packages.

For a full list of the configuration options available for the DC/OS Package Registry, run the following command:

```bash
dcos package describe package-registry --config
```
You can find more information about the `dcos package` commands in the [CLI documentation](/mesosphere/dcos/1.13/cli/command-reference/dcos-package/).

For a detailed description of how to configure and deploy DC/OS Services, see [Configuring {{ model.packageRepo }} Services](/mesosphere/dcos/1.14/deploying-services/config-universe-service/).

# Default installation

Package registry can be activated out of box by executing the following command(s):

```bash
# Install the package-registry CLI
dcos package install package-registry --cli --yes

# Activate the package-registry with default options
dcos registry activate
```

The `registry activate` command uses the default options, which are **NOT recommended** if you are installing in a production environment. Read through the rest of the sections to create an options file, and then activate the package registry by executing the following command:

```bash
dcos registry activate --options=<custom-options-file>
```

# Configuration
If you have a configuration file from one of the previous installations, you can skip this section and continue to the next section of installing the package-registry.

Package registry can be configured with the following options during deployment:

1. [Storage Options](#storage-options) (Local storage OR Mount Volumes OR S3 Compatible Storage)
1. [Service namespacing and secrets](#service-namespacing-and-secrets)

If you have a config file from one of the previous installations, you can skip this section and continue to the next section of installing the package-registry.

## Storage options

Package registry can be configured to use one of:
1. [Local Storage](#local-storage)
1. [Mount Volumes](#mount-volume-option) OR
1. [S3 Compatible storage](#s3-storage-option)

### Local Storage

Package registry would use local storage by default, which is **NOT recommended** for production usage. Configure a persistent volume or S3-compatible storage for production usage. If you are using this for developement purposes and wish to use local storage, skip to the next section.

### Mount volume option

To create mount volumes on DC/OS, refer to the [Mount Volume](/mesosphere/dcos/1.14/storage/mount-disk-resources/) documentation, which includes an example that creates a loopback device. The rest of this guide assumes you have a mount volume created at `/dcos/package-registry`. You must specify the `container-path` and a `pinned-hostname`, which refers to the hostname of the agent on which the volume is mounted. The following options can be used to configure `package-registry` to use a mount volume :

```json
{
    "registry": {
        "mount-volume": {
            "container-path": "package-registry",
            "pinned-hostname": "a.specific.node.com"
        }
    }
}
```

### S3 Storage Option

Given the default configuration of the DC/OS Package Registry, DC/OS Packages are stored in a local persistent volume in the host file system. When using this default storage configuration, you are limited to one instance of the registry. Package Registry also supports a highly available configuration by storing DC/OS Packages on S3-compatible storage, which supports deploying more than one instance of the registry.

To configure a DC/OS Package Registry to store DC/OS Packages using S3 storage, you must provide the following details:
  1. Specific S3 endpoint.
  2. S3 bucket name and path.
  3. S3 access key and secret key.

#### S3 Endpoint details

When using Amazon S3, refer to [Amazon S3 Regions & Endpoints](https://docs.aws.amazon.com/general/latest/gr/rande.html#s3_region) for more details on possible endpoints. Package registry has been tested and known to work with Amazon S3 and Minio storage. It can work with any other S3 compatible storage. Contact Mesosphere support if you face problems connecting with other S3 compatible storage.

#### S3 bucket name and path

The combiniation of an S3 bucket name and path inside the bucket should be unique to each deployment of Package registry. Multiple instances from each deployment will ensure synchronized access to this bucket.

#### Upload the S3 credential to the DC/OS Secret store

Create (or use an existing file) an S3 credential file and use it to create a file based secret in DC/OS.

```bash
dcos security secrets create -f ~/.aws/credentials dcos-registry-s3-credential-file
```

For information on how to create an AWS Credential file, see the [AWS CLI User Guide](https://docs.aws.amazon.com/cli/latest/userguide/cli-config-files.html).

The final `s3` config should look something like this:

```json
{
    "registry": {
        "s3": {
            "credential-secret-path" : "dcos-registry-s3-credential-file",
            "credential-profile-name" : "default",
            "bucket" : "my-bucket",
            "path" : "my-path-in-bucket",
            "endpoint" : "https://s3.us-east-1.amazonaws.com"
        }
    }
}
```

<p class="message--note"><strong>NOTE: </strong>You must override the value for the properties <tt>bucket</tt>, <tt>path</tt> and <tt>endpoint</tt> to match the S3 configuration.</p>

## Service namespacing and secrets

By default, package registry is installed as a marathon app with `dcos-registry` as its ID. This name has unique significance because the `dockerd` on agents are configured to trust the package registry instance at `dcos-registry.marathon.l4lb.thisdcos.directory:443`. If you decide to change this name, you need to configure the `dockerd` to trust the custom name your registry is deployed at `<your-custom-name>.marathon.l4lb.thisdcos.directory:443`. For example, if you install package registry under `/my/custom/dcos-registry` namespace, then ensure that the registry is accessible at `https://mycustomdcos-registry.marathon.l4lb.thisdcos.directory` (internal to cluster):

```bash
curl -k https://mycustomdcos-registry.marathon.l4lb.thisdcos.directory
{"checks":{"/repo":{"Healthy":{"message":"Able to find 0 package(s)."}}}}
```

You must also require your `dockerd` to trust the above domain name. To configure `dockerd` to trust package registry at `mycustomdcos-registry.marathon.l4lb.thisdcos.directory`, execute the following command:

```bash
sudo mkdir -p /etc/docker/certs.d/mycustomdcos-registry.marathon.l4lb.thisdcos.directory
sudo cp /run/dcos/pki/CA/ca-bundle.crt /etc/docker/certs.d/mycustomdcos-registry.marathon.l4lb.thisdcos.directory/ca.crt
sudo systemctl restart docker
```

<!-- TODO : Add more details on verification -->

### Set Up Service Account and Secret

DC/OS Package Registry needs a service account to be able to run in DC/OS Enterprise. Use the following procedure to create a service account with minimum permissions.

1. Install the DC/OS Enterprise CLI:

    ```bash
    dcos package install dcos-enterprise-cli --yes
    ```

1. Create a private/public key pair for the service account:

    ```bash
    dcos security org service-accounts keypair private-key.pem public-key.pem
    ```

1. Create the service account:

    ```bash
    dcos security org service-accounts create -p public-key.pem -d "dcos_registry service account" registry-account
    ```

1. Store private key in the Secret Store:

    ```bash
    dcos security secrets create-sa-secret --strict private-key.pem registry-account registry-private-key
    ```

1. Give full permission to the service account:

    ```bash
    dcos security org users grant registry-account dcos:adminrouter:ops:ca:rw full
    ```

<p class="message--important"><strong>IMPORTANT: </strong>The secret information associated with the service account is stored in a path called  <tt>registry-private-key</tt>  in the DC/OS Secret store. If using a different filename, substitute that for  <tt>registry-private-key</tt>. </p>

<p class="message--warning"><strong>WARNING: </strong>These instructions create two sensitive files on the local file system: <tt>private-key.pem</tt> and <tt>public-key.pem</tt>. Make sure to save these files in a secure place or delete them. They are not needed after being stored in the DC/OS Secret Store. </p>

The service `instances`, `cpus`, `mem`, and `disk` can also be configured as needed. Execute the following command to view an exhaustive list of all configuration options:

```bash
dcos package describe package-registry --config
```

Here is a sample configuration file for the service:

```bash
> cat package-registry-options.json
{
    "registry": {
        "s3": {
            "credential-secret-path" : "dcos-registry-s3-credential-file",
            "credential-profile-name" : "default",
            "bucket" : "my-bucket",
            "path" : "my-path-in-bucket",
            "endpoint" : "https://s3.us-east-1.amazonaws.com"
        },
        "service-account-secret-path" : "dcos-registry-secret"
    },
    "service": {
        "mem" : 2048,
        "instances" : 2
    }
    "
}
```

# Installation

Now that you have successfully created the config file (referred to as `package-registry-options.json` from here on), you are ready to install the package registry. This can accomplished by following :

```bash
dcos package install package-registry --options=package-registry-options.json
```

This would launch the Marathon app for `package-registry`. This usually takes a couple of minutes. As soon as `package-registry` is healthy, you can add it as one of the package repositories in DC/OS. This can be done by:

```bash
# Change the repo name and URL if you need to customize
dcos package repo add --index=0 "Registry" https://dcos-registry.marathon.l4lb.thisdcos.directory/repo
```

If you get errors in executing above command, wait for a couple of minutes (to account for the latency in `package-registry` being healthy and its DNS entry being propagated to all master nodes) and try again.

# Using package registry

After `package-registry` is installed, you can start adding packages to it. The two step process to use the package registry is as follows:

1. Building the package files (`.dcos` files)
2. Uploading the packages to `package-registry`.


## Building the packages

Mesosphere hosts all its certified packages at [downloads.mesosphere.com/universe/packages/packages.html](https://downloads.mesosphere.com/universe/packages/packages.html). If the packages you need are available there, you can download them and skip to the next section of uploading these `.dcos` files to your cluster. When a {{ model.packageRepo }} package is under development and you want to test it before creating a pull request, or if you want to build a non certified (community) package, this section is useful.

### Requirements

1.  Make sure you have the valid {{ model.packageRepo }} package definition files ([Schema](https://github.com/mesosphere/universe/tree/version-3.x/repo/meta/schema)). Note that `package-registry` only supports packages that are packaged with v4 or higher schemas of the {{ model.packageRepo }} packaging system. See [Creating a package](https://github.com/mesosphere/universe#creating-a-package) for more details.
1. `docker` is installed in your system (**if** your package uses Docker images).
1. The package registry CLI needs to be installed as well. There are two ways to accomplish this.
   1. Install `package-registry` CLI from a DC/OS cluster.
      ```bash
      # Install CLI subcommand "registry"
      dcos package install --cli package-registry
      # Make sure the subcommand works
      dcos registry --help
      ```

   1. If you do not have access to a DC/OS Cluster (such as in CI/CD), download the `package-registry` CLI for [Linux](https://downloads.mesosphere.io/package-registry/binaries/cli/linux/x86-64/latest/dcos-registry-linux), [macOS](https://downloads.mesosphere.io/package-registry/binaries/cli/darwin/x86-64/latest/dcos-registry-darwin) or [Windows](https://downloads.mesosphere.io/package-registry/binaries/cli/windows/x86-64/latest/dcos-registry-windows.exe)

      ```bash
      # Change the URL based on macOS, linux or windows accordingly.
      curl -o dcos-registry https://downloads.mesosphere.io/package-registry/binaries/cli/darwin/x86-64/latest/dcos-registry-darwin
      # Give executable permissions to downloaded binary
      chmod +x dcos-registry
      # Make sure the executable works
      ./dcos-registry registry --help
      ```
      In the rest of the instructions in this page, we assume you have downloaded the subcommand from an attached DC/OS Cluster. If that is not the case, replace `dcos` with `./dcos-registry` in your instructions.

### Instructions to generate `.dcos` bundle

The `package-registry` CLI can be used to bundle your package into a `.dcos` file that can be used by the `package-registry`. Assume that the {{ model.packageRepo }} package files are in a directory called `/path/to/package/`. It should contain the following package definition files:

```
➜ tree
.
├── config.json
├── marathon.json.mustache
├── package.json
└── resource.json
```
<p class="message--note"><strong>NOTE: </strong>All the assets URIs in the <tt>resource.json</tt> must be accessible to download from your environment. Relative file paths are also accepted.</p>

```bash
# Create a temporary work directory to store the build definition and other files necessary to create the bundle.
mkdir /path/to/output

# `migrate` the unvierse package defintion to create a build defintion for the `.dcos` file.
dcos registry migrate --package-directory=/path/to/package --output-directory=/path/to/output

# `build` to download all the requrired assets and generate a `.dcos` file. This may take a while.
dcos registry build --build-definition-file=/path/to/output/<json-build-defintion-generated-above> --output-directory=/path/to/output
```

If all these steps are completed successfully, your `/path/to/output` directory should look similar to the following:

```
➜ tree
.
├── <package-name>-<package-version>.dcos
└── <package-name>-<package-version>.json
```

You can clean up the build definition .json file, as it is no longer needed. Both the `build` and `migrate` subcommands accept an optional `--json` flag to support automation.

After executing all the above steps, you should have a brand new `.dcos` file.

## Uploading the packages to package-registry

Now that you have all the `.dcos` files you need, you can continue to execute :

```bash
dcos registry add --dcos-file <your-file>.dcos
```

This is asynchronous and takes couple of minutes for the package to be visible in your {{ model.packageRepo }}. Even if the above command errors out (which can happen even on a successful upload in slow network connections), you can track the status of the upload by executing:

```bash
dcos registry describe --package-name=<package-name> --package-version=<package-version>
```

Be patient and wait for couple minutes for the package to be uploaded, processed and made visible in the {{ model.packageRepo }}.

See `dcos registry --help` for an exhaustive list of operations that you can use to manage the packages in Package registry. The `registry` subcommand allows you to `add`, `remove` and `describe` a package.

<p class="message--warning"><strong>WARNING: </strong>Removing a package while a service is still deployed may cause the service to stop working.</p>

After executing the above instructions, the rest of the flow is identical to packages fetched from {{ model.packageRepo }}. The only difference is that you do not need Internet access (for customers with air-gapped environments) to install packages from `package-registry`.
