---
layout: layout.pug
navigationTitle:  dkp completion bash
title:  dkp completion bash
menuWeight: 10
excerpt: Generate the autocompletion script for bash
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp completion bash

Generate the autocompletion script for bash

### Synopsis

Generate the autocompletion script for the bash shell.

This script depends on the 'bash-completion' package.
If it is not installed already, you can install it via your OS's package manager.

To load completions in your current shell session:

	source <(dkp completion bash)

To load completions for every new session, execute once:

#### Linux:

	dkp completion bash > /etc/bash_completion.d/dkp

#### macOS:

	dkp completion bash > $(brew --prefix)/etc/bash_completion.d/dkp

You will need to start a new shell for this setup to take effect.


```
dkp completion bash
```

### Options

```
  -h, --help              help for bash
      --no-descriptions   disable completion descriptions
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp completion](/dkp/kommander/2.3/cli/dkp/completion/)	 - Generate the autocompletion script for the specified shell

