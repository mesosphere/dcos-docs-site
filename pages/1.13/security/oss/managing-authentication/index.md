---
layout: layout.pug
navigationTitle:  Managing Authentication
excerpt: Managing authentication in the DC/OS CLI
title: Authentication Management
menuWeight: 20
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


The DC/OS user database is persisted in ZooKeeper by running on the master nodes in [znodes](https://zookeeper.apache.org/doc/r3.1.2/zookeeperProgrammers.html#sc-zkDataModel-znodes) under the path `/dcos/users`. Tokens that are sent to DC/OS in an HTTP Authorization header must be in this format: `token=<token>`. In future versions `Bearer <token>` will also be supported.

DC/OS Open Source provides security management via CLI commands; see the [CLI Command Reference](/1.12/cli/command-reference/dcos-auth/). From the CLI, you can authenticate to your cluster or even opt out of Auth0-based authentication. 


## <a name="log-in-cli"></a>Authenticating through DC/OS CLI

Authentication is only supported for DC/OS CLI version 0.4.3 and later. See [here](/1.12/cli/update/) for upgrade instructions.

The DC/OS CLI stores the token in a configuration file in the `.dcos` directory under the home directory of the user running the CLI. This token can be used with the `curl` command to access DC/OS APIs, using `curl` or `wget`. For example, `curl -H 'Authorization: token=<token>' http://cluster`.

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

1.  Click the button that corresponds to your preferred identity provider.

    ![id provider list](/1.12/img/auth-login.png)

    Figure 3. Choose an identity provider

1.  Provide your credentials to the identity provider if prompted. If you have already authenticated to the identity provider during your current browser session, you won't need to do so again.  

    ![auth login token](/1.12/img/auth-login-token.png)

    Figure 4. Auth login token

1.  Click **Copy to Clipboard**.

1.  Return to your terminal prompt and paste the OpenID Connect ID token value in at the prompt.

1.  You should receive the following message.

    ```bash
    Login successful!
    ```

1. To log out, run this command:

    ```bash
    dcos auth logout
    ```

## Authentication opt-out

If you are doing an [advanced installation](/1.12/installing/production/deploying-dcos/installation/), you can opt out of Auth0-based authentication by adding this parameter to your configuration file (`genconf/config.yaml`). 

```yaml
oauth_enabled: 'false'
```
For more information, see the configuration [documentation](/1.12/installing/production/advanced-configuration/configuration-reference/).

If you are doing a cloud installation on [AWS](/1.12/installing/oss/cloud/aws/), you can set the `OAuthEnabled` option to `false` on the **Specify Details** step to disable authentication.

If you are doing a cloud installation on [Azure](/1.12/installing/evaluation/azure/), you cannot disable authentication. This option will be added in a future releasealong with other options to customize authentication.

Note that if you have already installed your cluster and would like to disable this in-place, you can go through an upgrade with the same parameter set.


## Further reading

- [Let’s encrypt DC/OS!](https://mesosphere.com/blog/2016/04/06/lets-encrypt-dcos/):
  a blog post about using [Let's Encrypt](https://letsencrypt.org/) with
  services running on DC/OS.

## Future work

We are looking forward to working with the DC/OS community on improving existing
security features as well as on introducing new ones in the coming releases.

## Next Steps

- [Understand DC/OS security](/1.12/administering-clusters/)
- [Learn how to monitor a DC/OS cluster](/1.12/monitoring/)

 [1]: https://en.wikipedia.org/wiki/STARTTLS
