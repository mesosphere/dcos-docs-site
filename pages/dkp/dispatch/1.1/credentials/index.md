---
layout: layout.pug
navigationTitle:  Credentials
title: Credentials
menuWeight: 35
beta: false
excerpt: Credentials
---
Credentials are used when a Dispatchfile is executed, to push images and
clone source repositories. These credentials are attached to an individual service account that is specified when a Dispatch repository is created. The Dispatchfile's tasks then
have access to only those credentials that have been attached to the specified
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

    1. Now that we've registered the SSH public key with the source control management service, we
       can add the corresponding SSH private key to the `team-1` service account:

        ```bash
        dispatch login git --service-account team-1 --private-key-path ./dispatch.pem
        ```

# Setting up Docker credentials
Dispatch loads Docker registry credentials from Docker's default config file (typically `$HOME/.docker/config.json`), so you should first ensure you have already logged in on all used registries through Docker CLI.

1. To load Docker registry credentials, run the `login docker` subcommand and specify the service account to attach the credentials to:

    ```bash
    dispatch login docker --service-account team-1
    ```

    Alternatively, you can supply the path to a non-default Docker config file:

    ```bash
    dispatch login docker --service-account team-1 --docker-config-path /path/to/config.json
    ```

