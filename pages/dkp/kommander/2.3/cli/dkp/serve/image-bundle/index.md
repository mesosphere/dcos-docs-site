---
layout: layout.pug
navigationTitle:  dkp serve image-bundle
title:  dkp serve image-bundle
menuWeight: 10
excerpt: Serve an OCI registry from image bundles
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp serve image-bundle

Serve an OCI registry from image bundles

```
dkp serve image-bundle [flags]
```

### Options

```
  -h, --help                          help for image-bundle
      --image-bundle strings          Tarball of images to serve. Can also be a glob pattern. (default [])
      --listen-address string         Address to listen on (default "localhost")
      --listen-port uint16            Port to listen on (0 means use any free port)
      --tls-cert-file string          TLS certificate file
      --tls-private-key-file string   TLS private key file
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp serve](/dkp/kommander/2.3/cli/dkp/serve/)	 - Serve image or Helm chart bundles from an OCI registry

