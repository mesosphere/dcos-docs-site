---
layout: layout.pug
navigationTitle:  dcos security
title: dcos security
menuWeight: 13
excerpt: Managing the DC/OS Certificate Authority

enterprise: true
---
The `dcos security` command allows you to manage your DC/OS certificate authority credentials.

## dcos security cluster ca
Manage the DC/OS Certificate Authority, including signing certs, generating CSRs, and signing information retrieval.

```
Usage: dcos security cluster ca cacert [OPTIONS]

  Fetch the PEM-encoded signing CA certificate (either a root CA certificate
  or an intermediate CA certificate).

Options:
  -h, --help  Show this message and exit.
```

```
Usage: dcos security cluster ca newcert [OPTIONS]

  Create and sign a new certificate.

  Create a new certificate based only on the command line options provided.

Options:
  --cn TEXT                       Canonical Name.  [required]
  --name-c TEXT                   Country.
  --name-st TEXT                  State.
  --name-o TEXT                   Organization.
  --name-l TEXT                   Locality.
  --name-ou TEXT                  Organization unit.
  --key-algo [rsa|ecdsa]          Key algorithm.
  --key-size [256|384|521|2048|4096|8192]
                                  Key size.
  --host TEXT                     SAN host, may be specified multiple times.
                                  [required]
  -p, --profile TEXT              Signing profile to use.
  -j, --json                      Output data in JSON format.
  -h, --help                      Show this message and exit.
```

```
Usage: dcos security cluster ca newkey [OPTIONS]

  Create a new key and a new CSR.

Options:
  --cn TEXT           Canonical Name.  [required]
  --name-c TEXT       Country.
  --name-st TEXT      State.
  --name-o TEXT       Organization.
  --name-l TEXT       Locality.
  --name-ou TEXT      Organization unit.
  --key-algo TEXT     Key algorithm.
  --key-size INTEGER  Key size.
  --host TEXT         SAN host, may be specified multiple times.  [required]
  -j, --json          Output data in JSON format.
  -h, --help          Show this message and exit.
```

```
Usage: dcos security cluster ca profile [OPTIONS]

  Print information about a signing profile.

  If no profile name is specified or the given profile does not exist, the
  default profile information is returned.

Options:
  -p, --profile TEXT  Signing profile to fetch information about.
  -j, --json          Output data in JSON format.
  -h, --help          Show this message and exit.
```

```
Usage: dcos security cluster ca sign [OPTIONS]

  Sign a CSR.

Options:
  --csr FILENAME      Path to a CSR to sign.  [required]
  -p, --profile TEXT  Signing profile to use.
  -h, --help          Show this message and exit.
```

## dcos security cluster directory
Manage LDAP related settings.

```
Usage: dcos security cluster directory get_config [OPTIONS]

  Retrieve current LDAP configuration.

Options:
  -j, --json  Output data in JSON format.
  -h, --help  Show this message and exit.
```

```
Usage: dcos security cluster directory import_group [OPTIONS] GID

  Import an LDAP group.

  Attempt to import a group of users from the configured directory (LDAP)
  backend. See IAM documentation for details on group import.

Options:
  -h, --help  Show this message and exit.
```

```
Usage: dcos security cluster directory import_user [OPTIONS] UID

  Import an LDAP user.

  Attempt to import a user from the configured directory (LDAP) backend.

Options:
  -h, --help  Show this message and exit.
```

```
Usage: dcos security cluster directory test [OPTIONS] UID PASSWORD

  Test connection to the LDAP backend.

  Perform basic feature tests. Verify that the current directory (LDAP)
  configuration parameters allow for a successful connection to the directory
  backend. For instance, this endpoint simulates the procedure for
  authentication via LDAP, but provides more useful feedback upon failure than
  the actual login endpoint.

Options:
  -j, --json  Output data in JSON format.
  -h, --help  Show this message and exit.
```

## dcos security cluster oidc
Manage OpenID Connect settings.

```
Usage: dcos security cluster oidc add [OPTIONS] OIDC_ID

  Configure a new OIDC provider.

Options:
  -d, --description TEXT    Description of the new OIDC provider.  [required]
  -i, --issuer TEXT         Issuer of the new OIDC provider.  [required]
  -b, --base-url TEXT       Base URL of the new OIDC provider.  [required]
  -c, --client-secret TEXT  Client secret for the new OIDC provider.  [required]
  --client-id TEXT          Client ID for the new OIDC provider.  [required]
  -h, --help                Show this message and exit.
```

```
Usage: dcos security cluster oidc delete [OPTIONS] OIDC_ID

  Delete an OIDC provider configuration.

Options:
  -h, --help  Show this message and exit.
```

```
Usage: dcos security cluster oidc modify [OPTIONS] OIDC_ID

  Modify an existing OIDC provider configuration.

Options:
  -d, --description TEXT    Description for the OIDC provider.  [required]
  -i, --issuer TEXT         Issuer of the OIDC provider.  [required]
  -b, --base-url TEXT       Base URL of the OIDC provider.  [required]
  -c, --client-secret TEXT  Client secret for the OIDC provider.  [required]
  --client-id TEXT          Client ID of the new OIDC provider.  [required]
  -h, --help                Show this message and exit.
```

