---
layout: layout.pug
navigationTitle: Download
title: Download Kommander
menuWeight: 2
excerpt: Learn how to download Kommander
beta: false
enterprise: false
---

<!-- markdownlint-disable MD034 -->

To download a new version of Kommander, you have 2 options:

## Download from the support website

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download Kommander[/button]

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product.</p>

## Download from the AWS Marketplace

Follow the instructions on AWS console to download the container image.

After downloading the image, run the following command to copy the binaries onto your host.

```docker
docker run -it --rm -u $(id -u):$(id -g) -v $(pwd):/dkp $CONTAINER_IMAGES
```

You will then see the following output:

```sh
dkp and kommander binaries placed in the local directory, to run:
./dkp --help
./kommander --help
```

You will now see two binaries: `dkp` and `kommander` in your working directory. Follow the [Kommander installation instructions](../install/networked) using these binaries, and then [add your license](../licensing/add/) to Kommander. If you have problems downloading or installing Kommander, contact your sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a>.
