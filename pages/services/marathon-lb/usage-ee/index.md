---
layout: layout.pug
title: Install and Customize on DC/OS Enterprise
menuWeight: 2
excerpt: Installing and customizing Marathon-LB on DC/OS Enterprise

enterprise: true
---

## About installing Marathon-LB

The installation procedure varies according to your [security mode](/1.10/installing/ent/custom/configuration/configuration-parameters/#security-enterprise). Refer to the section that corresponds to your security mode for step-by-step instructions.

- [`disabled` and `permissive` modes](#mlb-disabled-install)
- [`strict` mode](#mlb-strict-perm-install)

## <a name="mlb-disabled-install"></a>Installing in disabled and permissive modes

### Using the DC/OS CLI

**Prerequisites:**
- [DC/OS CLI installed](/1.10/cli/install/)
- Logged in via `dcos auth login` as a user with the [necessary permissions](/1.10/security/ent/perms-reference/).

If you do not want to change any of the default settings, you can install Marathon-LB with the following command:

```bash
dcos package install marathon-lb
```

To customize Marathon-LB, use the following command to determine its options.

```bash
dcos package describe --config marathon-lb
```

Create a new `config.json` file to override any one of the default settings and install Marathon-LB using the following command, where `config.json` contains your custom settings.

```bash
dcos package install --options=config.json marathon-lb
```

### Using the Catalog

To install Marathon-LB from the Catalog in `disabled` and `permissive` modes, log into the DC/OS web interface as a user with the [necessary permissions](/1.10/security/ent/perms-reference/).

1. Click the **Catalog** tab.
2. Locate the **marathon-lb** package.
3. Click **REVIEW & RUN**.
4. To optionally customize Marathon-LB, click **EDIT**, customize parameters, then click **REVIEW AND RUN**.
5. Click **RUN SERVICE**.

## <a name="mlb-strict-perm-install"></a>Installing in strict mode

**Prerequisites:**

- Marathon-LB requires a service account in `strict` [security mode](/1.10/installing/ent/custom/configuration/configuration-parameters/#security-enterprise). Only someone with the `superuser` permission can create the service account. Refer to [Provisioning Marathon-LB](/services/marathon-lb/mlb-auth/) for instructions.

- [DC/OS CLI installed](/1.10/cli/install/) and logged in via `dcos auth login` as a user with the [necessary permissions](/1.10/security/ent/perms-reference/).

The parameters shown in [Provisioning Marathon-LB](/services/marathon-lb/mlb-auth/) are required to install Marathon-LB. You may wish to modify other default values before installing the service. To view the configuration options and defaults of Marathon-LB, type the following command.

```bash
dcos package describe --config marathon-lb
```

Once you have the `config.json` file with the required and optional parameters, use the following command to install.

```bash
dcos package install --options=config.json marathon-lb
```

# Next steps

- [Tutorial - Deploying a Load Balanced App with Marathon-LB](/services/marathon-lb/marathon-lb-basic-tutorial/)
- [Tutorial - Using Marathon-LB for Internal and External Load Balancing](/services/marathon-lb/marathon-lb-advanced-tutorial/)
- See the advanced Marathon-LB [documentation](/services/marathon-lb/advanced/).

 [1]: /1.10/installing/
 [2]: /1.10/cli/install/
 [3]: /1.10/administering-clusters/managing-aws/
 [4]: /1.10/administering-clusters/sshcluster/