```
Usage: dcos security cluster oidc show [OPTIONS] [OIDC_ID]...

  Get an overview for the configured OIDC providers.

  Print detailed information about a given provider or an overview depending
  on whether a provider ID was specified or not.

  If multiple providers are specified, only the first ID is evaluated.

Options:
  -j, --json  Output data in JSON format.
  -h, --help  Show this message and exit.
```

## dcos security cluster saml
Manage SAML settings.

```
Usage: dcos security cluster saml add [OPTIONS] SAML_ID

  Configure a new SAML provider.

Options:
  -d, --description TEXT       A description of the SAML provider.  [required]
  -i, --idp-metadata FILENAME  File containing IDP metadata in XML format.
                               [required]
  -b, --sp-base-url TEXT       The base URL for the service provider.
                               [required]
  -h, --help                   Show this message and exit.
```

```
Usage: dcos security cluster saml delete [OPTIONS] SAML_ID

  Delete a SAML provider configuration.

Options:
  -h, --help  Show this message and exit.
```

```
Usage: dcos security cluster saml modify [OPTIONS] SAML_ID

  Modify an existing SAML provider configuration.

Options:
  -d, --description TEXT       A description of the SAML provider.  [required]
  -i, --idp-metadata FILENAME  File containing IDP metadata in XML format.
                               [required]
  -b, --sp-base-url TEXT       The base URL for the service provider.
                               [required]
  -h, --help                   Show this message and exit.
```

```
Usage: dcos security cluster saml show [OPTIONS] [SAML_ID]...

  Get an overview for the configured SAML providers.

  Print detailed information about a given provider or an overview depending
  on whether a provider ID was specified or not.

  If multiple providers are specified, only the first ID is evaluated.

Options:
  -j, --json  Output data in JSON format.
  -h, --help  Show this message and exit.
```

## dcos security cluster secret-store
Manage secret store settings.

```
Usage: dcos security cluster secret-store seal-status [OPTIONS] STORE_ID

  Return the seal status of the store.

Options:
  -j, --json  Output data in JSON format.
  -h, --help  Show this message and exit.
```

```
Usage: dcos security cluster secret-store show [OPTIONS] [STORE_ID]...

  Overview of the configured secrets stores.

  Print detailed information about secret store or an overview depending on
  whether the secrets store ID was specified or not.

  If multiple secrets stores are specified, only the first ID is evaluated.

Options:
  -j, --json  Output data in JSON format.
  -h, --help  Show this message and exit.
```

```
Usage: dcos security cluster secret-store status [OPTIONS] STORE_ID

  Print status information about a given backend.

Options:
  -j, --json  Output data in JSON format.
  -h, --help  Show this message and exit.
```

```
Usage: dcos security cluster secret-store unseal [OPTIONS] STORE_ID KEY

  Unseal a given store.

Options:
  -j, --json  Output data in JSON format.
  -h, --help  Show this message and exit.
```

## dcos security org
Account management commands.

```
Usage: dcos security org groups [OPTIONS] COMMAND [ARGS]...

  Groups and group membership manipulation.

Options:
  -h, --help  Show this message and exit.

Commands:
  add_user  Add user identified by UID to group GID.
  create    Create a group.
  del_user  Remove user identified by UID from group GID.
  delete    Remove a group.
  grant     Grant the group with the given GID permission...
  members   List members of a group.
  revoke    Revoke permission for the group with the...
  show      Print basic information about a group or...
```

```
Usage: dcos security org groups add_user [OPTIONS] GID UID

  Add user identified by UID to group GID.

Options:
  -h, --help  Show this message and exit.
```

```
Usage: dcos security org groups create [OPTIONS] GID

  Create a group.

Options:
  -d, --description TEXT
  -h, --help              Show this message and exit.
```

```
Usage: dcos security org groups del_user [OPTIONS] GID UID

  Remove user identified by UID from group GID.

Options:
  -h, --help  Show this message and exit.
```

```
Usage: dcos security org groups delete [OPTIONS] GID

  Remove a group.

Options:
  -h, --help  Show this message and exit.
```

```
Usage: dcos security org groups members [OPTIONS] GID

  List members of a group.

Options:
  -j, --json  Output data in JSON format.
  -h, --help  Show this message and exit.
```

```
Usage: dcos security org groups show [OPTIONS] [GIDS]...

  Print basic information about a group or groups.

Options:
  -j, --json  Output data in JSON format.
  -h, --help  Show this message and exit.
```

```
dcos security org groups grant [OPTIONS] GID RID ACTION

    Grant the group with the given GID permission to enact a given ACTION on the
    resource with the given RID.

Options:
    --description TEXT
        The description of the ACL with the given RID. If an ACL
        exists with the given RID then the description will not be
        overwritten. Default: "Created with the security CLI".
    -h, --help
        Show this message and exit.
```

```
Usage: security org groups revoke [OPTIONS] GID RID ACTION

  Revoke permission for the group with the given GID to enact a given ACTION
  on the resource with the given RID.

Options:
  -h, --help  Show this message and exit.
```

