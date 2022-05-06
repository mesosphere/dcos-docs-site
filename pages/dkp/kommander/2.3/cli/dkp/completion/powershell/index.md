---
layout: layout.pug
navigationTitle:  dkp completion powershell
title:  dkp completion powershell
menuWeight: 10
excerpt: Generate the autocompletion script for powershell
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp completion powershell

Generate the autocompletion script for powershell

### Synopsis

Generate the autocompletion script for powershell.

To load completions in your current shell session:

	dkp completion powershell | Out-String | Invoke-Expression

To load completions for every new session, add the output of the above command
to your powershell profile.


```
dkp completion powershell [flags]
```

### Options

```
  -h, --help              help for powershell
      --no-descriptions   disable completion descriptions
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp completion](/dkp/kommander/2.2/cli/dkp/completion/)	 - Generate the autocompletion script for the specified shell

