---
layout: layout.pug
navigationTitle:  Updating the CLI
title: Updating the CLI
menuWeight: 3
excerpt: Updating the command line interface

enterprise: false
---

Depending on the version of the DC/OS CLI you have currently installed, you can choose to either update the CLI to the latest version for your cluster or to install a specific version. Also note, if you downloaded the CLI from PyPI or from the DC/OS UI version 1.7 or earlier, you must completely <a href="/1.12/cli/uninstall/">uninstall</a> the CLI then install a new version of the software to upgrade.

# <a name="upgrade"></a>Upgrade the CLI using the web interface

The recommended method to install the DC/OS CLI is by getting a preformatted set of commands from the DC/OS web interface and running them in the terminal. If the version of the CLI you have currently installed can be upgraded to the latest build, take the following steps to complete the upgrade.

1. From the terminal, remove the current CLI binary. For example, if it was installed to `/usr/local/bin/`:

    ```bash
    rm -rf /usr/local/bin/dcos
    ```

1.  Then, navigate to your DC/OS web interface and click the down arrow to the right of your cluster name in the top right corner.

    ![open cluster popup](/1.13/img/open-cluster-popup.png)

    Figure 1. Open cluster popup menu

1. Select **Install CLI** to bring up the installation commands.

    ![CLI install UI](/1.13/img/install-cli.png)

    Figure 2. Select Install CLI

1. Copy and paste the code snippets appropriate to your OS into your terminal and press the return key. This automatically downloads, moves, and runs the setup command for the cluster. The last command to run, `dcos`, will display an overview of the dcos commands.

    ![CLI copy/paste](/1.13/img/CLI-Installation-GUI_Popup_Linux-1.12.png)

    Figure 3. Code snippet window

1. Verify your cluster(s) by listing them:

    ```bash
    docs cluster list

                NAME                          ID                    STATUS    VERSION        URL           
    *  kjdskjd-ds-derr-1     0e2f90b-ded3-458b-8157-0365c8bd1ca4  AVAILABLE  1.12.0         http://example.com
       mr-clr-714024134      e71432a-8c60-48f0-bb14-ddf287775cdb  AVAILABLE  1.13-dev       http://example-1.com
    ```

# Upgrading/Downgrading to a specific version of the CLI manually

1. From the terminal, remove the current CLI binary. For example, if it was installed to `/usr/local/bin/`:

    ```bash
    rm -rf /usr/local/bin/dcos
    ```

1. Download the DC/OS CLI binary `dcos` to your working directory by running the following command and replacing `<target-os-type>` with the OS type (`darwin`, `linux`, `windows`), and `<dcos-version>` with the version (such as 1.12), that you want to use:

    ```bash
    curl https://downloads.dcos.io/binaries/cli/<target-os-type>/x86-64/dcos-<dcos-version>/dcos -o dcos
    ```

    For example, the CLI download for a mac user on DC/OS 1.12 would look like this:

    ```bash
    curl https://downloads.dcos.io/binaries/cli/darwin/x86-64/dcos-1.12/dcos -o dcos
    ```

1.  Move the CLI binary to your local directory, which should be `/usr/local/bin`:

    ```bash
    sudo mv dcos /usr/local/bin
    ```

1. Make the CLI binary executable:

    ```bash
    chmod +x /usr/local/bin/dcos
    ```

1. Verify your cluster(s) by listing them:

    ```bash
    docs cluster list

                NAME                          ID                    STATUS    VERSION        URL           
    *  kjdskjd-ds-derr-1     0e2f90b-ded3-458b-8157-0365c8bd1ca4  AVAILABLE  1.12.0         http://example.com
       mr-clr-714024134      e71432a-8c60-48f0-bb14-ddf287775cdb  AVAILABLE  1.13-dev       http://example-1.com
    ```

If your system is unable to find the executable, you may need to re-open the command prompt or add the installation directory to your PATH environment variable manually.

For information about configuration options when using the DC/OS CLI, see [Configuring the command-line interface](/1.13/cli/configure/). For information about authentication and authorization when using the DC/OS CLI, see the appropriate [Security](/1.13/security/) section.
