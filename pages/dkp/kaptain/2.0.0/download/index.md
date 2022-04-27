---
layout: layout.pug
navigationTitle: Download
title: Download Kaptain
menuWeight: 5
excerpt: Learn how to download Kaptain
enterprise: false
---

<!-- markdownlint-disable MD034 -->

Kaptain downloads are only available to licensed customers. To obtain an evaluation license for Kaptain, please contact <a href="mailto:sales@d2iq.com">sales@d2iq.com</a>.

If you already have a license, downloads are available in the [Support Portal][support-portal].

## Download from the AWS Marketplace

Follow the instructions on AWS console to download the container image. This container image contains a helm chart that can be used to install Kaptain in an air gapped environment.

After downloading the image, run the following command to copy the binaries onto your host to obtain the chart archive.

```sh
docker run -it --rm -v $(pwd):/kaptain <container_image_name>
```

You will then see the following output:

```sh
Kaptain install package placed in the local directory. See install instructions at: https://docs.d2iq.com/dkp/kaptain/
```

You will now see the `kaptain-2.0.0.tgz` file in your working directory. Follow the [Kaptain installation instructions][install] to install Kaptain. If you have problems downloading or installing Kaptain, contact your sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a>.

[support-portal]: https://support.d2iq.com/hc/en-us/
[install]: ../install/
