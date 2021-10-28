---
layout: layout.pug
navigationTitle: Git Repo Structure
title: Git Repo Structure
menuWeight: 20
excerpt: Git repository structure
---

This section documents the required structure for a git repository to create Kommander Apps from user-defined apps, so that you can use AppDeployments to enable or disable them:

- Apps must be created under the services/ dir
- Apps should be versioned by dirs, for example services/<app>/<version>/
- Resource names must be set to `${releaseName}` variables, otherwise deploying multiple instances and/or versions of the same app will not work properly.
