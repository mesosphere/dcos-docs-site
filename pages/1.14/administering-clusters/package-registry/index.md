---
layout: layout.pug
navigationTitle: Package Registry
title: Package Registry
menuWeight: 50
excerpt: Using the web interface or CLI to manage your package repositories
enterprise: true
---

<!-- The source repo for this topic is https://github.com/dcos/dcos-docs-site -->

DC/OS comes pre-configured with the [Mesosphere Universe](https://github.com/mesosphere/universe) package repository as the provider of DC/OS packages. However this assumes internet access which is not always possible. For air-gapped environments, DC/OS Enterprise offers the solution of package registry for a flexible and seamless management of your packages.

For a full list of the configuration options available for the DC/OS Package Registry use the command `dcos package describe package-registry --config`. You can find more information about the `dcos package` commands in the [CLI documentation](/1.13/cli/command-reference/dcos-package/).

For a detailed description of how to configure and deploy DC/OS Services, see [Configuring Universe Services](/1.13/deploying-services/config-universe-service/).

# Default installation

Package registry can be activated out of box by executing the following command(s):

```bash
# Install the package-registry CLI
dcos package install package-registry --cli --yes

# Activate the package-registry with default options
dcos registry activate
```

The `registry activate` command uses the default options which is **NOT recommended** if you are installing in prod environments. Please read through the rest of the sections to creation an options file and then you can activate the package registry by executing:

```bash
dcos registry activate --options=<custom-options-file>
```

# Configuration

Package registry can be configured with following options during deployment:

1. Storage Options (Local storage OR Mount Volumes OR S3 Compatible Storage)
2. Serivice namespacing and secrets

If you have a config file from one of the previous installations, you can skip this section and continue to the next section of instalating the package-registry.

## Storage Options

Package registry can be configured to use one of:
 1. Local Storage
 2. Mount Volumes OR
 3. S3 Compatible storage

Package registry would use local storage by default which is NOT recommended for production usage. Please configure a persistent volume or S3 compatible storage for production usage. If you are using this for developement purposes and wish to use local storage, skip to the next section.

### Mount volume Option

Refer to [Mount Volume Docs](/1.13/storage/mount-disk-resources/) to create mount volumes on DC/OS which includes an example that creates a loopback device. The rest of this guide assumes you have a mount volume created at `/dcos/package-registry`. You need to specify the `container-path` and a `pinned-hostname` which refers to the hostname of the agent the mount volume is mounted. Following options can be used to configure `package-registry` to use a mount volume :

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

Given the default configuration of the DC/OS Package Registry, DC/OS Packages are stored in a local persistent volume in the host filesystem. When using this default storage configuration, you are limited to one instance of the registry. Package Registry also supports a highly available configuration by storing DC/OS Packages on a S3 compatible storage which supports deploying more than one instance of the registry.

To configure a DC/OS Package Registry to store DC/OS Packages using S3 storage, you must provide following details :
  1. Specific S3 endpoint.
  2. S3 bucket name and path.
  3. S3 access key and secret key.

#### S3 Endpoint details

When using Amazon S3, please refer to [Amazon S3 Regions & Endpoints](https://docs.aws.amazon.com/general/latest/gr/rande.html#s3_region) for more details on possible endpoints. Package registry has been tested and known to work with Amazon S3 and minio storage. It can work with any other S3 compatible storage. Please reach out if you face problems connecting with other S3 compatible storage.

#### S3 bucket name and path

The combiniation of S3 bucket name and path inside the bucket should be unique to each deployment of package registry. Multiple instances from each deployment would however ensure synchronized access to this bucket.

#### Upload the S3 credential to the DC/OS Secret store

Create (or you an existing file) an s3 credential file and use it to create a file based secret in DC/OS.

```bash
dcos security secrets create -f ~/.aws/credentials dcos-registry-s3-credential-file
```

For information on how to create an AWS Credential file, please see the [AWS CLI User Guide](https://docs.aws.amazon.com/cli/latest/userguide/cli-config-files.html).

The final `s3` config should something like this:

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

<p class="message--note"><strong>NOTE: </strong>You must override the value for the properties <code>bucket</code>, <code>path</code> and <code>endpoint</code> to match the S3 configuration.</p>

## Serivice namespacing and secrets

By default, package registry is installed as a marathon app with `dcos-registry` as its id. This name has somewhat unique significance because the `dockerd` on agents are configured to trust the package registry instance at `dcos-registry.marathon.l4lb.thisdcos.directory:443`. If you decide to change this name, you need to configure the `dockerd` to trust the custom name your registry is deployed at `<your-custom-name>.marathon.l4lb.thisdcos.directory:443`. For e.g. if you install registry under `/my/custom/dcos-registry` namespace, then ensure registry is accessible at `https://mycustomdcos-registry.marathon.l4lb.thisdcos.directory` (internal to cluster):

```bash
curl -k https://mycustomdcos-registry.marathon.l4lb.thisdcos.directory
{"checks":{"/repo":{"Healthy":{"message":"Able to find 0 package(s)."}}}}
```

You would also require your `dockerd` to trust the above domain name. To configure `dockerd` to trust package registry at `mycustomdcos-registry.marathon.l4lb.thisdcos.directory`, you can execute:

```bash
sudo mkdir -p /etc/docker/certs.d/mycustomdcos-registry.marathon.l4lb.thisdcos.directory
sudo cp /run/dcos/pki/CA/ca-bundle.crt /etc/docker/certs.d/mycustomdcos-registry.marathon.l4lb.thisdcos.directory/ca.crt
sudo systemctl restart docker
```

<!-- TODO : Add more details on verification -->

### Setup Service Account and Secret

DC/OS Package Registry needs a service account to be able to run in DC/OS Enterprise. Use the following procedure to create a service account with minimum permissions.

1. Install the DC/OS Enterprise CLI:

```bash
dcos package install dcos-enterprise-cli --yes
```

2. Create a private/public key pair for the service account:

```bash
dcos security org service-accounts keypair private-key.pem public-key.pem
```

3. Create the service account:

```bash
dcos security org service-accounts create -p public-key.pem -d "dcos_registry service account" registry-account
```

4. Store private key in the Secret Store:

```bash
dcos security secrets create-sa-secret --strict private-key.pem registry-account registry-private-key
```

5. Give full permission to the service account:

```bash
dcos security org users grant registry-account dcos:adminrouter:ops:ca:rw full
```

<p class="message--important"><strong>IMPORTANT: </strong>The secret information associated with the service account is stored in a path called  <code>registry-private-key</code>  in the DC/OS Secret store. If using a different filename, substitute that for  <code>registry-private-key</code>  here. </p>

<p class="message--warning"><strong>WARNING: </strong>These instructions create two sensitive files on the local file system: <code>private-key.pem</code> and <code>public-key.pem</code>. Please make sure to save these files in a secure place or delete them. They are not needed after being stored in the DC/OS Secret Store. </p>

The service `instances`, `cpus`, `mem`, and `disk` can also be configured as needed. Execute the following command for getting an exhaustive list of all configuration options:

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

Now that you successfully created the config file (reffered to as `package-registry-options.json` from here on), you are ready to install the package registry. This can accomplished by following :

```bash
dcos package install package-registry --options=package-registry-options.json
```

This would launch the marathon app for package-registry. This usually takes a couple of minutes. As soon as package-registry is healthy, you can add it as one of the package repositories in DC/OS. This can be done by:

```bash
# Change the repo name and URL if you need to customize
dcos package repo add --index=0 "Registry" https://dcos-registry.marathon.l4lb.thisdcos.directory
```

If you get errors in executing above command, wait for couple minutes (to account for the latency in package registry being healthy and its DNS entry being propogated to all master nodes) and try again.

# Using package registry

After package registry is installed, you can start adding packages to it. There are two parts to this :

1. Building the package files (`.dcos` files)
2. Uploading the packages to package-registry.


## Building the packages

Mesosphere hosts all its certified packages at https://downloads.mesosphere.com/universe/packages/packages.html If the packages you need are available there, you can download them and skip to the next section of uploading these .dcos files to your cluster. When a universe catalog package is under development and you want to test it before creating a pull request OR if you want to build a non certified (community) package, this section is useful.

### Requirements

1.  Make sure you have the valid universe package defintion files([Schema here](https://github.com/mesosphere/universe/tree/version-3.x/repo/meta/schema)). Note that `package-registry` only support packages that are packaged with v4 or higher schema of universe packaging system. See [Creating a package](https://github.com/mesosphere/universe#creating-a-package) for more details.
2. `docker` is installed in your system (**if** your package uses docker images).
3. Package registry CLI needs to be installed as well. There are two ways to accomplish this.
   1. Install `package-registry` CLI from a DC/OS cluster.
      ```bash
      # Install CLI subcommand "registry"
      dcos package install --cli package-registry
      # Make sure the subcommand works
      dcos registry --help
      ```

   2. If you don't have access to a DC/OS Cluster (such as in CI/CD), download `package-registry` cli for [Linux](https://downloads.mesosphere.io/package-registry/binaries/cli/linux/x86-64/latest/dcos-registry-linux), [macOS](https://downloads.mesosphere.io/package-registry/binaries/cli/darwin/x86-64/latest/dcos-registry-darwin) or [Windows](https://downloads.mesosphere.io/package-registry/binaries/cli/windows/x86-64/latest/dcos-registry-windows.exe)
      ```bash
      # Change the URL based on macOS, linux or windows accordingly.
      curl -o dcos-registry https://downloads.mesosphere.io/package-registry/binaries/cli/darwin/x86-64/latest/dcos-registry-darwin
      # Give executable permissions to downloaded binary
      chmod +x dcos-registry
      # Make sure the executable works
      ./dcos-registry registry --help
      ```
      In the rest of the instructions in this page, we assume you have downloaded the subcommand from an attached DC/OS Cluster. If that is not your case, just replace `dcos` with `./dcos-registry` in your instructions.

### Instructions to generate `.dcos` bundle

The `package-registry` cli can be used to bundle your package in to a `.dcos` file that can be used by the `package-registry`. Let us assume that the universe package files are in a directory called `/path/to/package/`. If you list the contents of the this folder, it should have the package definition files:

```
➜ tree
.
├── config.json
├── marathon.json.mustache
├── package.json
└── resource.json
```
**Note**: All the assets URIs in the resource.json must be accessible to download from your environment. Relative file paths are accepted as well.

```bash
# Create a temporary work directory to store the build definition and other files necessary to create the bundle.
mkdir /path/to/output

# `migrate` the unvierse package defintion to create a build defintion for the `.dcos` file.
dcos registry migrate --package-directory=/path/to/package --output-directory=/path/to/output

# `build` to download all the requrired assets and generate a `.dcos` file. This may take a while.
dcos registry build --build-definition-file=/path/to/output/<json-build-defintion-generated-above> --output-directory=/path/to/output
```

If all the above steps are completed successfully your `/path/to/output` directory should look similar to:

```
➜ tree
.
├── <package-name>-<package-version>.dcos
└── <package-name>-<package-version>.json
```

You can clean up the build defintion json file as it is no longer needed. Both the `build` and `migrate` subcommands accepts optional `--json` flag to support automation.

After executing all the above steps, you should have a brand new `.dcos` file.

## Uploading the packages to package-registry

Now that you have all the `.dcos` files you need, you can continue to execute :

```bash
dcos registry add --dcos-file <your-file>.dcos
```

This is asynchronous and takes couple of minutes for the package to be visible in your catalog. Even if above command errors out (which can happen even on a successfull upload in slow network connections), you can track the status of upload by executing:

```bash
dcos registry describe --package-name=<package-name> --package-version=<package-version>
```

Please be patient and wait for couple minutes for the package to be uploaded, processed and made visible in the catalog.

See `dcos registry --help` for an exhaustive list of operations that you can use to manage the packages in package registry. The `registry` subcommand allows you to `add`, `remove` and `describe` a package.

<p class="message--warning"><strong>WARNING: </strong>Removing a package while a service is still deployed may cause the service to stop working.</p>

After doing the above, the rest of the flow is identical to packages fetched from Universe. Only difference is you don't need internet access (for customers with air-gapped environments) to install packages from `package-registry`.
