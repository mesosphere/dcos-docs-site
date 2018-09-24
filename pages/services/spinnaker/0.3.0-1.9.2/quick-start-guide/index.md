---
layout: layout.pug
navigationTitle: Quick Start
excerpt: Using Spinnaker with DC/OS
title: Quick Start
menuWeight: 15
model: /services/spinnaker/data.yml
render: mustache
---

This section is a quick guide on how to configure and use {{ model.techName }} with DC/OS.

# Prerequisites

* A running DC/OS 1.10 or 1.11 cluster

# Overview

DC/OS Spinnaker is an automated service that makes it easy to deploy and manage [Spinnaker](https://www.spinnaker.io/) on [DC/OS](https://mesosphere.com/product/).

Spinnaker is an open source, multi-cloud continuous delivery platform for releasing software changes with high velocity and confidence.

Created at Netflix, it has been battle-tested in production by hundreds of teams over millions of deployments. It combines a powerful and flexible pipeline management system with integrations to the major cloud providers.

The Spinnaker service is a micro service composition, a good overview on the micro services involved can be found [here](https://www.spinnaker.io/reference/architecture/).

## Note
The DC/OS Spinnaker service currently only works with **DC/OS Enterprise**.


# Install with Defaults
Out of the box the `DC/OS Spinnaker service` uses `minio` a s3 compatible backing store for the Spinnaker `front50` service. Use the following [minio.json](misc/minio.json) file, and run the following two commands.
```
dcos package install marathon-lb --yes
dcos marathon app add misc/minio.json
```

`marathon-lb` will make the minio console accessible via the DC/OS public agent. In your browser enter the following address. The `minio` credentials are minio / minio123.
```
http://<public-agent-ip>:9000
```

Out of the box the DC/OS `Spinnaker` service allows you to deliver to the `DC/OS cluster` the service runs itself in. The Spinnaker `deck` and `gate` services will be made available via a proxy or edge-lb running on the DC/OS clusters public agent. Note down the hostname/ip of the public agent in your DC/OS cluster


With that we are ready to install `Spinnaker`. In the DC/OS catalog/universe select Spinnaker which will show you the following. Hit *Review&Run*.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/inst01.png" alt="Spinnaker Quick Start"/>](/services/spinnaker/0.3.0-1.9.2/img/inst01.png)

In the service section fill in the proxy hostname with the hostname of the public agent noted down earlier.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/inst02.png" alt="Spinnaker Quick Start"/>](/services/spinnaker/0.3.0-1.9.2/img/inst02.png)

If for `minio` and `DC/OS` the default credentials are use then you are ready to go hit *Review&Run*. Otherwise the next two steps show how to configure your specific credentials.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/inst03.png" alt="Spinnaker Quick Start"/>](/services/spinnaker/0.3.0-1.9.2/img/inst03.png)

The following dialog shows you how to configure the `minio` credentials.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/inst04.png" alt="Spinnaker Quick Start"/>](/services/spinnaker/0.3.0-1.9.2/img/inst04.png)

The following dialog shows you how to configure the `DC/OS` credentials.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/inst05.png" alt="Spinnaker Quick Start"/>](/services/spinnaker/0.3.0-1.9.2/img/inst05.png)


Once the service is running we launch a simple `proxy` to get access to the Spinnaker `deck` and `gate` service. Use the following [proxy.json](misc/proxy.json). For how to use edge-lb to expose these services look [here]().
```
dcos marathon app add proxy.json
```

Go to the [Using Spinnaker](#using-spinnaker) section to learn how to access the Spinnaker UI, and to get an overview of the Spinnaker concepts with samples.

# Custom Install

## Spinnaker configuration

Use the following command to download Spinnaker configuration templates to get started.
```
curl -O https://ecosystem-repo.s3.amazonaws.com/spinnaker/artifacts/0.2.0-1.4.2/config.tgz && tar -xzf config.tgz && cd config && chmod +x gen-optionsjson
```

The created *config* folder has the following yml templates.
```
front50-local.yml
clouddriver-local.yml
echo-local.yml
igor-local.yml
```

Tailor these Spinnaker yml configuration files for your specific needs. The yml can be entered via the Spinnaker configuration dialogs in the `DC/OS console` or passed in an *options.json* file on `dcos package install`.

**Note:** If you follow the links to the detailed Spinnaker configuration options you will also see the configuration of Spinnaker service dependencies. Don't worry about those configurations they are all taken care of by the DC/OS Spinnaker service.

### front50-local.yml
Front50 is the Spinnaker **persistence service**. The following shows how to configure the AWS S3 (enabled=true) and GCS (enabled=false) persistence plugin in `front50-local.yml`.

```
cassandra:
  enabled: false

spinnaker:
  cassandra:
    enabled: false
    embedded: true
  s3:
    enabled: true
    bucket: my-spinnaker-bucket
    rootFolder: front50
    endpoint: http://minio.marathon.l4lb.thisdcos.directory:9000
  gcs:
    enabled: false
    bucket: my-spinnaker-bucket
    bucketLocation: us
    rootFolder: front50
    project: my-project
    jsonPath: /mnt/mesos/sandbox/data/keys/gcp_key.json
```

The DC/OS Spinnaker front50 service can be configured to use secrets for AWS S3 and GCS credentials. You have to create all of them using the following commands. **The ones you are not using with empty content.**
```
dcos security secrets create -v <your-aws-access-key-id> spinnaker/aws_access_key_id

dcos security secrets create -v <your-aws-secret-access-key> spinnaker/aws_secret_access_key

dcos security secrets create -v <your-gcp-key> spinnaker/gcp_key
```

For more configuration options see [spinnaker/front50](https://github.com/spinnaker/front50/blob/master/front50-web/config/front50.yml), and [spinnaker/spinnaker](https://github.com/spinnaker/spinnaker/blob/master/config/front50.yml).

### clouddriver-local.yml
Clouddriver is the Spinnaker **cloud provider service**. The following shows how to configure the DC/OS and Kubernetes provider plugin in `clouddriver-local.yml`.

```
dockerRegistry:
  enabled: true
  accounts:
  - name: my-docker-registry-account
    address: https://index.docker.io/
    repositories:
      - library/nginx
      - library/postgres
    username: mesosphere
#    password: ...    

dcos:
  enabled: true
  clusters:
    - name: my-dcos
      dcosUrl: https://leader.mesos
      insecureSkipTlsVerify: true
  accounts:
    - name: my-dcos-account
      dockerRegistries:
        - accountName: my-docker-registry-account
      clusters:
        - name: my-dcos
          uid: bootstrapuser
          password: deleteme

#kubernetes:
#  enabled: true
#  accounts:
#    - name: my-kubernetes-account
#      providerVersion: v2
#      namespace:
#        - default
#      kubeconfigFile: ${MESOS_SANDBOX}/kubeconfig
#      dockerRegistries:
#        - accountName: my-docker-registry-account
```

**Note:** The configured DC/OS user needs to have superuser priveledges.

For more configuration options see [spinnaker/clouddriver](https://github.com/spinnaker/clouddriver/blob/master/clouddriver-web/config/clouddriver.yml), and [spinnaker/spinnaker](https://github.com/spinnaker/spinnaker/blob/master/config/clouddriver.yml).

### gate-local.yml (optional)
Gate is the Spinnaker **api service**. The following shows how to configure OAuth2 in `gate-local.yml`.

```
#security:
#  oauth2:
#    client:
#      clientId: ...
#      clientSecret: ...
#      userAuthorizationUri: https://github.com/login/oauth/authorize
#      accessTokenUri: https://github.com/login/oauth/access_token
#      scope: user:email
#    resource:
#      userInfoUri: https://api.github.com/user
#    userInfoMapping:
#      email: email
#      firstName:
#      lastName: name
#      username: login
```

### echo-local.yml (optional)
Echo is the Spinnaker **notification service**. The following shows how to configure the email notification plugin in `echo-local.yml`.

```
mail:
  enabled: false
#  from: <from-gmail-address>
#spring:
#  mail:
#    host: smtp.gmail.com
#    username: <from-gmail-address>
#    password: <app-password, see https://support.google.com/accounts/answer/185833?hl=en >
#    properties:
#      mail:
#        smtp:
#          auth: true
#          ssl:
#            enable: true
#          socketFactory:
#            port: 465
#            class: javax.net.ssl.SSLSocketFactory
#            fallback: false
```

For more configuration options see [spinnaker/echo](https://github.com/spinnaker/echo/blob/master/echo-web/config/echo.yml), and [spinnaker/spinnaker](https://github.com/spinnaker/spinnaker/blob/master/config/echo.yml).

### igor-local.yml (optional)
Igor is the Spinnaker **trigger service**. The following shows how to configure the dockerRegistry trigger plugin in `igor-local.yml`.

```
dockerRegistry:
  enabled: true
```

For more configuration options see [spinnaker/igor](https://github.com/spinnaker/igor/blob/master/igor-web/config/igor.yml), and [spinnaker/spinnaker](https://github.com/spinnaker/spinnaker/blob/master/config/igor.yml).

## DC/OS console install
When installing the Spinnaker service via the DC/OS console you have sections for each of the Spinnaker services where you can enter the respective yml configuration.

Here the sample for the clouddriver service.
[<img src="/services/spinnaker/0.3.0-1.9.2/img/inst05.png" alt="Spinnaker Quick Start"/>](/services/spinnaker/0.3.0-1.9.2/img/inst05.png)

## DC/OS cli install
The config folder that got created when we dowloade the zip earlier also provides a tool that allows us to generate an *options.json* file. Once you edited the yml templates to your needs run the tool in the config folder. The proxy hostname is typically the public agent hostname.
```
./gen-optionsjson <proxy-hostname>
```

Once you have the options json you can install the Spinnaker service using the DC/OS cli.
```
dcos package install --yes spinnaker --options=options.json
```

## Edge-LB
Instead of the simple proxy we used in the quick start you can also use edge-lb. After installing edge-lb you can create the edgelb pool configuration for Spinnaker (minio is also included) using the [spinnaker-edgelb.yml](misc/spinnaker-edgelb.yml) file.
```
dcos edgelb create spinnaker-edgelb.yml
```

# Using Spinnaker

Go to your browser and enter the following url to get to the Spinnaker unser interface.

```
http://<public-agent-ip>:9001
```
