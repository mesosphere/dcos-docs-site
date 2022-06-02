---
layout: layout.pug
navigationTitle:  dkp completion zsh
title:  dkp completion zsh
menuWeight: 10
excerpt: Generate the autocompletion script for zsh
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp completion zsh

Generate the autocompletion script for zsh

### Synopsis

Generate the autocompletion script for the zsh shell.

If shell completion is not already enabled in your environment you will need
to enable it.  You can execute the following once:

	echo "autoload -U compinit; compinit" >> ~/.zshrc

To load completions for every new session, execute once:

#### Linux:

	dkp completion zsh > "${fpath[1]}/_dkp"

#### macOS:

	dkp completion zsh > /usr/local/share/zsh/site-functions/_dkp

You will need to start a new shell for this setup to take effect.


```
dkp completion zsh [flags]
```

### Options

```
  -h, --help              help for zsh
      --no-descriptions   disable completion descriptions
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp completion](/dkp/kommander/2.3/cli/dkp/completion/)	 - Generate the autocompletion script for the specified shell

