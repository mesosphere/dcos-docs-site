---
layout: layout.pug
navigationTitle: Environment variables
title: Environment variables
menuWeight: 11
enterprise: false
beta: false
excerpt: Configure the Konvoy CLI with environment variables
---

The Konvoy CLI can be configured with the following environment variables:

## KONVOY_DISABLE_HOST_CA

**This environment variable is only used on Linux.**

Set `KONVOY_DISABLE_HOST_CA=true` or `KONVOY_DISABLE_HOST_CA=1` to use the CA bundle included with the Konvoy CLI instead of your operating system's default CA bundle.
