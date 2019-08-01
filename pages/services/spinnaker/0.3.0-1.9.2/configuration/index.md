---
layout: layout.pug
navigationTitle:
excerpt: Configuring Spinnaker for production and development
title: Configuration
menuWeight: 20
model: /services/spinnaker/data.yml
render: mustache
---

#include /services/include/configuration-install-with-options.tmpl
#include /services/include/configuration-service-settings.tmpl

# Custom Install

## {{ model.techName }} configuration

1. Use the following command to download {{ model.techName }} configuration templates to get started.

```bash
curl -O https://ecosystem-repo.s3.amazonaws.com/spinnaker/artifacts/0.3.0-1.9.2/config.tgz && tar -xzf config.tgz && cd config && chmod +x gen-optionsjson
```

The created **config** folder has the following `yaml` templates.
```
front50-local.yaml
clouddriver-local.yaml
echo-local.yaml
igor-local.yaml
```
2. Tailor these {{ model.techName }} yaml configuration files for your specific needs. The `yaml` can be entered via the {{ model.techName }} configuration dialogs in the `DC/OS console` or passed in an `options.json` file on `dcos package install`.
  <p class="message--note"><strong>NOTE: </strong>If you follow the links to the detailed {{ model.techName }} configuration options you will also see the configuration of {{ model.techName }} service dependencies. Do not worry about those configurations they are all taken care of by the DC/OS {{ model.techName }} service.</p>

### front50-local.yaml
Front50 is the {{ model.techName }} **persistence service**. The following section shows how to configure the AWS S3 (enabled=true) and GCS (enabled=false) persistence plugin in `front50-local.yaml`.

```yaml
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

The DC/OS {{ model.techName }} front50 service can be configured to use secrets for AWS S3 and GCS credentials. You have to create all of them using the following commands. **Configure the ones you are not using with empty content.**
```bash
dcos security secrets create -v <your-aws-access-key-id> spinnaker/aws_access_key_id

dcos security secrets create -v <your-aws-secret-access-key> spinnaker/aws_secret_access_key

dcos security secrets create -v <your-gcp-key> spinnaker/gcp_key
```

For more configuration options see [spinnaker/front50](https://github.com/spinnaker/front50/blob/master/front50-web/config/front50.yaml).

### clouddriver-local.yaml
Clouddriver is the {{ model.techName }} **cloud provider service**. The following section shows how to configure the DC/OS and Kubernetes provider plugin in `clouddriver-local.yaml`.

```yaml
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

<p class="message--note"><strong>NOTE: </strong>Configure the DC/OS user to have superuser privileges.</p>

For more configuration options see [spinnaker/clouddriver](https://github.com/spinnaker/clouddriver/blob/master/clouddriver-web/config/clouddriver.yaml)
### gate-local.yaml (optional)
Gate is the {{ model.techName }} **api service**. The following section shows how to configure OAuth2 in `gate-local.yaml`.

```yaml
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

### echo-local.yaml (optional)
Echo is the {{ model.techName }} **notification service**. The following section shows how to configure the email notification plugin in `echo-local.yaml`.

```yaml
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

For more configuration options see [spinnaker/echo](https://github.com/spinnaker/echo/blob/master/echo-web/config/echo.yaml), and [spinnaker/spinnaker](https://github.com/spinnaker/spinnaker/tree/master/install).

### igor-local.yaml (optional)
Igor is the {{ model.techName }} **trigger service**. The following section shows how to configure the dockerRegistry trigger plugin in `igor-local.yaml`.

```yaml
dockerRegistry:
  enabled: true
```

For more configuration options see [spinnaker/igor](https://github.com/spinnaker/igor/blob/master/igor-web/config/igor.yaml).

When installing the {{ model.techName }} service via the DC/OS console you have sections for each of the {{ model.techName }} services where you can enter the respective yaml configuration.

Here the sample for the Clouddriver service.
[<img src="/services/spinnaker/0.3.0-1.9.2/img/inst05.png" alt="{{ model.techName }} Quick Start"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/inst05.png)

## DC/OS CLI install
The config folder that was created when we downloaded the zip file earlier also provides a tool to generate an `options.json` file. Once you have edited the yaml templates to your needs, run the tool in the config folder. The proxy hostname is typically the public agent hostname.
```bash
./gen-optionsjson <proxy-hostname>
```

Once you have the options json file, you can install the {{ model.techName }} service using the DC/OS cli.
```bash
dcos package install --yes spinnaker --options=options.json
```

## Edge-LB
Instead of the simple proxy we used in the quick start, you can also use Edge-LB. After installing Edge-LB, you can create the Edge-LB pool configuration file named `spinnaker-edgelb.yaml`, using the following yaml (`minio` is also included).

```yaml
apiVersion: V2
name: spinnaker
count: 1
haproxy:
  frontends:
  - bindPort: 9001
    protocol: HTTP
    linkBackend:
      defaultBackend: deck
  - bindPort: 8084
    protocol: HTTP
    linkBackend:
      defaultBackend: gate
  - bindPort: 9000
    protocol: HTTP
    linkBackend:
      defaultBackend: minio
  backends:
  - name: deck
    protocol: HTTP
    services:
    - endpoint:
        type: ADDRESS
        address: deck.spinnaker.l4lb.thisdcos.directory
        port: 9001
  - name: gate
    protocol: HTTP
    services:
    - endpoint:
        type: ADDRESS
        address: gate.spinnaker.l4lb.thisdcos.directory
        port: 8084
  - name: minio
    protocol: HTTP
    services:
    - endpoint:
        type: ADDRESS
        address: minio.marathon.l4lb.thisdcos.directory
        port: 9000
```

Use the following command to launch the pool.
```bash
dcos edgelb create spinnaker-edgelb.yaml
```
