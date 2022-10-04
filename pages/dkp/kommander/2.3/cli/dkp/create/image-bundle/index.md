---
layout: layout.pug
navigationTitle:  dkp create image-bundle
title:  dkp create image-bundle
menuWeight: 10
excerpt: Create an image bundle
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp create image-bundle

Create an image bundle

```
dkp create image-bundle [flags]
```

### Options

```
  -h, --help                     help for image-bundle
      --images-file string       File containing list of images to create bundle from, either as YAML configuration or a simple list of images
      --output-file string       Output file to write image bundle to (default "images.tar")
      --overwrite                Overwrite image bundle file if it already exists
      --platform platformSlice   platforms to download images (required format: <os>/<arch>[/<variant>]) (default [linux/amd64])
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp create](/dkp/kommander/2.3/cli/dkp/create/)	 - Create one of [appdeployment, bootstrap, capi-components, chart-bundle, cluster, image-bundle, nodepool, workspace]

