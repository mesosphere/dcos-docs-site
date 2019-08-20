---
layout: layout.pug
navigationTitle:  Secrets
title: Secrets
menuWeight: 7
excerpt: Using the Secrets page
enterprise: true
render: mustache
model: /1.13/data.yml
---

You can manage secrets and certificates from the Secrets page.

![Secrets](/1.13/img/GUI-Secrets-Secrets_View_With_Secrets-1_12.png)
Figure 1 - Secrets page



For complete details on creating and managing Secrets, see the [Secrets](/1.13/security/ent/secrets) documentation.

<p class="message--important"><strong>IMPORTANT: </strong>The maximum file size for a secret is approximately 1 MB, subtracting approximately 1 KB for the secret store metadata.</p>

# Creating key-value pair secrets 

1. Log in to the DC/OS UI as a user with the `dcos:superuser` permission.

1. Open the **Secrets** tab.

1. Click the **+** icon in the top right.

    ![New Secret](/1.13/img/new-secret.png)

    Figure 2 - New Secret icon

1. In the **ID** box, provide the name of your secret and its path, if any.

1. Type or paste the secret into the **Value** box.

    ![Secret ID/Value Fields](/1.13/img/GUI-Secrets-Create-New-Keypair.png)

    Figure 3 - Creating a new Secret with a Key-Value pair

1. Select **Key-Value Pair** as Type.

1. Type or paste the secret into the **Value** box.

1. Click **Create Secret**.

Returning to the Secrets screen, you can see that your secret has been deployed.

   ![Secret deployed](/1.13/img/GUI-Secrets-Secrets-Keypair-Deployed.png)

   Figure 4 - Secret with keypair deployed

