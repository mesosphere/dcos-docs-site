---
layout: layout.pug
navigationTitle: Download
title: Download DKP
menuWeight: 30
excerpt: Learn how to download DKP
beta: false
enterprise: false
---

To download a new version of DKP, you have 2 options:

## Download from the support website

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download DKP[/button]

<p class="message--note"><strong>NOTE: </strong>In DKP 2.2, the Konvoy and Kommander binaries have been merged into a single binary, which you can find by selecting the Download DKP button above.
You must be a registered user and logged on to the support portal to download DKP. New customers must contact their sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download or install this product.
If you have problems downloading DKP, contact your sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a>.</p>

## Download from the command line

You can download image bundle files by running the following CLI command:

    ```bash
    wget "https://downloads.d2iq.com/dkp/v2.2.0/kommander-image-bundle-v2.2.0.tar.gz" -O kommander-image-bundle.tar.gz
    ```

## Download from the AWS Marketplace

Follow the instructions on AWS console to download the container image.

After downloading the image, run the following command to copy the binaries onto your host.

```docker
docker run -it --rm -u $(id -u):$(id -g) -v $(pwd):/dkp $CONTAINER_IMAGES
```

You will then see the following output:

```sh
dkp binary is placed in the local directory, to run:
./dkp --help
```

You will now see the `dkp` binary in your working directory. Follow the [Kommander installation instructions](../install/networked) using these binaries, and then [add your license](../licensing/add/) to Kommander. If you have problems downloading or installing Kommander, contact your sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a>.

This Docker image includes code from the MinIO Project (“MinIO”), which is © 2015-2021 MinIO, Inc. MinIO is made available subject to the terms and conditions of the [GNU Affero General Public License 3.0][https://www.gnu.org/licenses/agpl-3.0.en.html]. The complete source code for MinIO is available for the [2021 release][[https://github.com/minio/minio/tree/RELEASE.2020-12-03T05-49-24Z] of DKP/Kommander and the [2022 release][https://github.com/minio/minio/tree/RELEASE.2021-07-30T00-02-00Z] of DKP/Kommander.
