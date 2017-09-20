---
layout: layout.pug
title: Sealing the Secret Store
menuWeight: 2
excerpt:
featureMaturity: preview
enterprise: true
navigationTitle:  Sealing the Secret Store
---

You may want to manually seal the Secret Store to protect its contents from an intruder.

Sealed Secret Stores cannot be accessed from the web interface. Secret values cannot be retrieved using the [Secrets API](/docs/1.8/administration/secrets/secrets-api/). Services that depend on values in the Secret Store may fail to deploy.

To seal the Secret Store, complete the following steps.

**Prerequisites:**

- You must have the [DC/OS CLI installed](/docs/1.8/usage/cli/install/) and be logged in as a superuser via `dcos auth login`.

- If your [security mode](/docs/1.8/administration/installing/ent/custom/configuration-parameters/#security) is `permissive` or `strict`, you must follow the steps in [Obtaining and passing the DC/OS certificate in curl requests](/docs/1.8/administration/tls-ssl/get-cert/) before issuing the curl commands in this section. If your [security mode](/docs/1.8/administration/installing/ent/custom/configuration-parameters/#security) is `disabled`, you must delete `--cacert dcos-ca.crt` from the commands before issuing them.

1. Use the following command to seal the Secret Store.

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/secrets/v1/seal/default
   ```

1. Confirm that the Secret Store was sealed with this command.

   ```bash
   curl --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/secrets/v1/seal-status/default
   ```

1. It should return the following JSON.

   ```json
   {"sealed":true,"threshold":1,"shares":1,"progress":0}
   ```
