---
layout: layout.pug
navigationTitle:  CLI Autocompletion
title: CLI Autocompletion
menuWeight: 7
excerpt: Enabling autocompletion for the CLI
enterprise: false
---

Autocompletion for the CLI is supported for `bash` and `zsh`.
It was released with the 1.12 release so the CLI must be version 0.7.x or later. Please see the [DC/OS CLI Binaries page](https://downloads.dcos.io/cli/index.html) for a correct version. You will also need to have the `dcos` executable in your `$PATH`.

Autocompletion for the CLI will only complete commands that are available at the time of completion. If you are not attached to any cluster, only the following commands will be able to complete: `auth`, `cluster`, `config`, `help` and `plugin`. To complete other commands you must be attached to a cluster and hae added the respective plugins.

Completions are available for the CORE CLI plugin and the EE CLI plugin.

# Bash #


If you want to enable autocompletion for the CLI in `bash` you must install `bash-completion`.

macOS:  `brew install bash-completion` \
Debian/Ubuntu: `apt-get install bash-completion`

Now to activate the completions you must add two lines to your `.profile`:
```
[ -f /usr/local/etc/bash_completion ] && . /usr/local/etc/bash_completion
eval "$(dcos completion bash)"
```


# Zsh #


If you want to enable autocompletion for the CLI in `zsh` you must add the following two lines to your `.zshrc`:

```
autoload -Uz bashcompinit && bashcompinit
eval "$(dcos completion zsh)"
```
