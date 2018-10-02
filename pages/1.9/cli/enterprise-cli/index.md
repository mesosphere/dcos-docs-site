---
layout: layout.pug
title: DC/OS Enterprise CLI
menuWeight: 6
excerpt:

enterprise: true
---

The DC/OS Enterprise CLI is used to manage security features.

# <a name="ent-cli-install"></a>Installing the DC/OS Enterprise CLI

**Prerequisite:** The DC/OS CLI must already be [installed](/1.9/cli/install/).

**Tip:** The DC/OS Enterprise CLI must be installed from a terminal prompt. You cannot click on the package in the Universe to install it.

To install the DC/OS Enterprise CLI, issue the following command from a terminal prompt.

```bash
dcos package install dcos-enterprise-cli
```

**Note:** Do not use `sudo`.


# <a name="ent-cli-upgrade"></a>Upgrading the DC/OS Enterprise CLI

A reinstall of the DC/OS Enterprise CLI upgrades the package. 

```bash
dcos package install dcos-enterprise-cli
```


# <a name="ent-cli-uninstall"></a>Uninstalling the DC/OS Enterprise CLI
    
To uninstall the DC/OS Enterprise CLI, issue the following command.

```bash
dcos package uninstall dcos-enterprise-cli
```


# DC/OS Enterprise CLI command reference

**Warning:** The following options appear in the 1.9 Enterprise CLI help for the `dcos security secrets` subcommands, but are not supported:
- -a --author <author>
- -d --description <description>
- -l --label <label>

## dcos security cluster ca
Manage the DC/OS certificate authority, including signing certs, generating CSRs, and signing information retrieval.

```
dcos security cluster ca cacert [OPTIONS]
    Fetch CA certificate.
Options:
    -h, --help  Show this message and exit.
```    


```
dcos security cluster ca newcert [OPTIONS]
    Create and sign new certificates.
Options:
    --cn <name>                       
        Canonical Name.
    --name-c <country>                   
        Country.
    --name-st <state>                  
        State.
    --name-o <organization>                   
        Organization.
    --name-l <locality>                   
        Locality.
    --name-ou <organization-unit>                  
        Organization unit.
    --key-algo <rsa|ecdsa>          
        Key algorithm.
    --key-size <256|384|521|2048|4096|8192> 
        Key size.
    --host <host>                     
        SAN host, may be specified multiple times.
    -p, --profile <name>              
        Signing profile to use.
    -j, --json                      
        Output data in JSON.
    -h, --help                      
        Show this message and exit.
```    

```
dcos security cluster ca newkey [OPTIONS]
    Create new key and CSR.
Options:
    --cn <name>                       
        Canonical Name.
    --name-c <country>                   
        Country.
    --name-st <state>                  
        State.
    --name-o <organization>                   
        Organization.
    --name-l <locality>                   
        Locality.
    --name-ou <organization-unit>                  
        Organization unit.
    --key-algo <rsa|ecdsa>          
        Key algorithm.
    --key-size <256|384|521|2048|4096|8192> 
        Key size.
    --host <host>                     
        SAN host, may be specified multiple times.
    -p, --profile <name>              
        Signing profile to use.
    -j, --json                      
        Output data in JSON.
    -h, --help                      
        Show this message and exit.  
```

```
dcos security cluster ca profile [OPTIONS]
    Fetch signing profile information.
Options:
    -p, --profile <name>  
        Signing profile to use.
    -j, --json          
        Output data in JSON.
    -h, --help          
        Show this message and exit.  
```      

```
dcos security cluster ca sign [OPTIONS]
    Sign a CSR.
Options:
    --csr <filename>  
    -p, --profile <name>  
        Signing profile to use.
    -h, --help          
        Show this message and exit.  
```

## dcos security cluster directory
Manage LDAP related settings.

```
dcos security cluster directory get_config
    Retrieve current LDAP configuration.
Options:
    -j, --json          
        Output data in JSON.
    -h, --help          
        Show this message and exit.
```

```
dcos security cluster directory import_group
    Import an LDAP group. 
Options:
    -h, --help          
        Show this message and exit.  
```

