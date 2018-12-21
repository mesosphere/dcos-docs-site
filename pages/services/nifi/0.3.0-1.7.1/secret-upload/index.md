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

[<img src="../service/showing_secret_value_in_secret_store.png" alt="value of secret id created in secret store" width="1000"/>](../service/showing_secret_value_in_secret_store.png)

_Figure 1. - secret value_

## Prerequisites
- [A secret with id as nifi/config-secret stored in the DC/OS Secret Store.](https://docs.mesosphere.com/1.12/security/ent/secrets/create-secrets/)


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
Or enable secrets through ui installation.

[<img src="../service/showing_nifi_installation_with_secret_enabled.png" alt="nifi installation with secrets enabled" width="1000"/>](../service/showing_nifi_installation_with_secret_enabled.png)

_Figure 2. - nifi installation with secrets enabled_

[<img src="../service/showing_secret_file_inside_node.png" alt="secret file inside node" width="1000"/>](../service/showing_secret_file_inside_node.png)

_Figure 3. - secret files in the nifi node_


[<img src="../service/showing_secret_value_in_nifi_node.png" alt="secret value in nifi node" width="1000"/>](../service/showing_secret_value_in_nifi_node.png)

_Figure 4. - secret value in nifi node_

### Access file in NiFi UI
To use any file in NiFi UI like the secret uploaded earlier in the above example can be accessed by using path of the file which will be `/mnt/mesos/sandbox/<file_name>` i.e., `/mnt/mesos/sandbox` is base path in addition to your file path.

[<img src="../service/showing_accessing_file_in_nifi_ui.png" alt="accessing secret file in nifi ui" width="1000"/>](../service/showing_accessing_file_in_nifi_ui.png)

_Figure 5. - accessing secret file in nifi ui_
