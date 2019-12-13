---
layout: layout.pug
navigationTitle: Secret Upload
title: Secret Upload
menuWeight: 50
excerpt: DC/OS NiFi service secret upload
featureMaturity:
enterprise: false
model: ../../data.yml
render: mustache
---

The DC/OS {{model.techName }} supports the uploading of Secrets. The service provides a process to upload a secrets file in all nodes of DC/OS {{model.techName }} inside any existing folder or by creating a new folder.

To upload a Secret file to a `{{ model.serviceName }}` node, create a secret with the ID  `{{ model.serviceName }}/config-secret` in the DC/OS Secret Store. The value of the secret should be written in shell scripting format as given below (like adding the AWS credentials file) and then check the enable checkbox inside secrets tab while installing {{model.techName }}. 

```shell
cat > file.properties << EOF 
[default]
accessKey = <ACCESS_KEY_ID>
secretKey = <SECRET_KEY_ID>
EOF
```

<img src="../img/showing_secret_value_in_secret_store.png" alt="value of secret id created in secret store" width="1000" border="2"/>

Figure 1. - Secret value shown in Secret Store

## Prerequisites
- A secret with ID of `{{ model.serviceName }}/config-secret` stored in the [DC/OS Secret Store.](/mesosphere/dcos/1.12/security/ent/secrets/create-secrets/)


### Install the Service
Install the DC/OS {{model.techName }} service with the following attributes in addition to your own:

 ```json
  {
  "service": {
    "name": "{{ model.serviceName }}"
  },
  "secrets": {
    "enable": true
  }
}
 ```
Or enable secrets while installing {{ model.serviceName }} via UI.

<img src="../img/showing_nifi_installation_with_secret_enabled.png" alt="{{ model.serviceName }} installation with secrets enabled" width="1000" border="2"/>

Figure 2. - DC/OS {{model.techName }} installation with secrets enabled


<img src="../img/showing_secret_file_inside_node.png" alt="secret file inside node" width="1000" border="2"/>


Figure 3. - Secret files in the {{ model.serviceName }} node


<img src="../img/showing_secret_value_in_nifi_node.png" alt="secret value in nifi node" width="1000" border="2"/>


Figure 4. - Secret value in {{ model.serviceName }} node

### Access file in DC/OS {{model.techName }} UI

You can access any file in the DC/OS {{model.techName }} UI, like the secret uploaded earlier in the above example. Use the base path `/mnt/mesos/sandbox` in addition to your file path:

```
/mnt/mesos/sandbox/<file_name>
```


<img src="../img/showing_accessing_file_in_nifi_ui.png" alt="accessing secret file in nifi UI" width="1000" border="2"/>

Figure 5. - Accessing a secret file in DC/OS {{model.techName }} UI
