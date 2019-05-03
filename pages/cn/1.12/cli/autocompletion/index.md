---
layout: layout.pug
navigationTitle:  CLI Autocompletion
title: CLI Autocompletion
menuWeight: 7
excerpt: 启用 CLI 自动完成
enterprise: false
---

支持 CLI `bash` 和 `zsh` 的自动完成功能。
该功能随 1.12 版本一起发布，因此 CLI 必须是 0.7.x 或更高版本。请参阅 [DC/OS CLI 二进制文件页面](https://downloads.dcos.io/cli/index.html)获取正确版本。您还需要在 `$PATH` 中带有 `dcos` 可执行文件。

CLI 的自动完成只会执行在完成时可用的命令。如果未连接到任何群集，则只能完成以下命令：`auth`、`cluster`、`config`、`help` 和 `plugin`。要完成其他命令，您必须将其连接到群集，并添加相应插件。

完成可用于 CORE CLI 插件和 EE CLI 插件。

# Bash #


如果要在 `bash` 中为 CLI 启用自动完成，则必须安装 `bash-completion`。

macOS: `brew install bash-completion` \
Debian/Ubuntu: `apt-get install bash-completion`

现在要激活完成，您必须在 `.profile` 中添加两行：
```
[ -f /usr/local/etc/bash_completion ] && . /usr/local/etc/bash_completion
eval "$(dcos completion bash)"
```


# Zsh #


如果要在 `zsh` 中启用 CLI 自动完成，必须在 `.zshrc` 中加入以下两行：

```
autoload -Uz bashcompinit && bashcompinit
eval "$(dcos completion zsh)"
```
