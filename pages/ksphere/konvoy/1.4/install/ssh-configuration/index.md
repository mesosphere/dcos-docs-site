---
layout: layout.pug
navigationTitle: Advanced SSH configurations
title: Advanced SSH configurations
menuWeight: 90
excerpt: Advanced SSH configurations for the Konvoy installer
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

For [on-premise install][install_onprem], there are a few SSH related options that users can customize in the [Ansible][ansible] [inventory file][ansible_inventory].

## `wait_for_connection`

This specifies the way that Ansible uses to check the connectivity to a node.

* `socket`: Use [`wait_for`][ansible_wait_for] to check socket level connectivity (default).
* `ssh`: Use [`wait_for_connection`][ansible_wait_for_connection] to check connectivity using SSH.

Note that `ssh` mode requires Python to be pre-installed on the target host.
But could be useful when SSH proxy is used.

```yaml
all:
  vars:
    version: "v1beta1"
    order: sorted
    wait_for_connection: ssh
```

## `ssh_common_args`

If specified, the extra arguments will be append to all SSH related operations.
This is useful when SSH proxy is used.

```yaml
all:
  vars:
    version: "v1beta1"
    order: sorted
    wait_for_connection: ssh
    ssh_common_args: "-o ProxyCommand=\"ssh -p 3023 %r@localhost -s proxy:%h:%p\""
```

[install_onprem]: ../install-onprem/
[ansible]: https://www.ansible.com
[ansible_inventory]: https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html
[ansible_wait_for]: https://docs.ansible.com/ansible/latest/modules/wait_for_module.html
