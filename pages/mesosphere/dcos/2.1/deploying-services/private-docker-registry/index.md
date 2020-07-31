---
layout: layout.pug
navigationTitle:  Using a Private Docker Registry
title: Using a Private Docker Registry
menuWeight: 4
excerpt: Providing access to a private Docker registry
render: mustache
model: /mesosphere/dcos/2.1/data.yml
enterprise: false
---


To supply authentication credentials which allows agents to pull from a private Docker registry, there are several methods to choose from:

1. Use the DC/OS configuration parameter [cluster_docker_credentials](/mesosphere/dcos/2.1/installing/production/advanced-configuration/configuration-reference/#cluster-docker-credentials) to set Docker credentials on each agent. This will enable any task to pull from the registry without any other configuration needed to services.

1. Create an archive (.tar.gz file) of the Docker credentials. Then add it as a URI in each service or pod definition that will pull from the registry. DC/OS packages and other Mesos frameworks may not support the ability to add Docker credentials to their tasks using this method.

1. Upload the Docker credentials into [DC/OS Secrets](/mesosphere/dcos/2.1/security/ent/secrets/). Then add that secret in each service or pod definition that will pull from the registry. DC/OS packages and other Mesos frameworks may not support the ability to add Docker credentials to their tasks using this method. [enterprise type="inline" size="small" /]

DC/OS does not support external credential stores or credential helpers.

In addition to supplying credentials, the CA certificate of the private Docker registry may also be needed to be provided to DC/OS.

# Prerequisites
### Create a Docker credentials configuration file
1. Log in to the private registry manually. Login creates a `.docker` folder and a `.docker/config.json` file in your home directory.

    ```bash
    docker login some.docker.host.com
    Username: foo
    Password:
    Email: foo@bar.com
    ```

DC/OS will not use this file directly but it will be used in several of the procedures listed below.


# Using cluster_docker_credentials to set cluster-wide registry credentials
DC/OS has several parameters which control Docker credentials for all tasks on the cluster regardless of whether the task uses Docker or UCR as its containerizer. See the [DC/OS Configuration Reference](/mesosphere/dcos/2.1/installing/production/advanced-configuration/configuration-reference) for details on each of these parameters. With the following configuration, DC/OS will create a credentials file with a blank configuration:

```
cluster_docker_credentials = "{}"
cluster_docker_credentials_enabled = "true"
cluster_docker_credentials_write_to_etc = "true"
cluster_docker_credentials_dcos_owned = "false"
```

Rather than using a blank configuration, operators can choose to include their full Docker credentials configuration. However, this is not recommended as it leaves sensitive information exposed in DC/OS configuration. Instead, the file `/etc/mesosphere/docker_credentials` can be created prior to DC/OS installation or modified after installation to include the correct configuration and real credentials. The DC/OS agent service must be restarted after making a change to the file: `sudo systemctl restart dcos-mesos-slave` or `sudo systemctl restart dcos-mesos-slave-public`. An empty file or invalid configuration will prevent the agent service from starting.

The Docker credentials file location can be changed by setting `cluster_docker_credentials_path`.


<a name="uri-instructions"></a>
# Referencing private Docker registry credentials as a URI
Create an archive of your Docker credentials, then add it as a URI in your service or pod definition.

## Step 1: Create an archive of the Docker credentials

1. Compress your `.docker` folder and its contents.

    ```bash
    cd ~
    tar -czf docker.tar.gz .docker
    ```
1. Verify that both files are in the archive.

    ```bash
      tar -tvf ~/docker.tar.gz

      drwx------ root/root         0 2015-07-28 02:54 .docker/
      -rw------- root/root       114 2015-07-28 01:31 .docker/config.json
    ```

1. Put the archive file in a location that is accessible to your application definition.

    ```bash
    cp docker.tar.gz /etc/
    ```

<p class="message--important"><strong>IMPORTANT: </strong> The URI must be accessible by all nodes that will start your application. You can distribute the file to the local filesystem of all nodes, for example via RSYNC/SCP, or store it on a shared network drive like <a href="http://aws.amazon.com/s3/">Amazon S3</a>. Consider the security implications of your chosen approach carefully.</p>

## Step 2: Add the path to each service definition

1. Add the path to the archive file login credentials to your service definition.

    ```bash
    "fetch": [
      {
        "uri": "file:///etc/docker.tar.gz"
      }
    ]
    ```

    For example:

    ```json
    {
      "id": "/some/name/or/id",
      "cpus": 1,
      "mem": 1024,
      "instances": 1,
      "container": {
        "type": "DOCKER",
        "docker": {
          "image": "some.docker.host.com/namespace/repo"
        }
      },
      "fetch": [
        {
          "uri": "file:///etc/docker.tar.gz"
        }
      ]
    }
    ```

    The Docker image will now pull using the provided security credentials.

<a name="secret-store-instructions"></a>

# Reference private Docker registry credentials in DC/OS Secrets [enterprise type="inline" size="small" /]

Follow these steps to add your Docker registry credentials to the [DC/OS Enterprise secrets store](/mesosphere/dcos/2.1/security/ent/secrets/), and then reference that secret in your service definition.

<p class="message--important"><strong>IMPORTANT: </strong>This functionality is available only with the <a href="/mesosphere/dcos/2.1/deploying-services/containerizers/ucr/">Universal Container Runtime</a>. If you need to use the Docker Engine, follow the URI instructions above.</p>

## Step 1: Create the secret

1.  Check that you have the `~/.docker/config.json` file.

    ```bash
    ls ~/.docker
    config.json
    ```

    Your `config.json` file should look like this, where value of `auth` is a base64-encoded `username:password` string.

    ```json
    {
      "auths": {
          "https://index.docker.io/v1/": {
              "auth": "XXXXX",
              "email": "<your-email>"
          }
      }
    }
    ```

    If you are using Mac OS, you will need to manually encode your `username:password` string and modify your `config.json` to match the snippet above. Be sure to omit a trailing new-line when base64 encoding the pair:

    ```bash
    echo -n myuser@domain.com:hard-to-guess-password | base64
    ```

1. Add the `config.json` file to the DC/OS secret store. [Learn more about creating secrets](/mesosphere/dcos/2.1/security/ent/secrets/create-secrets/).

   ```bash
   dcos security secrets create --file=config.json <path/to/secret>
   ```

   If you plan to follow the example below, enter the following command to add the secret:

   ```bash
   dcos security secrets create --file=config.json mesos-docker/pullConfig
   ```

## Step 2: Add the secret to your service or pod definition

### For a service

1. Add a location for the secret in the `secrets` parameter and a reference to the secret in the `docker.pullConfig` parameter.

   <p class="message--important"><strong>IMPORTANT: </strong>This functionality is <strong>only</strong> supported with the Universal Container Runtime: <code>container.type</code> must be <code>MESOS</code>.</p>

   ```json
   {
      "id": "/mesos-docker",
      "container": {
        "docker": {
          "image": "<your/private/image>",
          "pullConfig": {
            "secret": "pullConfigSecret"
          }
        },
        "type": "MESOS"
      },
      "secrets": {
        "pullConfigSecret": {
          "source": "/mesos-docker/pullConfig"
        }
      },
      "args": ["hello"],
      "cpus": 0.2,
      "mem": 16.0,
      "instances": 1
   }
   ```

1. Add the service to DC/OS. If you are using the example above, `<svc-name>` is `mesos-docker`.

   ```
   dcos marathon app add <svc-name>.json
   ```

   The Docker image will now pull using the provided security credentials.

### For a pod

1. Add a location for the secret in the `secrets` parameter and a reference to the secret in the `containers.image.pullConfig` parameter.

   <p class="message--important"><strong>IMPORTANT: </strong>This functionality is only supported if <code>image.kind</code> is set to <code>DOCKER</code>.</p>

   ```json
   {
        "id":"/simple-pod",
        "containers":[
           {
             "name":"simpletask1",
             "exec":{
                 "command":{
                   "shell":"env && sleep 1000"
                 }
               },
             "resources":{
               "cpus":0.1,
               "mem":32
           },
           "image":{
               "kind":"DOCKER",
               "id":"<your/private/image>",
               "pullConfig":{
                 "secret":"pullConfigSecret"
              }
           }
        }
     ],
     "networks":[
         {
           "mode":"host"
         }
     ],
     "secrets":{
         "pullConfigSecret":{
           "source":"/pod/pullConfig"
        }
     }
   }
   ```

1. Add the pod to DC/OS. If you are using the example above, `<pod-name>` is `simple-pod`.

      ```
      dcos marathon pod add <pod-name>.json
      ```

   The Docker image will now pull using the provided security credentials.

<a name="docker-repo-certs"></a>

# Configuring agents to use a custom certificate for the Docker registry
Some organizations require both user credentials and valid TLS certificates to authorize access to the Docker registry. For example, some registry configurations require a certificate to encrypt the communications between the client and the registry, while user credentials determine who gets to access to the registry after the connection to the registry is successful.

If your private registry uses a certificate to secure communications, you must configure the agent nodes to trust the certificate you use to access the private Docker registry.

To configure a custom certificate for accessing the private Docker registry and DC/OS UCR, complete the following steps:

## Step 1: Create the certificate and obtain its CA certificate.
1. Create or identify a custom certificate that you want to use as a trusted certificate for accessing the Docker registry. You can use OpenSSL, DC/OS Enterprise CLI, or another program for generating public and private keys, certificate requests, and encrypted client and server certificates.

1. After you create or identify a certificate, you can configure the registry to use this certificate by following the instructions provided by the registry provider.

1. Finally, obtain the certificate of the certificate authority (CA) which signed the registry certificate and use that in the instructions below.

## Step 2: Add custom certificate to Docker
1. Download or copy the certificate to the following location on each agent:

    ```bash
    /etc/docker/certs.d/<registry_name>:<registry_port>/ca.crt
    ```

    For the path to the trusted CA certificate on each agent, replace the `<registry_name>` and `<registry_port>` with the specific registry name and port number appropriate for your installation. For example, if you are configuring the DC/OS `ca.crt` certificate as a trusted certificate and the local Docker registry is referenced as `registry.mycompany.com:5000`, you can download a copy of the `ca.crt` file and set it as trusted using a command similar to the following:

    ```bash
    sudo mkdir -p /etc/docker/certs.d/registry.mycompany.com:5000
    sudo cp /path/to/ca.crt etc/docker/certs.d/registry.mycompany.com:5000/ca.crt
    ```

2. Restart the Docker daemon:

    ```bash
    sudo systemctl restart docker
    ```
    <p class="message--warning"><strong>WARNING: </strong>Restarting Docker will cause all Docker containers to stop. Drain the agent of any tasks which are using Docker prior to restarting it.</p>


## Step 3: Add custom certificate to Mesos
1. Download or copy the certificate to the following location on each agent:

    ```bash
    /var/lib/dcos/pki/tls/certs/docker-registry-ca.crt
    ```

1. Create a symbolic link from the trusted certificate to the `/var/lib/dcos/pki/tls/certs` directory on each agent:

    ```bash
    sudo ln -s /var/lib/dcos/pki/tls/certs/docker-registry-ca.crt /var/lib/dcos/pki/tls/certs/$(openssl x509 -hash -noout -in /var/lib/dcos/pki/tls/certs/docker-registry-ca.crt).0
    ```

<a name="tarball-instructions"></a>


# Pushing a custom image to a private registry from a tarball

If you asked your sales representative for an enterprise version of Marathon, you may have been given a Docker image in a `.tar` archive. Follow these steps to deploy it to your registry:

## Step 1: Import in the local machine

1. Load the tarball into your local Docker client, passing the path to your custom tarball. For example, `marathon-dcos-ee.<version>.tar`:
   ```bash
   docker load -i marathon-dcos-ee.<version>.tar
   ```

    **Tip:** You can view the Marathon image with this command.

    ```
    docker images
    ```

    You should see output similar to this:

    ```bash
    REPOSITORY                    TAG                 IMAGE ID            CREATED             SIZE
    mesosphere/marathon-dcos-ee   1.4.0-RC4_1.9.4     d1ffa68a50c0        3 months ago        926.4 MB
    ```

## Step 2: Push the image to the repository

1. Re-tag the file to match the repository that you are using in your private Docker registry:
   ```bash
   docker tag \
    mesosphere/marathon-dcos-ee:<mesosphere-tag> \
    <your-repo>/marathon-dcos-ee:<your-tag>
   ```

   Where:

   - `<mesosphere-tag>` is the tag of the image from Mesosphere. Typically, this will match the version number in the filename.
   - `<your-repo>` is the name of the private repository that you want to store the image in.
   - `<your-tag>` is the tag for the image. It is recommended that you use the same tag as the Mesosphere image.
1. Push the new image to your private Docker registry:
   ```bash
   docker push <your-repo>/marathon-dcos-ee:<your-tag>
   ```
