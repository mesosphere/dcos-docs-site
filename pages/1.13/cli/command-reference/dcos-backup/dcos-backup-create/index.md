---
layout: layout.pug
navigationTitle:  dcos backup create
title: dcos backup create
menuWeight: 10
excerpt: Creating backups
enterprise: true
render: mustache
model: /data.yml
---

# Description

The `dcos backup create` command creates a new [backup of your cluster](/1.13/administering-clusters/backup-and-restore/).

# Usage

```
dcos backup create --label [label] [flags]
```

# Options

| Name | Description |
|---------|-------------|
| `--help, h`   |  Display help for this command. |
| `--label string` | The label to attach to the backup. |

# Example

When you run the `dcos backup create` command, you must specify a label for each backup. When the command is run, no confirmation output will appear. However, you can run `dcos backup list` to see if your backup has been created.

```bash
$ dcos backup create --label backup-1
$ dcos backup list
BACKUP ID                                         VERSION     STATUS                TIMESTAMP
---------                                         -------     ------                ---------
backup-1-fd4bdc87-889c-48c3-a656-9f8e96474b27     1.13.0      STATUS_BACKING_UP     2019-03-18 23:06:41.836197172 +0000 UTC
```

# Parent command

| Command | Description |
|---------|-------------|
| [dcos backup](/1.13/cli/command-reference/dcos-backup/) |  Create, delete, list, restore and show backup commands. |


