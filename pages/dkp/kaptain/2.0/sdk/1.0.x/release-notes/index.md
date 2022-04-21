---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
beta: false
menuWeight: 0
---

Kaptain SDK 1.0.0 Release Notes

### New Features
* Support for model building/deploying using non-deep learning frameworks
* Added support for new frameworks: scikit-learn, XGBoost, MXNet, LightGBM and ONNX
* Added two new tutorials: [Developing and deploying scikit-learn models with Kaptain SDK][quick-start] and [Build Docker Images with Kaptain SDK][image-builder]

### Breaking changes
`Model.framework` property type has been changed from `str` to `ModelFramework(Enum)` and need to be updated based on the actual model framework, e.g:

```
from kaptain.model.frameworks import ModelFramework

model = Model(
    id="dev/mnist",
    name="MNIST",
    description="MNIST Model",
    version="0.0.1",
    framework=ModelFramework.SKLEARN,
    framework_version="0.24.2",
    ...
)
```

[quick-start]: ../../../tutorials/sdk/quick-start
[image-builder]: ../../../tutorials/sdk/image-builder
