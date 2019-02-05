---
layout: layout.pug
navigationTitle:  Cluster Links
title: Cluster Links
menuWeight: 0
excerpt: Managing cluster links
enterprise: true
---

A cluster link is a **unidirectional** relationship between a cluster and another cluster.

You add and remove links from one cluster to another cluster using DC/OS CLI [dcos cluster link](/1.13/cli/command-reference/dcos-cluster/dcos-cluster-link/) and [dcos cluster unlink](/1.13/cli/command-reference/dcos-cluster/dcos-cluster-unlink/) commands and the [cluster link API](/1.13/administering-clusters/multiple-clusters/cluster-link-api/). Once a link is set up you can easily switch between clusters using the CLI or UI. If the links have been set up using an SSO provider, you will not need to provide credentials to switch clusters.

You must be a superuser or have the appropriate cluster link [permission](/1.13/security/ent/perms-reference/#cluster-linker) to view, add, and remove links and grant permissions to view linked clusters.


# Enable access to cluster links using SSO

As superuser:

1. Configure an [OpenID IDP](/1.13/security/ent/sso/setup-openid/).
    1. Ensure both cluster URLs are provided in **Authorized JavaScript origins** and **Authorized redirect URIs** fields in the Google Dev console.
    1. Give the OIDC name such as "google-idp".
    1. Ensure both clusters use the same `Client-Id` and `Client-Secret` when configuring OIDC.
1. Provide each user with permission to see services and linked clusters:

    1. Select **Organization -> Users**.
    2. Select a user.
    3. Click **Add Permission**.
    4. In the top right, click **Insert Permission String**.
    5. Paste in the permissions:

        ```
        dcos:adminrouter:ops:mesos full
        dcos:adminrouter:ops:slave full
        dcos:adminrouter:service:marathon full
        dcos:service:marathon:marathon:services:/ full
        dcos:cluster:linker:* read
        ```

    6. Click **Add Permission**.

# Add a link to a cluster

To add a link to another cluster, run the `dcos cluster link` command, supplying the URL of the cluster to link to:

```bash
dcos cluster link <dcos-url>
Choose the login method and provider to enable switching to this linked cluster::
1) Provider 1
2) Provider 2
(1-2):
```

# Viewing linked clusters

To view all linked clusters, run the `dcos cluster list` command. If a cluster was linked, but not set up, its status is `UNCONFIGURED`. If a cluster is linked and attached, its status is `AVAILABLE`. Also see [Viewing Connected Clusters](/1.13/administering-clusters/multiple-clusters/cluster-connections/).

# Remove a linked cluster

To remove a link, `dcos cluster unlink` command and supply the **name** or **ID** of a linked cluster. For example:

```bash
dcos cluster unlink <linked-cluster>
```

# Switch cluster

You can switch between linked clusters using the CLI or UI. When you switch clusters using the CLI, the new cluster becomes the CLI's active cluster. When you switch cluster using the UI, the new cluster becomes the cluster you see in the UI.  If you switch the cluster in the CLI it doesn't change the cluster in the UI; similarly switching in the UI doesn't affect the attached cluster in the CLI.

## Switch to a linked cluster from the DC/OS CLI

Run the `dcos cluster attach` command and supply the name or ID of a linked cluster:

```bash
dcos cluster attach <linked-cluster>
```

If you run `dcos cluster list`, `<linked-cluster>` will have an asterisk by its name.

## Switch to a linked cluster from the DC/OS UI

1.  At the top-right corner of the DC/OS web interface, click the down arrow to the right of your cluster name.

    ![open cluster popup](/1.13/img/open-cluster-popup.png)

    Figure 1. Cluster dropdown

1.  Select **Switch Cluster**.

    ![swi cluster](/1.13/img/switch-cluster-1-12.png)

    Figure 2. Cluster switch

1. Click the name of the cluster to switch to.

    ![swi linked cluster](/1.13/img/switch-linked-cluster.png)

    Figure 3. Switch to linked cluster

If you are superuse, you can also switch to a linked cluster in the Linked Clusters tab.

1. Select **Cluster -> Linked Clusters**.

1. At the far right of the cluster to switch to, click the vertical ellipsis and select **Switch**.

   ![swi linked cluster2](/1.13/img/switch-linked-cluster2.png)

   Figure 4. Switch to linked clusters



# Example of linking and switching cluster

## Link clusters as a superuser operator via CLI

1. Set up cluster `cluster-a` using the `dcos-user` provider.

    ```
    $ dcos cluster setup --provider=dcos-users https://cluster-a.us-west-2.elb.amazonaws.com
    ```
    The response requests that you verify the fingerprint of the cluster certificate bundle, which must be accepted with the response `yes`.
    The CLI prompts for superuser credentials. Provide the credentials.

1. Set up `cluster-b` using the `dcos-user` provider.

    ```
    $ dcos cluster setup --provider=dcos-users https://cluster-b.us-west-2.elb.amazonaws.com
    ```

    The response requests that you verify the fingerprint of the cluster certificate bundle, which must be accepted with the response `yes`.
    The CLI prompts for superuser credentials. Enter the credentials.

1. Attach to cluster `cluster-a` and list.

    ```
    dcos cluster attach cluster-a
    dcos cluster list
          NAME                    CLUSTER ID                 STATUS   VERSION                                         URL
     cluster-b  34ddd64a-9301-40b1-bb6a-201ec55a0d80  AVAILABLE  1.12-dev   https://cluster-b.us-west-2.elb.amazonaws.com
    cluster-a*  584d3e8f-c5c2-4c86-b180-ff3c1f15b0d5  AVAILABLE  1.12-dev  https://cluster-a.us-west-2.elb.amazonaws.com
    ```

1. Link to cluster `cluster-b` from cluster `cluster-a`.

    ```
    dcos cluster link https://cluster-b.us-west-2.elb.amazonaws.com
    ```

    The CLI prompts to choose the login provider for switching.

    ```
    Choose the login method and provider to enable switching to this linked cluster:
    1) Log in using a standard DC/OS user account (username and password)
    2) Log in using OpenID Connect (Google IDP)
    (1-2):
    ```

1. Choose Google IDP (2).

    ```
    (1-2): 2
    ```

 If the cluster links successfully there is no response.

1. Attach to cluster `cluster-b`.

    ```
    $ dcos cluster attach cluster-b
    ```

1. Link to cluster `cluster-a` from cluster `cluster-b`.

    ```
    dcos cluster link https://cluster-a.us-west-2.elb.amazonaws.com
    ```

    The CLI prompts to choose the login provider for switching.

    ```
    Choose the login method and provider to enable switching to this linked cluster:
    1) Log in using a standard DC/OS user account (username and password)
    2) Log in using OpenID Connect (Google IDP)
    (1-2):
    ```

1. Choose Google IDP (2).

    ```
    (1-2): 2
    ```

1. List clusters.

    ```
    dcos cluster list
          NAME                    CLUSTER ID                 STATUS   VERSION                                         URL
    cluster-b*  34ddd64a-9301-40b1-bb6a-201ec55a0d80  AVAILABLE  1.12-dev   https://cluster-b.us-west-2.elb.amazonaws.com
     cluster-a  584d3e8f-c5c2-4c86-b180-ff3c1f15b0d5  AVAILABLE  1.12-dev  https://cluster-a.us-west-2.elb.amazonaws.com
    ```


Once an operator has set up links, you can switch between clusters using the UI or CLI.

### Switch clusters using the web interface with Google SSO

You can easily switch to a linked cluster that has been set up with the Google OpenID provider.


1. Log in to DC/OS UI of cluster `cluster-a` as an external user using Google credentials.

   ![google login](/1.13/img/google-login.png)

   Figure 5. Google login

1. From the top left corner, click the down arrow next to the cluster name.

   ![swi cluster](/1.13/img/switch-cluster-1-12.png)

   Figure 6. Switch cluster

1. Click **Switch Cluster**. In the Linked Clusters pane, select cluster `cluster-b`. Cluster `cluster-b`’s UI displays.


### Switch clusters using the CLI with Google SSO

You can easily switch to a linked cluster that has been set up with the Google OpenID provider.

1. List authentication providers.

    ```
    dcos auth list-providers https://cluster-a.us-west-2.elb.amazonaws.com
    PROVIDER ID    AUTHENTICATION TYPE
    dcos-services  Log in using a DC/OS service user account (username and private key)
    dcos-users     Log in using a standard DC/OS user account (username and password)
    google-idp     Log in using OpenID Connect (Google IDP)
    ```

1. Set up cluster with Google IDP.

    ```
    dcos cluster setup --provider=google-id https://cluster-a.us-west-2.elb.amazonaws.com
    ```

    The response requests you to verify the fingerprint of the cluster certificate bundle, which must be accepted with the response `yes`.

1. Copy the authentication token from the browser and paste in the terminal.

1. List clusters. The setup cluster shows as AVAILABLE and attached and the previously linked cluster shows as UNCONFIGURED.

    ```
    dcos cluster list
          NAME                    CLUSTER ID                  STATUS     VERSION                                         URL
     cluster-b  34ddd64a-9301-40b1-bb6a-201ec55a0d80  UNCONFIGURED  1.12-dev   https://cluster-b.us-west-2.elb.amazonaws.com
    cluster-a*  584d3e8f-c5c2-4c86-b180-ff3c1f15b0d5   AVAILABLE    1.12-dev  https://cluster-a.us-west-2.elb.amazonaws.com
    ```

1. Attach to UNCONFIGURED cluster.

    ```
    dcos cluster attach cluster-b
    ```

    The response requests that you verify the fingerprint of the cluster certificate bundle, which must be accepted with the response `yes`.

1. Copy the authentication token from the browser and paste in the terminal. The CLI successfully attaches to cluster `cluster-b`.

1. List clusters to verify attachment to `cluster-b`.

    ```
    dcos cluster list
          NAME                    CLUSTER ID                 STATUS   VERSION                                         URL
    cluster-b*  34ddd64a-9301-40b1-bb6a-201ec55a0d80  AVAILABLE  1.12-dev   https://cluster-b.us-west-2.elb.amazonaws.com
     cluster-a  584d3e8f-c5c2-4c86-b180-ff3c1f15b0d5  AVAILABLE  1.12-dev  https://cluster-a.us-west-2.elb.amazonaws.com
    ```
