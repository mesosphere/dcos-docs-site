---
layout: layout.pug
navigationTitle: Secret upload
title: Secret upload
menuWeight: 49
excerpt: DC/OS NiFi Service Secret upload
featureMaturity:
enterprise: false
---

# DC/OS Apache NiFi Secret upload

The DC/OS Apache NiFi service supports NiFi’s Secret upload. The service provides to upload secrets file in all nodes of NiFi inside any existing folder or by creating a new folder.

## Secret upload
To upload secret file in nifi node, create a secret with id as nifi/config-secret in the DC/OS Secret Store. The value of the secret should be written in shell scripting format as given below (like adding the aws credentials file) and then enable the secrets. 

```shell
cat > file.properties << EOF 
[default]
accessKey = <ACCESS_KEY_ID>
secretKey = <SECRET_KEY_ID>
EOF
```

[<img src="../service/secret_value.png" alt="value of secret id created in secret store" width="1000"/>](../service/secret_value.png)

_Figure 1. - secret value_

## Prerequisites
- [A secret with id as nifi/config-secret stored in the DC/OS Secret Store.](https://docs.mesosphere.com/1.12/security/ent/secrets/create-secrets/)

_Figure 2. - secret in the secret store_

### Install the Service
Install the DC/OS Apache NiFi service with the following attributes in addition to your own:

 ```shell
  {
  "service": {
    "name": "nifi"
  },
  "secrets": {
    "enable": true
  }
}
 ```

[<img src="../service/node_content.png" alt="files in the nifi node" width="1000"/>](../service/node_content.png)

_Figure 3. - files in the nifi node_


[<img src="../service/secret_content.png" alt="content of the secret in nifi node" width="1000"/>](../service/secret_content.png)

_Figure 4. - content of the secret_

### Access file in NiFi UI
To use any file in NiFi UI like the secret uploaded earlier in the above example can be accessed by using path of the file which will be /mnt/mesos/sandbox/<file_name> i.e., /mnt/mesos/sandbox is base path in addition to your file path.

