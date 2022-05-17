---
layout: layout.pug
navigationTitle: Upgrade Kubernetes and Addons with Konvoy v1.6
title: Upgrade Kubernetes and Addons with Konvoy v1.6
menuWeight: 5
excerpt: Terraform migration when upgrading the Kubernetes version and platform service addons with Konvoy v1.6
beta: false
enterprise: false
---

## Terraform files

<p class="message--note"><strong>NOTE: </strong>It is strongly recommended to run <code>konvoy provision --plan-only</code> before upgrading you cluster and fixing any syntax errors.</p>

Konvoy CLI version 1.6 upgraded the internal Terraform version to 0.13.
This change also impacts the Terraform files defined in  `extras/provisioner/`.
Before using the Konvoy CLI version 1.6 you may need to follow the migration instructions below.

### Modified Konvoy Terraform file sync

<p class="message--note"><strong>NOTE: </strong>This section only applies to the files in <code>extras/provisioner/</code> that DO NOT end with <code>..._override.tf</code>.</p>

In certain clusters you may have copied the full Terraform files from the Konvoy image into your working directory in `extras/provisioner/`.
With the new Terraform version, these files have most likely been changed in the Konvoy image.
If you need to continue using these files, you must first run the command below and then reapply your changes to the new files.
This command will add a `.copy` extension to all your files in `extras/provisioner/` and copy the files out of the Konvoy image for reference.

```bash
# define the provider you use within Konvoy
PROVIDER="aws"
docker run --entrypoint="/bin/sh" -e PROVIDER=${PROVIDER} -v ${PWD}/extras/provisioner:/extras mesosphere/konvoy:v1.6.3 -c "for f in /extras/*.tf; do cp /opt/konvoy/providers/\${PROVIDER}/\$(basename \${f}) /extras/\$(basename \${f}).copy; cp /opt/konvoy/providers/\${PROVIDER}/\$(basename \${f}).gotmpl /extras/\$(basename \${f}).gotmpl.copy; done"
```

### Description of needed changes

The following short descriptions should help you to change your `extras/provisioner/` files to the Terraform 0.13 compatible syntax.

See [Terraform upgrade guide to 0.12][terraform-upgrade-to-0-12] and [Terraform upgrade guide to 0.13][terraform-upgrade-to-0-13]<span class="x x-first x-last"> </span>for additional details.

---

```hcl
xyz = "${xxx.yyyyyyyyyyy}"
```

becomes

```hcl
xyz = xxx.yyyyyyyyyyy
```

this change needs to be done only for direct variable or Terraform function calls.
This **must not** change for string concatenations like `xyz = "${xxx.yyyyyyyyyyy}-another-concated-strinng"`.

---

```hcl
variable "xxx " {
  type        = "list"
  ...
}
```

becomes

```hcl
variable "xxx " {
  type        = list
  ...
}
```

as variable types no longer should be surrounded by quotes.

---

```hcl
...
  lifecycle {
    ignore_changes = ["tags"]
  }
...
```

becomes

```hcl
...
  lifecycle {
    ignore_changes = [tags]
  }
...
```

as quoted references are deprecated.

---

```hcl
...
  lifecycle {
    ignore_changes = ["tags.%", "volume_tags.%", "volume_tags.CSIVolumeName", "volume_tags.Name"]
  }
...
```

becomes

```hcl
...
  lifecycle {
    ignore_changes = [
      volume_tags,
    ]
  }
...
```

as the old syntax is not valid anymore and will produce an error message.
`volume_tags` are now ignored overall to be changed, as of a bug in Terraform AWS /
the AWS API presenting the data of volume tags.

---

When you have defined a `count` for a resource you need to make sure
when this resource is accessed somewhere else that you also iterate over
the `count` or define one exact index for it. So if a resource gets reused
it can look like

```hcl
aws_iam_role.node_role[count.index]
```

or

```hcl
aws_iam_role.node_role[0]
```

---

When you have an empty function call of `list()`, this is no longer valid
from Terraform 0.13 on. Now you would need to define it as `list("")`.

[terraform-upgrade-to-0-12]: https://www.terraform.io/upgrade-guides/0-12.html
[terraform-upgrade-to-0-13]: https://www.terraform.io/upgrade-guides/0-13.html

## Cert-manager Upgrade

As part of the 1.6 upgrade process, cert-manager is upgraded from `v0.10.1` to `v1.0.3`. This major upgrade introduces several breaking changes requiring the migration of cert-manager owned resources.

During the upgrade `Certificates`, `Issuers`, `ClusterIssuers`, and `CertificateRequests` resources are automatically converted to `v1` types and continue to function normally.

### Charts and Deployments

If you have installed any custom charts or deployed any applications relying on the EOL'ed `certmanager.k8s.io/v1alpha1` API, you must ensure these deployments have support for `cert-manager.io/v1alpha2`. If they do not, you must convert them before you can re-deploy your application.

#### Converting resources
Search for references to `certmanager.k8s.io`

For resources, change:

```yaml
apiVersion: certmanager.k8s.io/v1alpha1
```

to:

```yaml
apiVersion: cert-manager.io/v1alpha2
```

<p class="message--note"><strong>NOTE: </strong><code>cert-manager.io/v1alpha2</code> resources are converted to <code>cert-manager.io/v1</code> resources when applied to the api-server. If you want to convert them manually to <code>v1</code> resources directly, you must handle some schema changes. Refer to the <a href="https://cert-manager.io/docs/reference/api-docs/">API documentation</a> for information on everything needing conversion.</p>

#### Cert-manager Annotations

Some applications use annotations to use the cert-manager CA injector. For most of annotations, converting the group name to `cert-manager.io` suffices. Some exceptions are:

| Old Annotation | New Annotation |
-----------------|------------------
| certmanager.k8s.io/acme-http01-edit-in-place |acme.cert-manager.io/http01-edit-in-place |
| certmanager.k8s.io/acme-http01-ingress-class |acme.cert-manager.io/http01-ingress-class |
| certmanager.k8s.io/acme-challenge-type | DEPRECATED |
| certmanager.k8s.io/acme-dns01-provider | DEPRECATED |

A full list of annotation changes is found in the cert-manager [upgrade documentation](https://cert-manager.io/docs/installation/upgrading/upgrading-0.10-0.11/#additional-annotation-changes)
