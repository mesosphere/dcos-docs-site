---
layout: layout.pug
navigationTitle:  dkp serve image-bundle
title:  dkp serve image-bundle
menuWeight: 10
excerpt: Serve an image registry
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp serve image-bundle

Serve an image registry

```
dkp serve image-bundle [flags]
```

### Options

```
  -h, --help                          help for image-bundle
      --image-bundle string           Tarball containing list of images to push
      --listen-address string         Address to list on (default "localhost")
      --listen-port uint16            Port to listen on (0 means use any free port)
      --tls-cert-file string          TLS certificate file
      --tls-private-key-file string   TLS private key file
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp serve](/dkp/kommander/2.3/cli/dkp/serve/)	 - Serve an image registry

