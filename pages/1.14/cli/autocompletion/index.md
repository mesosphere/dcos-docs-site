---
layout: layout.pug
navigationTitle:  CLI Autocompletion
title: CLI Autocompletion
menuWeight: 7
excerpt: Enabling autocompletion for the CLI
enterprise: false
render: mustache
model: /mesosphere/dcos/1.14/data.yml
---

Autocompletion for the CLI is supported for `bash` and `zsh`. This allows you to press TAB to get access to subcommands and autocomplete the ones you are writing.

For example, after enabling autcompletion, typing `dcos clus[TAB]` will give you `dcos cluster`.

You will need to have the `dcos` executable in your `$PATH` and use it with a cluster running on DC/OS 1.12 or later.

Autocompletion for the CLI only completes commands that are available (for example, the commands listed when typing `dcos` and pressing `ENTER`). If you are not attached to any cluster, only the following commands will complete: `auth`, `cluster`, `config`, `help` and `plugin`.

To complete other commands, you will have to be attached to a cluster and added the respective plugins. Completions are available for the CORE CLI plugin and the EE CLI plugin. These plugins offer static and dynamic autocompletion.

# Bash


If you want to enable autocompletion for the CLI in `bash` you must install `bash-completion`.

macOS:  `brew install bash-completion` \
Debian/Ubuntu: `apt-get install bash-completion`

To activate the completions you must add two lines to your `.profile`:
```
[ -f /usr/local/etc/bash_completion ] && . /usr/local/etc/bash_completion
eval "$(dcos completion bash)"
```


# Zsh


If you want to enable autocompletion for the CLI in `zsh` you will must add the following two lines to your `.zshrc`:

```
autoload -Uz bashcompinit && bashcompinit
eval "$(dcos completion zsh)"
```