```
Usage: dcos security org service-accounts [OPTIONS] COMMAND [ARGS]...

  Service accounts manipulation.

Options:
  -h, --help  Show this message and exit.

Commands:
  create   Create service account identified by SID.
  delete   Delete service account identified by SID.
  keypair  Create public-private keypair for use with...
  show     Print details of a service account identified...
```

```
Usage: dcos security org service-accounts create [OPTIONS] SID

  Create service account identified by SID.

  '--public-key' and '--secret' options are mutually exclusive.

Options:
  -p, --public-key FILENAME  Path to public key to use, '-' reads from STDIN
  -s, --secret TEXT          Passphrase to use.
  -d, --description TEXT     Description of the newly created service account.
                             ID of the account is used by default.
  -h, --help                 Show this message and exit.
```

```
Usage: dcos security org service-accounts delete [OPTIONS] SID

  Delete service account identified by SID.

Options:
  -h, --help  Show this message and exit.
```

```
Usage: dcos security org service-accounts keypair [OPTIONS] PRIVATE_KEY PUBLIC_KEY

  Create public-private keypair for use with service accounts.

Options:
  -l, --key-length [2048|4096]  Length of the RSA key.
  -h, --help                    Show this message and exit.
```

```
Usage: dcos security org service-accounts show [OPTIONS] [SIDS]...

  Print details of a service account identified by SID.

Options:
  -j, --json  Output data in JSON format.
  -h, --help  Show this message and exit.
```

```
Usage: dcos security org users [OPTIONS] COMMAND [ARGS]...

  Users manipulation.

Options:
  -h, --help  Show this message and exit.

Commands:
  create  Create a new user.
  delete  Delete user identified by UID.
  grant   Grant the user with the given UID permission...
  revoke  Revoke permission for the user with the given...
  show    Print information about a user or users.
```

```
Usage: dcos security org users create [OPTIONS] UID

  Create a new user.

Options:
  -d, --description TEXT  Description.
  -p, --password TEXT     Password.
  -h, --help              Show this message and exit.
```

```
Usage: dcos security org users delete [OPTIONS] UID

  Delete user identified by UID.

Options:
  -h, --help  Show this message and exit.
```

```
Usage: dcos security org users show [OPTIONS] [UIDS]...

  Print information about a user or users.

Options:
  -j, --json  Output data in JSON format.
  -h, --help  Show this message and exit.
```

```
Usage: security org users grant [OPTIONS] UID RID ACTION

  Grant the user with the given UID permission to enact a given ACTION on the
  resource with the given RID.

Options:
  --description TEXT  The description of the ACL with the given RID. If an ACL
                      exists with the given RID then the description will not be
                      overwritten. Default: "Created with the security CLI".
  -h, --help          Show this message and exit.
```

```
Usage: security org users revoke [OPTIONS] UID RID ACTION

  Revoke permission for the user with the given UID to enact a given ACTION on
  the resource with the given RID.

Options:
  -h, --help  Show this message and exit.
```

## dcos security secrets

```
Usage: dcos security secrets create [OPTIONS] PATH

  Create a secret.

  Store a secret under the path PATH.

Options:
  -s, --store-id TEXT        Secrets backend to use.
  -v, --value TEXT           Value of the secret.
  -f, --file FILENAME        Treat contents of the file as value of the secret.
                             The contents are assumed to be text encoded via
                             UTF-8.
  -h, --help                 Show this message and exit.
```

```
Usage: dcos security secrets create-sa-secret [OPTIONS] SA_PRIVATE_KEY SA_UID
                                         SECRET_PATH

  Create a service account secret.

  Create a secret that can be used by services running on top of DC/OS to
  login to service account.

Options:
  -s, --store-id TEXT  Secrets backend to use.
  --strict             Use strict cluster configuration.
  -h, --help           Show this message and exit.
```

```
Usage: dcos security secrets delete [OPTIONS] PATH

  Delete a secret.

  Deletes a secret stored under the path PATH.

Options:
  -s, --store-id TEXT  Secrets backend to use.
  -h, --help           Show this message and exit.
```

```
Usage: dcos security secrets get [OPTIONS] PATH

  Get a secret from the store by its path.

  Get a secret stored under the path PATH.

Options:
  -s, --store-id TEXT  Secrets backend to use.
  -j, --json           Output data in JSON format.
  -h, --help           Show this message and exit.
```

```
Usage: dcos security secrets list [OPTIONS] PATH

  List secret keys in a given path.

  Lists all secrets stored under the path PATH.

Options:
  -s, --store-id TEXT  Secrets backend to use.
  -j, --json           Output data in JSON format.
  -h, --help           Show this message and exit.
```

```
Usage: dcos security secrets update [OPTIONS] PATH

  Update a secret.

  Update an existing secret stored under the path PATH.

Options:
  -s, --store-id TEXT        Secrets backend to use.
  -v, --value TEXT           Value of the secret.
  -f, --file FILENAME        Treat contents of the file as value of the secret.
                             The contents are assumed to be text encoded via
                             UTF-8.
  -h, --help                 Show this message and exit.
```
