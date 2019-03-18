---
layout: layout.pug
navigationTitle:  dcos config validate
title: dcos config validate
menuWeight: 4
excerpt: Validating changes to the configuration file

enterprise: false
---

# Description
The `dcos config validate` command will validate changes to the configuration file.

# Usage

```bash
dcos config validate
```
You will get a message that your configuration has been validated:

```
dcos config validate
Validating /Users/<username>/.dcos/clusters/00548eb6-0001-47f8-9076-d57b56752325/dcos.toml ...
Congratulations, your configuration is valid!
```

# Parent command

| Command | Description |
|---------|-------------|
| [dcos config](/1.12/cli/command-reference/dcos-config/) |  Manage DC/OS configuration. |
