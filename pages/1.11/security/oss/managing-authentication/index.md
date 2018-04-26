---
layout: layout.pug
navigationTitle:  Managing Authentication
excerpt: Managing authentication in the DC/OS web interface and CLI
title: Managing Authentication
menuWeight: 1
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

You can authorize individual users, and grant access to users who are local or remote from your datacenter.

The DC/OS user database is persisted in ZooKeeper by running on the master nodes in [znodes](https://zookeeper.apache.org/doc/r3.1.2/zookeeperProgrammers.html#sc-zkDataModel-znodes) under the path `/dcos/users`. Tokens that are sent to DC/OS in an HTTP Authorization header must be in this format: `token=<token>`. In future versions `Bearer <token>` will also be supported.

## User management

Users are granted access to DC/OS by another authorized user. A default user is automatically created by the first user that logs in to the DC/OS cluster.

To manage users:

1.  Launch the DC/OS web interface and log in with your username (Google, GitHub, and Microsoft) and password.

2.  Click on the **Organization** tab and choose your action.

    ### Add users

    From the **Users** tab, click the new user icon (**+**) and fill in the new user email address. New users are automatically sent an email notifying them of access to DC/OS.

    **Tip:** Any user with access to DC/OS can invite more users. Each DC/OS user is an administrator, there is no explicit concept of privileges with DC/OS.

    ![new DC/OS user](/1.11/img/ui-add-user.gif)

    ### Delete users

    1.  From the **Users** tab, select the user name and click **Delete**.
    2.  Click **Delete** to confirm the action.

    ### Switch users

    To switch users, you must log out of the current user and then back in as the new user.

    *   To log out of the DC/OS web interface, click on your username in the top left corner and select **Sign Out**.

        ![log out](/1.11/img/auth-enable-logout-user.gif)

        You can now log in as another user.

    *   To log out of the DC/OS CLI, enter this command:

        ```bash
        dcos config unset core.dcos_acs_token
        Removed [core.dcos_acs_token]
        ```

        You can now log in as another user.

## <a name="log-in-cli"></a>Logging in to the DC/OS CLI

Authentication is only supported for DC/OS CLI version 0.4.3 and above. See [here](/1.11/cli/update/) for upgrade instructions.

The DC/OS CLI stores the token in a configuration file in the `.dcos` directory under the home directory of the user running the CLI. This token can be used with the curl command to access DC/OS APIs, using curl or wget. For example, `curl -H 'Authorization: token=<token>' http://cluster`.

1.  From a terminal prompt, use the following command to authenticate to your cluster.

    ```bash
    dcos auth login
    ```

    Here is an example of the output:

    ```bash
    Please go to the following link in your browser:

        https://<public-master-ip>/login?redirect_uri=urn:ietf:wg:oauth:2.0:oob

    Enter OpenID Connect ID Token:
    ```

1.  Copy the URL in your terminal prompt and paste it into your browser.

    ![alt](/1.11/img/auth-login.png)

1.  Click the button that corresponds to your preferred identity provider.

1.  Provide your credentials to the identity provider if prompted. If you have already authenticated to the identity provider during your current browser session, you won't need to do so again.  

    ![alt](/1.11/img/auth-login-token.png)

1.  Click **Copy to Clipboard**.

1.  Return to your terminal prompt and paste the OpenID Connect ID token value in at the prompt.

1.  You should receive the following message.

    ```bash
    Login successful!
    ```

## Logging out of the DC/OS CLI

To log out, run this command:

```bash
dcos auth logout
```

## Debugging

To debug authentication problems, check the Admin Router and dcos-oauth logs on the masters using the following commands.

```bash
sudo journalctl -u dcos-adminrouter.service
sudo journalctl -u dcos-oauth.service
```

## Authentication opt-out

If you are doing an [advanced installation](/1.11/installing/oss/custom/advanced/), you can opt out of
Auth0-based authentication by adding this parameter to your configuration file (`genconf/config.yaml`). For more information, see the configuration [documentation](/1.11/installing/oss/custom/configuration/configuration-parameters/).

```yaml
oauth_enabled: 'false'
```

If you are doing a cloud installation on [AWS](/1.11/installing/oss/cloud/aws/), you can set the `OAuthEnabled` option to `false` on the **Specify Details** step to disable authentication.

If you are doing a cloud installation on [Azure](/1.11/installing/oss/cloud/azure/), you currently cannot disable authentication. This will be added in a future release along with other
options to customize authentication.

Note that if you’ve already installed your cluster and would like to disable this in-place, you can go through an upgrade with the same parameter set.

## Ad Blockers and the DC/OS UI

During testing, we have observed issues with loading the DC/OS UI login page
when certain ad blockers such as HTTP Switchboard or Privacy Badger are active.
Other ad blockers like uBlock Origin are known to work.

## Further reading

- [Let’s encrypt DC/OS!](https://mesosphere.com/blog/2016/04/06/lets-encrypt-dcos/):
  a blog post about using [Let's Encrypt](https://letsencrypt.org/) with
  services running on DC/OS.

## Future work

We are looking forward to working with the DC/OS community on improving existing
security features as well as on introducing new ones in the coming releases.

## Next Steps

- [Understand DC/OS security](/1.11/administering-clusters/)
- [Learn how to monitor a DC/OS cluster](/1.11/monitoring/)

 [1]: https://en.wikipedia.org/wiki/STARTTLS
