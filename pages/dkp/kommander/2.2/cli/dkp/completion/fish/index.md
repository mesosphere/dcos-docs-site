---
layout: layout.pug
navigationTitle:  dkp completion fish
title:  dkp completion fish
menuWeight: 10
excerpt: Generate the autocompletion script for fish
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp completion fish

Generate the autocompletion script for fish

### Synopsis

Generate the autocompletion script for the fish shell.

To load completions in your current shell session:

	dkp completion fish | source

To load completions for every new session, execute once:

	dkp completion fish > ~/.config/fish/completions/dkp.fish

You will need to start a new shell for this setup to take effect.


```
dkp completion fish [flags]
```

### Options

```
  -h, --help              help for fish
      --no-descriptions   disable completion descriptions
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp completion](/dkp/kommander/2.2/cli/dkp/completion/)	 - Generate the autocompletion script for the specified shell

