---
layout: layout.pug
navigationTitle:  dcos backup list
title: dcos backup list
menuWeight: 30
excerpt: Listing backups
enterprise: true
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---

# Description
The `dcos backup list` command will list all known backups.

# Usage

```bash
dcos backup list [prefix] [flags]
```

# Options

| Name | Description |
|---------|-------------|
| `--help, h`   |  Display help for this command. |
| `--json` | Display output in JSON format. |

## Positional Arguments

| Name | Description |
|---------|-------------|
| `prefix` | Identifying prefix attached to file name for sorting purposes. |


# Example

## List all backups

```bash
$ dcos backup list
BACKUP ID                                         VERSION     STATUS           TIMESTAMP
---------                                         -------     ------           ---------
backup-1-fd4bdc87-889c-48c3-a656-9f8e96474b27     1.13.0      STATUS_READY     2019-03-18 23:06:41.836197172 +0000 UTC
backup2-c55c20e9-ba3f-46a6-b944-20a790b5491a      1.13.0      STATUS_READY     2019-03-18 23:15:47.639999548 +0000 UTC
backup3-317c19df-34e4-41a0-93c9-d66c7f307208      1.13.0      STATUS_BACKING_UP     2019-03-18 23:16:33.265478871 +0000 UTC
```

## List only backups starting with 'backup-'

```
dcos backup list backup-
BACKUP ID                                         VERSION     STATUS           TIMESTAMP
---------                                         -------     ------           ---------
backup-1-fd4bdc87-889c-48c3-a656-9f8e96474b27     1.13.0      STATUS_READY     2019-03-18 23:06:41.836197172 +0000 UTC
```

# Parent command

| Command | Description |
|---------|-------------|
| [dcos backup](/mesosphere/dcos/2.0/cli/command-reference/dcos-backup/) |  Create, delete, list, restore and show backup commands. |

