
# Service Account Configuration
This topic describes how to configure DC/OS access for percona-pxc-mysql. Depending on your security mode, percona-pxc-mysql requires service authentication for access to DC/OS.

    Security Mode     Service Account
    =============     ===============
    Disabled          Not available
    Permissive        Optional
    Strict 	          Required

If you install a service in permissive mode and do not specify a service account, Metronome and Marathon will act as if requests made by this service are made by an account with the superuser permission.

### Prerequisites:

 1. [DC/OS CLI](https://docs.mesosphere.com/1.10/cli/install/) installed and be logged in as a superuser.
 2. [Enterprise DC/OS CLI 0.4.14 or later installed](https://docs.mesosphere.com/1.10/cli/enterprise-cli/#ent-cli-install).
 3. If your [security mode](https://docs.mesosphere.com/1.10/security/ent/) is permissive or strict, you must [get the root cert](https://docs.mesosphere.com/1.10/security/ent/tls-ssl/get-cert/) before issuing the curl commands in this section.

## Create a Key Pair

In this step, a 2048-bit RSA public-private key pair is created using the Enterprise DC/OS CLI.
Create a public-private key pair and save each value into a separate file within the current directory.

   ```shell
   dcos security org service-accounts keypair pxc-private-key.pem pxc-public-key.pem
   ```  
**Tip:** You can use the [DC/OS Secret Store](https://docs.mesosphere.com/1.10/security/ent/secrets/) to secure the key pair.

## Create a Service Account

From a terminal prompt, create a new service account `<service-account-id>` containing the public key `<your-public-key>.pem`.

   ```shell
   dcos security org service-accounts create -p pxc-public-key.pem -d "dcos_pxc" <service name>
   ``` 
**Tip:** You can verify your new service account using the following command.

   ```shell
   dcos security org service-accounts show <service-account-id>
   ``` 
## Create a Secret

Create a secret `pxc/<secret-name>` with your service account `<service-account-id>` and private key specified `<private-key>.pem`.

**Tip:** If you store your secret in a path that matches the service name, for example, service name and secret path are percona-pxc-mysql, then only the service named percona-pxc-mysql can access it.

### Permissive     

   ```shell
   dcos security secrets create-sa-secret pxc-private-key.pem <service name> <service name secret>
   ``` 
   
### Strict     

   ```shell
   dcos security secrets create-sa-secret --strict pxc-private-key.pem <service name> <service name secret>
   ```    
**Tip:** You can list the secrets with this command:   
   ```shell
   dcos security secrets list /
   ```    

### Assign Permissions

   ```shell
   dcos security org users grant dcos_pxc dcos:superuser full --description "grant permission to superuser" 
   ```    

