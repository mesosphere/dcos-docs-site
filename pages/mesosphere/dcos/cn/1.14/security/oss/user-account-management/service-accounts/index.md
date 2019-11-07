---
layout: layout.pug
navigationTitle: 服务账户
title: 服务账户管理
excerpt: 管理服务账户
渲染：胡须
型号：/mesosphere/dcos/1.14/data.yml
menuWeight: 30
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

# 添加服务账户

## 使用 IAM API

**前提条件：**
- [OpenSSL](https://www.openssl.org/)
- [DC/OS 认证令牌](/mesosphere/dcos/1.14/security/oss/authentication/authentication-token/) 作为 `TOKEN` 导出到环境中。

服务账户由用户 ID 和 RSA 私钥构成。

1. 要使用 DC/OS [身份和访问管理 (IAM) API](/mesosphere/dcos/1.14/security/oss/iam-api/) 来添加服务账户，请首先通过 OpenSSL 生成 RSA 私钥。

    ```bash
    openssl genpkey -algorithm RSA -out private-key.pem -pkeyopt rsa_keygen_bits:2048
    ```

1. 从私钥中提取相应的公钥。

    ```bash
    openssl rsa -pubout -in private-key.pem -out public-key.pem
    ```

1. 将公钥文件内容转换为带有转义换行符的字符串。

    ```bash
    export PUBLIC_KEY=$(sed ':a;N;$!ba;s/\n/\\n/g' public-key.pem)
    ```

1. 在以下命令中使用所需值替换 `<uid>`，然后执行命令：

    ```bash
    curl -i -X PUT http://<host-ip>/acs/api/v1/users/<uid> -d '{"public_key": "'"$PUBLIC_KEY"'"}' -H 'Content-Type: application/json' -H "Authorization: token=$TOKEN"
    ```

# 列出服务账户

## 使用 IAM API

**前提条件：**
- [DC/OS 认证令牌](/mesosphere/dcos/1.14/security/oss/authentication/authentication-token/) 作为 `TOKEN` 导出到环境中。

要使用 [身份和访问管理 (IAM) API](/mesosphere/dcos/1.14/security/oss/iam-api/) 来列出所有已配置服务账户，请执行以下命令：

```bash
curl -i -X GET "http://<host-ip>/acs/api/v1/users?type=service" -H 'Content-Type: application/json' -H "Authorization: token=$TOKEN"
```

# 更改服务账户公钥

## 使用 IAM API

**前提条件：**
- [DC/OS 认证令牌](/mesosphere/dcos/1.14/security/oss/authentication/authentication-token/) 作为 `TOKEN` 导出到环境中。

要使用 DC/OS [身份和访问管理 (IAM) API](/mesosphere/dcos/1.14/security/oss/iam-api/) 来更改服务账户的公钥，请在 `public-key.pem` 文件中提供一个新的公钥。然后，替换以下命令中的 `<uid>`，并执行命令：

```bash
curl -i -X PATCH http://<host-ip>/acs/api/v1/users/<uid> -d '{"public_key": "'"$(sed ':a;N;$!ba;s/\n/\\n/g' public-key.pem)"'"}' -H 'Content-Type: application/json' -H "Authorization: token=$TOKEN"
```

# 移除服务账户

## 使用 IAM API

**前提条件：**
- [DC/OS 认证令牌](/mesosphere/dcos/1.14/security/oss/authentication/authentication-token/) 作为 `TOKEN` 导出到环境中。

要使用 DC/OS [身份和访问管理 (IAM) API](/mesosphere/dcos/1.14/security/oss/iam-api/) 来移除本地用户账户，请用相应的值替换 `<uid>` 并执行以下命令：

```bash
curl -i -X DELETE http://<host-ip>/acs/api/v1/users/<uid> -H 'Content-Type: application/json' -H "Authorization: token=$TOKEN"
```
