---
layout: layout.pug
navigationTitle:  dkp helmmirror
title:  dkp helmmirror
menuWeight: 10
excerpt: Commands related to Kommander's internal helm mirror
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp helmmirror

Commands related to Kommander's internal helm mirror

### Synopsis

Manipulation of the Kommander's internal helm mirror - uploading/deleting/listing charts stored in it and creating/uploading chart bundles to the mirror.

### Options

```
      --config string            Config file to use
      --context string           The name of the kubeconfig context to use
  -h, --help                     help for helmmirror
      --kubeconfig string        Path to the kubeconfig file to use for CLI requests.
      --request-timeout string   The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp](/dkp/kommander/2.2/cli/dkp/)	 - 
* [dkp helmmirror create](/dkp/kommander/2.2/cli/dkp/helmmirror/create/)	 - Create a bundle
* [dkp helmmirror delete](/dkp/kommander/2.2/cli/dkp/helmmirror/delete/)	 - Delete a chart from the repository
* [dkp helmmirror get](/dkp/kommander/2.2/cli/dkp/helmmirror/get/)	 - Get charts from the repository
* [dkp helmmirror upload](/dkp/kommander/2.2/cli/dkp/helmmirror/upload/)	 - Upload one of [chart, bundle]

