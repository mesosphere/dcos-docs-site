---
layout: layout.pug
navigationTitle:  Using a Private Docker Registry
title: Using a Private Docker Registry
menuWeight: 4
excerpt: Creating an archive for a private Docker registry

enterprise: false
---


To supply credentials to pull from a private Docker registry, create an archive of your Docker credentials, then add it as a URI in your service or pod definition. In DC/OS Enterprise, you can also [upload your private Docker registry credentials to the DC/OS Secret store](#secret-store-instructions) and reference it in your service or pod definition.

<a name="uri-instructions"></a>
# Referencing private Docker registry credentials as a URI

## Step 1: Compress Docker credentials

1. Log in to the private registry manually. Login creates a `.docker` folder and a `.docker/config.json` file in your home directory.

    ```bash
    docker login some.docker.host.com
    Username: foo
    Password:
    Email: foo@bar.com
    ```

1. Compress the `.docker` folder and its contents.

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


## Step 2: Add URI path to service definition

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
# Referencing private Docker registry credentials in the secrets store [enterprise type="inline" size="small" /]

Follow these steps to add your Docker registry credentials to the [DC/OS Enterprise secrets store](/security/ent/secrets/), and then reference that secret in your service definition.

<p class="message--important"><strong>IMPORTANT: </strong>This functionality is available only with the <a href="//deploying-services/containerizers/ucr/">Universal Container Runtime</a>). If you need to use the Docker Engine, follow the URI instructions above.</p>

## Step 1: Create a credentials file

1.  Manually log in to your private registry. This creates a `~/.docker` directory and a `~/.docker/config.json` file.

    ```bash
    docker login some.docker.host.com
    Username: foo
    Password:
    Email: foo@bar.com
    ```

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

1. Add the `config.json` file to the DC/OS secret store. [Learn more about creating secrets](/1.9/security/ent/secrets/create-secrets/).

   <p class="message--note"><strong>NOTE: </strong>As of DC/OS version 1.10.0, you can add a file to the secret store only using the DC/OS CLI.</p>

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
