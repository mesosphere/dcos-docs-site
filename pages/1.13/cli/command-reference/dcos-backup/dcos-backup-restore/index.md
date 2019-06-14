---
layout: layout.pug
navigationTitle:  dcos backup restore
title: dcos backup restore
menuWeight: 30
excerpt: Restoring from a backup
enterprise: true
render: mustache
model: /data.yml
---

# Description

The `dcos backup restore` command will restore from an existing backup.

# Usage

```bash
dcos backup restore <backup id> [flags]
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

1. To restore from an existing backup, you will need the backup ID. Run the command `dcos backup list` to get a list of your backups.

    ```
    $ dcos backup list
    BACKUP ID                                        VERSION     STATUS           TIMESTAMP
    ---------                                        -------     ------           ---------
    backup2-c55c20e9-ba3f-46a6-b944-20a790b5491a     1.13.0      STATUS_READY     2019-03-18 23:15:47.639999548 +0000 UTC
    backup3-317c19df-34e4-41a0-93c9-d66c7f307208     1.13.0      STATUS_READY     2019-03-18 23:16:33.265478871 +0000 UTC
    ```

1. Then run the `dcos backup restore` command with the appropriate backup ID:

    ```bash
    $ dcos backup restore backup2-c55c20e9-ba3f-46a6-b944-20a790b5491a
    ```

    The system will not display a confirmation message.

1. However, if you run `dcos backup list` again, you will see the backup listed, which indicates that it has been restored.

    ```bash
    dcos backup list
    BACKUP ID                                        VERSION     STATUS                TIMESTAMP
    ---------                                        -------     ------                ---------
    backup2-c55c20e9-ba3f-46a6-b944-20a790b5491a     1.13.0      STATUS_READY          2019-03-18 23:15:47.639999548 +0000 UTC
    backup3-317c19df-34e4-41a0-93c9-d66c7f307208     1.13.0      STATUS_BACKING_UP     2019-03-18 23:16:33.265478871 +0000 UTC
    ```

# Parent command

| Command | Description |
|---------|-------------|
| [dcos backup](/1.13/cli/command-reference/dcos-backup/) |  Create, delete, list, restore and show backup commands. |

