---
layout: layout.pug
navigationTitle: Licensing
title: Licensing
excerpt: excerpt goes here
menuWeight: 10
---

Licensing
Licenses table shows currently added licenses with name, status, start date, end date, cluster capacity, and secret name
Under the hood, a license consists of a License custom resource object that references a secret containing the actual license text
Clicking + Add License takes you to the license form where a license can be created by adding the license to the textarea
If there is an error submitting the license, the error banner contains directions on how to add the license directly through kubectl