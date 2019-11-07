---
layout: layout.pug
navigationTitle:  CLI 自动完成
title: CLI 自动完成
menuWeight: 7
excerpt: 启用 CLI 自动完成
enterprise: false
render: mustache
model：/mesosphere/dcos/2.0/data.yml
---

支持 CLI 的自动完成以运行 `bash` 和 `zsh`。这允许您按 TAB 键获取子命令的访问权限，并自动完成正在写入的命令。

例如，启用自动完成后，键入 `dcos clus[TAB]` 将为您提供 `dcos cluster`。

您将需要使 `dcos` 在您的 `$PATH` 中可执行，并将其与 DC/OS 1.12 或更高版本上运行的群集配合使用。

CLI 的自动完成只完成可用的命令（例如，键入 `dcos` 及按下 `ENTER` 时列出的命令）。如果未连接到任何群集，则只能完成以下命令：`auth`、`cluster`、`config`、`help` 和 `plugin`。

要完成其他命令，您必须将其连接到群集，并添加相应插件。完成可用于 CORE CLI 插件和 EE CLI 插件。这些插件提供静态和动态自动完成。

# Bash


如果要在 `bash` 中为 CLI 启用自动完成，则必须安装 `bash-completion`。

macOS: `brew install bash-completion` \
Debian/Ubuntu: `apt-get install bash-completion`

要激活完成，您必须为 `.profile` 添加两行：
```
[ -f /usr/local/etc/bash_completion ] && . /usr/local/etc/bash_completion
eval "$(dcos completion bash)"
```


# Zsh


如果要在 `zsh` 中为 CLI 启用自动完成，则必须为 `.zshrc` 添加以下两行：

```
autoload -Uz bashcompinit && bashcompinit
eval "$(dcos completion zsh)"
```
