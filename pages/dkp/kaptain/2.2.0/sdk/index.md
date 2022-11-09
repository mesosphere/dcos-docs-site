---
layout: layout.pug
navigationTitle: SDK
title: Kaptain SDK
menuWeight: 40
excerpt: Kaptain SDK Documentation
---

The Kaptain SDK provides a high-level API to support model development workflows and deals with Kubernetes specifics for the
users' benefit. The main building blocks required for model development are a user-provided model definition,
training source code, and a configured instance of the `Model` class from the SDK.

The SDK automatically packs user-provided files into a Docker image which is then used in the model training and
tuning. The SDK also provides utilities to simplify the export of the trained models to the supported storage locations.

To dive in to the Kaptain SDK, please follow the [Kaptain SDK tutorials](../tutorials/sdk/) for your desired training framework.
