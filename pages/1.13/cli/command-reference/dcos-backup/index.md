---
layout: layout.pug
navigationTitle:  dcos backup
title: dcos backup
menuWeight: 2
excerpt: Creating backups and restoring from them

enterprise: true
---


## dcos backup
The `dcos backup` command will let you create backups and restore from them.

```
dcos backup
Usage:
    dcos backup --help
    dcos backup --info
    dcos backup --version
    dcos backup create --label=<backup-label>
    dcos backup restore <id>
    dcos backup list [--json] [<prefix>]
    dcos backup show [--json] <id>
    dcos backup delete <id>
```

*Table 1 - Options*

| Name | Description |
|---------|-------------|
| `--help, h`   |  Display usage. |
| `--info` | Display options. |
|  `--version`  |  Display version information.  |
| `create` | Create a backup. The --label=<backup-label> option will assign a label to the backup.|
| `restore` | Restore a specific backup. <id> is the unique identifier for a backup. |
| `list` | Displays a list of all backups. Use this option to verify that your backup has been created.  |
| `show` | Displays a list of backup IDs. |
| `delete` | Deletes a specific backup. <id> is the unique identifier for a backup. |


For information on how to create backups from the CLI, see [Backup and Restore CLI](/1.13/administering-clusters/backup-and-restore/backup-restore-cli/). The limitations of this process can be found in the [Backup and Restore Limitations section](/1.13/administering-clusters/backup-and-restore/#limitations).
