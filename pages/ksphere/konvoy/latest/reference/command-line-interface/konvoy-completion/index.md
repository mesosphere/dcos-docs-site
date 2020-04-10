---
layout: layout.pug
navigationTitle: konvoy completion
title: konvoy completion
menuWeight: 10
notes: Automatically generated, DO NOT EDIT
enterprise: false
excerpt: Output shell completion code for the specified shell (bash or zsh)
---

## konvoy completion

Output shell completion code for the specified shell (bash or zsh)

### Synopsis

Output shell completion code for the specified shell (bash or zsh).
The shell code must be evaluated to provide interactive completion of konvoy commands.
This can be done by sourcing it from the .bash_profile.
Note for zsh users: [1] zsh completions are only supported in versions of zsh >= 5.2

```
konvoy completion SHELL
```

### Examples

```
  # Installing bash completion on macOS using homebrew
  ## If running Bash 3.2 included with macOS
      brew install bash-completion
  ## or, if running Bash 4.1+
      brew install bash-completion@2
  # Installing bash completion on Linux
  ## If bash-completion is not installed on Linux, please install the 'bash-completion' package
  ## via your distribution's package manager.
  ## Load the konvoy completion code for bash into the current shell
      source <(konvoy completion bash)
  # Load the konvoy completion code for zsh[1] into the current shell
      source <(konvoy completion zsh)
```

### Options

```
  -h, --help   help for completion
```

### SEE ALSO

* [konvoy](../)	 - deploy and manage Kubernetes clusters

