---
layout: layout.pug
navigationTitle: Custom GPG keypair
title: Reinitializing the Secret Store with a custom GPG keypair
menuWeight: -1
excerpt: Reinitializing the Secret Store with a custom GPG keypair

enterprise: true
---

**Prerequisites:**

- [DC/OS CLI installed](/1.10/cli/install/)
- Logged into the DC/OS CLI as a superuser via `dcos auth login`
- [GNU Privacy Guard (GPG) installed](http://brewformulas.org/Gnupg)
- If your [security mode](/1.10/installing/production/advanced-configuration/configuration-reference/#security-enterprise) is `permissive` or `strict`, you must follow the steps in [Downloading the Root Cert](/1.10/security/ent/tls-ssl/get-cert/) before issuing the curl commands in this section. If your [security mode](/1.10/installing/production/advanced-configuration/configuration-reference/#security-enterprise) is `disabled`, you must delete `--cacert dcos-ca.crt` from the commands before issuing them.

1. [SSH into your master](/1.10/administering-clusters/sshcluster/).

2. Open the `dcos-secrets.env` file in your choice of editor.

   ```bash
   sudo vi /opt/mesosphere/etc/dcos-secrets.env
   ```

3. Edit the `SECRETS_BOOTSTRAP=true` value to read `false`, as shown below.

   ```
   SECRETS_BOOTSTRAP=false
   ```

4. Save the file and quit the editor.

5. Stop the Secret Store and Vault services.

   ```bash
   sudo systemctl stop dcos-secrets dcos-vault
   ```

6. Confirm that the `dcos-secrets` service shut down using the following command.

   ```bash
   systemctl status dcos-secrets
   ```

7. Type `q` to exit.

8. Confirm that the `dcos-vault` service shut down using the following command.

   ```bash
   systemctl status dcos-vault
   ```
9. Type `q` to exit.

10. If your cluster has multiple masters, repeat steps 1 through 9 on each master before continuing.

11. Launch the ZooKeeper command line interface.

   ```bash
   /opt/mesosphere/packages/exhibitor--*/usr/zookeeper/bin/zkCli.sh
   ```

12. Execute the following ZooKeeper command to gain additional privileges, replacing `super:secret` if necessary with the actual user name and password of the ZooKeeper superuser.

   **Tip:** By default, DC/OS sets the ZooKeeper superuser to `super:secret` but we recommend [changing the default](//1.10/installing/production/advanced-configuration/configuration-reference/#zk-superuser).

   ```bash
   addauth digest super:secret
   ```

13. Remove the `/dcos/vault/default` and `rmr /dcos/secrets` directories, as shown below.

   ```
   rmr /dcos/vault/default
   rmr /dcos/secrets
   ```

14. Confirm that the directories have been removed using the following commands.

   ```
   ls /dcos/vault
   ls /dcos
   ```

15. Type `quit` to exit the ZooKeeper command line interface.

16. Start the Secret Store and Vault services.

   ```bash
   sudo systemctl start dcos-secrets dcos-vault
   ```

17. Confirm that the `dcos-secrets` service started up using the following command.

   ```bash
   systemctl status dcos-secrets
   ```

18. Type `q` to exit.

19. Confirm that the `dcos-vault` service started up using the following command.

   ```bash
   systemctl status dcos-vault
   ```

20. Type `q` to exit.

21. If your cluster has multiple masters, repeat steps 16 through 20 on each master before continuing.

21. Inside of the secure shell of a master, use the following command to initiate the creation of a new GPG public-private key pair.

   ```bash
   gpg --gen-key
   ```

   **Note:** You do not have to use GPG to generate the keypair. We provide these instructions as a convenience. The only requirement is that the keypair can be loaded into GPG. Should you choose to use a different tool, just import the keys into GPG afterwards and skip to step 24.

22. At the first prompt, type `1` to select the `RSA and RSA` option.

23. Complete the remainder of the prompts as desired.

24. Use the following command to export the public key, base64-encode it, and remove the newlines. Before executing the command, replace `<key-ID>` below with the alphanumeric ID of the public key.

   **Tip:** In the following line `gpg: key CCE6A37D marked as ultimately trusted`, `CCE6A37D` represents the ID of the public key.

   ```bash
   gpg --export <key-ID> | base64 -w 0 | tr '\n' ' '
   ```

25. Copy the value returned by GPG. This is your public GPG key in a base64-encoded format.

26. Open a new tab in your terminal prompt.

27. Use the following curl command to initialize the Secret Store with the new GPG public key. Replace the `"pgp_keys"` value with the value returned by GPG in the previous step.

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -d '{"shares":1,"threshold":1,"pgp_keys":["mQIN...xQPE="]}' $(dcos config show core.dcos_url)/secrets/v1/init/default -H 'Content-Type: application/json'
   ```

28. The Secret Store service should return the unseal key encrypted with the public key, indicating success.

   ```json
   {"keys":["c1c14c03483...c400"],"pgp_fingerprints":["1ff31b0af...d57b464df4"],"root_token":"da8e3b55-8719-4594-5378-4a9f3498387f"}
   ```

29. Congratulations! You have successfully reinitialized your Secret Store. To unseal it, refer to [Unsealing a Secret Store sealed with custom keys](/1.10/security/ent/secrets/unseal-store/#unseal-cust-keys).