```
dcos security cluster directory import_user
    Import an LDAP user.
Options:
    -h, --help          
        Show this message and exit.
```       

```
dcos security cluster directory test
    Test connection to the LDAP back-end. This performs basic feature tests which verify that the current directory (LDAP) configuration parameters allow for a successful connection to the directory back-end. 
Options:
    -j, --json  
        Output data in JSON
    -h, --help          
        Show this message and exit.  
```    

## dcos security cluster oidc
Manage OpenID Connect settings.

```
dcos security cluster oidc add [OPTIONS] <oidc-id>
    Configure a new OIDC provider.
Options:
  -d, --description <description>
    Description of OIDC provider.
  -i, --issuer <issuer>
    Description of issuer.
  -b, --base-url <base-url>
  -c, --client-secret <client-secret>
  --client-id <client-id>
  -h, --help                
    Show this message and exit.
```
```
dcos security cluster oidc delete [OPTIONS] <oidc-id>
    Delete a OIDC provider configuration.
Options:
  -h, --help  Show this message and exit.
```


```
dcos security cluster oidc modify [OPTIONS] <oidc-id>
    Update existing OIDC provider configuration.
Options:
  -d, --description <description>
  -i, --issuer <issuer>
  -b, --base-url <base-url>
  -c, --client-secret <client-secret>
  --client-id <client-id>
  -h, --help                
    Show this message and exit.
```      

```
dcos security cluster oidc show [OPTIONS] <oidc-id>
    Get an overview for the configured OIDC. 
Options:
    -j, --json  
        Output data in JSON
    -h, --help  
        Show this message and exit.
```   

## dcos security cluster saml
Manage SAML settings.

```
dcos security cluster saml add [OPTIONS] <saml-id>
    Configure a new SAML provider.
Options:
    -d, --description <description>
    -i, --idp-metadata <filename>  
        File containing IDP metadata in XML format.
    -b, --sp-base-url <base-url>
    -h, --help                   
        Show this message and exit.
```
```
dcos security cluster saml delete [OPTIONS] <saml-id>
    Delete a SAML provider configuration.
Options:
   -h, --help  
        Show this message and exit.    
```    
```    
dcos security cluster saml modify [OPTIONS] <saml-id>
    Update existing SAML provider configuration.
Options:
    -d, --description <description>
    -i, --idp-metadata <filename>  
        File containing IDP metadata in XML format.
    -b, --sp-base-url <base-url>
    -h, --help                   
        Show this message and exit.    
```
```    
dcos security cluster saml show [OPTIONS] <saml-id>
    Get an overview for the configured SAML
Options:
    -j, --json  
        Output data in JSON
    -h, --help  
        Show this message and exit.    
```    

## dcos security cluster secret-store
Manage secret store settings.

```
dcos security cluster secret-store seal-status [OPTIONS]<store-id>
    Return the seal status of the store.
Options:
    -j, --json  
        Output data in JSON
    -h, --help  
        Show this message and exit.     
```

```    
dcos security cluster secret-store show [OPTIONS]<store-id>
    Overview of the configured secrets stores.
Options:
    -j, --json  
        Output data in JSON
    -h, --help  
        Show this message and exit.       
```
```
dcos security cluster secret-store status [OPTIONS]<store-id>
    Status information about given backend.
Options:
    -j, --json  
        Output data in JSON
    -h, --help  
        Show this message and exit.   
```
```
dcos security cluster secret-store unseal [OPTIONS]<store-id><key>
    Unseal secret store.
Options:
    -j, --json  
        Output data in JSON
    -h, --help  
        Show this message and exit.   
```        
        
## dcos security org   
Account management commands.

```    
dcos security org groups
    Manage groups and group membership.
Options:
    -h, --help  
        Show this message and exit.
```        

```
dcos security org groups add_user [OPTIONS] <GID> <UID>
    Add user.
Options:
    -h, --help  
        Show this message and exit.    
```
```    
dcos security org groups create [OPTIONS] <GID>
    Create group.
Options:
    -d, --description <description>
    -h, --help              
        Show this message and exit.
```

