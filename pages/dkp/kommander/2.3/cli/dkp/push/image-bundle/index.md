---
layout: layout.pug
navigationTitle:  dkp push image-bundle
title:  dkp push image-bundle
menuWeight: 10
excerpt: Push images from an image bundle into an existing image registry
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp push image-bundle

Push images from an image bundle into an existing image registry

```
dkp push image-bundle [flags]
```

### Options

```
      --ecr-lifecycle-policy-file string       File containing ECR lifecycle policy for newly created repositories (only applies if target registry is hosted on ECR, ignored otherwise)
  -h, --help                                   help for image-bundle
      --image-bundle string                    Tarball containing list of images to push
      --to-registry string                     Registry to push images to
      --to-registry-insecure-skip-tls-verify   Skip TLS verification of registry to push images to (use for http registries)
      --to-registry-password string            Password to use to log in to destination registry
      --to-registry-username string            Username to use to log in to destination registry
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp push](/dkp/kommander/2.3/cli/dkp/push/)	 - Push one of [chart, chart-bundle, image-bundle]

