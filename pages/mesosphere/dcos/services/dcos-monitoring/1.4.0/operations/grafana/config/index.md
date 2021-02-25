---
layout: layout.pug
navigationTitle: Grafana Custom Configuration
title: Grafana Custom Configuration
menuWeight: 10
excerpt: Grafana Custom Configuration
---

# Grafana Custom Configuration

<p class="message--warning"><strong>WARNING: </strong>It is recommended to not change default configuration.</p>

## Configuration

You can pass custom configuration file to Grafana by setting `grafana.config_files.custom`.

Create a custom configuration file (`grafana.ini`) like the following.

```ini
instance_name = test_grafana

```

```bash
dcos security secrets create --file grafana.ini dcos-monitoring/grafana-ini
```

Create a custom option file (`options.json`) like the following.

```json
{
  "grafana": {
    "config_files": {
      "custom": "dcos-monitoring/grafana-ini",
    }
  }
}
```

Read more about [Grafana Configuration](https://grafana.com/docs/grafana/v7.0/administration/configuration/)

## LDAP

By default LDAP is disabled.

You can configure LDAP Authentication by setting `grafana.config_files.ldap`.

Create a custom configuration file (`ldap.toml`) like the following.

```toml
[[servers]]
host = "127.0.0.1"
port = 389
use_ssl = false
start_tls = false
ssl_skip_verify = false
bind_dn = "cn=admin,dc=grafana,dc=org"
bind_password = 'grafana'
search_filter = "(cn=%s)"
search_base_dns = ["dc=grafana,dc=org"]

[servers.attributes]
name = "givenName"
surname = "sn"
username = "cn"
member_of = "memberOf"
email =  "email"
```

```bash
dcos security secrets create --file ldap.toml dcos-monitoring/ldap
```

Create a custom option file (`options.json`) like the following.

```json
{
  "grafana": {
    "config_files": {
      "ldap": "dcos-monitoring/ldap",
    }
  }
}
```

Read more about [Grafana LDAP configuration](https://grafana.com/docs/grafana/v7.0/auth/ldap/#ldap-authentication)
