---
layout: layout.pug
navigationTitle: Upgrade Konvoy CLI to version 1.6
title: Upgrade Konvoy CLI to version 1.6
menuWeight: 5
excerpt: Upgrade Konvoy image CLI version
beta: true
enterprise: false
---

## Terraform files

Konvoy CLI version 1.6 upgraded the internal Terraform version to 0.13.
This changes affect your own defined `extras/provisioner` Terraform files.
Before using the Konvoy CLI version 1.6 you must follow following migration instructions.

### What to do if I see an error

Don't think you are in trouble when Konvoy CLI will print an error related
to Terraform provision process. All operations that are default done by Konvoy
are not destructive in any way. The same counts for most of your own created
`extras/provisioner` Terraform files.

As long as you do not change the resource name which you have set, only in some
rare cases the arguments in the resource are triggering a recreation.

As always we **highly** recommend to run the Konvoy CLI with ```konvoy provision --plan-only```
first! With the output you can change your Terraform files accordingly, step by step,
in a safe way.

### Modified Konvoy Terraform file sync

The Konvoy Terraform file sync copies what you have in your `extras/provisioner` directory and
will be synced again out of the Konvoy used Docker Image, so that you can show a `diff` of
the updated files against your files. In this way you can check what you need to copy
over into the new file. Another option would be that you just grab your changes and put
them in appropriate `..._override.tf` files. In this way Terraform will take care of the
merging with the Konvoy files for you.

#### Sync command

```bash
# define the provider you use within Konvoy
PROVIDER="aws"
docker run --entrypoint="/bin/sh" -e PROVIDER=${PROVIDER} -v ${PWD}/extras/provisioner:/extras mesosphere/konvoy:v1.6.0 -c "for f in /extras/*.tf; do cp /opt/konvoy/providers/\${PROVIDER}/\$(basename \${f}) /extras/\$(basename \${f}).copy; cp /opt/konvoy/providers/\${PROVIDER}/\$(basename \${f}).gotmpl /extras/\$(basename \${f}).gotmpl.copy; done"
```

##### Override functionality

Here is an example of an override Terraform file, instead of keeping a copy of Konvoy
default `control_plane.tf`

```hcl
resource "aws_instance" "control_plane" {
  user_data = <<-EOF
              #cloud-config
              salt_grains:
                project: xyz
                centrify_zone: xyz/dev
                role: konvoy.controlplane
              EOF
```

The trick is that you keep the resource definition `resource "aws_instance" "control_plane"`
as it is. Just insert the arguments that are not configurable through Konvoy directly.
Name the file `extras/provisioner/control_plane_override.tf`.
Terraform will merge together the resources and the result will be the same as it would
be with a fully modified copy.

### Description of needed changes

The following short descriptions should help you to change your `extras/provisioner`
files to the Terraform 0.13 compatible syntax.

If you like instead you can go to [Terraform upgrade guide to 0.12][terraform-upgrade-to-0-12]
and follow the described steps there. After that you would also take a look here
[Terraform upgrade guide to 0.13][terraform-upgrade-to-0-13]. This is the official
order to follow the Terraform upgrade.

---

```hcl
xyz = "${xxx.yyyyyyyyyyy}"
```

becomes

```hcl
xyz = xxx.yyyyyyyyyyy
```

this change needs to be done only for direct variable or Terraform function calls.
This **must not** change for string concats like `xyz = "${xxx.yyyyyyyyyyy}-another-concated-strinng"`.

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
    ignore_changes = [tags, volume_tags, volume_tags.CSIVolumeName, volume_tags.Name]
  }
...
```

as the old syntax is not valid anymore and will produce an error message.

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
