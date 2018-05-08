---
layout: layout.pug
navigationTitle:  dcos
title: dcos
menuWeight: 0
excerpt: How to manage DC/OS environment variables.


enterprise: false
---

<!-- The source repo for this topic is https://github.com/dcos/dcos-docs -->

# Description
The dcos command helps you manage DC/OS environment variables.

# Usage

``` bash
dcos [options] [<command>] [<args>...]
```

# Options

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `--debug`   |             |  Enable debug mode. |
| `--help, h`   |             |  Print usage. |
| `--log-level=<log-level>`  |             | Set the logging level. This setting does not affect the output sent to stdout.  |
|  `--version, v`  |             |  Print version information.  |

`<log-level>`
The severity levels are:

* debug    Prints all messages.
* info     Prints informational, warning, error, and critical messages.
* warning  Prints warning, error, and critical messages.
* error    Prints error and critical messages.
* critical Prints only critical messages to stderr.
