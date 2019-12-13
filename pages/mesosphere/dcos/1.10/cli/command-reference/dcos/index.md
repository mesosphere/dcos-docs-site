---
layout: layout.pug
navigationTitle:  dcos
title: dcos
menuWeight: 0
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


# Description
Command line utility for the Mesosphere Distributed Cloud Operating System (DC/OS).

# Usage

``` bash
dcos [options] [<command>] [<args>...]
```

Running the command without options, commands, or arguments prints the available commands.

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
