---
layout: layout.pug
navigationTitle:  Configure Credentials
title: Configuring Credentials
menuWeight: 10
beta: false
excerpt: Configuration of Credentials and Service Accounts with D2iQ Dispatch
---
Credentials are used when a Dispatchfile is executed, to push images and
clone source repositories. These credentials are attached to an individual service account that is specified when a Dispatch repository is created. The Dispatchfile's tasks then have access to only those credentials that have been attached to the specified
service account.

A Dispatch repository's Dispatchfile is executed in the context of a specific
Kubernetes service account. The Dispatchfile's tasks use credentials attached to
that service account in order to push/pull docker images from a registry or
clone git repositories. These credentials are stored as Kubernetes secrets with
special structure and annotations.

# Create a service account

Before registering a new repository with Dispatch, you must create a service
account and attach credentials to it.

1. Create a service account using the dispatch CLI as follows:

    ```bash
    dispatch serviceaccount create team-1
    ```

   This creates a service account named `team-1`.

# Setting up Github credentials
1. Set up credentials for the `team-1` service account to access the source control management
   service on behalf of your account.

    <details>
    <summary><b>GitHub</b></summary>

    Create a [Personal Access Token](https://github.com/settings/tokens) for your
    GitHub account. You must specify the following permissions:

    * FULL access to `admin:repo_hook`: used to register webhooks to report events
      to Dispatch.
    * FULL access to `repo`: used to pull and/or push source code whether public or private,
      report build statuses to your commits, etc.

    After creating the token, remember the secret value. Replace `$GITHUB_TOKEN`
    with the secret value in the following command:

    ```bash
    dispatch login github --service-account team-1 --user $GITHUB_USER --token $GITHUB_TOKEN
    ```

	<p class="message--note">NOTE: </strong>If your Kubernetes cluster endpoint presents a self-signed TLS certificates you must pass `--insecure-webhook-skip-tls-verify` to the `login github` command, otherwise GitHub will refuse to deliver webhook events to Dispatch.</p>

    </details>

    <details>
    <summary><b>GitLab</b></summary>

    Create a [Personal Access Token](https://gitlab.com/profile/personal_access_tokens)
    for your GitLab account. The token should have the following scopes:

    * `api`: used to register webhooks to report events to Dispatch and report
      build statuses to your commits, etc.
    * `write_repository`: used to pull and/or push source code whether public or private.

    After creating the token, remember the secret value. Replace `$GITLAB_TOKEN`
    with the secret value in the following command:

    ```bash
    dispatch login gitlab --service-account team-1 --user $GITLAB_USER --token $GITLAB_TOKEN
    ```

    </details>

    <details>
    <summary><b>BitBucket Cloud</b></summary>

    Create an [App Password](https://bitbucket.org/account/settings/app-passwords/) for your
    Bitbucket Cloud account. The app password should have the following permissions:

    * Repositories read and write: used to pull and/or push source code whether public or private,
      report build statuses to your commits, etc.
    * Pull requests read and write: used to obtain and/or update pull request information.
    * Webhooks read and write: used to register webhooks to report events to Dispatch.

    After creating the app password, remember the secret value. Replace `$BITBUCKET_APP_PASSWORD`
    with the secret value in the following command:

    ```bash
    dispatch login bitbucket-cloud --service-account team-1 --user $BITBUCKET_USER --app-password $BITBUCKET_APP_PASSWORD
    ```

    </details>

    <details>
    <summary><b>Bitbucket Server</b></summary>

    <p class="message--note"><strong>NOTE: </strong>Bitbucket Server does not support skipping TLS
    certificate verification for webhooks. If you use a self-signed certificate in your cluster, you
    must [add the certificate to Bitbucket Server](https://confluence.atlassian.com/bitbucketserver/if-you-use-self-signed-certificates-938028692.html).
    Or if you are using Konvoy, you could [set up a Let's Encrypt certificate](/dkp/konvoy/latest/security/letsencrypt/).</p>

    Create a [Personal Access Token](https://confluence.atlassian.com/bitbucketserver/personal-access-tokens-939515499.html)
    for your Bitbucket Server account. The token should have the following permissions:

    * Projects: read
    * Repositories: admin

    These permissions allow Dispatch to do the following:

    * Perform pull request actions
    * Update repository settings and permissions
    * Push, pull, and clone repositories

    After creating the token, remember the secret value. Replace `$BITBUCKET_TOKEN`
    with the secret value in the following command:

    ```bash
    dispatch login bitbucket-server --service-account team-1 --user $BITBUCKET_USER --app-password $BITBUCKET_TOKEN
    ```

	<p class="message--note">NOTE: </strong>If your Kubernetes cluster endpoint presents a self-signed TLS certificates you must pass `--insecure-webhook-skip-tls-verify` to the `login gitlab` command, otherwise GitLab will refuse to deliver webhook events to Dispatch.</p>

    </details>


1. Set up Git SSH credentials if you want to trigger a build locally.

    1. Generate an SSH key pair:

        ```bash
        ssh-keygen -t ed25519 -f dispatch.pem
        ```

        This generates two files:

        * The SSH private key `dispatch.pem` (never copy or share this file anywhere you
          do not trust).
        * The SSH public key `dispatch.pem.pub` which corresponds to the `dispatch.pem`
          private key file. This file is safe to copy or share publicly.

    1. Add the SSH public key to your source control management service.

        <details>
        <summary><b>GitHub</b></summary>

        1. Visit https://github.com/settings/keys
        1. Click "New SSH key".
        1. Give the key an appropriate title like "Dispatch test 1".
        1. Run `cat ./dispatch.pem.pub` in your terminal, copy the output, and paste it in the "Key" text box on the page.
        1. Click "Add SSH key".

        </details>

       <details>
       <summary><b>GitLab</b></summary>

       1. Visit https://gitlab.com/profile/keys
       1. Run `cat ./dispatch.pem.pub` in your terminal, copy the output, and paste it in the "Key" text box on the page.
       1. Give the key an appropriate title like "Dispatch test 1".
       1. Click "Add key".

       </details>

       <details>
       <summary><b>BitBucket Cloud</b></summary>

       1. Visit https://bitbucket.org/account/settings/ssh-keys/
       1. Click "Add key".
       1. Give the key and appropriate label like "Dispatch test 1".
       1. Run `cat ./dispatch.pem.pub` in your terminal, copy the output, and paste it in the "Key" text box on the page.
       1. Click "Add key".

       </details>

       <details>
       <summary><b>BitBucket Server</b></summary>

       1. Click your profile picture at the upper-right corner of the web UI of your on-prem Bitbucket Server instance.
       1. Click "Manage account" in the drop-down manu to go to the "Account" page.
       1. Click "SSH keys" from the list manu.
       1. Click "Add key".
       1. Run `cat ./dispatch.pem.pub` in your terminal, copy the output, and paste it in the "Key" text box on the page.
       1. Click "Add key".

       </details>

    1. Now that we've registered the SSH public key with the source control management service, we
       can add the corresponding SSH private key to the `team-1` service account:

        ```bash
        dispatch login git --service-account team-1 --private-key-path ./dispatch.pem
        ```

# Setting up Docker credentials
Set up credentials for the `team-1` service account to access the docker registry service on behalf of your account.

1. To store Docker registry credentials, run the `login docker` subcommand and specify the service account to attach the credentials to by mentioning `username` and `password`:

    ```bash
    dispatch login docker --service-account team-1 --username $YOURDOCKERUSERNAME --password $YOURDOCKERPASSWORD
    ```

    Alternatively, specify a non default registry endpoint as well:

    ```bash
    dispatch login docker --service-account team-1 --username $YOURDOCKERUSERNAME --password $YOURDOCKERPASSWORD --registry https://us.gcr.io
    ```

    **Note** The `--password` can be a token instead of docker password (useful for accounts protected by 2FA)
