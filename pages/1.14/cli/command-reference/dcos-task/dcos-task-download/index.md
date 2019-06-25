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
| `--target-dir`   | Target directory of the download. Defaults to `$PWD`. |


# Positional arguments

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `<task>`   |             |  A full task ID, a partial task ID, or a regular expression. |
| `<path>`   |     `/`      |  The Mesos sandbox directory path to a file or directory. Can be a UNIX shell wildcard pattern (e.g. `/std*`)|

# Parent command

| Command | Description |
|---------|-------------|
| [dcos task](/1.14/cli/command-reference/dcos-task/)   | Manage DC/OS tasks. |
