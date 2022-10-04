---
layout: layout.pug
navigationTitle:  dkp import image-bundle
title:  dkp import image-bundle
menuWeight: 10
excerpt: Import images from image bundles into Containerd
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp import image-bundle

Import images from image bundles into Containerd

```
dkp import image-bundle [flags]
```

### Options

```
      --containerd-namespace string   Containerd namespace to import images into (default "k8s.io")
  -h, --help                          help for image-bundle
      --image-bundle strings          Tarball containing list of images to import. Can also be a glob pattern. (default [])
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp import](/dkp/kommander/2.3/cli/dkp/import/)	 - Import images from an image bundle into Containerd

