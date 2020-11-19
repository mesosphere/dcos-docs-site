---
layout: layout.pug
navigationTitle:  Install CLI
title: Dispatch CLI Installation
menuWeight: 30
beta: false
excerpt: Installing the Dispatch CLI
---
You must install the Dispatch CLI before you install Dispatch itself.

To set up the Dispatch CLI, download the CLI and then move it into your PATH where it can be used.

1. Download the CLI for your platform from the [support portal](https://support.d2iq.com/s/entitlement-based-product-downloads).
1. To move the CLI into your PATH, run:

    ```bash
    chmod +x $DOWNLOADED_FILE
    sudo mv $DOWNLOADED_FILE /usr/local/bin/dispatch
    ```

# Validate Installation

To see if the Dispatch CLI is installed correctly, run:

```bash
dispatch version
```

If successful, this command will output the currently installed version of Dispatch. For example:

```bash
dispatch version
{
    "Version": "v1.2.0"
}
```
