---
layout: layout.pug
navigationTitle:  dcos backup show
title: dcos backup show
menuWeight: 50
excerpt: Viewing details of a backup 
enterprise: true
---

# Description

The `dcos backup show` command shows the details of a specified backup.

# Usage

```bash
dcos backup show <backup id> [flags]
```

# Options

| Name | Description |
|---------|-------------|
| `--help, h`   |  Display help for this command. |

## Positional Arguments

| Name | Description |
|---------|-------------|
| `<backup id>` | ID number or label of existing backup. |

# Example

1. To find the backup ID for all your backups, run `dcos backup list`.

    ```bash
    $ dcos backup list
    BACKUP ID                                        VERSION     STATUS           TIMESTAMP
    ---------                                        -------     ------           ---------
    backup2-c55c20e9-ba3f-46a6-b944-20a790b5491a     1.12.0      STATUS_READY     2019-03-18 23:15:47.639999548 +0000 UTC
    backup3-317c19df-34e4-41a0-93c9-d66c7f307208     1.12.0      STATUS_READY     2019-03-18 23:16:33.265478871 +0000 UTC
    ```

1. Now you can run your `dcos backup show` command with the backup ID:

    ```json
    $ dcos backup show backup3-317c19df-34e4-41a0-93c9-d66c7f307208
    {
        "dcos_version": "1.12.0",
        "id": "backup3-317c19df-34e4-41a0-93c9-d66c7f307208",
        "component_status": {
            "marathon": {
                "status": "STATUS_READY"
            }
        },
        "timestamp": "2019-03-18T23:16:33.265478871Z",
        "status": "STATUS_READY"
    }
    ```

# Parent command

| Command | Description |
|---------|-------------|
| [dcos backup](/1.12/cli/command-reference/dcos-backup/) |  Create, delete, list, restore and show backup commands. |

