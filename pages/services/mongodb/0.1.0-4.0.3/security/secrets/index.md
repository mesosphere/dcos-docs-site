---
layout: layout.pug
navigationTitle: Secrets
title:  Secrets
menuWeight: 50
excerpt: Configuring a Secret Store on DC/OS
featureMaturity:
enterprise: true
model: /services/mongodb/data.yml
render: mustache
---
This section will show how to configure a service account in order to create a secret to be stored in the DC/OS Secret Store. You can then configure TLS encryption.

# Prerequisites
- [A DC/OS Service Account with a secret stored in the DC/OS Secret Store.](https://docs.mesosphere.com/latest/security/ent/service-auth/custom-service-auth/)
- DC/OS Superuser permissions for modifying the permissions of the service account.
- [DC/OS CLI](https://docs.mesosphere.com/1.10/cli/install/) installed and be logged in as a superuser.
- [Enterprise DC/OS CLI installed](https://docs.mesosphere.com/1.10/cli/enterprise-cli/#ent-cli-install).
- If your [security mode](https://docs.mesosphere.com/1.10/security/ent/) is permissive or strict, you must [get the root cert](https://docs.mesosphere.com/1.10/security/ent/tls-ssl/get-cert/) before issuing the curl commands in this section.

# Service Account Configuration
Depending on your security mode, {{ model.techName }} requires service authentication for access to DC/OS.

| Security Mode | Service Account |
|---------------|-----------------------|
|Disabled     |  Not available  |
|Permissive   |     Optional  |
|Strict 	     |    Required   |

If you install a service in permissive mode and do not specify a service account, Metronome and Marathon will act as if requests made by this service are made by an account with  superuser permission.

## Create a Key Pair

In this step, you will create a 2048-bit RSA public-private key pair using the Enterprise DC/OS CLI.

1. Create a public-private key pair and save each value into a separate file within the current directory.

   ```shell
   dcos security org service-accounts keypair {{  model.serviceName  }}-private-key.pem {{  model.serviceName  }}-public-key.pem
   ```  
1. Use the [DC/OS Secret Store](https://docs.mesosphere.com/1.10/security/ent/secrets/) to secure the key pair.

## Create a Service Account

1. From a terminal prompt, create a new service account `<service-account-id>` containing the public key `<your-public-key>.pem`.

   ```shell
   dcos security org service-accounts create -p {{  model.serviceName  }}-public-key.pem -d "dcos_{{  model.serviceName  }}" <service name>
   ``` 
1. Verify your new service account using the following command.

   ```shell
   dcos security org service-accounts show <service-account-id>
   ``` 
## Create a Secret

Create a secret `{{  model.serviceName  }}/<secret-name>` with your service account `<service-account-id>` and private key specified `<private-key>.pem`.

<p class="message--note"><strong>NOTE: </strong>If you store your secret in a path that matches the service name, for example, the service name and secret path are <code>{{  model.serviceName  }}</code>, then only the service named <code>{{  model.serviceName  }}</code> can access it.</p>

### Permissive     

   ```shell
   dcos security secrets create-sa-secret {{  model.serviceName  }}-private-key.pem <service name> <service name secret>
   ``` 
   
### Strict     

   ```shell
   dcos security secrets create-sa-secret --strict {{  model.serviceName  }}-private-key.pem <service name> <service name secret>
   ```    
**Tip:** You can list the secrets with this command:   
   ```shell
   dcos security secrets list /
   ```    

### Assign Permissions

   ```shell
   dcos security org users grant <service name> dcos:superuser full --description "grant permission to superuser" 
   dcos security org users grant dcos_{{  model.serviceName  }} dcos:adminrouter:ops:ca:rw full --description "grant permission to adminrouter"
   dcos security org users grant dcos_{{  model.serviceName  }} dcos:secrets:default:{{  model.serviceName  }}demo full --description "grant permission to {{  model.serviceName  }}demo"
   ```    


## Configure Transport Encryption

Grant the service account the correct permissions.

In DC/OS 1.10 and later, the required permission is `dcos:superuser full` and `<service name>` is the name of the service to be installed.:

   ```shell
   curl -k -v $(dcos config show core.dcos_url)/ca/dcos-ca.crt -o ../dcos-ca.crt
   export LC_ALL=C.UTF-8
   export LANG=C.UTF-8
   dcos package install dcos-enterprise-cli
   dcos security org service-accounts keypair {{  model.serviceName  }}-private-key.pem {{  model.serviceName  }}-public-key.pem
   dcos security org service-accounts create -p {{  model.serviceName  }}-public-key.pem -d "dcos_{{  model.serviceName  }}" <service name>
   dcos security secrets create-sa-secret --strict {{  model.serviceName  }}-private-key.pem <service name> <service name secret>
   dcos security org users grant <service name> dcos:superuser full --description "grant permission to superuser"
   dcos security org users grant dcos_{{  model.serviceName  }} dcos:adminrouter:ops:ca:rw full --description "grant permission to adminrouter"
   dcos security org users grant dcos_{{  model.serviceName  }} dcos:secrets:default:{{  model.serviceName  }}demo full --description "grant permission to {{  model.serviceName  }}demo"
   ```

