---
layout: layout.pug
navigationTitle: Download
title: Download Kaptain
menuWeight: 5
excerpt: Learn how to download Kaptain
enterprise: false
---

<!-- markdownlint-disable MD034 -->

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. If you do not have an account yet, please contact <a href="mailto:sales@d2iq.com">sales@d2iq.com</p>

If you are deploying in a networked environment, downloads are not required and you can refer to the [install documentation][install] directly. Downloads are only necessary for customers deploying in air-gapped environments.

Downloads are available in the [Support Portal][support-portal].

## Download from the AWS Marketplace

Follow the instructions on the AWS console to download the container image. This container image contains a helm chart that can be used to install Kaptain in an air-gapped environment.

After downloading the image, run the following command to copy the binaries onto your host and obtain the chart archive.

```sh
docker run -it --rm -v $(pwd):/kaptain <container_image_name>
```

You will then see the following output:

```sh
Kaptain install package placed in the local directory. See install instructions at: https://docs.d2iq.com/dkp/kaptain/
```

You will now see the `kaptain-2.1.0.tgz` file in your working directory. Follow the [Kaptain installation instructions][install] to install Kaptain. If you have problems downloading or installing Kaptain, contact your sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a>.

This Helm chart image includes code from the MinIO Project (“MinIO”), which is © 2015-2021 MinIO, Inc. MinIO is made available subject to the terms and conditions of the [GNU Affero General Public License 3.0](https://www.gnu.org/licenses/agpl-3.0.en.html). The complete source code for the versions of MinIO packaged with Kaptain 2.1.0 are available at these URLs:
* [https://github.com/minio/operator/releases/tag/v4.0.3](https://github.com/minio/operator/releases/tag/v4.0.3)
* [https://github.com/minio/mc/releases/tag/RELEASE.2021-03-23T05-46-11Z](https://github.com/minio/mc/releases/tag/RELEASE.2021-03-23T05-46-11Z)

[support-portal]: https://support.d2iq.com/hc/en-us/
[install]: ../install/
