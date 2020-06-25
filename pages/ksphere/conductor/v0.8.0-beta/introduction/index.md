---
layout: layout.pug
navigationTitle: Introducing Conductor
title: Introducing Conductor
menuWeight: 05
beta: true
excerpt: (Beta) Introducing Conductor
---

D2iQ’s Conductor is a distributed learning platform that enables you to train your team using interactive cloud-native content - using a mix of traditional documentation, video training, self-guided labs, quizzes and tests - all served in a web-based single-page integrated learning environment.

# Conductor features and benefits
This is the Beta release of Conductor's self-hosted offering, featuring the following new capabilities:
- **Easy on-prem/cloud installation**:
    Operators can now install Conductor on their own Kubernetes cluster using only Helm 2.x. See [Setup]() for more information.

- **File Editor**:
    Learners can view, edit, and save files in their training environment workspaces from the easy-to-use *File Editor* GUI tab.

- **Sign-up Link Tool**:
    Administrators can now invite any number of learners to use Conductor by generating and then sharing a disposable sign-up link from the *Admin Portal* page.

# Known Issues
The following are known issues in the Conductor Beta release:

- **Too Many Files:** 
Currently, all files for all modules can be viewed from the learner's environment, instead of only seeing the files appropriate to that module.

## Compatibility

As of the Beta Release, Conductor only supports the following browsers:

| Browser | Tested | Status |
|---|---|---|
| Chrome 81 |  Y | Works as expected.  |
| Firefox 76 | Y | Works as expected.  |
|  Microsoft Edge on Windows 10 81.0.416.77 |  Y |  Fails due to incompatible limitation with present strategy for passing credentials. |
| Safari 12 | Y | SSH can disconnect if browser left unattended too long. Max observed: 1-2 times per 2-3 hour session. Refreshing the browser is a workaround to reestablish ssh connectivity with the cluster. |