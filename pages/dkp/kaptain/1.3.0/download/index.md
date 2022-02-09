---
layout: layout.pug
navigationTitle: Download
title: Download Kaptain
menuWeight: 5
excerpt: Learn how to download Kaptain
enterprise: false
---

Kaptain downloads are only available to licensed customers. To get an evaluation license for Kaptain, contact <a href="mailto:sales@d2iq.com">sales@d2iq.com</a>.

If you already have a license, downloads are available in the [Support Portal][support-portal].

## Download from the AWS Marketplace

Follow the instructions on AWS console to download the container image.

After downloading the image, run the following command to copy the binaries onto your host.

```sh
docker run -it --rm -v $(pwd):/kaptain <container_image_name>
```

You then see the following output:

```sh
Kaptain install package placed in the local directory. See install instructions at: https://docs.d2iq.com/dkp/kaptain/
```

You see the `kubeflow-1.4.0_1.3.0.tgz` file in your working directory. Follow the [Kaptain installation instructions][install] using these binaries. If you have problems downloading or installing Kaptain, contact your sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a>.

[support-portal]: https://support.d2iq.com/hc/en-us/
[install]: ../install/konvoy-dkp/
