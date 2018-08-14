---
layout: layout.pug
navigationTitle:  dcos
title: dcos
menuWeight: 0
excerpt: Managing DC/OS environment variables


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

 --version
      Print version information
  -v, -vv
      Output verbosity (verbose or very verbose)


| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `--version`   |             |  Print version information. |
| `--help, h`   |             |  Print usage. |
|  `-v, -vv`  |             |  Output verbosity (verbose or very verbose).  |

`<log-level>`
The severity levels are:

* debug    Prints all messages.
* info     Prints informational, warning, error, and critical messages.
* warning  Prints warning, error, and critical messages.
* error    Prints error and critical messages.
* critical Prints only critical messages to stderr.
