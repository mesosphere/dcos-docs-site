---
layout: layout.pug
navigationTitle: Create AMI
title: Create a custom AMI
excerpt: Learn how to build a custom AMI for use with Konvoy
beta: true
enterprise: false
menuWeight: 60
---

This procedure describes how to use the Konvoy Image Builder to create a [Cluster API](https://cluster-api.sigs.k8s.io/) compliant Amazon Machine Image (AMI). AMI images contain configuration information and software to create a specific, pre-configured, operating environment. For example, you can create an AMI image of your current computer system settings and software. The AMI image can then be replicated and distributed, creating your computer system for other users. The Konvoy Image Builder uses variable [`overrides`][overrides] to specify base image and container images to use in your new AMI.

## Prerequisites

Before you begin, you must:

-   Download the latest [Konvoy Image Builder](https://github.com/mesosphere/konvoy-image-builder/releases) bundle (prefixed with `konvoy-image-bundle`) for your OS. Do not use the release prefixed with `konvoy-image-builder`.

-   Create a working `Docker` setup.

## Extract AMI Bundle

Extract the bundle and `cd` into the extracted `konvoy-image-bundle-$VERSION_$OS` folder. The bundled version of `konvoy-image` contains an embedded `docker` image that contains all the requirements for building.

<p class="message--note"><strong>NOTE: </strong> The <code>konvoy-image</code> binary and all supporting folders are also extracted. When run, <code>konvoy-image</code> bind mounts the current working directory (<code>${PWD}</code>) into the container to be used.</p>

-   Set environment variables for [AWS access](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html). The following variables must be set using your credentials:

    ```bash
    export AWS_ACCESS_KEY_ID
    export AWS_SECRET_ACCESS_KEY
    export AWS_DEFAULT_REGION
    ```

-   Ensure you have an [override file](../override-files) to configure specific attributes of your AMI file.

## Build the image

Run the `konvoy-image` command to build and validate the image.

```sh
konvoy-image build --overrides override-source-ami.yaml --overrides override-images.yaml images/ami/centos-7.yaml
```

By default it builds in the `us-west-2` region. to specify another region set the `--region` flag:

```sh
konvoy-image build --region us-east-1 --overrides override-source-ami.yaml --overrides override-images.yaml images/ami/centos-7.yaml
```

When the command is complete the `ami` id is printed and written to `./manifest.json`.

## Related information

For information on related topics or procedures, refer to the following:

- [Creating GPU enabled on-premises configurations](../../choose-infrastructure/aws/gpu)

<!--- ## Air Gapped

TBD (for air gapped a larger set of `extra_images` are required.) -->
[overrides]: ../override-files/
