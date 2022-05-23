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

```bash
docker run -it --rm -v $(pwd):/kaptain <container_image_name>
```

You then see the following output:

```bash
Kaptain install package placed in the local directory. See install instructions at: https://docs.d2iq.com/dkp/kaptain/
```

You see the `kubeflow-1.4.0_1.3.0.tgz` file in your working directory. Follow the [Kaptain installation instructions][install] using these binaries. If you have problems downloading or installing Kaptain, contact your sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a>.

This Docker image includes code from the MinIO Project (“MinIO”), which is © 2015-2021 MinIO, Inc. MinIO is made available subject to the terms and conditions of the [GNU Affero General Public License 3.0](https://www.gnu.org/licenses/agpl-3.0.en.html). The complete source code for the versions of MinIO packaged with Kaptain 1.3.0 are available at these URLs:
* [https://github.com/minio/operator/releases/tag/v4.0.3](https://github.com/minio/operator/releases/tag/v4.0.3)
* [https://github.com/minio/mc/releases/tag/RELEASE.2021-03-23T05-46-11Z](https://github.com/minio/mc/releases/tag/RELEASE.2021-03-23T05-46-11Z)

[support-portal]: https://support.d2iq.com/hc/en-us/
[install]: ../install/konvoy-dkp/
