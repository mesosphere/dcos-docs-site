---
layout: layout.pug
navigationTitle:  dcos backup delete
title: dcos backup delete
menuWeight: 20
excerpt: Deleting backups 
enterprise: true
---

# Description

The `dcos backup delete` command will delete an existing backup.

# Usage

```
dcos backup delete <backup id> [flags]
```

# Options

| Name | Description |
|---------|-------------|
| `--help, h`   |  Display help for this command. |
| `<backup id>` | ID number or label of existing backup. |

# Example

To find the backup ID for an existing backup, run `dcos backup list`:

```bash
$ dcos backup list
BACKUP ID                                         VERSION     STATUS           TIMESTAMP
---------                                         -------     ------           ---------
backup-1-fd4bdc87-889c-48c3-a656-9f8e96474b27     1.12.0      STATUS_READY     2019-03-18 23:06:41.836197172 +0000 UTC
backup2-c55c20e9-ba3f-46a6-b944-20a790b5491a     1.12.0      STATUS_READY          2019-03-18 23:15:47.639999548 +0000 UTC
backup3-317c19df-34e4-41a0-93c9-d66c7f307208     1.12.0      STATUS_BACKING_UP     2019-03-18 23:16:33.265478871 +0000 UTC
```

Use the backup ID to delete the backup:

```
dcos backup delete backup-1-fd4bdc87-889c-48c3-a656-9f8e96474b27
```

The backup will be deleted but there will be no confirmation output. However, if you run `dcos backup list` again, you will not see the backup listed, which indicates that it has been removed.

```bash
dcos backup list
BACKUP ID                                        VERSION     STATUS                TIMESTAMP
---------                                        -------     ------                ---------
backup2-c55c20e9-ba3f-46a6-b944-20a790b5491a     1.12.0      STATUS_READY          2019-03-18 23:15:47.639999548 +0000 UTC
backup3-317c19df-34e4-41a0-93c9-d66c7f307208     1.12.0      STATUS_BACKING_UP     2019-03-18 23:16:33.265478871 +0000 UTC
```
