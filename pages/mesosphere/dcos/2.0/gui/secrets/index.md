---
layout: layout.pug
navigationTitle:  Secrets
title: Secrets
menuWeight: 7
excerpt: Using the Secrets page
enterprise: true
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---

You can manage secrets and certificates from the Secrets page.

![Secrets](/mesosphere/dcos/2.0/img/GUI-Secrets-Secrets_View_With_Secrets-1_12.png)
Figure 1 - Secrets page


For complete details on creating and managing Secrets, see the [Secrets](/mesosphere/dcos/2.0/security/ent/secrets) documentation.

<p class="message--important"><strong>IMPORTANT: </strong>The maximum file size for a secret is approximately 1 MB, subtracting approximately 1 KB for the secret store metadata.</p>


# Creating key-value pair secrets 

1. Log in to the DC/OS UI as a user with the `dcos:superuser` permission.

1. Open the **Secrets** tab.

1. Click the **+** icon in the top right.

    ![New Secret](/mesosphere/dcos/2.0/img/new-secret.png)

    Figure 2 - New Secret icon

    If you have no current secrets, a **Create Secret** screen will be displayed. Click on the **Create Secret** button.

    ![Create Secret](/mesosphere/dcos/2.0/img/GUI-Secrets-Create-Secret.png)

    Figure 3 - Create Secret button

1. In the **ID** box of the **Create New Secret** screen, type the name of your secret and its path, if any.

1. Select **Key-Value Pair** as Type.

1. Type or paste the secret into the **Value** box.

    ![Secret ID/Value Fields](/mesosphere/dcos/2.0/img/GUI-Secrets-Create-New-Keypair.png)

    Figure 4 - Creating a new Secret

1. Click **Create Secret**.

# Creating secrets from a file 

This procedure describes how to use a file to create a secret using the DC/OS web interface.

1. Log in to the DC/OS UI as a user with the `dcos:superuser` permission.
1. Click the **Secrets** tab on the left hand navigation menu.
1. Click the **+** icon in the top right.

    ![New Secret](/mesosphere/dcos/2.0/img/new-secret.png)

    Figure 5 - Secrets screen

    If you have no current secrets, a Create Secret screen will be displayed. Click on the **Create Secret** button.

    ![Create Secret](/mesosphere/dcos/2.0/img/GUI-Secrets-Create-Secret.png)

    Figure 6 - Create Secret button

1. In the ID box, provide the name of your secret and its path, if any.

    ![Create New Secret](/mesosphere/dcos/2.0/img/GUI-Secrets-Create-New-Secret.png)

    Figure 7 - Create New Secret dialog

1. Select **File** as Type.
1. Click **Choose File**.
1. Find and select the file you wish to create a secret from.
1. Click **Create Secret**.

# View Created Secret 
Returning to the Secrets screen, you can see that your secret has been deployed.

   ![Secret deployed](/mesosphere/dcos/2.0/img/GUI-Secrets-Deployed.jpeg)
   Figure 8 - Secret deployed
