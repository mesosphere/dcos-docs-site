---
layout: layout.pug
navigationTitle:  Installing the CLI
title: Installing the CLI
menuWeight: 1
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->
# General prerequisites
Before you install the DC/OS CLI, ensure the following:
- You have a **separate computer** that is not part of the DC/OS cluster on which you can install the CLI.
- You must have **network access** from the external system hosting the CLI to the DC/OS cluster.
- You can open a **command-line shell** terminal on the external system hosting the CLI.
- You are not using `noexec` to mount the `/tmp` directory. Mounting the `/tmp` directory with the `noexec` option can prevent CLI operations.

The recommended method to install the DC/OS CLI is from the DC/OS web interface. Or, you can manually install the CLI by using the following instructions.

# Installing CLI from the web interface

1. Click **Install CLI** from the top-left corner of the DC/OS web interface.

    ![CLI install UI](/1.10/img/install-cli.png)
    
1. Copy and paste the code snippets into your terminal.

    ![CLI copy/paste](/1.10/img/install-cli-terminal.png)

# <a name="manual"></a>Manually installing the CLI

- [Installing on Linux](#linux)
- [Installing macOS](#osx)
- [Installing the DC/OS CLI on Windows](#windows)

## <a name="linux"></a>Installing on Linux

### Prerequisites
- You must have a separate computer that is not part of the DC/OS cluster on which you can install the CLI.
- You must have network access from the external system hosting the CLI to the DC/OS cluster.
- You must be able to open a command-line shell terminal on the external system hosting the CLI.
- You nust be able to run `cURL` program on the system hosting the CLI. The `curl` command is installed by default on most Linux distributions.
- You must not be using `noexec` to mount the `/tmp` directory. Mounting the `/tmp` directory with the `noexec` option can prevent CLI operations.

### Installing the DC/OS CLI

1. If you do not already have a working directory for the CLI, create one. The preferred location is `/usr/local/bin` and all the instructions will reference this path.

    ```bash
    [ -d usr/local/bin ] || sudo mkdir -p /usr/local/bin
    ```

1.  Download the DC/OS CLI binary (`dcos`) to your local directory (for example, `/usr/local/bin/`).

    ```bash
    curl https://downloads.dcos.io/binaries/cli/linux/x86-64/dcos-1.10/dcos -o dcos
    ```

1.  Move the CLI binary to your local bin directory.

    ```bash
    sudo mv dcos /usr/local/bin 
    ```

1. Make the CLI binary executable.

    ```bash
    chmod +x /usr/local/bin/dcos
    ```

1. Set up the connection from the CLI to your DC/OS cluster. In this example, `http://example.com` is the master node URL.

    ```bash
    dcos cluster setup http://example.com
    ```

    Follow the instructions in the DC/OS CLI. For more information about security, see the [documentation](/1.10/security/ent/).

    Your CLI should now be authenticated with your cluster!
    
1. Type `dcos` to view usage information and get started.

## <a name="osx"></a>Installing on macOS

### Prerequisites
- You must have a separate computer that is not part of the DC/OS cluster on which you can install the CLI.
- You must have network access from the external system hosting the CLI to the DC/OS cluster.
- You must be able to open a command-line environment, such as Terminal, on the external system hosting the CLI.
- You nust be able to run `cURL` program on the system hosting the CLI. If you don't have `cURL`, follow the instructions in [Install curl on Mac OSX](http://macappstore.org/curl/) to install it.
- You must not be using `noexec` to mount the `/tmp` directory. Mounting the `/tmp` directory with the `noexec` option can prevent CLI operations.

### Installing the DC/OS CLI

1. If you do not already have a working directory for the CLI, create one. The preferred location is `/usr/local/bin` and all the instructions will reference this path.

    ```bash
    [ -d usr/local/bin ] || sudo mkdir -p /usr/local/bin
    ```

1.  Download the DC/OS CLI binary (`dcos`) to your local directory (for example, `/usr/local/bin/`).

    ```bash
    curl https://downloads.dcos.io/binaries/cli/darwin/x86-64/dcos-1.10/dcos -o dcos
    ```

1.  Move the CLI binary to your local bin directory.

    ```bash
    sudo mv dcos /usr/local/bin 
    ```

1.  Make the CLI binary executable.

    ```bash
    chmod +x dcos
    ```

1. Set up the connection from the CLI to your DC/OS cluster. In this example, `http://example.com` is the master node URL.

    ```bash
    dcos cluster setup http://example.com
    ```
    If your system is unable to find the executable, you may need to re-open the command prompt or add the installation directory to your PATH environment variable manually.

    Follow the instructions in the DC/OS CLI. For more information about security, see [Security](/1.10/security/ent/).

    Your CLI should now be authenticated with your cluster.

1. Type `dcos` to view usage information and get started.

## <a name="windows"></a>Installing on Windows

### Prerequisites
- You must have a separate computer that is not part of the DC/OS cluster on which you can install the CLI.
- You must have network access from the external system hosting the CLI to the DC/OS cluster.
- You must be able to open a command-line environment, such as Windows PowerShell or the `cmd.exe` program, on the external system hosting the CLI. Windows PowerShell is installed by default on Windows 7 and later.
- You nust disable any security or antivirus software before you start the installation.
- You must not be using `noexec` to mount the `/tmp` directory. Mounting the `/tmp` directory with the `noexec` option can prevent CLI operations.

1. Open the command-line environment using the Administrator credentials.

1. Download the DC/OS CLI executable to your local directory ([dcos.exe](https://downloads.dcos.io/binaries/cli/windows/x86-64/dcos-1.10/dcos.exe)).

1. Change into the directory of the downloaded file if you are not already there.

    ```bash
    cd path/to/download/directory
    ```

1. Set up the connection from the CLI to your DC/OS cluster. In this example, `http://example.com` is the master node URL.

    ```powershell
    dcos cluster setup http://example.com
    ```

    Follow the instructions in the DC/OS CLI. For more information about security, see [Security](/1.10/security/ent/).

    Your CLI should now be authenticated with your cluster.

1. Type`dcos` to view usage information and get started.