```        
dcos security org groups del_user [OPTIONS] <GID> <UID>
    Remove user.
Options:
    -h, --help  
        Show this message and exit.
```
            
```            
dcos security org groups delete [OPTIONS] <GID>
    Remove group.
Options:
    -h, --help  
        Show this message and exit.
```
            
```            
dcos security org groups members [OPTIONS] <GID>
    Show group members.
Options:
    -j, --json  
        Output data in JSON
    -h, --help  
        Show this message and exit. 
```            
            
```
dcos security org groups show [OPTIONS] <GID>
    Show basic information about groups.
Options:
    -j, --json  
        Output data in JSON
    -h, --help  
        Show this message and exit. 
```

```
dcos security org service-accounts  
    Manage service accounts.
Options:
    -h, --help  
        Show this message and exit.
```
            
```            
dcos security org service-accounts create [OPTIONS] <SID>
    Create service account.
Options:
    -p, --public-key <filename>  
        Path to public key to use, '-' reads from STDIN
    -s, --secret <passphrase> 
        Passphrase to use.
    -d, --description <description>     
        Description of the newly created service account. ID of the account is used by default.
    -h, --help                 
        Show this message and exit.
```

```      
dcos security org service-accounts delete [OPTIONS] <SID>
    Delete service account.
Options:
    -h, --help  
        Show this message and exit.
```

```
dcos security org service-accounts keypair [OPTIONS] <SID>
    Create public-private key pair. 
Options:
    -l, --key-length <2048|4096>  
        Length of the RSA key.
    -h, --help                    
        Show this message and exit.
```
      
```      
dcos security org service-accounts show [OPTIONS] <SID>
    Print service account details.
Options:
    -j, --json  
        Output data in JSON
    -h, --help  
        Show this message and exit. 
```

```            
dcos security org users
    Manage users.
Options:
    -h, --help  
        Show this message and exit.
```

```
dcos security org users create [OPTIONS] <UID>
    Create a new user.
Options:
    -d, --description <description>
    -p, --password <password>
    -h, --help
        Show this message and exit.    
```

```
dcos security org users delete [OPTIONS] <UID>
    Delete user identified by UID.
Options:
    -h, --help  
        Show this message and exit.
```            

```
dcos security org users show [OPTIONS] <UID>
    Show user information.
Options:
    -j, --json  
        Output data in JSON
    -h, --help  
        Show this message and exit.
```            
    
## dcos security secrets    

```
dcos security secrets create [OPTIONS] <path>        
    Create a secret.
Options:
    -s, --store-id <store-id>        
        Secrets backend to use.
    -v, --value <value>
        Value of the secret.
    -f, --file <filename>  
        Use file as value of the secret.
    -h, --help         
        Show this message and exit.
```

```
dcos security secrets create-sa-secret [OPTIONS] <private-key> <UID> <path>
    Create a service account secret.
Options:
    -s, --store-id <store-id>  
        Secrets backend to use
    -h, --help           
        Show this message and exit. 
    --strict
        Uses HTTPS in the login path
```

```
dcos security secrets delete [OPTIONS] <path>           
    Delete a secret.
Options:
    -s, --store-id <store-id>  
        Secrets backend to use.
    -h, --help           
        Show this message and exit.
```

```
dcos security secrets get [OPTIONS] <PATH>
    Get a secret from the store by its path.
Options:
    -s, --store-id <store-id>  
        Secrets backend to use
    -j, --json           
        Output data in JSON
    -h, --help           
        Show this message and exit.
```
  
```
dcos security secrets list [OPTIONS] <path>  
    List secret keys in a given path.
Options:
    -s, --store-id <store-id>  
        Secrets backend to use
    -j, --json           
        Output data in JSON
    -h, --help           
        Show this message and exit.
```

```
dcos security secrets update [OPTIONS] <path>
    Update a secret.
Options:
    -s, --store-id <store-id>        
        Secrets backend to use
    -v, --value <value>           
        Value of the secret
    -f, --file <filename>  
        Use the file as value of the secret.
    -h, --help                 
        Show this message and exit.   
```
    
