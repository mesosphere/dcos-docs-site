---
layout: layout.pug
navigationTitle: Licensing
title: Licensing
excerpt:
menuWeight: 6
---

## Licensing

Kommander requires a valid license to continue use beyond adding a second cluster.

The License table shows currently added licenses with name, status, start date, end date, cluster capacity, and secret name.

![Licenses](/ksphere/kommander/img/Licenses-table.png)

Licenses

Under the hood, a license consists of a License custom resource object that references a secret containing the actual license text.

Clicking + Add License takes you to the license form where a license can be created by adding the license to the textarea.

![Licenses Form](/ksphere/kommander/img/Licenses-form.png)

Licenses Form

If there is an error submitting the license, the error banner contains directions on how to add the license directly through kubectl.

![Licenses Error](/ksphere/kommander/img/Licenses-error.png)

Licenses Error
