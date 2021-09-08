---
layout: layout.pug
navigationTitle: Override Files
title: Override Files
excerpt: Learn how to use override files with Konvoy
beta: false
enterprise: false
menuWeight: 75
---
## Override files

The konvoy-image-builder is used to install the basic components required to run Konvoy. You can specify customization of the images through the use of override files, which are used to specify alternate package libraries, docker image repos, and other customizations. Konvoy comes with a default override file for use with [FIPS](../../fips/), and another for use with Nvidia.
