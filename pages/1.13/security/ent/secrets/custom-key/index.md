---
layout: layout.pug
navigationTitle:  Reinitializing the Secret Store with a custom GPG keypair
title: Reinitializing the Secret Store with a custom GPG keypair
menuWeight: -1
excerpt: Using a custom GPG pair to reinitialize the Secret Store

enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

In this section, you will re-initalize the secret store with a custom GPG pair.

**Prerequisites:**

- [DC/OS CLI installed](/1.13/cli/install/)
- Logged into the DC/OS CLI as a superuser via `dcos auth login`
- [GNU Privacy Guard (GPG) installed](http://brewformulas.org/Gnupg)
- You must follow the steps in [Downloading the Root Cert](/1.13/security/ent/tls-ssl/get-cert/) before issuing the `curl` commands in this section. 

## <a name="1"></a>Edit your SECRETS_BOOTSTRAP value

1. [SSH into your master](/1.13/administering-clusters/sshcluster/).

2. Open the `dcos-secrets.env` file in your choice of editor.

   ```bash
   sudo vi /opt/mesosphere/etc/dcos-secrets.env
   ```

3. Edit the `SECRETS_BOOTSTRAP=true` value to read `false`, as shown below.

   ```
   SECRETS_BOOTSTRAP=false
   ```

4. Save the file and quit the editor.

## <a name="2"></a>Stop store and vault services
1. Stop the Secret Store and Vault services.

   ```bash
   sudo systemctl stop dcos-secrets dcos-vault
   ```

1. Confirm that the `dcos-secrets` service has shut down, using the following command.

   ```bash
   systemctl status dcos-secrets
   ```

1. Type `q` to exit.

1. Confirm that the `dcos-vault` service has shut down, using the following command.

   ```bash
   systemctl status dcos-vault
   ```
1. Type `q` to exit.

1. If your cluster has multiple masters, repeat steps 1 through 5 on each master before continuing.

## <a name="3"></a>Stop ZooKeeper CLI

1. Launch the ZooKeeper command line interface.

   ```bash
   /opt/mesosphere/packages/exhibitor--*/usr/zookeeper/bin/zkCli.sh
   ```

1. Execute the following ZooKeeper command to gain additional privileges, replacing `super:secret` if necessary with the actual user name and password of the ZooKeeper superuser.

  <p class="message--note"><strong>NOTE: </strong>By default, DC/OS sets the ZooKeeper superuser to <code>super:secret</code>, but we recommend <a href="1.12/installing/production/advanced-configuration/configuration-reference/#zk-superuser">changing the default</a>.</p>


   ```bash
   addauth digest super:secret
   ```

3. Remove the `/dcos/vault/default` and `rmr /dcos/secrets` directories, as shown below.

   ```
   rmr /dcos/vault/default
   rmr /dcos/secrets
   ```

1. Confirm that the directories have been removed, using the following commands.

   ```
   ls /dcos/vault
   ls /dcos
   ```

1. Type `quit` to exit the ZooKeeper command line interface.

## <a name="4"></a>Start Store and Vault services

1. Start the Secret Store and Vault services.

   ```bash
   sudo systemctl start dcos-secrets dcos-vault
   ```

1. Confirm that the `dcos-secrets` service has started up, using the following command.

   ```bash
   systemctl status dcos-secrets
   ```

1. Type `q` to exit.

1. Confirm that the `dcos-vault` service has started up, using the following command.

   ```bash
   systemctl status dcos-vault
   ```

1. Type `q` to exit.

1. If your cluster has multiple masters, repeat steps 1 through 5 on each master before continuing.

## <a name="5"></a> Create new key pair
You do not **have** to use GPG to generate the keypair. We provide these instructions as a convenience. The only requirement is that the keypair can be loaded into GPG. Should you choose to use a different tool, just import the keys into GPG afterwards and skip to step 4.

1. Inside the secure shell of a master, use the following command to initiate the creation of a new GPG public-private key pair.

   ```bash
   gpg --gen-key
   ```

1. At the first prompt, type `1` to select the `RSA and RSA` option.

1. Complete the remainder of the prompts as desired.

1. Use the following command to export the public key, base64-encode it, and remove the newlines. Before executing the command, replace `<key-ID>` below with the alphanumeric ID of the public key.

  <p class="message--note"><strong>NOTE: </strong>In the following line, <code>gpg: key CCE6A37D</code> is marked as <code>ultimately trusted</code>, and <code>CCE6A37D</code> represents the ID of the public key.</p>

   ```bash
   gpg --export <key-ID> | base64 -w 0 | tr '\n' ' '
   ```
5. Copy the value returned by GPG. This is your public GPG key in a base64-encoded format.

1. Open a new tab in your terminal prompt.

## <a name="6"></a>Initialize store with public key

1. Use the following `curl` command to initialize the Secret Store with the new GPG public key. Replace the `"pgp_keys"` value with the value returned by GPG in the previous step.

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -d '{"shares":1,"threshold":1,"pgp_keys":["mQIN...xQPE="]}' $(dcos config show core.dcos_url)/secrets/v1/init/default -H 'Content-Type: application/json'
   ```

1. The Secret Store service returns the unseal key encrypted with the public key, indicating success.

   ```json
   {"keys":["c1c14c03483...c400"],"pgp_fingerprints":["1ff31b0af...d57b464df4"],"root_token":"da8e3b55-8719-4594-5378-4a9f3498387f"}
   ```

Congratulations! You have successfully reinitialized your Secret Store. To unseal it, refer to [Unsealing a Secret Store sealed with custom keys](/1.13/security/ent/secrets/unseal-store/#unseal-cust-keys).
