---
layout: layout.pug
navigationTitle:  dcos task download
title: dcos task download
menuWeight: 2
excerpt: Download files from the Mesos task sandbox directory

enterprise: false
---

# Description
The `dcos task download` command downloads files from the Mesos task sandbox directory.

# Usage

```bash
dcos task download <task> [<path>] [OPTION]
```

# Options

| Name, shorthand |  Description |
|---------|-------------|
| `--target-dir`   | Specifies the target directory of the download. Defaults to the current working directory (`$PWD`). |


# Positional arguments

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `<task>`   |             | Specifies a full task ID, a partial task ID, or a UNIX shell wildcard pattern (for example, `my-task*`). |
| `<path>`   |     `/`      | Specifies the Mesos sandbox directory path to a file or directory. You can also specify the path using a UNIX shell wildcard pattern (for example, `/std*`)|

# Parent command

| Command | Description |
|---------|-------------|
| [dcos task](/mesosphere/dcos/1.14/cli/command-reference/dcos-task/)   | Manage DC/OS tasks. |
